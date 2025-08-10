import PayoutsTable from '../components/Payouts/PayoutsTable'
import PayoutSummary from '../components/Payouts/PayoutSummary'

export default function PayoutsPage() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Payouts Management</h1>
      </div>
      
      {/* Payout Summary */}
      <PayoutSummary />
      
      {/* Payouts Table */}
      <div className="mt-6 bg-white rounded-lg shadow overflow-hidden">
        <PayoutsTable />
      </div>
    </div>
  )
}