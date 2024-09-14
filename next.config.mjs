// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ref Doc: https://blog.arcjet.com/structured-logging-in-json-for-next-js/
  experimental: {
    serverComponentsExternalPackages: ['pino', 'pino-pretty'],
  },
  images: {
    // Domains where we want to get images from
    // Reference: https://nextjs.org/docs/pages/api-reference/components/image#remotepatterns
    remotePatterns: [
      // For googleusercontent.com, and all its different paths
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'platform-lookaside.fbsbx.com',
        pathname: '**',
      },
    ],
  },
};

export default nextConfig;
