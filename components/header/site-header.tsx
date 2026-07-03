// components/header/site-header.tsx
// Inspired by flare-stack-blog's navigation pattern
// Sticky header with nav, mobile responsive

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { DEFAULT_SITE_CONFIG } from "@/types/post";

const NAV_ITEMS = [
  { href: "/", label: "首页" },
  { href: "/posts", label: "归档" },
  { href: "/keystatic", label: "管理" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-pink-100 dark:border-gray-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Brand */}
        <Link
          href="/"
          className="text-lg font-extrabold text-pink-500 dark:text-pink-400 tracking-wide hover:text-pink-600 transition-colors"
        >
          {"\u2728"} {DEFAULT_SITE_CONFIG.title}
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-medium transition-colors ${
                pathname === item.href
                  ? "text-pink-500 dark:text-pink-400"
                  : "text-gray-500 dark:text-gray-400 hover:text-pink-400"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 text-gray-500 dark:text-gray-400 hover:text-pink-500 transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? "\u2715" : "\u2630"}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {mobileOpen && (
        <nav className="md:hidden border-t border-pink-100 dark:border-gray-800 bg-white dark:bg-gray-900 py-2">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-4 py-2 text-sm font-medium transition-colors ${
                pathname === item.href
                  ? "text-pink-500 bg-pink-50 dark:bg-pink-950/30"
                  : "text-gray-500 dark:text-gray-400 hover:text-pink-400 hover:bg-pink-50/50"
              }`}
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
