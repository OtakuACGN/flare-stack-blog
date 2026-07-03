import fs from "fs";
import path from "path";
import Image from "next/image";
import Link from "next/link";

interface Post {
  slug: string;
  title: string;
  publishedAt?: string;
  summary?: string;
  coverImage?: string;
}

function getPosts(): Post[] {
  const postsDirectory = path.join(process.cwd(), "content/posts");

  if (!fs.existsSync(postsDirectory)) return [];

  const files = fs.readdirSync(postsDirectory);

  return files
    .filter((filename) => filename.endsWith(".json"))
    .map((filename) => {
      const slug = filename.replace(".json", "");
      const filePath = path.join(postsDirectory, filename);
      const fileContent = fs.readFileSync(filePath, "utf8");
      const metadata = JSON.parse(fileContent);

      return {
        slug,
        title: metadata.title || slug,
        publishedAt: metadata.publishedAt,
        summary: metadata.summary,
        coverImage: metadata.coverImage,
      };
    })
    .sort((a, b) => {
      return new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime();
    });
}

export default function Home() {
  const posts = getPosts();

  return (
    <div className="min-h-screen text-[color:var(--foreground)]">
      <header className="border-b border-[color:var(--border)] bg-[color:var(--surface)]/92 backdrop-blur-sm">
        <div className="mx-auto max-w-5xl px-6 py-12 sm:py-14">
          <div className="max-w-2xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--accent)]">
              Personal Notes / Blog
            </p>
            <h1 className="text-3xl font-black tracking-tight text-[color:var(--foreground)] sm:text-4xl">
              YT&apos;s Otaku Blog
            </h1>
            <p className="mt-4 text-sm leading-7 text-[color:var(--muted)] sm:text-[15px]">
              记录技术、日常和喜欢的内容。页面保持尽量干净，把重点交给文章本身。
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10 sm:py-12">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-[color:var(--foreground)] sm:text-xl">
            最新文章
          </h2>
          <span className="text-xs text-[color:var(--muted)]">
            {posts.length} 篇内容
          </span>
        </div>

        {posts.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[color:var(--border)] bg-[color:var(--surface)] px-6 py-14 text-center shadow-[0_10px_30px_rgba(20,15,19,0.04)]">
            <p className="text-sm leading-7 text-[color:var(--muted)]">
              目前还没有写过文章，去
              {" "}
              <Link
                href="/keystatic"
                className="font-medium text-[color:var(--accent)] underline decoration-[color:var(--border-strong)] underline-offset-4"
              >
                管理后台
              </Link>
              {" "}
              新建一篇吧。
            </p>
          </div>
        ) : (
          <div className="grid gap-5">
            {posts.map((post, index) => {
              const isFeatured = index === 0 && Boolean(post.coverImage);

              return (
                <article
                  key={post.slug}
                  className={[
                    "group overflow-hidden rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface)] shadow-[0_12px_36px_rgba(20,15,19,0.05)] transition duration-300 hover:-translate-y-0.5 hover:border-[color:var(--border-strong)] hover:shadow-[0_16px_44px_rgba(20,15,19,0.08)]",
                    isFeatured ? "md:grid md:grid-cols-[minmax(0,1.15fr)_minmax(320px,420px)]" : "",
                  ].join(" ")}
                >
                  <div className="p-6 sm:p-7">
                    <div className="mb-3 flex items-center gap-3 text-xs text-[color:var(--muted)]">
                      {post.publishedAt ? (
                        <span className="rounded-full border border-[color:var(--border)] bg-[color:var(--surface-soft)] px-3 py-1">
                          {post.publishedAt}
                        </span>
                      ) : null}
                      {isFeatured ? (
                        <span className="rounded-full bg-[color:var(--accent)]/10 px-3 py-1 font-medium text-[color:var(--accent-strong)]">
                          推荐阅读
                        </span>
                      ) : null}
                    </div>

                    <h3 className="text-xl font-bold leading-8 text-[color:var(--foreground)] transition-colors group-hover:text-[color:var(--accent-strong)] sm:text-2xl">
                      {post.title}
                    </h3>

                    {post.summary ? (
                      <p className="mt-4 text-sm leading-7 text-[color:var(--muted)] sm:text-[15px]">
                        {post.summary}
                      </p>
                    ) : (
                      <p className="mt-4 text-sm leading-7 text-[color:var(--muted)] sm:text-[15px]">
                        这篇文章还没有填写摘要，点击进入查看完整内容。
                      </p>
                    )}

                    <div className="mt-6">
                      <Link
                        href={`/posts/${post.slug}`}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--accent)] transition-colors hover:text-[color:var(--accent-strong)]"
                      >
                        阅读正文
                        <span aria-hidden="true">→</span>
                      </Link>
                    </div>
                  </div>

                  {post.coverImage ? (
                    <div className={[
                      "border-t border-[color:var(--border)] bg-[color:var(--surface-soft)] md:border-t-0",
                      isFeatured ? "md:border-l" : "",
                    ].join(" ")}>
                      <div className="p-4 sm:p-5">
                        <div className="relative overflow-hidden rounded-2xl border border-[color:var(--border)] bg-white/70 dark:bg-black/10 aspect-[16/10]">
                          <Image
                            src={post.coverImage}
                            alt={`${post.title} 封面图`}
                            fill
                            sizes="(max-width: 768px) 100vw, 420px"
                            className="object-contain object-center p-2"
                            unoptimized
                          />
                        </div>
                      </div>
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
