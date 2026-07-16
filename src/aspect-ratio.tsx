// شريط التنقل العلوي — يظهر في كل الصفحات

import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { Leaf, Menu, X, LayoutDashboard, ShieldCheck, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { site } from '@/config'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  async function handleLogout() {
    await logout()
    setOpen(false)
    navigate('/')
  }

  const links = (
    <>
      <Link to="/" onClick={() => setOpen(false)} className="text-foreground/80 hover:text-primary font-medium transition-colors">
        الرئيسية
      </Link>
      <Link to="/specialists" onClick={() => setOpen(false)} className="text-foreground/80 hover:text-primary font-medium transition-colors">
        المختصون
      </Link>
      <Link to="/#sessions" onClick={() => setOpen(false)} className="text-foreground/80 hover:text-primary font-medium transition-colors">
        الجلسات
      </Link>
    </>
  )

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        {/* الشعار */}
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Leaf className="h-5 w-5" />
          </span>
          <span className="text-xl font-extrabold text-primary">{site.name}</span>
        </Link>

        {/* روابط سطح المكتب */}
        <nav className="hidden items-center gap-7 md:flex">{links}</nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <Link to="/dashboard">
                <Button variant="outline" size="sm" className="gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  حجوزاتي
                </Button>
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin">
                  <Button variant="outline" size="sm" className="gap-2 border-amber-400 text-amber-700 hover:bg-amber-50">
                    <ShieldCheck className="h-4 w-4" />
                    لوحة الأدمن
                  </Button>
                </Link>
              )}
              <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2 text-muted-foreground">
                <LogOut className="h-4 w-4" />
                خروج
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">تسجيل الدخول</Button>
              </Link>
              <Link to="/register">
                <Button size="sm">احجز جلستك</Button>
              </Link>
            </>
          )}
        </div>

        {/* زر القائمة للجوال */}
        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="القائمة">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* قائمة الجوال */}
      {open && (
        <div className="border-t bg-background px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-4">{links}</nav>
          <div className="mt-4 flex flex-col gap-2 border-t pt-4">
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setOpen(false)}>
                  <Button variant="outline" className="w-full gap-2">
                    <LayoutDashboard className="h-4 w-4" /> حجوزاتي
                  </Button>
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" onClick={() => setOpen(false)}>
                    <Button variant="outline" className="w-full gap-2 border-amber-400 text-amber-700">
                      <ShieldCheck className="h-4 w-4" /> لوحة الأدمن
                    </Button>
                  </Link>
                )}
                <Button variant="ghost" onClick={handleLogout} className="w-full gap-2 text-muted-foreground">
                  <LogOut className="h-4 w-4" /> تسجيل الخروج
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setOpen(false)}>
                  <Button variant="outline" className="w-full">تسجيل الدخول</Button>
                </Link>
                <Link to="/register" onClick={() => setOpen(false)}>
                  <Button className="w-full">احجز جلستك</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
