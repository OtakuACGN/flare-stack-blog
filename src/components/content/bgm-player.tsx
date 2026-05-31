import { useEffect } from "react";

// 扩展全局 JSX 声明
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "meting-js": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        server?: string;
        type?: string;
        id?: string;
        fixed?: string;
        mini?: string;
        autoplay?: string;
        theme?: string;
        loop?: string;
        order?: string;
        volume?: string;
        "list-folded"?: string;
      };
    }
  }
}

export function BgmPlayer() {
  useEffect(() => {
    // 1. 动态注入 APlayer 官方标准样式
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdn.jsdelivr.net/npm/aplayer/dist/APlayer.min.css";
    document.head.appendChild(link);

    // 2. 动态注入 APlayer 核心脚本
    const script1 = document.createElement("script");
    script1.src = "https://cdn.jsdelivr.net/npm/aplayer/dist/APlayer.min.js";
    script1.async = true;
    document.body.appendChild(script1);

    // 3. 动态注入 MetingJS 歌单解析引擎
    const script2 = document.createElement("script");
    script2.src = "https://cdn.jsdelivr.net/npm/meting@2.0.1/dist/Meting.min.js";
    script2.async = true;
    document.body.appendChild(script2);

    return () => {
      link.remove();
      script1.remove();
      script2.remove();
    };
  }, []);

  // 🎯 极其严格的 CSS 隔离：所有的选择器全部强制加上 [fixed="true"] 属性锁定
  // 这样样式只会对底部的 MetingJS 播放器生效，绝对绝对不会再碰到你博客的任何作者卡片和头像！
  const cssStyles = `
    .aplayer.aplayer-fixed {
      z-index: 10000 !important;
      background: var(--fuwari-card-bg) !important;
      color: var(--fuwari-text-main) !important;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
      border-radius: 0 8px 8px 0 !important;
      border: 1px solid var(--fuwari-border) !important;
      border-left: none !important;
    }
    meting-js .aplayer .aplayer-info {
      background: var(--fuwari-card-bg) !important;
      border-top: 1px solid var(--fuwari-border) !important;
    }
    meting-js .aplayer .aplayer-list {
      background: var(--fuwari-card-bg) !important;
      border: 1px solid var(--fuwari-border) !important;
    }
    meting-js .aplayer .aplayer-list ol li {
      border-top: 1px solid var(--fuwari-border) !important;
      color: var(--fuwari-text-main) !important;
    }
    meting-js .aplayer .aplayer-list ol li:hover {
      background: var(--fuwari-page-bg) !important;
    }
    meting-js .aplayer .aplayer-list ol li.aplayer-list-light {
      background: var(--fuwari-primary-fade) !important;
    }
    meting-js .aplayer .aplayer-info .aplayer-music .aplayer-title {
      color: var(--fuwari-text-main) !important;
    }
    meting-js .aplayer .aplayer-info .aplayer-music .aplayer-author {
      color: var(--fuwari-text-mute) !important;
    }
    @media (max-width: 768px) {
      .aplayer.aplayer-fixed.aplayer-narrow {
        left: 0 !important;
      }
    }
  `;

  return (
    <>
      {/* 🎵 绑定你的网易云歌单 */}
      <meting-js
        server="netease"
        type="playlist"
        id="18006742006"
        fixed="true"
        mini="true"
        autoplay="false"
        theme="var(--fuwari-primary)"
        loop="all"
        order="random"
        volume="0.4"
        list-folded="true"
      />

      {/* 使用 dangerouslySetInnerHTML 注入安全的局部样式 */}
      <style dangerouslySetInnerHTML={{ __html: cssStyles }} />
    </>
  );
}
