"use client";
import React, { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../hooks/useAuth";

const AdminLogin = () => {
  const router = useRouter();
  const [fullname, setFullName] = useState("");
  const [department, setDepartment] = useState("");
  const [permission, setPermission] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setIsLoggedIn, setAuthUser } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/admin/signup`,
        {
          method: "POST",
          headers: {
            "content-Type": "application/json",
          },
          body: {
            fullname: fullname,
            department: department,
            permission: permission,
            email: email,
            password: password,
          },
        }
      );

      const data = res.json();
      setIsLoggedIn(true);
      setAuthUser(data.data);
      router.push("/Admin/Dashboard");
      localStorage.setItem("adminData", data.user);
    } catch (error) {
      toast.error("Somthing wrong, try again");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full border-2 border-black">
        <h2 className="text-2xl font-bold text-center mb-6 text-black">
          Admin Login
        </h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-black">
              Full name:
            </label>
            <input
              type="text"
              required
              value={fullname}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1 block w-full border-2 border-black rounded-md p-2 focus:ring-yellow-400 focus:border-yellow-400 bg-white text-black"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-black">
              Department name:
            </label>
            <input
              type="text"
              required
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="mt-1 block w-full border-2 border-black rounded-md p-2 focus:ring-yellow-400 focus:border-yellow-400 bg-white text-black"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-black">
              Permission name:
            </label>
            <input
              type="text"
              required
              value={permission}
              onChange={(e) => setPermission(e.target.value)}
              className="mt-1 block w-full border-2 border-black rounded-md p-2 focus:ring-yellow-400 focus:border-yellow-400 bg-white text-black"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-black">
              Email:
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full border-2 border-black rounded-md p-2 focus:ring-yellow-400 focus:border-yellow-400 bg-white text-black"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-black">
              Password:
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full border-2 border-black rounded-md p-2 focus:ring-yellow-400 focus:border-yellow-400 bg-white text-black"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded-md border-2 border-black focus:outline-none focus:ring-2 focus:ring-yellow-400 transition duration-150 ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-black"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Logging in...
              </span>
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
};

export default AdminLogin;
