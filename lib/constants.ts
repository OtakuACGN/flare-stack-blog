// lib/constants.ts
// Inspired by flare-stack-blog's constants.ts — cache control, pagination

export const POSTS_PER_PAGE = 12;

export const CACHE_CONTROL = {
  public: {
    "Cache-Control": "public, max-age=0, must-revalidate",
  },
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
} as const;

export const VIEW_COUNT_COOKIE_NAME = "otaku-blog-views";
export const VIEW_COUNT_COOLDOWN_MS = 60 * 60 * 1000;
