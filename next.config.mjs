/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Fixes the freezing issues with GSAP and Fast Refresh
  images: {
    qualities: [70, 75, 90],
  },
};

export default nextConfig;
