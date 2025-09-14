import { createCanvas, loadImage, GlobalFonts } from '@napi-rs/canvas';
import { promises as fs } from 'fs';
import * as path from 'path';

// --- NEW "PIXEL MATRIX" BACKGROUND FUNCTION ---
const drawPixelMatrixBackground = (ctx: any, width: number, height: number) => {
    // --- Define Colors ---
    const bgColor = '#0D0D0D'; // Near-black
    const frameColor = '#00FF7F'; // Bright Spring Green
    const accentColor = '#00FFFF'; // Cyan
    const rainColor = 'rgba(0, 255, 127, 0.7)'; // Semi-transparent green for rain

    // --- Step 1: Solid Background ---
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);

    // --- Step 2: Generate "Digital Rain" ---
    const charSize = 8;
    const numColumns = Math.floor(width / charSize);
    for (let i = 0; i < numColumns; i++) {
        // Only draw rain in about 70% of columns for a sparser look
        if (Math.random() > 0.3) {
            const columnHeight = Math.random() * height * 0.8 + height * 0.2; // Variable height
            const startY = Math.random() * height - height; // Start some columns off-screen
            
            for (let j = 0; j < columnHeight; j += charSize + 2) {
                const alpha = 1 - (j / columnHeight); // Fade out towards the tail
                ctx.globalAlpha = alpha * 0.5; // Apply fading
                
                // Use rectangles to simulate pixel characters
                ctx.fillStyle = rainColor;
                ctx.fillRect(i * charSize, startY + j, charSize, charSize);
            }
        }
    }
    ctx.globalAlpha = 1.0; // Reset alpha

    // --- Step 3: Draw Sharp UI Frame & Corner Brackets ---
    const padding = 20;
    const cornerSize = 25;
    ctx.strokeStyle = frameColor;
    ctx.lineWidth = 2;
    
    // Main frame
    ctx.strokeRect(padding, padding, width - padding * 2, height - padding * 2);

    // Top-left corner
    ctx.beginPath();
    ctx.moveTo(padding, padding + cornerSize);
    ctx.lineTo(padding, padding);
    ctx.lineTo(padding + cornerSize, padding);
    ctx.stroke();

    // Top-right corner
    ctx.beginPath();
    ctx.moveTo(width - padding, padding + cornerSize);
    ctx.lineTo(width - padding, padding);
    ctx.lineTo(width - padding - cornerSize, padding);
    ctx.stroke();

    // Bottom-left corner
    ctx.beginPath();
    ctx.moveTo(padding, height - padding - cornerSize);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(padding + cornerSize, height - padding);
    ctx.stroke();
    
    // Bottom-right corner
    ctx.beginPath();
    ctx.moveTo(width - padding, height - padding - cornerSize);
    ctx.lineTo(width - padding, height - padding);
    ctx.lineTo(width - padding - cornerSize, height - padding);
    ctx.stroke();
};

// --- Main Pixel Function (Using New Pixel Matrix Theme) ---

export type PixelOption = {
    name: string;
    author: string;
    thumbnailImage: string;
    progress?: number;
    startTime?: string;
    endTime?: string;
    progressColor?: string; 
    progressGradientEndColor?: string;
    progressBarColor?: string;
    nameColor?: string;
    authorColor?: string;
    timeColor?: string;
};

// Helper function is not needed for sharp corners, but kept for potential future use.
function roundRect(ctx: any, x: number, y: number, w: number, h: number, r: number) { /* ... */ }

export const Pixel = async (option: PixelOption): Promise<Buffer> => {
    const options = {
        name: option.name,
        author: option.author,
        thumbnailImage: option.thumbnailImage,
        progress: option.progress ?? 10,
        startTime: option.startTime ?? '0:00',
        endTime: option.endTime ?? '0:00',
        progressColor: option.progressColor ?? '#00FFFF', // Cyan
        progressGradientEndColor: option.progressGradientEndColor ?? '#00FF7F', // Spring Green
        progressBarColor: option.progressBarColor ?? 'rgba(0, 255, 127, 0.2)', // Faded green
        nameColor: option.nameColor ?? '#FFFFFF',
        authorColor: option.authorColor ?? '#00FF7F', // Spring Green
        timeColor: option.timeColor ?? '#00FFFF', // Cyan
    };

    options.progress = Math.max(0, Math.min(100, options.progress));

    // New dimensions for a more substantial vertical card
    const width = 500;
    const height = 700;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    
    ctx.imageSmoothingEnabled = false;

    try {
        const fontPath = path.join(__dirname, '..', 'fonts', 'pixel.ttf'); 
        if (!GlobalFonts.has('PixelFont')) {
            GlobalFonts.registerFromPath(fontPath, 'PixelFont');
        }
    } catch (e) {
        console.error("Font not found. Make sure 'pixel.ttf' is in the 'fonts' folder.");
    }

    // --- Draw the new background ---
    drawPixelMatrixBackground(ctx, width, height);
    
    const centerX = width / 2;
    
    // --- Draw Centered Thumbnail with Border ---
    const thumbSize = 300;
    const thumbX = (width - thumbSize) / 2;
    const thumbY = 80;
    
    try {
        const thumbnail = await loadImage(options.thumbnailImage);
        ctx.drawImage(thumbnail, thumbX, thumbY, thumbSize, thumbSize);
    } catch (e) {
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(thumbX, thumbY, thumbSize, thumbSize);
        ctx.fillStyle = '#FFF';
        ctx.font = '40px "PixelFont"';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('?', centerX, thumbY + thumbSize / 2);
    }
    // Add a border to the thumbnail
    ctx.strokeStyle = options.authorColor;
    ctx.lineWidth = 2;
    ctx.strokeRect(thumbX, thumbY, thumbSize, thumbSize);


    // --- Draw Centered Text with Shadow for Readability ---
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 6;
    
    // Song Name
    ctx.fillStyle = options.nameColor;
    ctx.font = '36px "PixelFont"';
    ctx.fillText(options.name, centerX, thumbY + thumbSize + 70, width - 100);

    // Artist Name
    ctx.fillStyle = options.authorColor;
    ctx.font = '26px "PixelFont"';
    ctx.fillText(options.author, centerX, thumbY + thumbSize + 115, width - 100);

    // Reset shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0)';
    ctx.shadowBlur = 0;
    
    // --- Draw Progress Bar at the Bottom ---
    const progressBarWidth = width - 120;
    const progressBarX = (width - progressBarWidth) / 2;
    const progressBarY = height - 120;
    const progressBarHeight = 10;

    // Background of the progress bar
    ctx.fillStyle = options.progressBarColor;
    ctx.fillRect(progressBarX, progressBarY - progressBarHeight / 2, progressBarWidth, progressBarHeight);

    // Gradient progress
    const progressWidth = (options.progress / 100) * progressBarWidth;
    if (progressWidth > 0) {
        const gradient = ctx.createLinearGradient(progressBarX, 0, progressBarX + progressBarWidth, 0);
        gradient.addColorStop(0, options.progressColor);
        gradient.addColorStop(1, options.progressGradientEndColor);
        ctx.fillStyle = gradient;
        ctx.fillRect(progressBarX, progressBarY - progressBarHeight / 2, progressWidth, progressBarHeight);
    }
    
    // --- Draw Times ---
    ctx.fillStyle = options.timeColor;
    ctx.font = '20px "PixelFont"';
    const timeY = progressBarY + 35;
    
    ctx.textAlign = 'left';
    ctx.fillText(options.startTime, progressBarX, timeY);
    
    ctx.textAlign = 'right';
    ctx.fillText(options.endTime, progressBarX + progressBarWidth, timeY);

    return canvas.toBuffer('image/png');
};