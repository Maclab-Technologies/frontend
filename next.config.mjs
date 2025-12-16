/** @type {import('next').NextConfig} */
// next.config.js
const nextConfig = {
   images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "thumbs.dreamstime.com",
        port: "",
        pathname: "/b/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com"
      }
    ],
  },
};

export default nextConfig;
