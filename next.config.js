/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@': path.resolve(__dirname, './'),
      '@/components': path.resolve(__dirname, './components')
    };
    return config;
  }
}

module.exports = nextConfig

