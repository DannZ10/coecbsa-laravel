<?php

namespace App\Http\Controllers\Site;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\GalleryItem;
use App\Models\ImpactSdg;
use App\Models\ImpactStat;
use App\Models\Partner;
use App\Models\Program;
use App\Support\Seo;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class PageController extends Controller
{
    /**
     * Cached content is invalidated by the CMS on save, so this window only
     * bounds the damage if an invalidation is ever missed.
     */
    private const TTL = 600;

    public function home(string $locale): Response
    {
        return Inertia::render('Site/Home', [
            'programs' => $this->featuredPrograms($locale),
            'partners' => $this->partners($locale),
            'impact' => $this->impact($locale),
            'articles' => $this->latestArticles($locale),
            'seo' => $this->seo($locale, ''),
        ]);
    }

    public function about(string $locale): Response
    {
        return Inertia::render('Site/About', [
            'seo' => $this->seo($locale, '/about'),
        ]);
    }

    public function structure(string $locale): Response
    {
        return Inertia::render('Site/Structure', [
            'seo' => $this->seo($locale, '/structure'),
        ]);
    }

    public function focusAreas(string $locale): Response
    {
        return Inertia::render('Site/FocusAreas', [
            'seo' => $this->seo($locale, '/focus-areas'),
        ]);
    }

    public function programs(string $locale): Response
    {
        return Inertia::render('Site/Programs', [
            'programs' => $this->programsList($locale),
            'seo' => $this->seo($locale, '/programs'),
        ]);
    }

    public function gallery(string $locale): Response
    {
        $items = Cache::remember("site:gallery:{$locale}", self::TTL, fn () => GalleryItem::with('album')
            ->orderBy('position')
            ->orderBy('id')
            ->get()
            ->map(fn (GalleryItem $item) => [
                'id' => $item->id,
                'title' => $item->localized('title', $locale),
                'caption' => $item->localized('caption', $locale),
                'image_url' => $item->image_url,
                'album' => $item->album?->localized('name', $locale),
                'album_slug' => $item->album?->slug,
            ])
            ->all());

        return Inertia::render('Site/Gallery', [
            'items' => $items,
            'albums' => collect($items)->pluck('album', 'album_slug')->filter()->all(),
            'seo' => $this->seo($locale, '/gallery'),
        ]);
    }

    /**
     * @return array{canonical: string, alternates: array<string, string>, jsonLd: array<string, mixed>}
     */
    private function seo(string $locale, string $path): array
    {
        $contact = (array) __('content.contact');

        return [
            ...Seo::links($locale, $path),
            'jsonLd' => Seo::organization($locale, [
                'address' => (string) ($contact['address'] ?? ''),
                'phone' => (string) ($contact['phone'] ?? ''),
                'email' => (string) ($contact['email'] ?? 'coe.cbsa@ub.ac.id'),
            ]),
        ];
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function featuredPrograms(string $locale): array
    {
        return array_slice($this->programsList($locale), 0, 3);
    }

    /*
     * The four methods below emit the bilingual shape the landing organisms
     * already consume, rather than pre-localised strings.
     *
     * Those components carry a fallback to the bundled static copy when a list
     * is empty, and they read both languages through the existing adapters.
     * Reshaping the payload would mean editing five design components for a
     * few kilobytes — a visual-regression risk the rebuild has no reason to
     * take. The inner pages, which have no such fallback, do receive
     * pre-localised strings.
     */

    /**
     * @return array<int, array<string, mixed>>
     */
    private function programsList(string $locale): array
    {
        return Cache::remember("site:programs:{$locale}", self::TTL, fn () => Program::orderBy('position')
            ->orderBy('id')
            ->get()
            ->map(fn (Program $program) => [
                'id' => (string) $program->id,
                'slug' => $program->slug,
                'tagId' => $program->tag_label_id,
                'tagEn' => $program->tag_label_en,
                'titleId' => $program->title_id,
                'titleEn' => $program->title_en,
                'placeId' => $program->place_id,
                'placeEn' => $program->place_en,
                'descId' => $program->desc_id,
                'descEn' => $program->desc_en,
                'funderId' => $program->funder_id,
                'funderEn' => $program->funder_en,
                'detailsId' => $program->details_id,
                'detailsEn' => $program->details_en,
                'image' => $program->image,
                'status' => strtoupper($program->status->value),
                'order' => $program->position,
            ])
            ->all());
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function partners(string $locale): array
    {
        return Cache::remember("site:partners:{$locale}", self::TTL, fn () => Partner::orderBy('position')
            ->orderBy('id')
            ->get()
            ->map(fn (Partner $partner) => [
                'id' => (string) $partner->id,
                'slug' => $partner->slug,
                'nameId' => $partner->name_id,
                'nameEn' => $partner->name_en,
                'groupId' => $partner->group_label_id,
                'groupEn' => $partner->group_label_en,
                'logoUrl' => $partner->logo_url,
                'href' => $partner->href,
                'order' => $partner->position,
            ])
            ->all());
    }

    /**
     * @return array{stats: array<int, array<string, mixed>>, sdgs: array<int, array<string, mixed>>}
     */
    private function impact(string $locale): array
    {
        return Cache::remember("site:impact:{$locale}", self::TTL, fn () => [
            'stats' => ImpactStat::orderBy('position')->get()->map(fn (ImpactStat $stat) => [
                'id' => (string) $stat->id,
                'key' => $stat->stat_key,
                'value' => $stat->value,
                'labelId' => $stat->label_id,
                'labelEn' => $stat->label_en,
                'order' => $stat->position,
            ])->all(),
            'sdgs' => ImpactSdg::orderBy('position')->get()->map(fn (ImpactSdg $sdg) => [
                'id' => (string) $sdg->id,
                'code' => $sdg->code,
                'labelId' => $sdg->label_id,
                'labelEn' => $sdg->label_en,
                'descriptionId' => $sdg->description_id,
                'descriptionEn' => $sdg->description_en,
                'order' => $sdg->position,
            ])->all(),
        ]);
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function latestArticles(string $locale): array
    {
        return Cache::remember("site:latest:{$locale}", self::TTL, fn () => Article::published()
            ->with(['category', 'author:id,name'])
            ->latest('published_at')
            ->take(3)
            ->get()
            ->map(fn (Article $article) => [
                'id' => (string) $article->id,
                'slug' => $article->slug,
                'titleId' => $article->title_id,
                'titleEn' => $article->title_en,
                'excerptId' => $article->excerpt_id,
                'excerptEn' => $article->excerpt_en,
                'contentId' => '',
                'contentEn' => null,
                'coverImage' => $article->cover_image,
                'status' => strtoupper($article->status->value),
                'publishedAt' => $article->published_at?->toIso8601String(),
                'author' => $article->author ? ['id' => (string) $article->author->id, 'name' => $article->author->name] : null,
                'category' => $article->category ? [
                    'id' => (string) $article->category->id,
                    'slug' => $article->category->slug,
                    'nameId' => $article->category->name_id,
                    'nameEn' => $article->category->name_en,
                ] : null,
                'createdAt' => $article->created_at?->toIso8601String(),
                'updatedAt' => $article->updated_at?->toIso8601String(),
            ])
            ->all());
    }
}
