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
var drawDynamicBackground = (ctx, width, height) => {
  ctx.fillStyle = "#120b26";
  ctx.fillRect(0, 0, width, height);
  const decorColor = "#2a1a3e";
  ctx.strokeStyle = decorColor;
  ctx.fillStyle = decorColor;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(20, 50);
  ctx.lineTo(90, 10);
  ctx.moveTo(40, 65);
  ctx.lineTo(100, 25);
  ctx.moveTo(width - 20, height - 50);
  ctx.lineTo(width - 90, height - 10);
  ctx.stroke();
  ctx.fillRect(width - 50, 20, 10, 10);
  ctx.fillRect(15, height - 30, 8, 8);
  ctx.beginPath();
  ctx.moveTo(110, 15);
  ctx.lineTo(125, 35);
  ctx.lineTo(100, 40);
  ctx.closePath();
  ctx.fill();
  const panelX = 10;
  const panelY = 10;
  const panelWidth = width - 20;
  const panelHeight = height - 20;
  const panelRadius = 15;
  const gradient = ctx.createLinearGradient(panelX, panelY, panelX, panelY + panelHeight);
  gradient.addColorStop(0, "#3f2b44");
  gradient.addColorStop(1, "#a978ff");
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.roundRect(panelX, panelY, panelWidth, panelHeight, panelRadius);
  ctx.fill();
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(panelX, panelY, panelWidth, panelHeight, panelRadius);
  ctx.clip();
  const pixelSize = 5;
  const skylineBaseY = panelY + panelHeight;
  const maxPixelHeight = 45;
  for (let x = panelX; x < panelX + panelWidth; x += pixelSize) {
    const pixelHeight = Math.random() * maxPixelHeight;
    ctx.fillStyle = "#c5a3ff";
    ctx.fillRect(x, skylineBaseY - pixelHeight, pixelSize, pixelHeight);
  }
  ctx.restore();
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
    progressColor: option.progressColor ?? "#FFFFFF",
    progressBarColor: option.progressBarColor ?? "#6A3C8B",
    nameColor: option.nameColor ?? "#FFFFFF",
    authorColor: option.authorColor ?? "#b3b3b3",
    timeColor: option.timeColor ?? "#b3b3b3",
    imageDarkness: option.imageDarkness ?? 0.4,
    paused: option.paused ?? false
  };
  options.progress = Math.max(0, Math.min(100, options.progress));
  const width = 450;
  const height = 150;
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
  drawDynamicBackground(ctx, width, height);
  const thumbSize = 120;
  const thumbX = 25;
  const thumbY = 15;
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
    ctx.font = '20px "PixelFont"';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("?", thumbX + thumbSize / 2, thumbY + thumbSize / 2);
  }
  ctx.fillStyle = `rgba(0, 0, 0, ${options.imageDarkness})`;
  ctx.fillRect(thumbX, thumbY, thumbSize, thumbSize);
  ctx.restore();
  const textX = thumbX + thumbSize + 20;
  ctx.fillStyle = options.nameColor;
  ctx.font = '16px "PixelFont"';
  ctx.fillText(options.name, textX, 45, 260);
  ctx.fillStyle = options.authorColor;
  ctx.font = '14px "PixelFont"';
  ctx.fillText(options.author, textX, 70, 260);
  const progressBarY = 105;
  const progressBarWidth = 265;
  const progressBarHeight = 6;
  const progressHandleRadius = 6;
  ctx.fillStyle = options.progressBarColor;
  ctx.beginPath();
  ctx.roundRect(textX, progressBarY - progressBarHeight / 2, progressBarWidth, progressBarHeight, 3);
  ctx.fill();
  const progressWidth = options.progress / 100 * progressBarWidth;
  ctx.fillStyle = options.progressColor;
  ctx.beginPath();
  ctx.roundRect(textX, progressBarY - progressBarHeight / 2, progressWidth, progressBarHeight, 3);
  ctx.fill();
  if (!options.paused) {
    ctx.beginPath();
    ctx.arc(textX + progressWidth, progressBarY, progressHandleRadius, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = options.timeColor;
  ctx.font = '12px "PixelFont"';
  ctx.fillText(options.startTime, textX, 130);
  ctx.textAlign = "right";
  ctx.fillText(options.endTime, textX + progressBarWidth, 130);
  return canvas.toBuffer("image/png");
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Pixel
});
