// ============================================================
// الحجوزات: إنشاء حجز + عرض حجوزات المستخدم + إلغاء
// ============================================================

import { Router } from 'express'
import { pool } from './db.js'
import { requireAuth } from './auth.js'

export const bookingsRouter = Router()

// يغلّف المعالجات غير المتزامنة — أي خطأ يوصل لمعالج الأخطاء بدل ما يطيّح السيرفر
const h = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

// كل المسارات هنا تحتاج تسجيل دخول
bookingsRouter.use(requireAuth)

function mapBooking(row) {
  return {
    id: row.id,
    userId: row.user_id,
    sessionType: row.session_type,
    date: row.date instanceof Date ? row.date.toISOString().split('T')[0] : row.date,
    time: row.time,
    notes: row.notes,
    status: row.status,
    createdAt: row.created_at,
  }
}

// حجوزاتي: GET /api/bookings/mine
bookingsRouter.get('/mine', h(async (req, res) => {
  const result = await pool.query(
    'SELECT * FROM bookings WHERE user_id = $1 ORDER BY created_at DESC',
    [req.user.id],
  )
  res.json({ bookings: result.rows.map(mapBooking) })
}))

// إنشاء حجز: POST /api/bookings
bookingsRouter.post('/', h(async (req, res) => {
  const { sessionType, date, time, notes } = req.body ?? {}

  if (!sessionType || typeof sessionType !== 'string' || sessionType.length > 120) {
    return res.status(400).json({ message: 'اختر نوع الجلسة' })
  }
  if (!time || typeof time !== 'string' || time.length > 50) {
    return res.status(400).json({ message: 'اختر وقت الجلسة' })
  }

  // تحقق من التاريخ: صيغة صحيحة + مو في الماضي
  const bookingDate = new Date(`${date}T00:00:00`)
  if (!date || Number.isNaN(bookingDate.getTime())) {
    return res.status(400).json({ message: 'اختر تاريخًا صحيحًا' })
  }
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  if (bookingDate < today) {
    return res.status(400).json({ message: 'ما تقدر تحجز بتاريخ فات — اختر اليوم أو بعده' })
  }

  const result = await pool.query(
    `INSERT INTO bookings (user_id, session_type, date, time, notes)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [req.user.id, sessionType, date, time, notes ? String(notes).slice(0, 500) : null],
  )
  res.status(201).json({ booking: mapBooking(result.rows[0]) })
}))

// إلغاء حجز: POST /api/bookings/:id/cancel
bookingsRouter.post('/:id/cancel', h(async (req, res) => {
  const id = Number(req.params.id)
  if (!Number.isInteger(id)) {
    return res.status(400).json({ message: 'رقم الحجز غير صحيح' })
  }

  // يلغي فقط إذا الحجز له وحالته تسمح
  const result = await pool.query(
    `UPDATE bookings SET status = 'cancelled'
     WHERE id = $1 AND user_id = $2 AND status IN ('pending', 'confirmed')
     RETURNING *`,
    [id, req.user.id],
  )

  if (result.rows.length === 0) {
    return res.status(404).json({ message: 'الحجز غير موجود أو ما يمكن إلغاؤه' })
  }
  res.json({ booking: mapBooking(result.rows[0]) })
}))
