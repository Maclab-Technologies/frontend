import ReduxProvider from "./Redux/Provider"; // Adjust path if necessary
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Image from "next/image";
import "../../src/app/globals.css"; // Ensure TailwindCSS is imported
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const metadata = {
  title: "59Minutes Prints",
  description: "High-quality printing services delivered fast",
  icons: {
    icon: "/images/brandimage.jpeg", // Ensure this image exists in your public/images folder
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col w-full">
        <ReduxProvider>
          <Navbar />
          <ToastContainer position="top-right" autoClose={3000} />
          <main>{children}</main>
          <Footer />
        </ReduxProvider>
      </body>
    </html>
  );
}
