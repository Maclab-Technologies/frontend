// src/app/layout.js
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "../../src/app/globals.css"; // Ensure TailwindCSS is imported

export const metadata = {
  title: "59Minutes Prints",
  description: "High-quality printing services delivered fast",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col w-100">
        <Navbar />
        <main className="">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
