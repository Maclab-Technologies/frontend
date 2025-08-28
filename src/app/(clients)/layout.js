'use client';
import "../globals.css"
import "react-toastify/dist/ReactToastify.css";
import ReduxProvider from "../utils/Redux/Provider";
import { AuthProvider } from "../context/useAuth";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ToastContainer } from "react-toastify";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col w-full bg-black text-white">
        <ReduxProvider>
          <AuthProvider>
            <Navbar />
            <ToastContainer position="top-right" autoClose={2000} />
            <main className="flex-grow">{children}</main>
            <Footer />
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}