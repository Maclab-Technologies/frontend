"use client";

import Image from "next/image";
import Link from "next/link";
import logo from "../../../public/images/brandimage.jpeg";
import paystacklogo from "../../../public/images/Paystack_Logo.png";
import Flutterwavelogo from "../../../public/images/Flutterwave_Logo.png";
import GIGlogo from "../../../public/images/GIG_Logistics_logo.png";
import { FaFacebookF, FaInstagram, FaTwitter, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#171301] text-white p-8 border-t-4 border-t-yellow-400">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo and Copyright */}
        <div>
          <Image
            src={logo}
            alt="59 Minutes Print"
            width={96}
            height={96}
            className="mb-4 rounded shadow-lg"
          />
          <p className="text-base">
            Copyright © 2025 59MinutesPrint.<br />
            All Rights Reserved.
          </p>
        </div>

        {/* Footer Links */}
        <div>
          <h4 className="font-bold text-lg uppercase mb-4">59MinutesPrint</h4>
          <ul className="space-y-2">
            {[
              { href: "/About", label: "About Us" },
              { href: "/Career", label: "Career" },
              { href: "/contact", label: "Contact Us" },
              { href: "/blog", label: "Our Blog" },
              { href: "/promise", label: "Our Promise" },
              { href: "/track-orders", label: "Track Orders" },
            ].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="hover:text-yellow-500 transition-colors duration-200"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-lg uppercase mb-4">
            Help and Information
          </h4>
          <ul className="space-y-2">
            {[
              { href: "/material-quality", label: "Material Quality" },
              { href: "/shipping", label: "Shipping and Delivery" },
              { href: "/font-licenses", label: "Font Licenses" },
              { href: "/privacy-policy", label: "Privacy Policy" },
              { href: "/terms", label: "Terms and Conditions" },
            ].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="hover:text-yellow-500 transition-colors duration-200"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-lg uppercase mb-4">Monetize</h4>
          <ul className="space-y-2">
            {[
              { href: "/Vendor", label: "Become a Vendor" },
              { href: "/sell-creativity", label: "Sell your Creativity" },
              { href: "/referral", label: "N1,000 Referral Bonus" },
            ].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="hover:text-yellow-500 transition-colors duration-200"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      {/* Social Media Section */}
      <div className="max-w-7xl mx-auto mt-10">
        <h4 className="font-bold text-lg uppercase mb-4 text-center md:text-left">Follow us on social Media</h4>
        
        {/* Social Media and Payment Info */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-4">
          {/* Social Media Icons */}
          <div className="flex space-x-6">
            <Link href="https://facebook.com" aria-label="Facebook">
              <FaFacebookF className="text-3xl cursor-pointer hover:text-yellow-500 transform hover:scale-110 transition-all" />
            </Link>
            <Link href="https://instagram.com" aria-label="Instagram">
              <FaInstagram className="text-3xl cursor-pointer hover:text-yellow-500 transform hover:scale-110 transition-all" />
            </Link>
            <Link href="https://twitter.com" aria-label="Twitter">
              <FaTwitter className="text-3xl cursor-pointer hover:text-yellow-500 transform hover:scale-110 transition-all" />
            </Link>
            <Link href="mailto:59minutesprints@gmail.com" aria-label="Email">
              <FaEnvelope className="text-3xl cursor-pointer hover:text-yellow-500 transform hover:scale-110 transition-all" />
            </Link>
          </div>

          {/* Payment Methods */}
          <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-8 mt-6 md:mt-0">
            <div>
              <h4 className="font-bold uppercase mb-2 text-center md:text-left">Accepted Payment</h4>
              <div className="flex space-x-4">
                <div className="p-2 bg-gray-800 rounded-lg inline-block">
                  <Image
                    src={paystacklogo}
                    alt="Paystack"
                    width={100}
                    height={50}
                    className="h-8 w-auto"
                  />
                </div>
                <div className="p-2 bg-gray-800 rounded-lg inline-block">
                  <Image
                    src={Flutterwavelogo}
                    alt="Flutterwave"
                    width={100}
                    height={50}
                    className="h-8 w-auto"
                  />
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-bold uppercase mb-2 text-center md:text-left">Delivery</h4>
              <div className="p-2 rounded-lg inline-block">
                <Image
                  src={GIGlogo}
                  alt="GIG Logistics"
                  width={100}
                  height={50}
                  className="h-8 w-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;