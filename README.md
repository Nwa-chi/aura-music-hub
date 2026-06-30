# AURA

Every song has a story. AURA is where it gets told.

Built with Next.js and deployed on Cloudflare Pages.

Official music domain: `https://www.auramusichub.com/`

## Features

- Audio player with play, pause, skip, seek, and volume controls
- Synchronized lyrics
- Artist profiles
- Albums and playlists
- Favorites saved in the browser
- Search
- Mobile-friendly responsive design
- Dark and light mode
- User account prototype
- Song and lyric uploads saved in the browser
- Admin dashboard

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Cloudflare Pages

This app uses static export, so it works well on Cloudflare Pages.

- Build command: `npm run build`
- Output directory: `out`

After connecting the Git repository in Cloudflare Pages, use those settings for deployment.

## Native Apps

Capacitor projects are included for Android and iOS with app ID
`com.auramusichub.app`.

```bash
npm run native:sync
npm run native:android
npm run native:ios
```

Android requires Android Studio and an Android SDK. Building and signing iOS
requires macOS with Xcode. See `STORE_RELEASE.md` before submitting either app.
