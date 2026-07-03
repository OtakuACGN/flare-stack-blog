// lib/cache-control.ts
// Inspired by flare-stack-blog's CACHE_CONTROL constants
// Generate response headers for CDN caching

export function getCacheHeaders(type: "swr" | "immutable" | "private" = "swr"): Record<string, string> {
  const controls = {
    swr: {
      "Cache-Control": "public, max-age=0, must-revalidate",
      "CDN-Cache-Control": "public, s-maxage=1, stale-while-revalidate=604800",
    },
    immutable: {
      "Cache-Control": "public, max-age=31536000, immutable",
    },
    private: {
      "Cache-Control": "private, no-store, no-cache, must-revalidate",
    },
  };
  return controls[type];
}
