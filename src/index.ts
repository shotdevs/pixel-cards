import { createCanvas, loadImage, GlobalFonts } from '@napi-rs/canvas';
import { promises as fs } from 'fs';
import * as path from 'path';

// --- NEW HELPER FUNCTION TO DRAW THE SYNTHWAVE/PIXEL BACKGROUND ---
/**
 * Draws the new synthwave-style background based on the provided image.
 * @param {CanvasRenderingContext2D} ctx The canvas context to draw on.
 * @param {number} width The width of the canvas.
 * @param {number} height The height of the canvas.
 */
const drawSynthwaveBackground = (ctx: any, width: number, height: number) => {
    // --- Define Colors from the Target Image ---
    const bgColor = '#0A021A'; // Very dark blue/purple
    const frameGlowColor = '#00BFFF'; // Bright cyan/blue for the glow
    const innerPanelColor = 'rgba(13, 5, 43, 0.85)'; // Dark, semi-transparent inner panel
    const glitchColor1 = '#4D68F8'; // Blue for glitch pixels
    const glitchColor2 = '#F84DF0'; // Magenta for glitch pixels
    const visualizerColor = '#E600E6'; // Bright magenta for visualizer

    // --- Step 1: Draw the solid dark background ---
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);

    // --- Step 2: Draw scattered "glitch" pixels around the frame ---
    const pixelCount = 50;
    const pixelSize = 3;
    for (let i = 0; i < pixelCount; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        ctx.fillStyle = Math.random() > 0.4 ? glitchColor1 : glitchColor2;
        ctx.fillRect(x, y, pixelSize, pixelSize);
    }

    // --- Step 3: Draw the main glowing outer frame ---
    const panelX = 20;
    const panelY = 10;
    const panelWidth = width - 40;
    const panelHeight = height - 20;
    const panelRadius = 15;

    // Use shadow to create the glow effect
    ctx.save();
    ctx.shadowColor = frameGlowColor;
    ctx.shadowBlur = 15;
    
    // Draw the rounded rectangle path for the border
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

    // Stroke the path to create the border
    ctx.strokeStyle = frameGlowColor;
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.restore(); // Restore to remove shadow effect for subsequent drawings

    // --- Step 4: Draw the inner content panel ---
    const padding = 4; // Padding between the outer frame and inner panel
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

    // --- Step 5: Draw the "visualizer" on the right side ---
    const visualizerX = innerX + innerWidth - 25;
    const visualizerBaseY = innerY + innerHeight - 20;
    const barWidth = 4;

    for (let i = 0; i < 4; i++) {
        const barHeight = Math.random() * 40 + 10; // Random height between 10 and 50
        ctx.fillStyle = visualizerColor;
        ctx.fillRect(visualizerX + i * (barWidth + 2), visualizerBaseY - barHeight, barWidth, barHeight);
    }
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
    // Set Defaults
    const options = {
        name: option.name,
        author: option.author,
        thumbnailImage: option.thumbnailImage,
        progress: option.progress ?? 10,
        startTime: option.startTime ?? '0:00',
        endTime: option.endTime ?? '0:00',
        progressColor: option.progressColor ?? '#00BFFF', // Changed to match the blue glow
        progressBarColor: option.progressBarColor ?? '#2C1D68', // Darker blue for the bar background
        nameColor: option.nameColor ?? '#FFFFFF',
        authorColor: option.authorColor ?? '#b3b3b3',
        timeColor: option.timeColor ?? '#b3b3b3',
        imageDarkness: option.imageDarkness ?? 0.0, // Reduced darkness to show more of the image
        paused: option.paused ?? false,
    };

    options.progress = Math.max(0, Math.min(100, options.progress));

    const width = 800;
    const height = 250;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    
    // Disabling smoothing to keep the pixelated font sharp
    ctx.imageSmoothingEnabled = false;

    // --- Font Registration ---
    try {
        // Assuming your font file is named 'pixel.ttf' and located in a 'fonts' directory
        // relative to the compiled JS output.
        const fontPath = path.join(__dirname, '..', 'fonts', 'pixel.ttf'); 
        if (!GlobalFonts.has('PixelFont')) {
            GlobalFonts.registerFromPath(fontPath, 'PixelFont');
        }
    } catch (e) {
        console.error("Font not found. Make sure 'pixel.ttf' is in the 'fonts' folder.");
        console.error(e);
    }

    // --- Draw the new background ---
    drawSynthwaveBackground(ctx, width, height);
    
    // --- Draw Thumbnail (Coordinates adjusted for new background) ---
    const thumbSize = 180; // Larger thumbnail
    const thumbX = 50; // Adjusted X position
    const thumbY = (height - thumbSize) / 2; // Center vertically
    
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

    // --- Draw Text (Coordinates adjusted for new background) ---
    const textX = thumbX + thumbSize + 30; // More space after thumbnail
    const textAvailableWidth = width - textX - 50;
    
    ctx.fillStyle = options.nameColor;
    ctx.font = '30px "PixelFont"'; // Larger font
    ctx.fillText(options.name, textX, 80, textAvailableWidth);
    
    ctx.fillStyle = options.authorColor;
    ctx.font = '24px "PixelFont"'; // Larger font
    ctx.fillText(options.author, textX, 125, textAvailableWidth);

    // --- Draw Progress Bar (Coordinates adjusted for new background) ---
    const progressBarY = 175; // Adjusted Y position
    const progressBarWidth = textAvailableWidth;
    const progressBarHeight = 8;
    const progressHandleRadius = 8;

    ctx.fillStyle = options.progressBarColor;
    ctx.beginPath();
    roundRect(ctx, textX, progressBarY - progressBarHeight / 2, progressBarWidth, progressBarHeight, 4);
    ctx.fill();

    const progressWidth = (options.progress / 100) * progressBarWidth;
    if (progressWidth > 0) {
        ctx.fillStyle = options.progressColor;
        ctx.beginPath();
        roundRect(ctx, textX, progressBarY - progressBarHeight / 2, progressWidth, progressBarHeight, 4);
        ctx.fill();
    }

    if (!options.paused) {
      // The handle should not go beyond the bounds of the progress bar
      const handleX = Math.max(textX + progressHandleRadius, Math.min(textX + progressWidth, textX + progressBarWidth - progressHandleRadius));
      ctx.beginPath();
      ctx.arc(handleX, progressBarY, progressHandleRadius, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // --- Draw Times (Coordinates adjusted for new background) ---
    ctx.fillStyle = options.timeColor;
    ctx.font = '20px "PixelFont"'; // Larger font
    const timeY = progressBarY + 35;
    ctx.textAlign = 'left';
    ctx.fillText(options.startTime, textX, timeY);
    ctx.textAlign = 'right';
    ctx.fillText(options.endTime, textX + progressBarWidth, timeY);

    return canvas.toBuffer('image/png');
};