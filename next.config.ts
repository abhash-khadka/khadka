import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {},
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb',
    },
  },
};

// @serwist/next injects a webpack() function into the config even when
// disabled, which causes Turbopack to panic with "Next.js package not found".
// Only apply the serwist wrapper in production builds where webpack is used.
// The build script already uses --webpack, so this is safe.
if (process.env.NODE_ENV === "production") {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const withSerwistInit = require("@serwist/next").default;
  const withSerwist = withSerwistInit({
    swSrc: "src/app/sw.ts",
    swDest: "public/sw.js",
  });
  module.exports = withSerwist(nextConfig);
} else {
  module.exports = nextConfig;
}

