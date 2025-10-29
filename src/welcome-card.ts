import { createCanvas, loadImage, GlobalFonts } from '@napi-rs/canvas';
import { promises as fs } from 'fs';
import * as path from 'path';

// --- WELCOME CARD THEME COLOR PALETTE ---
const WELCOME_PALETTE = {
    BACKGROUND_DARK: '#0a0a0a',
    BACKGROUND_MID: '#1a1a2e',
    TECH_LINE_DARK: '#ff2e63',
    TECH_LINE_LIGHT: '#ff6b9d',
    
    AVATAR_GLOW_PRIMARY: '#ff2e63',
    AVATAR_GLOW_SECONDARY: '#ff6b9d',
    AVATAR_RING_1: '#ff2e63',
    AVATAR_RING_2: '#ff4777',
    AVATAR_RING_3: '#ff6b9d',
    
    TEXT_PRIMARY: '#ffffff',
    TEXT_SECONDARY: '#ff6b9d',
    TEXT_ACCENT: '#ff2e63',
    TEXT_MUTED: '#8892b0',
    
    HUD_PRIMARY: '#ff2e63',
    HUD_SECONDARY: 'rgba(255, 46, 99, 0.3)',
    HUD_TERTIARY: 'rgba(255, 107, 157, 0.2)',
    
    PARTICLE: 'rgba(255, 46, 99, 0.6)',
};

export interface WelcomeCardOptions {
    username: string;
    avatar: string;
    guildName: string;
    memberCount: number;
    joinDate?: string;
    joinTime?: string;
    guildPosition?: number;
    discriminator?: string;
    backgroundColor?: string;
    backgroundImage?: string;
    primaryColor?: string;
    secondaryColor?: string;
    textColor?: string;
    borderColor?: string;
}

// Helper function for rounded rectangles
function roundRect(ctx: any, x: number, y: number, w: number, h: number, r: number) {
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

// Draw cyberpunk background with tech elements
const drawCyberpunkBackground = (ctx: any, width: number, height: number, bgColor?: string) => {
    // Base gradient
    const gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width * 0.8);
    const color1 = bgColor || WELCOME_PALETTE.BACKGROUND_MID;
    gradient.addColorStop(0, color1);
    gradient.addColorStop(1, WELCOME_PALETTE.BACKGROUND_DARK);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Add tech grid lines
    ctx.strokeStyle = WELCOME_PALETTE.HUD_TERTIARY;
    ctx.lineWidth = 1;
    
    // Horizontal lines
    for (let i = 0; i < height; i += 60) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(width, i);
        ctx.stroke();
    }
    
    // Vertical lines
    for (let i = 0; i < width; i += 80) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
        ctx.stroke();
    }
    
    // Add particles/stars
    ctx.fillStyle = WELCOME_PALETTE.PARTICLE;
    for (let i = 0; i < 100; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const size = Math.random() * 2;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
    }
};

// Draw tech HUD elements
const drawHUDElements = (ctx: any, width: number, height: number, primaryColor?: string) => {
    ctx.strokeStyle = primaryColor || WELCOME_PALETTE.TECH_LINE_DARK;
    ctx.lineWidth = 2;
    
    // Top-left corner
    ctx.beginPath();
    ctx.moveTo(40, 80);
    ctx.lineTo(40, 40);
    ctx.lineTo(120, 40);
    ctx.stroke();
    
    // Top-right corner
    ctx.beginPath();
    ctx.moveTo(width - 40, 80);
    ctx.lineTo(width - 40, 40);
    ctx.lineTo(width - 120, 40);
    ctx.stroke();
    
    // Bottom-left corner
    ctx.beginPath();
    ctx.moveTo(40, height - 80);
    ctx.lineTo(40, height - 40);
    ctx.lineTo(150, height - 40);
    ctx.stroke();
    
    // Bottom-right corner
    ctx.beginPath();
    ctx.moveTo(width - 40, height - 80);
    ctx.lineTo(width - 40, height - 40);
    ctx.lineTo(width - 150, height - 40);
    ctx.stroke();
    
    // Add decorative lines
    ctx.strokeStyle = WELCOME_PALETTE.HUD_SECONDARY;
    ctx.lineWidth = 1;
    
    // Left side decorative lines
    for (let i = 0; i < 5; i++) {
        const y = 100 + (i * 30);
        ctx.beginPath();
        ctx.moveTo(40, y);
        ctx.lineTo(100 + (i * 10), y);
        ctx.stroke();
    }
    
    // Right side decorative lines
    for (let i = 0; i < 5; i++) {
        const y = 100 + (i * 30);
        ctx.beginPath();
        ctx.moveTo(width - 40, y);
        ctx.lineTo(width - 100 - (i * 10), y);
        ctx.stroke();
    }
    
    // Small accent dots
    ctx.fillStyle = primaryColor || WELCOME_PALETTE.TECH_LINE_DARK;
    const dots = [
        { x: 40, y: 40 },
        { x: width - 40, y: 40 },
        { x: 40, y: height - 40 },
        { x: width - 40, y: height - 40 }
    ];
    
    dots.forEach(dot => {
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, 4, 0, Math.PI * 2);
        ctx.fill();
    });
};

// Draw glowing avatar with multiple rings
const drawGlowingAvatar = async (ctx: any, x: number, y: number, size: number, avatarUrl: string) => {
    const centerX = x + size / 2;
    const centerY = y + size / 2;
    const radius = size / 2;
    
    // Draw outer glowing rings
    const rings = [
        { offset: 40, color: WELCOME_PALETTE.AVATAR_RING_3, width: 3, blur: 15 },
        { offset: 30, color: WELCOME_PALETTE.AVATAR_RING_2, width: 4, blur: 20 },
        { offset: 20, color: WELCOME_PALETTE.AVATAR_RING_1, width: 5, blur: 25 }
    ];
    
    rings.forEach(ring => {
        ctx.save();
        ctx.strokeStyle = ring.color;
        ctx.lineWidth = ring.width;
        ctx.shadowColor = ring.color;
        ctx.shadowBlur = ring.blur;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius + ring.offset, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
    });
    
    // Draw main avatar circle with glow
    ctx.save();
    ctx.shadowColor = WELCOME_PALETTE.AVATAR_GLOW_PRIMARY;
    ctx.shadowBlur = 30;
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    
    // Clip and draw avatar image
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.clip();
    
    try {
        const avatar = await loadImage(avatarUrl);
        ctx.drawImage(avatar, x, y, size, size);
    } catch (e) {
        // Fallback to default avatar
        ctx.fillStyle = WELCOME_PALETTE.TEXT_MUTED;
        ctx.font = `${size * 0.5}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('👤', centerX, centerY);
    }
    
    ctx.restore();
    
    // Draw inner ring border
    ctx.save();
    ctx.strokeStyle = WELCOME_PALETTE.AVATAR_RING_1;
    ctx.lineWidth = 3;
    ctx.shadowColor = WELCOME_PALETTE.AVATAR_GLOW_PRIMARY;
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
};

// Draw info card/panel
const drawInfoPanel = (ctx: any, x: number, y: number, icon: string, label: string, value: string) => {
    // Icon
    ctx.fillStyle = WELCOME_PALETTE.TEXT_ACCENT;
    ctx.font = '24px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(icon, x, y);
    
    // Label and value
    ctx.fillStyle = WELCOME_PALETTE.TEXT_PRIMARY;
    ctx.font = 'bold 16px Arial';
    ctx.fillText(label, x + 35, y - 5);
    
    ctx.fillStyle = WELCOME_PALETTE.TEXT_SECONDARY;
    ctx.font = '14px Arial';
    ctx.fillText(value, x + 35, y + 15);
};

export interface NewWelcomeCardOptions {
    username: string;
    userPosition?: string;
    avatar: string;
    backgroundImage?: string;
    backgroundColor?: string;
}

export const NewWelcomeCard = async (options: NewWelcomeCardOptions): Promise<Buffer> => {
    const {
        username,
        userPosition = 'Member',
        avatar,
        backgroundImage,
        backgroundColor = '#1a1a2e'
    } = options;

    const width = 876;
    const height = 493;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    
    ctx.imageSmoothingEnabled = true;

    try {
        const fontPath = path.join(__dirname, '..', 'fonts', 'pixel.ttf');
        if (!GlobalFonts.has('PixelFont')) {
            GlobalFonts.registerFromPath(fontPath, 'PixelFont');
        }
    } catch (e) {
        console.warn("Pixel font not found, using default fonts");
    }

    if (backgroundImage) {
        try {
            const bgImage = await loadImage(backgroundImage);
            ctx.drawImage(bgImage, 0, 0, width, height);
        } catch (e) {
            ctx.fillStyle = backgroundColor;
            ctx.fillRect(0, 0, width, height);
        }
    } else {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, width, height);
    }

    const avatarSize = 180;
    const avatarX = (width - avatarSize) / 2;
    const avatarY = (height - avatarSize) / 2 - 40;

    ctx.save();
    ctx.beginPath();
    ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
    ctx.clip();
    
    try {
        const avatarImg = await loadImage(avatar);
        ctx.drawImage(avatarImg, avatarX, avatarY, avatarSize, avatarSize);
    } catch (e) {
        ctx.fillStyle = '#333';
        ctx.fill();
    }
    
    ctx.restore();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
    ctx.stroke();

    const infoY = avatarY + avatarSize + 20;
    const infoHeight = 100;
    const infoWidth = 400;
    const infoX = (width - infoWidth) / 2;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    roundRect(ctx, infoX, infoY, infoWidth, infoHeight, 15).fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(username, width / 2, infoY + 35);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '20px Arial';
    ctx.fillText(userPosition, width / 2, infoY + 70);

    return canvas.toBuffer('image/png');
};

export const WelcomeCard = async (options: WelcomeCardOptions): Promise<Buffer> => {
    const {
        username,
        avatar,
        guildName,
        memberCount,
        joinDate = new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }),
        joinTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
        guildPosition = memberCount,
        discriminator,
        backgroundColor,
        backgroundImage,
        primaryColor = WELCOME_PALETTE.TECH_LINE_DARK,
        secondaryColor = WELCOME_PALETTE.TEXT_SECONDARY,
        textColor = WELCOME_PALETTE.TEXT_PRIMARY,
        borderColor = WELCOME_PALETTE.TECH_LINE_DARK
    } = options;

    const width = 876;
    const height = 493;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    
    ctx.imageSmoothingEnabled = true;

    try {
        const fontPath = path.join(__dirname, '..', 'fonts', 'pixel.ttf');
        if (!GlobalFonts.has('PixelFont')) {
            GlobalFonts.registerFromPath(fontPath, 'PixelFont');
        }
    } catch (e) {
        console.warn("Pixel font not found, using default fonts");
    }

    if (backgroundImage) {
        try {
            const bgImage = await loadImage(backgroundImage);
            ctx.drawImage(bgImage, 0, 0, width, height);
        } catch (e) {
            drawCyberpunkBackground(ctx, width, height, backgroundColor);
        }
    } else {
        drawCyberpunkBackground(ctx, width, height, backgroundColor);
    }
    
    drawHUDElements(ctx, width, height, primaryColor);
    
    const cardWidth = 720;
    const cardHeight = 380;
    const cardX = (width - cardWidth) / 2;
    const cardY = (height - cardHeight) / 2;
    
    ctx.fillStyle = 'rgba(26, 26, 46, 0.7)';
    roundRect(ctx, cardX, cardY, cardWidth, cardHeight, 20).fill();
    
    ctx.save();
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 2;
    ctx.shadowColor = borderColor;
    ctx.shadowBlur = 15;
    roundRect(ctx, cardX, cardY, cardWidth, cardHeight, 20).stroke();
    ctx.restore();
    
    const avatarSize = 140;
    const avatarX = (width - avatarSize) / 2;
    const avatarY = cardY + 40;
    await drawGlowingAvatar(ctx, avatarX, avatarY, avatarSize, avatar);
    
    const textY = avatarY + avatarSize + 40;
    
    ctx.fillStyle = secondaryColor;
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('WELCOME', width / 2, textY);
    
    ctx.save();
    const displayName = discriminator ? `[${username}#${discriminator}]` : `[${username}]`;
    ctx.fillStyle = textColor;
    ctx.font = 'bold 42px Arial';
    ctx.shadowColor = secondaryColor;
    ctx.shadowBlur = 20;
    ctx.fillText(displayName, width / 2, textY + 45);
    ctx.restore();
    
    const infoPanelY = textY + 100;
    const panelSpacing = cardWidth / 2;
    const leftPanelX = cardX + 80;
    const rightPanelX = cardX + panelSpacing + 50;
    
    drawInfoPanel(ctx, leftPanelX, infoPanelY, '📅', `JOINED: ${joinDate}`, joinTime);
    
    drawInfoPanel(ctx, rightPanelX, infoPanelY, '🛡️', `GUILD POSITION:`, `#${guildPosition}`);
    
    ctx.fillStyle = textColor;
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`TOTAL MEMBERS: ${memberCount.toLocaleString()}`, width / 2, cardY + cardHeight - 30);
    
    return canvas.toBuffer('image/png');
};
