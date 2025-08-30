import "react-toastify/dist/ReactToastify.css";
import SideNav from "./(main)/_components/UI/sidenav";
import { AdminAuthMiddleware } from "../_middleware/useAuthMiddleware";
import { AdminAuthProvider } from "./(main)/_provider/useAdminProvider";

const AdminLayout = ({ children }) => {
  return (
    <AdminAuthProvider>
      <AdminAuthMiddleware>
        {children}
      </AdminAuthMiddleware>
    </AdminAuthProvider>
  );
};

export default AdminLayout;
