// vendor/orders/page.jsx
"use client";

import { useContext, useEffect, useState } from "react";
import { batchRequests } from "@/app/_hooks/fetch-hook";
import VendorLayout from "../components/vendor-layout";
import Orders from "../components/order";
import { VendorAuthContext } from "../_provider/useVendorProvider";

export default function OrdersPage() {
  const { vendorToken } = useContext(VendorAuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      if (!vendorToken) return;
      
      setLoading(true);
      try {
        const result = await batchRequests([
          {
            url: `/orders/vendor/my-orders`,
            options: {
              method: "GET",
              token: vendorToken,
              config: { showToast: false },
            },
          },
        ]);

        const [ordersResult] = result;
        if (ordersResult.success) {
          setOrders(ordersResult.data?.data || []);
        }
      } catch (error) {
        console.error("Error loading orders:", error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [vendorToken]);

  return (
    <VendorLayout>
      <Orders orders={orders} loading={loading} />
    </VendorLayout>
  );
}