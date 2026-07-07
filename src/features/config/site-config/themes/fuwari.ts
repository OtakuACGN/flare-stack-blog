import { z } from "zod";
import type { Messages } from "@/lib/i18n";
import {
  createAssetRefFormSchema,
  createAssetRefSchema,
  createBackgroundImageRefFormSchema,
  createBackgroundImageRefSchema,
} from "../fields";

export const FUWARI_THEME_HUE_MIN = 0;
export const FUWARI_THEME_HUE_MAX = 360;
export const FUWARI_BANNER_POSITION_MIN = 0;
export const FUWARI_BANNER_POSITION_MAX = 100;
export const FUWARI_BANNER_SCALE_MIN = 1;
export const FUWARI_BANNER_SCALE_MAX = 2;

export const DEFAULT_FUWARI_BANNER_CROP = {
  home: {
    desktop: { x: 40, y: 35, scale: 1 },
    mobile: { x: 45, y: 35, scale: 1 },
  },
  page: {
    desktop: { x: 40, y: 20, scale: 1 },
    mobile: { x: 50, y: 25, scale: 1 },
  },
};

function createHueSchema() {
  return z
    .number()
    .int()
    .min(FUWARI_THEME_HUE_MIN)
    .max(FUWARI_THEME_HUE_MAX, {
      message: `Value must be between ${FUWARI_THEME_HUE_MIN} and ${FUWARI_THEME_HUE_MAX}`,
    });
}

function createHueFormSchema(messages: Messages) {
  return z.number().int().min(FUWARI_THEME_HUE_MIN).max(FUWARI_THEME_HUE_MAX, {
    message: messages.settings_site_validation_hue_range(),
  });
}

function createFuwariBannerPositionSchema() {
  return z
    .number()
    .min(FUWARI_BANNER_POSITION_MIN)
    .max(FUWARI_BANNER_POSITION_MAX, {
      message: `Value must be between ${FUWARI_BANNER_POSITION_MIN} and ${FUWARI_BANNER_POSITION_MAX}`,
    });
}

function createFuwariBannerPositionFormSchema(messages: Messages) {
  return z
    .number()
    .min(FUWARI_BANNER_POSITION_MIN)
    .max(FUWARI_BANNER_POSITION_MAX, {
      message: messages.settings_site_validation_banner_position_range(),
    });
}

function createFuwariBannerScaleSchema() {
  return z
    .number()
    .min(FUWARI_BANNER_SCALE_MIN)
    .max(FUWARI_BANNER_SCALE_MAX, {
      message: `Value must be between ${FUWARI_BANNER_SCALE_MIN} and ${FUWARI_BANNER_SCALE_MAX}`,
    });
}

function createFuwariBannerScaleFormSchema(messages: Messages) {
  return z
    .number()
    .min(FUWARI_BANNER_SCALE_MIN)
    .max(FUWARI_BANNER_SCALE_MAX, {
      message: messages.settings_site_validation_banner_scale_range(),
    });
}

function createFuwariBannerViewportSchema() {
  return z.object({
    x: createFuwariBannerPositionSchema(),
    y: createFuwariBannerPositionSchema(),
    scale: createFuwariBannerScaleSchema(),
  });
}

function createFuwariBannerViewportInputSchema() {
  return z.object({
    x: createFuwariBannerPositionSchema().optional(),
    y: createFuwariBannerPositionSchema().optional(),
    scale: createFuwariBannerScaleSchema().optional(),
  });
}

function createFuwariBannerViewportInputFormSchema(messages: Messages) {
  return z.object({
    x: createFuwariBannerPositionFormSchema(messages).optional(),
    y: createFuwariBannerPositionFormSchema(messages).optional(),
    scale: createFuwariBannerScaleFormSchema(messages).optional(),
  });
}

function createFuwariBannerModeSchema() {
  return z.object({
    desktop: createFuwariBannerViewportSchema(),
    mobile: createFuwariBannerViewportSchema(),
  });
}

function createFuwariBannerModeInputSchema() {
  return z.object({
    desktop: createFuwariBannerViewportInputSchema().optional(),
    mobile: createFuwariBannerViewportInputSchema().optional(),
  });
}

function createFuwariBannerModeInputFormSchema(messages: Messages) {
  return z.object({
    desktop: createFuwariBannerViewportInputFormSchema(messages).optional(),
    mobile: createFuwariBannerViewportInputFormSchema(messages).optional(),
  });
}

function createFuwariBannerCropSchema() {
  return z.object({
    home: createFuwariBannerModeSchema(),
    page: createFuwariBannerModeSchema(),
  });
}

function createFuwariBannerCropInputSchema() {
  return z.object({
    home: createFuwariBannerModeInputSchema().optional(),
    page: createFuwariBannerModeInputSchema().optional(),
  });
}

function createFuwariBannerCropInputFormSchema(messages: Messages) {
  return z.object({
    home: createFuwariBannerModeInputFormSchema(messages).optional(),
    page: createFuwariBannerModeInputFormSchema(messages).optional(),
  });
}

function createFuwariThemeSiteConfigSchema() {
  return z.object({
    homeBg: createBackgroundImageRefSchema(),
    avatar: createAssetRefSchema(),
    primaryHue: createHueSchema(),
    banner: createFuwariBannerCropSchema(),
  });
}

function createFuwariThemeSiteConfigInputSchema() {
  return z.object({
    homeBg: createBackgroundImageRefSchema().optional(),
    avatar: createAssetRefSchema().optional(),
    primaryHue: createHueSchema().optional(),
    banner: createFuwariBannerCropInputSchema().optional(),
  });
}

export function createFuwariThemeSiteConfigInputFormSchema(
  messages: Messages,
) {
  return z.object({
    homeBg: createBackgroundImageRefFormSchema(messages).optional(),
    avatar: createAssetRefFormSchema(messages).optional(),
    primaryHue: createHueFormSchema(messages).optional(),
    banner: createFuwariBannerCropInputFormSchema(messages).optional(),
  });
}

export const fuwariThemeSiteConfigSchema =
  createFuwariThemeSiteConfigSchema();
export const fuwariThemeSiteConfigInputSchema =
  createFuwariThemeSiteConfigInputSchema();

export type FuwariThemeSiteConfig = z.infer<
  typeof fuwariThemeSiteConfigSchema
>;
export type FuwariThemeSiteConfigInput = z.infer<
  typeof fuwariThemeSiteConfigInputSchema
>;
export type FuwariBannerCrop = FuwariThemeSiteConfig["banner"];
export type FuwariBannerCropInput = NonNullable<
  FuwariThemeSiteConfigInput["banner"]
>;

export function normalizeFuwariBannerCrop(
  banner: FuwariBannerCropInput | undefined,
): FuwariBannerCrop {
  return {
    home: {
      desktop: {
        ...DEFAULT_FUWARI_BANNER_CROP.home.desktop,
        ...banner?.home?.desktop,
      },
      mobile: {
        ...DEFAULT_FUWARI_BANNER_CROP.home.mobile,
        ...banner?.home?.mobile,
      },
    },
    page: {
      desktop: {
        ...DEFAULT_FUWARI_BANNER_CROP.page.desktop,
        ...banner?.page?.desktop,
      },
      mobile: {
        ...DEFAULT_FUWARI_BANNER_CROP.page.mobile,
        ...banner?.page?.mobile,
      },
    },
  };
}

export function normalizeFuwariThemeSiteConfig({
  input,
  fallback,
}: {
  input: FuwariThemeSiteConfigInput | undefined;
  fallback: FuwariThemeSiteConfig;
}): FuwariThemeSiteConfig {
  return {
    homeBg: input?.homeBg ?? fallback.homeBg,
    avatar: input?.avatar ?? fallback.avatar,
    primaryHue: input?.primaryHue ?? fallback.primaryHue,
    banner: normalizeFuwariBannerCrop(input?.banner),
  };
}
