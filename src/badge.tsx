// قسم الفيديو التعريفي
// يعرض فيديو يوتيوب إذا حطيت معرّفه في src/config.ts (youtubeId)
// وإلا يعرض الملف الموجود في public/videos/intro.mp4
// وإذا ما فيه فيديو أصلاً، يظهر بطاقة أنيقة مكانه بدل ما يخرب الشكل

import { useState } from 'react'
import { PlayCircle } from 'lucide-react'
import { site } from '@/config'

export default function VideoSection() {
  const [fileMissing, setFileMissing] = useState(false)

  return (
    <section className="mx-auto max-w-5xl px-4 py-16" id="video">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold">شاهد بنفسك</h2>
        <p className="mt-3 text-muted-foreground">دقيقة واحدة تكفي لتعرف جوّ جلساتنا</p>
      </div>

      <div className="mt-8 overflow-hidden rounded-3xl border bg-card shadow-xl shadow-primary/5">
        {site.youtubeId ? (
          // فيديو يوتيوب
          <div className="aspect-video w-full">
            <iframe
              className="h-full w-full"
              src={`https://www.youtube.com/embed/${site.youtubeId}`}
              title="الفيديو التعريفي"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : fileMissing ? (
          // بطاقة بديلة أنيقة إذا ما تم رفع الفيديو بعد
          <div className="flex aspect-video w-full flex-col items-center justify-center gap-4 bg-gradient-to-br from-secondary via-background to-accent/40 text-center">
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <PlayCircle className="h-10 w-10 text-primary" />
            </span>
            <p className="text-lg font-bold text-foreground/70">الفيديو التعريفي</p>
            <p className="px-6 text-sm text-muted-foreground">سيظهر هنا فور إضافته</p>
          </div>
        ) : (
          // ملف الفيديو من public/videos/intro.mp4
          <video
            className="aspect-video w-full object-cover"
            controls
            preload="metadata"
            onError={() => setFileMissing(true)}
          >
            <source src={site.videoPath} type="video/mp4" />
            متصفحك لا يدعم تشغيل الفيديو.
          </video>
        )}
      </div>
    </section>
  )
}
