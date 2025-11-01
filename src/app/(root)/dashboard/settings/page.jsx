// app/dashboard/settings/page.jsx
"use client";

import { FaTrash } from "react-icons/fa";
import { useEffect, useState } from "react";
import {
  getUserProfile,
  passwordUpdate,
  profileUpdate,
} from "@/app/dal/client/dashbard.dal";
import { toast } from "react-toastify";

export default function Settings() {
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(null);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [profileForm, setProfileForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    const initProfile = async () => {
      setLoading(true);

      const token = localStorage.getItem("userToken");
      if (!token) {
        toast.warning("Invalid user token");
        setLoading(false);
        return;
      }

      try {
        const { success, data } = await getUserProfile(token);
        if (success) {
          setProfile(data);
          setProfileForm({
            fullName: data.fullName || "",
            email: data.email || "",
            phone: data.phone || "",
            address: data.address || "",
          });
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    initProfile();
  }, []);

  const updateProfileHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("userToken");
    if (!token) {
      toast.warning("Invalid token");
      setLoading(false);
      return;
    }

    try {
      const { success } = await profileUpdate(profileForm, token);
      if (success) {
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const submitResetHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("userToken");

    if (!token) {
      toast.warning("Invalid token");
      return;
    }

    try {
      const { success } = await passwordUpdate(formData, token);
      if (success) {
        toast.success("Password updated successfully");
        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      toast.error("Failed to update password, try again");
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 lg:p-6 text-white">
      <h1 className="text-xl lg:text-2xl font-bold mb-4 lg:mb-6">Settings</h1>

      <div className="space-y-6 lg:space-y-8">
        <div className="bg-black bg-opacity-30 rounded-lg p-4 lg:p-6 border border-gray-700">
          <h2 className="text-base lg:text-lg font-medium mb-4">Profile Information</h2>

          <form onSubmit={updateProfileHandler}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profileForm.fullName}
                  onChange={(e) =>
                    setProfileForm((prev) => ({
                      ...prev,
                      fullName: e.target.value,
                    }))
                  }
                  className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm lg:text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={profileForm.email}
                  disabled
                  className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm lg:text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={profileForm.phone}
                  onChange={(e) =>
                    setProfileForm((prev) => ({
                      ...prev,
                      phone: e.target.value,
                    }))
                  }
                  className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm lg:text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Address
                </label>
                <input
                  type="text"
                  value={profileForm.address}
                  onChange={(e) =>
                    setProfileForm((prev) => ({
                      ...prev,
                      address: e.target.value,
                    }))
                  }
                  className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm lg:text-base"
                />
              </div>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                disabled={loading}
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-6 rounded-lg transition disabled:bg-yellow-900/50 text-sm lg:text-base w-full md:w-auto"
              >
                {loading ? "Updating..." : "Update Profile"}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-black bg-opacity-30 rounded-lg p-4 lg:p-6 border border-gray-700">
          <h2 className="text-base lg:text-lg font-medium mb-4">Change Password</h2>

          <form onSubmit={submitResetHandler}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  value={formData.currentPassword}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      currentPassword: e.target.value,
                    }))
                  }
                  placeholder="Enter your current password"
                  className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm lg:text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={formData.newPassword}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      newPassword: e.target.value,
                    }))
                  }
                  placeholder="Enter your new password"
                  className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm lg:text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      confirmPassword: e.target.value,
                    }))
                  }
                  placeholder="Confirm your new password"
                  className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm lg:text-base"
                />
              </div>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-6 rounded-lg transition disabled:bg-yellow-900/50 text-sm lg:text-base w-full md:w-auto"
                disabled={loading}
              >
                {!loading ? "Update Password" : "Updating..."}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-black bg-opacity-30 rounded-lg p-4 lg:p-6 border border-red-900">
          <h2 className="text-base lg:text-lg font-medium mb-4">Delete Account</h2>
          <p className="text-gray-400 mb-4 text-sm lg:text-base">
            Warning: Deleting your account is permanent and cannot be undone.
            All your data will be permanently removed.
          </p>
          <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition flex items-center justify-center md:justify-start text-sm lg:text-base w-full md:w-auto">
            <FaTrash className="mr-2" /> Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}