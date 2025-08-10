import { Inter } from 'next/font/google'
// import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: '59Minutes Prints - Admin Dashboard',
  description: 'Admin dashboard for 59Minutes Prints platform',
}

export default function AdminLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50`}>
        <div className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  )
}