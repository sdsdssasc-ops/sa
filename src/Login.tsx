// لوحة تحكم الأدمن — إحصائيات + إدارة الحجوزات + قائمة المستخدمين

import { useCallback, useEffect, useState } from 'react'
import { Navigate } from 'react-router'
import {
  Users,
  CalendarCheck,
  Hourglass,
  CalendarDays,
  Loader2,
  CheckCircle2,
  XCircle,
  Flag,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import StatusBadge from '@/components/StatusBadge'
import { useAuth } from '@/hooks/useAuth'
import { api } from '@/lib/api'
import type { Booking, User, BookingStatus } from '@/types'

interface Stats {
  totalUsers: number
  totalBookings: number
  pendingBookings: number
  todayBookings: number
}

export default function Admin() {
  const { user, loading } = useAuth()
  const [stats, setStats] = useState<Stats | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [tab, setTab] = useState<'bookings' | 'users'>('bookings')
  const [loadingData, setLoadingData] = useState(true)

  const load = useCallback(async () => {
    try {
      const [s, b, u] = await Promise.all([
        api<{ stats: Stats }>('/admin/stats'),
        api<{ bookings: Booking[] }>('/admin/bookings'),
        api<{ users: User[] }>('/admin/users'),
      ])
      setStats(s.stats)
      setBookings(b.bookings)
      setUsers(u.users)
    } catch {
      // تجاهل
    } finally {
      setLoadingData(false)
    }
  }, [])

  useEffect(() => {
    if (user?.role === 'admin') load()
  }, [user, load])

  async function setStatus(id: number, status: BookingStatus) {
    try {
      await api(`/admin/bookings/${id}`, { method: 'PATCH', body: { status } })
      load()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'حدث خطأ غير متوقع')
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    )
  }
  // غير مسجّل → الدخول. مسجّل بس مو أدمن → لوحته العادية
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'admin') return <Navigate to="/dashboard" replace />

  const statCards = stats
    ? [
        { icon: Users, label: 'المستخدمون', value: stats.totalUsers, color: 'bg-sky-100 text-sky-700' },
        { icon: CalendarCheck, label: 'إجمالي الحجوزات', value: stats.totalBookings, color: 'bg-emerald-100 text-emerald-700' },
        { icon: Hourglass, label: 'بانتظار التأكيد', value: stats.pendingBookings, color: 'bg-amber-100 text-amber-700' },
        { icon: CalendarDays, label: 'حجوزات اليوم', value: stats.todayBookings, color: 'bg-violet-100 text-violet-700' },
      ]
    : []

  return (
    <div className="min-h-screen bg-secondary/30">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-3xl font-extrabold">لوحة تحكم الأدمن</h1>
        <p className="mt-2 text-muted-foreground">إدارة الحجوزات والمستخدمين من مكان واحد</p>

        {loadingData ? (
          <div className="mt-16 flex justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* الإحصائيات */}
            <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {statCards.map((s) => (
                <Card key={s.label} className="border-0 shadow-md shadow-primary/5">
                  <CardContent className="flex items-center gap-4 p-5">
                    <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${s.color}`}>
                      <s.icon className="h-6 w-6" />
                    </span>
                    <div>
                      <div className="text-2xl font-black">{s.value}</div>
                      <div className="text-sm text-muted-foreground">{s.label}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* التبويبات */}
            <div className="mt-10 flex gap-2 border-b">
              <button
                onClick={() => setTab('bookings')}
                className={`px-5 py-2.5 font-bold transition-colors ${
                  tab === 'bookings'
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                الحجوزات ({bookings.length})
              </button>
              <button
                onClick={() => setTab('users')}
                className={`px-5 py-2.5 font-bold transition-colors ${
                  tab === 'users'
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                المستخدمون ({users.length})
              </button>
            </div>

            {/* جدول الحجوزات */}
            {tab === 'bookings' && (
              <div className="mt-6 space-y-4">
                {bookings.length === 0 ? (
                  <p className="rounded-2xl border border-dashed bg-card p-10 text-center text-muted-foreground">
                    لا توجد حجوزات بعد
                  </p>
                ) : (
                  bookings.map((b) => (
                    <Card key={b.id} className="border-0 shadow-md shadow-primary/5">
                      <CardContent className="p-5">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                          <div>
                            <div className="flex flex-wrap items-center gap-3">
                              <h3 className="font-extrabold">{b.sessionType}</h3>
                              <StatusBadge status={b.status} />
                            </div>
                            <p className="mt-2 text-sm text-muted-foreground">
                              <span className="font-bold text-foreground">{b.userName}</span>
                              {' — '}
                              <span dir="ltr">{b.userEmail}</span>
                            </p>
                            <p className="mt-1 text-sm text-muted-foreground">
                              {b.date} • {b.time}
                            </p>
                            {b.notes && (
                              <p className="mt-2 rounded-lg bg-secondary/70 px-3 py-2 text-sm text-muted-foreground">
                                {b.notes}
                              </p>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {b.status === 'pending' && (
                              <Button size="sm" onClick={() => setStatus(b.id, 'confirmed')} className="gap-1.5">
                                <CheckCircle2 className="h-4 w-4" /> تأكيد
                              </Button>
                            )}
                            {(b.status === 'pending' || b.status === 'confirmed') && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setStatus(b.id, 'completed')}
                                  className="gap-1.5 text-sky-700 hover:bg-sky-50"
                                >
                                  <Flag className="h-4 w-4" /> إتمام
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => setStatus(b.id, 'cancelled')}
                                  className="gap-1.5 text-destructive hover:bg-destructive/10"
                                >
                                  <XCircle className="h-4 w-4" /> إلغاء
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            )}

            {/* جدول المستخدمين */}
            {tab === 'users' && (
              <Card className="mt-6 overflow-hidden border-0 shadow-md shadow-primary/5">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-secondary/60 text-right">
                        <th className="px-5 py-3.5 font-bold">الاسم</th>
                        <th className="px-5 py-3.5 font-bold">البريد الإلكتروني</th>
                        <th className="px-5 py-3.5 font-bold">الصلاحية</th>
                        <th className="px-5 py-3.5 font-bold">تاريخ التسجيل</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u.id} className="border-b last:border-0">
                          <td className="px-5 py-3.5 font-medium">{u.name}</td>
                          <td className="px-5 py-3.5" dir="ltr">{u.email}</td>
                          <td className="px-5 py-3.5">
                            {u.role === 'admin' ? (
                              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">أدمن</span>
                            ) : (
                              <span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold text-secondary-foreground">مستخدم</span>
                            )}
                          </td>
                          <td className="px-5 py-3.5 text-muted-foreground">
                            {u.createdAt ? new Date(u.createdAt).toLocaleDateString('ar-SA') : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}
