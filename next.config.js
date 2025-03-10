// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   /* config options here */
// };

// module.exports = nextConfig;
// next.config.js
const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
    };
    return config;
  },
};

module.exports = nextConfig;
