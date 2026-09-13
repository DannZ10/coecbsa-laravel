<?php

namespace App\Support;

use App\Models\Article;
use Illuminate\Support\Facades\URL;

/**
 * Canonical URLs, hreflang and JSON-LD.
 *
 * Ported from apps/web/src/lib/seo.ts. Every URL here is absolute, because
 * search engines resolve structured data outside the page context.
 *
 * The result is handed to the root Blade view rather than to React, so the
 * tags are in the server HTML even when the bundle fails to load.
 */
class Seo
{
    /**
     * Canonical plus the alternates for one localised route.
     *
     * Every page needs its own set. Without it a crawler is told that
     * /id/programs duplicates /id, and drops it from the index.
     *
     * @return array{canonical: string, alternates: array<string, string>}
     */
    public static function links(string $locale, string $path = ''): array
    {
        $base = rtrim(config('app.url'), '/');
        $path = $path === '' ? '' : '/'.ltrim($path, '/');

        return [
            'canonical' => "{$base}/{$locale}{$path}",
            'alternates' => [
                'id' => "{$base}/id{$path}",
                'en' => "{$base}/en{$path}",
                'x-default' => "{$base}/id{$path}",
            ],
        ];
    }

    /**
     * @param  array{address: string, phone: string, email: string}  $contact
     * @return array<string, mixed>
     */
    public static function organization(string $locale, array $contact): array
    {
        $base = rtrim(config('app.url'), '/');

        return [
            '@context' => 'https://schema.org',
            '@type' => 'ResearchOrganization',
            '@id' => "{$base}/#organization",
            'name' => __('meta.siteName'),
            'legalName' => __('meta.orgFullName'),
            'description' => __('meta.defaultDescription'),
            'url' => "{$base}/{$locale}",
            'logo' => "{$base}/icon.svg",
            'parentOrganization' => [
                '@type' => 'CollegeOrUniversity',
                'name' => 'Universitas Brawijaya',
                'url' => 'https://ub.ac.id',
            ],
            'address' => [
                '@type' => 'PostalAddress',
                'streetAddress' => $contact['address'],
                'addressLocality' => 'Malang',
                'addressRegion' => 'Jawa Timur',
                'addressCountry' => 'ID',
            ],
            'telephone' => $contact['phone'],
            'email' => $contact['email'],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public static function article(Article $article, string $locale): array
    {
        $base = rtrim(config('app.url'), '/');
        $url = "{$base}/{$locale}/news/{$article->slug}";

        return array_filter([
            '@context' => 'https://schema.org',
            '@type' => 'NewsArticle',
            '@id' => "{$url}#article",
            'headline' => $article->localized('title', $locale),
            'description' => $article->localized('excerpt', $locale) ?: null,
            'url' => $url,
            'mainEntityOfPage' => ['@type' => 'WebPage', '@id' => $url],
            'inLanguage' => $locale === 'id' ? 'id-ID' : 'en-GB',
            'image' => $article->cover_image ? [$article->cover_image] : null,
            'datePublished' => $article->published_at?->toIso8601String(),
            'dateModified' => $article->updated_at?->toIso8601String(),
            'author' => $article->author ? ['@type' => 'Person', 'name' => $article->author->name] : null,
            'publisher' => ['@id' => "{$base}/#organization"],
            'articleSection' => $article->category?->localized('name', $locale),
            'keywords' => $article->tags->isNotEmpty() ? $article->tags->pluck('name')->all() : null,
        ], fn ($value) => $value !== null);
    }

    /**
     * @param  array<int, array{name: string, path?: string}>  $items
     * @return array<string, mixed>
     */
    public static function breadcrumb(array $items, string $locale): array
    {
        $base = rtrim(config('app.url'), '/');

        return [
            '@context' => 'https://schema.org',
            '@type' => 'BreadcrumbList',
            'itemListElement' => array_map(
                fn (array $item, int $index) => array_filter([
                    '@type' => 'ListItem',
                    'position' => $index + 1,
                    'name' => $item['name'],
                    // The final crumb carries no href, by design.
                    'item' => isset($item['path']) ? "{$base}/{$locale}{$item['path']}" : null,
                ], fn ($value) => $value !== null),
                $items,
                array_keys($items),
            ),
        ];
    }

    /** Absolute URL for the current request's locale-prefixed path. */
    public static function current(): string
    {
        return URL::current();
    }
}
