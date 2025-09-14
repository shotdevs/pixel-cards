import { createCanvas, loadImage, GlobalFonts } from '@napi-rs/canvas';
import { promises as fs } from 'fs';
import * as path from 'path';

// --- BACKGROUND DRAWING FUNCTION (Slight color tweak) ---
const drawSynthwaveBackground = (ctx: any, width: number, height: number) => {
    const bgColor = '#0A021A'; 
    const frameGlowColor = '#007BFF'; // Updated to a more royal blue
    const innerPanelColor = 'rgba(13, 5, 43, 0.85)';
    const glitchColor1 = '#4D68F8';
    const glitchColor2 = '#F84DF0';
    const visualizerColor = '#E600E6';

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

// --- Main Pixel Function (Updated for new style) ---

export type PixelOption = {
    name: string; // Can now contain '\n' for multiline titles
    author: string;
    thumbnailImage: string;
    progress?: number;
    startTime?: string;
    endTime?: string;
    progressColor?: string; // Gradient start color
    progressGradientEndColor?: string; // NEW: Gradient end color
    progressBarColor?: string;
    nameColor?: string;
    authorColor?: string;
    timeColor?: string;
    imageDarkness?: number;
    paused?: boolean; // Paused is no longer used visually, but kept for API consistency
};

// Helper function to draw a rounded rectangle
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

export const Pixel = async (option: PixelOption): Promise<Buffer> => {
    // Set Defaults to match the new image style
    const options = {
        name: option.name,
        author: option.author,
        thumbnailImage: option.thumbnailImage,
        progress: option.progress ?? 10,
        startTime: option.startTime ?? '0:00',
        endTime: option.endTime ?? '0:00',
        progressColor: option.progressColor ?? '#00FFFF', // Cyan start of gradient
        progressGradientEndColor: option.progressGradientEndColor ?? '#FF00FF', // Magenta end of gradient
        progressBarColor: option.progressBarColor ?? '#29194A', // Dark purple for the bar background
        nameColor: option.nameColor ?? '#50FFFF', // Bright Cyan
        authorColor: option.authorColor ?? '#C89CFF', // Lavender
        timeColor: option.timeColor ?? '#50FFFF', // Bright Cyan
        imageDarkness: option.imageDarkness ?? 0.0,
        paused: option.paused ?? false,
    };

    options.progress = Math.max(0, Math.min(100, options.progress));

    const width = 800;
    const height = 280; // Increased height for better layout
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    
    ctx.imageSmoothingEnabled = false;

    // --- Font Registration ---
    try {
        const fontPath = path.join(__dirname, '..', 'fonts', 'pixel.ttf'); 
        if (!GlobalFonts.has('PixelFont')) {
            GlobalFonts.registerFromPath(fontPath, 'PixelFont');
        }
    } catch (e) {
        console.error("Font not found. Make sure 'pixel.ttf' is in the 'fonts' folder.");
        console.error(e);
    }

    // --- Draw the background ---
    drawSynthwaveBackground(ctx, width, height);
    
    // --- Draw Thumbnail ---
    const thumbSize = 200;
    const thumbX = 40;
    const thumbY = (height - thumbSize) / 2;
    
    ctx.save();
    roundRect(ctx, thumbX, thumbY, thumbSize, thumbSize, 10);
    ctx.clip();
    
    try {
        const thumbnail = await loadImage(options.thumbnailImage);
        ctx.drawImage(thumbnail, thumbX, thumbY, thumbSize, thumbSize);
    } catch (e) {
        ctx.fillStyle = '#333';
        ctx.fillRect(thumbX, thumbY, thumbSize, thumbSize);
        ctx.fillStyle = '#FFF';
        ctx.font = '30px "PixelFont"';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('?', thumbX + thumbSize / 2, thumbY + thumbSize / 2);
    }
    
    if (options.imageDarkness > 0) {
        ctx.fillStyle = `rgba(0, 0, 0, ${options.imageDarkness})`;
        ctx.fillRect(thumbX, thumbY, thumbSize, thumbSize);
    }
    ctx.restore();

    // --- Draw Text (with multiline support for name) ---
    const textX = thumbX + thumbSize + 30;
    const textAvailableWidth = width - textX - 50;
    
    // Draw Title (handles multiple lines)
    ctx.fillStyle = options.nameColor;
    ctx.font = '28px "PixelFont"';
    const nameLines = options.name.split('\n');
    let currentY = 80;
    const lineHeight = 35;
    nameLines.forEach(line => {
        ctx.fillText(line, textX, currentY, textAvailableWidth);
        currentY += lineHeight;
    });

    // Draw Author
    ctx.fillStyle = options.authorColor;
    ctx.font = '22px "PixelFont"';
    ctx.fillText(options.author, textX, currentY + 5, textAvailableWidth);

    // --- Draw Gradient Progress Bar ---
    const progressBarY = 200;
    const progressBarWidth = textAvailableWidth;
    const progressBarHeight = 8;

    // Draw the background of the progress bar
    ctx.fillStyle = options.progressBarColor;
    ctx.beginPath();
    roundRect(ctx, textX, progressBarY - progressBarHeight / 2, progressBarWidth, progressBarHeight, 4);
    ctx.fill();

    // Draw the gradient progress
    const progressWidth = (options.progress / 100) * progressBarWidth;
    if (progressWidth > 0) {
        // Create a horizontal gradient that spans the width of the progressed part
        const gradient = ctx.createLinearGradient(textX, 0, textX + progressWidth, 0);
        gradient.addColorStop(0, options.progressColor); // Start color
        gradient.addColorStop(1, options.progressGradientEndColor); // End color

        ctx.fillStyle = gradient;
        ctx.beginPath();
        roundRect(ctx, textX, progressBarY - progressBarHeight / 2, progressWidth, progressBarHeight, 4);
        ctx.fill();
    }
    
    // --- Draw Times ---
    ctx.fillStyle = options.timeColor;
    ctx.font = '20px "PixelFont"';
    const timeY = progressBarY + 35;
    ctx.textAlign = 'left';
    ctx.fillText(options.startTime, textX, timeY);
    ctx.textAlign = 'right';
    ctx.fillText(options.endTime, textX + progressBarWidth, timeY);

    return canvas.toBuffer('image/png');
};