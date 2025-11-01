// vendor/manage-products/page.jsx
"use client";

import { useContext, useEffect, useState } from "react";
import { batchRequests } from "@/app/_hooks/fetch-hook";
import VendorLayout from "../_components/vendor-layout";
import ManageProducts from "../_components/manage-product";
import { VendorAuthContext } from "../_provider/useVendorProvider";

export default function ManageProductsPage() {
  const { vendorToken, authVendor } = useContext(VendorAuthContext);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const loadProducts = async () => {
      if (!vendorToken || !authVendor?.id) return;
      
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
        ]);

        const [productsResult] = result;
        if (productsResult.success) {
          setProducts(productsResult.data?.data || []);
        }
      } catch (error) {
        console.error("Error loading products:", error);
      }
    };

    loadProducts();
  }, [vendorToken, authVendor]);

  return (
    <VendorLayout>
      <ManageProducts
        products={products}
        setProducts={setProducts}
        vendorToken={vendorToken}
      />
    </VendorLayout>
  );
}