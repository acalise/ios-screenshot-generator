# iOS Screenshot Generator

Generate polished iOS App Store screenshots in your browser.

Live app: `https://acalise.github.io/ios-screenshot-generator/`

This project is a lightweight browser-based editor for marketing screenshots. Upload iPhone screenshots, adjust the frame and composition, and export production-size PNGs without sending assets to a server.

## Features

- Browser-only screenshot generation
- iPhone frame with drag-to-position screenshot editing
- Headline and sub-label controls
- Background, typography, and framing controls
- Multi-slide workflow with local persistence
- Export current slide or the whole set
- GitHub Pages deployment

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
  controls.tsx              # Sidebar controls
  live-preview.tsx          # Scaled preview surface
  phone-frame.tsx           # iPhone frame and drag handling
  slide-canvas.tsx          # Shared render tree for preview/export
  types.ts                  # Shared editor types
```

## Notes

- This repo targets `next@16`, so check the bundled docs in `node_modules/next/dist/docs/` before changing framework-level patterns.
- Exports are client-side. Large images and many slides are still limited by browser memory.
- The hosted version is built as a static export for GitHub Pages under `/ios-screenshot-generator/`.

## Build

```bash
npm run build
```

## License

MIT
