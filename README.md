# CoE CBSA — Website & CMS

Single Laravel application serving the public site of the Center of Excellence
in Community-Based and Sustainable Agroindustry (FTAB, Universitas Brawijaya)
and the custom CMS behind it.

It replaces a split Express API and Next.js front end. One runtime, one deploy,
one dependency tree.

## Stack

| Layer | Choice | Why this one |
|---|---|---|
| Server | Laravel 13, PHP 8.3 | Auth, validation, CSRF, throttling and the queue are all built in |
| Views | Inertia 2 + React 19 + TypeScript | Keeps the existing components and their design; SSR keeps the HTML crawlable |
| Styling | Tailwind 3.4 + CSS custom properties | The design tokens in `resources/css/tokens.css` are the source of truth |
| Database | MySQL 8 (MariaDB and PostgreSQL also work — no vendor SQL) | |
| Uploads | Intervention Image → WebP, stored on a local or S3-compatible disk | |
| Rich text | TipTap in the browser, HTMLPurifier on the server | |

No admin-panel package. The CMS is ordinary controllers and pages.

## Requirements

- PHP 8.3+ with `gd`, `pdo_mysql`, `mbstring`, `fileinfo`, `openssl`
- Composer 2
- Node 20+
- MySQL 8 (or another supported database)

## Local setup

```bash
composer install
npm install
cp .env.example .env
php artisan key:generate
```

Create the database, point `.env` at it, then:

```bash
php artisan migrate --seed
php artisan storage:link
```

The seeder creates a super admin from `ADMIN_EMAIL` and `ADMIN_PASSWORD`. Leave
`ADMIN_PASSWORD` empty and it prints a generated one once — it is never stored
in plain text.

## Running

Three processes. The third is not optional.

```bash
php artisan serve          # application
npm run dev                # Vite, for hot reload
php artisan inertia:start-ssr   # server-side rendering
```

Without the SSR process, Inertia falls back to client rendering **silently**:
the pages still work in a browser, but the HTML a crawler receives is an empty
container. Check it with `php artisan inertia:check-ssr`.

## Layout

```
app/
  Enums/            Role, ArticleStatus, ProgramStatus — stored as strings, cast here
  Http/Controllers/
    Admin/          the CMS
    Auth/           password sign-in and Google OAuth
    Site/           the public pages, sitemap and robots
  Http/Middleware/  SetLocale, SecurityHeaders, HandleInertiaRequests
  Http/Requests/    validation, one FormRequest per write
  Models/           Eloquent models; Concerns/HasBilingualText picks the locale column
  Services/         MediaService (upload/WebP/delete), HtmlSanitizer
  Support/          Seo (canonical, hreflang, JSON-LD), SiteCache
resources/
  css/              tokens.css → globals.css (public), admin.css (CMS only)
  js/Pages/Site/    public pages
  js/Pages/Admin/   CMS pages
  js/Components/    ported design components, unchanged bodies
  js/lib/           i18n, navigation and utility adapters
lang/{id,en}.json   UI catalogue, shared with the browser as an Inertia prop
lang/{id,en}/       server-side messages (auth, flash)
```

### Bilingual columns

Text that exists in both languages is stored as a `*_id` / `*_en` pair. The
`_id` suffix is the ISO 639-1 code for **Indonesian**, not a foreign key.

Two columns break that pattern on purpose: `programs.tag_label_id` and
`partners.group_label_id` are labels, and calling them `tag_id` or `group_id`
would read as relations to tables that do not exist.

`order` and `key` are reserved words in MySQL, so the columns are `position`
and `stat_key`.

## Tests

```bash
php artisan test          # 39 feature tests, SQLite in memory
npx tsc --noEmit          # TypeScript
npm run build             # client and SSR bundles
```

## Content ownership

| Editable in the CMS | Lives in `lang/{locale}.json` |
|---|---|
| News, categories, tags | Hero copy, section headings |
| Programs, partners, impact figures | Focus areas |
| Gallery albums and photos | People and divisions |
| Media library | Contact details and map |
| Contact inbox, operators | Navigation labels |

Copy in the second column has no CMS screen because none was asked for. Adding
one is a controller and a page, following any module in `app/Http/Controllers/Admin`.
