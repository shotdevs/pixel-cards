import { createCanvas, loadImage, GlobalFonts } from '@napi-rs/canvas';
import { promises as fs } from 'fs';
import * as path from 'path';

// --- NEW HELPER FUNCTION TO DRAW THE BACKGROUND ---
/**
 * Draws the dynamic, stylized background onto the canvas context.
 * @param {CanvasRenderingContext2D} ctx The canvas context to draw on.
 * @param {number} width The width of the canvas.
 * @param {number} height The height of the canvas.
 */
const drawDynamicBackground = (ctx: any, width: number, height: number) => {
    // --- Step 1: Draw the dark outer background ---
    ctx.fillStyle = '#120b26'; // Very dark purple
    ctx.fillRect(0, 0, width, height);

    // --- Step 2: Draw the faint decorative elements ---
    const decorColor = '#2a1a3e'; // Muted purple for shapes and lines
    ctx.strokeStyle = decorColor;
    ctx.fillStyle = decorColor;
    ctx.lineWidth = 2;

    // Decorative lines (top-left and bottom-right)
    ctx.beginPath();
    ctx.moveTo(20, 50);
    ctx.lineTo(90, 10);
    ctx.moveTo(40, 65);
    ctx.lineTo(100, 25);
    ctx.moveTo(width - 20, height - 50);
    ctx.lineTo(width - 90, height - 10);
    ctx.stroke();
    
    // Decorative shapes (squares and triangles)
    ctx.fillRect(width - 50, 20, 10, 10); // Top-right square
    ctx.fillRect(15, height - 30, 8, 8); // Bottom-left square
    
    // Top-left triangle
    ctx.beginPath();
    ctx.moveTo(110, 15);
    ctx.lineTo(125, 35);
    ctx.lineTo(100, 40);
    ctx.closePath();
    ctx.fill();

    // --- Step 3: Draw the main rounded panel with a gradient ---
    const panelX = 10;
    const panelY = 10;
    const panelWidth = width - 20;
    const panelHeight = height - 20;
    const panelRadius = 15;

    // Create a vertical gradient for the panel
    const gradient = ctx.createLinearGradient(panelX, panelY, panelX, panelY + panelHeight);
    gradient.addColorStop(0, '#3f2b44'); // Darker purple at the top
    gradient.addColorStop(1, '#a978ff'); // Lighter lavender at the bottom
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.roundRect(panelX, panelY, panelWidth, panelHeight, panelRadius);
    ctx.fill();

    // --- Step 4: Draw the pixelated "skyline" at the bottom ---
    ctx.save(); // Save context state before clipping
    
    // Create a clipping path from the rounded rectangle so pixels don't spill out
    ctx.beginPath();
    ctx.roundRect(panelX, panelY, panelWidth, panelHeight, panelRadius);
    ctx.clip();
    
    const pixelSize = 5;
    const skylineBaseY = panelY + panelHeight;
    const maxPixelHeight = 45;

    // Loop across the width of the panel to draw pixel columns
    for (let x = panelX; x < panelX + panelWidth; x += pixelSize) {
        const pixelHeight = Math.random() * maxPixelHeight;
        // Use a brighter color for the pixels to make them pop
        ctx.fillStyle = '#c5a3ff'; 
        ctx.fillRect(x, skylineBaseY - pixelHeight, pixelSize, pixelHeight);
    }

    ctx.restore(); // Restore context to remove the clipping path
};


// --- Main Pixel Function (Updated) ---

export type PixelOption = {
    name: string;
    author: string;
    thumbnailImage: string;
    progress?: number;
    startTime?: string;
    endTime?: string;
    progressColor?: string;
    progressBarColor?: string;
    nameColor?: string;
    authorColor?: string;
    timeColor?: string;
    imageDarkness?: number;
    paused?: boolean;
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
    // Set Defaults (removed backgroundColor and backgroundImage as they are no longer used)
    const options = {
        name: option.name,
        author: option.author,
        thumbnailImage: option.thumbnailImage,
        progress: option.progress ?? 10,
        startTime: option.startTime ?? '0:00',
        endTime: option.endTime ?? '0:00',
        progressColor: option.progressColor ?? '#FFFFFF',
        progressBarColor: option.progressBarColor ?? '#6A3C8B',
        nameColor: option.nameColor ?? '#FFFFFF',
        authorColor: option.authorColor ?? '#b3b3b3',
        timeColor: option.timeColor ?? '#b3b3b3',
        imageDarkness: option.imageDarkness ?? 0.4,
        paused: option.paused ?? false,
    };

    options.progress = Math.max(0, Math.min(100, options.progress));

    const width = 450;
    const height = 150;
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

    // --- Draw Background ---
    // THIS IS THE ONLY PART THAT CHANGED IN THIS FUNCTION
    drawDynamicBackground(ctx, width, height);
    
    // --- Draw Thumbnail (this is now drawn on TOP of the new background) ---
    const thumbSize = 120;
    const thumbX = 25; // Adjusted to fit nicely inside the new panel
    const thumbY = 15;
    
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
        ctx.font = '20px "PixelFont"';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('?', thumbX + thumbSize / 2, thumbY + thumbSize / 2);
    }
    
    ctx.fillStyle = `rgba(0, 0, 0, ${options.imageDarkness})`;
    ctx.fillRect(thumbX, thumbY, thumbSize, thumbSize);
    ctx.restore();

    // --- Draw Text ---
    const textX = thumbX + thumbSize + 20;
    
    ctx.fillStyle = options.nameColor;
    ctx.font = '16px "PixelFont"';
    ctx.fillText(options.name, textX, 45, 260); // Adjusted Y and width
    
    ctx.fillStyle = options.authorColor;
    ctx.font = '14px "PixelFont"';
    ctx.fillText(options.author, textX, 70, 260); // Adjusted Y and width

    // --- Draw Progress Bar ---
    const progressBarY = 105; // Adjusted Y
    const progressBarWidth = 265;
    const progressBarHeight = 6;
    const progressHandleRadius = 6;

    ctx.fillStyle = options.progressBarColor;
    ctx.beginPath();
    ctx.roundRect(textX, progressBarY - progressBarHeight / 2, progressBarWidth, progressBarHeight, 3);
    ctx.fill();

    const progressWidth = (options.progress / 100) * progressBarWidth;
    ctx.fillStyle = options.progressColor;
    ctx.beginPath();
    ctx.roundRect(textX, progressBarY - progressBarHeight / 2, progressWidth, progressBarHeight, 3);
    ctx.fill();

    if (!options.paused) {
      ctx.beginPath();
      ctx.arc(textX + progressWidth, progressBarY, progressHandleRadius, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // --- Draw Times ---
    ctx.fillStyle = options.timeColor;
    ctx.font = '12px "PixelFont"';
    ctx.fillText(options.startTime, textX, 130); // Adjusted Y
    ctx.textAlign = 'right';
    ctx.fillText(options.endTime, textX + progressBarWidth, 130); // Adjusted Y

    return canvas.toBuffer('image/png');
};