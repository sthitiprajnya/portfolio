import withBundleAnalyzer from '@next/bundle-analyzer';

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Tells Next.js to produce a fully static export into the `out/` directory.
  // This is what GitHub Pages needs — a folder of plain HTML/CSS/JS files.
  output: 'export',

  // Apply basePath since GitHub Pages serves the app at /portfolio
  basePath: '/portfolio',

  // GitHub Pages serves files with a trailing slash, so /about becomes /about/index.html
  trailingSlash: true,

  // Next.js image optimization requires a running Node.js server, which GitHub Pages doesn't have.
  // We disable it (`unoptimized: true`) so that <img> tags are used instead of the Next.js optimization pipeline.
  // This is a deliberate compromise required by the 'export' output mode for static hosting.
  images: {
    unoptimized: true,
  },

  compiler: {
    removeConsole: process.env?.NODE_ENV === 'production'
      ? { exclude: ['warn', 'error'] }
      : false,
  },

  reactStrictMode: true,

  transpilePackages: ['next-image-export-optimizer'],

  experimental: {
    optimizePackageImports: ['framer-motion', 'clsx', 'tailwind-merge'],
  },
};

export default bundleAnalyzer(nextConfig);
