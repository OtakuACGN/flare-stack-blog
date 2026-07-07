import { useEffect } from "react";

declare global {
  interface Window {
    APlayer?: new (options: APlayerOptions) => APlayerInstance;
  }
}

interface APlayerInstance {
  destroy?: () => void;
}

interface APlayerOptions {
  container: HTMLElement;
  fixed: boolean;
  mini: boolean;
  autoplay: boolean;
  loop: "all" | "one" | "none";
  order: "list" | "random";
  volume: number;
  listFolded: boolean;
  audio: Array<APlayerAudio>;
}

interface APlayerAudio {
  name: string;
  artist: string;
  url: string;
  cover?: string;
  lrc?: string;
}

const playlistUrl =
  "https://api.i-meto.com/meting/api?server=netease&type=playlist&id=18006742006";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function optionalString(value: unknown) {
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

function toAPlayerAudio(song: unknown): APlayerAudio | null {
  if (!isRecord(song)) {
    return null;
  }

  const url = optionalString(song.url);
  if (!url) {
    return null;
  }

  return {
    name: optionalString(song.title) ?? "Untitled",
    artist: optionalString(song.author) ?? "Unknown Artist",
    url,
    cover: optionalString(song.pic),
    lrc: optionalString(song.lrc),
  };
}

export function BgmPlayer() {
  useEffect(() => {
    let isDisposed = false;
    let player: APlayerInstance | null = null;
    let aplayerContainer: HTMLDivElement | null = null;
    const controller = new AbortController();

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdn.jsdelivr.net/npm/aplayer/dist/APlayer.min.css";
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/aplayer/dist/APlayer.min.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (isDisposed || !window.APlayer) {
        return;
      }

      document.getElementById("global-aplayer")?.remove();
      aplayerContainer = document.createElement("div");
      aplayerContainer.id = "global-aplayer";
      document.body.appendChild(aplayerContainer);

      fetch(playlistUrl, { signal: controller.signal })
        .then((res) => {
          if (!res.ok) {
            throw new Error(`Failed to load playlist: ${res.status}`);
          }
          return res.json();
        })
        .then((songs: unknown) => {
          if (isDisposed || !window.APlayer || !aplayerContainer) {
            return;
          }

          const audio = Array.isArray(songs)
            ? songs.map(toAPlayerAudio).filter((song) => song !== null)
            : [];

          if (audio.length === 0) {
            aplayerContainer.remove();
            aplayerContainer = null;
            return;
          }

          player = new window.APlayer({
            container: aplayerContainer,
            fixed: true,
            mini: true,
            autoplay: false,
            loop: "all",
            order: "random",
            volume: 0.4,
            listFolded: true,
            audio,
          });
        })
        .catch((error: unknown) => {
          if (!controller.signal.aborted) {
            console.warn("Failed to initialize BGM player", error);
          }
          aplayerContainer?.remove();
          aplayerContainer = null;
        });
    };

    return () => {
      isDisposed = true;
      controller.abort();
      player?.destroy?.();
      link.remove();
      script.remove();
      aplayerContainer?.remove();
      aplayerContainer = null;
    };
  }, []);

  return null;
}
