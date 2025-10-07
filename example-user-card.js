// Example usage of the User Card generator
const { UserCard } = require('./dist/index.js');

// Mock user data based on your design specification
const mockUserCardData = {
    theme: "dark",
    font: "sans-serif",
    backgroundColor: "#2c2f33",
    container: {
        header: {
            userInfo: {
                avatar: "https://cdn.discordapp.com/avatars/123456789012345678/avatar_hash.png",
                displayName: "ARCINS",
                username: "aarkamknight",
                customStatus: {
                    emoji: "🍃",
                    text: "Thattukada"
                }
            },
            accountDetails: [
                {
                    label: "Created On",
                    value: "January 15, 2020"
                },
                {
                    label: "Joined On",
                    value: "March 10, 2021"
                }
            ]
        },
        body: {
            layout: "grid",
            panels: [
                {
                    id: "serverRanks",
                    title: "Server Ranks",
                    icon: "🏆",
                    type: "list",
                    items: [
                        {
                            category: "Message",
                            rank: "#3"
                        },
                        {
                            category: "Voice",
                            rank: "#7"
                        }
                    ]
                },
                {
                    id: "messages",
                    title: "Messages",
                    icon: "#",
                    type: "statistics",
                    stats: [
                        {
                            period: "1d",
                            value: "25 messages"
                        },
                        {
                            period: "7d",
                            value: "180 messages"
                        },
                        {
                            period: "14d",
                            value: "320 messages"
                        }
                    ]
                },
                {
                    id: "voiceActivity",
                    title: "Voice Activity",
                    icon: "🔊",
                    type: "statistics",
                    stats: [
                        {
                            period: "1d",
                            value: "2.5 hours"
                        },
                        {
                            period: "7d",
                            value: "15.2 hours"
                        },
                        {
                            period: "14d",
                            value: "28.7 hours"
                        }
                    ]
                },
                {
                    id: "topChannelsApps",
                    title: "Top Channels & Applications",
                    icon: "📈",
                    type: "rankedList",
                    items: [
                        {
                            rank: 1,
                            type: "text-channel",
                            icon: "📄",
                            name: "# general",
                            value: "45 messages"
                        },
                        {
                            rank: 2,
                            type: "voice-channel",
                            icon: "🔊",
                            name: "Gaming Lounge",
                            value: "12.5 hours"
                        },
                        {
                            rank: 3,
                            type: "application",
                            icon: "🎮",
                            name: null,
                            value: "N/A"
                        }
                    ]
                },
                {
                    id: "activityChart",
                    title: "Charts",
                    type: "graph",
                    legend: [
                        {
                            label: "Message",
                            color: "green"
                        },
                        {
                            label: "Voice",
                            color: "pink"
                        }
                    ],
                    data: {
                        message: [15, 20, 25, 18, 22, 30, 25, 28, 32, 20, 18, 25, 30, 28],
                        voice: [45, 60, 75, 50, 65, 80, 70, 85, 90, 55, 50, 70, 85, 80]
                    }
                }
            ]
        },
        footer: {
            lookbackPeriod: "Last 14 days",
            timezone: "UTC",
            attribution: {
                text: "Powered by Ghost X Bot",
                logo: "url_to_ghost_x_bot_logo.png"
            }
        }
    }
};

async function generateUserCard() {
    try {
        console.log('🎨 Generating user card...');
        
        // Generate user card image
        const imageBuffer = await UserCard(mockUserCardData);
        
        // Save the image
        const fs = require('fs');
        fs.writeFileSync('user-card-example.png', imageBuffer);
        
        console.log('✅ User card generated successfully!');
        console.log('📊 User Information:');
        console.log(`   Display Name: ${mockUserCardData.container.header.userInfo.displayName}`);
        console.log(`   Username: @${mockUserCardData.container.header.userInfo.username}`);
        console.log(`   Custom Status: ${mockUserCardData.container.header.userInfo.customStatus.emoji} ${mockUserCardData.container.header.userInfo.customStatus.text}`);
        console.log(`   Created: ${mockUserCardData.container.header.accountDetails[0].value}`);
        console.log(`   Joined: ${mockUserCardData.container.header.accountDetails[1].value}`);
        console.log(`   Panels: ${mockUserCardData.container.body.panels.length}`);
        console.log('📁 Image saved as: user-card-example.png');
        
    } catch (error) {
        console.error('❌ Error generating user card:', error);
    }
}

// Run the example
generateUserCard();