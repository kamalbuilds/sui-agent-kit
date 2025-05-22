/** @type {import('next').NextConfig} */
// import require from 'require';

const nextConfig = {
  reactStrictMode: true,
  
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Fix for native module dependencies - work with Next.js 13
  webpack: (config, { isServer }) => {
    // Configure polyfills and fallbacks for browser
    if (!isServer) {
      // Don't attempt to load native modules in client-side builds
      config.resolve.fallback = {
        ...config.resolve.fallback,
        'blake2': false,
        'fs': false,
        'path': false,
        'crypto': false,
      };
    }
    
    return config;
  },
  
  // Use experimental.serverComponentsExternalPackages instead of serverExternalPackages for Next.js 13
  experimental: {
    serverComponentsExternalPackages: ['blake2', 'atoma-sdk']
  }
}

export default nextConfig
