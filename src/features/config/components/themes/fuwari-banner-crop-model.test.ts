import { describe, expect, it } from "vitest";
import type { FuwariBannerCropInput } from "@/features/config/site-config.schema";
import {
  getFuwariBannerCropFieldPath,
  getFuwariBannerCropFromPointer,
  getFuwariBannerCropValue,
  getFuwariBannerPreviewUrl,
  resolveFuwariBannerCropUpdate,
} from "./fuwari-banner-crop-model";

describe("fuwari banner crop model", () => {
  it("accepts only root-relative and http(s) preview URLs", () => {
    expect(getFuwariBannerPreviewUrl(" /images/banner.webp ")).toBe(
      "/images/banner.webp",
    );
    expect(getFuwariBannerPreviewUrl("https://example.com/banner.webp")).toBe(
      "https://example.com/banner.webp",
    );
    expect(getFuwariBannerPreviewUrl("http://example.com/banner.webp")).toBe(
      "http://example.com/banner.webp",
    );
    expect(getFuwariBannerPreviewUrl("images/banner.webp")).toBeNull();
    expect(getFuwariBannerPreviewUrl("ftp://example.com/banner.webp")).toBeNull();
    expect(getFuwariBannerPreviewUrl("   ")).toBeNull();
    expect(getFuwariBannerPreviewUrl(null)).toBeNull();
  });

  it("falls back to the mode and viewport default for missing crop values", () => {
    expect(getFuwariBannerCropValue(undefined, "home", "desktop")).toEqual({
      x: 40,
      y: 35,
      scale: 1,
    });

    expect(
      getFuwariBannerCropValue(
        {
          page: {
            mobile: {
              x: 12,
            },
          },
        },
        "page",
        "mobile",
      ),
    ).toEqual({
      x: 12,
      y: 25,
      scale: 1,
    });
  });

  it("ignores non-finite crop values before rendering", () => {
    const banner = {
      home: {
        desktop: {
          x: Number.NaN,
          y: Number.POSITIVE_INFINITY,
          scale: 1.25,
        },
      },
    } as unknown as FuwariBannerCropInput;

    expect(getFuwariBannerCropValue(banner, "home", "desktop")).toEqual({
      x: 40,
      y: 35,
      scale: 1.25,
    });
  });

  it("clamps and rounds crop updates to configured limits", () => {
    expect(
      resolveFuwariBannerCropUpdate(
        { x: 40, y: 35, scale: 1 },
        { x: 123.456, y: -5.432, scale: 1.237 },
      ),
    ).toEqual({
      x: 100,
      y: 0,
      scale: 1.24,
    });
  });

  it("calculates pointer crop coordinates from the preview rectangle", () => {
    expect(
      getFuwariBannerCropFromPointer(
        { left: 10, top: 20, width: 200, height: 100 },
        { clientX: 110, clientY: 45 },
      ),
    ).toEqual({
      x: 50,
      y: 25,
    });

    expect(
      getFuwariBannerCropFromPointer(
        { left: 0, top: 0, width: 0, height: 100 },
        { clientX: 10, clientY: 10 },
      ),
    ).toBeNull();
  });

  it("builds the react-hook-form path for the active crop field", () => {
    expect(getFuwariBannerCropFieldPath("page", "mobile", "scale")).toBe(
      "site.theme.fuwari.banner.page.mobile.scale",
    );
  });
});
