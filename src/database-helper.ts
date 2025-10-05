import { UserData, GuildStats } from './guild-status';

// Database interface based on your documentation
export interface Database {
    temp_channels: string[];
    users: Record<string, UserData>;
}

// Database helper class for Ghost X Bot integration
export class DatabaseHelper {
    private db: Database;

    constructor(database: Database) {
        this.db = database;
    }

    // Get all users from database
    getUsers(): Record<string, UserData> {
        return this.db.users;
    }

    // Get specific user data
    getUser(userId: string): UserData | null {
        return this.db.users[userId] || null;
    }

    // Get total member count (you'll need to provide this from Discord API)
    getTotalMembers(): number {
        // This should be provided by your Discord bot
        // For now, return the number of users in database
        return Object.keys(this.db.users).length;
    }

    // Get online member count (you'll need to provide this from Discord API)
    getOnlineMembers(): number {
        // This should be provided by your Discord bot
        // For now, return a placeholder
        return Math.floor(Object.keys(this.db.users).length * 0.3);
    }

    // Calculate total messages across all users
    getTotalMessages(): number {
        return Object.values(this.db.users).reduce((sum, user) => sum + user.messages.total, 0);
    }

    // Calculate total voice time across all users
    getTotalVoiceTime(): number {
        return Object.values(this.db.users).reduce((sum, user) => sum + user.voiceTime.total, 0);
    }

    // Get active users (last 24 hours)
    getActiveUsers(): number {
        const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        return Object.values(this.db.users).filter(user => 
            new Date(user.lastActive) > dayAgo
        ).length;
    }

    // Get top users by level
    getTopUsersByLevel(limit: number = 10): Array<{
        userId: string;
        username: string;
        level: number;
        totalExp: number;
        voiceTime: number;
        messages: number;
    }> {
        return Object.entries(this.db.users)
            .map(([userId, user]) => ({
                userId,
                username: `User${userId.slice(-4)}`, // Placeholder - you should get real usernames
                level: user.level,
                totalExp: user.totalExp,
                voiceTime: user.voiceTime.total,
                messages: user.messages.total
            }))
            .sort((a, b) => b.level - a.level)
            .slice(0, limit);
    }

    // Get top users by voice time
    getTopUsersByVoiceTime(limit: number = 10): Array<{
        userId: string;
        username: string;
        level: number;
        totalExp: number;
        voiceTime: number;
        messages: number;
    }> {
        return Object.entries(this.db.users)
            .map(([userId, user]) => ({
                userId,
                username: `User${userId.slice(-4)}`, // Placeholder - you should get real usernames
                level: user.level,
                totalExp: user.totalExp,
                voiceTime: user.voiceTime.total,
                messages: user.messages.total
            }))
            .sort((a, b) => b.voiceTime - a.voiceTime)
            .slice(0, limit);
    }

    // Get top users by messages
    getTopUsersByMessages(limit: number = 10): Array<{
        userId: string;
        username: string;
        level: number;
        totalExp: number;
        voiceTime: number;
        messages: number;
    }> {
        return Object.entries(this.db.users)
            .map(([userId, user]) => ({
                userId,
                username: `User${userId.slice(-4)}`, // Placeholder - you should get real usernames
                level: user.level,
                totalExp: user.totalExp,
                voiceTime: user.voiceTime.total,
                messages: user.messages.total
            }))
            .sort((a, b) => b.messages - a.messages)
            .slice(0, limit);
    }

    // Get guild statistics
    getGuildStats(totalMembers?: number, onlineMembers?: number): GuildStats {
        const users = this.getUsers();
        const totalMembersCount = totalMembers || this.getTotalMembers();
        const onlineMembersCount = onlineMembers || this.getOnlineMembers();
        
        const totalMessages = this.getTotalMessages();
        const totalVoiceTime = this.getTotalVoiceTime();
        const activeUsers = this.getActiveUsers();
        const topUsers = this.getTopUsersByLevel(10);

        return {
            totalMembers: totalMembersCount,
            onlineMembers: onlineMembersCount,
            totalMessages,
            totalVoiceTime,
            activeUsers,
            topUsers
        };
    }

    // Get user statistics for a specific user
    getUserStats(userId: string): {
        level: number;
        totalExp: number;
        todayExp: number;
        levelProgress: number;
        voiceTime: number;
        messages: number;
        activities: any;
        lastActive: string;
    } | null {
        const user = this.getUser(userId);
        if (!user) return null;

        // Calculate level progress (assuming 100 exp per level)
        const expForCurrentLevel = (user.level - 1) * 100;
        const expForNextLevel = user.level * 100;
        const levelProgress = ((user.totalExp - expForCurrentLevel) / (expForNextLevel - expForCurrentLevel)) * 100;

        return {
            level: user.level,
            totalExp: user.totalExp,
            todayExp: user.todayExp,
            levelProgress: Math.min(100, Math.max(0, levelProgress)),
            voiceTime: user.voiceTime.total,
            messages: user.messages.total,
            activities: user.activities,
            lastActive: user.lastActive
        };
    }

    // Get voice statistics for different periods
    getVoiceStats(userId: string): {
        '1d': number;
        '7d': number;
        '14d': number;
        total: number;
    } | null {
        const user = this.getUser(userId);
        if (!user) return null;

        const now = Date.now();
        const oneDayAgo = now - (24 * 60 * 60 * 1000);
        const sevenDaysAgo = now - (7 * 24 * 60 * 60 * 1000);
        const fourteenDaysAgo = now - (14 * 24 * 60 * 60 * 1000);

        let voice1d = 0;
        let voice7d = 0;
        let voice14d = 0;

        user.voiceTime.sessions.forEach(session => {
            if (session.leaveTime) {
                const sessionEnd = session.leaveTime;
                const sessionStart = session.joinTime;
                const duration = sessionEnd - sessionStart;

                if (sessionStart >= oneDayAgo) {
                    voice1d += duration;
                }
                if (sessionStart >= sevenDaysAgo) {
                    voice7d += duration;
                }
                if (sessionStart >= fourteenDaysAgo) {
                    voice14d += duration;
                }
            }
        });

        return {
            '1d': Math.floor(voice1d / (1000 * 60)), // Convert to minutes
            '7d': Math.floor(voice7d / (1000 * 60)),
            '14d': Math.floor(voice14d / (1000 * 60)),
            total: user.voiceTime.total
        };
    }

    // Get message statistics for different periods
    getMessageStats(userId: string): {
        '1d': number;
        '7d': number;
        '14d': number;
        total: number;
    } | null {
        const user = this.getUser(userId);
        if (!user) return null;

        const now = new Date();
        const oneDayAgo = new Date(now.getTime() - (24 * 60 * 60 * 1000));
        const sevenDaysAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
        const fourteenDaysAgo = new Date(now.getTime() - (14 * 24 * 60 * 60 * 1000));

        let messages1d = 0;
        let messages7d = 0;
        let messages14d = 0;

        Object.entries(user.messages.daily).forEach(([dateStr, count]) => {
            const date = new Date(dateStr);
            
            if (date >= oneDayAgo) {
                messages1d += count;
            }
            if (date >= sevenDaysAgo) {
                messages7d += count;
            }
            if (date >= fourteenDaysAgo) {
                messages14d += count;
            }
        });

        return {
            '1d': messages1d,
            '7d': messages7d,
            '14d': messages14d,
            total: user.messages.total
        };
    }

    // Get leaderboard data
    getLeaderboard(type: 'level' | 'voice' | 'messages', limit: number = 10): Array<{
        userId: string;
        username: string;
        level: number;
        totalExp: number;
        voiceTime: number;
        messages: number;
    }> {
        switch (type) {
            case 'level':
                return this.getTopUsersByLevel(limit);
            case 'voice':
                return this.getTopUsersByVoiceTime(limit);
            case 'messages':
                return this.getTopUsersByMessages(limit);
            default:
                return this.getTopUsersByLevel(limit);
        }
    }
}