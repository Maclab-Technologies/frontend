"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "../../../../public/images/brandimage.jpeg";

const TermsAndConditions = () => {
  const [activeSection, setActiveSection] = useState("terms");

  const sections = [
    { id: "terms", title: "Terms of Use", color: "yellow" },
    { id: "privacy", title: "Privacy Policy", color: "blue" },
    { id: "shipping", title: "Shipping Policy", color: "green" },
    { id: "refund", title: "Refund Policy", color: "red" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <Link 
            href="/" 
            className="inline-block mb-6 transform hover:scale-105 transition-transform duration-200"
          >
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Image
                  src={logo}
                  alt="59 Minutes Print Logo"
                  width={100}
                  height={100}
                  className="rounded-2xl shadow-2xl border-4 border-gray-700"
                />
                <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl -z-10 opacity-20 blur-sm"></div>
              </div>
              
            </div>
          </Link>
          
          <div className="max-w-2xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
              Terms & 
              <span className="block bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
                Conditions
              </span>
            </h1>
            <p className="text-gray-400 text-lg">
              Last Updated: <span className="text-yellow-400 font-semibold">26-11-2025</span>
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-700/50 p-6 mb-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`
                  relative px-4 py-4 rounded-xl font-semibold transition-all duration-300 
                  transform hover:scale-105 active:scale-95 border-2
                  ${
                    activeSection === section.id
                      ? `
                        text-white shadow-2xl border-transparent
                        ${section.color === 'yellow' ? 'bg-yellow-500' : ''}
                        ${section.color === 'blue' ? 'bg-blue-500' : ''}
                        ${section.color === 'green' ? 'bg-green-500' : ''}
                        ${section.color === 'red' ? 'bg-red-500' : ''}
                      `
                      : `
                        bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 border-gray-600
                        hover:shadow-lg
                      `
                  }
                `}
              >
                {section.title}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-700/50 overflow-hidden">
          {/* Terms of Use */}
          {activeSection === "terms" && (
            <div className="p-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
                <h2 className="text-3xl font-black text-white mb-4 lg:mb-0">
                  Terms of <span className="text-yellow-400">Use</span>
                </h2>
                <span className="bg-yellow-500/20 text-yellow-400 px-4 py-2 rounded-full text-sm font-semibold border border-yellow-500/30">
                  Last Updated: 26-11-2025
                </span>
              </div>

              <div className="space-y-8">
                {[
                  {
                    title: "1. Acceptance of Terms",
                    content: "By accessing or using our website www.59minutesprint.com, you acknowledge that you have read, understood, and agree to be bound by these Terms."
                  },
                  {
                    title: "2. Our Services",
                    content: "59MinutesPrint provides online printing services that include same-day printing, express 59-minute printing, and delivery of printed materials. We operate an aggregator model using vetted print vendors and third-party logistics partners."
                  },
                  {
                    title: "3. User Responsibilities",
                    list: [
                      "Provide accurate information when placing an order",
                      "Upload only materials you have rights and permission to use",
                      "Ensure your design/content does not violate copyright, trademarks, or Nigerian laws"
                    ],
                    additional: "We reserve the right to reject any order that contains offensive, illegal, or infringing content."
                  },
                  {
                    title: "4. Order Processing",
                    list: [
                      "Orders begin processing once payment is confirmed",
                      "For 59-minute orders, the countdown starts after file approval and payment confirmation",
                      "Delivery timelines may vary depending on location, vendor availability, and logistics"
                    ]
                  },
                  {
                    title: "5. Pricing & Payment",
                    content: "Payments are made securely through Paystack. Prices listed on the website may change due to market conditions, vendor pricing, or logistics fees."
                  },
                  {
                    title: "6. Intellectual Property",
                    content: "All website content, branding, designs, and systems belong to 59MinutesPrint and may not be copied or reproduced without permission."
                  },
                  {
                    title: "7. Limitation of Liability",
                    list: [
                      "Delays caused by vendors, logistics companies, or issues beyond our control",
                      "Poor quality designs submitted by customers",
                      "Losses resulting from errors in customer-provided files"
                    ]
                  },
                  {
                    title: "8. Termination",
                    content: "We may suspend or terminate your access if you violate these Terms."
                  },
                  {
                    title: "9. Governing Law",
                    content: "These Terms are governed by the laws of the Federal Republic of Nigeria."
                  }
                ].map((item, index) => (
                  <section key={index} className="group">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-xl flex items-center justify-center text-black font-bold text-sm shadow-lg">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-yellow-400 transition-colors">
                          {item.title}
                        </h3>
                        {item.content && (
                          <p className="text-gray-300 leading-relaxed">
                            {item.content}
                          </p>
                        )}
                        {item.list && (
                          <>
                            <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                              {item.list.map((listItem, listIndex) => (
                                <li key={listIndex} className="leading-relaxed">
                                  {listItem}
                                </li>
                              ))}
                            </ul>
                            {item.additional && (
                              <p className="text-gray-300 mt-3 leading-relaxed">
                                {item.additional}
                              </p>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                    {index < 8 && <div className="border-b border-gray-700 mt-6"></div>}
                  </section>
                ))}
              </div>
            </div>
          )}

          {/* Privacy Policy */}
          {activeSection === "privacy" && (
            <div className="p-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
                <h2 className="text-3xl font-black text-white mb-4 lg:mb-0">
                  Privacy <span className="text-blue-400">Policy</span>
                </h2>
                <span className="bg-blue-500/20 text-blue-400 px-4 py-2 rounded-full text-sm font-semibold border border-blue-500/30">
                  Last Updated: 26-11-2025
                </span>
              </div>

              <div className="space-y-8">
                {[
                  {
                    title: "1. Information We Collect",
                    list: [
                      "Name, phone number, email address",
                      "Delivery address",
                      "Payment information (processed securely via Paystack — we do not store card details)",
                      "Uploaded design files",
                      "Order and usage data"
                    ]
                  },
                  {
                    title: "2. How We Use Your Information",
                    list: [
                      "Process and deliver your orders",
                      "Provide customer support",
                      "Improve our services",
                      "Communicate order updates, promotions, and important notices (you may opt out anytime)"
                    ]
                  },
                  {
                    title: "3. Sharing of Information",
                    list: [
                      "Verified print vendors (to process your order)",
                      "Delivery/logistics partners (to deliver your materials)",
                      "Paystack (for secure payment processing)",
                      "Legal authorities when required by law"
                    ],
                    additional: "We do NOT sell or trade your information."
                  },
                  {
                    title: "4. Data Protection",
                    content: "We implement appropriate technical and organizational measures to protect your information from unauthorized access."
                  },
                  {
                    title: "5. Cookies",
                    content: "Our website uses cookies to improve the user experience and analyze traffic."
                  },
                  {
                    title: "6. Your Rights",
                    list: [
                      "Access to your personal data",
                      "Corrections or updates",
                      "Deletion of your account"
                    ]
                  },
                  {
                    title: "7. Updates to This Policy",
                    content: "We may update this privacy policy occasionally. Continued use of our site means you accept the updated terms."
                  }
                ].map((item, index) => (
                  <section key={index} className="group">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                          {item.title}
                        </h3>
                        {item.content && (
                          <p className="text-gray-300 leading-relaxed">
                            {item.content}
                          </p>
                        )}
                        {item.list && (
                          <>
                            <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                              {item.list.map((listItem, listIndex) => (
                                <li key={listIndex} className="leading-relaxed">
                                  {listItem}
                                </li>
                              ))}
                            </ul>
                            {item.additional && (
                              <p className="text-gray-300 mt-3 leading-relaxed font-semibold">
                                {item.additional}
                              </p>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                    {index < 6 && <div className="border-b border-gray-700 mt-6"></div>}
                  </section>
                ))}
              </div>
            </div>
          )}

          {/* Shipping Policy */}
          {activeSection === "shipping" && (
            <div className="p-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
                <h2 className="text-3xl font-black text-white mb-4 lg:mb-0">
                  Shipping <span className="text-green-400">Policy</span>
                </h2>
                <span className="bg-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm font-semibold border border-green-500/30">
                  Last Updated: 26-11-2025
                </span>
              </div>

              <div className="space-y-8">
                {[
                  {
                    title: "1. Delivery Areas",
                    list: [
                      "Lagos",
                      "Abuja",
                      "Nationwide delivery for selected products"
                    ]
                  },
                  {
                    title: "2. Delivery Timeline",
                    list: [
                      "59-minute Express Orders: Delivered within 59 minutes of payment confirmation + file approval",
                      "Same-Day Delivery: Orders placed before cut-off time (usually 12 PM) are delivered same day",
                      "Standard Delivery: 1–3 business days depending on location"
                    ]
                  },
                  {
                    title: "3. Delivery Partners",
                    content: "We use third-party logistics companies. Delays caused by transportation, weather, or traffic are outside our control, but we will support you until your order is delivered."
                  },
                  {
                    title: "4. Delivery Fees",
                    content: "Delivery fees vary by location and will be displayed at checkout."
                  },
                  {
                    title: "5. Order Tracking",
                    content: "Customers receive tracking updates via SMS, WhatsApp, or email."
                  }
                ].map((item, index) => (
                  <section key={index} className="group">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-green-400 transition-colors">
                          {item.title}
                        </h3>
                        {item.content && (
                          <p className="text-gray-300 leading-relaxed">
                            {item.content}
                          </p>
                        )}
                        {item.list && (
                          <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                            {item.list.map((listItem, listIndex) => (
                              <li key={listIndex} className="leading-relaxed">
                                {listItem}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                    {index < 4 && <div className="border-b border-gray-700 mt-6"></div>}
                  </section>
                ))}
              </div>
            </div>
          )}

          {/* Refund Policy */}
          {activeSection === "refund" && (
            <div className="p-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
                <h2 className="text-3xl font-black text-white mb-4 lg:mb-0">
                  Refund <span className="text-red-400">Policy</span>
                </h2>
                <span className="bg-red-500/20 text-red-400 px-4 py-2 rounded-full text-sm font-semibold border border-red-500/30">
                  Last Updated: 26-11-2025
                </span>
              </div>

              <div className="space-y-8">
                {[
                  {
                    title: "1. Non-Refundable Items",
                    content: "Because all items are custom-printed, refunds are generally not available after printing has started."
                  },
                  {
                    title: "2. Where Refunds Apply",
                    list: [
                      "We printed the wrong design compared to the file you uploaded",
                      "The product delivered is damaged",
                      "The product quality is significantly below what was advertised"
                    ]
                  },
                  {
                    title: "3. Where Refunds Do NOT Apply",
                    list: [
                      "Design errors made by the customer",
                      "Low-quality images uploaded by the customer",
                      "Customer changing their mind after printing begins",
                      "Delays caused by third-party delivery companies"
                    ]
                  },
                  {
                    title: "4. How to Request a Refund",
                    list: [
                      "Order number",
                      "Photos or video of the issue",
                      "Clear explanation of the complaint"
                    ],
                    additional: "We will review and provide a resolution within 48 hours."
                  },
                  {
                    title: "5. Refund Method",
                    content: "Approved refunds are processed through Paystack back to the original payment method within 3–7 business days."
                  }
                ].map((item, index) => (
                  <section key={index} className="group">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-red-400 transition-colors">
                          {item.title}
                        </h3>
                        {item.content && (
                          <p className="text-gray-300 leading-relaxed">
                            {item.content}
                          </p>
                        )}
                        {item.list && (
                          <>
                            <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                              {item.list.map((listItem, listIndex) => (
                                <li key={listIndex} className="leading-relaxed">
                                  {listItem}
                                </li>
                              ))}
                            </ul>
                            {item.additional && (
                              <p className="text-gray-300 mt-3 leading-relaxed">
                                {item.additional}
                              </p>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                    {index < 4 && <div className="border-b border-gray-700 mt-6"></div>}
                  </section>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-gray-700/50">
            <p className="text-gray-300 text-lg mb-4">
              Need help?{" "}
              <Link 
                href="/contact" 
                className="text-yellow-400 hover:text-yellow-300 font-semibold underline decoration-2 decoration-yellow-500 hover:decoration-yellow-400 transition-all"
              >
                Contact our support team
              </Link>
            </p>
            <p className="text-gray-500 text-sm">
              © 2025 59MinutesPrint. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;