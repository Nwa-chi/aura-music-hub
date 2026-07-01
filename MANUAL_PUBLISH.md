# AURA Manual Publishing Workflow

Use this workflow when you want a release to be reviewed by you before it becomes public.

## What This Protects

Pushing code to GitHub can trigger Cloudflare Pages automatically. This manual workflow creates a local release package first, so you can inspect the app, test it, and then decide when to publish it yourself.

## Create A Manual Release Package

Before creating a package, prepare the version:

```bash
npm run version:bump -- patch "Describe this update"
```

Then build the review package:

```bash
npm run release:manual
```

This creates:

- `outputs/manual-release/web/` - the static web build for Cloudflare Pages direct upload
- `outputs/manual-release/release-notes.md` - what changed and what to test
- `outputs/manual-release/publish-checklist.md` - final go/no-go checklist
- `outputs/manual-release/store-metadata.json` - starter metadata for app-store listings

The version is saved in `VERSION.json` and `VERSION_HISTORY.md`.

## Publish To Cloudflare Manually

1. Run `npm run release:manual`.
2. Open `outputs/manual-release/web/` locally or with a static server.
3. Confirm login, playback, uploads, admin, mobile layout, and install behavior.
4. In Cloudflare Pages, create a direct upload deployment using `outputs/manual-release/web/`.
5. Review the preview deployment.
6. Promote it to production only when you are satisfied.

## Publish To Google Play Manually

1. Run `npm run native:sync`.
2. Open the `android/` folder in Android Studio.
3. Test on a real Android device.
4. Build a signed Android App Bundle (`.aab`).
5. Upload the `.aab` to Google Play Console.
6. Submit to internal testing first.
7. Promote to production only after your test release passes.

## Publish To Apple App Store Manually

1. Use a Mac with Xcode.
2. Run `npm install`, then `npm run native:sync`.
3. Open `ios/App` in Xcode.
4. Archive the release build.
5. Upload to App Store Connect.
6. Release through TestFlight first.
7. Submit to App Review and release manually after approval.

## Content Publishing Rule

Songs uploaded to AURA should stay private until the owner manually publishes them from the Admin dashboard. Uploaded tracks should start as `pending`; only `published` songs should appear publicly.
