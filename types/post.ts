// types/post.ts
// Inspired by flare-stack-blog's posts.schema.ts — centralized type definitions

export interface PostMeta {
  slug: string;
  title: string;
  summary?: string;
  publishedAt?: string;
  pinnedAt?: string;
  coverImage?: string;
  content?: string;
  tags?: Tag[];
  readTimeMinutes?: number;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
}

export interface TocNode {
  id: string;
  text: string;
  level: number;
}

export interface PostWithRendered extends PostMeta {
  renderedContent?: string;
  toc: TocNode[];
  readingTimeMinutes: number;
}

export interface PostItem {
  id: number;
  slug: string;
  title: string;
  summary?: string;
  publishedAt?: string;
  pinnedAt?: string;
  readTimeInMinutes: number;
  tags?: Tag[];
}

export interface SiteConfig {
  title: string;
  author: string;
  description: string;
  social: SocialLink[];
  theme: ThemeConfig;
}

export interface SocialLink {
  platform: string;
  url: string;
}

export interface ThemeConfig {
  primaryHue: number;
  avatar?: string;
  homeBg?: string;
}

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  title: "YT's Otaku Blog",
  author: "YT",
  description: "记录纯粹的极客与二次元日常",
  social: [
    { platform: "github", url: "https://github.com/OtakuACGN" },
    { platform: "email", url: "mailto:yt@example.com" },
  ],
  theme: {
    primaryHue: 330,
  },
};
