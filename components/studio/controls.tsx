"use client";

import type { RefObject } from "react";
import { useState } from "react";
import { BACKGROUND_PRESETS, FONT_OPTIONS } from "./config";
import type { DevicePreset, SlideData, SlideTheme } from "./types";

type TabId = "slides" | "content" | "style";

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: "slides", label: "Slides", icon: "⊞" },
  { id: "content", label: "Content", icon: "✎" },
  { id: "style", label: "Style", icon: "◑" },
];

interface StudioSidebarProps {
  device: DevicePreset;
  deviceIndex: number;
  devices: DevicePreset[];
  exporting: boolean;
  slides: SlideData[];
  activeSlide: number;
  currentSlide: SlideData | undefined;
  theme: SlideTheme;
  maxSlides: number;
  onDeviceChange: (index: number) => void;
  onSelectSlide: (index: number) => void;
  onAddSlide: () => void;
  onRemoveSlide: (index: number) => void;
  uploadInputRef: RefObject<HTMLInputElement | null>;
  onUploadSlide: (file: File) => void;
  onHeadlineChange: (value: string) => void;
  onSlideChange: (updates: Partial<SlideData>) => void;
  onThemeChange: (updates: Partial<SlideTheme>) => void;
  onResetZoom: () => void;
  onResetPhone: () => void;
  onResetSlide: () => void;
  onExportCurrent: () => void;
  onExportAll: () => void;
}

export function StudioSidebar({
  device,
  deviceIndex,
  devices,
  exporting,
  slides,
  activeSlide,
  currentSlide,
  theme,
  maxSlides,
  onDeviceChange,
  onSelectSlide,
  onAddSlide,
  onRemoveSlide,
  uploadInputRef,
  onUploadSlide,
  onHeadlineChange,
  onSlideChange,
  onThemeChange,
  onResetZoom,
  onResetPhone,
  onResetSlide,
  onExportCurrent,
  onExportAll,
}: StudioSidebarProps) {
  const [activeTab, setActiveTab] = useState<TabId>("slides");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [resetSlideModalOpen, setResetSlideModalOpen] = useState(false);

  const tabContent = (
    <div className="space-y-6">
      {activeTab === "slides" ? (
        <>
          <Section title="Output Device">
            <select
              value={deviceIndex}
              onChange={(event) => onDeviceChange(Number(event.target.value))}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white"
            >
              {devices.map((preset, index) => (
                <option key={preset.label} value={index}>
                  {preset.label} — {preset.width}×{preset.height}
                </option>
              ))}
            </select>
          </Section>

          <Section title="Slides">
            <div className="flex flex-wrap gap-2">
              {slides.map((slide, index) => (
                <button
                  key={slide.id}
                  onClick={() => onSelectSlide(index)}
                  className={`relative px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    index === activeSlide
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  {index + 1}
                  {slides.length > 1 ? (
                    <span
                      onClick={(event) => {
                        event.stopPropagation();
                        onRemoveSlide(index);
                      }}
                      className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      ×
                    </span>
                  ) : null}
                </button>
              ))}
              <button
                onClick={onAddSlide}
                disabled={slides.length >= maxSlides}
                className="px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white disabled:cursor-not-allowed disabled:bg-gray-900 disabled:text-gray-600 transition-colors"
              >
                +
              </button>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              {slides.length}/{maxSlides} slides
            </p>
          </Section>

          <div className="space-y-2">
            <button
              onClick={onExportCurrent}
              disabled={exporting}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-sm font-semibold px-5 py-3 rounded-lg transition-colors"
            >
              {exporting ? "Exporting…" : `Export Slide ${activeSlide + 1}`}
            </button>
            <button
              onClick={onExportAll}
              disabled={exporting}
              className="hidden lg:block w-full bg-gray-800 hover:bg-gray-700 border border-gray-700 disabled:bg-gray-900 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
            >
              {exporting ? "Exporting…" : "Export All Slides"}
            </button>
          </div>

          <button
            type="button"
            onClick={() => setResetSlideModalOpen(true)}
            className="w-full border border-red-800/50 bg-red-950/30 hover:bg-red-950/50 text-red-300 text-sm font-medium px-5 py-3 rounded-lg transition-colors"
          >
            Reset Slide {activeSlide + 1}
          </button>

          <p className="text-xs text-gray-500 text-center">
            Output: {device.width}×{device.height}px PNG — rendered locally
          </p>
        </>
      ) : null}

      {activeTab === "content" ? (
        <>
          <Section title="Screenshot">
            <button
              type="button"
              onClick={() => uploadInputRef.current?.click()}
              className="block w-full cursor-pointer text-left"
            >
              <div className="border-2 border-dashed border-gray-700 rounded-lg p-4 text-center hover:border-gray-500 transition-colors">
                <p className="text-sm text-gray-400">
                  {currentSlide?.screenshot
                    ? "Click to replace"
                    : "Click to upload"}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Recommended: {device.width}×{device.height}px
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Best with modern iPhone portrait screenshots
                </p>
              </div>
            </button>
            <div className="space-y-3 mt-3">
              <SliderControl
                label="Zoom"
                value={currentSlide?.screenshotScale ?? 100}
                min={60}
                max={160}
                onChange={(value) => onSlideChange({ screenshotScale: value })}
              />
              <p className="text-xs text-gray-500">
                Drag the screenshot in the preview to reposition it.
              </p>
              <button
                type="button"
                onClick={onResetZoom}
                className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-xs font-medium text-gray-300 transition-colors hover:bg-gray-800 hover:text-white"
              >
                Reset Zoom
              </button>
            </div>
          </Section>

          <Section title="Header">
            <textarea
              value={currentSlide?.headline ?? ""}
              onChange={(event) => onHeadlineChange(event.target.value)}
              rows={2}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white resize-none"
              placeholder="Your headline here"
            />
          </Section>

          <Section title="Sub-header (optional)">
            <input
              type="text"
              value={theme.labelText}
              onChange={(event) =>
                onThemeChange({ labelText: event.target.value })
              }
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white"
              placeholder="e.g. NEW FEATURE"
            />
          </Section>
        </>
      ) : null}

      {activeTab === "style" ? (
        <>
          <Section title="Background">
            <div className="flex items-center gap-2 mb-3">
              <input
                type="checkbox"
                id="gradient"
                checked={theme.useGradient}
                onChange={(event) =>
                  onThemeChange({ useGradient: event.target.checked })
                }
                className="rounded"
              />
              <label htmlFor="gradient" className="text-sm text-gray-300">
                Use gradient
              </label>
            </div>
            <div className="flex gap-3">
              <ColorPicker
                label={theme.useGradient ? "Start" : "Color"}
                value={theme.backgroundStart}
                onChange={(value) =>
                  onThemeChange({ backgroundStart: value })
                }
              />
              {theme.useGradient ? (
                <ColorPicker
                  label="End"
                  value={theme.backgroundEnd}
                  onChange={(value) =>
                    onThemeChange({ backgroundEnd: value })
                  }
                />
              ) : null}
            </div>
            <div className="mt-3">
              <p className="text-xs text-gray-500 mb-2">Presets</p>
              <div className="flex flex-wrap gap-2">
                {BACKGROUND_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() =>
                      onThemeChange({
                        backgroundStart: preset.start,
                        backgroundEnd: preset.end,
                        useGradient: true,
                      })
                    }
                    className="group flex items-center gap-1.5 px-2 py-1 rounded bg-gray-800 hover:bg-gray-700 transition-colors"
                  >
                    <div
                      className="w-4 h-4 rounded-full border border-gray-600"
                      style={{
                        background: `linear-gradient(135deg, ${preset.start}, ${preset.end})`,
                      }}
                    />
                    <span className="text-xs text-gray-400 group-hover:text-gray-200">
                      {preset.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </Section>

          <Section title="Header">
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">
                  Font Family
                </label>
                <select
                  value={theme.fontFamily}
                  onChange={(event) =>
                    onThemeChange({ fontFamily: event.target.value })
                  }
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white"
                >
                  {FONT_OPTIONS.map((font) => (
                    <option key={font} value={font}>
                      {font}
                    </option>
                  ))}
                </select>
              </div>
              <ColorPicker
                label="Font Color"
                value={theme.fontColor}
                onChange={(value) => onThemeChange({ fontColor: value })}
              />
              <SliderControl
                label="Font Size"
                value={theme.fontSize}
                min={40}
                max={140}
                onChange={(value) => onThemeChange({ fontSize: value })}
              />
            </div>
          </Section>

          <Section title="Sub-header">
            <div className="flex gap-3">
              <ColorPicker
                label="Color"
                value={theme.labelColor}
                onChange={(value) => onThemeChange({ labelColor: value })}
              />
              <SliderControl
                label="Size"
                value={theme.labelSize}
                min={20}
                max={80}
                onChange={(value) => onThemeChange({ labelSize: value })}
              />
            </div>
          </Section>

          <Section title="Phone">
            <div className="space-y-3">
              <SliderControl
                label="Size"
                value={theme.phoneSize}
                min={50}
                max={95}
                onChange={(value) => onThemeChange({ phoneSize: value })}
              />
              <SliderControl
                label="Placement"
                value={theme.phoneOffsetY}
                min={-10}
                max={25}
                onChange={(value) => onThemeChange({ phoneOffsetY: value })}
              />
              <button
                type="button"
                onClick={onResetPhone}
                className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-xs font-medium text-gray-300 transition-colors hover:bg-gray-800 hover:text-white"
              >
                Reset Phone
              </button>
            </div>
          </Section>
        </>
      ) : null}
    </div>
  );

  const tabBar = (
    <div className="flex">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => {
            if (activeTab === tab.id && mobileOpen) {
              setMobileOpen(false);
            } else {
              setActiveTab(tab.id);
              setMobileOpen(true);
            }
          }}
          className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-medium transition-colors lg:rounded-lg lg:py-2 ${
            activeTab === tab.id && mobileOpen
              ? "text-indigo-400 bg-gray-800/60 lg:bg-gray-800"
              : "text-gray-500 hover:text-gray-300"
          }`}
        >
          <span className="text-sm">{tab.icon}</span>
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  );

  const desktopTabBar = (
    <div className="flex gap-1 mb-4">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium rounded-lg transition-colors ${
            activeTab === tab.id
              ? "text-indigo-400 bg-gray-800"
              : "text-gray-500 hover:text-gray-300"
          }`}
        >
          <span className="text-sm">{tab.icon}</span>
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  );

  return (
    <>
      {/* Always-mounted file input so the ref works from any tab */}
      <input
        ref={uploadInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) onUploadSlide(file);
          event.target.value = "";
        }}
      />

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-80 border-r border-gray-800 flex-shrink-0 min-h-0">
        <div className="p-4 border-b border-gray-800">
          {desktopTabBar}
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {tabContent}
        </div>
      </aside>

      {/* Mobile bottom sheet */}
      <div className="lg:hidden fixed inset-x-0 bottom-0 z-40 flex flex-col pointer-events-none">
        {/* Backdrop */}
        {mobileOpen ? (
          <div
            className="fixed inset-0 bg-black/40 pointer-events-auto"
            onClick={() => setMobileOpen(false)}
          />
        ) : null}

        {/* Sheet */}
        <div
          className={`relative pointer-events-auto bg-gray-950 border-t border-gray-800 transition-transform duration-300 ease-out ${
            mobileOpen ? "translate-y-0" : "translate-y-full"
          }`}
          style={{ maxHeight: "65vh" }}
        >
          {/* Drag indicator */}
          <div className="flex justify-center py-2">
            <div className="w-10 h-1 rounded-full bg-gray-700" />
          </div>
          <div className="overflow-y-auto px-4 pb-4" style={{ maxHeight: "calc(65vh - 44px)" }}>
            {tabContent}
          </div>
        </div>

        {/* Tab bar (always visible) */}
        <div className="relative pointer-events-auto bg-gray-950 border-t border-gray-800 safe-bottom">
          {tabBar}
        </div>
      </div>

      {/* Reset slide confirmation modal */}
      {resetSlideModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6">
          <div className="w-full max-w-md rounded-2xl border border-gray-800 bg-gray-950 p-6 shadow-2xl">
            <h2 className="text-lg font-semibold text-white">
              Reset Slide {activeSlide + 1}?
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              This will clear the screenshot, headline, and framing for this
              slide. Your other slides and theme settings won&apos;t be affected.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setResetSlideModalOpen(false)}
                className="flex-1 rounded-lg border border-gray-700 px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-900 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setResetSlideModalOpen(false);
                  onResetSlide();
                }}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700"
              >
                Reset Slide
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
        {title}
      </h3>
      {children}
    </div>
  );
}

function ColorPicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-8 h-8 rounded-lg cursor-pointer"
      />
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-20 bg-transparent text-xs text-gray-300 border-b border-gray-700 focus:border-gray-400 outline-none"
        />
      </div>
    </div>
  );
}

function SliderControl({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  const safeValue = Number.isFinite(value) ? value : min;

  return (
    <div className="flex-1">
      <div className="flex justify-between mb-1">
        <span className="text-xs text-gray-500">{label}</span>
        <span className="text-xs text-gray-400">{safeValue}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={safeValue}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full"
      />
    </div>
  );
}
