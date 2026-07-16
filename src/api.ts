// صفحة 404 — رابط غير موجود

import { Link } from 'react-router'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center hero-gradient px-4 text-center">
      <p className="text-7xl font-black text-primary">٤٠٤</p>
      <h1 className="mt-4 text-2xl font-extrabold">الصفحة غير موجودة</h1>
      <p className="mt-2 text-muted-foreground">يمكن الرابط تغيّر أو انحذف</p>
      <Link to="/">
        <Button className="mt-6">العودة للرئيسية</Button>
      </Link>
    </div>
  )
}
