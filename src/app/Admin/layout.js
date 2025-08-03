import { AdminProvider } from './context/AdminContext';
import { AuthProvider } from '../hooks/useAuth';

export default function AdminLayout({ children }) {
  return (
    <AuthProvider>
      <AdminProvider>
        {children}
      </AdminProvider>
    </AuthProvider>
  );
}