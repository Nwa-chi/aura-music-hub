# AURA Store Release

## Package Identity

- App name: AURA
- Android application ID: `com.auramusichub.app`
- Apple bundle ID: `com.auramusichub.app`
- Version: `1.0`
- Build number / version code: `1`
- Web bundle: `out`
- Android project: `android`
- iOS project: `ios/App`

The native projects, branded icons, splash screens, and Capacitor configuration
are generated and synchronized. Signing credentials are intentionally not stored
in this repository.

## Versioning

Prepare every software update with:

```bash
npm run version:bump -- patch "Describe the update"
```

Use `patch`, `minor`, `major`, or an exact version like `1.2.3`.
The command updates the web version, Android version code/name, iOS build
number/marketing version, `VERSION.json`, and `VERSION_HISTORY.md`.

## Build Android

1. Install Android Studio and Android SDK 36.
2. Run `npm run native:android`.
3. Test on a physical device and emulator.
4. In Android Studio, create a private upload key and generate a signed Android
   App Bundle (`.aab`) for Google Play.
5. Store the keystore and passwords outside Git.

The project targets Android API 36 and supports Android API 24 and newer.

## Build iOS

1. Use a Mac with Xcode 26 or newer.
2. Clone the repository and run `npm install` followed by `npm run native:ios`.
3. Select the Apple Developer team and confirm the bundle ID in Xcode.
4. Test on iPhone and iPad.
5. Archive the Release build and upload it to App Store Connect for TestFlight.

## Publisher Accounts

Publishing does not require hiring another developer. The owner needs:

- An Apple Developer Program membership with access to App Store Connect.
- A Google Play Console developer account.

Use the same legal owner or organization identity in the store listings, privacy
policy, support information, and payment/tax profiles.

See `DEVELOPER_ACCOUNTS_AND_LICENSES.md` for the exact ownership, license, Apple,
Google, GitHub, Cloudflare, Supabase, and domain details to keep together.

## Required Before Submission

- Replace the local mock sign-in with real authentication and add in-app account
  deletion, or remove account creation from the store build.
- Replace browser-local uploads with secure server storage, moderation, reporting,
  blocking, and content-removal processes.
- Confirm written distribution rights for every song, lyric, cover image, artist
  identity, and sample included in the app.
- Publish an accessible privacy policy at a stable HTTPS URL and link it in the app.
- Publish terms of service and provide a monitored support email or support page.
- Complete Apple App Privacy and Google Play Data Safety declarations accurately.
- Prepare phone and tablet screenshots, store descriptions, category, age rating,
  review notes, and a working reviewer account if authentication remains.
- Add meaningful native value such as lock-screen playback controls, background
  audio, offline downloads, or notifications before Apple review. A simple website
  wrapper has a high rejection risk under App Review Guideline 4.2.
- Test playback, uploads, authentication, offline behavior, and external links on
  real Android and iOS devices.

## Submission References

- Apple App Review Guidelines: https://developer.apple.com/app-store/review/guidelines/
- Google Play Data Safety: https://support.google.com/googleplay/android-developer/answer/10787469
- Capacitor Android: https://capacitorjs.com/docs/android
- Capacitor iOS: https://capacitorjs.com/docs/ios
