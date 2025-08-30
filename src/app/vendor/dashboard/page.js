// Updated Vendor Dashboard with reusable product form and fixed delete modal
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FaHome,
  FaBoxOpen,
  FaClipboardList,
  FaPlus,
  FaMoneyBillWave,
  FaWallet,
  FaHistory,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaUser,
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProductForm from "../Components/productform";
import { batchRequests, post } from "@/app/_hooks/fetch-hook";
import Dashboard from "../Components/dashboard";
import AddProduct from "../Components/create-product";
import ManageProducts from "../Components/manage-product";
import Earnings from "../Components/earning";
import Withdraw from "../Components/withdraw";
import Payout from "../Components/payout";
import Orders from "../Components/order";
import LoadingMiddleware from "@/app/_components/loading";

// Delete Confirmation Modal

export default function VendorDashboard() {
  const router = useRouter();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");

  // Data states
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [earnings, setEarnings] = useState({});
  const [earningsStats, setEarningsStats] = useState({});
  const [vendorData, setVendorData] = useState(null);
  const [summary, setSummary] = useState({});
  const [vendorToken, setVendorToken] = useState(null);

  // Modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load user data and initial content
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const token = localStorage.getItem("vendor_token");
        const data = JSON.parse(localStorage.getItem("vendor_data"));
        setVendorToken(token);
        setVendorData(data);

        if (!token || !data) {
          router.push("/Vendor/Login");
          return;
        }

        // Using batchRequests for parallel API calls
        const result = await batchRequests([
          {
            // Vendor Products
            url: `/products/vendor/${data.id}`,
            options: {
              method: "GET",
              token,
              config: { showToast: false }, // Disable individual toasts
            },
          },
          {
            // vendor orders
            url: `/orders/vendor/my-orders`,
            options: {
              method: "GET",
              token,
              config: { showToast: false },
            },
          },
          {
            // vendor earnings
            url: `/payments/vendor/${data.id}`,
            options: {
              method: "GET",
              token,
              config: { showToast: false },
            },
          },
          {
            // vendor earnings stats
            url: `/payments/earnings/stats/${data.id}`,
            options: {
              method: "GET",
              token,
              config: { showToast: false },
            },
          },
          {
            // vendor stats summary
            url: `/payments/vendor/${data.id}/summary`,
            options: {
              method: "GET",
              token,
              config: { showToast: false },
            },
          },
        ]);

        // Destructure results (batchRequests returns array in same order)
        const [
          productsResult,
          ordersResult,
          earningsResult,
          earningStats,
          statsSummary,
        ] = result;

        // Handle products
        if (productsResult.success) {
          setProducts(productsResult.data?.data || []);
        } else if (!productsResult.data.data.length === 0) {
          toast.warning("No Product found");
        } else if (!productsResult._failed) {
          toast.warning("Failed to fetch products");
        }

        // Handle orders
        if (ordersResult.success) {
          setOrders(ordersResult.data?.data || []);
        } else if (!ordersResult._failed) {
          toast.warning("Failed to fetch orders");
        }

        // Handle earnings
        if (earningsResult.success) {
          setEarnings(earningsResult.data?.data || []);
        } else if (!earningsResult._failed) {
          toast.warning("Failed to fetch earnings");
        }

        if (earningStats.success) {
          setEarningsStats(earningStats.data?.data || []);
        } else if (!earningStats._failed) {
          toast.warning("Failed to fetch earnings stats");
        }
        // Handle vendor summary
        if (statsSummary.success) {
          setSummary(statsSummary.data?.data || []);
        } else if (!statsSummary._failed) {
          toast.warning("Failed to fetch earnings");
        }

        // Check if any critical requests failed
        const criticalFailures = result.filter((r) => r._failed).length;
        if (criticalFailures > 0) {
          toast.warning(
            `${criticalFailures} requests failed. Some data may be incomplete.`
          );
        }
      } catch (error) {
        console.error("Error loading initial data:", error);
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [router]);

  const handleCreateProduct = async (productData) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();

      // Append product data
      Object.keys(productData).forEach((key) => {
        if (key === "color") {
          formData.append(key, JSON.stringify(productData[key]));
        } else if (key === "images") {
          productData.images.forEach((image) => {
            formData.append("images", image);
          });
        } else if (key !== "existingImages") {
          formData.append(key, productData[key]);
        }
      });

      const response = await post(
        `/products/create/${vendorData.id}`,
        formData,
        {
          token: vendorToken,
        }
      );

      if (response.success) {
        setProducts((prev) => [...prev, response.data]);
        toast.success("Product created successfully!");
        setShowProductForm(false);
      }
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error("Failed to create product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateProduct = async (productData) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();

      // Append product data
      Object.keys(productData).forEach((key) => {
        if (key === "color") {
          formData.append(key, JSON.stringify(productData[key]));
        } else if (key === "images") {
          productData.images.forEach((image) => {
            formData.append("images", image);
          });
        } else if (key === "existingImages") {
          formData.append("existingImages", JSON.stringify(productData[key]));
        } else {
          formData.append(key, productData[key]);
        }
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/edit/${productToEdit.id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${vendorToken}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update product");
      }

      const responseData = await response.json();
      setProducts((prev) =>
        prev.map((p) => (p.id === productToEdit.id ? responseData.data : p))
      );
      toast.success("Product updated successfully!");
      setShowProductForm(false);
      setProductToEdit(null);
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/${productToDelete.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${vendorToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id));
      toast.success("Product deleted successfully");
      setShowDeleteModal(false);
      setProductToDelete(null);
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setProductToDelete(null);
  };

  const handleEditProduct = (product) => {
    setProductToEdit(product);
    setShowProductForm(true);
  };

  const handleCancelEdit = () => {
    setShowProductForm(false);
    setProductToEdit(null);
  };

  const handleDesignLinkSubmit = (orderId, link) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId
          ? { ...order, designLink: link, status: "In Review" }
          : order
      )
    );
    toast.success("Design link submitted for review");
  };

  const tabs = {
    dashboard: (
      <Dashboard
        vendorData={vendorData}
        orders={orders}
        products={products}
        summary={summary}
        loading={loading}
      />
    ),
    orders: (
      <Orders
        orders={orders}
        handleDesignLinkSubmit={orders}
        loading={loading}
      />
    ),
    addProduct: (
      <AddProduct
        products={products}
        showProductForm={showProductForm}
        setShowProductForm={setShowProductForm}
        ProductForm={ProductForm}
        handleCreateProduct={handleCreateProduct}
        isSubmitting={isSubmitting}
      />
    ),
    manageProduct: (
      <ManageProducts
        products={products}
        handleEditProduct={handleEditProduct}
        handleDeleteClick={handleDeleteClick}
        showProductForm={showProductForm}
        productToEdit={productToEdit}
        handleCancelEdit={handleCancelEdit}
        ProductForm={ProductForm}
        handleUpdateProduct={handleUpdateProduct}
        isSubmitting={isSubmitting}
        showDeleteModal={showDeleteModal}
        productToDelete={productToDelete}
        handleConfirmDelete={handleConfirmDelete}
        handleCancelDelete={handleCancelDelete}
        isDeleting={isDeleting}
        loading={loading}
      />
    ),
    earnings: (
      <Earnings
        earnings={earnings}
        earningsStats={earningsStats}
        loading={loading}
      />
    ),
    withdraw: <Withdraw vendorData={vendorData} summary={summary} />,
    // payout: <Payout payouts={payouts} />,
  };
  return (
    <div className="min-h-screen bg-gray-900">
      <ToastContainer position="top-right" autoClose={5000} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Side Navigation */}
          <aside
            className={`
            fixed inset-y-0 left-0 z-40 
            w-64 bg-gray-800 shadow-lg 
            transform transition-transform duration-300 ease-in-out rounded
            ${mobileNavOpen ? "translate-x-0" : "-translate-x-full"} 
            lg:relative lg:translate-x-0 lg:w-64
            mt-14 lg:mt-0
          `}
          >
            {/* Close button for mobile */}
            <div className="lg:hidden absolute top-1 right-2">
              <button
                onClick={() => setMobileNavOpen(false)}
                className="p-2 text-gray-400 hover:text-white focus:outline-none"
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* User Profile */}
            <div className="p-4 border-b border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="bg-yellow-400 bg-opacity-20 p-2 rounded-full">
                  <FaUser className="text-yellow-400" />
                </div>
                <div className="overflow-hidden">
                  <p className="font-medium text-white truncate">
                    {vendorData?.businessName || "Guest"}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {vendorData?.businessEmail || "Guest@59minutesprints.com"}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="p-2 h-[calc(100%-72px-4rem)] overflow-y-auto">
              <button
                onClick={() => {
                  setActiveTab("dashboard");
                  setMobileNavOpen(false);
                }}
                className={`
                  w-full flex items-center px-4 py-3 text-sm rounded-md mb-1 
                  transition-all duration-200
                  ${
                    activeTab === "dashboard"
                      ? "bg-yellow-400 text-black font-bold shadow-md"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }
                `}
              >
                <span className="mr-3 text-base">
                  <FaHome />
                </span>
                <span className="text-left">Dashboard</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab("orders");
                  setMobileNavOpen(false);
                }}
                className={`
                  w-full flex items-center px-4 py-3 text-sm rounded-md mb-1 
                  transition-all duration-200
                  ${
                    activeTab === "orders"
                      ? "bg-yellow-400 text-black font-bold shadow-md"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }
                `}
              >
                <span className="mr-3 text-base">
                  <FaClipboardList />
                </span>
                <span className="text-left">Orders</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab("addProduct");
                  setMobileNavOpen(false);
                }}
                className={`
                  w-full flex items-center px-4 py-3 text-sm rounded-md mb-1 
                  transition-all duration-200
                  ${
                    activeTab === "addProduct"
                      ? "bg-yellow-400 text-black font-bold shadow-md"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }
                `}
              >
                <span className="mr-3 text-base">
                  <FaPlus />
                </span>
                <span className="text-left">Create Product</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab("manageProduct");
                  setMobileNavOpen(false);
                }}
                className={`
                  w-full flex items-center px-4 py-3 text-sm rounded-md mb-1 
                  transition-all duration-200
                  ${
                    activeTab === "manageProduct"
                      ? "bg-yellow-400 text-black font-bold shadow-md"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }
                `}
              >
                <span className="mr-3 text-base">
                  <FaBoxOpen />
                </span>
                <span className="text-left">Manage Products</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab("earnings");
                  setMobileNavOpen(false);
                }}
                className={`
                  w-full flex items-center px-4 py-3 text-sm rounded-md mb-1 
                  transition-all duration-200
                  ${
                    activeTab === "earnings"
                      ? "bg-yellow-400 text-black font-bold shadow-md"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }
                `}
              >
                <span className="mr-3 text-base">
                  <FaMoneyBillWave />
                </span>
                <span className="text-left">Earnings</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab("withdraw");
                  setMobileNavOpen(false);
                }}
                className={`
                  w-full flex items-center px-4 py-3 text-sm rounded-md mb-1 
                  transition-all duration-200
                  ${
                    activeTab === "withdraw"
                      ? "bg-yellow-400 text-black font-bold shadow-md"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }
                `}
              >
                <span className="mr-3 text-base">
                  <FaWallet />
                </span>
                <span className="text-left">Withdraw</span>
              </button>

              {/* <button
                onClick={() => {
                  setActiveTab("payout");
                  setMobileNavOpen(false);
                }}
                className={`
                  w-full flex items-center px-4 py-3 text-sm rounded-md mb-1 
                  transition-all duration-200
                  ${
                    activeTab === "payouts"
                      ? "bg-yellow-400 text-black font-bold shadow-md"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }
                `}
              >
                <span className="mr-3 text-base">
                  <FaHistory />
                </span>
                <span className="text-left">Payouts Received</span>
              </button> */}
            </nav>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1">
            <div className="mb-4 flex lg:hidden items-center">
              {mobileNavOpen && (
                <button
                  onClick={() => setMobileNavOpen(false)}
                  className="flex items-center text-sm text-yellow-400 mr-4"
                >
                  <FaTimes className="mr-1" /> Close Menu
                </button>
              )}
              <h2 className="text-xl font-bold text-white">{activeTab}</h2>
            </div>

            {tabs[activeTab]}
          </main>
        </div>
      </div>
    </div>
  );
}
