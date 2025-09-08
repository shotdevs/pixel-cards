"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  Pixel: () => Pixel
});
module.exports = __toCommonJS(index_exports);

// src/themes/pixel.ts
var import_canvas = require("@napi-rs/canvas");
var import_cropify = require("cropify");

// src/functions/generateSvg.ts
var generateSvg = (svgContent) => {
  return `data:image/svg+xml;base64,${Buffer.from(svgContent).toString(
    "base64"
  )}`;
};

// src/themes/pixel.ts
var Pixel = async (option) => {
  if (!option.progress) option.progress = 10;
  if (!option.name) option.name = "Music Name";
  if (!option.author) option.author = "By Unburn";
  if (!option.startTime) option.startTime = "0:00";
  if (!option.endTime) option.endTime = "0:00";
  if (!option.progressBarColor) option.progressBarColor = "#C9A8FF";
  if (!option.progressColor) option.progressColor = "#DDA6FF";
  if (!option.backgroundColor) option.backgroundColor = "#1A0F1F";
  if (!option.nameColor) option.nameColor = "#FFFFFF";
  if (!option.authorColor) option.authorColor = "#DAD4E8";
  if (!option.timeColor) option.timeColor = "#FFFFFF";
  if (!option.imageDarkness) option.imageDarkness = 10;
  if (!option.backgroundImage) option.backgroundImage = require("path").join(__dirname, "../assets/musicard-bg.png");
  const noImageSvg = generateSvg(`<svg width="400" height="400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="400" fill="${option.progressColor}"/>
      </svg>`);
  if (!option.thumbnailImage) option.thumbnailImage = noImageSvg;
  let thumbnail;
  try {
    thumbnail = await (0, import_canvas.loadImage)(await (0, import_cropify.cropImage)({
      imagePath: option.thumbnailImage,
      borderRadius: 24,
      width: 250,
      height: 250,
      cropCenter: true
    }));
  } catch {
    thumbnail = await (0, import_canvas.loadImage)(await (0, import_cropify.cropImage)({
      imagePath: noImageSvg,
      borderRadius: 24,
      width: 250,
      height: 250,
      cropCenter: true
    }));
  }
  if (option.progress < 0) option.progress = 0;
  if (option.progress > 100) option.progress = 100;
  if (option.name.length > 30) option.name = option.name.slice(0, 30) + "...";
  if (option.author.length > 30) option.author = option.author.slice(0, 30) + "...";
  try {
    const canvas = (0, import_canvas.createCanvas)(1240, 520);
    const ctx = canvas.getContext("2d");
    const bgSvg = generateSvg(`<svg width="1240" height="520" viewBox="0 0 1240 520" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="1240" height="520" rx="30" fill="${option.backgroundColor}" />
        </svg>`);
    const bg = await (0, import_canvas.loadImage)(bgSvg);
    ctx.drawImage(bg, 0, 0);
    const pixelBandSvg = generateSvg(`<svg width="1240" height="200" viewBox="0 0 1240 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="g" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stop-color="#7A3BFF" />
            <stop offset="100%" stop-color="#3B2C5C" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="1240" height="200" fill="url(#g)" fill-opacity="0.12" />
        <!-- pixel blocks -->
        ${Array.from({ length: 60 }).map((_, i) => {
      const h = Math.floor(Math.random() * 40) + 10;
      return `<rect x="${i * 20}" y="${150 - h}" width="16" height="${h}" fill="#AA88FF" fill-opacity="0.22"/>`;
    }).join("")}
        </svg>`);
    const pixelBand = await (0, import_canvas.loadImage)(pixelBandSvg);
    ctx.drawImage(pixelBand, 0, 60);
    ctx.drawImage(thumbnail, 60, 135);
    const completed = 820 * option.progress / 100;
    const progressBarSvg = generateSvg(`<svg width="820" height="28" viewBox="0 0 820 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="820" height="28" rx="14" fill="#2A1D2E" />
        <rect width="${completed}" height="28" rx="14" fill="${option.progressColor}" />
        </svg>`);
    const progressBar = await (0, import_canvas.loadImage)(progressBarSvg);
    ctx.drawImage(progressBar, 340, 420);
    ctx.fillStyle = option.nameColor;
    ctx.font = "48px extrabold";
    ctx.fillText(option.name, 340, 210);
    ctx.fillStyle = option.authorColor;
    ctx.font = "30px regular";
    ctx.fillText(option.author, 340, 260);
    ctx.fillStyle = option.timeColor;
    ctx.font = "24px semibold";
    ctx.fillText(option.startTime, 340, 468);
    ctx.fillText(option.endTime, 1140, 468);
    return canvas.toBuffer("image/png");
  } catch (e) {
    throw new Error(e.message);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Pixel
});
