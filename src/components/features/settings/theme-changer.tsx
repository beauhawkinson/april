import { useState } from "react";
import { HexColorPicker } from "react-colorful";
import { match } from "ts-pattern";
import { useDebouncedCallback } from "use-debounce";

import { Button } from "@/components/ui/button";
import { Collapsible } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Item, ItemActions, ItemContent, ItemTitle } from "@/components/ui/item";
import { SliderControl } from "@/components/ui/slider";
import { capitalizeFirstLetter } from "@/lib/utils/format";
import { computeColorsFromTheme, hexToLch, lchToHex } from "@/lib/utils/theme";

import type { CustomTheme } from "@/server/functions/preferences/theme";

type ZoneId = "sidebar" | "content" | "accent";

interface Props {
  theme: CustomTheme;
  onChange: (next: CustomTheme) => void;
}

export default function ThemeChanger({ theme, onChange }: Props) {
  const [activeZone, setActiveZone] = useState<ZoneId | null>(null);
  const [inputValue, setInputValue] = useState("");

  const palette = computeColorsFromTheme(theme);
  const hasSidebarOverride = !!theme.sidebar?.base;

  const debouncedOnChange = useDebouncedCallback((next: CustomTheme) => {
    onChange(next);
  }, 50);

  const handleZoneClick = (zoneId: ZoneId) => {
    if (zoneId === activeZone) {
      setActiveZone(null);
      return;
    }
    setActiveZone(zoneId);

    const rawHex = match(zoneId)
      .with("sidebar", () => (theme.sidebar?.base ? lchToHex(theme.sidebar.base) : palette.sidebar))
      .with("content", () => (theme.base ? lchToHex(theme.base) : palette.content))
      .with("accent", () => (theme.accent ? lchToHex(theme.accent) : palette.primary))
      .otherwise(() => "");

    setInputValue(rawHex);
    if (!rawHex) return;
  };

  const handleColorChange = (hex: string) => {
    setInputValue(hex);
    const lch = hexToLch(hex);

    match(activeZone)
      .with("sidebar", () =>
        debouncedOnChange({
          ...theme,
          sidebar: { contrast: sidebarContrast, ...theme.sidebar, base: lch },
        }),
      )
      .with("content", () => debouncedOnChange({ ...theme, base: lch }))
      .with("accent", () => debouncedOnChange({ ...theme, accent: lch }))
      .otherwise(() => {});
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const val = e.target.value;
    setInputValue(val);
    if (/^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(val)) {
      handleColorChange(val.startsWith("#") ? val : `#${val}`);
    }
  };

  const handleClearSidebar = () => {
    const { sidebar: _, ...rest } = theme;
    onChange(rest);
    if (activeZone === "sidebar") setActiveZone(null);
  };

  const contrast = theme.contrast ?? 100;
  const sidebarContrast = theme.sidebar?.contrast ?? 50;

  const contrastConfig = match(activeZone)
    .with("content", () => ({
      value: contrast,
      onChange: (v: number) => debouncedOnChange({ ...theme, contrast: v }),
    }))
    .with("sidebar", () =>
      hasSidebarOverride && theme.sidebar
        ? {
            value: sidebarContrast,
            onChange: (v: number) =>
              debouncedOnChange({ ...theme, sidebar: { ...theme.sidebar!, contrast: v } }),
          }
        : null,
    )
    .otherwise(() => null);

  return (
    <div className="mx-auto w-full space-y-4 p-4 sm:max-w-lg sm:p-8">
      <div className="grid w-full grid-cols-[100px_1fr] gap-x-2 overflow-hidden">
        {/* Surface */}
        <button
          type="button"
          onClick={() => handleZoneClick("sidebar")}
          className="row-span-2 hidden h-60 cursor-crosshair! flex-col items-start justify-start rounded-xl border border-faded-foreground border-dashed bg-sidebar pt-2 text-sidebar-foreground outline-none transition-transform hover:bg-sidebar/80 hover:text-sidebar-foreground focus-visible:border focus-visible:border-primary active:scale-[0.99] sm:flex"
          style={{
            opacity: activeZone !== null && activeZone !== "sidebar" ? 0.3 : 1,
          }}
        >
          <span className="mx-auto flex cursor-crosshair select-none">Sidebar</span>

          {/* Mock nav items showing sidebar-accent contrast */}
          <div className="mt-4 flex w-full cursor-crosshair flex-col justify-start gap-1 px-1">
            <div className="h-4 cursor-crosshair rounded-md bg-sidebar-accent" />
            <div className="h-4 w-full cursor-crosshair rounded-md bg-sidebar-accent/60" />
            <div className="h-4 w-full cursor-crosshair rounded-md bg-sidebar-accent/60" />
          </div>
        </button>

        {/* Content */}
        <button
          type="button"
          onMouseDown={() => handleZoneClick("content")}
          className="z-10 col-span-2 flex h-60 cursor-crosshair! flex-col items-start justify-start rounded-xl border border-faded-foreground border-dashed bg-content px-8 text-foreground outline-none transition-transform hover:bg-content/80 focus-visible:border focus-visible:border-primary active:scale-[0.99] sm:col-span-1"
          style={{
            opacity: activeZone !== null && activeZone !== "content" ? 0.3 : 1,
          }}
        >
          <span className="mt-2 w-full cursor-crosshair select-none text-center">Content</span>
          <div className="border- mt-8 flex w-full flex-1 cursor-crosshair! items-center justify-center rounded-lg rounded-b-none border border-faded-foreground border-b-0 border-dashed bg-surface">
            Surface
          </div>
        </button>

        {/* Accent */}
        <button
          type="button"
          onClick={() => handleZoneClick("accent")}
          className="col-span-2 mx-auto mt-2 flex h-8 w-full cursor-crosshair! items-center justify-center rounded-lg border border-faded-foreground border-dashed bg-primary text-center text-primary-foreground opacity-30 outline-none transition-transform hover:bg-primary/80 focus-visible:border focus-visible:border-primary active:scale-[0.99]"
          style={{
            opacity: activeZone !== null && activeZone !== "accent" ? 0.3 : 1,
          }}
        >
          <span className="select-none">Accent</span>
        </button>
      </div>

      <Collapsible open={activeZone !== null}>
        <Item className="px-0">
          <ItemContent>
            <ItemTitle>{capitalizeFirstLetter(activeZone ?? "")}</ItemTitle>
          </ItemContent>

          <ItemActions>
            {hasSidebarOverride && activeZone === "sidebar" && (
              <Button variant="ghost" size="sm" onClick={handleClearSidebar}>
                Clear
              </Button>
            )}

            <Input value={inputValue} onChange={handleInputChange} placeholder="#000000" />
          </ItemActions>
        </Item>

        <div className="color-picker-custom cursor-crosshair! p-2">
          <HexColorPicker color={inputValue || "#000000"} onChange={handleColorChange} />
        </div>

        {contrastConfig && (
          <Item className="px-0">
            <ItemContent>
              <ItemTitle>
                {match(activeZone)
                  .with("content", () => "Surface Contrast")
                  .with("sidebar", () => "Sidebar Button Contrast")
                  .otherwise(() => "")}
              </ItemTitle>
            </ItemContent>
            <ItemActions className="flex-1">
              <SliderControl value={contrastConfig.value} onChange={contrastConfig.onChange} />
            </ItemActions>
          </Item>
        )}
      </Collapsible>
    </div>
  );
}
