// 'use client';

import "./globals.css";
import "react-toastify/dist/ReactToastify.css";

import ReduxProvider from "./Redux/Provider";
import AuthContextProvider from "./hooks/useAuth";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { ToastContainer } from "react-toastify";

export const metadata = {
  title: "59Minutes Prints",
  description: "High-quality printing services delivered fast",
  icons: {
    icon: "/images/brandimage.jpeg",
  },
};

export default function RootLayout({ children, modal }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col w-full bg-black text-white">
        <ReduxProvider>
          <AuthContextProvider>
            <Navbar />
            <ToastContainer position="top-right" autoClose={2000} />
            <main className="flex-grow">{children}{modal}</main>
            <Footer />
          </AuthContextProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
