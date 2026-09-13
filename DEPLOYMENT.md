# Deployment

One application, two long-running processes: PHP and the Inertia SSR server.

## Environment

Beyond Laravel's own keys:

| Variable | Notes |
|---|---|
| `APP_URL` | Must be the canonical `https://` origin. HSTS and every canonical/hreflang/JSON-LD URL are built from it, and HSTS is only sent when it starts with `https://` |
| `APP_LOCALE`, `APP_FALLBACK_LOCALE` | `id` |
| `APP_TIMEZONE` | `Asia/Jakarta`, so scheduled publish times read as the editor expects |
| `DB_*` | The application database |
| `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Read by the seeder only. Set the password before seeding anything that is not local |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI` | Optional. Without them the CMS shows password sign-in alone |
| `MEDIA_DISK` | `public` for local storage, `media` for an S3-compatible bucket |
| `MEDIA_BUCKET`, `MEDIA_ENDPOINT`, `MEDIA_PUBLIC_URL`, `MEDIA_REGION`, `MEDIA_KEY`, `MEDIA_SECRET` | Only when `MEDIA_DISK=media` |

`MEDIA_PUBLIC_URL` also decides the `img-src` origin in the Content Security
Policy, so a bucket that is not named there will have its images blocked.

## Release

```bash
composer install --no-dev --optimize-autoloader
npm ci && npm run build

php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan storage:link      # only when MEDIA_DISK=public
```

Then restart PHP-FPM and the SSR process, in that order.

`config:cache` makes `env()` return null outside `config/`. Nothing in this
application calls it elsewhere — that is why the seeder reads
`config('coecbsa.admin.*')` — so keep it that way when adding settings.

## The SSR process

```bash
php artisan inertia:start-ssr    # listens on 127.0.0.1:13714
```

Run it under a supervisor (systemd, supervisord, or the platform's own process
manager) with automatic restart.

**Do not route traffic until it answers.** When the SSR server is unreachable,
Inertia does not fail — it renders on the client instead, and the HTML a
crawler sees is an empty container. The failure is silent, so it will not show
up in an error log.

Health check before cutting over:

```bash
php artisan inertia:check-ssr
```

A deploy that replaces the bundle must restart this process too; it holds the
previous `bootstrap/ssr/ssr.js` in memory.

## Google sign-in

One OAuth client with the Google provider enabled. Authorised redirect URI:

```
https://<APP_URL>/admin/auth/google/callback
```

The callback links to an **existing, active** operator by verified email and
never creates an account, so adding someone to the CMS is still a deliberate
act in `/admin/users`.

## Object storage

Any S3-compatible bucket, including Supabase Storage. It must be public-read:
uploaded images are served directly from it.

Deleting media removes the object and then the row. If the object cannot be
removed the row is kept so the operator sees something to retry — an orphaned
public file with no record pointing at it is the worse outcome.

A CDN in front of the bucket may keep serving a deleted object for a while.
**Verify deletions by listing the bucket, not by fetching the URL.**

## Backups

- Database: everything editorial lives here.
- The media bucket: uploads are not reproducible from the repository.

`lang/{id,en}.json` holds the copy that has no CMS screen, so it is in version
control rather than in a backup.

## Rollback

Deploys are backwards compatible unless a migration is destructive; none so far
are. To roll back, deploy the previous revision and restart both processes.
Roll migrations back only if the newer revision added a column the old code
writes to — otherwise leaving the schema ahead is safe.
