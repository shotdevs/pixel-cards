// src/index.ts
import { createCanvas, loadImage, GlobalFonts } from "@napi-rs/canvas";
import * as path from "path";
var drawPixelMatrixBackground = (ctx, width, height) => {
  const bgColor = "#0D0D0D";
  const frameColor = "#00FF7F";
  const accentColor = "#00FFFF";
  const rainColor = "rgba(0, 255, 127, 0.7)";
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);
  const charSize = 8;
  const numColumns = Math.floor(width / charSize);
  for (let i = 0; i < numColumns; i++) {
    if (Math.random() > 0.3) {
      const columnHeight = Math.random() * height * 0.8 + height * 0.2;
      const startY = Math.random() * height - height;
      for (let j = 0; j < columnHeight; j += charSize + 2) {
        const alpha = 1 - j / columnHeight;
        ctx.globalAlpha = alpha * 0.5;
        ctx.fillStyle = rainColor;
        ctx.fillRect(i * charSize, startY + j, charSize, charSize);
      }
    }
  }
  ctx.globalAlpha = 1;
  const padding = 20;
  const cornerSize = 25;
  ctx.strokeStyle = frameColor;
  ctx.lineWidth = 2;
  ctx.strokeRect(padding, padding, width - padding * 2, height - padding * 2);
  ctx.beginPath();
  ctx.moveTo(padding, padding + cornerSize);
  ctx.lineTo(padding, padding);
  ctx.lineTo(padding + cornerSize, padding);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(width - padding, padding + cornerSize);
  ctx.lineTo(width - padding, padding);
  ctx.lineTo(width - padding - cornerSize, padding);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(padding, height - padding - cornerSize);
  ctx.lineTo(padding, height - padding);
  ctx.lineTo(padding + cornerSize, height - padding);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(width - padding, height - padding - cornerSize);
  ctx.lineTo(width - padding, height - padding);
  ctx.lineTo(width - padding - cornerSize, height - padding);
  ctx.stroke();
};
var Pixel = async (option) => {
  const options = {
    name: option.name,
    author: option.author,
    thumbnailImage: option.thumbnailImage,
    progress: option.progress ?? 10,
    startTime: option.startTime ?? "0:00",
    endTime: option.endTime ?? "0:00",
    progressColor: option.progressColor ?? "#00FFFF",
    // Cyan
    progressGradientEndColor: option.progressGradientEndColor ?? "#00FF7F",
    // Spring Green
    progressBarColor: option.progressBarColor ?? "rgba(0, 255, 127, 0.2)",
    // Faded green
    nameColor: option.nameColor ?? "#FFFFFF",
    authorColor: option.authorColor ?? "#00FF7F",
    // Spring Green
    timeColor: option.timeColor ?? "#00FFFF"
    // Cyan
  };
  options.progress = Math.max(0, Math.min(100, options.progress));
  const width = 500;
  const height = 700;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;
  try {
    const fontPath = path.join(__dirname, "..", "fonts", "pixel.ttf");
    if (!GlobalFonts.has("PixelFont")) {
      GlobalFonts.registerFromPath(fontPath, "PixelFont");
    }
  } catch (e) {
    console.error("Font not found. Make sure 'pixel.ttf' is in the 'fonts' folder.");
  }
  drawPixelMatrixBackground(ctx, width, height);
  const centerX = width / 2;
  const thumbSize = 300;
  const thumbX = (width - thumbSize) / 2;
  const thumbY = 80;
  try {
    const thumbnail = await loadImage(options.thumbnailImage);
    ctx.drawImage(thumbnail, thumbX, thumbY, thumbSize, thumbSize);
  } catch (e) {
    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(thumbX, thumbY, thumbSize, thumbSize);
    ctx.fillStyle = "#FFF";
    ctx.font = '40px "PixelFont"';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("?", centerX, thumbY + thumbSize / 2);
  }
  ctx.strokeStyle = options.authorColor;
  ctx.lineWidth = 2;
  ctx.strokeRect(thumbX, thumbY, thumbSize, thumbSize);
  ctx.textAlign = "center";
  ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
  ctx.shadowBlur = 6;
  ctx.fillStyle = options.nameColor;
  ctx.font = '36px "PixelFont"';
  ctx.fillText(options.name, centerX, thumbY + thumbSize + 70, width - 100);
  ctx.fillStyle = options.authorColor;
  ctx.font = '26px "PixelFont"';
  ctx.fillText(options.author, centerX, thumbY + thumbSize + 115, width - 100);
  ctx.shadowColor = "rgba(0, 0, 0, 0)";
  ctx.shadowBlur = 0;
  const progressBarWidth = width - 120;
  const progressBarX = (width - progressBarWidth) / 2;
  const progressBarY = height - 120;
  const progressBarHeight = 10;
  ctx.fillStyle = options.progressBarColor;
  ctx.fillRect(progressBarX, progressBarY - progressBarHeight / 2, progressBarWidth, progressBarHeight);
  const progressWidth = options.progress / 100 * progressBarWidth;
  if (progressWidth > 0) {
    const gradient = ctx.createLinearGradient(progressBarX, 0, progressBarX + progressBarWidth, 0);
    gradient.addColorStop(0, options.progressColor);
    gradient.addColorStop(1, options.progressGradientEndColor);
    ctx.fillStyle = gradient;
    ctx.fillRect(progressBarX, progressBarY - progressBarHeight / 2, progressWidth, progressBarHeight);
  }
  ctx.fillStyle = options.timeColor;
  ctx.font = '20px "PixelFont"';
  const timeY = progressBarY + 35;
  ctx.textAlign = "left";
  ctx.fillText(options.startTime, progressBarX, timeY);
  ctx.textAlign = "right";
  ctx.fillText(options.endTime, progressBarX + progressBarWidth, timeY);
  return canvas.toBuffer("image/png");
};
export {
  Pixel
};
