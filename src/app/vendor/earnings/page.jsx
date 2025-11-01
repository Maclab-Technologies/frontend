// vendor/earnings/page.jsx
"use client";

import { useContext, useEffect, useState } from "react";
import { batchRequests } from "@/app/_hooks/fetch-hook";
import VendorLayout from "../components/vendor-layout";
import Earnings from "../components/earning";
import { VendorAuthContext } from "../_provider/useVendorProvider";

export default function EarningsPage() {
  const { vendorToken, authVendor } = useContext(VendorAuthContext);
  const [loading, setLoading] = useState(true);
  const [earnings, setEarnings] = useState([]);
  const [earningsStats, setEarningsStats] = useState({});

  useEffect(() => {
    const loadEarningsData = async () => {
      if (!vendorToken || !authVendor?.id) return;
      
      setLoading(true);
      try {
        const result = await batchRequests([
          {
            url: `/payments/vendor/${authVendor.id}`,
            options: {
              method: "GET",
              token: vendorToken,
              config: { showToast: false },
            },
          },
          {
            url: `/payments/earnings/stats/${authVendor.id}`,
            options: {
              method: "GET",
              token: vendorToken,
              config: { showToast: false },
            },
          },
        ]);

        const [earningsResult, earningStats] = result;

        if (earningsResult.success) {
          setEarnings(earningsResult.data?.data || []);
        }

        if (earningStats.success) {
          setEarningsStats(earningStats.data?.data || {});
        }

      } catch (error) {
        console.error("Error loading earnings data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadEarningsData();
  }, [vendorToken, authVendor]);

  return (
    <VendorLayout>
      <Earnings
        earnings={earnings}
        earningsStats={earningsStats}
        loading={loading}
      />
    </VendorLayout>
  );
}