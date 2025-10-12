"use client";

import React, { useState, useEffect } from "react";
import {
  Package,
  MapPin,
  User,
  CreditCard,
  Clock,
  CheckCircle,
  Truck,
  FileText,
  ChevronLeft,
  Download,
  Printer,
  Phone,
  Mail,
  Calendar,
  ShoppingBag,
  Images,
} from "lucide-react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { get } from "@/app/_hooks/fetch-hook";
import Link from "next/link";

export default function OrderDetailPage({ params }) {
  const { orderId } = React.use(params);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("vendorToken");

    if (!token) {
      router.push("/vendor/login");
      return;
    }

    const fetchOrder = async () => {
      setLoading(true);
      try {
        const response = await get(`/orders/order/${orderId}`, { token });
        const result = await response.data;

        if (result.success) {
          setOrder(result.data);
        } else {
          toast.error("Something went wrong, please try again.");
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch order. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [router, orderId]);

  const formatCurrency = (amount) => {
    return `₦${amount.toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
      case "pending":
        return "bg-amber-500/10 text-amber-400 border-amber-500/30";
      case "paid":
        return "bg-green-500/10 text-green-400 border-green-500/30";
      case "processing":
        return "bg-blue-500/10 text-blue-400 border-blue-500/30";
      case "shipped":
        return "bg-purple-500/10 text-purple-400 border-purple-500/30";
      case "delivered":
        return "bg-teal-500/10 text-teal-400 border-teal-500/30";
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/30";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-slate-400 text-lg">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400 text-lg">Order not found</p>
          <Link
            href="/vendor/orders"
            className="mt-4 inline-block text-yellow-400 hover:text-yellow-300"
          >
            ← Back to Orders
          </Link>
        </div>
      </div>
    );
  };


  return (
    <div className="min-h-screen bg-slate-950">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              href="/vendor/dashboard"
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="font-medium">Back to Orders</span>
            </Link>
            <div className="flex items-center gap-3">
              <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all">
                <Printer className="w-5 h-5" />
              </button>
              <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all">
                <Download className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-white">Order Details</h1>
                <span
                  className={`px-3 py-1 rounded-lg text-xs font-semibold border ${getStatusColor(order?.orderStatus)}`}
                >
                  {order?.orderStatus?.toUpperCase() || "PENDING"}
                </span>
              </div>
              <div className="flex items-center gap-4 text-slate-400">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">
                    {formatDate(order?.createdAt)}
                  </span>
                </div>
                <div className="h-4 w-px bg-slate-700"></div>
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  <span className="text-sm font-mono">{order?.id}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                  Total Amount
                </p>
                <p className="text-2xl font-bold text-yellow-400">
                  {formatCurrency(order?.total)}
                </p>
              </div>
              <span
                className={`px-4 py-2 rounded-lg text-sm font-semibold border ${getStatusColor(order?.paymentStatus)}`}
              >
                {order?.paymentStatus?.toUpperCase() || "PENDING"}
              </span>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="xl:col-span-2 space-y-6">
            {/* Order Items Card */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-400/10 rounded-lg">
                      <ShoppingBag className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-white">
                        Order Items
                      </h2>
                      <p className="text-xs text-slate-500">
                        {order?.items?.length || 0} item(s)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6 space-y-4">
                {order?.items?.map((item, index) => (
                  <div
                    key={index}
                    className="flex gap-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 hover:border-slate-600 transition-colors"
                  >
                    <img
                      src={item?.productId?.images?.[0]}
                      alt={item?.productId?.name}
                      className="w-20 h-20 object-cover rounded-lg border-2 border-slate-700"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-white mb-1 truncate">
                        {item?.productId?.name}
                      </h3>
                      <p className="text-sm text-slate-400 mb-3">
                        by {item?.vendorId?.businessName}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 text-xs">
                        <div className="flex items-center gap-1.5 bg-slate-900 px-2.5 py-1 rounded-md">
                          <span className="text-slate-500">Qty:</span>
                          <span className="font-semibold text-yellow-400">
                            {item?.quantity}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-slate-900 px-2.5 py-1 rounded-md">
                          <span className="text-slate-500">Unit:</span>
                          <span className="font-semibold text-white">
                            {formatCurrency(item?.discountPrice)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-slate-900 px-2.5 py-1 rounded-md">
                          <span className="text-slate-500">Design:</span>
                          <span className="font-semibold text-white capitalize">
                            {item?.designOption?.toLowerCase()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-yellow-400">
                        {formatCurrency(
                          (item?.quantity || 0) * (item?.discountPrice || 0)
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Uploaded Designs */}
            {order?.items?.[0]?.uploadedImages?.length > 0 && (
              <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-400/10 rounded-lg">
                      <Images className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-white">
                        Customer Uploaded Designs
                      </h2>
                      <p className="text-xs text-slate-500">
                        {order?.items?.[0]?.uploadedImages?.length} file(s)
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {order?.items?.[0]?.uploadedImages?.map((image, idx) => (
                      <div
                        key={idx}
                        onClick={() => setSelectedImage(image)}
                        className="group relative aspect-square rounded-xl overflow-hidden border-2 border-slate-700 hover:border-purple-500 transition-all cursor-pointer"
                      >
                        <img
                          src={image}
                          alt={`Upload ${idx + 1}`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center">
                            <span className="text-xs font-medium text-white">
                              Design {idx + 1}
                            </span>
                            <Download className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Product Reference Images */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-400/10 rounded-lg">
                    <FileText className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">
                      Product Reference
                    </h2>
                    <p className="text-xs text-slate-500">Product images</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                  {order?.items?.[0]?.productId?.images?.map((image, idx) => (
                    <div
                      key={idx}
                      className="aspect-square rounded-lg overflow-hidden border-2 border-slate-700 hover:border-blue-500 transition-colors cursor-pointer"
                    >
                      <img
                        src={image}
                        alt={`Product ${idx + 1}`}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Customer Info */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-400/20 rounded-lg">
                    <User className="w-5 h-5 text-yellow-400" />
                  </div>
                  <h2 className="text-lg font-semibold text-white">Customer</h2>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                    Full Name
                  </p>
                  <p className="text-white font-medium">
                    {order?.user?.fullName || "N/A"}
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                      Email
                    </p>
                    <p className="text-white text-sm break-all">
                      {order?.user?.email || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                      Phone
                    </p>
                    <p className="text-white text-sm">
                      {order?.user?.phone || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-400/20 rounded-lg">
                    <MapPin className="w-5 h-5 text-green-400" />
                  </div>
                  <h2 className="text-lg font-semibold text-white">
                    Delivery Address
                  </h2>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                    Contact Person
                  </p>
                  <p className="text-white font-medium">
                    {order?.shippingAddress?.contactName || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">
                    Address
                  </p>
                  <div className="text-white text-sm leading-relaxed space-y-1">
                    <p>{order?.shippingAddress?.street || "N/A"}</p>
                    <p>
                      {order?.shippingAddress?.city || "N/A"},{" "}
                      {order?.shippingAddress?.state || "N/A"}
                    </p>
                    <p>{order?.shippingAddress?.country || "N/A"}</p>
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-slate-300">
                      {order?.shippingAddress?.contactPhone || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-slate-300 break-all">
                      {order?.shippingAddress?.contactEmail || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-400/20 rounded-lg">
                    <CreditCard className="w-5 h-5 text-purple-400" />
                  </div>
                  <h2 className="text-lg font-semibold text-white">
                    Payment Summary
                  </h2>
                </div>
              </div>
              <div className="p-6 space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Subtotal</span>
                  <span className="text-white font-medium">
                    {formatCurrency(order?.subTotal)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Shipping Fee</span>
                  <span className="text-white font-medium">
                    {formatCurrency(order?.shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Discount</span>
                  <span className="text-red-400 font-medium">
                    -{formatCurrency(order?.discount)}
                  </span>
                </div>
                <div className="pt-3 border-t border-slate-800">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-semibold text-white">
                      Total
                    </span>
                    <span className="text-xl font-bold text-yellow-400">
                      {formatCurrency(order?.total)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-400/20 rounded-lg">
                    <Clock className="w-5 h-5 text-blue-400" />
                  </div>
                  <h2 className="text-lg font-semibold text-white">Timeline</h2>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Order Created</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {order?.createdAt ? formatDate(order.createdAt) : "N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Last Updated</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {order?.updatedAt ? formatDate(order.updatedAt) : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Vendor Info */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-br from-orange-500/10 to-red-500/10 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-400/20 rounded-lg">
                    <Truck className="w-5 h-5 text-orange-400" />
                  </div>
                  <h2 className="text-lg font-semibold text-white">Vendor</h2>
                </div>
              </div>
              <div className="p-6 space-y-3">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                    Business Name
                  </p>
                  <p className="text-white font-medium">
                    {order?.items?.[0]?.vendorId?.businessName || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                    Email
                  </p>
                  <p className="text-white text-sm">
                    {order?.items?.[0]?.vendorId?.businessEmail || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                    Phone
                  </p>
                  <p className="text-white text-sm">
                    {order?.items?.[0]?.vendorId?.businessPhoneNumber || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl w-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300"
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <img
              src={selectedImage}
              alt="Full size"
              className="w-full h-auto rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
}
