# Notes for agents working on this application

Read `README.md` for the layout and `DEPLOYMENT.md` for the release steps.
What follows is only what is easy to get wrong.

## Do not install Laravel Boost

The Laravel scaffold ships a `CLAUDE.md` telling agents to install
`laravel/boost` before making changes. That file has been replaced. The
dependency is not wanted here.

## Three processes, not two

`php artisan serve` and `npm run dev` are not enough. Without
`php artisan inertia:start-ssr`, Inertia silently renders on the client and the
server HTML is an empty container — the pages still look right in a browser,
which is what makes it easy to miss. `php artisan inertia:check-ssr` answers the
question.

After changing anything under `resources/js`, rebuild **and** restart the SSR
process; it holds the previous bundle in memory.

## Column naming

`*_id` on a text column is the ISO 639-1 code for Indonesian, not a foreign key.
`programs.tag_label_id` and `partners.group_label_id` carry the longer name for
exactly that reason. `position` and `stat_key` avoid MySQL's reserved words.

## Things that are load-bearing

- `Article::scopePublished()` holds both visibility rules — status *and* date.
  Query articles through it; a controller that checks only the status will leak
  a scheduled post.
- `config('coecbsa.media.accepted_mime')` is read by the upload rules and by
  every file picker. Changing one without the other is how a PDF reached a
  public bucket in the previous implementation.
- Rich text is sanitised on save in `HtmlSanitizer`. Do not add a second
  allowlist at render time; there would then be two to keep in step.
- `media.path` is written at upload time. Never re-derive an object key from
  its URL — that bug survived a delete and left the file public.
- `SecurityHeaders` builds the CSP with a per-request nonce. Any inline script
  added to `app.blade.php` needs `nonce="{{ $cspNonce }}"`, and `'unsafe-inline'`
  must not come back to `script-src`.

## framer-motion is in use

Nineteen public components import it. An older note in the monorepo's
`tasks/todo.md` calls it unused; that is wrong. Removing it means rewriting the
hero, the navbar and every card.

## No manualChunks in vite.config.ts

Forcing `@tiptap` into a named chunk made it a dependency of the entry, so the
CMS editor was preloaded on the public home page. Rollup's own splitting is
correct here because Inertia imports pages lazily.

## Responsive images go through `<Picture>`

`resources/js/lib/images.ts` (`unsplashSrcSet`) turns an `images.unsplash.com`
URL into a width `srcSet`. The CDN honours `w`/`h`/`q` and `auto=format`, so one
ladder serves every DPR as AVIF/WebP without pre-generating files. `<Picture>`
(atoms) emits that srcSet and a `sizes` — this is why the hero no longer ships a
1600×2000 original as the LCP. Uploaded media has one stored WebP, so `Picture`
deliberately emits no srcSet for non-Unsplash sources; do not "fix" that.

When adding a public photo, use `<Picture>` and pass `sizes` unless it renders at
~100vw. Tune the ladder and default quality in `lib/images.ts`; `Picture`'s
`quality` prop overrides per image. `ImageWithFallback` remains for reference art
and logos that must keep their native file.
