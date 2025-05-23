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
        'encoding': false,
        'stream': false,
        'util': false,
        'buffer': false,
      };
    }
    
    // Handle problematic modules
    config.externals = config.externals || [];
    if (isServer) {
      config.externals.push({
        '@0xkamal7/sui-agent': '@0xkamal7/sui-agent',
        'encoding': 'encoding'
      });
    }
    
    return config;
  },
  
  // Use experimental.serverComponentsExternalPackages instead of serverExternalPackages for Next.js 13
  experimental: {
    serverComponentsExternalPackages: [
      'blake2', 
      'atoma-sdk',
      '@0xkamal7/sui-agent',
      '@solana/web3.js',
      'cross-fetch',
      'node-fetch',
      'encoding'
    ]
  }
}

export default nextConfig
