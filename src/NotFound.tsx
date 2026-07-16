// لوحة المستخدم — حجز جلسة جديدة + عرض حجوزاتي وإلغاؤها

import { useCallback, useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Navigate } from 'react-router'
import { CalendarDays, Clock, Loader2, PlusCircle, XCircle, Inbox } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import StatusBadge from '@/components/StatusBadge'
import { useAuth } from '@/hooks/useAuth'
import { api } from '@/lib/api'
import type { Booking } from '@/types'
import { sessionTypes, timeSlots } from '@/config'

export default function Dashboard() {
  const { user, loading } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loadingList, setLoadingList] = useState(true)

  // حقول نموذج الحجز
  const [sessionType, setSessionType] = useState(sessionTypes[0].id)
  const [date, setDate] = useState('')
  const [time, setTime] = useState(timeSlots[0])
  const [notes, setNotes] = useState('')
  const [formError, setFormError] = useState('')
  const [formSuccess, setFormSuccess] = useState('')
  const [busy, setBusy] = useState(false)

  const loadBookings = useCallback(async () => {
    try {
      const data = await api<{ bookings: Booking[] }>('/bookings/mine')
      setBookings(data.bookings)
    } catch {
      // تجاهل — تظهر القائمة فاضية
    } finally {
      setLoadingList(false)
    }
  }, [])

  useEffect(() => {
    if (user) loadBookings()
  }, [user, loadBookings])

  async function handleBook(e: FormEvent) {
    e.preventDefault()
    setFormError('')
    setFormSuccess('')

    if (!date) {
      setFormError('اختر تاريخ الجلسة')
      return
    }

    setBusy(true)
    try {
      await api('/bookings', {
        method: 'POST',
        body: { sessionType, date, time, notes },
      })
      setFormSuccess('تم إرسال طلب الحجز بنجاح! بنراجعه ونؤكده لك قريبًا.')
      setDate('')
      setNotes('')
      loadBookings()
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'حدث خطأ غير متوقع')
    } finally {
      setBusy(false)
    }
  }

  async function handleCancel(id: number) {
    if (!confirm('متأكد أنك تبي تلغي هالحجز؟')) return
    try {
      await api(`/bookings/${id}/cancel`, { method: 'POST' })
      loadBookings()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'حدث خطأ غير متوقع')
    }
  }

  // أثناء التحقق من الجلسة
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    )
  }
  // غير مسجّل → صفحة الدخول
  if (!user) return <Navigate to="/login" replace />

  // أقل تاريخ مسموح = اليوم
  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="min-h-screen bg-secondary/30">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-3xl font-extrabold">أهلًا {user.name}</h1>
        <p className="mt-2 text-muted-foreground">هنا تحجز جلساتك وتتابع حالتها</p>

        <div className="mt-8 grid gap-8 lg:grid-cols-5">
          {/* ===== نموذج حجز جديد ===== */}
          <Card className="border-0 shadow-lg shadow-primary/5 lg:col-span-2">
            <CardContent className="p-7">
              <h2 className="flex items-center gap-2 text-xl font-extrabold">
                <PlusCircle className="h-5 w-5 text-primary" />
                احجز جلسة جديدة
              </h2>

              <form onSubmit={handleBook} className="mt-6 space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="type">نوع الجلسة</Label>
                  <select
                    id="type"
                    value={sessionType}
                    onChange={(e) => setSessionType(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {sessionTypes.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} — {s.duration} ({s.price})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">التاريخ</Label>
                  <Input
                    id="date"
                    type="date"
                    min={today}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">الوقت</Label>
                  <select
                    id="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {timeSlots.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">ملاحظات (اختياري)</Label>
                  <Textarea
                    id="notes"
                    placeholder="أي شي تحب نعرفه قبل الجلسة…"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                  />
                </div>

                {formError && (
                  <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
                    {formError}
                  </p>
                )}
                {formSuccess && (
                  <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                    {formSuccess}
                  </p>
                )}

                <Button type="submit" className="w-full" size="lg" disabled={busy}>
                  {busy && <Loader2 className="h-4 w-4 animate-spin" />}
                  إرسال طلب الحجز
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* ===== حجوزاتي ===== */}
          <div className="lg:col-span-3">
            <h2 className="text-xl font-extrabold">حجوزاتي</h2>

            {loadingList ? (
              <div className="mt-10 flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : bookings.length === 0 ? (
              <div className="mt-6 flex flex-col items-center rounded-3xl border border-dashed bg-card p-14 text-center">
                <Inbox className="h-12 w-12 text-muted-foreground/50" />
                <p className="mt-4 font-bold text-foreground/70">لا عندك حجوزات لحد الآن</p>
                <p className="mt-1 text-sm text-muted-foreground">احجز أول جلسة من النموذج اللي على اليسار</p>
              </div>
            ) : (
              <div className="mt-5 space-y-4">
                {bookings.map((b) => (
                  <Card key={b.id} className="border-0 shadow-md shadow-primary/5">
                    <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="font-extrabold">{b.sessionType}</h3>
                          <StatusBadge status={b.status} />
                        </div>
                        <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <CalendarDays className="h-4 w-4 text-primary" />
                            {b.date}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="h-4 w-4 text-primary" />
                            {b.time}
                          </span>
                        </div>
                        {b.notes && <p className="mt-2 text-sm text-muted-foreground">ملاحظاتك: {b.notes}</p>}
                      </div>

                      {(b.status === 'pending' || b.status === 'confirmed') && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCancel(b.id)}
                          className="gap-2 self-start text-destructive hover:bg-destructive/10 hover:text-destructive sm:self-center"
                        >
                          <XCircle className="h-4 w-4" />
                          إلغاء
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
