import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import ReduxProvider from "./utils/Redux/Provider";
import { ToastContainer } from "react-toastify";
import { Analytics } from "@vercel/analytics/next"


export const metadata = {
  title: '59Minutes Prints',
  description: 'Your one-stop shop for all printing needs',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col w-full bg-black text-white">
        <ReduxProvider>
            <ToastContainer position="top-right" autoClose={2000} />
            {children}
            <Analytics />
        </ReduxProvider>
      </body>
    </html>
  )
}
