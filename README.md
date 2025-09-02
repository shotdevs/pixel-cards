# Classic Pro Model Card for Pixel Music Discord Bot

This README provides setup and usage instructions for the **Classic Pro Model Card** component of the Pixel Music Discord Bot.

## Features

- Stylish, customizable music card for Discord
- Displays current track info, user avatar, and more
- Designed for easy integration with Pixel Music Bot

## Installation

1. **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/pixel-musicard.git
    cd pixel-musicard
    ```

2. **Install dependencies:**
    ```bash
    npm install
    ```

## Usage

Import and use the Classic Pro Model Card in your Discord bot code:

```js
const { ClassicProCard } = require('./classic-pro-card');

// Example usage
const card = new ClassicProCard({
  username: 'User',
  avatarUrl: 'https://example.com/avatar.png',
  track: {
     title: 'Song Title',
     artist: 'Artist Name',
     albumArt: 'https://example.com/album.png'
  }
});

card.render().then(buffer => {
  // Send buffer as image in Discord
});
```

## Configuration

Customize the card by passing options to the constructor:

- `username`: Discord username
- `avatarUrl`: URL to user's avatar
- `track`: Object with `title`, `artist`, and `albumArt`

## License

MIT

---

*For full bot setup and advanced features, see the main Pixel Music Bot documentation.*