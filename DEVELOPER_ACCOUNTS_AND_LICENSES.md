# AURA Developer Accounts and Ownership Licenses

Last updated: July 1, 2026

This file separates three things that often get mixed together: ownership of the app code, licenses for music/content, and developer accounts needed to publish.

## 1. App ownership

AURA's own source code is marked as private/proprietary in `package.json` with:

```json
"private": true,
"license": "UNLICENSED"
```

That means this repository is not being offered as open-source software by default. Keep the GitHub repository private if you do not want others copying the source.

Keep these ownership records:

- GitHub repository owner: `Nwa-chi/aura-music-hub`
- Production domain: `https://www.auramusichub.com`
- Cloudflare account owner email: the same owner email used for AURA admin access
- Supabase project owner email: the same owner or business identity
- App package ID: `com.auramusichub.app`
- Brand name: AURA

## 2. Third-party software licenses

AURA uses open-source packages such as Next.js, React, Capacitor, Supabase JS, AWS signing helpers, and Lucide icons. Their licenses remain separate from AURA's proprietary app license.

Before store submission, generate and keep a dependency license report. A practical command to add later is:

```bash
npx license-checker --production --summary
```

Do not remove copyright/license files from third-party packages.

## 3. Music and content licenses

Owning the app does not mean owning the songs inside it. You need written rights for every:

- Master recording
- Composition/publishing right
- Lyric
- Sample, beat, loop, or instrumental
- Cover image
- Artist photo
- Artist name/profile/identity
- Featured artist credit

Keep the release record described in `LEGAL_MUSIC_READINESS.md` for every song before it is published.

## 4. Apple Developer account

You need an Apple Developer Program membership to publish AURA on the App Store.

Required details:

- Apple Account controlled by the owner/business
- Individual or organization enrollment
- Legal name or business name
- Address and phone number
- Payment method
- App Store Connect access
- Bundle ID: `com.auramusichub.app`
- Privacy policy URL: `https://www.auramusichub.com/privacy`
- Support URL or email: `support@auramusichub.com`

Current official Apple note: Apple lists the Apple Developer Program as a `$99 annual membership`.

## 5. Google Play Console account

You need a Google Play Console developer account to publish AURA on Google Play.

Required details:

- Google Account controlled by the owner/business
- Developer account type: Personal or Organization
- Legal name or business name
- Contact email and phone number
- Payment method for registration
- Identity verification documents if Google requests them
- Android application ID: `com.auramusichub.app`
- Privacy policy URL: `https://www.auramusichub.com/privacy`
- Support email: `support@auramusichub.com`

Current official Google note: Google lists a `US$25 one-time registration fee` and requires the developer to be at least 18.

## 6. Recommended ownership setup

Use the same owner/business identity across:

- GitHub
- Cloudflare
- Supabase
- GoDaddy/domain records
- Apple Developer
- Google Play Console
- Privacy policy and terms
- Support email
- Payment/tax profiles

This reduces store review confusion and makes it clear that AURA, `auramusichub.com`, and the app package belong together.
