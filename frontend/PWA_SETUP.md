# PWA Icons Setup

Your Money Manager app is now configured as a Progressive Web App (PWA). To complete the setup, you need to add icons in the `public/` directory.

## Required Icon Files

Create icons with these specifications and save them in `/frontend/public/`:

1. **icon-192.png** - 192x192 pixels (regular icon)
2. **icon-512.png** - 512x512 pixels (regular icon)
3. **icon-192-maskable.png** - 192x192 pixels (maskable icon for adaptive display)
4. **icon-512-maskable.png** - 512x512 pixels (maskable icon for adaptive display)
5. **screenshot-540.png** - 540x720 pixels (mobile screenshot)
6. **screenshot-1280.png** - 1280x720 pixels (desktop screenshot)

## Quick Icon Generation Options

### Option 1: Using an Online Tool

- Go to https://www.favicon-generator.org/ or https://appicon.co/
- Upload your logo/image
- Generate multiple sizes
- Download and place in `/frontend/public/`

### Option 2: Using ImageMagick (Mac/Linux)

```bash
# Convert a base image to multiple sizes
convert logo.png -resize 192x192 public/icon-192.png
convert logo.png -resize 512x512 public/icon-512.png
```

### Option 3: Using Figma or Adobe XR

- Design 512x512 icon
- Export at different sizes

## Maskable Icons

Maskable icons should have a safe area of at least 80x80 pixels in the center. The outer area will be masked by adaptive icon shapes on different devices.

## Verification

Once icons are added, test your PWA:

1. Visit your app in Chrome on Android
2. You should see an "Install" button in the address bar
3. On iPhone Safari, use "Add to Home Screen"

## Features Enabled

✅ App installable on mobile  
✅ Offline support (cached pages)  
✅ Service Worker registration  
✅ Splash screen with theme color  
✅ Status bar customization (iOS)  
✅ App name and icon display
