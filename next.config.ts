import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Old URLs from earlier builds keep working after the "For Providers" → "Services" rename.
  async redirects() {
    return [
      { source: "/for-providers", destination: "/services", permanent: true },
      { source: "/for-providers/host", destination: "/services/vendor", permanent: true },
      { source: "/for-providers/partner", destination: "/services/partner", permanent: true },
      { source: "/for-providers/venues", destination: "/services/list-venue", permanent: true },
      { source: "/for-providers/:path*", destination: "/services", permanent: true },
      { source: "/signup", destination: "/login?mode=register", permanent: false },
      { source: "/register", destination: "/login?mode=register", permanent: false },
      { source: "/me", destination: "/account", permanent: false },
    ];
  },
};

export default nextConfig;
