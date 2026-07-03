// lib/posts.ts
// Inspired by flare-stack-blog's posts.service.ts + posts.data.ts
// File-based post storage (mirrors Keystatic JSON output)
// Separates data reading from rendering pipeline

import fs from "fs";
import path from "path";
import { renderMarkdoc } from "@/lib/markdoc/renderer";
import type { PostMeta, PostWithRendered, PostItem } from "@/types/post";

function getPostsDirectory(): string {
  return path.join(process.cwd(), "content", "posts");
}

function readPostFile(slug: string): PostMeta | null {
  const filePath = path.join(getPostsDirectory(), `${slug}.json`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf8");
  return JSON.parse(raw) as PostMeta;
}

export function getPostBySlug(slug: string): PostWithRendered | null {
  const meta = readPostFile(slug);
  if (!meta) return null;

  const content = meta.content || "";
  const { html, toc, readingTimeMinutes } = renderMarkdoc(content);

  return {
    ...meta,
    renderedContent: html,
    toc,
    readingTimeMinutes,
  };
}

export function getAllPosts(): PostWithRendered[] {
  const postsDir = getPostsDirectory();
  if (!fs.existsSync(postsDir)) return [];

  const files = fs.readdirSync(postsDir);
  const metas = files
    .filter((f) => f.endsWith(".json"))
    .map((f) => readPostFile(f.replace(".json", "")))
    .filter((m): m is PostMeta => m !== null)
    .sort((a, b) => {
      const dateA = new Date(a.publishedAt || a.pinnedAt || a.slug).getTime();
      const dateB = new Date(b.publishedAt || b.pinnedAt || b.slug).getTime();
      return dateB - dateA;
    });

  return metas.map((m) => {
    const content = m.content || "";
    const { html, toc, readingTimeMinutes } = renderMarkdoc(content);
    return {
      ...m,
      renderedContent: html,
      toc,
      readingTimeMinutes,
    };
  });
}

export function getAllPostSlugs(): string[] {
  const postsDir = getPostsDirectory();
  if (!fs.existsSync(postsDir)) return [];
  return fs
    .readdirSync(postsDir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(".json", ""));
}
