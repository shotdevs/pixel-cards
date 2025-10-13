const { WelcomeCard } = require('./dist/index.js');
const fs = require('fs');

// Example usage of the WelcomeCard generator
async function generateWelcomeCard() {
    try {
        const welcomeCard = await WelcomeCard({
            username: 'USERNAME',
            avatar: 'https://cdn.discordapp.com/avatars/123456789/a_1234567890abcdef.png',
            guildName: 'Awesome Server',
            memberCount: 5000,
            joinDate: '01/01/2024',
            joinTime: '12:00 PM',
            guildPosition: 1234,
            discriminator: '0001' // Optional
        });

        // Save the generated card to a file
        fs.writeFileSync('welcome-card-example.png', welcomeCard);
        console.log('✅ Welcome card generated successfully: welcome-card-example.png');
    } catch (error) {
        console.error('❌ Error generating welcome card:', error);
    }
}

// Run the example
generateWelcomeCard();
