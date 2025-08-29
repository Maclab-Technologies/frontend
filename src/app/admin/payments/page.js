import { AdminAuth } from "@/app/context/useAuthMiddleware";
import PaymentsTable from "../components/PaymentsTable";
import RevenueSummary from "../components/RevenueSummary";

export const metadata = {
  title: "Payments Overview | Admin",
  description: "Overview of all payments and revenue from this admin panel",
};

export default function PaymentsPage() {
  // const {role, isLoggedIn, isLoading, authUser } = useContext(AuthContext)
  // AdminAuth( role, isLoggedIn, isLoading, authUser);
  // AdminAuth()

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Payments Overview</h1>
      </div>

      {/* Revenue Summary */}
      <RevenueSummary />

      {/* Payments Table */}
      <div className="mt-6 bg-gray-900 rounded-lg shadow overflow-hidden">
        <PaymentsTable />
      </div>
    </div>
  );
}
