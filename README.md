# YT\'s Otaku Blog

Based on **Next.js 16 + Keystatic + Markdoc**.
Architecture inspiration from [flare-stack-blog](https://github.com/OtakuACGN/flare-stack-blog).

## Core Optimizations

### Design patterns absorbed from flare-stack-blog

| Pattern | Location | Description |
|---------|----------|-------------|
| **Theme Contract** | types/post.ts | Centralized PostMeta, PostWithRendered, PostItem, Tag, TocNode |
| **Content Rendering Pipeline** | lib/markdoc/renderer.ts | Markdoc parse -> HTML -> TOC extract -> reading time |
| **Post Card Component** | components/post/post-card.tsx | Pinned/featured/compact variants with badge system |
| **Floating TOC** | components/post/table-of-contents.tsx | IntersectionObserver-driven sidebar |
| **Cache Control Constants** | lib/constants.ts | SWR / immutable / private strategies |
| **i18n-ready Utils** | lib/utils.ts | formatDate, formatTimeAgo, cn(), estimateReadingTime |
| **SEO Structured Data** | lib/seo.ts | BlogPosting + WebSite JSON-LD |
| **Site Config** | types/post.ts | DEFAULT_SITE_CONFIG centralized metadata |
| **Custom Error Pages** | app/not-found.tsx | Polished 404 page |
| **Archive Grouping** | app/posts/page.tsx | Year-grouped post archive |

### Bugs fixed from original

- Removed ignoreBuildErrors / ignoreDuringBuilds — builds now catch real errors
- Removed globals.css hack hiding Next.js error overlays
- Added [slug] dynamic routing — articles are clickable
- Markdoc rendering pipeline — Markdown to HTML
- Responsive Header with mobile menu
- SEO Meta + Open Graph + Twitter Card
- Reading time estimation + Table of Contents

## Quick Start

`ash
cd new-blog
npm install
npm run dev
`

Visit http://localhost:3000, /keystatic for CMS admin.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **CMS**: Keystatic (GitHub / Local)
- **Doc Format**: Markdoc
- **Styles**: Tailwind CSS v4
- **Language**: TypeScript
