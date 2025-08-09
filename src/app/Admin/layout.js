'use client';
import { useEffect } from 'react';
import { AdminProvider } from './context/AdminContext';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function AdminLayout({ children }) {
  const { isLoggedIn, role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn || role !== 'admin') {
      router.push('/Admin/Auth');
    }
  }, [isLoggedIn, role]);

  if (!isLoggedIn || role !== 'admin') {
    return null; // Silent redirect
  }

  return <AdminProvider>{children}</AdminProvider>;
}