"use client";

import { useEffect, useRef, useState } from "react";
import { SlideCanvas } from "./slide-canvas";
import type { DevicePreset, SlideData, SlideTheme } from "./types";

interface LivePreviewProps {
  device: DevicePreset;
  theme: SlideTheme;
  slide: SlideData;
  onRequestUpload?: () => void;
  onScreenshotPositionChange?: (offsetX: number, offsetY: number) => void;
}

export function LivePreview({
  device,
  theme,
  slide,
  onRequestUpload,
  onScreenshotPositionChange,
}: LivePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.2);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const observer = new ResizeObserver(([entry]) => {
      const nextScale = Math.min(
        entry.contentRect.width / device.width,
        entry.contentRect.height / device.height
      );
      setScale(nextScale);
    });

    observer.observe(element);

    return () => observer.disconnect();
  }, [device.height, device.width]);

  return (
    <div
      ref={containerRef}
      className="flex h-full w-full items-center justify-center overflow-hidden"
    >
      <div
        className="relative overflow-hidden rounded-2xl shadow-2xl"
        style={{
          width: device.width * scale,
          height: device.height * scale,
        }}
      >
        <div
          style={{
            width: device.width,
            height: device.height,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          <SlideCanvas
            device={device}
            theme={theme}
            slide={slide}
            onRequestUpload={onRequestUpload}
            onScreenshotPositionChange={onScreenshotPositionChange}
          />
        </div>
      </div>
    </div>
  );
}
