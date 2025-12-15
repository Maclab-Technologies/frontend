// app/(admin)/admin/promos/page.jsx
import PromosTable from "../_components/PromosTable";

export const metadata = {
  title: 'Promotions Management | Admin',
  description: 'Manage all promotional codes from this admin panel',
};

export default function PromosPage() {
  return (
    <div className="p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl md:text-2xl font-bold">Promotions Management</h1>
      </div>

      

      {/* Promos Table */}
      <div className="mt-6 bg-gray-800 rounded-lg shadow overflow-hidden">
        <PromosTable />
      </div>
    </div>
  );
}