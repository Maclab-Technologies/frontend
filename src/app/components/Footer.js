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
    <footer className="bg-gradient-to-b from-black to-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo and Copyright */}
        <div>
          <Image
            src={logo}
            alt="59 Minutes Print"
            width={96}
            height={96}
            className="mb-4 rounded-full shadow-lg"
          /> 
          <br></br>
          <p className="text-sm">
            Copyright <br></br> © 2025 59MinutesPrint. All Rights Reserved.
          </p>
        </div>

        {/* Footer Links */}
        <div>
          <h4 className="font-bold text-lg uppercase mb-2">59MinutesPrint</h4>
          <ul className="space-y-1">
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
                  className="hover:text-yellow-500  decoration-yellow-500"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-lg uppercase mb-2">
            Help and Information
          </h4>
          <ul className="space-y-1">
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
                  className="hover:text-yellow-500  decoration-yellow-500"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-lg uppercase mb-2">Monetize</h4>
          <ul className="space-y-1">
            {[
              { href: "/vendor", label: "Become a Vendor" },
              { href: "/sell-creativity", label: "Sell your Creativity" },
              { href: "/referral", label: "N1,000 Referral Bonus" },
            ].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="hover:text-yellow-500  decoration-yellow-500"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Social Media and Payment Info */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center mt-8">
        {/* Social Media Icons */}
        <div className="flex space-x-4">
          <Link href="https://facebook.com">
            <FaFacebookF className="text-xl cursor-pointer hover:text-yellow-500 transform hover:scale-110 transition-all" />
          </Link>
          <Link href="https://instagram.com">
            <FaInstagram className="text-xl cursor-pointer hover:text-yellow-500 transform hover:scale-110 transition-all" />
          </Link>
          <Link href="https://twitter.com">
            <FaTwitter className="text-xl cursor-pointer hover:text-yellow-500 transform hover:scale-110 transition-all" />
          </Link>
          <Link href="mailto:info@59minutesprint.com">
            <FaEnvelope className="text-xl cursor-pointer hover:text-yellow-500 transform hover:scale-110 transition-all" />
          </Link>
        </div>

        {/* Payment Methods */}
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-8 mt-4 md:mt-0">
          <div>
            <h4 className="font-bold uppercase">Accepted Payment</h4>
            <div className="p-2 bg-gray-800 rounded-lg inline-block mt-2">
              <Image
                src={paystacklogo}
                alt="Paystack"
                width={100}
                height={50}
                className="w-35"
              />
            </div>
            <div className="p-2 bg-gray-800 rounded-lg inline-block mt-2 mx-4">
              <Image
                src={Flutterwavelogo}
                alt="Flutterwave"
                width={100}
                height={50}
                className="w-35"
              />
            </div>
          </div>

          <div>
            <h4 className="font-bold uppercase">Delivery</h4>
            <div className="p-2 rounded-lg inline-block mt-2">
              <Image
                src={GIGlogo}
                alt="Delivery"
                width={100}
                height={50}
                className="w-35"
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
