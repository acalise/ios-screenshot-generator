export interface DevicePreset {
  label: string;
  width: number;
  height: number;
}

export interface SlideData {
  id: string;
  headline: string;
  screenshot: string | null;
  screenshotScale: number;
  screenshotOffsetX: number;
  screenshotOffsetY: number;
}

export interface BackgroundPreset {
  name: string;
  start: string;
  end: string;
}

export interface SlideTheme {
  backgroundStart: string;
  backgroundEnd: string;
  useGradient: boolean;
  fontFamily: string;
  fontSize: number;
  fontColor: string;
  labelText: string;
  labelColor: string;
  labelSize: number;
  phoneSize: number;
  phoneOffsetY: number;
}
