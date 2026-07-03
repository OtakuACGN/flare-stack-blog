// app/not-found.tsx
// Custom 404 page

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-extrabold text-pink-500 mb-4">404</h1>
        <p className="text-gray-500 text-lg mb-6">
          页面走丢了... 是不是去了异世界？
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-pink-500 text-white rounded-full font-medium hover:bg-pink-600 transition-colors"
        >
          {"\u2190"} 返回首页
        </Link>
      </div>
    </div>
  );
}
