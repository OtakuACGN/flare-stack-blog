import { z } from "zod";
import type { Messages } from "@/lib/i18n";
import {
  createAssetPathSchema,
  createOptionalAssetPathFormSchema,
  createOptionalAssetPathSchema,
  createSiteTextFormSchema,
  createSiteTextSchema,
  SocialLinkSchema,
} from "./site-config/fields";
import {
  createDefaultThemeSiteConfigInputFormSchema,
  defaultThemeBackgroundInputSchema,
  defaultThemeBackgroundSchema,
  defaultThemeSiteConfigInputSchema,
  defaultThemeSiteConfigSchema,
  DEFAULT_THEME_BLUR_MAX,
  DEFAULT_THEME_BLUR_MIN,
  DEFAULT_THEME_OPACITY_MAX,
  DEFAULT_THEME_OPACITY_MIN,
  DEFAULT_THEME_TRANSITION_MAX,
  DEFAULT_THEME_TRANSITION_MIN,
  normalizeDefaultThemeSiteConfig,
  type DefaultThemeBackground,
  type DefaultThemeSiteConfig,
  type DefaultThemeSiteConfigInput,
} from "./site-config/themes/default";
import {
  createFuwariThemeSiteConfigInputFormSchema,
  DEFAULT_FUWARI_BANNER_CROP,
  fuwariThemeSiteConfigInputSchema,
  fuwariThemeSiteConfigSchema,
  FUWARI_BANNER_POSITION_MAX,
  FUWARI_BANNER_POSITION_MIN,
  FUWARI_BANNER_SCALE_MAX,
  FUWARI_BANNER_SCALE_MIN,
  FUWARI_THEME_HUE_MAX,
  FUWARI_THEME_HUE_MIN,
  normalizeFuwariBannerCrop,
  normalizeFuwariThemeSiteConfig,
  type FuwariBannerCrop,
  type FuwariBannerCropInput,
  type FuwariThemeSiteConfig,
  type FuwariThemeSiteConfigInput,
} from "./site-config/themes/fuwari";

export {
  defaultThemeBackgroundInputSchema,
  defaultThemeBackgroundSchema,
  defaultThemeSiteConfigInputSchema,
  defaultThemeSiteConfigSchema,
  DEFAULT_FUWARI_BANNER_CROP,
  DEFAULT_THEME_BLUR_MAX,
  DEFAULT_THEME_BLUR_MIN,
  DEFAULT_THEME_OPACITY_MAX,
  DEFAULT_THEME_OPACITY_MIN,
  DEFAULT_THEME_TRANSITION_MAX,
  DEFAULT_THEME_TRANSITION_MIN,
  fuwariThemeSiteConfigInputSchema,
  fuwariThemeSiteConfigSchema,
  FUWARI_BANNER_POSITION_MAX,
  FUWARI_BANNER_POSITION_MIN,
  FUWARI_BANNER_SCALE_MAX,
  FUWARI_BANNER_SCALE_MIN,
  FUWARI_THEME_HUE_MAX,
  FUWARI_THEME_HUE_MIN,
  normalizeDefaultThemeSiteConfig,
  normalizeFuwariBannerCrop,
  normalizeFuwariThemeSiteConfig,
  SocialLinkSchema,
};

export type {
  DefaultThemeBackground,
  DefaultThemeSiteConfig,
  DefaultThemeSiteConfigInput,
  FuwariBannerCrop,
  FuwariBannerCropInput,
  FuwariThemeSiteConfig,
  FuwariThemeSiteConfigInput,
};

export const FullSiteConfigSchema = z.object({
  title: createSiteTextSchema(120),
  author: createSiteTextSchema(80),
  description: createSiteTextSchema(300),
  social: z.array(SocialLinkSchema),
  icons: z.object({
    faviconSvg: createAssetPathSchema(),
    faviconIco: createAssetPathSchema(),
    favicon96: createAssetPathSchema(),
    appleTouchIcon: createAssetPathSchema(),
    webApp192: createAssetPathSchema(),
    webApp512: createAssetPathSchema(),
  }),
  theme: z.object({
    default: defaultThemeSiteConfigSchema,
    fuwari: fuwariThemeSiteConfigSchema,
  }),
});

export function createSiteConfigInputFormSchema(messages: Messages) {
  return z.object({
    title: createSiteTextFormSchema(120, messages).optional(),
    author: createSiteTextFormSchema(80, messages).optional(),
    description: createSiteTextFormSchema(300, messages).optional(),
    social: z.array(SocialLinkSchema).optional(),
    icons: z
      .object({
        faviconSvg: createOptionalAssetPathFormSchema(messages).optional(),
        faviconIco: createOptionalAssetPathFormSchema(messages).optional(),
        favicon96: createOptionalAssetPathFormSchema(messages).optional(),
        appleTouchIcon: createOptionalAssetPathFormSchema(messages).optional(),
        webApp192: createOptionalAssetPathFormSchema(messages).optional(),
        webApp512: createOptionalAssetPathFormSchema(messages).optional(),
      })
      .optional(),
    theme: z
      .object({
        default:
          createDefaultThemeSiteConfigInputFormSchema(messages).optional(),
        fuwari: createFuwariThemeSiteConfigInputFormSchema(messages).optional(),
      })
      .optional(),
  });
}

export const SiteConfigInputSchema = z.object({
  title: createSiteTextSchema(120).optional(),
  author: createSiteTextSchema(80).optional(),
  description: createSiteTextSchema(300).optional(),
  social: z.array(SocialLinkSchema).optional(),
  icons: z
    .object({
      faviconSvg: createOptionalAssetPathSchema().optional(),
      faviconIco: createOptionalAssetPathSchema().optional(),
      favicon96: createOptionalAssetPathSchema().optional(),
      appleTouchIcon: createOptionalAssetPathSchema().optional(),
      webApp192: createOptionalAssetPathSchema().optional(),
      webApp512: createOptionalAssetPathSchema().optional(),
    })
    .optional(),
  theme: z
    .object({
      default: defaultThemeSiteConfigInputSchema.optional(),
      fuwari: fuwariThemeSiteConfigInputSchema.optional(),
    })
    .optional(),
});

export const SiteConfigSchema = SiteConfigInputSchema;

export type SiteConfig = z.infer<typeof FullSiteConfigSchema>;
export type SiteConfigInput = z.infer<typeof SiteConfigInputSchema>;
