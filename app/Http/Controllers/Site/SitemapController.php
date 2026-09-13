<?php

namespace App\Http\Controllers\Site;

use App\Http\Controllers\Controller;
use App\Http\Middleware\SetLocale;
use App\Models\Article;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    /** Locale-relative paths that exist for every locale. */
    private const STATIC_PATHS = ['', '/about', '/structure', '/focus-areas', '/programs', '/news', '/gallery', '/contact'];

    public function sitemap(): Response
    {
        $base = rtrim(config('app.url'), '/');
        $urls = [];

        foreach (self::STATIC_PATHS as $path) {
            foreach (SetLocale::SUPPORTED as $locale) {
                $urls[] = [
                    'loc' => "{$base}/{$locale}{$path}",
                    'alternates' => SetLocale::SUPPORTED,
                    'path' => $path,
                    'lastmod' => null,
                ];
            }
        }

        // Only what the public can actually open. Listing a draft would send
        // crawlers to a 404 and spend the site's crawl budget on it.
        foreach (Article::published()->latest('published_at')->get(['slug', 'updated_at']) as $article) {
            foreach (SetLocale::SUPPORTED as $locale) {
                $urls[] = [
                    'loc' => "{$base}/{$locale}/news/{$article->slug}",
                    'alternates' => SetLocale::SUPPORTED,
                    'path' => "/news/{$article->slug}",
                    'lastmod' => $article->updated_at?->toAtomString(),
                ];
            }
        }

        return response()
            ->view('sitemap', ['urls' => $urls, 'base' => $base])
            ->header('Content-Type', 'application/xml');
    }

    public function robots(): Response
    {
        $base = rtrim(config('app.url'), '/');

        $lines = [
            'User-agent: *',
            'Allow: /',
            // The CMS has no public value and should never be indexed; the
            // deny still comes from the auth middleware, not from this file.
            'Disallow: /admin',
            '',
            "Sitemap: {$base}/sitemap.xml",
        ];

        return response(implode("\n", $lines)."\n")
            ->header('Content-Type', 'text/plain');
    }
}
