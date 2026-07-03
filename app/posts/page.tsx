// app/posts/page.tsx
// Archive page — full post list grouped by year
// Inspired by flare-stack-blog's ArchivePanel

import { getAllPosts } from "@/lib/posts";
import { PostCard } from "@/components/post/post-card";

export default function PostsPage() {
  const posts = getAllPosts();

  // Group by year
  const grouped = posts.reduce<Record<string, typeof posts>>((acc, post) => {
    const year = post.publishedAt
      ? new Date(post.publishedAt).getFullYear().toString()
      : "未知";
    acc[year] ??= [];
    acc[year].push(post);
    return acc;
  }, {});

  const years = Object.keys(grouped).sort((a, b) => Number(b) - Number(a));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-extrabold text-gray-800 dark:text-gray-100 mb-6">
        文章归档
      </h1>

      {years.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p>暂无文章</p>
        </div>
      ) : (
        <div className="space-y-8">
          {years.map((year) => (
            <section key={year}>
              <h2 className="text-lg font-bold text-pink-500 mb-4 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-pink-400 inline-block" />
                {year} 年
                <span className="text-sm font-normal text-gray-400">
                  ({grouped[year].length} 篇)
                </span>
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {grouped[year].map((post) => (
                  <PostCard key={post.slug} post={post} variant="compact" />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
