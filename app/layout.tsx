// app/layout.tsx
// Root layout with SEO metadata, site config, and global structure
// Inspired by flare-stack-blog's __root.tsx with proper meta tags

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/header/site-header";
import { DEFAULT_SITE_CONFIG } from "@/types/post";
import { generateSiteJsonLd } from "@/lib/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: DEFAULT_SITE_CONFIG.title,
    template: `%s | ${DEFAULT_SITE_CONFIG.title}`,
  },
  description: DEFAULT_SITE_CONFIG.description,
  authors: [{ name: DEFAULT_SITE_CONFIG.author }],
  creator: DEFAULT_SITE_CONFIG.author,
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: DEFAULT_SITE_CONFIG.title,
    title: DEFAULT_SITE_CONFIG.title,
    description: DEFAULT_SITE_CONFIG.description,
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_SITE_CONFIG.title,
    description: DEFAULT_SITE_CONFIG.description,
    creator: `@${DEFAULT_SITE_CONFIG.author}`,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: generateSiteJsonLd(
              DEFAULT_SITE_CONFIG.title,
              DEFAULT_SITE_CONFIG.description,
              "https://your-domain.com",
            ),
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-pink-50/10 dark:bg-gray-950">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-pink-100 dark:border-gray-800 py-6">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center text-sm text-gray-400">
            <p>
              {"\u00a9"} {new Date().getFullYear()} {DEFAULT_SITE_CONFIG.title}.
              {" "}Built with Next.js + Keystatic + Markdoc.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
