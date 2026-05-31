import { useLocation, useRouteContext } from "@tanstack/react-router";
import { useState } from "react";
import type { PublicLayoutProps } from "@/features/theme/contract/layouts";
import { BackToTop } from "../components/control/back-to-top";
import { Sidebar } from "../components/sidebar";
import { Footer } from "./footer";
import { MobileMenu } from "./mobile-menu";
import { Navbar } from "./navbar";

const BANNER_HEIGHT_HOME = 65;
const BANNER_HEIGHT_PAGE = 35;
const MAIN_OVERLAP_REM = 3.5;
const NAVBAR_HEIGHT_REM = 4.5;

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
  const bannerHeightVh = isHomePage ? BANNER_HEIGHT_HOME : BANNER_HEIGHT_PAGE;

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
            bannerHeightVh={bannerHeightVh}
          />
        </div>
      </div>

      {/* 🖼️ Banner 背景图（动态黄金焦点优化版） */}
      <div
        className="absolute left-0 right-0 top-0 z-10 overflow-hidden transition-[height] duration-300 ease-in-out select-none"
        style={{ height: `${bannerHeightVh}vh` }}
      >
        <img
          src={siteConfig.theme.fuwari.homeBg}
          alt="banner"
          fetchPriority="high"
          className="w-full h-full object-cover transition-[object-position] duration-300 ease-in-out"
          style={{
            // 🎯 核心优化：
            // 水平轴死锁 40%：确保窄屏下左侧的久远永远在屏幕内，同时带鱼屏下保留中间的哈克
            // 垂直轴动态计算：首页(65vh)时重心在 35% 尽显雪山与双人构图；普通页(35vh)时重心上提至 20%，死锁头部，防止被卡片推上来挡住
            objectPosition: isHomePage ? "40% 35%" : "40% 20%",
          }}
        />
      </div>

      {/* 📄 主内容区域 */}
      <div
        className="relative z-30 transition-[margin-top] duration-300 ease-in-out"
        style={{
          marginTop: `calc(${bannerHeightVh}vh - ${MAIN_OVERLAP_REM}rem - ${NAVBAR_HEIGHT_REM}rem)`,
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
        </div>
      </div>
    </div>
  );
}
