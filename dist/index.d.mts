type PixelOption$1 = {
    name: string;
    author: string;
    thumbnailImage: string;
    progress?: number;
    startTime?: string;
    endTime?: string;
};
declare const PixelJapanese: (option: PixelOption$1) => Promise<Buffer>;

interface UserData {
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
interface VoiceTimeData {
    total: number;
    today: number;
    sessions: VoiceSession[];
}
interface VoiceSession {
    joinTime: number;
    leaveTime?: number;
    channelId: string;
    channelName: string;
    duration?: number;
}
interface MessageData {
    daily: Record<string, number>;
    total: number;
}
interface ActivityData {
    tempChannelsCreated: number;
    welcomeMessages: number;
    firstJoin: string;
}
interface GuildStats {
    totalMembers: number;
    onlineMembers: number;
    totalMessages: number;
    totalVoiceTime: number;
    activeUsers: number;
    boostLevel: number;
    totalRoles: number;
    totalChannels: number;
    totalEmojis: number;
    totalStickers: number;
    totalBans: number;
    totalInvites: number;
    topUsers: Array<{
        userId: string;
        username: string;
        level: number;
        totalExp: number;
        voiceTime: number;
        messages: number;
    }>;
    topVoiceUsers: Array<{
        userId: string;
        username: string;
        level: number;
        totalExp: number;
        voiceTime: number;
        messages: number;
    }>;
}
interface GuildStatusOptions {
    guildName: string;
    guildIcon?: string;
    stats: GuildStats;
    theme?: 'dark' | 'light';
    showTopUsers?: boolean;
    customBackground?: string;
}
declare const GuildStatus: (options: GuildStatusOptions) => Promise<Buffer>;
declare const createGuildStats: (users: Record<string, UserData>, totalMembers: number, onlineMembers: number) => GuildStats;

interface Database {
    temp_channels: string[];
    users: Record<string, UserData>;
}
declare class DatabaseHelper {
    private db;
    constructor(database: Database);
    getUsers(): Record<string, UserData>;
    getUser(userId: string): UserData | null;
    getTotalMembers(): number;
    getOnlineMembers(): number;
    getTotalMessages(): number;
    getTotalVoiceTime(): number;
    getActiveUsers(): number;
    getTopUsersByLevel(limit?: number): Array<{
        userId: string;
        username: string;
        level: number;
        totalExp: number;
        voiceTime: number;
        messages: number;
    }>;
    getTopUsersByVoiceTime(limit?: number): Array<{
        userId: string;
        username: string;
        level: number;
        totalExp: number;
        voiceTime: number;
        messages: number;
    }>;
    getTopUsersByMessages(limit?: number): Array<{
        userId: string;
        username: string;
        level: number;
        totalExp: number;
        voiceTime: number;
        messages: number;
    }>;
    getGuildStats(totalMembers?: number, onlineMembers?: number): GuildStats;
    getUserStats(userId: string): {
        level: number;
        totalExp: number;
        todayExp: number;
        levelProgress: number;
        voiceTime: number;
        messages: number;
        activities: any;
        lastActive: string;
    } | null;
    getVoiceStats(userId: string): {
        '1d': number;
        '7d': number;
        '14d': number;
        total: number;
    } | null;
    getMessageStats(userId: string): {
        '1d': number;
        '7d': number;
        '14d': number;
        total: number;
    } | null;
    getLeaderboard(type: 'level' | 'voice' | 'messages', limit?: number): Array<{
        userId: string;
        username: string;
        level: number;
        totalExp: number;
        voiceTime: number;
        messages: number;
    }>;
}

interface UserInfo {
    avatar: string;
    displayName: string;
    username: string;
    customStatus?: {
        emoji: string;
        text: string;
    };
}
interface AccountDetail {
    label: string;
    value: string;
}
interface ServerRank {
    category: string;
    rank: string;
}
interface Statistic {
    period: string;
    value: string;
}
interface RankedItem {
    rank: number;
    type: 'text-channel' | 'voice-channel' | 'application';
    icon: string;
    name: string | null;
    value: string;
}
interface Panel {
    id: string;
    title: string;
    icon: string;
    type: 'list' | 'statistics' | 'rankedList';
    items?: (ServerRank | RankedItem)[];
    stats?: Statistic[];
}
interface UserCardOptions {
    theme?: 'dark' | 'light';
    font?: 'sans-serif' | 'serif' | 'monospace';
    backgroundColor?: string;
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
declare const UserCard: (options: UserCardOptions) => Promise<Buffer>;

interface WelcomeCardOptions {
    username: string;
    avatar: string;
    guildName: string;
    memberCount: number;
    joinDate?: string;
    joinTime?: string;
    guildPosition?: number;
    discriminator?: string;
}
declare const WelcomeCard: (options: WelcomeCardOptions) => Promise<Buffer>;

type PixelOption = {
    name: string;
    author: string;
    thumbnailImage: string;
    progress?: number;
    startTime?: string;
    endTime?: string;
};
declare const Pixel: (option: PixelOption) => Promise<Buffer>;

export { type AccountDetail, type ActivityData, type Database, DatabaseHelper, type GuildStats, GuildStatus, type GuildStatusOptions, type MessageData, type Panel, Pixel, PixelJapanese, type PixelOption, type RankedItem, type ServerRank, type Statistic, UserCard, type UserCardOptions, type UserData, type UserInfo, type VoiceSession, type VoiceTimeData, WelcomeCard, type WelcomeCardOptions, createGuildStats };
