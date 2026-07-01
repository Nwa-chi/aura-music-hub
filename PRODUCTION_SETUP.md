# AURA Production Setup

The app runs in local prototype mode until Supabase and Cloudflare R2 are configured. No secret should be committed to Git.

## 1. Supabase

1. Create a Supabase project.
2. Open the SQL editor and run the files in `supabase/migrations` in order: `001_aura_foundation.sql`, `002_secure_owner_admin.sql`, `003_owner_admin_access.sql`, `004_trust_safety_store_readiness.sql`, then `005_owner_private_change_watch.sql`.
3. In Authentication, set the site URL to `https://www.auramusichub.com`.
4. Add `https://www.auramusichub.com` and the native callback URLs to the redirect allow list.
5. Copy the project URL and anon key into Cloudflare Pages as:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_AURA_OWNER_EMAILS=Udeinno01@gmail.com`
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`

The anon key is designed for browser use when Row Level Security is enabled. Never expose the Supabase service-role key.

Owner admin access is tied to the configured owner email. Sign into AURA with that same email on your computer and phone to see the Admin dashboard on both devices.

The trust and safety migration adds content reports, account deletion requests, owner audit logs, release logs, and delete policies for uploaded songs.

The private change-watch migration adds an owner-only change feed. Public users can create events through normal app actions, but only the configured owner/admin email can read them.

## 2. Cloudflare R2

1. Create an R2 bucket named `aura-music`.
2. Create an R2 API token scoped only to this bucket with object read/write access.
3. Connect a media domain such as `media.auramusichub.com` to the bucket.
4. Add these encrypted Pages secrets:
   - `R2_ACCESS_KEY_ID`
   - `R2_SECRET_ACCESS_KEY`
5. Add these Pages variables:
   - `CLOUDFLARE_ACCOUNT_ID`
   - `R2_BUCKET_NAME=aura-music`
   - `R2_PUBLIC_BASE_URL=https://media.auramusichub.com`

The `/api/uploads/sign` Pages Function validates the Supabase user and issues a 15-minute upload URL. R2 credentials remain server-side.

## 3. Artist Content

Before publishing a track, collect:

- Signed streaming/distribution permission
- Sound-recording owner and composition owner
- Artist name, song title, album, genre, release date, and explicit-content status
- Cover artwork rights
- Lyrics permission
- Territories and agreement end date

Uploaded songs enter `pending` status. An administrator must change them to `published` before they appear in the public catalogue.

## 4. Cloudflare Build

- Build command: `npm run build`
- Output directory: `out`
- Pages Functions directory: `functions`

After adding environment variables, trigger a new Cloudflare Pages deployment. Existing local favorites remain available until the listener signs into a cloud account.

## 5. Owner Publish Button

The Admin dashboard publish button calls the server-side Pages Function at `/api/releases/publish`.

To make the button trigger a real Cloudflare deployment:

1. In Cloudflare Pages, open the AURA project.
2. Create a Deploy Hook for the branch you want the owner button to publish.
3. Save the hook URL as a Pages secret:
   - `CLOUDFLARE_PAGES_DEPLOY_HOOK_URL`
4. Keep `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `AURA_OWNER_EMAILS` configured so the Function can verify the owner before deploying.

The button will not expose Cloudflare credentials in the browser. If the deploy hook secret is missing, the Admin dashboard shows a clear setup message instead of pretending to publish.
