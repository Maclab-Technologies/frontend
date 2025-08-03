'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminProvider } from './context/AdminContext';
import { useAuth } from '../hooks/useAuth';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const { isLoggedIn, role } = useAuth();

  useEffect(() => {
    if (!isLoggedIn || role !== 'admin') {
      router.push('/Admin/auth/login');
    }
  }, [isLoggedIn, role, router]);

  if (!isLoggedIn || role !== 'admin') {
    return null; // Redirect happens automatically
  }

  return (
    <AdminProvider>
      {children}
    </AdminProvider>
  );
}