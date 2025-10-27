# Welcome Card Generator

A stunning cyberpunk-themed welcome card generator for Discord bots. Perfect for welcoming new members to your server with style!

## Features

- 🎨 Cyberpunk/tech aesthetic with glowing effects
- 🌟 Animated-looking rings around avatar
- 📊 Display join date, time, and guild position
- 🎭 Member count display
- 💫 HUD-style decorative elements
- ⚡ Fully customizable

## Installation

```bash
npm install pixel-cards
```

## Usage

### Basic Example

```javascript
const { WelcomeCard } = require('pixel-cards');
const fs = require('fs');

async function createWelcomeCard() {
    const card = await WelcomeCard({
        username: 'JohnDoe',
        avatar: 'https://cdn.discordapp.com/avatars/123456789/avatar.png',
        guildName: 'My Awesome Server',
        memberCount: 5000,
        joinDate: '01/01/2024',
        joinTime: '12:00 PM',
        guildPosition: 1234
    });

    fs.writeFileSync('welcome.png', card);
}

createWelcomeCard();
```

### Discord.js Integration

```javascript
const { Client, GatewayIntentBits, AttachmentBuilder } = require('discord.js');
const { WelcomeCard } = require('pixel-cards');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers
    ]
});

client.on('guildMemberAdd', async (member) => {
    // Get welcome channel
    const welcomeChannel = member.guild.channels.cache.find(
        channel => channel.name === 'welcome'
    );

    if (!welcomeChannel) return;

    try {
        // Generate welcome card
        const card = await WelcomeCard({
            username: member.user.username,
            avatar: member.user.displayAvatarURL({ extension: 'png', size: 256 }),
            guildName: member.guild.name,
            memberCount: member.guild.memberCount,
            joinDate: new Date().toLocaleDateString('en-US', { 
                month: '2-digit', 
                day: '2-digit', 
                year: 'numeric' 
            }),
            joinTime: new Date().toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit', 
                hour12: true 
            }),
            guildPosition: member.guild.memberCount,
            discriminator: member.user.discriminator
        });

        // Create attachment
        const attachment = new AttachmentBuilder(card, { 
            name: 'welcome.png' 
        });

        // Send welcome message
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

## API Reference

### WelcomeCard(options)

Generates a cyberpunk-themed welcome card.

#### Options

| Parameter | Type | Required | Description | Default |
|-----------|------|----------|-------------|---------|
| `username` | string | ✅ Yes | The username to display | - |
| `avatar` | string | ✅ Yes | URL to the user's avatar image | - |
| `guildName` | string | ✅ Yes | Name of the Discord server | - |
| `memberCount` | number | ✅ Yes | Total number of members in the server | - |
| `joinDate` | string | ❌ No | Join date in format MM/DD/YYYY | Current date |
| `joinTime` | string | ❌ No | Join time in format HH:MM AM/PM | Current time |
| `guildPosition` | number | ❌ No | Member's position number in the server | Same as memberCount |
| `discriminator` | string | ❌ No | User's discriminator (e.g., "0001") | None |

#### Returns

Returns a `Promise<Buffer>` containing the PNG image data.

## Styling

The welcome card features:

- **Dark Theme**: Deep blacks and dark blues for a tech aesthetic
- **Neon Red/Pink**: Glowing accent colors (#ff2e63, #ff6b9d)
- **Tech HUD Elements**: Corner brackets and decorative lines
- **Glowing Rings**: Multiple animated-looking rings around the avatar
- **Grid Background**: Subtle tech grid with particles
- **Transparent Card**: Semi-transparent main card panel

## Examples

### Example 1: Basic Welcome

```javascript
const card = await WelcomeCard({
    username: 'CoolUser',
    avatar: 'https://example.com/avatar.png',
    guildName: 'Gaming Hub',
    memberCount: 1500
});
```

### Example 2: With All Options

```javascript
const card = await WelcomeCard({
    username: 'ProGamer',
    avatar: 'https://example.com/avatar.png',
    guildName: 'Elite Gaming Server',
    memberCount: 10000,
    joinDate: '10/11/2025',
    joinTime: '03:30 PM',
    guildPosition: 9999,
    discriminator: '1337'
});
```

### Example 3: Dynamic Member Count

```javascript
const member = // ... Discord member object

const card = await WelcomeCard({
    username: member.user.username,
    avatar: member.user.displayAvatarURL({ extension: 'png' }),
    guildName: member.guild.name,
    memberCount: member.guild.memberCount,
    guildPosition: member.guild.memberCount
});
```

## Customization Tips

1. **Avatar Quality**: Use at least 256x256 resolution for best results
2. **Username Length**: Keep usernames under 20 characters for optimal display
3. **Member Count**: Automatically formatted with thousand separators
4. **Time Format**: Use 12-hour format with AM/PM for consistency

## Output Specifications

- **Resolution**: 876 x 493 pixels
- **Format**: PNG with transparency support
- **File Size**: ~100-300 KB (varies with avatar complexity)
- **Color Mode**: RGBA

## Performance

- Generation time: ~100-300ms (depends on network latency for avatar)
- Memory usage: ~10-20 MB per card generation
- Supports concurrent generation

## Troubleshooting

### Avatar Not Loading

```javascript
// Use a fallback avatar
const avatarUrl = member.user.displayAvatarURL({ extension: 'png' }) 
    || 'https://cdn.discordapp.com/embed/avatars/0.png';
```

### Font Issues

The package uses custom pixel fonts. If you encounter font issues:

```bash
# Ensure fonts directory is present
ls fonts/pixel.ttf
```

### Memory Issues with High Volume

```javascript
// Implement rate limiting
const rateLimit = new Map();

client.on('guildMemberAdd', async (member) => {
    // Check rate limit
    if (rateLimit.has(member.guild.id)) {
        return;
    }
    
    rateLimit.set(member.guild.id, true);
    setTimeout(() => rateLimit.delete(member.guild.id), 2000);
    
    // Generate card...
});
```

## Related

- [Pixel Music Card](./README.md) - Music player card generator
- [Guild Status Card](./guildstatus.md) - Server statistics card
- [User Card](./usercard.md) - User activity card

## License

GPL-3.0-only

## Support

For issues, questions, or contributions, please visit:
- GitHub: [shotdevs/pixel-cards](https://github.com/shotdevs/pixel-cards)
- Issues: [Report a bug](https://github.com/shotdevs/pixel-cards/issues)

## Credits

Created by **shotxd01** for the Ghost X Bot project.

---

**Note**: This welcome card generator is part of the `pixel-cards` package, which includes multiple Discord card generators with cyberpunk and modern aesthetics.
