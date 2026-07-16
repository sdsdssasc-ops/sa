// ============================================================
// الاتصال بقاعدة البيانات PostgreSQL + إنشاء الجداول تلقائيًا
// ============================================================
// يقرأ رابط القاعدة من متغير البيئة DATABASE_URL
// (Render يعطيك إياه جاهز، وتفاصيله في الدليل)

import pg from 'pg'
import bcrypt from 'bcryptjs'

const { Pool } = pg

const connectionString = process.env.DATABASE_URL || ''

// القواعد السحابية (Render / Neon) تحتاج SSL، والمحلية (localhost) ما تحتاج
const isLocal = /localhost|127\.0\.0\.1/.test(connectionString)
const ssl = process.env.DB_SSL
  ? process.env.DB_SSL === 'true'
    ? { rejectUnauthorized: false }
    : false
  : isLocal
    ? false
    : { rejectUnauthorized: false }

export const pool = new Pool({
  connectionString,
  ssl,
  max: Number(process.env.PG_POOL_MAX || 10), // أقصى عدد اتصالات متزامنة
})

// مهم: نخلي عمود DATE يرجع كنص 'YYYY-MM-DD' بدل كائن Date
// (التحويل التلقائي يسبب انزياح التاريخ يوم كامل حسب المنطقة الزمنية للسيرفر)
pg.types.setTypeParser(1082, (value) => value)

// إنشاء الجداول إذا ما كانت موجودة + حساب الأدمن الافتراضي
export async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id            SERIAL PRIMARY KEY,
      name          TEXT NOT NULL,
      email         TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role          TEXT NOT NULL DEFAULT 'user',
      created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `)

  await pool.query(`
    CREATE TABLE IF NOT EXISTS bookings (
      id           SERIAL PRIMARY KEY,
      user_id      INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      session_type TEXT NOT NULL,
      date         DATE NOT NULL,
      time         TEXT NOT NULL,
      notes        TEXT,
      status       TEXT NOT NULL DEFAULT 'pending',
      created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `)

  // حساب الأدمن: يتنشأ من متغيرات البيئة ADMIN_EMAIL و ADMIN_PASSWORD
  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@taafy.local').toLowerCase()
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123456'
  const hash = await bcrypt.hash(adminPassword, 10)

  const existing = await pool.query('SELECT id, role FROM users WHERE email = $1', [adminEmail])
  if (existing.rows.length === 0) {
    await pool.query(
      'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4)',
      ['مدير الموقع', adminEmail, hash, 'admin'],
    )
    console.log(`[db] تم إنشاء حساب الأدمن: ${adminEmail}`)
  } else if (process.env.ADMIN_PASSWORD) {
    // كلمة المرور معيّنة في المتغيرات → نحدّثها عند كل إقلاع
    // (تقدر تغيّرها من لوحة Render ← Environment متى ما بغيت)
    await pool.query('UPDATE users SET role = $1, password_hash = $2 WHERE id = $3', [
      'admin',
      hash,
      existing.rows[0].id,
    ])
  } else if (existing.rows[0].role !== 'admin') {
    await pool.query('UPDATE users SET role = $1 WHERE id = $2', ['admin', existing.rows[0].id])
    console.log(`[db] تم ترقية ${adminEmail} إلى أدمن`)
  }

  if (!process.env.ADMIN_PASSWORD) {
    console.warn('[db] تنبيه: الأدمن يعمل بكلمة مرور افتراضية — عيّن ADMIN_PASSWORD في متغيرات البيئة!')
  }
}
