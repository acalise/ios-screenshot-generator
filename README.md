# iOS App Store Screenshot Generator

Generate polished App Store screenshots in your browser. Upload a screenshot, customize the headline, background, and typography, then export pixel-perfect PNGs — no server, no sign-up.

**Live app:** https://acalise.github.io/ios-screenshot-generator/

## Features

- Browser-only screenshot generation — nothing leaves your device
- iPhone frame with drag-to-position screenshot editing
- Header and sub-header text controls
- Background gradients, presets, and color pickers
- Typography controls (15+ Google Fonts, size, color)
- Phone size and placement sliders
- Multi-slide workflow (up to 10) with local persistence
- Export individual slides or the full set
- Mobile-friendly UI with bottom sheet controls
- iOS-compatible export (long-press to save to Photos)

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Tech

- Next.js 16
- React 19
- Tailwind CSS 4
- `html-to-image`

## Project structure

```text
app/
  page.tsx                  # Main editor state and export flow
components/studio/
  config.ts                 # Defaults and presets
  controls.tsx              # Tabbed controls with mobile bottom sheet
  live-preview.tsx          # Scaled preview surface
  phone-frame.tsx           # iPhone frame and drag handling
  slide-canvas.tsx          # Shared render tree for preview/export
  types.ts                  # Shared editor types
```

## Build

```bash
npm run build
```

Static export is deployed to GitHub Pages via the included Actions workflow.
