import { createCanvas, loadImage, GlobalFonts } from '@napi-rs/canvas';
import { promises as fs } from 'fs';
import * as path from 'path';

// --- THEME-SPECIFIC COLOR PALETTE ---
const PALETTE = {
    BACKGROUND_PRIMARY: '#fde2e4',
    BACKGROUND_SECONDARY: '#fff1f2',
    SAKURA_PINK_LIGHT: '#ffc2d1',
    SAKURA_PINK_DARK: '#ffb3c1',
    TEXT_PRIMARY: '#8c5e58',
    TEXT_SECONDARY: '#a68080',
    PROGRESS_BAR: '#ff8fab',
    PROGRESS_BAR_BACKGROUND: '#fce4e4',
    DEVICE_SHADOW: 'rgba(0, 0, 0, 0.1)',
    ALBUM_ART_SHADOW: '#ffb3c1',
};

// --- NEW "SAKURA" BACKGROUND FUNCTION ---
const drawSakuraBackground = (ctx: any, width: number, height: number) => {
    // 1. Create a soft gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, PALETTE.BACKGROUND_PRIMARY);
    gradient.addColorStop(1, PALETTE.BACKGROUND_SECONDARY);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // 2. Draw falling sakura petals
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
};

export const PixelJapanese = async (option: PixelOption): Promise<Buffer> => {
    const options = {
        name: option.name,
        author: option.author,
        thumbnailImage: option.thumbnailImage,
        progress: option.progress ?? 10,
        startTime: option.startTime ?? '0:00',
        endTime: option.endTime ?? '0:00',
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
    drawSakuraBackground(ctx, width, height);

    // 2. Define Card Dimensions
    const cardWidth = 850;
    const cardHeight = 380;
    const cardX = (width - cardWidth) / 2;
    const cardY = (height - cardHeight) / 2;
    const padding = 35;

    // 3. Draw the Device Body with Shadow
    ctx.shadowColor = PALETTE.DEVICE_SHADOW;
    ctx.shadowBlur = 20;
    ctx.shadowOffsetY = 5;
    ctx.fillStyle = PALETTE.BACKGROUND_SECONDARY;
    roundRect(ctx, cardX, cardY, cardWidth, cardHeight, 20).fill();
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;

    // 4. Draw the glowing "Screen" for the album art
    const thumbSize = 200;
    const thumbX = cardX + padding;
    const thumbY = cardY + padding;
    ctx.shadowColor = PALETTE.ALBUM_ART_SHADOW;
    ctx.shadowBlur = 15;
    ctx.fillStyle = '#fff';
    roundRect(ctx, thumbX, thumbY, thumbSize, thumbSize, 10).fill();
    ctx.shadowBlur = 0;
    
    // 5. Clip and Draw Album Art
    ctx.save();
    roundRect(ctx, thumbX, thumbY, thumbSize, thumbSize, 10).clip();
    try {
        const thumbnail = await loadImage(options.thumbnailImage);
        ctx.imageSmoothingEnabled = true; // Enable smoothing for the image
        ctx.drawImage(thumbnail, thumbX, thumbY, thumbSize, thumbSize);
        ctx.imageSmoothingEnabled = false; // Disable for text
    } catch (e) { /* Error handling */ }
    ctx.restore();

    // 6. Draw Text Content
    const textX = thumbX + thumbSize + padding;
    const textWidth = cardWidth - thumbSize - padding * 3;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    // Title
    ctx.font = '52px "PixelFont"';
    ctx.fillStyle = PALETTE.TEXT_PRIMARY;
    ctx.fillText(options.name, textX, thumbY + 25, textWidth);

    // Artist
    ctx.font = '32px "PixelFont"';
    ctx.fillStyle = PALETTE.TEXT_SECONDARY;
    ctx.fillText(options.author, textX, thumbY + 95, textWidth);

    // 7. Draw Custom Progress Bar
    const progressY = thumbY + 160;
    const progressBarHeight = 10;
    const progressBarWidth = textWidth;
    
    // Background
    ctx.fillStyle = PALETTE.PROGRESS_BAR_BACKGROUND;
    roundRect(ctx, textX, progressY, progressBarWidth, progressBarHeight, 5).fill();
    
    // Progress
    const progressWidth = (options.progress / 100) * progressBarWidth;
    ctx.fillStyle = PALETTE.PROGRESS_BAR;
    roundRect(ctx, textX, progressY, progressWidth, progressBarHeight, 5).fill();

    // 8. Draw Timestamps
    ctx.fillStyle = PALETTE.TEXT_SECONDARY;
    ctx.font = '24px "PixelFont"';
    ctx.textBaseline = 'bottom';
    const timeY = cardY + cardHeight - padding;
    ctx.fillText(options.startTime, textX, timeY);

    ctx.textAlign = 'right';
    ctx.fillText(options.endTime, textX + textWidth, timeY);
    
    // 9. Draw Decorative Elements
    // Sakura petal near the title
    ctx.fillStyle = PALETTE.SAKURA_PINK_DARK;
    ctx.beginPath();
    ctx.ellipse(textX + textWidth - 20, thumbY + 40, 10, 5, Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();

    return canvas.toBuffer('image/png');
};
