// src/index.ts
import { createCanvas as createCanvas2, loadImage as loadImage2, GlobalFonts as GlobalFonts2 } from "@napi-rs/canvas";
import * as path2 from "path";

// src/pixel-japanese.ts
import { createCanvas, loadImage, GlobalFonts } from "@napi-rs/canvas";
import * as path from "path";
var PALETTE = {
  BACKGROUND_PRIMARY: "#fde2e4",
  BACKGROUND_SECONDARY: "#fff1f2",
  SAKURA_PINK_LIGHT: "#ffc2d1",
  SAKURA_PINK_DARK: "#ffb3c1",
  TEXT_PRIMARY: "#8c5e58",
  TEXT_SECONDARY: "#a68080",
  PROGRESS_BAR: "#ff8fab",
  PROGRESS_BAR_BACKGROUND: "#fce4e4",
  DEVICE_SHADOW: "rgba(0, 0, 0, 0.1)",
  ALBUM_ART_SHADOW: "#ffb3c1"
};
var drawSakuraBackground = (ctx, width, height) => {
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, PALETTE.BACKGROUND_PRIMARY);
  gradient.addColorStop(1, PALETTE.BACKGROUND_SECONDARY);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = PALETTE.SAKURA_PINK_LIGHT;
  for (let i = 0; i < 20; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const size = Math.random() * 10 + 5;
    ctx.beginPath();
    ctx.ellipse(x, y, size, size / 2, Math.random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }
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
var PixelJapanese = async (option) => {
  const options = {
    name: option.name,
    author: option.author,
    thumbnailImage: option.thumbnailImage,
    progress: option.progress ?? 10,
    startTime: option.startTime ?? "0:00",
    endTime: option.endTime ?? "0:00"
  };
  options.progress = Math.max(0, Math.min(100, options.progress));
  const width = 1200;
  const height = 675;
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
  drawSakuraBackground(ctx, width, height);
  const cardWidth = 850;
  const cardHeight = 380;
  const cardX = (width - cardWidth) / 2;
  const cardY = (height - cardHeight) / 2;
  const padding = 35;
  ctx.shadowColor = PALETTE.DEVICE_SHADOW;
  ctx.shadowBlur = 20;
  ctx.shadowOffsetY = 5;
  ctx.fillStyle = PALETTE.BACKGROUND_SECONDARY;
  roundRect(ctx, cardX, cardY, cardWidth, cardHeight, 20).fill();
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;
  const thumbSize = 200;
  const thumbX = cardX + padding;
  const thumbY = cardY + padding;
  ctx.shadowColor = PALETTE.ALBUM_ART_SHADOW;
  ctx.shadowBlur = 15;
  ctx.fillStyle = "#fff";
  roundRect(ctx, thumbX, thumbY, thumbSize, thumbSize, 10).fill();
  ctx.shadowBlur = 0;
  ctx.save();
  roundRect(ctx, thumbX, thumbY, thumbSize, thumbSize, 10).clip();
  try {
    const thumbnail = await loadImage(options.thumbnailImage);
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(thumbnail, thumbX, thumbY, thumbSize, thumbSize);
    ctx.imageSmoothingEnabled = false;
  } catch (e) {
  }
  ctx.restore();
  const textX = thumbX + thumbSize + padding;
  const textWidth = cardWidth - thumbSize - padding * 3;
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.font = '52px "PixelFont"';
  ctx.fillStyle = PALETTE.TEXT_PRIMARY;
  ctx.fillText(options.name, textX, thumbY + 25, textWidth);
  ctx.font = '32px "PixelFont"';
  ctx.fillStyle = PALETTE.TEXT_SECONDARY;
  ctx.fillText(options.author, textX, thumbY + 95, textWidth);
  const progressY = thumbY + 160;
  const progressBarHeight = 10;
  const progressBarWidth = textWidth;
  ctx.fillStyle = PALETTE.PROGRESS_BAR_BACKGROUND;
  roundRect(ctx, textX, progressY, progressBarWidth, progressBarHeight, 5).fill();
  const progressWidth = options.progress / 100 * progressBarWidth;
  ctx.fillStyle = PALETTE.PROGRESS_BAR;
  roundRect(ctx, textX, progressY, progressWidth, progressBarHeight, 5).fill();
  ctx.fillStyle = PALETTE.TEXT_SECONDARY;
  ctx.font = '24px "PixelFont"';
  ctx.textBaseline = "bottom";
  const timeY = cardY + cardHeight - padding;
  ctx.fillText(options.startTime, textX, timeY);
  ctx.textAlign = "right";
  ctx.fillText(options.endTime, textX + textWidth, timeY);
  ctx.fillStyle = PALETTE.SAKURA_PINK_DARK;
  ctx.beginPath();
  ctx.ellipse(textX + textWidth - 20, thumbY + 40, 10, 5, Math.PI / 4, 0, Math.PI * 2);
  ctx.fill();
  return canvas.toBuffer("image/png");
};

// src/index.ts
var PALETTE2 = {
  BACKGROUND_DARK: "#0b021d",
  BACKGROUND_LIGHT: "#1f0a3b",
  NEBULA_GLOW: "#4f2a8c",
  STARS: "rgba(255, 255, 255, 0.7)",
  DEVICE_DARK: "#1f133d",
  DEVICE_LIGHT: "#2d1e52",
  DEVICE_OUTLINE_GLOW: "#ff00e0",
  SCREEN_GLOW: "#00d9e1",
  TITLE: "#ffffff",
  ARTIST: "#00d9e1",
  TIME: "rgba(255, 255, 255, 0.7)",
  PROGRESS_ACTIVE: "#22ff8a",
  PROGRESS_BG: "rgba(0, 0, 0, 0.25)"
};
var drawCosmicBackground = (ctx, width, height) => {
  const gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width * 0.7);
  gradient.addColorStop(0, PALETTE2.BACKGROUND_LIGHT);
  gradient.addColorStop(1, PALETTE2.BACKGROUND_DARK);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  ctx.filter = "blur(60px)";
  ctx.fillStyle = PALETTE2.NEBULA_GLOW;
  ctx.beginPath();
  ctx.arc(width * 0.25, height * 0.3, width * 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(width * 0.75, height * 0.6, width * 0.25, 0, Math.PI * 2);
  ctx.fill();
  ctx.filter = "none";
  ctx.fillStyle = PALETTE2.STARS;
  for (let i = 0; i < 200; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const r = Math.random() * 1.5;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
};
function roundRect2(ctx, x, y, w, h, r) {
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
    endTime: option.endTime ?? "0:00"
  };
  options.progress = Math.max(0, Math.min(100, options.progress));
  const width = 1200;
  const height = 675;
  const canvas = createCanvas2(width, height);
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;
  try {
    const fontPath = path2.join(__dirname, "..", "fonts", "pixel.ttf");
    if (!GlobalFonts2.has("PixelFont")) {
      GlobalFonts2.registerFromPath(fontPath, "PixelFont");
    }
  } catch (e) {
    console.error("Font not found. Make sure 'pixel.ttf' is in the 'fonts' folder.");
  }
  drawCosmicBackground(ctx, width, height);
  const cardWidth = 1020;
  const cardHeight = 456;
  const cardX = (width - cardWidth) / 2;
  const cardY = (height - cardHeight) / 2;
  const padding = 35;
  ctx.shadowColor = PALETTE2.DEVICE_OUTLINE_GLOW;
  ctx.shadowBlur = 40;
  const deviceGradient = ctx.createLinearGradient(cardX, cardY, cardX, cardY + cardHeight);
  deviceGradient.addColorStop(0, PALETTE2.DEVICE_LIGHT);
  deviceGradient.addColorStop(1, PALETTE2.DEVICE_DARK);
  ctx.fillStyle = deviceGradient;
  roundRect2(ctx, cardX, cardY, cardWidth, cardHeight, 15).fill();
  ctx.shadowBlur = 0;
  const spoolRadius = 30;
  ctx.fillStyle = "rgba(0,0,0,0.4)";
  ctx.beginPath();
  ctx.arc(cardX + cardWidth * 0.2, cardY + cardHeight - 75, spoolRadius, 0, Math.PI * 2);
  ctx.arc(cardX + cardWidth * 0.8, cardY + cardHeight - 75, spoolRadius, 0, Math.PI * 2);
  ctx.fill();
  const thumbSize = 200;
  const thumbX = cardX + padding;
  const thumbY = cardY + padding;
  ctx.shadowColor = PALETTE2.SCREEN_GLOW;
  ctx.shadowBlur = 25;
  ctx.fillStyle = "#000";
  roundRect2(ctx, thumbX, thumbY, thumbSize, thumbSize, 5).fill();
  ctx.shadowBlur = 0;
  ctx.save();
  roundRect2(ctx, thumbX, thumbY, thumbSize, thumbSize, 5).clip();
  try {
    const thumbnail = await loadImage2(options.thumbnailImage);
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(thumbnail, thumbX, thumbY, thumbSize, thumbSize);
    ctx.imageSmoothingEnabled = false;
  } catch (e) {
  }
  ctx.restore();
  const textX = thumbX + thumbSize + padding;
  const textWidth = cardWidth - thumbSize - padding * 2.5;
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.font = '52px "PixelFont"';
  ctx.fillStyle = "rgba(0,0,0,0.3)";
  ctx.fillText(options.name, textX + 2, thumbY + 25 + 2, textWidth);
  ctx.fillStyle = PALETTE2.TITLE;
  ctx.fillText(options.name, textX, thumbY + 25, textWidth);
  ctx.font = '32px "PixelFont"';
  ctx.fillStyle = PALETTE2.ARTIST;
  ctx.fillText(options.author, textX, thumbY + 95, textWidth);
  const progressY = thumbY + 160;
  const segmentWidth = 12;
  const segmentGap = 4;
  const numSegments = Math.floor(textWidth / (segmentWidth + segmentGap));
  const activeSegments = Math.round(options.progress / 100 * numSegments);
  for (let i = 0; i < numSegments; i++) {
    const segX = textX + i * (segmentWidth + segmentGap);
    ctx.fillStyle = PALETTE2.PROGRESS_BG;
    ctx.fillRect(segX, progressY, segmentWidth, 24);
    if (i < activeSegments) {
      ctx.fillStyle = PALETTE2.PROGRESS_ACTIVE;
      ctx.shadowColor = PALETTE2.PROGRESS_ACTIVE;
      ctx.shadowBlur = 10;
      ctx.fillRect(segX, progressY, segmentWidth, 24);
      ctx.shadowBlur = 0;
    }
  }
  ctx.fillStyle = PALETTE2.TIME;
  ctx.font = '24px "PixelFont"';
  ctx.textBaseline = "bottom";
  const timeY = cardY + cardHeight - padding;
  ctx.fillText(options.startTime, textX, timeY);
  ctx.textAlign = "right";
  ctx.fillText(options.endTime, textX + textWidth, timeY);
  ctx.strokeStyle = "rgba(0,0,0,0.2)";
  ctx.lineWidth = 2;
  for (let i = 0; i < 15; i++) {
    const lineY = cardY + padding + i * 5;
    ctx.beginPath();
    ctx.moveTo(cardX + cardWidth - padding - 60, lineY);
    ctx.lineTo(cardX + cardWidth - padding, lineY);
    ctx.stroke();
  }
  ctx.textAlign = "left";
  ctx.fillStyle = "rgba(255,255,255,0.2)";
  ctx.font = '18px "PixelFont"';
  ctx.fillText("M-86", cardX + padding, timeY);
  ctx.textAlign = "right";
  ctx.textBaseline = "bottom";
  ctx.font = '22px "PixelFont"';
  ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
  ctx.fillText("by pixel music", width - padding, height - padding + 15);
  return canvas.toBuffer("image/png");
};
export {
  Pixel,
  PixelJapanese
};
