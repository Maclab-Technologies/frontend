"use client"
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SideNav from "./components/UI/sidenav";

const AdminLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-900">
      <ToastContainer 
        position="top-right" 
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark" // Matches your dark theme
      />

      {/* Main layout container */}
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <SideNav />

        {/* Main content area */}
        <div className="flex-1 flex flex-col">
          {/* Content wrapper with proper spacing */}
          <main className="flex-1 p-4 lg:p-6 overflow-auto">
            <div className="max-w-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;