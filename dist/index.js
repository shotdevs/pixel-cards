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
    backgroundColor: option.backgroundColor ?? "#120b26",
    backgroundImage: option.backgroundImage,
    progressColor: option.progressColor ?? "#B78BFF",
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
  if (options.backgroundImage) {
    try {
      const bgImage = await (0, import_canvas.loadImage)(options.backgroundImage);
      ctx.drawImage(bgImage, 0, 0, width, height);
    } catch (e) {
      console.warn(`Failed to load background image, falling back to color: ${options.backgroundColor}`);
      ctx.fillStyle = options.backgroundColor;
      ctx.fillRect(0, 0, width, height);
    }
  } else {
    ctx.fillStyle = options.backgroundColor;
    ctx.fillRect(0, 0, width, height);
  }
  const thumbSize = 120;
  const thumbX = 15;
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
  ctx.fillText(options.name, textX, 50, 270);
  ctx.fillStyle = options.authorColor;
  ctx.font = '14px "PixelFont"';
  ctx.fillText(options.author, textX, 75, 270);
  const progressBarY = 110;
  const progressBarWidth = 280;
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
  ctx.fillText(options.startTime, textX, 135);
  ctx.textAlign = "right";
  ctx.fillText(options.endTime, textX + progressBarWidth, 135);
  return canvas.toBuffer("image/png");
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Pixel
});
