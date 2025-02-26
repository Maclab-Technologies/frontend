// src/app/layout.js
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "../../src/app/globals.css"; // Ensure TailwindCSS is imported
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const metadata = {
  title: "59Minutes Prints",
  description: "High-quality printing services delivered fast",
  image: "../../public/images/brandimage.jpeg"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* <link rel="icon" href="../../public/images/brandimage.jpeg" type="image/x-icon" sizes="16x16"/> */}
      <body className="min-h-screen flex flex-col w-100">

        <Navbar />
        <ToastContainer position="top-right" autoClose={3000} />
        <main className="">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
