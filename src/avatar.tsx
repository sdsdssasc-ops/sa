// شارة ملوّنة تعرض حالة الحجز

import type { BookingStatus } from '@/types'
import { statusLabels } from '@/types'

const styles: Record<BookingStatus, string> = {
  pending: 'bg-amber-100 text-amber-800 border-amber-200',
  confirmed: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  completed: 'bg-sky-100 text-sky-800 border-sky-200',
  cancelled: 'bg-rose-100 text-rose-700 border-rose-200',
}

export default function StatusBadge({ status }: { status: BookingStatus }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold ${styles[status]}`}>
      {statusLabels[status]}
    </span>
  )
}
