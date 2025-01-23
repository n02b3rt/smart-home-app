/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        appDir: true, // Włącz obsługę appDir (dla Next.js 13+)
    },
    webpack(config) {
        // Dodanie obsługi SVG
        config.module.rules.push({
            test: /\.svg$/,
            use: ['@svgr/webpack'],
        });

        return config;
    },
    reactStrictMode: true, // Zalecane do użycia w nowych projektach
    swcMinify: true, // Optymalizacje SWC
};

export default nextConfig;
