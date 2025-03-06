import ReduxProvider from "./Redux/Provider";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "../../src/app/globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const metadata = {
  title: "59Minutes Prints",
  description: "High-quality printing services delivered fast",
  icons: {
    icon: "../../public/images/brandimage.jpeg", 
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
