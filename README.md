# Pixel Musicard

A stylish, pixel-themed music card generator for Discord bots, designed for easy integration and customization.

## Features

- Generates a "Now Playing" card with a modern, pixelated aesthetic.
- Displays track info, album art, progress bar, and timestamps.
- Highly customizable with colors, images, and text.
- Built with high-performance `@napi-rs/canvas`.

## Installation

1.  **Clone the repository (or install from npm):**
    ```bash
    npm install pixel-musicard
    ```

2.  **Ensure you have fonts and assets:**
    - Place a font file (e.g., `PlusJakartaSans-Bold.ttf`) in a `fonts/` directory in your project root.
    - If you use a default background, place it in an `assets/` directory.

## Usage

Import and use the `Pixel` function in your Discord bot code. It returns a `Promise<Buffer>` which you can send as an image file.

```javascript
const { Pixel } = require('pixel-musicard');
const fs = require('fs');

async function generateCard() {
  const cardBuffer = await Pixel({
    name: "Pixel Music",
    author: "By Unburn",
    thumbnailImage: "https://i.scdn.co/image/ab67616d0000b273b5220268a0a383b4855925bf",
    progress: 42,
    startTime: "1:20",
    endTime: "3:21",
    backgroundColor: "#120b26",
    progressColor: '#B78BFF',
    progressBarColor: '#6A3C8B',
  });

  // Save the image to a file
  fs.writeFileSync('musicard.png', cardBuffer);
  console.log('Generated musicard.png');

  // Or send it in a Discord message
  // await interaction.reply({ files: [{ attachment: cardBuffer, name: 'musicard.png' }] });
}

generateCard();