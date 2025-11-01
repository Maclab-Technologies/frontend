// vendor/dashboard/page.jsx
"use client";

import { useContext, useEffect, useState } from "react";
import { batchRequests } from "@/app/_hooks/fetch-hook";
import { toast } from "react-toastify";
import VendorLayout from "../Components/vendor-layout"; // This is the new layout with sidebar
import Dashboard from "../components/dashboard";
import { VendorAuthContext } from "../_provider/useVendorProvider";

export default function DashboardPage() {
  const { vendorToken, authVendor } = useContext(VendorAuthContext);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [summary, setSummary] = useState({});

  useEffect(() => {
    const loadInitialData = async () => {
      if (!vendorToken || !authVendor?.id) return;
      
      setLoading(true);
      try {
        const result = await batchRequests([
          {
            url: `/products/vendor/${authVendor.id}`,
            options: {
              method: "GET",
              token: vendorToken,
              config: { showToast: false },
            },
          },
          {
            url: `/orders/vendor/my-orders`,
            options: {
              method: "GET",
              token: vendorToken,
              config: { showToast: false },
            },
          },
          {
            url: `/payments/vendor/${authVendor.id}/summary`,
            options: {
              method: "GET",
              token: vendorToken,
              config: { showToast: false },
            },
          },
        ]);

        const [productsResult, ordersResult, statsSummary] = result;

        if (productsResult.success) {
          setProducts(productsResult.data?.data || []);
        }

        if (ordersResult.success) {
          setOrders(ordersResult.data?.data || []);
        }

        if (statsSummary.success) {
          setSummary(statsSummary.data?.data || {});
        }

      } catch (error) {
        console.error("Error loading dashboard data:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [vendorToken, authVendor]);

  return (
    <VendorLayout> {/* This now includes the sidebar navigation */}
      <Dashboard
        vendorData={authVendor}
        products={products}
        orders={orders}
        summary={summary}
        loading={loading}
      />
    </VendorLayout>
  );
}