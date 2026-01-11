/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: { unoptimized: true },
  basePath: "/Renata_jwy",
  assetPrefix: "/Renata_jwy/",
  env: {
    NEXT_PUBLIC_BASE_PATH: "/Renata_jwy",
  },
};

module.exports = nextConfig;
