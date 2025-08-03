'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Basic client-side validation
      if (!email || !password) {
        throw new Error('Please fill in all fields');
      }

      // Validate credentials
      if (email === 'admin@59minutes.com' && password === 'admin123') {
        localStorage.setItem('adminToken', 'dummy-token-123');
        toast.success('Login successful');
        router.push('/Admin/dashboard');
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-700">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-yellow-400 mb-2">59Minutes Admin</h1>
          <p className="text-gray-400">Enter your credentials to continue</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              placeholder="admin@59minutes.com"
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              placeholder="••••••••"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full py-3 px-4 bg-yellow-500 hover:bg-yellow-600 rounded-lg font-bold text-gray-900 transition-colors duration-200"
          >
            Sign In
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          <p>Having trouble? Contact support</p>
        </div>
      </div>
    </div>
  );
}