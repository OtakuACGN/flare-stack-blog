import { useEffect } from "react";

// 💡 扩展全局 JSX 声明，彻底解决 TypeScript 报未知标签错误，确保 Cloudflare 编译大绿灯
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
    // 注入 APlayer 官方标准样式
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdn.jsdelivr.net/npm/aplayer/dist/APlayer.min.css";
    document.head.appendChild(link);

    // 注入 APlayer 核心脚本
    const script1 = document.createElement("script");
    script1.src = "https://cdn.jsdelivr.net/npm/aplayer/dist/APlayer.min.js";
    script1.async = true;
    document.body.appendChild(script1);

    // 注入 MetingJS 歌单解析引擎
    const script2 = document.createElement("script");
    script2.src = "https://cdn.jsdelivr.net/npm/meting@2.0.1/dist/Meting.min.js";
    script2.async = true;
    document.body.appendChild(script2);

    return () => {
      // 组件销毁时清理副作用
      link.remove();
      script1.remove();
      script2.remove();
    };
  }, []);

  return (
    <>
      {/* 🎵 完美绑定你的专属网易云歌单 */}
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

      {/* 🎨 Fuwari 博客主题皮肤完美融合样式 */}
      <style>{`
        .aplayer.aplayer-fixed {
          z-index: 100 !important;
          background: var(--fuwari-card-bg) !important;
          color: var(--fuwari-text-main) !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
          border-radius: 0 8px 8px 0 !important;
          border: 1px solid var(--fuwari-border) !important;
          border-left: none !important;
        }
        .aplayer .aplayer-info {
          background: var(--fuwari-card-bg) !important;
          border-top: 1px solid var(--fuwari-border) !important;
        }
        .aplayer .aplayer-list {
          background: var(--fuwari-card-bg) !important;
          border: 1px solid var(--fuwari-border) !important;
        }
        .aplayer .aplayer-list ol li {
          border-top: 1px solid var(--fuwari-border) !important;
          color: var(--fuwari-text-main) !important;
        }
        .aplayer .aplayer-list ol li:hover {
          background: var(--fuwari-page-bg) !important;
        }
        .aplayer .aplayer-list ol li.aplayer-list-light {
          background: var(--fuwari-primary-fade) !important;
        }
        .aplayer .aplayer-info .aplayer-music .aplayer-title {
          color: var(--fuwari-text-main) !important;
        }
        .aplayer .aplayer-info .aplayer-music .aplayer-author {
          color: var(--fuwari-text-mute) !important;
        }
        @media (max-width: 768px) {
          .aplayer.aplayer-fixed.aplayer-narrow {
            left: 0 !important;
          }
        }
      `}</style>
    </>
  );
}
