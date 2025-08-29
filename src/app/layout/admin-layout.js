import Sidebar from "../admin/_components/shared/Sidebar";
import SideNav from "../admin/_components/UI/sidenav";

export default function AdminNavLayout(children) {
  return (
    <div>
      <SideNav />
      <div className="p-4 lg:p-6">
        {/* Main content goes here */}
        {children}
      </div>
    </div>
  );
}
