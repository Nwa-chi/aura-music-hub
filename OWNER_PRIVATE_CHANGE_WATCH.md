# AURA Owner-Only Change Watch

Last updated: July 1, 2026

The Admin dashboard now includes a private change feed called **Private change watch**.

## What the owner can see

Only the signed-in owner/admin can see:

- Current prepared app version and private build notes.
- New uploads entering review.
- Song publish/reject decisions.
- Deleted uploads.
- Content/copyright reports.
- Account deletion requests.
- Audit log records.
- Release log records.

## What public users can see

Public listeners do not see the Admin navigation item, the Admin dashboard, or the private change watch panel.

The Supabase table `owner_change_events` is protected by row-level security:

- Public/anonymous users can create change events only through normal app actions.
- Public/anonymous users cannot read the private feed.
- Authenticated non-owner users cannot read the private feed.
- Only `public.is_admin()` users can read/manage the feed.

## Required deployment step

Run this migration in Supabase SQL editor:

```text
supabase/migrations/005_owner_private_change_watch.sql
```

Without this migration, the app still builds, but the private change feed can only show local/browser and older audit data.

## Live behavior

The owner dashboard refreshes the private feed every 15 seconds and also subscribes to Supabase realtime events where available.
