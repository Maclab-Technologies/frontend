import { useState } from "react";
import emailjs from "emailjs-com";
import { FaChevronDown } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
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
        "service_s6q2eq9",
        "template_li0k6lc",
        {
          firstname: formData.firstname,
          lastname: formData.lastname,
          email: formData.email,
          message: formData.message,
          reply_to: formData.email,
          bcc: "59minutesprint@gmail.com",
        },
        "we_RK3ND6zgwH-WxT"
      )
      .then(() => {
        toast.success("✅ Feedback sent successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
        setFormData({ firstname: "", lastname: "", email: "", message: "" });
      })
      .catch(() => {
        toast.error("❌ Failed to send feedback. Please try again.", {
          position: "top-right",
          autoClose: 3000,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <section className="bg-black text-white px-8 py-16">
      {/* Toast Notifications */}
      <ToastContainer />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        {/* Feedback Form */}
        <div>
          <h2 className="bg-yellow-500 text-black font-bold text-center py-2 rounded-md mb-8">Feedback</h2>
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
              className="w-full py-3 bg-yellow-500 text-black font-bold rounded-full hover:bg-yellow-600 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Feedback"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Feedback;
