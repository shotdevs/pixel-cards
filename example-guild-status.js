// Example usage of the Guild Status generator
const { GuildStatus, DatabaseHelper } = require('./dist/index.js');

// Mock database data (replace with your actual database)
const mockDatabase = {
    temp_channels: [],
    users: {
        '123456789012345678': {
            level: 15,
            totalExp: 2500,
            todayExp: 150,
            lastDailyReset: '2024-01-15',
            voiceTime: {
                total: 1200, // minutes
                today: 45,
                sessions: []
            },
            messages: {
                daily: {
                    '2024-01-15': 25,
                    '2024-01-14': 30,
                    '2024-01-13': 20
                },
                total: 1250
            },
            activities: {
                tempChannelsCreated: 5,
                welcomeMessages: 12,
                firstJoin: '2024-01-01T00:00:00.000Z'
            },
            achievements: ['first_message', 'voice_master'],
            lastActive: new Date().toISOString()
        },
        '987654321098765432': {
            level: 8,
            totalExp: 1200,
            todayExp: 80,
            lastDailyReset: '2024-01-15',
            voiceTime: {
                total: 800,
                today: 30,
                sessions: []
            },
            messages: {
                daily: {
                    '2024-01-15': 15,
                    '2024-01-14': 20,
                    '2024-01-13': 18
                },
                total: 850
            },
            activities: {
                tempChannelsCreated: 2,
                welcomeMessages: 8,
                firstJoin: '2024-01-05T00:00:00.000Z'
            },
            achievements: ['first_message'],
            lastActive: new Date().toISOString()
        },
        // Add more mock users as needed
        '112233445566778899': {
            level: 20,
            totalExp: 3000,
            todayExp: 200,
            lastDailyReset: '2024-01-15',
            voiceTime: {
                total: 1500,
                today: 60,
                sessions: []
            },
            messages: {
                daily: {
                    '2024-01-15': 35,
                    '2024-01-14': 40,
                    '2024-01-13': 30
                },
                total: 1600
            },
            activities: {
                tempChannelsCreated: 10,
                welcomeMessages: 20,
                firstJoin: '2023-12-25T00:00:00.000Z'
            },
            achievements: ['first_message', 'voice_master', 'chatty'],
            lastActive: new Date().toISOString()
        },
        '998877665544332211': {
            level: 5,
            totalExp: 600,
            todayExp: 40,
            lastDailyReset: '2024-01-15',
            voiceTime: {
                total: 400,
                today: 20,
                sessions: []
            },
            messages: {
                daily: {
                    '2024-01-15': 10,
                    '2024-01-14': 12,
                    '2024-01-13': 8
                },
                total: 450
            },
            activities: {
                tempChannelsCreated: 1,
                welcomeMessages: 5,
                firstJoin: '2024-01-10T00:00:00.000Z'
            },
            achievements: ['first_message'],
            lastActive: new Date().toISOString()
        }   
    }
};

async function generateGuildStatus() {
    try {
        // Initialize database helper
        const dbHelper = new DatabaseHelper(mockDatabase);
        
        // Get guild statistics
        const guildStats = dbHelper.getGuildStats(150, 45); // 150 total members, 45 online
        
        // Generate guild status image
        const imageBuffer = await GuildStatus({
            guildName: 'My Awesome Discord Server',
            guildIcon: 'https://cdn.discordapp.com/icons/123456789012345678/icon_hash.png',
            stats: guildStats,
            theme: 'dark',
            showTopUsers: true
        });
        
        // Save the image (in a real bot, you'd send this to Discord)
        const fs = require('fs');
        fs.writeFileSync('guild-status-example.png', imageBuffer);
        
        console.log('✅ Guild status image generated successfully!');
        console.log('📊 Server Statistics:');
        console.log(`   Total Members: ${guildStats.totalMembers}`);
        console.log(`   Online Members: ${guildStats.onlineMembers}`);
        console.log(`   Total Messages: ${guildStats.totalMessages}`);
        console.log(`   Total Voice Time: ${guildStats.totalVoiceTime} minutes`);
        console.log(`   Active Users: ${guildStats.activeUsers}`);
        console.log(`   Top Users: ${guildStats.topUsers.length}`);
        
    } catch (error) {
        console.error('❌ Error generating guild status:', error);
    }
}

// Run the example
generateGuildStatus();