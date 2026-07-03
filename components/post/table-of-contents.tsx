// components/post/table-of-contents.tsx
// Inspired by flare-stack-blog's TOC component
// Floating sidebar with anchor links

"use client";

import { useEffect, useState } from "react";
import type { TocNode } from "@/types/post";

interface TableOfContentsProps {
  headings: TocNode[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: "-80px 0px -80% 0px" },
    );

    const elements = headings
      .filter((h) => h.level >= 2 && h.level <= 3)
      .map((h) => document.getElementById(h.id))
      .filter(Boolean);

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className="hidden xl:block sticky top-24 w-48 shrink-0">
      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
        目录
      </h4>
      <ul className="space-y-1 text-sm">
        {headings
          .filter((h) => h.level >= 2 && h.level <= 3)
          .map((h) => (
            <li key={h.id}>
              <a
                href={`#${h.id}`}
                className={`block py-1 px-2 rounded transition-colors truncate ${
                  activeId === h.id
                    ? "text-pink-500 font-medium bg-pink-50 dark:bg-pink-950/30"
                    : "text-gray-500 hover:text-pink-400"
                }`}
                style={{ paddingLeft: `${(h.level - 2) * 12 + 8}px` }}
              >
                {h.text}
              </a>
            </li>
          ))}
      </ul>
    </nav>
  );
}
