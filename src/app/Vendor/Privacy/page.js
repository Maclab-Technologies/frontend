import Link from "next/link";

const PrivacyPolicy = () => {
  return (
    <section className="max-w-6xl mx-auto py-16 px-6 text-gray-200 bg-gray-900 rounded-lg shadow-lg">
      {/* Header */}
      <h1 className="text-4xl font-extrabold text-yellow-400 text-center mb-4">
        Privacy Policy
      </h1>

      <p className="text-lg text-gray-300 text-center mb-10">
        This Privacy Policy explains how <strong>59Minutes Print</strong> collects, uses, and protects vendor information.
      </p>

      {/* Policy Sections */}
      <div className="space-y-8">
        {[
          {
            title: "1. What Data We Collect",
            content: "We collect vendor details such as business name, email, phone number, and payment information.",
          },
          {
            title: "2. How We Use Your Data",
            content: "Your data is used for account management, payment processing, and improving our services.",
          },
          {
            title: "3. Data Protection & Security",
            content: "We implement strict security measures, including encryption, to keep your information safe.",
          },
          {
            title: "4. Sharing & Third-Party Services",
            content: "We do not sell your data. Some data may be shared with payment providers like Paystack & Flutterwave for transactions.",
          },
          {
            title: "5. Vendor Rights & Data Deletion",
            content: "You can request to delete your account and associated data by contacting support.",
          },
        ].map((section, index) => (
          <div key={index} className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-yellow-300 mb-3">{section.title}</h2>
            <p className="text-gray-400">{section.content}</p>
          </div>
        ))}
      </div>

      {/* Contact & CTA */}
      <div className="mt-10 text-center">
        <p className="text-gray-300">
          Have questions? Contact us via our  
          <Link href="/contact" className="text-yellow-400 underline ml-1">Support Page</Link>.
        </p>

        <button
          className="mt-6 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-full transition-all duration-300 shadow-lg transform hover:scale-105"
        >
          Contact Support
        </button>
      </div>
    </section>
  );
};

export default PrivacyPolicy;
