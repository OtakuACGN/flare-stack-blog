import {
  FileText,
  Home,
  Monitor,
  RotateCcw,
  Smartphone,
} from "lucide-react";
import type { ComponentType, CSSProperties, PointerEvent } from "react";
import { useRef, useState } from "react";
import {
  type FieldPath,
  useFormContext,
  useWatch,
} from "react-hook-form";
import { Button } from "@/components/ui/button";
import type { SystemConfig } from "@/features/config/config.schema";
import {
  DEFAULT_FUWARI_BANNER_CROP,
  FUWARI_BANNER_POSITION_MAX,
  FUWARI_BANNER_POSITION_MIN,
  FUWARI_BANNER_SCALE_MAX,
  FUWARI_BANNER_SCALE_MIN,
  type FuwariBannerCropInput,
} from "@/features/config/site-config.schema";
import { cn } from "@/lib/utils";
import { m } from "@/paraglide/messages";

type BannerMode = "home" | "page";
type BannerViewport = "desktop" | "mobile";

type BannerCropValue = {
  x: number;
  y: number;
  scale: number;
};

const modeOptions = [
  { value: "home", icon: Home, label: () => m.settings_site_banner_crop_home() },
  { value: "page", icon: FileText, label: () => m.settings_site_banner_crop_page() },
] as const;

const viewportOptions = [
  {
    value: "desktop",
    icon: Monitor,
    label: () => m.settings_site_banner_crop_desktop(),
  },
  {
    value: "mobile",
    icon: Smartphone,
    label: () => m.settings_site_banner_crop_mobile(),
  },
] as const;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function roundPercent(value: number) {
  return Math.round(value * 10) / 10;
}

function roundScale(value: number) {
  return Math.round(value * 100) / 100;
}

function getPreviewUrl(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("/")) return trimmed;
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  return null;
}

function getCropValue(
  banner: FuwariBannerCropInput | undefined,
  mode: BannerMode,
  viewport: BannerViewport,
): BannerCropValue {
  const fallback = DEFAULT_FUWARI_BANNER_CROP[mode][viewport];
  const current = banner?.[mode]?.[viewport];

  return {
    x:
      typeof current?.x === "number" && Number.isFinite(current.x)
        ? current.x
        : fallback.x,
    y:
      typeof current?.y === "number" && Number.isFinite(current.y)
        ? current.y
        : fallback.y,
    scale:
      typeof current?.scale === "number" && Number.isFinite(current.scale)
        ? current.scale
        : fallback.scale,
  };
}

function makeFieldPath(
  mode: BannerMode,
  viewport: BannerViewport,
  field: keyof BannerCropValue,
) {
  return `site.theme.fuwari.banner.${mode}.${viewport}.${field}` as FieldPath<SystemConfig>;
}

function SegmentButton({
  isActive,
  icon: Icon,
  label,
  onClick,
}: {
  isActive: boolean;
  icon: ComponentType<{ size?: number; className?: string }>;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={isActive}
      onClick={onClick}
      className={cn(
        "inline-flex h-9 items-center justify-center gap-2 border border-border/40 px-3 text-xs font-medium transition-colors",
        isActive
          ? "bg-foreground text-background"
          : "bg-background/70 text-muted-foreground hover:bg-muted/50 hover:text-foreground",
      )}
    >
      <Icon size={14} className="shrink-0" />
      <span>{label}</span>
    </button>
  );
}

function CropRange({
  label,
  value,
  min,
  max,
  step,
  displayValue,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  displayValue: string;
  onChange: (value: number) => void;
}) {
  return (
    <label className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-medium text-foreground">{label}</span>
        <span className="min-w-16 border border-border/40 bg-muted/20 px-2 py-1 text-right text-[11px] font-mono text-foreground">
          {displayValue}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-muted/50 accent-foreground"
      />
    </label>
  );
}

export function FuwariBannerCropEditor() {
  const { control, setValue } = useFormContext<SystemConfig>();
  const [activeMode, setActiveMode] = useState<BannerMode>("home");
  const [activeViewport, setActiveViewport] =
    useState<BannerViewport>("desktop");
  const previewRef = useRef<HTMLDivElement>(null);

  const homeBg = useWatch({
    control,
    name: "site.theme.fuwari.homeBg",
  });
  const banner = useWatch({
    control,
    name: "site.theme.fuwari.banner",
  });

  const previewUrl = getPreviewUrl(homeBg);
  const crop = getCropValue(banner, activeMode, activeViewport);
  const previewAspectRatio =
    activeViewport === "desktop" ? "16 / 6" : "9 / 13";

  const updateCrop = (next: Partial<BannerCropValue>) => {
    const merged = {
      ...crop,
      ...next,
    };

    setValue(
      makeFieldPath(activeMode, activeViewport, "x"),
      roundPercent(
        clamp(
          merged.x,
          FUWARI_BANNER_POSITION_MIN,
          FUWARI_BANNER_POSITION_MAX,
        ),
      ),
      { shouldDirty: true, shouldValidate: true },
    );
    setValue(
      makeFieldPath(activeMode, activeViewport, "y"),
      roundPercent(
        clamp(
          merged.y,
          FUWARI_BANNER_POSITION_MIN,
          FUWARI_BANNER_POSITION_MAX,
        ),
      ),
      { shouldDirty: true, shouldValidate: true },
    );
    setValue(
      makeFieldPath(activeMode, activeViewport, "scale"),
      roundScale(
        clamp(merged.scale, FUWARI_BANNER_SCALE_MIN, FUWARI_BANNER_SCALE_MAX),
      ),
      { shouldDirty: true, shouldValidate: true },
    );
  };

  const updatePositionFromPointer = (event: PointerEvent<HTMLDivElement>) => {
    const rect = previewRef.current?.getBoundingClientRect();
    if (!rect) return;

    updateCrop({
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
    });
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    updatePositionFromPointer(event);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
    updatePositionFromPointer(event);
  };

  const resetActiveCrop = () => {
    updateCrop(DEFAULT_FUWARI_BANNER_CROP[activeMode][activeViewport]);
  };

  const previewImageStyle = {
    objectPosition: `${crop.x}% ${crop.y}%`,
    transform: `scale(${crop.scale})`,
    transformOrigin: `${crop.x}% ${crop.y}%`,
  } satisfies CSSProperties;

  const focusPointStyle = {
    left: `${crop.x}%`,
    top: `${crop.y}%`,
  } satisfies CSSProperties;

  return (
    <div className="md:col-span-2 space-y-5 rounded-2xl border border-border/40 bg-background/70 p-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground">
            {m.settings_site_banner_crop_title()}
          </p>
          <p className="max-w-2xl text-xs leading-5 text-muted-foreground">
            {m.settings_site_banner_crop_desc()}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {modeOptions.map(({ value, icon, label }) => (
            <SegmentButton
              key={value}
              isActive={activeMode === value}
              icon={icon}
              label={label()}
              onClick={() => setActiveMode(value)}
            />
          ))}
          {viewportOptions.map(({ value, icon, label }) => (
            <SegmentButton
              key={value}
              isActive={activeViewport === value}
              icon={icon}
              label={label()}
              onClick={() => setActiveViewport(value)}
            />
          ))}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="space-y-3">
          <div
            ref={previewRef}
            className="relative w-full touch-none overflow-hidden border border-border/40 bg-muted/30 shadow-sm"
            style={{ aspectRatio: previewAspectRatio }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
          >
            {previewUrl ? (
              <img
                src={previewUrl}
                alt=""
                className="h-full w-full select-none object-cover"
                draggable={false}
                style={previewImageStyle}
              />
            ) : (
              <div className="flex h-full items-center justify-center px-6 text-center text-xs text-muted-foreground">
                {m.settings_site_banner_crop_no_image()}
              </div>
            )}

            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.28)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.28)_1px,transparent_1px)] bg-[size:33.333%_33.333%]" />
            <div
              className="pointer-events-none absolute h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-foreground shadow-[0_0_0_2px_rgba(0,0,0,0.35)]"
              style={focusPointStyle}
            />
          </div>
          <p className="text-[11px] leading-5 text-muted-foreground">
            {m.settings_site_banner_crop_drag_hint()}
          </p>
        </div>

        <div className="space-y-4 border border-border/30 bg-muted/10 p-4">
          <CropRange
            label={m.settings_site_banner_crop_x()}
            value={crop.x}
            min={FUWARI_BANNER_POSITION_MIN}
            max={FUWARI_BANNER_POSITION_MAX}
            step={0.1}
            displayValue={`${crop.x.toFixed(1)}%`}
            onChange={(x) => updateCrop({ x })}
          />
          <CropRange
            label={m.settings_site_banner_crop_y()}
            value={crop.y}
            min={FUWARI_BANNER_POSITION_MIN}
            max={FUWARI_BANNER_POSITION_MAX}
            step={0.1}
            displayValue={`${crop.y.toFixed(1)}%`}
            onChange={(y) => updateCrop({ y })}
          />
          <CropRange
            label={m.settings_site_banner_crop_scale()}
            value={crop.scale}
            min={FUWARI_BANNER_SCALE_MIN}
            max={FUWARI_BANNER_SCALE_MAX}
            step={0.01}
            displayValue={`${Math.round(crop.scale * 100)}%`}
            onChange={(scale) => updateCrop({ scale })}
          />

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full gap-2 rounded-none"
            onClick={resetActiveCrop}
          >
            <RotateCcw size={14} />
            {m.settings_site_banner_crop_reset()}
          </Button>
        </div>
      </div>
    </div>
  );
}
