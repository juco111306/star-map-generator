/** @type {import('next').NextConfig} */
const backendUrl = (
  process.env.BACKEND_INTERNAL_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "https://star-map-generator.onrender.com"
).replace(/\/$/, "");

const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/orders/:path*",
        destination: `${backendUrl}/api/orders/:path*`,
      },
      {
        source: "/api/orders",
        destination: `${backendUrl}/api/orders`,
      },
      {
        source: "/api/star-data",
        destination: `${backendUrl}/api/star-data`,
      },
      {
        source: "/api/generate-pdf",
        destination: `${backendUrl}/api/generate-pdf`,
      },
      {
        source: "/api/styles",
        destination: `${backendUrl}/api/styles`,
      },
      {
        source: "/api/health",
        destination: `${backendUrl}/api/health`,
      },
      {
        source: "/api/geocode",
        destination: `${backendUrl}/api/geocode`,
      },
      {
        source: "/api/customer/:path*",
        destination: `${backendUrl}/api/customer/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
