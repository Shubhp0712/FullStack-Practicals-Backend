/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['firebasestorage.googleapis.com', 'lh3.googleusercontent.com'],
  },
  env: {
    CUSTOM_KEY: 'my-value',
  },
}

module.exports = nextConfig
