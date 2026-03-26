"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toPng } from "html-to-image";
import { StudioSidebar } from "@/components/studio/controls";
import { DEFAULT_THEME, DEVICE_PRESETS } from "@/components/studio/config";
import { LivePreview } from "@/components/studio/live-preview";
import { SlideCanvas } from "@/components/studio/slide-canvas";
import type { SlideData, SlideTheme } from "@/components/studio/types";

const MAX_SLIDES = 10;
const STORAGE_KEY = "screenshot-studio:v1";

function createSlide(): SlideData {
  return {
    id: crypto.randomUUID(),
    headline: "Your headline here",
    screenshot: null,
    screenshotScale: 100,
    screenshotOffsetX: 0,
    screenshotOffsetY: 0,
  };
}

function downloadImage(dataUrl: string, fileName: string) {
  const anchor = document.createElement("a");
  anchor.href = dataUrl;
  anchor.download = fileName;
  anchor.click();
}

async function waitForNextPaint() {
  await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
  await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
}

function isSlideEmpty(slide: SlideData) {
  return !slide.screenshot;
}

function normalizeSlide(slide: Partial<SlideData> | null | undefined): SlideData {
  return {
    ...createSlide(),
    ...slide,
    id: slide?.id ?? crypto.randomUUID(),
    headline: slide?.headline ?? "Your headline here",
    screenshot: slide?.screenshot ?? null,
    screenshotScale: slide?.screenshotScale ?? 100,
    screenshotOffsetX: slide?.screenshotOffsetX ?? 0,
    screenshotOffsetY: slide?.screenshotOffsetY ?? 0,
  };
}

function normalizeTheme(theme: Partial<SlideTheme> | null | undefined): SlideTheme {
  return {
    ...DEFAULT_THEME,
    ...theme,
  };
}

interface PersistedState {
  activeSlide: number;
  deviceIndex: number;
  slides: SlideData[];
  theme: SlideTheme;
}

function createInitialProject() {
  return {
    activeSlide: 0,
    deviceIndex: 0,
    slides: [createSlide()],
    theme: DEFAULT_THEME,
  };
}

export default function ScreenshotCreator() {
  const [deviceIndex, setDeviceIndex] = useState(() => createInitialProject().deviceIndex);
  const [slides, setSlides] = useState<SlideData[]>(() => createInitialProject().slides);
  const [activeSlide, setActiveSlide] = useState(() => createInitialProject().activeSlide);
  const [theme, setTheme] = useState<SlideTheme>(() => createInitialProject().theme);
  const [exporting, setExporting] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [emptySlidesModalOpen, setEmptySlidesModalOpen] = useState(false);
  const [resetProjectModalOpen, setResetProjectModalOpen] = useState(false);
  const [emptySlideIndexes, setEmptySlideIndexes] = useState<number[]>([]);
  const [fontsLoaded, setFontsLoaded] = useState<Set<string>>(new Set(["Inter"]));
  const [renderedSlideIndex, setRenderedSlideIndex] = useState(0);
  const exportCanvasRef = useRef<HTMLDivElement>(null);
  const uploadInputRef = useRef<HTMLInputElement>(null);

  const device = DEVICE_PRESETS[deviceIndex];
  const currentSlide = slides[activeSlide];
  const renderedSlide = slides[renderedSlideIndex];

  useEffect(() => {
    try {
      const rawState = window.localStorage.getItem(STORAGE_KEY);
      if (!rawState) {
        setIsHydrated(true);
        return;
      }

      const parsed = JSON.parse(rawState) as Partial<PersistedState>;
      const nextSlides = Array.isArray(parsed.slides)
        ? parsed.slides.slice(0, MAX_SLIDES).map(normalizeSlide)
        : createInitialProject().slides;

      setSlides(nextSlides.length > 0 ? nextSlides : [createSlide()]);
      setTheme(normalizeTheme(parsed.theme));
      setDeviceIndex(
        typeof parsed.deviceIndex === "number" &&
          parsed.deviceIndex >= 0 &&
          parsed.deviceIndex < DEVICE_PRESETS.length
          ? parsed.deviceIndex
          : 0
      );
      setActiveSlide(
        typeof parsed.activeSlide === "number"
          ? Math.max(0, Math.min(parsed.activeSlide, nextSlides.length - 1))
          : 0
      );
    } catch (error) {
      console.warn("Unable to restore screenshot project", error);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (fontsLoaded.has(theme.fontFamily)) return;

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?family=${theme.fontFamily.replace(/ /g, "+")}:wght@400;600;700;800&display=swap`;
    document.head.appendChild(link);

    setFontsLoaded((previous) => new Set(previous).add(theme.fontFamily));
  }, [theme.fontFamily, fontsLoaded]);

  useEffect(() => {
    setRenderedSlideIndex(activeSlide);
  }, [activeSlide]);

  useEffect(() => {
    if (!isHydrated) return;

    const persistedState: PersistedState = {
      activeSlide,
      deviceIndex,
      slides,
      theme,
    };

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(persistedState));
    } catch (error) {
      console.warn("Unable to persist screenshot project", error);
    }
  }, [activeSlide, deviceIndex, isHydrated, slides, theme]);

  const updateSlide = useCallback((index: number, updates: Partial<SlideData>) => {
    setSlides((previous) =>
      previous.map((slide, slideIndex) =>
        slideIndex === index ? { ...slide, ...updates } : slide
      )
    );
  }, []);

  const handleUpload = useCallback(
    (index: number, file: File) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        updateSlide(index, { screenshot: event.target?.result as string });
      };
      reader.readAsDataURL(file);
    },
    [updateSlide]
  );

  const addSlide = useCallback(() => {
    setSlides((previous) => {
      if (previous.length >= MAX_SLIDES) return previous;

      const nextSlides = [...previous, createSlide()];
      setActiveSlide(nextSlides.length - 1);
      return nextSlides;
    });
  }, []);

  const openUploadPicker = useCallback(() => {
    uploadInputRef.current?.click();
  }, []);

  const removeSlide = useCallback((index: number) => {
    setSlides((previous) => {
      if (previous.length <= 1) return previous;

      const nextSlides = previous.filter((_, slideIndex) => slideIndex !== index);
      setActiveSlide((currentIndex) => {
        if (currentIndex > index) return currentIndex - 1;
        return Math.min(currentIndex, nextSlides.length - 1);
      });

      return nextSlides;
    });
  }, []);

  const updateTheme = useCallback((updates: Partial<SlideTheme>) => {
    setTheme((previous) => ({ ...previous, ...updates }));
  }, []);

  const resetFraming = useCallback(() => {
    updateSlide(activeSlide, {
      screenshotScale: 100,
      screenshotOffsetX: 0,
      screenshotOffsetY: 0,
    });
    updateTheme({
      phoneSize: DEFAULT_THEME.phoneSize,
      phoneOffsetY: DEFAULT_THEME.phoneOffsetY,
    });
  }, [activeSlide, updateSlide, updateTheme]);

  const resetProject = useCallback(() => {
    const nextProject = createInitialProject();
    setDeviceIndex(nextProject.deviceIndex);
    setSlides(nextProject.slides);
    setActiveSlide(nextProject.activeSlide);
    setTheme(nextProject.theme);
    setRenderedSlideIndex(0);
    setEmptySlideIndexes([]);
    setEmptySlidesModalOpen(false);

    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.warn("Unable to clear saved screenshot project", error);
    }
  }, []);

  const captureSlide = useCallback(
    async (index: number) => {
      const target = exportCanvasRef.current;
      if (!target) return;

      setRenderedSlideIndex(index);
      await waitForNextPaint();
      await document.fonts.ready;

      const options = {
        width: device.width,
        height: device.height,
        pixelRatio: 1,
        cacheBust: true,
        skipFonts: true,
      };
      const dataUrl = await toPng(target, options);

      downloadImage(
        dataUrl,
        `screenshot-${index + 1}-${device.width}x${device.height}.png`
      );
    },
    [device.height, device.width]
  );

  const exportSlide = useCallback(
    async (index: number) => {
      try {
        setExporting(true);
        setActiveSlide(index);
        await captureSlide(index);
      } finally {
        setExporting(false);
      }
    },
    [captureSlide]
  );

  const exportAll = useCallback(async () => {
    const nextEmptySlideIndexes = slides
      .map((slide, index) => (isSlideEmpty(slide) ? index : -1))
      .filter((index) => index >= 0);

    if (nextEmptySlideIndexes.length > 0) {
      setEmptySlideIndexes(nextEmptySlideIndexes);
      setEmptySlidesModalOpen(true);
      return;
    }

    try {
      setExporting(true);
      for (let index = 0; index < slides.length; index += 1) {
        await captureSlide(index);
      }
      setActiveSlide((currentIndex) => Math.min(currentIndex, slides.length - 1));
    } finally {
      setExporting(false);
    }
  }, [captureSlide, slides]);

  const exportSlideSet = useCallback(
    async (indexes: number[]) => {
      if (indexes.length === 0) return;

      try {
        setExporting(true);
        for (const index of indexes) {
          await captureSlide(index);
        }
        setActiveSlide((currentIndex) =>
          indexes.includes(currentIndex) ? currentIndex : indexes[0]
        );
      } finally {
        setExporting(false);
      }
    },
    [captureSlide]
  );

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <header className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-[1600px] mx-auto">
          <h1 className="text-xl font-bold">Screenshot Studio</h1>
          <p className="text-sm text-gray-400">
            Open source app store screenshot generator with browser-only exports
          </p>
        </div>
      </header>

      <div className="flex-1 flex max-w-[1600px] mx-auto w-full min-h-0 overflow-hidden">
        <StudioSidebar
          device={device}
          deviceIndex={deviceIndex}
          devices={DEVICE_PRESETS}
          exporting={exporting}
          slides={slides}
          activeSlide={activeSlide}
          currentSlide={currentSlide}
          theme={theme}
          maxSlides={MAX_SLIDES}
          onDeviceChange={setDeviceIndex}
          onSelectSlide={setActiveSlide}
          onAddSlide={addSlide}
          onRemoveSlide={removeSlide}
          uploadInputRef={uploadInputRef}
          onUploadSlide={(file) => handleUpload(activeSlide, file)}
          onHeadlineChange={(headline) => updateSlide(activeSlide, { headline })}
          onThemeChange={updateTheme}
          onSlideChange={(updates) => updateSlide(activeSlide, updates)}
          onResetFraming={resetFraming}
          onExportCurrent={() => exportSlide(activeSlide)}
          onExportAll={exportAll}
        />

        <main className="flex-1 flex items-center justify-center p-6 bg-gray-900/50 min-h-0 min-w-0">
          {currentSlide ? (
            <LivePreview
              key={`${device.width}-${device.height}`}
              device={device}
              theme={theme}
              slide={currentSlide}
              onRequestUpload={openUploadPicker}
              onScreenshotPositionChange={(offsetX, offsetY) =>
                updateSlide(activeSlide, {
                  screenshotOffsetX: offsetX,
                  screenshotOffsetY: offsetY,
                })
              }
            />
          ) : null}
        </main>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 opacity-0"
        style={{ width: 0, height: 0, overflow: "hidden" }}
      >
        <div
          ref={exportCanvasRef}
          style={{
            width: device.width,
            height: device.height,
            overflow: "hidden",
          }}
        >
          {renderedSlide ? (
            <SlideCanvas device={device} theme={theme} slide={renderedSlide} />
          ) : null}
        </div>
      </div>

      <footer className="border-t border-gray-800 px-6 py-3">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-4 text-xs text-gray-500">
          <span>
            Output: {device.width}x{device.height}px PNG - rendered locally in
            your browser
          </span>
          <div className="flex items-center gap-4">
            <span>100% free and open source</span>
            <button
              type="button"
              onClick={() => setResetProjectModalOpen(true)}
              className="rounded-md border border-red-950 bg-red-950/20 px-3 py-1.5 text-xs font-medium text-red-200 transition-colors hover:bg-red-950/40"
            >
              Start Fresh
            </button>
          </div>
        </div>
      </footer>

      {emptySlidesModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6">
          <div className="w-full max-w-md rounded-2xl border border-gray-800 bg-gray-950 p-6 shadow-2xl">
            <h2 className="text-lg font-semibold text-white">Empty Slides Found</h2>
            <p className="mt-2 text-sm text-gray-400">
              {emptySlideIndexes.length} slide
              {emptySlideIndexes.length === 1 ? "" : "s"} do not have a screenshot.
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Skip slides {emptySlideIndexes.map((index) => index + 1).join(", ")} or
              export everything anyway?
            </p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setEmptySlidesModalOpen(false)}
                className="flex-1 rounded-lg border border-gray-700 px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-900 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  setEmptySlidesModalOpen(false);
                  await exportSlideSet(
                    slides
                      .map((_, index) => index)
                      .filter((index) => !emptySlideIndexes.includes(index))
                  );
                }}
                className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
              >
                Skip Empty
              </button>
              <button
                type="button"
                onClick={async () => {
                  setEmptySlidesModalOpen(false);
                  await exportSlideSet(slides.map((_, index) => index));
                }}
                className="flex-1 rounded-lg bg-gray-800 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-gray-700"
              >
                Export All
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {resetProjectModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6">
          <div className="w-full max-w-md rounded-2xl border border-gray-800 bg-gray-950 p-6 shadow-2xl">
            <h2 className="text-lg font-semibold text-white">Start Fresh?</h2>
            <p className="mt-2 text-sm text-gray-400">
              This will reset all of your slides.
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Your current project, styling, and uploaded screenshots will be removed
              from this browser.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setResetProjectModalOpen(false)}
                className="flex-1 rounded-lg border border-gray-700 px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-900 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setResetProjectModalOpen(false);
                  resetProject();
                }}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700"
              >
                Reset Project
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
