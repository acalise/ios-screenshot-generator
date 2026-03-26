"use client";

import { useRef, useState } from "react";

const SCREEN_WIDTH = 1206;
const SCREEN_HEIGHT = 2622;
const BEZEL_X = 0.035;
const BEZEL_TOP = 0.018;
const BEZEL_BOTTOM = 0.018;
const FRAME_WIDTH = SCREEN_WIDTH / (1 - BEZEL_X * 2);
const FRAME_HEIGHT = SCREEN_HEIGHT / (1 - BEZEL_TOP - BEZEL_BOTTOM);

interface PhoneFrameProps {
  src: string | null;
  screenshotScale?: number;
  screenshotOffsetX?: number;
  screenshotOffsetY?: number;
  onRequestUpload?: () => void;
  onScreenshotPositionChange?: (offsetX: number, offsetY: number) => void;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function PhoneFrame({
  src,
  screenshotScale = 100,
  screenshotOffsetX = 0,
  screenshotOffsetY = 0,
  onRequestUpload,
  onScreenshotPositionChange,
}: PhoneFrameProps) {
  const screenRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{
    pointerX: number;
    pointerY: number;
    offsetX: number;
    offsetY: number;
  } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div
      style={{
        width: "100%",
        aspectRatio: `${FRAME_WIDTH}/${FRAME_HEIGHT}`,
        position: "relative",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "12.5% / 5.5%",
          background: "linear-gradient(180deg, #2C2C2E 0%, #1C1C1E 100%)",
          position: "relative",
          overflow: "hidden",
          boxShadow:
            "inset 0 0 0 1px rgba(255,255,255,0.12), 0 12px 60px rgba(0,0,0,0.5)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "3.2%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "26%",
            height: "2.6%",
            borderRadius: "100px",
            background: "#000",
            zIndex: 20,
          }}
        />
        <div
          ref={screenRef}
          style={{
            position: "absolute",
            left: `${BEZEL_X * 100}%`,
            top: `${BEZEL_TOP * 100}%`,
            width: `${(1 - BEZEL_X * 2) * 100}%`,
            height: `${(1 - BEZEL_TOP - BEZEL_BOTTOM) * 100}%`,
            borderRadius: "8.5% / 3.8%",
            overflow: "hidden",
            background: "#000",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor:
              src && onScreenshotPositionChange
                ? isDragging
                  ? "grabbing"
                  : "grab"
                : "default",
            touchAction: "none",
          }}
          onPointerDown={(event) => {
            if (!src || !onScreenshotPositionChange) return;

            dragStartRef.current = {
              pointerX: event.clientX,
              pointerY: event.clientY,
              offsetX: screenshotOffsetX,
              offsetY: screenshotOffsetY,
            };
            setIsDragging(true);
            event.currentTarget.setPointerCapture(event.pointerId);
          }}
          onPointerMove={(event) => {
            if (!src || !onScreenshotPositionChange || !dragStartRef.current) {
              return;
            }

            const rect = screenRef.current?.getBoundingClientRect();
            if (!rect?.width || !rect.height) return;

            const deltaX = ((event.clientX - dragStartRef.current.pointerX) / rect.width) * 100;
            const deltaY =
              ((event.clientY - dragStartRef.current.pointerY) / rect.height) * 100;

            onScreenshotPositionChange(
              clamp(dragStartRef.current.offsetX + deltaX, -40, 40),
              clamp(dragStartRef.current.offsetY + deltaY, -40, 40)
            );
          }}
          onPointerUp={(event) => {
            dragStartRef.current = null;
            setIsDragging(false);
            if (event.currentTarget.hasPointerCapture(event.pointerId)) {
              event.currentTarget.releasePointerCapture(event.pointerId);
            }
          }}
          onPointerCancel={(event) => {
            dragStartRef.current = null;
            setIsDragging(false);
            if (event.currentTarget.hasPointerCapture(event.pointerId)) {
              event.currentTarget.releasePointerCapture(event.pointerId);
            }
          }}
        >
          {src ? (
            <img
              src={src}
              alt="Screenshot"
              style={{
                display: "block",
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
                transform: `translate(${screenshotOffsetX}%, ${screenshotOffsetY}%) scale(${screenshotScale / 100})`,
                transformOrigin: "center top",
                pointerEvents: "none",
                userSelect: "none",
                WebkitUserSelect: "none",
              }}
              draggable={false}
            />
          ) : (
            <button
              type="button"
              onClick={onRequestUpload}
              style={{
                color: "rgba(255,255,255,0.72)",
                fontSize: 56,
                fontWeight: 600,
                textAlign: "center",
                padding: "40px 28px",
                lineHeight: 1.2,
                border: "1px dashed rgba(255,255,255,0.24)",
                borderRadius: 28,
                background: "rgba(255,255,255,0.04)",
                cursor: onRequestUpload ? "pointer" : "default",
                maxWidth: "72%",
              }}
            >
              Upload screenshot
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
