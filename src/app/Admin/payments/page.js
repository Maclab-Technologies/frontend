import PaymentsTable from '../components/Payments/PaymentsTable'
import RevenueSummary from '../components/Payments/RevenueSummary'

export default function PaymentsPage() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Payments Overview</h1>
      </div>
      
      {/* Revenue Summary */}
      <RevenueSummary />
      
      {/* Payments Table */}
      <div className="mt-6 bg-white rounded-lg shadow overflow-hidden">
        <PaymentsTable />
      </div>
    </div>
  )
}