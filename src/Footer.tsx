// دالة موحّدة للتواصل مع السيرفر الخلفي
// كل الطلبات تمر من هنا، وترمي خطأ برسالة عربية جاهزة للعرض

export class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE'
  body?: unknown
}

export async function api<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const res = await fetch(`/api${path}`, {
    method: options.method ?? 'GET',
    headers: options.body ? { 'Content-Type': 'application/json' } : undefined,
    body: options.body ? JSON.stringify(options.body) : undefined,
    credentials: 'include', // إرسال كوكي الجلسة مع كل طلب
  })

  const data = (await res.json().catch(() => ({}))) as { message?: string }

  if (!res.ok) {
    throw new ApiError(data.message || 'حدث خطأ غير متوقع، حاول مرة أخرى', res.status)
  }
  return data as T
}
