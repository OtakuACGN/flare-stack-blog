// app/page.tsx
import Link from 'next/link';
import fs from 'fs';
import path from 'path';

// 定义文章的类型结构
interface Post {
  slug: string;
  title: string;
  publishedAt?: string;
  summary?: string;
}

// 纯原生的方式读取本地 Keystatic 生成的博客文章数据
function getPosts(): Post[] {
  const postsDirectory = path.join(process.cwd(), 'content/posts');
  
  // 如果还没创建过任何文章，先返回空列表
  if (!fs.existsSync(postsDirectory)) return [];

  const files = fs.readdirSync(postsDirectory);

  return files
    .filter((filename) => filename.endsWith('.json')) // 读取 Keystatic 存元数据的 json 文件
    .map((filename) => {
      const slug = filename.replace('.json', '');
      const filePath = path.join(postsDirectory, filename);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const metadata = JSON.parse(fileContent);

      return {
        slug,
        title: metadata.title || slug,
        publishedAt: metadata.publishedAt,
        summary: metadata.summary,
      };
    })
    .sort((a, b) => {
      // 按发布时间倒序排列
      return new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime();
    });
}

export default function Home() {
  const posts = getPosts();

  return (
    <div className="min-h-screen bg-pink-50/20 text-gray-800 font-sans">
      {/* 二次元感十足的顶部大通栏 */}
      <header className="bg-white border-b border-pink-100 py-12 text-center shadow-sm">
        <h1 className="text-4xl font-extrabold text-pink-500 tracking-wider">
          ✨ YT's Otaku Blog ✨
        </h1>
        <p className="text-gray-400 mt-2 text-sm">关注博主不迷路，这里记录纯粹的极客与二次元日常</p>
      </header>

      {/* 主体内容区 */}
      <main className="max-w-4xl mx-auto px-6 py-10">
        <h2 className="text-xl font-bold text-gray-700 mb-6 border-l-4 border-pink-400 pl-3">
          最新文章 / Recent Posts
        </h2>

        {posts.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-gray-200">
            <p className="text-gray-400">目前还没有写过文章哦，快去 <Link href="/keystatic" className="text-pink-500 underline font-medium">管理后台</Link> 写一篇吧！</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {posts.map((post) => (
              <article 
                key={post.slug} 
                className="bg-white p-6 rounded-2xl shadow-sm border border-pink-50/50 hover:shadow-md transition-all duration-300 group"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-gray-800 group-hover:text-pink-500 transition-colors">
                    {post.title}
                  </h3>
                  {post.publishedAt && (
                    <span className="text-xs text-gray-400 bg-gray-50 px-2.5 py-1 rounded-full">
                      📅 {post.publishedAt}
                    </span>
                  )}
                </div>
                {post.summary && (
                  <p className="text-gray-500 text-sm leading-relaxed mb-4">
                    {post.summary}
                  </p>
                )}
                <div className="text-right">
                  <span className="text-xs font-semibold text-pink-400 group-hover:text-pink-500 transition-colors">
                    阅读正文 →
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}