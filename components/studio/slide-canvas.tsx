import { PhoneFrame } from "./phone-frame";
import type { DevicePreset, SlideData, SlideTheme } from "./types";

interface SlideCanvasProps {
  device: DevicePreset;
  theme: SlideTheme;
  slide: SlideData;
  onRequestUpload?: () => void;
  onScreenshotPositionChange?: (offsetX: number, offsetY: number) => void;
}

export function SlideCanvas({
  device,
  theme,
  slide,
  onRequestUpload,
  onScreenshotPositionChange,
}: SlideCanvasProps) {
  const background = theme.useGradient
    ? `linear-gradient(170deg, ${theme.backgroundStart} 0%, ${theme.backgroundEnd} 100%)`
    : theme.backgroundStart;

  return (
    <div
      style={{
        width: device.width,
        height: device.height,
        position: "relative",
        overflow: "hidden",
        background,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily: `'${theme.fontFamily}', system-ui, sans-serif`,
      }}
    >
      <div
        style={{
          marginTop: device.height * 0.09,
          textAlign: "center",
          padding: `0 ${device.width * 0.08}px`,
        }}
      >
        {theme.labelText ? (
          <div
            style={{
              fontSize: device.width * (theme.labelSize / 1000),
              fontWeight: 600,
              color: theme.labelColor,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              marginBottom: device.width * 0.04,
            }}
          >
            {theme.labelText}
          </div>
        ) : null}
        <div
          style={{
            fontSize: device.width * (theme.fontSize / 1000),
            fontWeight: 700,
            lineHeight: 1.05,
            color: theme.fontColor,
            letterSpacing: "-0.02em",
          }}
        >
          {slide.headline}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: `translateX(-50%) translateY(${theme.phoneOffsetY}%)`,
          width: `${theme.phoneSize}%`,
        }}
      >
        <PhoneFrame
          src={slide.screenshot}
          screenshotScale={slide.screenshotScale}
          screenshotOffsetX={slide.screenshotOffsetX}
          screenshotOffsetY={slide.screenshotOffsetY}
          onRequestUpload={onRequestUpload}
          onScreenshotPositionChange={onScreenshotPositionChange}
        />
      </div>
    </div>
  );
}
