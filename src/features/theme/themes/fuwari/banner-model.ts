import type { CSSProperties } from "react";
import {
  DEFAULT_FUWARI_BANNER_CROP,
  type FuwariBannerCrop,
} from "@/features/config/site-config.schema";

export type FuwariBannerVariant = "home" | "page";

export type FuwariBannerHeightConfig = {
  minRem: number;
  preferredVh: number;
  maxRem: number;
};

export const FUWARI_BANNER_HEIGHT_HOME = {
  minRem: 18,
  preferredVh: 58,
  maxRem: 36,
} as const satisfies FuwariBannerHeightConfig;

export const FUWARI_BANNER_HEIGHT_PAGE = {
  minRem: 12,
  preferredVh: 32,
  maxRem: 22,
} as const satisfies FuwariBannerHeightConfig;

export function getFuwariBannerHeightCss({
  minRem,
  preferredVh,
  maxRem,
}: FuwariBannerHeightConfig) {
  return `clamp(${minRem}rem, ${preferredVh}vh, ${maxRem}rem)`;
}

export function getFuwariBannerImageStyle(
  crop: FuwariBannerCrop | undefined,
  variant: FuwariBannerVariant,
) {
  const desktop =
    crop?.[variant]?.desktop ?? DEFAULT_FUWARI_BANNER_CROP[variant].desktop;
  const mobile =
    crop?.[variant]?.mobile ?? DEFAULT_FUWARI_BANNER_CROP[variant].mobile;

  return {
    "--fuwari-banner-desktop-position": `${desktop.x}% ${desktop.y}%`,
    "--fuwari-banner-desktop-origin": `${desktop.x}% ${desktop.y}%`,
    "--fuwari-banner-desktop-scale": String(desktop.scale),
    "--fuwari-banner-mobile-position": `${mobile.x}% ${mobile.y}%`,
    "--fuwari-banner-mobile-origin": `${mobile.x}% ${mobile.y}%`,
    "--fuwari-banner-mobile-scale": String(mobile.scale),
  } as CSSProperties;
}
