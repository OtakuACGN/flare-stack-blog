import { useEffect } from "react";

export function BgmPlayer() {
  useEffect(() => {
    // 1. 动态加载 APlayer 的标准 CSS 样式
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdn.jsdelivr.net/npm/aplayer/dist/APlayer.min.css";
    document.head.appendChild(link);

    // 2. 动态加载 APlayer 的 JS 核心库
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/aplayer/dist/APlayer.min.js";
    script.async = true;
    document.body.appendChild(script);

    // 3. 当脚本加载完毕后，使用纯 JS 初始化播放器，避开服务器端渲染的所有玄学 bug
    script.onload = () => {
      // @ts-ignore
      if (window.APlayer) {
        // 创建一个绝对干净、游离在页面普通布局之外的容器
        const aplayerContainer = document.createElement("div");
        aplayerContainer.id = "global-aplayer";
        document.body.appendChild(aplayerContainer);

        // 通过网易云 API 动态获取你的歌单切片，不用自定义标签
        fetch("https://api.i-meto.com/meting/api?server=netease&type=playlist&id=18006742006")
          .then((res) => res.json())
          .then((songs) => {
            // 将网易云的标准歌单格式转换为 APlayer 认识的格式
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
              fixed: true,          // 启用标准的官方吸底模式
              mini: true,           // 迷你模式
              autoplay: false,      // 防浏览器拦截
              loop: "all",
              order: "random",
              volume: 0.4,
              listFolded: true,
              audio: audioList,     // 传入转换好的歌曲数据
            });
          })
          .catch((err) => console.error("网易云歌单解析失败: ", err));
      }
    };

    return () => {
      // 组件销毁时彻底清理，不给网页留一丝垃圾
      link.remove();
      script.remove();
      document.getElementById("global-aplayer")?.remove();
    };
  }, []);

  // 🎯 极其纯净：由于是用纯 JS 独立动态挂载到 body 下的，这里组件返回“空”，100% 不破坏你原本页面的任何 HTML 结构和卡片布局！
  return null;
}
