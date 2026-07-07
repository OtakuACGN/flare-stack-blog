import { describe, expect, it } from "vitest";
import type { SiteConfig } from "@/features/config/site-config.schema";
import {
  compactImageRefs,
  getThemePreloadImagesForTheme,
} from "./site-config.helpers";

type SiteConfigOverrides = Omit<Partial<SiteConfig>, "theme"> & {
  theme?: {
    default?: Partial<SiteConfig["theme"]["default"]>;
    fuwari?: Partial<SiteConfig["theme"]["fuwari"]>;
  };
};

function createSiteConfig(overrides?: SiteConfigOverrides): SiteConfig {
  const base: SiteConfig = {
    title: "Site",
    author: "Author",
    description: "Description",
    social: [],
    icons: {
      faviconSvg: "/favicon.svg",
      faviconIco: "/favicon.ico",
      favicon96: "/favicon-96x96.png",
      appleTouchIcon: "/apple-touch-icon.png",
      webApp192: "/web-app-manifest-192x192.png",
      webApp512: "/web-app-manifest-512x512.png",
    },
    theme: {
      default: {
        navBarName: "Default",
      },
      fuwari: {
        homeBg: "/images/home-bg.webp",
        avatar: "/images/avatar.png",
        primaryHue: 250,
        banner: {
          home: {
            desktop: { x: 40, y: 35, scale: 1 },
            mobile: { x: 45, y: 35, scale: 1 },
          },
          page: {
            desktop: { x: 40, y: 20, scale: 1 },
            mobile: { x: 50, y: 25, scale: 1 },
          },
        },
      },
    },
  };

  return {
    ...base,
    ...overrides,
    icons: {
      ...base.icons,
      ...overrides?.icons,
    },
    theme: {
      default: {
        ...base.theme.default,
        ...overrides?.theme?.default,
      },
      fuwari: {
        ...base.theme.fuwari,
        ...overrides?.theme?.fuwari,
      },
    },
  };
}

describe("theme site config helpers", () => {
  it("filters, trims, and deduplicates image refs while preserving order", () => {
    expect(
      compactImageRefs([
        undefined,
        "",
        "  /images/home.webp  ",
        "/images/home.webp",
        null,
        "/images/global.webp",
      ]),
    ).toEqual(["/images/home.webp", "/images/global.webp"]);
  });

  it("returns the fuwari banner background as the only preload image", () => {
    expect(
      getThemePreloadImagesForTheme(
        "fuwari",
        createSiteConfig({
          theme: {
            fuwari: {
              homeBg: "  /images/fuwari-home.webp  ",
              avatar: "/images/avatar.png",
              primaryHue: 250,
              banner: {
                home: {
                  desktop: { x: 40, y: 35, scale: 1 },
                  mobile: { x: 45, y: 35, scale: 1 },
                },
                page: {
                  desktop: { x: 40, y: 20, scale: 1 },
                  mobile: { x: 50, y: 25, scale: 1 },
                },
              },
            },
          },
        }),
      ),
    ).toEqual(["/images/fuwari-home.webp"]);
  });

  it("returns default theme background images without duplicates", () => {
    expect(
      getThemePreloadImagesForTheme(
        "default",
        createSiteConfig({
          theme: {
            default: {
              navBarName: "Default",
              background: {
                homeImage: "/images/shared.webp",
                globalImage: " /images/shared.webp ",
                light: { opacity: 0.15 },
                dark: { opacity: 0.1 },
                backdropBlur: 8,
                transitionDuration: 600,
              },
            },
          },
        }),
      ),
    ).toEqual(["/images/shared.webp"]);
  });

  it("returns no preload images when the default theme has no background", () => {
    expect(getThemePreloadImagesForTheme("default", createSiteConfig())).toEqual(
      [],
    );
  });
});
