import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    reactStrictMode: true,

    // Allow external packages that may not be fully ESM compatible
    transpilePackages: ['react-map-gl'],

    // Environment variables
    env: {
        NEXT_PUBLIC_MAPBOX_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
    },
};

export default nextConfig;
