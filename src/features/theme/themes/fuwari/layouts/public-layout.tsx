import { useLocation, useRouteContext } from "@tanstack/react-router";
import { useState } from "react";
import { BgmPlayer } from "@/components/content/bgm-player";
import type { PublicLayoutProps } from "@/features/theme/contract/layouts";
import { BackToTop } from "../components/control/back-to-top";
import { Sidebar } from "../components/sidebar";
import { Footer } from "./footer";
import { MobileMenu } from "./mobile-menu";
import { type BannerHeightConfig, Navbar } from "./navbar";

const BANNER_HEIGHT_HOME = {
  minRem: 18,
  preferredVh: 58,
  maxRem: 36,
} as const satisfies BannerHeightConfig;
const BANNER_HEIGHT_PAGE = {
  minRem: 12,
  preferredVh: 32,
  maxRem: 22,
} as const satisfies BannerHeightConfig;
const MAIN_OVERLAP_REM = 3.5;
const NAVBAR_HEIGHT_REM = 4.5;

function getBannerHeightCss({
  minRem,
  preferredVh,
  maxRem,
}: BannerHeightConfig) {
  return `clamp(${minRem}rem, ${preferredVh}vh, ${maxRem}rem)`;
}

export function PublicLayout({
  children,
  navOptions,
  user,
  isSessionLoading,
  logout,
}: PublicLayoutProps) {
  const { siteConfig } = useRouteContext({ from: "__root__" });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const bannerHeight = isHomePage ? BANNER_HEIGHT_HOME : BANNER_HEIGHT_PAGE;
  const bannerHeightCss = getBannerHeightCss(bannerHeight);
  const homeBg = siteConfig.theme.fuwari.homeBg?.trim();

  return (
    <div className="relative min-h-screen bg-[var(--fuwari-page-bg)] transition-colors">
      {/* 📱 移动端抽屉菜单 */}
      <MobileMenu
        navOptions={navOptions}
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        user={user}
        logout={logout}
      />

      {/* 🧭 顶部导航栏（粘性定位） */}
      <div className="sticky top-0 z-50 pointer-events-none">
        <div className="pointer-events-auto max-w-[var(--fuwari-page-width)] mx-auto px-0 md:px-4">
          <Navbar
            navOptions={navOptions}
            onMenuClick={() => setIsMenuOpen(true)}
            user={user}
            isLoading={isSessionLoading}
            bannerHeight={bannerHeight}
          />
        </div>
      </div>

      {/* Banner background image */}
      <div
        className="absolute left-0 right-0 top-0 z-10 overflow-hidden transition-[height] duration-300 ease-in-out select-none bg-[var(--fuwari-page-bg)]"
        style={{ height: bannerHeightCss }}
      >
        {homeBg ? (
          <img
            src={homeBg}
            alt=""
            aria-hidden="true"
            fetchPriority={isHomePage ? "high" : undefined}
            decoding="async"
            className="h-full w-full object-cover transition-[object-position] duration-300 ease-in-out"
            style={{
              objectPosition: isHomePage ? "40% 35%" : "40% 20%",
            }}
          />
        ) : null}
      </div>

      {/* 📄 主内容区域 */}
      <div
        className="relative z-30 transition-[margin-top] duration-300 ease-in-out"
        style={{
          marginTop: `calc(${bannerHeightCss} - ${MAIN_OVERLAP_REM}rem - ${NAVBAR_HEIGHT_REM}rem)`,
        }}
      >
        <div
          className="relative mx-auto px-0 md:px-4 pb-8 grid grid-cols-1 lg:grid-cols-[17.5rem_1fr] gap-4"
          style={{ maxWidth: "var(--fuwari-page-width)" }}
        >
          {/* Sidebar */}
          <Sidebar className="order-2 lg:order-1" />

          {/* Main content */}
          <main className="order-1 lg:order-2 flex flex-col gap-4 min-w-0">
            {children}
          </main>

          {/* Footer */}
          <div
            className="order-3 lg:col-start-2 fuwari-onload-animation mt-auto"
            style={{ animationDelay: "250ms" }}
          >
            <Footer navOptions={navOptions} />
          </div>

          {/* 返回顶部按钮 */}
          <BackToTop />

          {/* 🎵 全局网易云吸底背景音乐播放器 */}
          <BgmPlayer />
        </div>
      </div>
    </div>
  );
}
