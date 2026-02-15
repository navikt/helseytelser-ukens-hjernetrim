/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // Forces Next.js to use relative paths for scripts/styles
  assetPrefix: './', 
  // Ensures every route ends in a slash, making relative paths reliable
  trailingSlash: true,
};

export default nextConfig;