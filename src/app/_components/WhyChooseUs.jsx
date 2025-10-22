"use client";

const WhyChooseUs = () => {
  const features = [
    {
      icon: "🚚",
      title: "Lightning-Fast Delivery",
      description: "Get select prints in as fast as 59 minutes Anywhere in Nigeria.",
    },
    {
      icon: "💰",
      title: "Affordable & Transparent Pricing",
      description: "No hidden charges. Get premium prints without breaking the bank.",
    },
    {
      icon: "🏆",
      title: "Premium Quality Guaranteed",
      description: "Sharp, vibrant, and professional-grade prints for all your needs.",
    },
    {
      icon: "📦",
      title: "Bulk & Custom Orders",
      description: "Whether you need one print or thousands, we handle it all seamlessly.",
    },
    {
      icon: "🛒",
      title: "Hassle-Free Online Ordering",
      description: "Order from anywhere and get it delivered to your doorstep.",
    },
    {
      icon: "🌱",
      title: "Eco-Friendly Printing",
      description: "We use sustainable materials and eco-friendly processes for a greener planet.",
    },
  ];

  return (
    <section className="bg-black text-white px-8 py-16">
      <div className="text-center mb-12">
        <h2 className="text-2xl font-bold mb-4">
          Get High-Quality Prints Delivered in Record Time!
        </h2>
        <p className="text-gray-300">
          Need fast, top-quality prints for your business or event? We've
          got you covered! From corporate branding materials to event
          banners, we print and deliver with speed and precision.
        </p>
      </div>

      <div className="text-center mb-12">
        <button className="bg-yellow-500 text-black font-bold py-3 px-6 rounded-md">
          Why Choose Us?
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-12">
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-center border-2 rounded-md border-yellow-400 p-6"
          >
            <span className="text-yellow-500 text-5xl mb-4">
              {feature.icon}
            </span>
            <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
            <p className="text-gray-300">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhyChooseUs;