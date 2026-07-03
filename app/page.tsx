// app/page.tsx
// Home page — post listing with featured/pinned support
// Inspired by flare-stack-blog's HomePage with merged pinned/popular/recent

import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import { PostCard } from "@/components/post/post-card";

export default function HomePage() {
  const allPosts = getAllPosts();

  // Separate pinned posts
  const pinnedPosts = allPosts.filter((p) => p.pinnedAt);
  const regularPosts = allPosts.filter((p) => !p.pinnedAt);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Hero */}
      <section className="mb-10 text-center py-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-pink-500 tracking-wide">
          {"\u2728"} YT&apos;s Otaku Blog {"\u2728"}
        </h1>
        <p className="text-gray-400 mt-3 text-sm sm:text-base">
          关注博主不迷路，这里记录纯粹的极客与二次元日常
        </p>
      </section>

      {/* Pinned posts */}
      {pinnedPosts.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-pink-500 inline-block" />
            置顶文章
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {pinnedPosts.map((post) => (
              <PostCard key={post.slug} post={post} pinned variant="featured" />
            ))}
          </div>
        </section>
      )}

      {/* Regular posts */}
      <section>
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-pink-400 inline-block" />
          最新文章
        </h2>
        {regularPosts.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-12 text-center border border-dashed border-gray-200 dark:border-gray-700">
            <p className="text-gray-400 text-sm">
              还没有文章，去{" "}
              <Link href="/keystatic" className="text-pink-500 underline font-medium">
                管理后台
              </Link>{" "}
              写一篇吧！
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {regularPosts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </section>

      {/* View all link */}
      {allPosts.length > 0 && (
        <div className="mt-8 text-center">
          <Link
            href="/posts"
            className="inline-flex items-center gap-2 text-sm font-medium text-pink-500 hover:text-pink-600 transition-colors"
          >
            查看全部文章 {"\u2192"}
          </Link>
        </div>
      )}
    </div>
  );
}
