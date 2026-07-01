# AURA Data Safety Draft

Last updated: July 1, 2026

Use this as a draft when filling store data safety forms. Verify against the final production build.

## Data collected

- Email address: account login, support, account recovery, owner/admin controls.
- Name/profile name: account display and creator identity.
- User-generated content: songs, lyrics, artwork, metadata, reports, support messages.
- App activity: favorites, follows, playback activity, recommendations, uploads, moderation events.
- Device/app info: install status, app version, diagnostics, basic service security.

## Data use

- App functionality.
- Account management.
- Personalization and recommendations.
- Content moderation.
- Security and fraud prevention.
- Support.
- Legal compliance and copyright handling.

## Data sharing

AURA uses service providers such as Supabase and Cloudflare to store, host, secure, and deliver app data. AURA should not sell personal data.

## User controls

- Sign out.
- Request account deletion.
- Request uploaded content removal.
- Report content.
- Contact support at support@auramusichub.com.

## Security

Production should use HTTPS, Supabase row-level security, owner-only admin policies, Cloudflare hosting protections, and private storage credentials.
