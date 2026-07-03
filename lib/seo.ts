// lib/seo.ts
// Inspired by flare-stack-blog's seo.ts
// Structured data and meta generation

export function generateBlogPostingJsonLd(
  title: string,
  description: string,
  author: string,
  publishedAt: string,
  url: string,
  image?: string,
): string {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description: description,
    author: { "@type": "Person", name: author },
    datePublished: publishedAt,
    dateModified: publishedAt,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    ...(image && { image }),
  };
  return JSON.stringify(jsonLd);
}

export function generateSiteJsonLd(
  title: string,
  description: string,
  url: string,
): string {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: title,
    description: description,
    url: url,
  };
  return JSON.stringify(jsonLd);
}
