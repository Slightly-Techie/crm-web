/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "crm-testing991.s3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "stncrmutilities.s3.amazonaws.com",
      },
    ],
  },
};

module.exports = nextConfig;
