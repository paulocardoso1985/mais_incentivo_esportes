/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    transpilePackages: ["@votorantim-futebol/database"],
    output: 'standalone',
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'http://localhost:3005/:path*',
            },
        ];
    },
};

module.exports = nextConfig;
