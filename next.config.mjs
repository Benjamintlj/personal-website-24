/** @type {import('next').NextConfig} */

const nextConfig = {
    output: 'export',
    trailingSlash: false,
    eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
