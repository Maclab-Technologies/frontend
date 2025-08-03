'use client';

import { useAdmin } from './context/AdminContext';
import Sidebar from './components/shared/Sidebar';
import Header from './components/shared/Header';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AdminPage({ children }) {
  const { mobileNavOpen, setMobileNavOpen } = useAdmin();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex pt-20">
        <Sidebar />
        <main className="flex-1 lg:ml-64 min-h-[calc(100vh-64px)] flex flex-col">
          <Header />
          <div className="flex-1 p-6 bg-gray-900 mt-10">
            {children}
          </div>
        </main>
      </div>
      {mobileNavOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-10 lg:hidden"
          onClick={() => setMobileNavOpen(false)}
        />
      )}
    </div>
  );
}