// صفحة تسجيل الدخول

import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { Leaf, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/hooks/useAuth'
import { site } from '@/config'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      const user = await login(email.trim(), password)
      // الأدمن ينقل مباشرة للوحته، والمستخدم العادي لحجوزاته
      navigate(user.role === 'admin' ? '/admin' : '/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ غير متوقع')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center hero-gradient px-4 py-10">
      <Card className="w-full max-w-md border-0 shadow-2xl shadow-primary/10">
        <CardContent className="p-8">
          <div className="flex flex-col items-center text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              <Leaf className="h-7 w-7" />
            </span>
            <h1 className="mt-4 text-2xl font-extrabold">أهلًا بعودتك</h1>
            <p className="mt-2 text-sm text-muted-foreground">سجّل دخولك لحسابك في {site.name}</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                dir="ltr"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <Input
                id="password"
                type="password"
                dir="ltr"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full" size="lg" disabled={busy}>
              {busy && <Loader2 className="h-4 w-4 animate-spin" />}
              تسجيل الدخول
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            ما عندك حساب؟{' '}
            <Link to="/register" className="font-bold text-primary hover:underline">
              أنشئ حسابًا جديدًا
            </Link>
          </p>
          <p className="mt-3 text-center text-sm">
            <Link to="/" className="text-muted-foreground hover:text-primary">
              ← الرجوع للرئيسية
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
