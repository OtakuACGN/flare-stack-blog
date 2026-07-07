import type { FieldPath } from "react-hook-form";
import type { SystemConfig } from "@/features/config/config.schema";
import {
  DEFAULT_FUWARI_BANNER_CROP,
  FUWARI_BANNER_POSITION_MAX,
  FUWARI_BANNER_POSITION_MIN,
  FUWARI_BANNER_SCALE_MAX,
  FUWARI_BANNER_SCALE_MIN,
  type FuwariBannerCropInput,
} from "@/features/config/site-config.schema";

export type FuwariBannerMode = "home" | "page";
export type FuwariBannerViewport = "desktop" | "mobile";

export type FuwariBannerCropValue = {
  x: number;
  y: number;
  scale: number;
};

export type FuwariBannerPreviewRect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

export type FuwariBannerPointer = {
  clientX: number;
  clientY: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function roundPercent(value: number) {
  return Math.round(value * 10) / 10;
}

function roundScale(value: number) {
  return Math.round(value * 100) / 100;
}

function getFiniteNumber(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isFinite(value)
    ? value
    : fallback;
}

export function getFuwariBannerPreviewUrl(value: unknown): string | null {
  if (typeof value !== "string") return null;

  const trimmed = value.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("/")) return trimmed;
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  return null;
}

export function getFuwariBannerCropValue(
  banner: FuwariBannerCropInput | undefined,
  mode: FuwariBannerMode,
  viewport: FuwariBannerViewport,
): FuwariBannerCropValue {
  const fallback = DEFAULT_FUWARI_BANNER_CROP[mode][viewport];
  const current = banner?.[mode]?.[viewport];

  return {
    x: getFiniteNumber(current?.x, fallback.x),
    y: getFiniteNumber(current?.y, fallback.y),
    scale: getFiniteNumber(current?.scale, fallback.scale),
  };
}

export function resolveFuwariBannerCropUpdate(
  current: FuwariBannerCropValue,
  next: Partial<FuwariBannerCropValue>,
): FuwariBannerCropValue {
  const merged = {
    ...current,
    ...next,
  };

  return {
    x: roundPercent(
      clamp(
        merged.x,
        FUWARI_BANNER_POSITION_MIN,
        FUWARI_BANNER_POSITION_MAX,
      ),
    ),
    y: roundPercent(
      clamp(
        merged.y,
        FUWARI_BANNER_POSITION_MIN,
        FUWARI_BANNER_POSITION_MAX,
      ),
    ),
    scale: roundScale(
      clamp(merged.scale, FUWARI_BANNER_SCALE_MIN, FUWARI_BANNER_SCALE_MAX),
    ),
  };
}

export function getFuwariBannerCropFromPointer(
  rect: FuwariBannerPreviewRect,
  pointer: FuwariBannerPointer,
): Pick<FuwariBannerCropValue, "x" | "y"> | null {
  if (rect.width <= 0 || rect.height <= 0) return null;

  return {
    x: ((pointer.clientX - rect.left) / rect.width) * 100,
    y: ((pointer.clientY - rect.top) / rect.height) * 100,
  };
}

export function getFuwariBannerCropFieldPath(
  mode: FuwariBannerMode,
  viewport: FuwariBannerViewport,
  field: keyof FuwariBannerCropValue,
) {
  return `site.theme.fuwari.banner.${mode}.${viewport}.${field}` as FieldPath<SystemConfig>;
}
