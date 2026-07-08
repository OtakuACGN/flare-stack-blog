import { describe, expect, it } from "vitest";
import {
  FUWARI_BANNER_HEIGHT_HOME,
  FUWARI_BANNER_HEIGHT_PAGE,
  getFuwariBannerHeightCss,
  getFuwariBannerImageStyle,
} from "./banner-model";

describe("fuwari banner model", () => {
  it("formats banner height as a responsive clamp expression", () => {
    expect(getFuwariBannerHeightCss(FUWARI_BANNER_HEIGHT_HOME)).toBe(
      "clamp(18rem, 58vh, 36rem)",
    );
    expect(getFuwariBannerHeightCss(FUWARI_BANNER_HEIGHT_PAGE)).toBe(
      "clamp(12rem, 32vh, 22rem)",
    );
  });

  it("uses the default home crop when no crop is configured", () => {
    expect(getFuwariBannerImageStyle(undefined, "home")).toEqual({
      "--fuwari-banner-desktop-position": "40% 35%",
      "--fuwari-banner-desktop-origin": "40% 35%",
      "--fuwari-banner-desktop-scale": "1",
      "--fuwari-banner-mobile-position": "45% 35%",
      "--fuwari-banner-mobile-origin": "45% 35%",
      "--fuwari-banner-mobile-scale": "1",
    });
  });

  it("uses the default page crop when rendering non-home pages", () => {
    expect(getFuwariBannerImageStyle(undefined, "page")).toEqual({
      "--fuwari-banner-desktop-position": "40% 20%",
      "--fuwari-banner-desktop-origin": "40% 20%",
      "--fuwari-banner-desktop-scale": "1",
      "--fuwari-banner-mobile-position": "50% 25%",
      "--fuwari-banner-mobile-origin": "50% 25%",
      "--fuwari-banner-mobile-scale": "1",
    });
  });

  it("maps configured desktop and mobile crops to CSS variables", () => {
    expect(
      getFuwariBannerImageStyle(
        {
          home: {
            desktop: { x: 10.5, y: 20.25, scale: 1.35 },
            mobile: { x: 60, y: 70, scale: 1.12 },
          },
          page: {
            desktop: { x: 15, y: 30, scale: 1.2 },
            mobile: { x: 35, y: 45, scale: 1.08 },
          },
        },
        "page",
      ),
    ).toEqual({
      "--fuwari-banner-desktop-position": "15% 30%",
      "--fuwari-banner-desktop-origin": "15% 30%",
      "--fuwari-banner-desktop-scale": "1.2",
      "--fuwari-banner-mobile-position": "35% 45%",
      "--fuwari-banner-mobile-origin": "35% 45%",
      "--fuwari-banner-mobile-scale": "1.08",
    });
  });
});
