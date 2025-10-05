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
  DatabaseHelper: () => DatabaseHelper,
  GuildStatus: () => GuildStatus,
  Pixel: () => Pixel,
  PixelJapanese: () => PixelJapanese,
  createGuildStats: () => createGuildStats
});
module.exports = __toCommonJS(index_exports);
var import_canvas3 = require("@napi-rs/canvas");
var path3 = __toESM(require("path"));

// src/pixel-japanese.ts
var import_canvas = require("@napi-rs/canvas");
var path = __toESM(require("path"));
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
    const thumbnail = await (0, import_canvas.loadImage)(options.thumbnailImage);
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

// src/guild-status.ts
var import_canvas2 = require("@napi-rs/canvas");
var path2 = __toESM(require("path"));
var GUILD_PALETTE = {
  BACKGROUND_DARK: "#0a0a0a",
  BACKGROUND_LIGHT: "#1a1a1a",
  CARD_BG: "#2a2a2a",
  CARD_BORDER: "#404040",
  PRIMARY: "#5865f2",
  // Discord blurple
  SECONDARY: "#57f287",
  // Discord green
  ACCENT: "#faa61a",
  // Discord yellow
  DANGER: "#ed4245",
  // Discord red
  TEXT_PRIMARY: "#ffffff",
  TEXT_SECONDARY: "#b9bbbe",
  TEXT_MUTED: "#72767d",
  ONLINE: "#57f287",
  IDLE: "#faa61a",
  DND: "#ed4245",
  OFFLINE: "#747f8d",
  PROGRESS_BG: "#404040",
  PROGRESS_FILL: "#5865f2"
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
var drawGradientBackground = (ctx, width, height, theme) => {
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  if (theme === "dark") {
    gradient.addColorStop(0, GUILD_PALETTE.BACKGROUND_LIGHT);
    gradient.addColorStop(1, GUILD_PALETTE.BACKGROUND_DARK);
  } else {
    gradient.addColorStop(0, "#f8f9fa");
    gradient.addColorStop(1, "#e9ecef");
  }
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
};
var drawServerIcon = async (ctx, x, y, size, iconUrl) => {
  const iconRadius = size / 2;
  if (iconUrl) {
    try {
      const icon = await (0, import_canvas2.loadImage)(iconUrl);
      ctx.save();
      ctx.beginPath();
      ctx.arc(x + iconRadius, y + iconRadius, iconRadius, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(icon, x, y, size, size);
      ctx.restore();
    } catch (e) {
      drawDefaultServerIcon(ctx, x, y, size);
    }
  } else {
    drawDefaultServerIcon(ctx, x, y, size);
  }
};
var drawDefaultServerIcon = (ctx, x, y, size) => {
  const iconRadius = size / 2;
  const centerX = x + iconRadius;
  const centerY = y + iconRadius;
  ctx.fillStyle = GUILD_PALETTE.PRIMARY;
  ctx.beginPath();
  ctx.arc(centerX, centerY, iconRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = GUILD_PALETTE.TEXT_PRIMARY;
  ctx.font = `${size * 0.6}px Arial`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("D", centerX, centerY);
};
var formatNumber = (num) => {
  if (num >= 1e6) {
    return (num / 1e6).toFixed(1) + "M";
  } else if (num >= 1e3) {
    return (num / 1e3).toFixed(1) + "K";
  }
  return num.toString();
};
var formatDuration = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
};
var drawStatCard = (ctx, x, y, width, height, title, value, icon, color) => {
  ctx.fillStyle = GUILD_PALETTE.CARD_BG;
  roundRect2(ctx, x, y, width, height, 12).fill();
  ctx.strokeStyle = GUILD_PALETTE.CARD_BORDER;
  ctx.lineWidth = 1;
  roundRect2(ctx, x, y, width, height, 12).stroke();
  ctx.fillStyle = color;
  ctx.font = "24px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(icon, x + 30, y + 30);
  ctx.fillStyle = GUILD_PALETTE.TEXT_SECONDARY;
  ctx.font = "14px Arial";
  ctx.textAlign = "left";
  ctx.fillText(title, x + 60, y + 25);
  ctx.fillStyle = GUILD_PALETTE.TEXT_PRIMARY;
  ctx.font = "bold 20px Arial";
  ctx.fillText(value, x + 60, y + 50);
};
var drawTopUsers = (ctx, x, y, width, users) => {
  const cardHeight = 150;
  ctx.fillStyle = GUILD_PALETTE.CARD_BG;
  roundRect2(ctx, x, y, width, cardHeight, 12).fill();
  ctx.strokeStyle = GUILD_PALETTE.CARD_BORDER;
  ctx.lineWidth = 1;
  roundRect2(ctx, x, y, width, cardHeight, 12).stroke();
  ctx.fillStyle = GUILD_PALETTE.TEXT_PRIMARY;
  ctx.font = "bold 18px Arial";
  ctx.textAlign = "left";
  ctx.fillText("Top Members", x + 20, y + 30);
  const userHeight = 30;
  const startY = y + 50;
  const columnWidth = (width - 40) / 2;
  const usersPerColumn = 2;
  users.slice(0, 4).forEach((user, index) => {
    const column = Math.floor(index / usersPerColumn);
    const row = index % usersPerColumn;
    const userX = x + 20 + column * columnWidth;
    const userY = startY + row * userHeight;
    ctx.fillStyle = GUILD_PALETTE.TEXT_MUTED;
    ctx.font = "14px Arial";
    ctx.textAlign = "center";
    ctx.fillText(`${index + 1}`, userX + 20, userY + 15);
    ctx.fillStyle = GUILD_PALETTE.TEXT_PRIMARY;
    ctx.font = "14px Arial";
    ctx.textAlign = "left";
    const maxWidth = columnWidth - 100;
    const username = user.username.length > 18 ? user.username.substring(0, 15) + "..." : user.username;
    ctx.fillText(username, userX + 50, userY + 15);
    ctx.fillStyle = GUILD_PALETTE.SECONDARY;
    ctx.font = "12px Arial";
    ctx.textAlign = "right";
    ctx.fillText(`Lv.${user.level}`, userX + columnWidth - 20, userY + 15);
  });
};
var GuildStatus = async (options) => {
  const {
    guildName,
    guildIcon,
    stats,
    theme = "dark",
    showTopUsers = true,
    customBackground
  } = options;
  const width = 800;
  const height = 600;
  const canvas = (0, import_canvas2.createCanvas)(width, height);
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = true;
  try {
    const fontPath = path2.join(__dirname, "..", "fonts", "pixel.ttf");
    if (!import_canvas2.GlobalFonts.has("PixelFont")) {
      import_canvas2.GlobalFonts.registerFromPath(fontPath, "PixelFont");
    }
  } catch (e) {
    console.warn("Pixel font not found, using default fonts");
  }
  if (customBackground) {
    try {
      const bgImage = await (0, import_canvas2.loadImage)(customBackground);
      ctx.drawImage(bgImage, 0, 0, width, height);
    } catch (e) {
      drawGradientBackground(ctx, width, height, theme);
    }
  } else {
    drawGradientBackground(ctx, width, height, theme);
  }
  const headerHeight = 100;
  const iconSize = 60;
  const iconX = 30;
  const iconY = 20;
  await drawServerIcon(ctx, iconX, iconY, iconSize, guildIcon);
  ctx.fillStyle = GUILD_PALETTE.TEXT_PRIMARY;
  ctx.font = "bold 28px Arial";
  ctx.textAlign = "left";
  ctx.fillText(guildName, iconX + iconSize + 20, iconY + 25);
  ctx.fillStyle = GUILD_PALETTE.TEXT_SECONDARY;
  ctx.font = "16px Arial";
  ctx.fillText(
    `${formatNumber(stats.totalMembers)} members \u2022 ${formatNumber(stats.onlineMembers)} online`,
    iconX + iconSize + 20,
    iconY + 55
  );
  const cardWidth = 180;
  const cardHeight = 80;
  const cardSpacing = 20;
  const cardsStartX = 30;
  const cardsStartY = 140;
  drawStatCard(
    ctx,
    cardsStartX,
    cardsStartY,
    cardWidth,
    cardHeight,
    "Total Members",
    formatNumber(stats.totalMembers),
    "\u{1F465}",
    GUILD_PALETTE.PRIMARY
  );
  drawStatCard(
    ctx,
    cardsStartX + cardWidth + cardSpacing,
    cardsStartY,
    cardWidth,
    cardHeight,
    "Online Now",
    formatNumber(stats.onlineMembers),
    "\u{1F7E2}",
    GUILD_PALETTE.ONLINE
  );
  drawStatCard(
    ctx,
    cardsStartX + (cardWidth + cardSpacing) * 2,
    cardsStartY,
    cardWidth,
    cardHeight,
    "Messages",
    formatNumber(stats.totalMessages),
    "\u{1F4AC}",
    GUILD_PALETTE.SECONDARY
  );
  drawStatCard(
    ctx,
    cardsStartX,
    cardsStartY + cardHeight + cardSpacing,
    cardWidth,
    cardHeight,
    "Voice Time",
    formatDuration(stats.totalVoiceTime),
    "\u{1F3A4}",
    GUILD_PALETTE.ACCENT
  );
  drawStatCard(
    ctx,
    cardsStartX + cardWidth + cardSpacing,
    cardsStartY + cardHeight + cardSpacing,
    cardWidth,
    cardHeight,
    "Active Users",
    formatNumber(stats.activeUsers),
    "\u2B50",
    GUILD_PALETTE.DANGER
  );
  if (showTopUsers && stats.topUsers.length > 0) {
    const topUsersWidth = width - 60;
    const topUsersX = 30;
    const topUsersY = 350;
    drawTopUsers(ctx, topUsersX, topUsersY, topUsersWidth, stats.topUsers);
  }
  const footerY = height - 30;
  ctx.fillStyle = GUILD_PALETTE.TEXT_MUTED;
  ctx.font = "12px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Generated by Ghost X Bot", width / 2, footerY);
  return canvas.toBuffer("image/png");
};
var createGuildStats = (users, totalMembers, onlineMembers) => {
  const userEntries = Object.entries(users);
  const totalMessages = userEntries.reduce((sum, [, user]) => sum + user.messages.total, 0);
  const totalVoiceTime = userEntries.reduce((sum, [, user]) => sum + user.voiceTime.total, 0);
  const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1e3);
  const activeUsers = userEntries.filter(
    ([, user]) => new Date(user.lastActive) > dayAgo
  ).length;
  const topUsers = userEntries.map(([userId, user]) => ({
    userId,
    username: `User${userId.slice(-4)}`,
    // Placeholder username
    level: user.level,
    totalExp: user.totalExp,
    voiceTime: user.voiceTime.total,
    messages: user.messages.total
  })).sort((a, b) => b.level - a.level).slice(0, 10);
  return {
    totalMembers,
    onlineMembers,
    totalMessages,
    totalVoiceTime,
    activeUsers,
    topUsers
  };
};

// src/database-helper.ts
var DatabaseHelper = class {
  db;
  constructor(database) {
    this.db = database;
  }
  // Get all users from database
  getUsers() {
    return this.db.users;
  }
  // Get specific user data
  getUser(userId) {
    return this.db.users[userId] || null;
  }
  // Get total member count (you'll need to provide this from Discord API)
  getTotalMembers() {
    return Object.keys(this.db.users).length;
  }
  // Get online member count (you'll need to provide this from Discord API)
  getOnlineMembers() {
    return Math.floor(Object.keys(this.db.users).length * 0.3);
  }
  // Calculate total messages across all users
  getTotalMessages() {
    return Object.values(this.db.users).reduce((sum, user) => sum + user.messages.total, 0);
  }
  // Calculate total voice time across all users
  getTotalVoiceTime() {
    return Object.values(this.db.users).reduce((sum, user) => sum + user.voiceTime.total, 0);
  }
  // Get active users (last 24 hours)
  getActiveUsers() {
    const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1e3);
    return Object.values(this.db.users).filter(
      (user) => new Date(user.lastActive) > dayAgo
    ).length;
  }
  // Get top users by level
  getTopUsersByLevel(limit = 10) {
    return Object.entries(this.db.users).map(([userId, user]) => ({
      userId,
      username: `User${userId.slice(-4)}`,
      // Placeholder - you should get real usernames
      level: user.level,
      totalExp: user.totalExp,
      voiceTime: user.voiceTime.total,
      messages: user.messages.total
    })).sort((a, b) => b.level - a.level).slice(0, limit);
  }
  // Get top users by voice time
  getTopUsersByVoiceTime(limit = 10) {
    return Object.entries(this.db.users).map(([userId, user]) => ({
      userId,
      username: `User${userId.slice(-4)}`,
      // Placeholder - you should get real usernames
      level: user.level,
      totalExp: user.totalExp,
      voiceTime: user.voiceTime.total,
      messages: user.messages.total
    })).sort((a, b) => b.voiceTime - a.voiceTime).slice(0, limit);
  }
  // Get top users by messages
  getTopUsersByMessages(limit = 10) {
    return Object.entries(this.db.users).map(([userId, user]) => ({
      userId,
      username: `User${userId.slice(-4)}`,
      // Placeholder - you should get real usernames
      level: user.level,
      totalExp: user.totalExp,
      voiceTime: user.voiceTime.total,
      messages: user.messages.total
    })).sort((a, b) => b.messages - a.messages).slice(0, limit);
  }
  // Get guild statistics
  getGuildStats(totalMembers, onlineMembers) {
    const users = this.getUsers();
    const totalMembersCount = totalMembers || this.getTotalMembers();
    const onlineMembersCount = onlineMembers || this.getOnlineMembers();
    const totalMessages = this.getTotalMessages();
    const totalVoiceTime = this.getTotalVoiceTime();
    const activeUsers = this.getActiveUsers();
    const topUsers = this.getTopUsersByLevel(10);
    return {
      totalMembers: totalMembersCount,
      onlineMembers: onlineMembersCount,
      totalMessages,
      totalVoiceTime,
      activeUsers,
      topUsers
    };
  }
  // Get user statistics for a specific user
  getUserStats(userId) {
    const user = this.getUser(userId);
    if (!user) return null;
    const expForCurrentLevel = (user.level - 1) * 100;
    const expForNextLevel = user.level * 100;
    const levelProgress = (user.totalExp - expForCurrentLevel) / (expForNextLevel - expForCurrentLevel) * 100;
    return {
      level: user.level,
      totalExp: user.totalExp,
      todayExp: user.todayExp,
      levelProgress: Math.min(100, Math.max(0, levelProgress)),
      voiceTime: user.voiceTime.total,
      messages: user.messages.total,
      activities: user.activities,
      lastActive: user.lastActive
    };
  }
  // Get voice statistics for different periods
  getVoiceStats(userId) {
    const user = this.getUser(userId);
    if (!user) return null;
    const now = Date.now();
    const oneDayAgo = now - 24 * 60 * 60 * 1e3;
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1e3;
    const fourteenDaysAgo = now - 14 * 24 * 60 * 60 * 1e3;
    let voice1d = 0;
    let voice7d = 0;
    let voice14d = 0;
    user.voiceTime.sessions.forEach((session) => {
      if (session.leaveTime) {
        const sessionEnd = session.leaveTime;
        const sessionStart = session.joinTime;
        const duration = sessionEnd - sessionStart;
        if (sessionStart >= oneDayAgo) {
          voice1d += duration;
        }
        if (sessionStart >= sevenDaysAgo) {
          voice7d += duration;
        }
        if (sessionStart >= fourteenDaysAgo) {
          voice14d += duration;
        }
      }
    });
    return {
      "1d": Math.floor(voice1d / (1e3 * 60)),
      // Convert to minutes
      "7d": Math.floor(voice7d / (1e3 * 60)),
      "14d": Math.floor(voice14d / (1e3 * 60)),
      total: user.voiceTime.total
    };
  }
  // Get message statistics for different periods
  getMessageStats(userId) {
    const user = this.getUser(userId);
    if (!user) return null;
    const now = /* @__PURE__ */ new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1e3);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1e3);
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1e3);
    let messages1d = 0;
    let messages7d = 0;
    let messages14d = 0;
    Object.entries(user.messages.daily).forEach(([dateStr, count]) => {
      const date = new Date(dateStr);
      if (date >= oneDayAgo) {
        messages1d += count;
      }
      if (date >= sevenDaysAgo) {
        messages7d += count;
      }
      if (date >= fourteenDaysAgo) {
        messages14d += count;
      }
    });
    return {
      "1d": messages1d,
      "7d": messages7d,
      "14d": messages14d,
      total: user.messages.total
    };
  }
  // Get leaderboard data
  getLeaderboard(type, limit = 10) {
    switch (type) {
      case "level":
        return this.getTopUsersByLevel(limit);
      case "voice":
        return this.getTopUsersByVoiceTime(limit);
      case "messages":
        return this.getTopUsersByMessages(limit);
      default:
        return this.getTopUsersByLevel(limit);
    }
  }
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
function roundRect3(ctx, x, y, w, h, r) {
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
  const canvas = (0, import_canvas3.createCanvas)(width, height);
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;
  try {
    const fontPath = path3.join(__dirname, "..", "fonts", "pixel.ttf");
    if (!import_canvas3.GlobalFonts.has("PixelFont")) {
      import_canvas3.GlobalFonts.registerFromPath(fontPath, "PixelFont");
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
  roundRect3(ctx, cardX, cardY, cardWidth, cardHeight, 15).fill();
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
  roundRect3(ctx, thumbX, thumbY, thumbSize, thumbSize, 5).fill();
  ctx.shadowBlur = 0;
  ctx.save();
  roundRect3(ctx, thumbX, thumbY, thumbSize, thumbSize, 5).clip();
  try {
    const thumbnail = await (0, import_canvas3.loadImage)(options.thumbnailImage);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DatabaseHelper,
  GuildStatus,
  Pixel,
  PixelJapanese,
  createGuildStats
});
