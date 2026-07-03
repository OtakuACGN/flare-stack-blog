import { useEffect } from "react";

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
    // 1. 动态加载 APlayer 的 CSS 样式表
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdn.jsdelivr.net/npm/aplayer/dist/APlayer.min.css";
    document.head.appendChild(link);

    // 2. 动态加载 APlayer 的 JS 核心脚本
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/aplayer/dist/APlayer.min.js";
    script.async = true;
    document.body.appendChild(script);

    // 3. 脚本加载完成后，直接在页面最底层初始化固定播放器
    script.onload = () => {
      // @ts-ignore
      if (window.APlayer) {
        // 创建一个完全独立于博客正文流的绝对定位容器
        const aplayerContainer = document.createElement("div");
        aplayerContainer.id = "global-aplayer";
        document.body.appendChild(aplayerContainer);

        // 异步抓取你的 NetEase 专属传颂之物歌单数据
        fetch("https://api.i-meto.com/meting/api?server=netease&type=playlist&id=18006742006")
          .then((res) => res.json())
          .then((songs) => {
            const audioList = songs.map((song: any) => ({
              name: song.title,
              artist: song.author,
              url: song.url,
              cover: song.pic,
              lrc: song.lrc
            }));

            // @ts-ignore
            new window.APlayer({
              container: aplayerContainer,
              fixed: true,        // 吸附在左下角
              mini: true,         // 默认小按钮模式
              autoplay: true,    // 不自动播放
              loop: "all",        // 全曲循环
              order: "random",    // 随机播放
              volume: 0.4,        // 初始音量
              listFolded: true,   // 歌单默认折叠
              audio: audioList,
            });
          });
      }
    };

    // 组件卸载时彻底移除所有痕迹，不留一丝残余
    return () => {
      link.remove();
      script.remove();
      document.getElementById("global-aplayer")?.remove();
    };
  }, []);

  // 返回 null 意味着它在 Fuwari 博客的 HTML 排版网格中完全等于空气
  return null;
}
