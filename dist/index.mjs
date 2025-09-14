// src/index.ts
import { createCanvas, loadImage, GlobalFonts } from "@napi-rs/canvas";
import * as path from "path";
var drawAestheticBackground = (ctx, width, height) => {
  const bgColor = "#0A021A";
  const frameGlowColor = "#007BFF";
  const innerPanelColor = "rgba(13, 5, 43, 0.85)";
  const glitchColor1 = "#4D68F8";
  const glitchColor2 = "#F84DF0";
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);
  const gradientCenterX = width / 2;
  const gradientCenterY = 175;
  const radialGradient = ctx.createRadialGradient(gradientCenterX, gradientCenterY, 10, gradientCenterX, gradientCenterY, 200);
  radialGradient.addColorStop(0, "rgba(128, 70, 255, 0.4)");
  radialGradient.addColorStop(1, "rgba(128, 70, 255, 0)");
  ctx.fillStyle = radialGradient;
  ctx.fillRect(0, 0, width, height);
  const pixelCount = 40;
  const pixelSize = 3;
  for (let i = 0; i < pixelCount; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    ctx.fillStyle = Math.random() > 0.4 ? glitchColor1 : glitchColor2;
    ctx.fillRect(x, y, pixelSize, pixelSize);
  }
  const panelX = 20;
  const panelY = 10;
  const panelWidth = width - 40;
  const panelHeight = height - 20;
  const panelRadius = 20;
  ctx.save();
  ctx.shadowColor = frameGlowColor;
  ctx.shadowBlur = 15;
  ctx.beginPath();
  roundRect(ctx, panelX, panelY, panelWidth, panelHeight, panelRadius);
  ctx.strokeStyle = frameGlowColor;
  ctx.lineWidth = 4;
  ctx.stroke();
  ctx.restore();
  const padding = 4;
  const innerX = panelX + padding;
  const innerY = panelY + padding;
  const innerWidth = panelWidth - padding * 2;
  const innerHeight = panelHeight - padding * 2;
  const innerRadius = 16;
  ctx.fillStyle = innerPanelColor;
  ctx.beginPath();
  roundRect(ctx, innerX, innerY, innerWidth, innerHeight, innerRadius);
  ctx.fill();
};
function roundRect(ctx, x, y, w, h, r) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
  return ctx;
}
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
    progressGradientEndColor: option.progressGradientEndColor ?? "#FF00FF",
    // Magenta
    progressBarColor: option.progressBarColor ?? "#29194A",
    nameColor: option.nameColor ?? "#FFFFFF",
    // Clean White for title
    authorColor: option.authorColor ?? "#C89CFF",
    // Lavender for artist
    timeColor: option.timeColor ?? "#50FFFF",
    // Bright Cyan for time
    imageDarkness: option.imageDarkness ?? 0
  };
  options.progress = Math.max(0, Math.min(100, options.progress));
  const width = 450;
  const height = 550;
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
  drawAestheticBackground(ctx, width, height);
  const centerX = width / 2;
  const thumbSize = 250;
  const thumbX = (width - thumbSize) / 2;
  const thumbY = 50;
  ctx.save();
  roundRect(ctx, thumbX, thumbY, thumbSize, thumbSize, 15);
  ctx.clip();
  try {
    const thumbnail = await loadImage(options.thumbnailImage);
    ctx.drawImage(thumbnail, thumbX, thumbY, thumbSize, thumbSize);
  } catch (e) {
    ctx.fillStyle = "#333";
    ctx.fillRect(thumbX, thumbY, thumbSize, thumbSize);
    ctx.fillStyle = "#FFF";
    ctx.font = '40px "PixelFont"';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("?", centerX, thumbY + thumbSize / 2);
  }
  if (options.imageDarkness > 0) {
    ctx.fillStyle = `rgba(0, 0, 0, ${options.imageDarkness})`;
    ctx.fillRect(thumbX, thumbY, thumbSize, thumbSize);
  }
  ctx.restore();
  ctx.textAlign = "center";
  ctx.shadowColor = "rgba(0, 0, 0, 0.7)";
  ctx.shadowBlur = 8;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;
  ctx.fillStyle = options.nameColor;
  ctx.font = '32px "PixelFont"';
  ctx.fillText(options.name, centerX, thumbY + thumbSize + 60, width - 80);
  ctx.fillStyle = options.authorColor;
  ctx.font = '24px "PixelFont"';
  ctx.fillText(options.author, centerX, thumbY + thumbSize + 100, width - 80);
  ctx.shadowColor = "rgba(0, 0, 0, 0)";
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  const progressBarWidth = width - 100;
  const progressBarX = (width - progressBarWidth) / 2;
  const progressBarY = height - 80;
  const progressBarHeight = 8;
  ctx.fillStyle = options.progressBarColor;
  ctx.beginPath();
  roundRect(ctx, progressBarX, progressBarY - progressBarHeight / 2, progressBarWidth, progressBarHeight, 4);
  ctx.fill();
  const progressWidth = options.progress / 100 * progressBarWidth;
  if (progressWidth > 0) {
    const gradient = ctx.createLinearGradient(progressBarX, 0, progressBarX + progressBarWidth, 0);
    gradient.addColorStop(0, options.progressColor);
    gradient.addColorStop(1, options.progressGradientEndColor);
    ctx.fillStyle = gradient;
    ctx.beginPath();
    roundRect(ctx, progressBarX, progressBarY - progressBarHeight / 2, progressWidth, progressBarHeight, 4);
    ctx.fill();
  }
  ctx.fillStyle = options.timeColor;
  ctx.font = '18px "PixelFont"';
  const timeY = progressBarY + 30;
  ctx.textAlign = "left";
  ctx.fillText(options.startTime, progressBarX, timeY);
  ctx.textAlign = "right";
  ctx.fillText(options.endTime, progressBarX + progressBarWidth, timeY);
  return canvas.toBuffer("image/png");
};
export {
  Pixel
};
