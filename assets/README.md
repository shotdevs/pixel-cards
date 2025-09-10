This folder is for static assets.

The `pixel-theme.md` documentation refers to a background image. If you wish to use one, place it in this directory (e.g., `pixel-bg.png`) and provide its path when calling the `Pixel` function.

Example:
```javascript
const card = await Pixel({
  // ... other options
  backgroundImage: './assets/pixel-bg.png' 
});