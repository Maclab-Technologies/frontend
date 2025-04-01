import Link from "next/link";

const TermsConditions = () => {
  return (
    <section className="max-w-6xl mx-auto py-16 px-6 text-gray-200 bg-gray-900 rounded-lg shadow-lg">
      {/* Header */}
      <h1 className="text-4xl font-extrabold text-yellow-400 text-center mb-4">
        Vendor Terms & Conditions
      </h1>

      <p className="text-lg text-gray-300 text-center mb-10">
        Please read these terms carefully before using the <strong>59Minutes Print</strong> Vendor Portal.
      </p>

      {/* Terms Sections */}
      <div className="space-y-8">
        {[
          {
            title: "1. Vendor Registration & Account Security",
            content: "Vendors must provide accurate business information and secure their login credentials.",
          },
          {
            title: "2. Product Listing & Quality Standards",
            content: "Only original or authorized designs are allowed. Prohibited content includes copyrighted materials.",
          },
          {
            title: "3. Order Processing & Fulfillment",
            content: "Vendors must fulfill orders within 24-48 hours to avoid penalties.",
          },
          {
            title: "4. Payment & Revenue Sharing",
            content: "Vendors earn 80% per sale, and payments are processed via Bank Transfer, Paystack, or Flutterwave.",
          },
          {
            title: "5. Refunds, Cancellations & Dispute Resolution",
            content: "Refunds are only granted for defective or incorrect orders. Disputes must be resolved within 48 hours.",
          },
          {
            title: "6. Account Termination & Suspension",
            content: "Accounts may be suspended for fraud, policy violations, or repeated late deliveries.",
          },
          {
            title: "7. Changes to Terms & Conditions",
            content: "59Minutes Print may update these terms, and vendors will be notified accordingly.",
          },
        ].map((section, index) => (
          <div key={index} className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-yellow-300 mb-3">{section.title}</h2>
            <p className="text-gray-400">{section.content}</p>
          </div>
        ))}
      </div>

      {/* Privacy Policy & CTA */}
      <div className="mt-10 text-center">
        <p className="text-gray-300">
          By using this platform, you also agree to our  
          <Link href="/Vendor/Privacy" className="text-yellow-400 underline ml-1">Privacy Policy</Link>.
        </p>

        <button
          className="mt-6 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-full transition-all duration-300 shadow-lg transform hover:scale-105"
        >
          Accept & Continue
        </button>
      </div>
    </section>
  );
};

export default TermsConditions;
