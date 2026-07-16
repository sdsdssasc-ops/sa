// ============================================================
// مسارات الأدمن: إحصائيات + كل الحجوزات + تغيير الحالة + المستخدمون
// ============================================================

import { Router } from 'express'
import { pool } from './db.js'
import { requireAdmin } from './auth.js'

export const adminRouter = Router()

// يغلّف المعالجات غير المتزامنة — أي خطأ يوصل لمعالج الأخطاء بدل ما يطيّح السيرفر
const h = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

// كل المسارات هنا للأدمن فقط
adminRouter.use(requireAdmin)

const ALLOWED_STATUSES = ['pending', 'confirmed', 'completed', 'cancelled']

// إحصائيات سريعة: GET /api/admin/stats
adminRouter.get('/stats', h(async (_req, res) => {
  const users = await pool.query('SELECT COUNT(*)::int AS c FROM users')
  const bookings = await pool.query('SELECT COUNT(*)::int AS c FROM bookings')
  const pending = await pool.query("SELECT COUNT(*)::int AS c FROM bookings WHERE status = 'pending'")
  const today = await pool.query('SELECT COUNT(*)::int AS c FROM bookings WHERE date = CURRENT_DATE')
  res.json({
    stats: {
      totalUsers: users.rows[0].c,
      totalBookings: bookings.rows[0].c,
      pendingBookings: pending.rows[0].c,
      todayBookings: today.rows[0].c,
    },
  })
}))

// كل الحجوزات مع بيانات صاحبها: GET /api/admin/bookings
adminRouter.get('/bookings', h(async (_req, res) => {
  const result = await pool.query(
    `SELECT b.*, u.name AS user_name, u.email AS user_email
     FROM bookings b JOIN users u ON u.id = b.user_id
     ORDER BY b.created_at DESC`,
  )
  res.json({
    bookings: result.rows.map((row) => ({
      id: row.id,
      userId: row.user_id,
      sessionType: row.session_type,
      date: row.date instanceof Date ? row.date.toISOString().split('T')[0] : row.date,
      time: row.time,
      notes: row.notes,
      status: row.status,
      createdAt: row.created_at,
      userName: row.user_name,
      userEmail: row.user_email,
    })),
  })
}))

// تغيير حالة حجز: PATCH /api/admin/bookings/:id
adminRouter.patch('/bookings/:id', h(async (req, res) => {
  const id = Number(req.params.id)
  const { status } = req.body ?? {}

  if (!Number.isInteger(id) || !ALLOWED_STATUSES.includes(status)) {
    return res.status(400).json({ message: 'بيانات غير صحيحة' })
  }

  const result = await pool.query(
    'UPDATE bookings SET status = $1 WHERE id = $2 RETURNING id',
    [status, id],
  )
  if (result.rows.length === 0) {
    return res.status(404).json({ message: 'الحجز غير موجود' })
  }
  res.json({ ok: true })
}))

// كل المستخدمين: GET /api/admin/users
adminRouter.get('/users', h(async (_req, res) => {
  const result = await pool.query(
    'SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC',
  )
  res.json({
    users: result.rows.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      createdAt: u.created_at,
    })),
  })
}))
