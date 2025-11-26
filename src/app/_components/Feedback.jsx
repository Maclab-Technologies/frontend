import { useState } from "react";
import emailjs from "emailjs-com";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Feedback = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    message: "",
  });

  const [openIndex, setOpenIndex] = useState(null);
  const [loading, setLoading] = useState(false);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const sendEmail = async (e) => {
    e.preventDefault();
    setLoading(true);

    emailjs
      .send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
        {
          firstname: formData.firstname,
          lastname: formData.lastname,
          email: formData.email,
          message: formData.message,
          reply_to: formData.email,
          bcc: "59minutesprint@gmail.com",
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
      )
      .then(() => {
        toast.success("✅ Feedback sent successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
        setFormData({ firstname: "", lastname: "", email: "", message: "" });
      })
      .catch((error) => {
        console.error("EmailJS error:", error);
        toast.error("❌ Failed to send feedback. Please try again.", {
          position: "top-right",
          autoClose: 3000,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // FAQ data
  const faqItems = [
    {
      question: "What is 59Minutes Prints?",
      answer: "59Minutes Prints is a fast and reliable on-demand printing service that delivers high-quality print products within 59 minutes of order confirmation for eligible local orders. We offer a wide range of printing services including business cards, flyers, posters, banners, and custom merchandise."
    },
    {
      question: "How fast can I receive my order?",
      answer: "For local orders of standard products, we aim to deliver within 59 minutes of order confirmation. Larger, custom, or bulk orders may require additional production time. Delivery timeframes will be confirmed during checkout based on your location and order specifications."
    },
    {
      question: "What areas do you deliver to?",
      answer: "Our 59-minute delivery service is available in select urban areas. During checkout, you'll be notified if your delivery address qualifies for our express service. We also offer standard shipping nationwide with competitive delivery timeframes."
    },
    {
      question: "What file formats do you accept for printing?",
      answer: "We accept most common file formats including PDF, JPG, PNG, AI, and PSD files. For best results, we recommend submitting print-ready PDF files with at least 300 DPI resolution, CMYK color mode, and proper bleed settings."
    },
    {
      question: "How do I become a vendor on 59Minutes Prints?",
      answer: "To become a vendor, visit our 'Become a Vendor' page and complete the application form. Our team will review your information and contact you within 2-3 business days. Approved vendors can list their products and services on our marketplace."
    },
    {
      question: "What if I'm not satisfied with my order?",
      answer: "Customer satisfaction is our priority. If you're not completely satisfied with your order, please contact our customer service team within 7 days of receiving your order. We'll work with you to resolve any issues and may offer reprints, refunds, or credits depending on the circumstances."
    }
  ];

  return (
    <section className="bg-gradient-to-b from-black to-gray-900 text-white px-4 sm:px-8 py-16">

      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-12">
          <span className="text-yellow-500">Help</span> & Support
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
          {/* Feedback Form */}
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg border border-gray-800">
            <h2 className="bg-yellow-500 text-black font-bold text-center py-2 rounded-md mb-8">Send Us Feedback</h2>
            <form onSubmit={sendEmail} className="space-y-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="block mb-2 font-semibold">Firstname</label>
                  <input
                    type="text"
                    name="firstname"
                    value={formData.firstname}
                    onChange={handleChange}
                    placeholder="First Name"
                    className="w-full px-4 py-2 rounded-lg text-black bg-white"
                    required
                  />
                </div>
                <div className="flex-1">
                  <label className="block mb-2 font-semibold">Lastname</label>
                  <input
                    type="text"
                    name="lastname"
                    value={formData.lastname}
                    onChange={handleChange}
                    placeholder="Last Name"
                    className="w-full px-4 py-2 rounded-lg text-black bg-white"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block mb-2 font-semibold">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  className="w-full px-4 py-2 rounded-lg text-black bg-white"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 font-semibold">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Message"
                  className="w-full px-4 py-2 rounded-lg text-black bg-white h-32"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-yellow-500 text-black font-bold rounded-full hover:bg-yellow-400 transition-colors duration-300 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Feedback"}
              </button>
            </form>
          </div>

          {/* FAQ Accordion */}
          <div>
            <h2 className="bg-yellow-500 text-black font-bold text-center py-2 rounded-md mb-8">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqItems.map((faq, index) => (
                <div 
                  key={index} 
                  className="border border-gray-700 rounded-lg overflow-hidden bg-gray-900"
                >
                  <button
                    className="flex justify-between items-center w-full p-4 text-left font-medium text-white hover:bg-gray-800 transition-colors"
                    onClick={() => toggleFAQ(index)}
                  >
                    <span>{faq.question}</span>
                    {openIndex === index ? (
                      <FaChevronUp className="text-yellow-500" />
                    ) : (
                      <FaChevronDown className="text-yellow-500" />
                    )}
                  </button>
                  <div 
                    className={`px-4 overflow-hidden transition-all duration-300 ${
                      openIndex === index ? "max-h-96 pb-4" : "max-h-0"
                    }`}
                  >
                    <p className="text-gray-300">{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Contact Info */}
            <div className="mt-8 bg-gray-900 p-6 rounded-lg border border-gray-800">
              <h3 className="font-bold text-xl mb-4 text-yellow-500">Still Have Questions?</h3>
              <p className="mb-4">Our customer support team is available to help you with any questions or concerns.</p>
              <ul className="space-y-2 text-gray-300">
                <li><strong>Email:</strong> 59minutesprints@gmail.com</li>
                <li><strong>Phone:</strong> +234 803 551 9472</li>
                <li><strong>Hours:</strong> Monday-Friday, 8am-8pm EST</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Feedback;