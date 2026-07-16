// مسارات الموقع — كل صفحة ومسارها

import { Routes, Route } from 'react-router'
import { AuthProvider } from '@/hooks/useAuth'
import Home from '@/pages/Home'
import Specialists from '@/pages/Specialists'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import Dashboard from '@/pages/Dashboard'
import Admin from '@/pages/Admin'
import NotFound from '@/pages/NotFound'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/specialists" element={<Specialists />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  )
}
