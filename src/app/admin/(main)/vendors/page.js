import VendorsTable from "../_components/VendorsTable";

export const metadata = {
  title: 'Vendors Management | Admin',
  description: 'Manage all vendors from this admin panel',
};

export default function VendorsPage() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Vendors Management</h1>
      </div>

      {/* Vendors Table */}
      <div className="mt-6 bg-white rounded-lg shadow overflow-hidden">
        <VendorsTable />
      </div>
    </div>
  );
}