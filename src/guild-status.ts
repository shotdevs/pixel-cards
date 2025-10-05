import { createCanvas, loadImage, GlobalFonts } from '@napi-rs/canvas';
import { promises as fs } from 'fs';
import * as path from 'path';

// --- GUILD STATUS THEME COLOR PALETTE ---
const GUILD_PALETTE = {
    BACKGROUND_DARK: '#0a0a0a',
    BACKGROUND_LIGHT: '#1a1a1a',
    CARD_BG: '#2a2a2a',
    CARD_BORDER: '#404040',
    
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
    
    PROGRESS_BG: '#404040',
    PROGRESS_FILL: '#5865f2',
};

// Database types based on your documentation
export interface UserData {
    level: number;
    totalExp: number;
    todayExp: number;
    lastDailyReset: string;
    voiceTime: VoiceTimeData;
    messages: MessageData;
    activities: ActivityData;
    achievements: string[];
    lastActive: string;
}

export interface VoiceTimeData {
    total: number;
    today: number;
    sessions: VoiceSession[];
}

export interface VoiceSession {
    joinTime: number;
    leaveTime?: number;
    channelId: string;
    channelName: string;
    duration?: number;
}

export interface MessageData {
    daily: Record<string, number>;
    total: number;
}

export interface ActivityData {
    tempChannelsCreated: number;
    welcomeMessages: number;
    firstJoin: string;
}

export interface GuildStats {
    totalMembers: number;
    onlineMembers: number;
    totalMessages: number;
    totalVoiceTime: number;
    activeUsers: number;
    topUsers: Array<{
        userId: string;
        username: string;
        level: number;
        totalExp: number;
        voiceTime: number;
        messages: number;
    }>;
}

export interface GuildStatusOptions {
    guildName: string;
    guildIcon?: string;
    stats: GuildStats;
    theme?: 'dark' | 'light';
    showTopUsers?: boolean;
    customBackground?: string;
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
const drawGradientBackground = (ctx: any, width: number, height: number, theme: 'dark' | 'light') => {
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    
    if (theme === 'dark') {
        gradient.addColorStop(0, GUILD_PALETTE.BACKGROUND_LIGHT);
        gradient.addColorStop(1, GUILD_PALETTE.BACKGROUND_DARK);
    } else {
        gradient.addColorStop(0, '#f8f9fa');
        gradient.addColorStop(1, '#e9ecef');
    }
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
};

// Draw server icon with fallback
const drawServerIcon = async (ctx: any, x: number, y: number, size: number, iconUrl?: string) => {
    const iconRadius = size / 2;
    
    if (iconUrl) {
        try {
            const icon = await loadImage(iconUrl);
            ctx.save();
            ctx.beginPath();
            ctx.arc(x + iconRadius, y + iconRadius, iconRadius, 0, Math.PI * 2);
            ctx.clip();
            ctx.drawImage(icon, x, y, size, size);
            ctx.restore();
        } catch (e) {
            // Fallback to default icon
            drawDefaultServerIcon(ctx, x, y, size);
        }
    } else {
        drawDefaultServerIcon(ctx, x, y, size);
    }
};

// Draw default server icon
const drawDefaultServerIcon = (ctx: any, x: number, y: number, size: number) => {
    const iconRadius = size / 2;
    const centerX = x + iconRadius;
    const centerY = y + iconRadius;
    
    // Draw Discord-like server icon
    ctx.fillStyle = GUILD_PALETTE.PRIMARY;
    ctx.beginPath();
    ctx.arc(centerX, centerY, iconRadius, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw "D" letter
    ctx.fillStyle = GUILD_PALETTE.TEXT_PRIMARY;
    ctx.font = `${size * 0.6}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('D', centerX, centerY);
};

// Format numbers with K/M suffixes
const formatNumber = (num: number): string => {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
};

// Format time duration
const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
        return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
};

// Draw stat card
const drawStatCard = (ctx: any, x: number, y: number, width: number, height: number, 
                     title: string, value: string, icon: string, color: string) => {
    // Card background
    ctx.fillStyle = GUILD_PALETTE.CARD_BG;
    roundRect(ctx, x, y, width, height, 12).fill();
    
    // Card border
    ctx.strokeStyle = GUILD_PALETTE.CARD_BORDER;
    ctx.lineWidth = 1;
    roundRect(ctx, x, y, width, height, 12).stroke();
    
    // Icon
    ctx.fillStyle = color;
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(icon, x + 30, y + 30);
    
    // Title
    ctx.fillStyle = GUILD_PALETTE.TEXT_SECONDARY;
    ctx.font = '14px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(title, x + 60, y + 25);
    
    // Value
    ctx.fillStyle = GUILD_PALETTE.TEXT_PRIMARY;
    ctx.font = 'bold 20px Arial';
    ctx.fillText(value, x + 60, y + 50);
};

// Draw top users section
const drawTopUsers = (ctx: any, x: number, y: number, width: number, users: GuildStats['topUsers']) => {
    const cardHeight = 150;
    
    // Card background
    ctx.fillStyle = GUILD_PALETTE.CARD_BG;
    roundRect(ctx, x, y, width, cardHeight, 12).fill();
    
    // Card border
    ctx.strokeStyle = GUILD_PALETTE.CARD_BORDER;
    ctx.lineWidth = 1;
    roundRect(ctx, x, y, width, cardHeight, 12).stroke();
    
    // Title
    ctx.fillStyle = GUILD_PALETTE.TEXT_PRIMARY;
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Top Members', x + 20, y + 30);
    
    // User list - display 4 users in 2 columns
    const userHeight = 30;
    const startY = y + 50;
    const columnWidth = (width - 40) / 2; // Split into 2 columns
    const usersPerColumn = 2; // 2 users per column for 4 total users
    
    users.slice(0, 4).forEach((user, index) => {
        const column = Math.floor(index / usersPerColumn);
        const row = index % usersPerColumn;
        const userX = x + 20 + (column * columnWidth);
        const userY = startY + (row * userHeight);
        
        // Rank number
        ctx.fillStyle = GUILD_PALETTE.TEXT_MUTED;
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${index + 1}`, userX + 20, userY + 15);
        
        // Username
        ctx.fillStyle = GUILD_PALETTE.TEXT_PRIMARY;
        ctx.font = '14px Arial';
        ctx.textAlign = 'left';
        const maxWidth = columnWidth - 100;
        const username = user.username.length > 18 ? user.username.substring(0, 15) + '...' : user.username;
        ctx.fillText(username, userX + 50, userY + 15);
        
        // Level
        ctx.fillStyle = GUILD_PALETTE.SECONDARY;
        ctx.font = '12px Arial';
        ctx.textAlign = 'right';
        ctx.fillText(`Lv.${user.level}`, userX + columnWidth - 20, userY + 15);
    });
};

export const GuildStatus = async (options: GuildStatusOptions): Promise<Buffer> => {
    const {
        guildName,
        guildIcon,
        stats,
        theme = 'dark',
        showTopUsers = true,
        customBackground
    } = options;

    const width = 800;
    const height = 600;
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
    if (customBackground) {
        try {
            const bgImage = await loadImage(customBackground);
            ctx.drawImage(bgImage, 0, 0, width, height);
        } catch (e) {
            drawGradientBackground(ctx, width, height, theme);
        }
    } else {
        drawGradientBackground(ctx, width, height, theme);
    }

    // 2. Draw header with server info
    const headerHeight = 100;
    const iconSize = 60;
    const iconX = 30;
    const iconY = 20;
    
    // Server icon
    await drawServerIcon(ctx, iconX, iconY, iconSize, guildIcon);
    
    // Server name
    ctx.fillStyle = GUILD_PALETTE.TEXT_PRIMARY;
    ctx.font = 'bold 28px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(guildName, iconX + iconSize + 20, iconY + 25);
    
    // Server stats summary
    ctx.fillStyle = GUILD_PALETTE.TEXT_SECONDARY;
    ctx.font = '16px Arial';
    ctx.fillText(`${formatNumber(stats.totalMembers)} members • ${formatNumber(stats.onlineMembers)} online`, 
                 iconX + iconSize + 20, iconY + 55);

    // 3. Draw main stats cards
    const cardWidth = 180;
    const cardHeight = 80;
    const cardSpacing = 20;
    const cardsStartX = 30;
    const cardsStartY = 140;
    
    // Members card
    drawStatCard(ctx, cardsStartX, cardsStartY, cardWidth, cardHeight, 
                'Total Members', formatNumber(stats.totalMembers), '👥', GUILD_PALETTE.PRIMARY);
    
    // Online members card
    drawStatCard(ctx, cardsStartX + cardWidth + cardSpacing, cardsStartY, cardWidth, cardHeight,
                'Online Now', formatNumber(stats.onlineMembers), '🟢', GUILD_PALETTE.ONLINE);
    
    // Messages card
    drawStatCard(ctx, cardsStartX + (cardWidth + cardSpacing) * 2, cardsStartY, cardWidth, cardHeight,
                'Messages', formatNumber(stats.totalMessages), '💬', GUILD_PALETTE.SECONDARY);
    
    // Voice time card
    drawStatCard(ctx, cardsStartX, cardsStartY + cardHeight + cardSpacing, cardWidth, cardHeight,
                'Voice Time', formatDuration(stats.totalVoiceTime), '🎤', GUILD_PALETTE.ACCENT);
    
    // Active users card
    drawStatCard(ctx, cardsStartX + cardWidth + cardSpacing, cardsStartY + cardHeight + cardSpacing, cardWidth, cardHeight,
                'Active Users', formatNumber(stats.activeUsers), '⭐', GUILD_PALETTE.DANGER);

    // 4. Draw top users section (moved to replace server activity section)
    if (showTopUsers && stats.topUsers.length > 0) {
        const topUsersWidth = width - 60; // Full width minus margins
        const topUsersX = 30;
        const topUsersY = 350; // Same Y position as the old server activity section
        
        drawTopUsers(ctx, topUsersX, topUsersY, topUsersWidth, stats.topUsers);
    }

    // 5. Draw footer
    const footerY = height - 30;
    ctx.fillStyle = GUILD_PALETTE.TEXT_MUTED;
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Generated by Ghost X Bot', width / 2, footerY);

    return canvas.toBuffer('image/png');
};

// Helper function to create guild stats from database
export const createGuildStats = (users: Record<string, UserData>, totalMembers: number, onlineMembers: number): GuildStats => {
    const userEntries = Object.entries(users);
    
    // Calculate totals
    const totalMessages = userEntries.reduce((sum, [, user]) => sum + user.messages.total, 0);
    const totalVoiceTime = userEntries.reduce((sum, [, user]) => sum + user.voiceTime.total, 0);
    
    // Count active users (last 24 hours)
    const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const activeUsers = userEntries.filter(([, user]) => 
        new Date(user.lastActive) > dayAgo
    ).length;
    
    // Get top users by level
    const topUsers = userEntries
        .map(([userId, user]) => ({
            userId,
            username: `User${userId.slice(-4)}`, // Placeholder username
            level: user.level,
            totalExp: user.totalExp,
            voiceTime: user.voiceTime.total,
            messages: user.messages.total
        }))
        .sort((a, b) => b.level - a.level)
        .slice(0, 10);
    
    return {
        totalMembers,
        onlineMembers,
        totalMessages,
        totalVoiceTime,
        activeUsers,
        topUsers
    };
};