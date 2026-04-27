import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* ── Strict Mode ───────────────────────────────────────────────────────── */
  reactStrictMode: true,

  /* ── Image Domains ─────────────────────────────────────────────────────── */
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },

  /* ── Compiler Options ───────────────────────────────────────────────────── */
  compiler: {
    // Remove console.log in production
    removeConsole:
      process.env.NODE_ENV === "production"
        ? { exclude: ["error", "warn"] }
        : false,
  },

  /* ── Experimental ───────────────────────────────────────────────────────── */
  experimental: {
    // Enable optimistic PPR for dashboard routes
    ppr: false,
  },

  /* ── Redirects ──────────────────────────────────────────────────────────── */
  async redirects() {
    return [
      {
        source: "/",
        destination: "/login",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
