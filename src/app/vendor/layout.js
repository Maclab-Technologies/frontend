import VendorNavLayout from "../_layout/vendor-layout";
import { VendorAuthMiddleware } from "../_middleware/useAuthMiddleware";
import { VendorAuthProvider } from "./_provider/useVendorProvider";

const Layout = ({children}) => {
  return (
    <VendorAuthProvider>
      <VendorAuthMiddleware>
        <VendorNavLayout />
        <div className="p-4 lg:p-6">
          {/* Main content goes here */}
          {children}
        </div>
      </VendorAuthMiddleware>
    </VendorAuthProvider>
  );
};

export default Layout;
