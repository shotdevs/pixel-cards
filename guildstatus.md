# Guild Status Image Generator

A Discord server activity image generator for the Ghost X Bot, similar to the example provided. This module generates beautiful server status cards with member statistics, activity data, and leaderboards.

## Features

- 🎨 **Modern Design**: Clean, Discord-inspired UI with customizable themes
- 📊 **Server Statistics**: Total members, online count, messages, voice time
- 🏆 **Leaderboards**: Top users by level, voice time, and messages
- 📈 **Activity Graphs**: Visual representation of server activity
- 🎯 **Database Integration**: Seamless integration with Ghost X Bot database
- 🖼️ **Custom Backgrounds**: Support for custom server backgrounds
- 🎨 **Multiple Themes**: Dark and light theme support

## Installation

The guild status functionality is included in the pixel-cards package. No additional installation required.

```bash
npm install pixel-cards
```

## Quick Start

```typescript
import { GuildStatus, DatabaseHelper, createGuildStats } from 'pixel-cards';

// Initialize database helper
const dbHelper = new DatabaseHelper(client.db);

// Get guild statistics
const guildStats = dbHelper.getGuildStats(totalMembers, onlineMembers);

// Generate guild status image
const imageBuffer = await GuildStatus({
    guildName: 'My Discord Server',
    guildIcon: 'https://cdn.discordapp.com/icons/guild_id/icon_hash.png',
    stats: guildStats,
    theme: 'dark',
    showTopUsers: true
});

// Send to Discord channel
await channel.send({ files: [{ attachment: imageBuffer, name: 'guild-status.png' }] });
```

## API Reference

### GuildStatus Function

Generates a Discord server status image.

```typescript
GuildStatus(options: GuildStatusOptions): Promise<Buffer>
```

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `guildName` | `string` | ✅ | Name of the Discord server |
| `guildIcon` | `string` | ❌ | URL to server icon image |
| `stats` | `GuildStats` | ✅ | Server statistics object |
| `theme` | `'dark' \| 'light'` | ❌ | Color theme (default: 'dark') |
| `showTopUsers` | `boolean` | ❌ | Show top users section (default: true) |
| `customBackground` | `string` | ❌ | URL to custom background image |

#### Return Value

Returns a `Promise<Buffer>` containing the generated PNG image.

### DatabaseHelper Class

Helper class for integrating with Ghost X Bot database.

```typescript
class DatabaseHelper {
    constructor(database: Database)
    
    // Get guild statistics
    getGuildStats(totalMembers?: number, onlineMembers?: number): GuildStats
    
    // Get user statistics
    getUserStats(userId: string): UserStats | null
    
    // Get voice statistics
    getVoiceStats(userId: string): VoiceStats | null
    
    // Get message statistics
    getMessageStats(userId: string): MessageStats | null
    
    // Get leaderboards
    getLeaderboard(type: 'level' | 'voice' | 'messages', limit?: number): User[]
}
```

### Data Types

#### GuildStats

```typescript
interface GuildStats {
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
```

#### UserData

```typescript
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
```

## Usage Examples

### Basic Server Status

```typescript
import { GuildStatus, DatabaseHelper } from 'pixel-cards';

// In your Discord bot command
const dbHelper = new DatabaseHelper(client.db);
const guildStats = dbHelper.getGuildStats();

const imageBuffer = await GuildStatus({
    guildName: interaction.guild.name,
    guildIcon: interaction.guild.iconURL(),
    stats: guildStats
});

await interaction.reply({
    files: [{ attachment: imageBuffer, name: 'server-status.png' }]
});
```

### Custom Theme and Background

```typescript
const imageBuffer = await GuildStatus({
    guildName: 'My Gaming Server',
    guildIcon: 'https://example.com/server-icon.png',
    stats: guildStats,
    theme: 'light',
    showTopUsers: true,
    customBackground: 'https://example.com/custom-bg.jpg'
});
```

### User-Specific Statistics

```typescript
// Get user statistics
const userStats = dbHelper.getUserStats(userId);
if (userStats) {
    console.log(`User Level: ${userStats.level}`);
    console.log(`Total XP: ${userStats.totalExp}`);
    console.log(`Voice Time: ${userStats.voiceTime} minutes`);
}

// Get voice statistics for different periods
const voiceStats = dbHelper.getVoiceStats(userId);
if (voiceStats) {
    console.log(`Voice time today: ${voiceStats['1d']} minutes`);
    console.log(`Voice time this week: ${voiceStats['7d']} minutes`);
}
```

### Leaderboards

```typescript
// Get top users by level
const topLevelUsers = dbHelper.getLeaderboard('level', 10);

// Get top users by voice time
const topVoiceUsers = dbHelper.getLeaderboard('voice', 5);

// Get top users by messages
const topMessageUsers = dbHelper.getLeaderboard('messages', 15);
```

## Discord Bot Integration

### Command Example

```typescript
// Slash command for server status
const { SlashCommandBuilder } = require('discord.js');
const { GuildStatus, DatabaseHelper } = require('pixel-cards');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('serverstatus')
        .setDescription('Show server activity and statistics'),
    
    async execute(interaction) {
        await interaction.deferReply();
        
        try {
            const dbHelper = new DatabaseHelper(client.db);
            const guildStats = dbHelper.getGuildStats(
                interaction.guild.memberCount,
                interaction.guild.members.cache.filter(member => member.presence?.status !== 'offline').size
            );
            
            const imageBuffer = await GuildStatus({
                guildName: interaction.guild.name,
                guildIcon: interaction.guild.iconURL(),
                stats: guildStats,
                theme: 'dark'
            });
            
            await interaction.editReply({
                files: [{ attachment: imageBuffer, name: 'server-status.png' }]
            });
        } catch (error) {
            console.error('Error generating server status:', error);
            await interaction.editReply('Failed to generate server status image.');
        }
    }
};
```

### Scheduled Status Updates

```typescript
// Update server status every hour
setInterval(async () => {
    try {
        const dbHelper = new DatabaseHelper(client.db);
        const guildStats = dbHelper.getGuildStats();
        
        const imageBuffer = await GuildStatus({
            guildName: guild.name,
            guildIcon: guild.iconURL(),
            stats: guildStats
        });
        
        // Update a specific channel with the status
        const statusChannel = guild.channels.cache.get('STATUS_CHANNEL_ID');
        if (statusChannel && statusChannel.isTextBased()) {
            await statusChannel.send({
                files: [{ attachment: imageBuffer, name: 'server-status.png' }]
            });
        }
    } catch (error) {
        console.error('Error updating server status:', error);
    }
}, 60 * 60 * 1000); // Every hour
```

## Customization

### Color Themes

The generator supports two built-in themes:

- **Dark Theme** (default): Discord-inspired dark colors
- **Light Theme**: Clean light colors

### Custom Backgrounds

You can provide custom background images:

```typescript
const imageBuffer = await GuildStatus({
    guildName: 'My Server',
    stats: guildStats,
    customBackground: 'https://example.com/my-background.jpg'
});
```

### Font Customization

The generator uses the included pixel font by default. To use custom fonts, modify the font loading in the source code.

## Performance Considerations

- **Image Generation**: Typically takes 100-500ms depending on server size
- **Memory Usage**: ~10-50MB during generation (temporary)
- **Database Queries**: Optimized to minimize database access
- **Caching**: Consider caching generated images for frequently accessed data

## Error Handling

```typescript
try {
    const imageBuffer = await GuildStatus({
        guildName: guild.name,
        stats: guildStats
    });
    
    await channel.send({ files: [{ attachment: imageBuffer, name: 'status.png' }] });
} catch (error) {
    if (error.message.includes('font')) {
        console.error('Font loading error:', error);
    } else if (error.message.includes('image')) {
        console.error('Image loading error:', error);
    } else {
        console.error('Unknown error:', error);
    }
}
```

## Troubleshooting

### Common Issues

1. **Font Not Found**: Ensure `pixel.ttf` is in the fonts directory
2. **Image Loading Errors**: Check URL validity and accessibility
3. **Memory Issues**: Reduce image size or optimize database queries
4. **Slow Generation**: Consider caching or reducing data complexity

### Debug Mode

Enable debug logging by setting the environment variable:

```bash
DEBUG=pixel-musicard:guild-status
```

## Contributing

To contribute to the guild status generator:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the GPL-3.0-only license.

## Support

For support and questions:

- Create an issue on GitHub
- Join the Discord server
- Check the documentation

---

**Note**: This module is designed specifically for integration with the Ghost X Bot database system. Make sure your database structure matches the expected format described in the Ghost X Bot documentation.