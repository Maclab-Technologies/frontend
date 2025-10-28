import SideNav from "./_components/SideNav";

export default function DashboardLayout({ children }) {
  return (
    <div className="bg-gray-900 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Side Navigation */}
          <SideNav />

          {/* Main Content Area */}
          <main className="flex-1">{children}</main>
        </div> 
      </div>
    </div>
  );
}
