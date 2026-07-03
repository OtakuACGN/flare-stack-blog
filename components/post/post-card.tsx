// components/post/post-card.tsx
// Inspired by flare-stack-blog's PostCard component
// Reusable post card with pinned/popular badges, tags, reading time

import Link from "next/link";
import { Calendar, Clock, Pin } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PostWithRendered } from "@/types/post";

interface PostCardProps {
  post: PostWithRendered;
  pinned?: boolean;
  variant?: "default" | "compact" | "featured";
}

export function PostCard({ post, pinned = false, variant = "default" }: PostCardProps) {
  const isCompact = variant === "compact";
  const isFeatured = variant === "featured";

  return (
    <Link
      href={`/posts/${post.slug}`}
      className={cn(
        "block bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-pink-50/50 dark:border-gray-800",
        "hover:shadow-md hover:border-pink-200 dark:hover:border-pink-900",
        "transition-all duration-300 group overflow-hidden",
        pinned && "border-2 border-pink-200 dark:border-pink-900",
        isCompact && "p-3",
        isFeatured && "p-6",
      )}
    >
      {/* Pinned badge */}
      {pinned && (
        <div className="flex items-center gap-1.5 text-xs font-medium text-pink-500 mb-2">
          <Pin size={14} className="fill-current" />
          <span>置顶</span>
        </div>
      )}

      <div className={cn(isCompact ? "flex items-center gap-3" : "mb-2")}>
        <h3
          className={cn(
            "font-bold text-gray-800 dark:text-gray-100 group-hover:text-pink-500 transition-colors",
            isCompact ? "text-sm truncate flex-1" : isFeatured ? "text-xl" : "text-lg",
          )}
        >
          {post.title}
        </h3>
      </div>

      {!isCompact && post.summary && (
        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed line-clamp-2 mb-3">
          {post.summary}
        </p>
      )}

      <div className={cn(
        "flex items-center gap-3 text-xs text-gray-400",
        isCompact ? "hidden sm:flex" : "",
      )}>
        {post.publishedAt && (
          <span className="flex items-center gap-1">
            <Calendar size={12} />
            {post.publishedAt}
          </span>
        )}
        <span className="flex items-center gap-1">
          <Clock size={12} />
          {post.readingTimeMinutes} min
        </span>
      </div>
    </Link>
  );
}
