import { ClientOnly, useRouteContext } from "@tanstack/react-router";
import type { NavOption } from "@/features/theme/contract/layouts";
import { m } from "@/paraglide/messages";
import { useEffect, useState } from "react";

interface FooterProps {
  navOptions: Array<NavOption>;
}

export function Footer(_: FooterProps) {
  const { siteConfig } = useRouteContext({ from: "__root__" });
  const currentYear = new Date().getFullYear();
  const [days, setDays] = useState(0);

  useEffect(() => {
    // 📅 开站日期：2026 年 5 月 30 日（JS 月份从 0 开始计算）
    const startDate = new Date(2026, 4, 30);
    const diff = Date.now() - startDate.getTime();

    setDays(
      Math.max(
        Math.floor(diff / (1000 * 60 * 60 * 24)),
        0,
      ),
    );
  }, []);

  const footerLink =
    "opacity-70 hover:opacity-100 transition-all duration-300";

  return (
    <>
      {/* 顶部分割虚线 */}
      <div className="border-t border-black/10 dark:border-white/15 border-dashed my-12 mx-4 md:mx-32" />

      {/* 页脚核心区域 */}
      <footer className="mb-14 px-6 select-none">
        <div className="max-w-2xl mx-auto flex flex-col items-center text-center gap-2">
          
          {/* Copyright 区域 */}
          <div className="fuwari-text-50 text-sm">
            <ClientOnly fallback="-">
              {m.footer_copyright({
                year: currentYear.toString(),
                author: siteConfig.author,
              })}
            </ClientOnly>
          </div>

          {/* Runtime 区域 (融入运行天数、RSS、Sitemap) */}
          <div className="text-sm opacity-60 flex flex-wrap items-center justify-center gap-2">
            <span>已运行 {days} 天</span>

            <span className="text-black/20 dark:text-white/20">·</span>

            <a
              href="/rss.xml"
              target="_blank"
              rel="noreferrer"
              className={footerLink}
            >
              RSS
            </a>

            <span className="text-black/20 dark:text-white/20">·</span>

            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noreferrer"
              className={footerLink}
            >
              Sitemap
            </a>
          </div>

          {/* Powered By 区域 */}
          <div className="text-xs opacity-30 mt-2">
            {m.footer_powered_by()}{" "}
            <a
              href="https://tanstack.com/start"
              target="_blank"
              rel="noreferrer"
              className={footerLink}
            >
              TanStack Start
            </a>
            {" & "}
            <a
              href="https://github.com/du2333/flare-stack-blog"
              target="_blank"
              rel="noreferrer"
              className={footerLink}
            >
              Flare Stack Blog
            </a>
          </div>

        </div>
      </footer>
    </>
  );
}
