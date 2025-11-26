// vendor/create-product/page.jsx
"use client";

import { useContext, useState } from "react";
import VendorLayout from "../_components/vendor-layout";
import CreateProduct from "../_components/create-product";
import { VendorAuthContext } from "../_provider/useVendorProvider";

export default function CreateProductPage() {
  const { vendorToken, authVendor } = useContext(VendorAuthContext);
  const [products, setProducts] = useState([]);

  return (
    <VendorLayout>
      <CreateProduct
        products={products}
        setProducts={setProducts}
        vendorToken={vendorToken}
        vendorId={authVendor?.id}
      />
    </VendorLayout>
  );
}