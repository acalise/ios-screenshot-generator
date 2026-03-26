import type { BackgroundPreset, DevicePreset, SlideTheme } from "./types";

export const DEVICE_PRESETS: DevicePreset[] = [
  { label: '6.9" Display', width: 1320, height: 2868 },
  { label: '6.5" Display', width: 1242, height: 2688 },
];

export const FONT_OPTIONS = [
  "Inter",
  "Roboto",
  "Open Sans",
  "Lato",
  "Montserrat",
  "Poppins",
  "Raleway",
  "Nunito",
  "Playfair Display",
  "Oswald",
  "Source Sans 3",
  "PT Sans",
  "Merriweather",
  "Ubuntu",
  "Rubik",
];

export const BACKGROUND_PRESETS: BackgroundPreset[] = [
  { name: "Midnight", start: "#1a1a2e", end: "#16213e" },
  { name: "Purple", start: "#0f0c29", end: "#302b63" },
  { name: "Green", start: "#11998e", end: "#38ef7d" },
  { name: "Sunset", start: "#ee0979", end: "#ff6a00" },
  { name: "Ocean", start: "#2193b0", end: "#6dd5ed" },
  { name: "Light", start: "#f5f7fa", end: "#c3cfe2" },
  { name: "Dark", start: "#000000", end: "#1a1a1a" },
  { name: "White", start: "#ffffff", end: "#f0f0f0" },
];

export const DEFAULT_THEME: SlideTheme = {
  backgroundStart: "#1a1a2e",
  backgroundEnd: "#16213e",
  useGradient: true,
  fontFamily: "Inter",
  fontSize: 82,
  fontColor: "#ffffff",
  labelText: "NEW FEATURE",
  labelColor: "#6366f1",
  labelSize: 42,
  phoneSize: 78,
  phoneOffsetY: 16,
};
