// app/Admin/Providers.js
'use client'
import { AdminProvider } from './context/AdminContext'

export function Providers({ children }) {
  return (
    <AdminProvider>
      {children}
    </AdminProvider>
  )
}