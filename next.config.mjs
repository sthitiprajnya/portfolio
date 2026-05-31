/** @type {import('next').NextConfig} */
const nextConfig = {
  // Tells Next.js to produce a fully static export into the `out/` directory.
  // This is what GitHub Pages needs — a folder of plain HTML/CSS/JS files.
  output: 'export',

  // Apply basePath since GitHub Pages serves the app at /portfolio
  basePath: '/portfolio',

  // GitHub Pages serves files with a trailing slash, so /about becomes /about/index.html
  trailingSlash: true,

  // Next.js image optimisation requires a running server, which GitHub Pages doesn't have.
  // Disabling it means <img> tags are used directly instead of the <Image /> component pipeline.
  images: {
    unoptimized: true,
  },

  // React strict mode for development
  reactStrictMode: true,

  // Compression
  compress: true,

  // Optimization settings
  poweredByHeader: false,

  // Experimental optimizations
  experimental: {
    optimizePackageImports: [
      'framer-motion',
      'gsap',
      'three',
      '@react-three/fiber',
      '@react-three/drei',
    ],
  },
};

export default nextConfig;
