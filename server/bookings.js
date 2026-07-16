// ============================================================
// المصادقة: تسجيل / دخول / خروج / معرفة المستخدم الحالي
// ============================================================
// - كلمات المرور تتشفّر بـ bcrypt وما تنحفظ أبدًا كنص عادي
// - الجلسة تنحفظ في كوكي httpOnly (الجافاسكربت ما يقدر يوصله — حماية من XSS)

import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { pool } from './db.js'

export const authRouter = Router()

// يغلّف المعالجات غير المتزامنة — أي خطأ يوصل لمعالج الأخطاء بدل ما يطيّح السيرفر
const h = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me-in-production'
const COOKIE_NAME = 'taafy_token'
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000 // أسبوع

if (!process.env.JWT_SECRET) {
  console.warn('[auth] تنبيه: JWT_SECRET غير معيّن — عيّنه في متغيرات البيئة قبل النشر!')
}

function signToken(user) {
  return jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' })
}

function setAuthCookie(res, user) {
  res.cookie(COOKIE_NAME, signToken(user), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // HTTPS فقط في الإنتاج
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE,
  })
}

function publicUser(u) {
  return { id: u.id, name: u.name, email: u.email, role: u.role, createdAt: u.created_at }
}

// ---------- وسائط الحماية (تُستخدم في باقي الملفات) ----------

// يقرأ الكوكي ويتحقق منه ويضيف req.user إذا كان صالحًا
export function attachUser(req, _res, next) {
  const token = req.cookies?.[COOKIE_NAME]
  if (token) {
    try {
      req.user = jwt.verify(token, JWT_SECRET)
    } catch {
      // توكن منتهي أو معدّل — نتجاهله ويكون زائر
    }
  }
  next()
}

// يمنع أي طلب بدون تسجيل دخول
export function requireAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ message: 'سجّل دخولك أولًا' })
  }
  next()
}

// يمنع أي طلب من غير الأدمن
export function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'هذه الصفحة للأدمن فقط' })
  }
  next()
}

// ---------- المسارات ----------

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// إنشاء حساب: POST /api/auth/register
authRouter.post('/register', h(async (req, res) => {
  const { name, email, password } = req.body ?? {}

  if (!name || String(name).trim().length < 2) {
    return res.status(400).json({ message: 'أدخل اسمك الكامل' })
  }
  if (!email || !EMAIL_RE.test(String(email))) {
    return res.status(400).json({ message: 'أدخل بريدًا إلكترونيًا صحيحًا' })
  }
  if (!password || String(password).length < 6) {
    return res.status(400).json({ message: 'كلمة المرور لازم تكون ٦ أحرف على الأقل' })
  }

  const cleanEmail = String(email).trim().toLowerCase()
  const hash = await bcrypt.hash(String(password), 10)

  try {
    const result = await pool.query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING *',
      [String(name).trim(), cleanEmail, hash],
    )
    const user = result.rows[0]
    setAuthCookie(res, user)
    res.status(201).json({ user: publicUser(user) })
  } catch (err) {
    if (err.code === '23505') {
      // البريد مسجّل من قبل (unique violation)
      return res.status(409).json({ message: 'هذا البريد مسجّل من قبل — جرّب تسجيل الدخول' })
    }
    throw err
  }
}))

// تسجيل الدخول: POST /api/auth/login
authRouter.post('/login', h(async (req, res) => {
  const { email, password } = req.body ?? {}
  if (!email || !password) {
    return res.status(400).json({ message: 'أدخل البريد وكلمة المرور' })
  }

  const result = await pool.query('SELECT * FROM users WHERE email = $1', [
    String(email).trim().toLowerCase(),
  ])
  const user = result.rows[0]

  // رسالة واحدة للحالتين عشان ما نكشف هل البريد مسجّل أو لا
  if (!user || !(await bcrypt.compare(String(password), user.password_hash))) {
    return res.status(401).json({ message: 'البريد أو كلمة المرور غير صحيحة' })
  }

  setAuthCookie(res, user)
  res.json({ user: publicUser(user) })
}))

// تسجيل الخروج: POST /api/auth/logout
authRouter.post('/logout', (_req, res) => {
  res.clearCookie(COOKIE_NAME)
  res.json({ ok: true })
})

// المستخدم الحالي: GET /api/auth/me
authRouter.get('/me', h(async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'غير مسجّل' })
  }
  const result = await pool.query('SELECT * FROM users WHERE id = $1', [req.user.id])
  const user = result.rows[0]
  if (!user) {
    return res.status(401).json({ message: 'غير مسجّل' })
  }
  res.json({ user: publicUser(user) })
}))
