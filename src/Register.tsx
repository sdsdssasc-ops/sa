// الصفحة الرئيسية

import { Link } from 'react-router'
import {
  Leaf,
  Wind,
  Sparkles,
  HeartHandshake,
  CalendarCheck,
  UserRound,
  MessageCircleHeart,
  ArrowLeft,
  Clock,
  Star,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import VideoSection from '@/components/VideoSection'
import { site, sessionTypes, specialists } from '@/config'
import { useAuth } from '@/hooks/useAuth'

const benefits = [
  {
    icon: Wind,
    title: 'تنفّس أعمق',
    text: 'تقنيات تنفّس مجرّبة تهدّي الجهاز العصبي وتفرّغ التوتر المتراكم من يومك.',
  },
  {
    icon: Sparkles,
    title: 'صفاء ذهني',
    text: 'تأمل موجّه يساعدك تسكت الضجيج الداخلي وتركّز على اللحظة الحالية.',
  },
  {
    icon: HeartHandshake,
    title: 'بدون شروط أو أسباب',
    text: 'ما تحتاج تشخيص ولا سبب مقنع. أي شخص يبي يهدأ ويرتاح — أهلًا به.',
  },
]

const steps = [
  { icon: UserRound, title: 'أنشئ حسابك', text: 'دقيقة واحدة: اسمك وبريدك وكلمة مرور.' },
  { icon: CalendarCheck, title: 'اختر جلستك ووقتك', text: 'نوع الجلسة واليوم والوقت اللي يناسبك.' },
  { icon: MessageCircleHeart, title: 'احضر واسترخِ', text: 'نؤكد حجزك ونذكّرك قبل الموعد.' },
]

const testimonials = [
  {
    name: 'ريم',
    text: 'أول مرة أجرب جلسة تأمل موجّه، وطلعت إنسانة ثانية. صرت أحجز كل أسبوع.',
    stars: 5,
  },
  {
    name: 'فهد',
    text: 'كنت أظن التأمل مو لي، بس الجلسات هنا بسيطة وعملية. نومي تحسّن بشكل واضح.',
    stars: 5,
  },
  {
    name: 'لمى',
    text: 'المكان هادئ والمختصين فاهمين شغلهم. أحسن قرار سويته لنفسي هالسنة.',
    stars: 5,
  },
]

export default function Home() {
  const { user } = useAuth()
  const bookLink = user ? '/dashboard' : '/register'

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* ===== الواجهة الرئيسية ===== */}
      <section className="hero-gradient">
        <div className="mx-auto flex max-w-6xl flex-col items-center px-4 pb-20 pt-16 text-center md:pt-24">
          <span className="inline-flex items-center gap-2 rounded-full border bg-card/70 px-4 py-1.5 text-sm font-medium text-primary">
            <Leaf className="h-4 w-4" />
            {site.tagline}
          </span>

          <h1 className="mt-6 max-w-3xl text-4xl font-black leading-[1.3] md:text-6xl md:leading-[1.25]">
            خذ نفسًا عميقًا…
            <br />
            <span className="text-gradient">رحلة هدوئك تبدأ من هنا</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-9 text-muted-foreground">
            {site.description}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to={bookLink}>
              <Button size="lg" className="gap-2 px-8 text-base">
                احجز جلستك الآن
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <a href="#sessions">
              <Button size="lg" variant="outline" className="px-8 text-base">
                استكشف الجلسات
              </Button>
            </a>
          </div>

          {/* أرقام سريعة */}
          <div className="mt-14 grid w-full max-w-2xl grid-cols-3 gap-4">
            {[
              { num: '+٥٠٠', label: 'جلسة تعافي' },
              { num: '+٣٠٠', label: 'زائر سعيد' },
              { num: '٩٨٪', label: 'نسبة الرضا' },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl border bg-card/70 px-4 py-5 backdrop-blur">
                <div className="text-2xl font-black text-primary md:text-3xl">{s.num}</div>
                <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== الفيديو التعريفي ===== */}
      <VideoSection />

      {/* ===== الفوائد ===== */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold">ليش تختار {site.name}؟</h2>
          <p className="mt-3 text-muted-foreground">لأن الهدوء حقّ للجميع</p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {benefits.map((b) => (
            <Card key={b.title} className="border-0 bg-card shadow-lg shadow-primary/5 transition-transform hover:-translate-y-1">
              <CardContent className="p-8">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary">
                  <b.icon className="h-7 w-7 text-primary" />
                </span>
                <h3 className="mt-5 text-xl font-bold">{b.title}</h3>
                <p className="mt-3 leading-8 text-muted-foreground">{b.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ===== أنواع الجلسات ===== */}
      <section id="sessions" className="bg-secondary/40 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold">جلساتنا</h2>
            <p className="mt-3 text-muted-foreground">اختر اللي يناسب مزاجك ووقتك</p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {sessionTypes.map((s) => (
              <Card key={s.id} className="flex flex-col border-0 shadow-lg shadow-primary/5 transition-transform hover:-translate-y-1">
                <CardContent className="flex flex-1 flex-col p-6">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      {s.duration}
                    </span>
                    <span className="text-lg font-black text-primary">{s.price}</span>
                  </div>
                  <h3 className="mt-4 text-lg font-bold">{s.name}</h3>
                  <p className="mt-2 flex-1 text-sm leading-7 text-muted-foreground">{s.description}</p>
                  <Link to={bookLink} className="mt-5">
                    <Button variant="outline" className="w-full">احجز هذي الجلسة</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ===== كيف تبدأ ===== */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold">كيف تبدأ؟</h2>
          <p className="mt-3 text-muted-foreground">ثلاث خطوات وتكون جاهز</p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {steps.map((step, i) => (
            <div key={step.title} className="relative rounded-3xl border bg-card p-8 text-center shadow-lg shadow-primary/5">
              <span className="absolute -top-4 right-6 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-black text-primary-foreground">
                {i + 1}
              </span>
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                <step.icon className="h-8 w-8 text-primary" />
              </span>
              <h3 className="mt-5 text-lg font-bold">{step.title}</h3>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== المختصون (لمحة) ===== */}
      <section className="bg-secondary/40 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-extrabold">مختصونا</h2>
              <p className="mt-3 text-muted-foreground">فريق يهتم فيك من أول جلسة</p>
            </div>
            <Link to="/specialists" className="hidden sm:block">
              <Button variant="ghost" className="gap-2 text-primary">
                عرض الكل <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {specialists.slice(0, 4).map((sp) => (
              <Card key={sp.name} className="border-0 text-center shadow-lg shadow-primary/5">
                <CardContent className="p-6">
                  <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-teal-600 text-3xl font-black text-primary-foreground">
                    {sp.initials}
                  </span>
                  <h3 className="mt-4 font-bold">{sp.name}</h3>
                  <p className="mt-1 text-sm text-primary">{sp.title}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ===== آراء الزوار ===== */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold">ماذا قالوا عن تجربتهم؟</h2>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <Card key={t.name} className="border-0 shadow-lg shadow-primary/5">
              <CardContent className="p-8">
                <div className="flex gap-1">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="mt-4 leading-8 text-foreground/80">"{t.text}"</p>
                <p className="mt-4 font-bold text-primary">— {t.name}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ===== دعوة أخيرة ===== */}
      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="rounded-3xl bg-gradient-to-l from-primary to-teal-700 px-6 py-14 text-center text-primary-foreground shadow-2xl shadow-primary/20">
          <h2 className="text-3xl font-extrabold md:text-4xl">جاهز تهدّي بالك؟</h2>
          <p className="mx-auto mt-4 max-w-xl leading-8 text-primary-foreground/85">
            احجز جلستك الأولى اليوم، وخلّ الباقي علينا. ما تحتاج أي سبب — بس تحتاج تبدأ.
          </p>
          <Link to={bookLink}>
            <Button size="lg" variant="secondary" className="mt-8 px-10 text-base font-bold">
              احجز الآن مجانًا
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
