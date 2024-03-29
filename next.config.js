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
      {
        protocol: "https",
        hostname: "avatars.dicebear.com",
      },
      {
        protocol: "https",
        hostname: "api.dicebear.com",
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: 'standalone'
};

module.exports = nextConfig;
