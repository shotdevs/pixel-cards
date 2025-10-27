import { createCanvas, loadImage, GlobalFonts } from '@napi-rs/canvas';
import { promises as fs } from 'fs';
import * as path from 'path';

// --- USER CARD THEME COLOR PALETTE ---
const USER_CARD_PALETTE = {
    BACKGROUND_DARK: '#2c2f33',
    BACKGROUND_LIGHT: '#36393f',
    CARD_BG: '#2c2f33',
    CARD_BORDER: '#40444b',
    
    PRIMARY: '#5865f2',      // Discord blurple
    SECONDARY: '#57f287',    // Discord green
    ACCENT: '#faa61a',       // Discord yellow
    DANGER: '#ed4245',       // Discord red
    
    TEXT_PRIMARY: '#ffffff',
    TEXT_SECONDARY: '#b9bbbe',
    TEXT_MUTED: '#72767d',
    
    ONLINE: '#57f287',
    IDLE: '#faa61a',
    DND: '#ed4245',
    OFFLINE: '#747f8d',
    
    PROGRESS_BG: '#40444b',
    PROGRESS_FILL: '#5865f2',
    
    PANEL_BG: '#36393f',
    PANEL_BORDER: '#40444b',
};

// User Card Data Types
export interface UserInfo {
    avatar: string;
    displayName: string;
    username: string;
    customStatus?: {
        emoji: string;
        text: string;
    };
}

export interface AccountDetail {
    label: string;
    value: string;
}

export interface ServerRank {
    category: string;
    rank: string;
}

export interface Statistic {
    period: string;
    value: string;
}

export interface RankedItem {
    rank: number;
    type: 'text-channel' | 'voice-channel' | 'application';
    icon: string;
    name: string | null;
    value: string;
}


export interface Panel {
    id: string;
    title: string;
    icon: string;
    type: 'list' | 'statistics' | 'rankedList';
    items?: (ServerRank | RankedItem)[];
    stats?: Statistic[];
}

export interface UserCardOptions {
    theme?: 'dark' | 'light';
    font?: 'sans-serif' | 'serif' | 'monospace';
    backgroundColor?: string;
    backgroundImage?: string;
    primaryColor?: string;
    secondaryColor?: string;
    accentColor?: string;
    textPrimaryColor?: string;
    textSecondaryColor?: string;
    container: {
        header: {
            userInfo: UserInfo;
            accountDetails: AccountDetail[];
        };
        body: {
            layout: 'grid' | 'list';
            panels: Panel[];
        };
        footer: {
            lookbackPeriod: string;
            timezone: string;
            attribution: {
                text: string;
                logo: string;
            };
        };
    };
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

// Draw gradient background
const drawGradientBackground = (ctx: any, width: number, height: number, backgroundColor: string, backgroundImage?: string) => {
    if (backgroundImage) {
        // Background image will be drawn in main function
        return;
    }
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, backgroundColor);
    gradient.addColorStop(1, USER_CARD_PALETTE.BACKGROUND_DARK);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
};

// Draw user avatar with fallback
const drawUserAvatar = async (ctx: any, x: number, y: number, size: number, avatarUrl: string) => {
    const avatarRadius = size / 2;
    
    try {
        const avatar = await loadImage(avatarUrl);
        ctx.save();
        ctx.beginPath();
        ctx.arc(x + avatarRadius, y + avatarRadius, avatarRadius, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(avatar, x, y, size, size);
        ctx.restore();
    } catch (e) {
        // Fallback to default avatar
        drawDefaultAvatar(ctx, x, y, size);
    }
};

// Draw default avatar
const drawDefaultAvatar = (ctx: any, x: number, y: number, size: number) => {
    const avatarRadius = size / 2;
    const centerX = x + avatarRadius;
    const centerY = y + avatarRadius;
    
    // Draw circle background
    ctx.fillStyle = USER_CARD_PALETTE.PRIMARY;
    ctx.beginPath();
    ctx.arc(centerX, centerY, avatarRadius, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw user icon
    ctx.fillStyle = USER_CARD_PALETTE.TEXT_PRIMARY;
    ctx.font = `${size * 0.5}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('👤', centerX, centerY);
};

// Draw panel
const drawPanel = (ctx: any, x: number, y: number, width: number, height: number, panel: Panel) => {
    // Panel background
    ctx.fillStyle = USER_CARD_PALETTE.PANEL_BG;
    roundRect(ctx, x, y, width, height, 12).fill();
    
    // Panel border
    ctx.strokeStyle = USER_CARD_PALETTE.PANEL_BORDER;
    ctx.lineWidth = 1;
    roundRect(ctx, x, y, width, height, 12).stroke();
    
    const padding = 15;
    const contentX = x + padding;
    const contentY = y + padding;
    const contentWidth = width - (padding * 2);
    
    // Panel title with icon
    ctx.fillStyle = USER_CARD_PALETTE.TEXT_PRIMARY;
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(panel.icon, contentX, contentY + 15);
    ctx.fillText(panel.title, contentX + 25, contentY + 15);
    
    // Draw panel content based on type
    const contentStartY = contentY + 35;
    
    switch (panel.type) {
        case 'list':
            drawListPanel(ctx, contentX, contentStartY, contentWidth, panel.items as ServerRank[]);
            break;
        case 'statistics':
            drawStatisticsPanel(ctx, contentX, contentStartY, contentWidth, panel.stats as Statistic[]);
            break;
        case 'rankedList':
            drawRankedListPanel(ctx, contentX, contentStartY, contentWidth, panel.items as RankedItem[]);
            break;
    }
};

// Draw list panel (for server ranks)
const drawListPanel = (ctx: any, x: number, y: number, width: number, items: ServerRank[]) => {
    items.forEach((item, index) => {
        const itemY = y + (index * 25);
        
        // Category
        ctx.fillStyle = USER_CARD_PALETTE.TEXT_SECONDARY;
        ctx.font = '12px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(item.category, x, itemY + 15);
        
        // Rank
        ctx.fillStyle = USER_CARD_PALETTE.TEXT_PRIMARY;
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'right';
        ctx.fillText(item.rank, x + width, itemY + 15);
    });
};

// Draw statistics panel
const drawStatisticsPanel = (ctx: any, x: number, y: number, width: number, stats: Statistic[]) => {
    const itemHeight = 20;
    const columnWidth = width / 3;
    
    stats.forEach((stat, index) => {
        const col = index % 3;
        const row = Math.floor(index / 3);
        const statX = x + (col * columnWidth);
        const statY = y + (row * itemHeight);
        
        // Period
        ctx.fillStyle = USER_CARD_PALETTE.TEXT_MUTED;
        ctx.font = '10px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(stat.period, statX, statY + 10);
        
        // Value
        ctx.fillStyle = USER_CARD_PALETTE.TEXT_PRIMARY;
        ctx.font = 'bold 11px Arial';
        ctx.fillText(stat.value, statX, statY + 22);
    });
};

// Draw ranked list panel
const drawRankedListPanel = (ctx: any, x: number, y: number, width: number, items: RankedItem[]) => {
    items.forEach((item, index) => {
        const itemY = y + (index * 30);
        
        // Rank number
        ctx.fillStyle = USER_CARD_PALETTE.TEXT_SECONDARY;
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`${item.rank}.`, x, itemY + 15);
        
        // Icon
        ctx.fillStyle = USER_CARD_PALETTE.TEXT_PRIMARY;
        ctx.font = '12px Arial';
        ctx.fillText(item.icon, x + 20, itemY + 15);
        
        // Name
        ctx.fillStyle = USER_CARD_PALETTE.TEXT_PRIMARY;
        ctx.font = '11px Arial';
        const name = item.name || 'N/A';
        ctx.fillText(name, x + 40, itemY + 15);
        
        // Value
        ctx.fillStyle = USER_CARD_PALETTE.TEXT_SECONDARY;
        ctx.font = '10px Arial';
        ctx.textAlign = 'right';
        ctx.fillText(item.value, x + width, itemY + 15);
    });
};


// Main user card generator
export const UserCard = async (options: UserCardOptions): Promise<Buffer> => {
    const {
        theme = 'dark',
        font = 'sans-serif',
        backgroundColor = USER_CARD_PALETTE.BACKGROUND_DARK,
        backgroundImage,
        primaryColor = USER_CARD_PALETTE.PRIMARY,
        secondaryColor = USER_CARD_PALETTE.SECONDARY,
        accentColor = USER_CARD_PALETTE.ACCENT,
        textPrimaryColor = USER_CARD_PALETTE.TEXT_PRIMARY,
        textSecondaryColor = USER_CARD_PALETTE.TEXT_SECONDARY,
        container
    } = options;

    const width = 800;
    const height = 1000;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    
    // Enable anti-aliasing for smooth graphics
    ctx.imageSmoothingEnabled = true;

    // Load font
    try {
        const fontPath = path.join(__dirname, '..', 'fonts', 'pixel.ttf');
        if (!GlobalFonts.has('PixelFont')) {
            GlobalFonts.registerFromPath(fontPath, 'PixelFont');
        }
    } catch (e) {
        console.warn("Pixel font not found, using default fonts");
    }

    // 1. Draw background
    if (backgroundImage) {
        try {
            const bgImage = await loadImage(backgroundImage);
            ctx.drawImage(bgImage, 0, 0, width, height);
        } catch (e) {
            drawGradientBackground(ctx, width, height, backgroundColor);
        }
    } else {
        drawGradientBackground(ctx, width, height, backgroundColor);
    }

    // 2. Draw main container
    const containerPadding = 20;
    const containerWidth = width - (containerPadding * 2);
    const containerHeight = height - (containerPadding * 2);
    const containerX = containerPadding;
    const containerY = containerPadding;

    // Container background
    ctx.fillStyle = USER_CARD_PALETTE.CARD_BG;
    roundRect(ctx, containerX, containerY, containerWidth, containerHeight, 15).fill();

    // Container border
    ctx.strokeStyle = USER_CARD_PALETTE.CARD_BORDER;
    ctx.lineWidth = 2;
    roundRect(ctx, containerX, containerY, containerWidth, containerHeight, 15).stroke();

    // 3. Draw header section
    const headerHeight = 120;
    const headerY = containerY + 20;
    
    // User avatar
    const avatarSize = 60;
    const avatarX = containerX + 20;
    const avatarY = headerY + 10;
    await drawUserAvatar(ctx, avatarX, avatarY, avatarSize, container.header.userInfo.avatar);

    // User info
    const infoX = avatarX + avatarSize + 15;
    const infoY = headerY + 15;

    // Display name
    ctx.fillStyle = textPrimaryColor;
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(container.header.userInfo.displayName, infoX, infoY);

    // Username
    ctx.fillStyle = USER_CARD_PALETTE.TEXT_MUTED;
    ctx.font = '14px Arial';
    ctx.fillText(`@${container.header.userInfo.username}`, infoX, infoY + 25);

    // Custom status
    if (container.header.userInfo.customStatus) {
        ctx.fillStyle = textSecondaryColor;
        ctx.font = '12px Arial';
        ctx.fillText(`${container.header.userInfo.customStatus.emoji} ${container.header.userInfo.customStatus.text}`, infoX, infoY + 45);
    }

    // Account details
    const detailsY = infoY + 65;
    container.header.accountDetails.forEach((detail, index) => {
        const detailY = detailsY + (index * 18);
        
        ctx.fillStyle = USER_CARD_PALETTE.TEXT_MUTED;
        ctx.font = '10px Arial';
        ctx.fillText(detail.label, infoX, detailY);
        
        ctx.fillStyle = textSecondaryColor;
        ctx.font = '11px Arial';
        ctx.fillText(detail.value, infoX + 100, detailY);
    });

    // 4. Draw body panels in grid layout
    const bodyY = headerY + headerHeight + 20;
    const panelWidth = (containerWidth - 60) / 2; // 2 columns
    const panelHeight = 150;
    const panelSpacing = 20;

    container.body.panels.forEach((panel, index) => {
        const col = index % 2;
        const row = Math.floor(index / 2);
        const panelX = containerX + 20 + (col * (panelWidth + panelSpacing));
        const panelY = bodyY + (row * (panelHeight + panelSpacing));
        
        drawPanel(ctx, panelX, panelY, panelWidth, panelHeight, panel);
    });

    // 5. Draw footer
    const footerY = containerY + containerHeight - 40;
    
    // Lookback period and timezone
    ctx.fillStyle = USER_CARD_PALETTE.TEXT_MUTED;
    ctx.font = '10px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(container.footer.lookbackPeriod, containerX + 20, footerY);
    
    ctx.textAlign = 'right';
    ctx.fillText(container.footer.timezone, containerX + containerWidth - 20, footerY);

    // Attribution
    ctx.fillStyle = USER_CARD_PALETTE.TEXT_MUTED;
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(container.footer.attribution.text, containerX + containerWidth / 2, footerY + 15);

    return canvas.toBuffer('image/png');
};