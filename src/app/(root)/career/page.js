"use client";

import Image from "next/image";

const services = [
  {
    title: "Business & Corporate Stationery",
    description:
      "Letterheads, business cards, invoices, branded envelopes & more.",
    icon: "🏢",
  },
  {
    title: "Marketing Materials",
    description: "Flyers, brochures, posters, banners, and promotional items.",
    icon: "📊",
  },
  {
    title: "Event Printing",
    description:
      "Invitations, souvenirs, roll-up banners, backdrops, and branded items.",
    icon: "🎉",
  },
  {
    title: "Custom & Bulk Printing",
    description: "Personalized prints for businesses, events, and campaigns.",
    icon: "🖨️",
  },
];

const howItWorksSteps = [
  {
    step: "1",
    description:
      "We Print It Fast – Our expert printing partners work on your order immediately.",
  },
  {
    step: "2",
    description:
      "Select your print type, upload your design, and confirm your order.",
  },
  {
    step: "3",
    description:
      "Receive Your Order – Get your prints delivered to your doorstep or pick them up at our designated points.",
  },
];

const whomWeServe = [
  {
    title: "Small Businesses",
    description:
      "Empowering small businesses with professional marketing and branding materials.",
    icon: "🏪",
  },
  {
    title: "Corporate Enterprises",
    description:
      "Delivering high-quality stationery and custom prints for corporate needs.",
    icon: "💼",
  },
  {
    title: "Event Planners",
    description:
      "Providing vibrant event printing solutions for invitations, banners, and decor.",
    icon: "🎉",
  },
  {
    title: "Educational Institutions",
    description:
      "Supporting schools and universities with brochures, posters, and promotional materials.",
    icon: "🏫",
  },
  {
    title: "Nonprofits",
    description:
      "Helping nonprofits create awareness with impactful marketing materials.",
    icon: "🤝",
  },
  {
    title: "Individuals",
    description:
      "Offering personalized prints for personal projects, events, and more.",
    icon: "👤",
  },
];

const Career = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-yellow-500 text-black text-center py-20">
        <h1 className="text-4xl font-bold">Career</h1>
      </section>

      {/* Our Services Section */}
      <section className="bg-black text-white py-12 px-4">
        <h2 className="text-yellow-400 text-2xl font-bold text-center mb-8">
          Our Services
        </h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="text-center p-4 border border-gray-700 rounded-lg"
            >
              <div className="text-5xl mb-4">{service.icon}</div>
              <h3 className="text-lg font-bold mb-2">{service.title}</h3>
              <p className="text-sm">{service.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-black text-white py-12 px-4">
        <h2 className="text-yellow-400 text-2xl font-bold text-center mb-8">
          How It Works
        </h2>
        <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {howItWorksSteps.map((item, index) => (
            <div
              key={index}
              className="text-center p-4 border border-gray-700 rounded-lg"
            >
              <div className="text-3xl font-bold bg-yellow-400 text-black w-10 h-10 rounded-full mx-auto mb-4 flex items-center justify-center">
                {item.step}
              </div>
              <p className="text-sm">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Whom We Serve Section */}
      <section className="bg-yellow-400 text-black py-12 px-4">
        <h2 className="text-2xl font-bold text-center mb-8">Whom We Serve</h2>
        <p className="text-center max-w-2xl mx-auto mb-12">
          We cater to a diverse range of clients, providing tailored solutions
          for their unique needs. From businesses to individuals, we serve all
          with dedication and excellence.
        </p>
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {whomWeServe.map((item, index) => (
            <div
              key={index}
              className="bg-black p-6 rounded-lg shadow-lg text-center transform hover:-translate-y-2 transition-transform"
            >
              <div className="text-5xl mb-4">{item.icon}</div>
              <h3 className="text-lg font-bold mb-2 text-yellow-400">
                {item.title}
              </h3>
              <p className="text-sm text-white">{item.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Career;
