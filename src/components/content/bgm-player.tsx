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
    // 1. 动态加载 APlayer 样式与脚本
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdn.jsdelivr.net/npm/aplayer/dist/APlayer.min.css";
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/aplayer/dist/APlayer.min.js";
    script.async = true;
    document.body.appendChild(script);

    // 2. 动态加载 Live2D 看板娘核心脚本
    const l2dScript = document.createElement("script");
    l2dScript.src = "https://cdn.jsdelivr.net/npm/live2d-widget@3.1.4/lib/L2Dwidget.min.js";
    l2dScript.async = true;
    document.body.appendChild(l2dScript);

    // 3. 当所有脚本加载完后执行联动
    script.onload = () => {
      l2dScript.onload = () => {
        // @ts-ignore
        if (window.APlayer && window.L2Dwidget) {
          
          // 🏠 初始化右下角的久远看板娘
          // @ts-ignore
          window.L2Dwidget.init({
            model: {
              // 🦊 已成功替换为久远（Lost Flag版）的高清 Live2D 模型直链
              jsonPath: "https://cdn.jsdelivr.net/gh/Eikanya/Live2d-model@master/Utawarerumono/kuon_lostflag/index.json",
              scale: 1
            },
            display: {
              position: "right",
              width: 160,
              height: 320,
              hOffset: 25,
              vOffset: 20
            },
            mobile: {
              show: false // 移动端自动隐藏，防止挡住文章
            },
            react: {
              opacity: 0.95
            }
          });

          // 🎵 初始化左下角的播放器容器
          const aplayerContainer = document.createElement("div");
          aplayerContainer.id = "global-aplayer";
          document.body.appendChild(aplayerContainer);

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
              const ap = new window.APlayer({
                container: aplayerContainer,
                fixed: true,
                mini: true,
                autoplay: false,
                loop: "all",
                order: "random",
                volume: 0.4,
                listFolded: true,
                audio: audioList,
              });

              // 🔗 核心联动：监听播放器切歌事件，让久远吐槽！
              ap.on("listswitch", ({ index }: { index: number }) => {
                const currentSong = audioList[index].name;
                
                // 寻找 Live2Dwidget 自动生成的提示框 DOM
                const tipElement = document.querySelector(".live2d-tips");
                if (tipElement) {
                  if (currentSong.includes("梦想歌")) {
                    tipElement.innerHTML = "🎶 “解き放て、すべてを…” 哇！是初代最经典的《梦想歌》！";
                  } else if (currentSong.includes("キミガタメ")) {
                    tipElement.innerHTML = "😭 呜呜，大大的神曲《为你》…听到这首歌眼眶又湿润了。";
                  } else if (currentSong.includes("不安定な神様")) {
                    tipElement.innerHTML = "⚔️ 正在播放《虚伪的假面》主题曲！哈克，你可别想逃跑划水了！";
                  } else if (currentSong.includes("理燃")) {
                    tipElement.innerHTML = "🔥 噢！《二人的白皇》OP《理燃》！属于哈克的执念与宿命啊…";
                  } else {
                    tipElement.innerHTML = `🎵 正在为你播放 Suara 姐姐的：${currentSong} ~`;
                  }
                  
                  // 气泡闪现
                  tipElement.setAttribute("style", "opacity: 1; visibility: visible; transition: 0.3s;");
                  setTimeout(() => {
                    tipElement.setAttribute("style", "opacity: 0; visibility: hidden; transition: 0.3s;");
                  }, 5000);
                }
              });
            });
        }
      };
    };

    return () => {
      link.remove();
      script.remove();
      l2dScript.remove();
      document.getElementById("global-aplayer")?.remove();
      document.getElementById("live2d-widget")?.remove();
    };
  }, []);

  return null;
}
