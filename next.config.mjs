/** @type {import('next').NextConfig} */
const nextConfig = {
  // This will ignore the warnings related to Sequelize
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.ignoreWarnings = [
        {
          module: /sequelize/,
        },
      ];
    }
    return config;
  },

  // Ref Doc: https://blog.arcjet.com/structured-logging-in-json-for-next-js/
  experimental: {
    serverComponentsExternalPackages: ['pino', 'pino-pretty'],
  },

  images: {
    // Domains where we want to get images from
    // Reference: https://nextjs.org/docs/pages/api-reference/components/image#remotepatterns
    remotePatterns: [
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

  // Disable ESLint during build
  eslint: {
    ignoreDuringBuilds: true, // This will skip ESLint checks during the build
  },

  // Disable TypeScript type checking during build
  typescript: {
    ignoreBuildErrors: true, // This will prevent build from failing due to TypeScript errors
  },
};

export default nextConfig;
