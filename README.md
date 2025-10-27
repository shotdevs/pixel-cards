<div align="center">

# 🎨 Pixel Cards

### Beautiful Discord Card Generators for Bots

[![npm version](https://img.shields.io/npm/v/pixel-cards.svg)](https://www.npmjs.com/package/pixel-cards)
[![license](https://img.shields.io/npm/l/pixel-cards.svg)](https://github.com/shotdevs/pixel-cards/blob/main/LICENSE)
[![downloads](https://img.shields.io/npm/dt/pixel-cards.svg)](https://www.npmjs.com/package/pixel-cards)

*A comprehensive collection of stylish, customizable card generators for Discord bots*

[Installation](#-installation) • [Features](#-features) • [Documentation](#-documentation) • [Examples](#-examples) • [Support](#-support)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Installation](#-installation)
- [Features](#-features)
- [Quick Start](#-quick-start)
- [Card Types](#-card-types)
  - [Music Card](#-music-card)
  - [Welcome Card](#-welcome-card)
  - [User Card](#-user-card)
  - [Guild Status Card](#-guild-status-card)
- [Examples](#-examples)
- [API Reference](#-api-reference)
- [Contributing](#-contributing)
- [License](#-license)
- [Support](#-support)

---

## 🌟 Overview

**Pixel Cards** is a powerful npm package that provides multiple card generators for Discord bots. Create stunning visual cards for music players, welcome messages, user profiles, and server statistics with ease.

### Why Pixel Cards?

✅ **Multiple Card Types** - Music, Welcome, User Profile, and Guild Status cards  
✅ **Highly Customizable** - Extensive options for colors, themes, and layouts  
✅ **Modern Design** - Cyberpunk and pixel-themed aesthetics  
✅ **Easy Integration** - Works seamlessly with Discord.js and other Discord libraries  
✅ **High Performance** - Built with `@napi-rs/canvas` for fast rendering  
✅ **TypeScript Support** - Full TypeScript definitions included  

---

## 📦 Installation

```bash
npm install pixel-cards
```

**Requirements:**
- Node.js 16.x or higher
- `@napi-rs/canvas` (automatically installed)

---

## ✨ Features

### 🎵 Music Card
- Now playing display with album art
- Progress bar with timestamps
- Customizable colors and themes
- Pixel-themed modern aesthetic

### 👋 Welcome Card
- Cyberpunk-themed design
- Animated-looking rings around avatar
- Member count and join information
- HUD-style decorative elements

### 👤 User Card
- Discord-style profile cards
- Activity statistics and rankings
- Customizable panels and layouts
- Server-specific user data

### 📊 Guild Status Card
- Server statistics and member counts
- Activity leaderboards
- Voice and message metrics
- Database integration support

---

## 🚀 Quick Start

### Music Card

```javascript
const { Pixel } = require('pixel-cards');

const cardBuffer = await Pixel({
    name: "Song Title",
    author: "Artist Name",
    thumbnailImage: "https://example.com/album-art.jpg",
    progress: 42,
    startTime: "1:20",
    endTime: "3:21",
    backgroundColor: "#120b26",
    progressColor: '#B78BFF',
    progressBarColor: '#6A3C8B',
});

// Send to Discord
await interaction.reply({ 
    files: [{ attachment: cardBuffer, name: 'musicard.png' }] 
});
```

### Welcome Card

```javascript
const { WelcomeCard } = require('pixel-cards');

const card = await WelcomeCard({
    username: 'NewUser',
    avatar: 'https://cdn.discordapp.com/avatars/123/avatar.png',
    guildName: 'My Awesome Server',
    memberCount: 5000,
    joinDate: '01/01/2024',
    joinTime: '12:00 PM',
    guildPosition: 1234
});

await welcomeChannel.send({ 
    files: [{ attachment: card, name: 'welcome.png' }] 
});
```

### User Card

```javascript
const { UserCard } = require('pixel-cards');

const userCard = await UserCard({
    theme: 'dark',
    font: 'sans-serif',
    backgroundColor: '#2c2f33',
    container: {
        header: {
            userInfo: {
                avatar: member.user.displayAvatarURL(),
                displayName: member.displayName,
                username: member.user.username,
                customStatus: { emoji: '🎮', text: 'Playing Games' }
            },
            accountDetails: [
                { label: 'Joined', value: 'Jan 1, 2024' },
                { label: 'Role', value: 'Member' }
            ]
        },
        body: {
            layout: 'grid',
            panels: [
                {
                    id: 'activity',
                    title: 'Activity',
                    icon: '📊',
                    type: 'statistics',
                    stats: [
                        { period: 'Today', value: '150 msgs' },
                        { period: 'Week', value: '1.2K msgs' }
                    ]
                }
            ]
        }
    }
});
```

### Guild Status Card

```javascript
const { GuildStatus, DatabaseHelper } = require('pixel-cards');

const dbHelper = new DatabaseHelper(client.db);
const guildStats = dbHelper.getGuildStats();

const statusCard = await GuildStatus({
    guildName: guild.name,
    guildIcon: guild.iconURL(),
    stats: guildStats,
    theme: 'dark'
});

await channel.send({ 
    files: [{ attachment: statusCard, name: 'status.png' }] 
});
```

---

## 🎴 Card Types

### 🎵 Music Card

Perfect for music bots to display "Now Playing" information.

**Key Features:**
- Album artwork display
- Track name and artist
- Progress bar with percentage
- Start/end timestamps
- Customizable colors

**Configuration Options:**

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `name` | string | ✅ | Track name |
| `author` | string | ✅ | Artist name |
| `thumbnailImage` | string | ✅ | Album art URL |
| `progress` | number | ✅ | Progress percentage (0-100) |
| `startTime` | string | ✅ | Current time (e.g., "1:20") |
| `endTime` | string | ✅ | Total duration (e.g., "3:21") |
| `backgroundColor` | string | ❌ | Background color (hex) |
| `progressColor` | string | ❌ | Progress bar fill color |
| `progressBarColor` | string | ❌ | Progress bar background color |

[📖 Full Music Card Documentation](./README.md#music-card)

---

### 👋 Welcome Card

Create stunning welcome messages for new server members.

**Key Features:**
- Cyberpunk aesthetic with glowing effects
- Member count display
- Join date and time
- Guild position tracking
- Animated-looking avatar rings

**Configuration Options:**

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `username` | string | ✅ | User's display name |
| `avatar` | string | ✅ | Avatar image URL |
| `guildName` | string | ✅ | Server name |
| `memberCount` | number | ✅ | Total members |
| `joinDate` | string | ❌ | Join date (MM/DD/YYYY) |
| `joinTime` | string | ❌ | Join time (HH:MM AM/PM) |
| `guildPosition` | number | ❌ | Member position |
| `discriminator` | string | ❌ | User discriminator |

[📖 Full Welcome Card Documentation](./welcomecard.md)

---

### 👤 User Card

Display comprehensive user profiles and statistics.

**Key Features:**
- Discord-style profile layout
- Multiple panel types (statistics, rankings, lists)
- Customizable themes and colors
- Activity tracking
- Channel statistics

**Panel Types:**
- **List Panel**: Category-rank pairs
- **Statistics Panel**: Period-value statistics
- **Ranked List Panel**: Leaderboards with icons

[📖 Full User Card Documentation](./usercard.md)

---

### 📊 Guild Status Card

Show server statistics and activity metrics.

**Key Features:**
- Member counts and online status
- Activity leaderboards
- Voice and message statistics
- Database integration
- Custom backgrounds and themes

**Configuration Options:**

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `guildName` | string | ✅ | Server name |
| `guildIcon` | string | ❌ | Server icon URL |
| `stats` | GuildStats | ✅ | Server statistics |
| `theme` | string | ❌ | 'dark' or 'light' |
| `showTopUsers` | boolean | ❌ | Show leaderboard |
| `customBackground` | string | ❌ | Background image URL |

[📖 Full Guild Status Documentation](./guildstatus.md)  
[📖 Database Documentation](./database.md)

---

## 💡 Examples

### Discord.js Integration - Welcome System

```javascript
const { Client, GatewayIntentBits, AttachmentBuilder } = require('discord.js');
const { WelcomeCard } = require('pixel-cards');

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers]
});

client.on('guildMemberAdd', async (member) => {
    const welcomeChannel = member.guild.channels.cache.find(
        channel => channel.name === 'welcome'
    );

    if (!welcomeChannel) return;

    try {
        const card = await WelcomeCard({
            username: member.user.username,
            avatar: member.user.displayAvatarURL({ extension: 'png', size: 256 }),
            guildName: member.guild.name,
            memberCount: member.guild.memberCount,
            joinDate: new Date().toLocaleDateString('en-US'),
            joinTime: new Date().toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit', 
                hour12: true 
            }),
            guildPosition: member.guild.memberCount
        });

        const attachment = new AttachmentBuilder(card, { name: 'welcome.png' });

        await welcomeChannel.send({
            content: `Welcome to **${member.guild.name}**, <@${member.id}>! 🎉`,
            files: [attachment]
        });
    } catch (error) {
        console.error('Error generating welcome card:', error);
    }
});

client.login('YOUR_BOT_TOKEN');
```

### Music Bot - Now Playing Command

```javascript
const { SlashCommandBuilder } = require('discord.js');
const { Pixel } = require('pixel-cards');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nowplaying')
        .setDescription('Show the currently playing song'),
    
    async execute(interaction) {
        const player = interaction.client.player;
        const queue = player.getQueue(interaction.guildId);

        if (!queue || !queue.playing) {
            return interaction.reply('Nothing is playing right now!');
        }

        const track = queue.current;
        const progress = queue.getPlayerTimestamp();

        const card = await Pixel({
            name: track.title,
            author: track.author,
            thumbnailImage: track.thumbnail,
            progress: Math.round((progress.current / progress.total) * 100),
            startTime: formatTime(progress.current),
            endTime: formatTime(progress.total),
            backgroundColor: '#120b26',
            progressColor: '#B78BFF',
            progressBarColor: '#6A3C8B'
        });

        await interaction.reply({ 
            files: [{ attachment: card, name: 'nowplaying.png' }] 
        });
    }
};

function formatTime(ms) {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
```

### Server Stats Command

```javascript
const { SlashCommandBuilder } = require('discord.js');
const { GuildStatus, DatabaseHelper } = require('pixel-cards');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('serverstats')
        .setDescription('Display server statistics'),
    
    async execute(interaction) {
        await interaction.deferReply();
        
        try {
            const dbHelper = new DatabaseHelper(interaction.client.db);
            const guildStats = dbHelper.getGuildStats(
                interaction.guild.memberCount,
                interaction.guild.members.cache.filter(
                    m => m.presence?.status !== 'offline'
                ).size
            );
            
            const statusCard = await GuildStatus({
                guildName: interaction.guild.name,
                guildIcon: interaction.guild.iconURL(),
                stats: guildStats,
                theme: 'dark',
                showTopUsers: true
            });
            
            await interaction.editReply({
                files: [{ attachment: statusCard, name: 'server-stats.png' }]
            });
        } catch (error) {
            console.error('Error generating server stats:', error);
            await interaction.editReply('Failed to generate server statistics.');
        }
    }
};
```

---

## 📚 API Reference

### Music Card - `Pixel(options)`

```typescript
interface PixelOptions {
    name: string;
    author: string;
    thumbnailImage: string;
    progress: number;
    startTime: string;
    endTime: string;
    backgroundColor?: string;
    progressColor?: string;
    progressBarColor?: string;
}
```

### Welcome Card - `WelcomeCard(options)`

```typescript
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
```

### User Card - `UserCard(options)`

```typescript
interface UserCardOptions {
    theme?: 'dark' | 'light';
    font?: string;
    backgroundColor?: string;
    container: {
        header: HeaderSection;
        body: BodySection;
        footer?: FooterSection;
    };
}
```

### Guild Status - `GuildStatus(options)`

```typescript
interface GuildStatusOptions {
    guildName: string;
    guildIcon?: string;
    stats: GuildStats;
    theme?: 'dark' | 'light';
    showTopUsers?: boolean;
    customBackground?: string;
}
```

### Database Helper - `DatabaseHelper`

```typescript
class DatabaseHelper {
    constructor(database: Database);
    getGuildStats(totalMembers?: number, onlineMembers?: number): GuildStats;
    getUserStats(userId: string): UserStats | null;
    getVoiceStats(userId: string): VoiceStats | null;
    getMessageStats(userId: string): MessageStats | null;
    getLeaderboard(type: 'level' | 'voice' | 'messages', limit?: number): User[];
}
```

---

## 🎨 Customization

All cards support extensive customization:

### Color Schemes
```javascript
// Dark theme (default)
backgroundColor: '#120b26'
progressColor: '#B78BFF'
progressBarColor: '#6A3C8B'

// Custom colors
backgroundColor: '#your-color'
progressColor: '#your-color'
```

### Themes
```javascript
// Available themes
theme: 'dark'  // Dark Discord theme
theme: 'light' // Light Discord theme
```

### Fonts
The package includes optimized fonts in the `fonts/` directory. Custom fonts can be loaded if needed.

---

## 🛠️ Troubleshooting

### Common Issues

**Avatar/Image Not Loading**
```javascript
// Use fallback URLs
const avatarUrl = member.user.displayAvatarURL({ extension: 'png' }) 
    || 'https://cdn.discordapp.com/embed/avatars/0.png';
```

**Font Issues**
```bash
# Ensure fonts directory exists
ls fonts/
```

**Memory Issues with High Volume**
```javascript
// Implement rate limiting
const rateLimit = new Map();

client.on('guildMemberAdd', async (member) => {
    if (rateLimit.has(member.guild.id)) return;
    
    rateLimit.set(member.guild.id, true);
    setTimeout(() => rateLimit.delete(member.guild.id), 2000);
    
    // Generate card...
});
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **GPL-3.0-only** license. See [LICENSE](LICENSE) for details.

---

## 💬 Support

Need help? Have questions?

- **GitHub Issues**: [Report a bug or request a feature](https://github.com/shotdevs/pixel-cards/issues)
- **GitHub Discussions**: [Ask questions and share ideas](https://github.com/shotdevs/pixel-cards/discussions)
- **Documentation**: Check the individual card documentation files

---

## 🌟 Credits

Created and maintained by **shotxd01**

Originally developed for the **Ghost X Bot** project.

---

## 📊 Stats

![npm](https://img.shields.io/npm/v/pixel-cards)
![downloads](https://img.shields.io/npm/dt/pixel-cards)
![license](https://img.shields.io/npm/l/pixel-cards)
![size](https://img.shields.io/bundlephobia/min/pixel-cards)

---

<div align="center">

**[⬆ Back to Top](#-pixel-cards)**

Made with ❤️ for the Discord bot community

</div>
