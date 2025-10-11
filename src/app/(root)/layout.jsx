"use client";
import "../globals.css";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../_components/Navbar";
import Footer from "../_components/Footer";
import { ClientAuthProvider } from "./_provider/useClientProvider";

export default function RootLayout({ children }) {
  return (
    <ClientAuthProvider>
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </ClientAuthProvider>
  );
}
