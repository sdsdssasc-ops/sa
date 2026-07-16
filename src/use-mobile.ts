// صفحة المختصين — بياناتهم من ملف src/config.ts

import { Link } from 'react-router'
import { CalendarCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { specialists } from '@/config'
import { useAuth } from '@/hooks/useAuth'

export default function Specialists() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="hero-gradient">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center">
          <h1 className="text-4xl font-extrabold md:text-5xl">تعرّف على مختصينا</h1>
          <p className="mx-auto mt-4 max-w-2xl leading-8 text-muted-foreground">
            فريق من المختصين المعتمدين في التأمل والاسترخاء، هدفهم واحد: تطلع من كل جلسة أخفّ وأهدأ.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-8 md:grid-cols-2">
          {specialists.map((sp) => (
            <Card key={sp.name} className="border-0 shadow-lg shadow-primary/5 transition-transform hover:-translate-y-1">
              <CardContent className="flex flex-col items-start gap-5 p-8 sm:flex-row">
                <span className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-primary to-teal-600 text-4xl font-black text-primary-foreground">
                  {sp.initials}
                </span>
                <div className="flex-1">
                  <h2 className="text-xl font-extrabold">{sp.name}</h2>
                  <p className="mt-1 font-medium text-primary">{sp.title}</p>
                  <p className="mt-3 leading-8 text-muted-foreground">{sp.bio}</p>
                  <Link to={user ? '/dashboard' : '/register'}>
                    <Button className="mt-5 gap-2">
                      <CalendarCheck className="h-4 w-4" />
                      احجز مع {sp.name.split(' ')[1] ?? sp.name}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  )
}
