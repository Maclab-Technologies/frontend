// vendor/withdraw/page.jsx
"use client";

import { useContext, useEffect, useState } from "react";
import { batchRequests } from "@/app/_hooks/fetch-hook";
import VendorLayout from "../_components/vendor-layout";
import Withdraw from "../_components/withdraw";
import { VendorAuthContext } from "../_provider/useVendorProvider";

export default function WithdrawPage() {
  const { vendorToken, authVendor } = useContext(VendorAuthContext);
  const [summary, setSummary] = useState({});

  useEffect(() => {
    const loadSummary = async () => {
      if (!vendorToken || !authVendor?.id) return;
      
      try {
        const result = await batchRequests([
          {
            url: `/payments/vendor/${authVendor.id}/summary`,
            options: {
              method: "GET",
              token: vendorToken,
              config: { showToast: false },
            },
          },
        ]);

        const [statsSummary] = result;
        if (statsSummary.success) {
          setSummary(statsSummary.data?.data || {});
        }
      } catch (error) {
        console.error("Error loading summary:", error);
      }
    };

    loadSummary();
  }, [vendorToken, authVendor]);

  return (
    <VendorLayout>
      <Withdraw
        vendorData={authVendor}
        summary={summary}
        vendorToken={vendorToken}
      />
    </VendorLayout>
  );
}