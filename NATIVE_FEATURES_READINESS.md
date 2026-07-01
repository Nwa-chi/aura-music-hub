# AURA Native App Readiness

Last updated: July 1, 2026

## Already prepared in the web/PWA code

- Installable PWA path.
- Persistent bottom audio player.
- Web Media Session metadata for lock-screen style controls where supported.
- Share song links through the Web Share API or clipboard fallback.
- Deep links using `?song=SONG_ID`.
- Manual publish/versioning workflow.
- Public privacy, terms, copyright, upload rules, and deletion pages.

## Next native features to add for stronger store approval

- Background audio using a native audio plugin.
- Lock-screen controls through native Android/iOS integrations.
- Offline downloads with licensed-content rules and storage limits.
- Push notifications for followed artists and release updates.
- Universal links/app links for opening shared songs directly in the installed app.
- Native account deletion entry point that reaches the same deletion request flow.

## Recommended store path

1. Launch and test the web/PWA first.
2. Submit Google Play after Capacitor sync, screenshots, data safety, age rating, and review account are ready.
3. Submit Apple last, after native background audio and account deletion behavior are solid.
