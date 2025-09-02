# Pixel Theme — Pixel Musicard

This document describes the Pixel theme for the Pixel Musicard generator. It explains available options, defaults, sample code, edge-cases, and tips for producing a pixel-styled music card like the provided mockup.

## What is the Pixel theme?

The Pixel theme is a compact music card design with a pixel-art style visual (pixel blocks along the lower portion), a rounded card body, left-side album thumbnail, big title text and author, and a progress bar with a circular progress handle — matching the attached mockup.

This README explains how to call the `Pixel` function exported by the package, what options you can pass, and how to handle images and output.

## Where to import

- If you're using the distributed package: `const { Pixel } = require("musicard")`
- If you're using the local build in this repo: `const { Pixel } = require("./dist/index.js")`

Both return the same API: an async function that resolves to a PNG buffer.

## Function contract

- Input: an options object (see options below)
- Output: Promise<Buffer> — PNG image buffer (ready to write to disk)
- Error modes: rejects when provided remote image cannot be fetched or when required arguments are invalid

## Options

The Pixel theme supports the following options. Values in parentheses are examples and the typical defaults used by the theme. If the theme's implementation changes, check the source for the authoritative defaults.

- `thumbnailImage` (string | undefined)
  - URL or data URL or local path to the thumbnail / album art.
  - If omitted or fetching fails, a generated placeholder SVG is used.

- `backgroundImage` (string | undefined)
  - Optional background image URL or path. If provided, it will be used as the card background.

- `backgroundColor` (string)
  - Fallback background color for the card (CSS hex or rgb string). Example: `#120b26`.

- `progress` (number)
  - Percentage progress (0 — 100). Example: `25`.
  - If omitted, a small default (e.g., `10`) is used. Values outside 0–100 will be clamped or cause an error depending on the implementation.

- `progressColor` (string)
  - The main color used in progress visuals and some accents. Example: `#FF7A00`.

- `progressBarColor` (string)
  - The background of the progress track. Example: `#5F2D00`.

- `menuColor` (string)
  - Accent color for small UI elements (if used). Example: `#FFFFFF` or `#FF7A00`.

- `name` (string)
  - Track title text. Example: `Music Name`.

- `author` (string)
  - Artist text. Example: `Artist Name`.

- `startTime` / `endTime` (string)
  - Display times. Example: `0:00` / `3:15`.

- `nameColor`, `authorColor`, `timeColor` (string)
  - Text colors for the respective fields.

- `imageDarkness` (number)
  - Value (0–1) to darken the thumbnail/background image if needed. Use to keep text legible.

- `paused` (boolean)
  - If true, render a paused UI state (if supported by theme). Example: `false`.

- `width` / `height` (number) — optional
  - Some themes accept explicit output size. Pixel theme uses a default fixed size; if your implementation supports override, include them.

Note: The actual implementation may provide slightly different option names or additional options — consult the `src/themes/pixel.ts` or `dist/index.js` in this repo for the authoritative list.

## Example usage

Node example that renders a Pixel musicard and writes to `musicard.png`:

```js
(async () => {
  const { Pixel } = require("musicard"); // or require("./dist/index.js") for local
  const fs = require("fs");

  const buffer = await Pixel({
    thumbnailImage: "https://lh3.googleusercontent.com/yavtBZZnoxaY21GSS_VIKSg0mvzu1b0r6arH8xvWVskoMaZ5ww3iDMgBNujnIWCt7MOkDsrKapSGCfc=w544-h544-l90-rj",
    backgroundColor: "#070707",
    progress: 42,
    progressColor: "#FF7A00",
    progressBarColor: "#5F2D00",
    menuColor: "#FF7A00",
    name: "Pixel Music",
    author: "By Unburn",
    startTime: "0:00",
    endTime: "3:21",
    imageDarkness: 0.45,
    paused: false
  });

  fs.writeFileSync("musicard.png", buffer);
  console.log("Wrote musicard.png");
})();
```

If you prefer to run a small script file, save the code to `render-pixel.js` and run:

```bash
node render-pixel.js
```

## Returned image

- Format: PNG buffer
- Dimensions: the Pixel theme uses a fixed layout; check the implementation for exact width/height (commonly 400×400 for smaller pixel cards in this project).

## Images & thumbnails

- Supported thumbnail sources: remote HTTPS URLs, local file paths, data URLs. Remote URLs are fetched and decoded.
- If remote fetch fails, the theme falls back to an auto-generated SVG placeholder.
- For best results use square album art (1:1) at least 400×400 px.

## Fonts

This project registers local fonts (Plus Jakarta Sans family) during initialization using a canvas-backed font registration call. If you get text fallback issues, ensure the fonts exist in the project's `fonts/` folder and that the environment can read them.

## Edge cases and validation

- Missing `thumbnailImage`: placeholder will be rendered.
- Invalid or unreachable `thumbnailImage` URL: the generator should fall back to the placeholder and continue.
- `progress` outside 0–100: clamp to 0–100 or throw — implementation dependent. Prefer clamping in caller code.
- Very long `name` or `author` strings: theme typically clamps or trims text; consider pre-truncating on the caller side.

## Styling / Customization tips

- To match the mockup's purple/pixel aesthetic, pick `progressColor` and `progressBarColor` from the sample:
  - progressColor: `#B78BFF` (or `#FF7A00` for orange accent in other examples)
  - progressBarColor: `#6A3C8B`

- For a darker card background use `backgroundColor: "#070707"` as shown earlier.

- Use `imageDarkness` (0–1) to reduce thumbnail brightness and improve text contrast.

## Troubleshooting

- If you get errors about `@napi-rs/canvas` or canvas fonts: ensure your environment supports the native canvas bindings or replace with a pure-js canvas implementation depending on the package.
- If output looks clipped, verify the `width`/`height` options or the theme's default size.

## Where to find the implementation

- Primary source: `src/themes/pixel.ts` (if present)
- Built distribution: `dist/index.js` — look for the `Pixel` export to inspect how options are handled, default values and exact dimensions.

## Contribution notes

- If you tweak layout or colors, add a small example PNG under `assets/` named `pixel-example.png` and update this README with the expected output sample.

## Quick checklist

- [x] Example usage included
- [x] Option list and guidance provided
- [x] Notes on fonts and assets
- [x] Edge-case recommendations

---

If you want, I can also:
- add a small example script in `examples/` (e.g. `examples/render-pixel.js`) that uses the local `Pixel` function and saves an output file; or
- add a small sample PNG to `assets/` showing the expected result.

Tell me which extra you prefer and I'll add it.
