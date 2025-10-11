"use client";
import { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiCalendar,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiX,
  FiCheck,
} from "react-icons/fi";
import { get } from "@/app/_hooks/fetch-hook";
import LoadingErrorHandler from "@/app/_components/LoadingErrorHandler";
import { AdminAuthContext } from "../_provider/useAdminProvider";

export default function UsersTable() {
  const [isMobile, setIsMobile] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { adminToken } = useContext(AdminAuthContext);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      if(!adminToken) throw new Error("No profuct found")
      try {
        const res = await get(
          "/admin/users?page=1&limit=20&search=&status=&role=&sortBy=createdAt&sortOrder=desc",
          { token: adminToken }
        );

        if (res.success) {
          const data = res.data;
          if (data.data.length !== 0) {
            setUsers(data?.data);
            setLoading(false);
          } else {
            toast.warning("No user found");
            setError("No user found");
            setLoading(false);
          }
        }
      } catch (error) {
        console.error("Fetch Error: ", error);
        toast.error("Failed to fetch Users");
        setError("Failed to fetch Users");
        setLoading(false);
      }
    };

    fetchOrders();
  }, [adminToken, setUsers]);

  // Check screen size
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, []);

  const handleEdit = (user) => {
    setEditingUser({ ...user });
  };

  const handleSave = () => {
    if (editingUser) {
      onUserUpdate(editingUser);
      setEditingUser(null);
    }
  };

  const handleCancel = () => {
    setEditingUser(null);
  };

  const handleDelete = (userId) => {
    setDeleteConfirm(userId);
  };

  const confirmDelete = () => {
    onUserDelete(deleteConfirm);
    setDeleteConfirm(null);
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  const handleUserUpdate = (updatedUser) => {
    // Update user in state (replace with API call)
    setUsers(
      users.map((user) => (user.id === updatedUser.id ? updatedUser : user))
    );
  };

  const handleUserDelete = (userId) => {
    // Delete user from state (replace with API call)
    setUsers(users.filter((user) => user.id !== userId));
  };

  // Mobile card view
  if (isMobile) {
    return (
      <div className="p-4">
        <LoadingErrorHandler loading={loading} error={error}>
          {users.map((user) => (
            <div
              key={user.id || user._id}
              className="mb-4 p-4 bg-gray-700 rounded-lg shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1 min-w-0">
                  <div className="text-yellow-500 font-medium text-sm truncate">
                    {user.id || user._id}
                  </div>
                  <div className="text-white font-medium flex items-center mt-1 truncate">
                    <FiUser className="mr-2 flex-shrink-0" /> {user.fullName}
                  </div>
                </div>
                <div className="text-right ml-2">
                  <div className="text-xs text-green-400">
                    {user.isVerified}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {user.accountStatus}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2 text-sm">
                <div className="flex items-center text-gray-300">
                  <FiMail className="mr-2 flex-shrink-0" /> {user.email}
                </div>
                <div className="flex items-center text-gray-300">
                  <FiPhone className="mr-2 flex-shrink-0" /> {user.phone}
                </div>
                <div className="flex items-center text-gray-300">
                  <FiCalendar className="mr-2 flex-shrink-0" /> Joined:{" "}
                  {user.createdAt}
                </div>
              </div>

              <div className="flex justify-between mt-4 pt-3 border-t border-gray-600">
                <button
                  onClick={() => handleEdit(user)}
                  className="text-yellow-500 hover:text-yellow-400 text-sm flex items-center"
                >
                  <FiEdit2 className="mr-1" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="text-red-500 hover:text-red-400 text-sm flex items-center"
                >
                  <FiTrash2 className="mr-1" /> Delete
                </button>
                <button className="text-blue-500 hover:text-blue-400 text-sm flex items-center">
                  <FiEye className="mr-1" /> View
                </button>
              </div>
            </div>
          ))}
        </LoadingErrorHandler>
      </div>
    );
  }

  // Desktop table view
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-800">
          <tr>
            <th
              scope="col"
              className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider"
            >
              User ID
            </th>
            <th
              scope="col"
              className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider"
            >
              Name
            </th>
            <th
              scope="col"
              className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider hidden lg:table-cell"
            >
              Contact
            </th>
            <th
              scope="col"
              className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider hidden md:table-cell"
            >
              Joined
            </th>
            <th
              scope="col"
              className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider"
            >
              Orders
            </th>
            <th
              scope="col"
              className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider hidden sm:table-cell"
            >
              Total Spent
            </th>
            <th
              scope="col"
              className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          <LoadingErrorHandler loading={loading} error={error}>
            {users.map((user) => (
              <tr key={user.id || user._id} className="hover:bg-gray-750">
                <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm font-medium text-yellow-500">
                  {user.id || user._id}
                </td>
                <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-white">
                  <div className="flex items-center">
                    <FiUser className="mr-2" /> {user.fullName}
                  </div>
                </td>
                <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-200 hidden lg:table-cell">
                  <div className="flex items-center">
                    <FiMail className="mr-1" /> {user.email}
                  </div>
                  <div className="flex items-center mt-1">
                    <FiPhone className="mr-1" /> {user.phone}
                  </div>
                </td>
                <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-200 hidden md:table-cell">
                  <div className="flex items-center">
                    <FiCalendar className="mr-1" /> {user.createdAt}
                  </div>
                </td>
                <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-white">
                  {user.isVerified}
                </td>
                <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-white hidden sm:table-cell">
                  {user.accountStatus}
                </td>
                <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleEdit(user)}
                      className="text-yellow-500 hover:text-yellow-400"
                    >
                      <FiEdit2 className="inline mr-1" /> Edit
                    </button>
                    {deleteConfirm === user.id ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={confirmDelete}
                          className="text-green-500 hover:text-green-400"
                        >
                          <FiCheck className="inline" />
                        </button>
                        <button
                          onClick={cancelDelete}
                          className="text-red-500 hover:text-red-400"
                        >
                          <FiX className="inline" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="text-red-500 hover:text-red-400"
                      >
                        <FiTrash2 className="inline mr-1" /> Delete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </LoadingErrorHandler>
        </tbody>
      </table>
    </div>
  );
}
