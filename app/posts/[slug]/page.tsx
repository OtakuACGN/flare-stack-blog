// app/posts/[slug]/page.tsx
// Post detail page with TOC, reading time, share links
// Inspired by flare-stack-blog's PostPage with floating TOC and content renderer

import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug, getAllPostSlugs } from "@/lib/posts";
import { TableOfContents } from "@/components/post/table-of-contents";
import { DEFAULT_SITE_CONFIG } from "@/types/post";
import { generateBlogPostingJsonLd } from "@/lib/seo";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const url = `https://your-domain.com/posts/${post.slug}`;

  return (
    <article className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: generateBlogPostingJsonLd(
            post.title,
            post.summary || "",
            DEFAULT_SITE_CONFIG.author,
            post.publishedAt || new Date().toISOString(),
            url,
            post.coverImage,
          ),
        }}
      />

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center text-sm text-pink-400 hover:text-pink-600 transition-colors mb-6"
          >
            {"\u2190"} 返回首页
          </Link>

          {/* Post header */}
          <header className="mb-8">
            {post.coverImage && (
              <div className="mb-6 overflow-hidden rounded-2xl">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-48 sm:h-64 object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            )}
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-gray-50 mb-3">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
              {post.publishedAt && (
                <time dateTime={post.publishedAt}>{post.publishedAt}</time>
              )}
              <span>{post.readingTimeMinutes} min read</span>
              {post.tags?.map((tag) => (
                <span
                  key={tag.id}
                  className="px-2 py-0.5 rounded-full bg-pink-50 dark:bg-pink-950/30 text-pink-500 text-xs font-medium"
                >
                  #{tag.name}
                </span>
              ))}
            </div>
          </header>

          {/* Post content */}
          <div
            className="prose prose-pink dark:prose-invert max-w-none
              prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-gray-50
              prose-a:text-pink-500 prose-a:no-underline hover:prose-a:underline
              prose-img:rounded-xl prose-img:shadow-sm
              prose-code:before:content-none prose-code:after:content-none
              prose-pre:bg-gray-50 dark:prose-pre:bg-gray-900 prose-pre:rounded-xl"
            dangerouslySetInnerHTML={{ __html: post.renderedContent || "" }}
          />

          {/* Post footer */}
          <footer className="mt-12 pt-6 border-t border-pink-100 dark:border-gray-800">
            <Link
              href="/"
              className="inline-flex items-center text-sm text-pink-400 hover:text-pink-600 transition-colors"
            >
              {"\u2190"} 返回首页
            </Link>
          </footer>
        </div>

        {/* Floating TOC */}
        <TableOfContents headings={post.toc} />
      </div>
    </article>
  );
}
