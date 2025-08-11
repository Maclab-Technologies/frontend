'use client'
import { AdminProvider } from './context/AdminContext'

export function AdminProviders({ children }) {
  return (
    <AdminProvider>
      {children}
    </AdminProvider>
  )
}