// تذييل الموقع

import { Link } from 'react-router'
import { Leaf, Mail, Phone, MapPin } from 'lucide-react'
import { site } from '@/config'

export default function Footer() {
  return (
    <footer className="border-t bg-secondary/50">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Leaf className="h-5 w-5" />
            </span>
            <span className="text-xl font-extrabold text-primary">{site.name}</span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-7 text-muted-foreground">
            {site.tagline} — مساحة آمنة وهادئة تساعدك تستعيد توازنك وصفاءك الذهني، بدون شروط وبدون أسباب.
          </p>
        </div>

        <div>
          <h3 className="font-bold">روابط سريعة</h3>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li><Link to="/" className="hover:text-primary transition-colors">الرئيسية</Link></li>
            <li><Link to="/specialists" className="hover:text-primary transition-colors">المختصون</Link></li>
            <li><Link to="/dashboard" className="hover:text-primary transition-colors">حجوزاتي</Link></li>
            <li><Link to="/register" className="hover:text-primary transition-colors">إنشاء حساب</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold">تواصل معنا</h3>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" />
              <span dir="ltr">{site.email}</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              <span dir="ltr">{site.phone}</span>
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              {site.city}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t py-5 text-center text-sm text-muted-foreground">
        جميع الحقوق محفوظة © {new Date().getFullYear()} — {site.name}
      </div>
    </footer>
  )
}
