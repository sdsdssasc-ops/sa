// إدارة حالة تسجيل الدخول في كل الموقع
// AuthProvider يلف التطبيق، وأي صفحة تقدر تعرف المستخدم الحالي بـ useAuth()

import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { api } from '@/lib/api'
import type { User } from '@/types'

interface AuthContextValue {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<User>
  register: (name: string, email: string, password: string) => Promise<User>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // عند فتح الموقع: تحقق هل في جلسة دخول محفوظة (كوكي)
  useEffect(() => {
    api<{ user: User }>('/auth/me')
      .then((data) => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  async function login(email: string, password: string) {
    const data = await api<{ user: User }>('/auth/login', {
      method: 'POST',
      body: { email, password },
    })
    setUser(data.user)
    return data.user
  }

  async function register(name: string, email: string, password: string) {
    const data = await api<{ user: User }>('/auth/register', {
      method: 'POST',
      body: { name, email, password },
    })
    setUser(data.user)
    return data.user
  }

  async function logout() {
    await api('/auth/logout', { method: 'POST' })
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
