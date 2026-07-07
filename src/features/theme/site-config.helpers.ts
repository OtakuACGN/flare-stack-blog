import type { SiteConfig } from "@/features/config/site-config.schema";
import type { ThemeName } from "@/features/theme/registry";

export function compactImageRefs(
  images: Array<string | null | undefined>,
): string[] {
  const refs = new Set<string>();

  for (const image of images) {
    const ref = image?.trim();
    if (ref) refs.add(ref);
  }

  return [...refs];
}

export function getThemePreloadImagesForTheme(
  themeName: ThemeName,
  siteConfig: SiteConfig,
): string[] {
  switch (themeName) {
    case "fuwari":
      return compactImageRefs([siteConfig.theme.fuwari.homeBg]);
    case "default":
      return compactImageRefs([
        siteConfig.theme.default.background?.homeImage,
        siteConfig.theme.default.background?.globalImage,
      ]);
    default:
      themeName satisfies never;
      return [];
  }
}

// if the theme doesn't have a preload image, return an empty array
export function getThemePreloadImages(siteConfig: SiteConfig): Array<string> {
  return getThemePreloadImagesForTheme(__THEME_NAME__, siteConfig);
}
