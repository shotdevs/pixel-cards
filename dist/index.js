"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  Pixel: () => Pixel
});
module.exports = __toCommonJS(index_exports);
var import_canvas = require("@napi-rs/canvas");
var path = __toESM(require("path"));
var drawSynthwaveBackground = (ctx, width, height) => {
  const bgColor = "#0A021A";
  const frameGlowColor = "#007BFF";
  const innerPanelColor = "rgba(13, 5, 43, 0.85)";
  const glitchColor1 = "#4D68F8";
  const glitchColor2 = "#F84DF0";
  const visualizerColor = "#E600E6";
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);
  const pixelCount = 50;
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
  const panelRadius = 15;
  ctx.save();
  ctx.shadowColor = frameGlowColor;
  ctx.shadowBlur = 15;
  ctx.beginPath();
  ctx.moveTo(panelX + panelRadius, panelY);
  ctx.lineTo(panelX + panelWidth - panelRadius, panelY);
  ctx.quadraticCurveTo(panelX + panelWidth, panelY, panelX + panelWidth, panelY + panelRadius);
  ctx.lineTo(panelX + panelWidth, panelY + panelHeight - panelRadius);
  ctx.quadraticCurveTo(panelX + panelWidth, panelY + panelHeight, panelX + panelWidth - panelRadius, panelY + panelHeight);
  ctx.lineTo(panelX + panelRadius, panelY + panelHeight);
  ctx.quadraticCurveTo(panelX, panelY + panelHeight, panelX, panelY + panelHeight - panelRadius);
  ctx.lineTo(panelX, panelY + panelRadius);
  ctx.quadraticCurveTo(panelX, panelY, panelX + panelRadius, panelY);
  ctx.closePath();
  ctx.strokeStyle = frameGlowColor;
  ctx.lineWidth = 4;
  ctx.stroke();
  ctx.restore();
  const padding = 4;
  const innerX = panelX + padding;
  const innerY = panelY + padding;
  const innerWidth = panelWidth - padding * 2;
  const innerHeight = panelHeight - padding * 2;
  const innerRadius = 12;
  ctx.fillStyle = innerPanelColor;
  ctx.beginPath();
  ctx.moveTo(innerX + innerRadius, innerY);
  ctx.lineTo(innerX + innerWidth - innerRadius, innerY);
  ctx.quadraticCurveTo(innerX + innerWidth, innerY, innerX + innerWidth, innerY + innerRadius);
  ctx.lineTo(innerX + innerWidth, innerY + innerHeight - innerRadius);
  ctx.quadraticCurveTo(innerX + innerWidth, innerY + innerHeight, innerX + innerWidth - innerRadius, innerY + innerHeight);
  ctx.lineTo(innerX + innerRadius, innerY + innerHeight);
  ctx.quadraticCurveTo(innerX, innerY + innerHeight, innerX, innerY + innerHeight - innerRadius);
  ctx.lineTo(innerX, innerY + innerRadius);
  ctx.quadraticCurveTo(innerX, innerY, innerX + innerRadius, innerY);
  ctx.closePath();
  ctx.fill();
  const visualizerX = innerX + innerWidth - 30;
  const visualizerBaseY = innerY + innerHeight - 20;
  const barWidth = 4;
  for (let i = 0; i < 5; i++) {
    const barHeight = Math.random() * 40 + 10;
    ctx.fillStyle = visualizerColor;
    ctx.fillRect(visualizerX + i * (barWidth + 2), visualizerBaseY - barHeight, barWidth, barHeight);
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
var Pixel = async (option) => {
  const options = {
    name: option.name,
    author: option.author,
    thumbnailImage: option.thumbnailImage,
    progress: option.progress ?? 10,
    startTime: option.startTime ?? "0:00",
    endTime: option.endTime ?? "0:00",
    progressColor: option.progressColor ?? "#00FFFF",
    // Cyan start of gradient
    progressGradientEndColor: option.progressGradientEndColor ?? "#FF00FF",
    // Magenta end of gradient
    progressBarColor: option.progressBarColor ?? "#29194A",
    // Dark purple for the bar background
    nameColor: option.nameColor ?? "#50FFFF",
    // Bright Cyan
    authorColor: option.authorColor ?? "#C89CFF",
    // Lavender
    timeColor: option.timeColor ?? "#50FFFF",
    // Bright Cyan
    imageDarkness: option.imageDarkness ?? 0,
    paused: option.paused ?? false
  };
  options.progress = Math.max(0, Math.min(100, options.progress));
  const width = 800;
  const height = 280;
  const canvas = (0, import_canvas.createCanvas)(width, height);
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;
  try {
    const fontPath = path.join(__dirname, "..", "fonts", "pixel.ttf");
    if (!import_canvas.GlobalFonts.has("PixelFont")) {
      import_canvas.GlobalFonts.registerFromPath(fontPath, "PixelFont");
    }
  } catch (e) {
    console.error("Font not found. Make sure 'pixel.ttf' is in the 'fonts' folder.");
    console.error(e);
  }
  drawSynthwaveBackground(ctx, width, height);
  const thumbSize = 200;
  const thumbX = 40;
  const thumbY = (height - thumbSize) / 2;
  ctx.save();
  roundRect(ctx, thumbX, thumbY, thumbSize, thumbSize, 10);
  ctx.clip();
  try {
    const thumbnail = await (0, import_canvas.loadImage)(options.thumbnailImage);
    ctx.drawImage(thumbnail, thumbX, thumbY, thumbSize, thumbSize);
  } catch (e) {
    ctx.fillStyle = "#333";
    ctx.fillRect(thumbX, thumbY, thumbSize, thumbSize);
    ctx.fillStyle = "#FFF";
    ctx.font = '30px "PixelFont"';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("?", thumbX + thumbSize / 2, thumbY + thumbSize / 2);
  }
  if (options.imageDarkness > 0) {
    ctx.fillStyle = `rgba(0, 0, 0, ${options.imageDarkness})`;
    ctx.fillRect(thumbX, thumbY, thumbSize, thumbSize);
  }
  ctx.restore();
  const textX = thumbX + thumbSize + 30;
  const textAvailableWidth = width - textX - 50;
  ctx.fillStyle = options.nameColor;
  ctx.font = '28px "PixelFont"';
  const nameLines = options.name.split("\n");
  let currentY = 80;
  const lineHeight = 35;
  nameLines.forEach((line) => {
    ctx.fillText(line, textX, currentY, textAvailableWidth);
    currentY += lineHeight;
  });
  ctx.fillStyle = options.authorColor;
  ctx.font = '22px "PixelFont"';
  ctx.fillText(options.author, textX, currentY + 5, textAvailableWidth);
  const progressBarY = 200;
  const progressBarWidth = textAvailableWidth;
  const progressBarHeight = 8;
  ctx.fillStyle = options.progressBarColor;
  ctx.beginPath();
  roundRect(ctx, textX, progressBarY - progressBarHeight / 2, progressBarWidth, progressBarHeight, 4);
  ctx.fill();
  const progressWidth = options.progress / 100 * progressBarWidth;
  if (progressWidth > 0) {
    const gradient = ctx.createLinearGradient(textX, 0, textX + progressWidth, 0);
    gradient.addColorStop(0, options.progressColor);
    gradient.addColorStop(1, options.progressGradientEndColor);
    ctx.fillStyle = gradient;
    ctx.beginPath();
    roundRect(ctx, textX, progressBarY - progressBarHeight / 2, progressWidth, progressBarHeight, 4);
    ctx.fill();
  }
  ctx.fillStyle = options.timeColor;
  ctx.font = '20px "PixelFont"';
  const timeY = progressBarY + 35;
  ctx.textAlign = "left";
  ctx.fillText(options.startTime, textX, timeY);
  ctx.textAlign = "right";
  ctx.fillText(options.endTime, textX + progressBarWidth, timeY);
  return canvas.toBuffer("image/png");
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Pixel
});
