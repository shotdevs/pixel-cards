import { createCanvas, loadImage, GlobalFonts } from '@napi-rs/canvas';
import { promises as fs } from 'fs';
import * as path from 'path';

// --- THEME-SPECIFIC COLOR PALETTE ---
const PALETTE = {
    BACKGROUND_DARK: '#0b021d',
    BACKGROUND_LIGHT: '#1f0a3b',
    NEBULA_GLOW: '#4f2a8c',
    STARS: 'rgba(255, 255, 255, 0.7)',

    DEVICE_DARK: '#1f133d',
    DEVICE_LIGHT: '#2d1e52',
    DEVICE_OUTLINE_GLOW: '#ff00e0',

    SCREEN_GLOW: '#00d9e1',
    TITLE: '#ffffff',
    ARTIST: '#00d9e1',
    TIME: 'rgba(255, 255, 255, 0.7)',

    PROGRESS_ACTIVE: '#22ff8a',
    PROGRESS_BG: 'rgba(0, 0, 0, 0.25)',
};

// --- NEW "COSMIC" BACKGROUND FUNCTION ---
const drawCosmicBackground = (ctx: any, width: number, height: number) => {
    // 1. Create a deep space radial gradient
    const gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width * 0.7);
    gradient.addColorStop(0, PALETTE.BACKGROUND_LIGHT);
    gradient.addColorStop(1, PALETTE.BACKGROUND_DARK);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // 2. Add a soft nebula cloud
    ctx.filter = 'blur(60px)';
    ctx.fillStyle = PALETTE.NEBULA_GLOW;
    ctx.beginPath();
    ctx.arc(width * 0.25, height * 0.3, width * 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(width * 0.75, height * 0.6, width * 0.25, 0, Math.PI * 2);
    ctx.fill();
    ctx.filter = 'none';

    // 3. Draw stars
    ctx.fillStyle = PALETTE.STARS;
    for (let i = 0; i < 200; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const r = Math.random() * 1.5;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
    }
};

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

export type PixelOption = {
    name: string;
    author: string;
    thumbnailImage: string;
    progress?: number;
    startTime?: string;
    endTime?: string;
    backgroundColor?: string;
    backgroundImage?: string;
    progressColor?: string;
    progressBarColor?: string;
    titleColor?: string;
    artistColor?: string;
    timeColor?: string;
};


export const Pixel = async (option: PixelOption): Promise<Buffer> => {
    const options = {
        name: option.name,
        author: option.author,
        thumbnailImage: option.thumbnailImage,
        progress: option.progress ?? 10,
        startTime: option.startTime ?? '0:00',
        endTime: option.endTime ?? '0:00',
        backgroundColor: option.backgroundColor,
        backgroundImage: option.backgroundImage,
        progressColor: option.progressColor ?? PALETTE.PROGRESS_ACTIVE,
        progressBarColor: option.progressBarColor ?? PALETTE.PROGRESS_BG,
        titleColor: option.titleColor ?? PALETTE.TITLE,
        artistColor: option.artistColor ?? PALETTE.ARTIST,
        timeColor: option.timeColor ?? PALETTE.TIME,
    };
    options.progress = Math.max(0, Math.min(100, options.progress));

    const width = 1200;
    const height = 675;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    
    // Disable anti-aliasing for that crisp pixel font look
    ctx.imageSmoothingEnabled = false;

    try {
        const fontPath = path.join(__dirname, '..', 'fonts', 'pixel.ttf'); 
        if (!GlobalFonts.has('PixelFont')) {
            GlobalFonts.registerFromPath(fontPath, 'PixelFont');
        }
    } catch (e) {
        console.error("Font not found. Make sure 'pixel.ttf' is in the 'fonts' folder.");
    }

    // --- DRAWING SEQUENCE ---

    // 1. Draw Background
    if (options.backgroundImage) {
        try {
            const bgImage = await loadImage(options.backgroundImage);
            ctx.drawImage(bgImage, 0, 0, width, height);
        } catch (e) {
            drawCosmicBackground(ctx, width, height);
        }
    } else if (options.backgroundColor) {
        ctx.fillStyle = options.backgroundColor;
        ctx.fillRect(0, 0, width, height);
    } else {
        drawCosmicBackground(ctx, width, height);
    }

    // 2. Define Card Dimensions
    const cardWidth = 1020;
    const cardHeight = 456;
    const cardX = (width - cardWidth) / 2;
    const cardY = (height - cardHeight) / 2;
    const padding = 35;

    // 3. Draw the Device Body with Gradient and Glow
    ctx.shadowColor = PALETTE.DEVICE_OUTLINE_GLOW;
    ctx.shadowBlur = 40;
    const deviceGradient = ctx.createLinearGradient(cardX, cardY, cardX, cardY + cardHeight);
    deviceGradient.addColorStop(0, PALETTE.DEVICE_LIGHT);
    deviceGradient.addColorStop(1, PALETTE.DEVICE_DARK);
    ctx.fillStyle = deviceGradient;
    roundRect(ctx, cardX, cardY, cardWidth, cardHeight, 15).fill();
    ctx.shadowBlur = 0; // Reset glow

    // 4. Draw Cassette Spool Holes
    const spoolRadius = 30;
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.beginPath();
    ctx.arc(cardX + cardWidth * 0.2, cardY + cardHeight - 75, spoolRadius, 0, Math.PI * 2);
    ctx.arc(cardX + cardWidth * 0.8, cardY + cardHeight - 75, spoolRadius, 0, Math.PI * 2);
    ctx.fill();

    // 5. Draw the glowing "Screen" for the album art
    const thumbSize = 200;
    const thumbX = cardX + padding;
    const thumbY = cardY + padding;
    ctx.shadowColor = PALETTE.SCREEN_GLOW;
    ctx.shadowBlur = 25;
    ctx.fillStyle = '#000';
    roundRect(ctx, thumbX, thumbY, thumbSize, thumbSize, 5).fill();
    ctx.shadowBlur = 0;
    
    // 6. Clip and Draw Album Art
    ctx.save();
    roundRect(ctx, thumbX, thumbY, thumbSize, thumbSize, 5).clip();
    try {
        const thumbnail = await loadImage(options.thumbnailImage);
        ctx.imageSmoothingEnabled = true; // Enable smoothing for the image
        ctx.drawImage(thumbnail, thumbX, thumbY, thumbSize, thumbSize);
        ctx.imageSmoothingEnabled = false; // Disable for text
    } catch (e) { /* Error handling */ }
    ctx.restore();

    // 7. Draw Text Content
    const textX = thumbX + thumbSize + padding;
    const textWidth = cardWidth - thumbSize - padding * 2.5;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    // Title with drop shadow effect
    ctx.font = '52px "PixelFont"';
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillText(options.name, textX + 2, thumbY + 25 + 2, textWidth); // Shadow
    ctx.fillStyle = options.titleColor;
    ctx.fillText(options.name, textX, thumbY + 25, textWidth); // Main Text

    // Artist
    ctx.font = '32px "PixelFont"';
    ctx.fillStyle = options.artistColor;
    ctx.fillText(options.author, textX, thumbY + 95, textWidth);

    // 8. Draw Segmented Progress Bar
    const progressY = thumbY + 160;
    const segmentWidth = 12;
    const segmentGap = 4;
    const numSegments = Math.floor(textWidth / (segmentWidth + segmentGap));
    const activeSegments = Math.round((options.progress / 100) * numSegments);

    for (let i = 0; i < numSegments; i++) {
        const segX = textX + i * (segmentWidth + segmentGap);
        // Draw background segment
        ctx.fillStyle = options.progressBarColor;
        ctx.fillRect(segX, progressY, segmentWidth, 24);
        // Draw active segment
        if (i < activeSegments) {
            ctx.fillStyle = options.progressColor;
            ctx.shadowColor = options.progressColor;
            ctx.shadowBlur = 10;
            ctx.fillRect(segX, progressY, segmentWidth, 24);
            ctx.shadowBlur = 0;
        }
    }
    
    // 9. Draw Timestamps
    ctx.fillStyle = options.timeColor;
    ctx.font = '24px "PixelFont"';
    ctx.textBaseline = 'bottom';
    const timeY = cardY + cardHeight - padding;
    ctx.fillText(options.startTime, textX, timeY);

    ctx.textAlign = 'right';
    ctx.fillText(options.endTime, textX + textWidth, timeY);
    
    // 10. Draw Decorative Details
    // Speaker Grille
    ctx.strokeStyle = 'rgba(0,0,0,0.2)';
    ctx.lineWidth = 2;
    for(let i = 0; i < 15; i++) {
        const lineY = cardY + padding + i * 5;
        ctx.beginPath();
        ctx.moveTo(cardX + cardWidth - padding - 60, lineY);
        ctx.lineTo(cardX + cardWidth - padding, lineY);
        ctx.stroke();
    }
    // Model Number
    ctx.textAlign = 'left';
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.font = '18px "PixelFont"';
    ctx.fillText('M-86', cardX + padding, timeY);

    // 11. Watermark
    ctx.textAlign = 'right';
    ctx.textBaseline = 'bottom';
    ctx.font = '22px "PixelFont"';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.fillText('by pixel music', width - padding, height - padding + 15);

    return canvas.toBuffer('image/png');
};
export * from './pixel-japanese';
export * from './guild-status';
export * from './database-helper';
export * from './user-card';
export * from './welcome-card';