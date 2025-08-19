import DesignsTable from '../components/DesignsTable'

export default function DesignsPage() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Designs Management</h1>
      </div>
      
      {/* Designs Table */}
      <div className="mt-6 bg-gray-800 rounded-lg shadow overflow-hidden">
        <DesignsTable />
      </div>
    </div>
  )
}