// الأنواع المشتركة بين الواجهة والسيرفر

export interface User {
  id: number
  name: string
  email: string
  role: 'user' | 'admin'
  createdAt?: string
}

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled'

export interface Booking {
  id: number
  userId: number
  sessionType: string
  date: string
  time: string
  notes: string | null
  status: BookingStatus
  createdAt: string
  // تظهر في لوحة الأدمن فقط
  userName?: string
  userEmail?: string
}

export const statusLabels: Record<BookingStatus, string> = {
  pending: 'قيد المراجعة',
  confirmed: 'مؤكد',
  completed: 'مكتمل',
  cancelled: 'ملغي',
}
