"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CheckCircle,
  Package,
  ArrowRight,
  ShoppingBag,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  Sparkles,
  Download,
  Share2,
  Loader2,
} from "lucide-react";
import { toast } from "react-toastify";

export default function OrderSuccessPage() {
  const [isAnimating, setIsAnimating] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setIsAnimating(true);

    // Get order details from localStorage
    try {
      const savedOrder = JSON.parse(localStorage.getItem("orderDetails"));
      if (savedOrder) {
        toast.success("Order details loaded successfully!");
          setOrderData(savedOrder)
      } else {
        toast.error("No order data found. Redirecting to products.");
        router.push("/products");
      }
    } catch (error) {
      console.error("Error parsing order data:", error);
      router.push("/products");
    } finally {
      setLoading(false);
    }
  }, [router]);

  const formatCurrency = (amount) => {
    return `₦${Number(amount || 0).toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    if (!dateString)
      return new Date().toLocaleDateString("en-NG", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

    return new Date(dateString).toLocaleDateString("en-NG", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        bg: "bg-yellow-500/10",
        text: "text-yellow-400",
        border: "border-yellow-500/30",
        label: "Pending",
      },
      confirmed: {
        bg: "bg-green-500/10",
        text: "text-green-400",
        border: "border-green-500/30",
        label: "Confirmed",
      },
      processing: {
        bg: "bg-blue-500/10",
        text: "text-blue-400",
        border: "border-blue-500/30",
        label: "Processing",
      },
      paid: {
        bg: "bg-green-500/10",
        text: "text-green-400",
        border: "border-green-500/30",
        label: "Paid",
      },
    };

    const config = statusConfig[status?.toLowerCase()] || statusConfig.pending;
    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${config.bg} ${config.text} border ${config.border}`}
      >
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-yellow-400 animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!orderData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-green-500/3 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Animation Container */}
        <div
          className={`transform transition-all duration-1000 ${isAnimating ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
        >
          {/* Success Icon */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              {/* Outer Ring */}
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full blur-2xl opacity-50 animate-pulse"></div>

              {/* Main Icon Circle */}
              <div className="relative bg-gradient-to-br from-green-500 to-emerald-600 rounded-full p-8 shadow-2xl">
                <CheckCircle
                  className="w-20 h-20 text-white"
                  strokeWidth={2.5}
                />
              </div>

              {/* Sparkle Effects */}
              <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-yellow-400 animate-ping" />
              <Sparkles
                className="absolute -bottom-2 -left-2 w-6 h-6 text-yellow-400 animate-ping"
                style={{ animationDelay: "300ms" }}
              />
            </div>
          </div>

          {/* Success Message */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Order Placed Successfully! 🎉
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Thank you for your order! We've received your request and will
              start processing it right away.
            </p>
          </div>

          {/* Order Details Card */}
          <div className="bg-slate-900/80 backdrop-blur-sm rounded-2xl border border-slate-800 shadow-2xl overflow-hidden mb-8">
            {/* Card Header */}
            <div className="bg-gradient-to-r from-yellow-500/10 via-purple-500/10 to-green-500/10 px-8 py-6 border-b border-slate-800">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-400 mb-1">Order ID</p>
                  <p className="text-xl md:text-2xl font-bold text-white font-mono break-all">
                    {orderData.id || "Processing..."}
                  </p>
                </div>
                <div className="text-left md:text-right">
                  <p className="text-sm text-slate-400 mb-1">Order Total</p>
                  <p className="text-2xl md:text-3xl font-bold text-yellow-400">
                    {formatCurrency(orderData.total)}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Items Summary */}
            <div className="px-8 py-6 border-b border-slate-800 bg-slate-800/30">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-yellow-400" />
                Order Items ({orderData.items?.length || 0})
              </h3>
              <div className="space-y-3">
                {orderData.items?.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-slate-900/50 rounded-lg p-4 border border-slate-700/50"
                  >
                    <div className="flex-1">
                      <p className="text-white font-medium mb-1">
                        {item.productId?.name}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <span>Vendor: {item.vendorId?.businessName}</span>
                        <span>•</span>
                        <span>Qty: {item.quantity}</span>
                        <span>•</span>
                        <span className="capitalize">
                          {item.designOption?.toLowerCase()}
                        </span>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-lg font-bold text-yellow-400">
                        {formatCurrency(item.quantity * item.discountPrice)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Card Content */}
            <div className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-500/10 rounded-lg">
                      <Calendar className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                        Order Date
                      </p>
                      <p className="text-white font-medium">
                        {formatDate(orderData.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-purple-500/10 rounded-lg">
                      <CreditCard className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                        Payment Status
                      </p>
                      {getStatusBadge(orderData.paymentStatus)}
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-green-500/10 rounded-lg">
                      <Package className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                        Order Status
                      </p>
                      {getStatusBadge(orderData.orderStatus)}
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Order Summary */}
                  <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 space-y-3">
                    <h4 className="text-white font-semibold mb-3">
                      Order Summary
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Subtotal</span>
                        <span className="text-white">
                          {formatCurrency(orderData.subTotal)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Shipping Fee</span>
                        <span className="text-white">
                          {formatCurrency(orderData.shippingFee)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Discount</span>
                        <span className="text-red-400">
                          -{formatCurrency(orderData.discount)}
                        </span>
                      </div>
                      <div className="pt-2 border-t border-slate-700">
                        <div className="flex justify-between items-center">
                          <span className="text-white font-semibold">
                            Total
                          </span>
                          <span className="text-xl font-bold text-yellow-400">
                            {formatCurrency(orderData.total)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                    <p className="text-sm text-slate-300 leading-relaxed">
                      <strong className="text-white">What's Next?</strong>
                      <br />
                      We'll send you an email confirmation and updates about
                      your order. You can track your order status anytime from
                      your orders page.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons Section */}
            <div className="bg-slate-800/50 px-8 py-6 border-t border-slate-800">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => window.print()}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-semibold transition-all transform hover:scale-105"
                >
                  <Download className="w-5 h-5" />
                  Download Receipt
                </button>
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: "My Order",
                        text: `Order #${orderData.id} - ${formatCurrency(orderData.total)}`,
                      });
                    }
                  }}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-semibold transition-all transform hover:scale-105"
                >
                  <Share2 className="w-5 h-5" />
                  Share Order
                </button>
              </div>
            </div>
          </div>

          {/* Info Cards Row */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="bg-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-800 p-6 text-center">
              <div className="inline-flex p-3 bg-blue-500/10 rounded-full mb-3">
                <Mail className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">
                Email Confirmation
              </h3>
              <p className="text-sm text-slate-400">
                Check your inbox for order details
              </p>
            </div>

            <div className="bg-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-800 p-6 text-center">
              <div className="inline-flex p-3 bg-purple-500/10 rounded-full mb-3">
                <Package className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">
                Track Your Order
              </h3>
              <p className="text-sm text-slate-400">
                Get real-time updates on delivery
              </p>
            </div>

            <div className="bg-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-800 p-6 text-center">
              <div className="inline-flex p-3 bg-green-500/10 rounded-full mb-3">
                <Phone className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">24/7 Support</h3>
              <p className="text-sm text-slate-400">
                We're here to help anytime
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/orders"
              className="flex items-center gap-3 px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-semibold transition-all transform hover:scale-105 border border-slate-700 hover:border-slate-600 shadow-lg"
            >
              <Package className="w-5 h-5" />
              View Order Details
            </Link>

            <Link
              href="/products"
              className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-slate-900 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg shadow-yellow-500/25"
            >
              <ShoppingBag className="w-5 h-5" />
              Continue Shopping
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
