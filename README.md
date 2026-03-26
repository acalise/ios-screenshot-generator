# Screenshot Studio

Browser-based screenshot generator for App Store and Play Store marketing assets. Upload screenshots, style the frame and typography, then export production-size PNGs without sending assets to a server.

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Current scope

- Multiple slides in one project
- App-store-sized device presets
- Gradient and color controls
- Dynamic Google Font loading for export and preview
- Local PNG export with `html-to-image`

## Project structure

```text
app/
  page.tsx
components/studio/
  config.ts
  controls.tsx
  live-preview.tsx
  phone-frame.tsx
  slide-canvas.tsx
  types.ts
```

## Notes

- This repo targets `next@16`, so check the bundled docs in `node_modules/next/dist/docs/` before changing framework-level patterns.
- Exports are client-side. Large images and many slides will still be limited by browser memory.

## Build

```bash
npm run build
```
