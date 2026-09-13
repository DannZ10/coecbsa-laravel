<?php

namespace App\Http\Controllers\Site;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Category;
use App\Support\Seo;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NewsController extends Controller
{
    public function index(Request $request, string $locale): Response
    {
        $filters = $request->validate([
            'q' => ['nullable', 'string', 'max:120'],
            'category' => ['nullable', 'string', 'max:140'],
        ]);

        $articles = Article::published()
            ->with('category')
            ->when($filters['q'] ?? null, fn ($query, $term) => $query->where(
                fn ($sub) => $sub
                    ->whereRaw('LOWER(title_id) LIKE ?', ['%'.mb_strtolower($term).'%'])
                    ->orWhereRaw('LOWER(title_en) LIKE ?', ['%'.mb_strtolower($term).'%']),
            ))
            ->when($filters['category'] ?? null, fn ($query, $slug) => $query->whereHas(
                'category',
                fn ($sub) => $sub->where('slug', $slug),
            ))
            ->latest('published_at')
            ->paginate(9)
            ->withQueryString();

        return Inertia::render('Site/News/Index', [
            // The list component carries the bilingual shape from the previous
            // API, so it is sent as-is rather than pre-localised.
            'articles' => $articles->getCollection()->map(fn (Article $article) => $this->shape($article))->all(),
            'page' => $articles->currentPage(),
            'totalPages' => $articles->lastPage(),
            'filters' => $filters,
            // Only categories that actually have something published: an empty
            // filter chip is a dead end for the reader.
            'categories' => Category::whereHas('articles', fn ($query) => $query->published())
                ->orderBy('name_id')
                ->get()
                ->map(fn (Category $category) => [
                    'id' => (string) $category->id,
                    'slug' => $category->slug,
                    'nameId' => $category->name_id,
                    'nameEn' => $category->name_en,
                ]),
            'seo' => [
                ...Seo::links($locale, '/news'),
                'jsonLd' => Seo::breadcrumb([
                    ['name' => __('nav.home'), 'path' => ''],
                    ['name' => __('nav.news')],
                ], $locale),
            ],
        ]);
    }

    public function show(string $locale, string $slug): Response
    {
        // published() rather than findOrFail on the slug alone: a draft must
        // 404 for the public, not render because its URL was guessed.
        $article = Article::published()
            ->with(['category', 'author:id,name', 'tags:id,name,slug'])
            ->where('slug', $slug)
            ->firstOrFail();

        return Inertia::render('Site/News/Show', [
            'article' => [
                'slug' => $article->slug,
                'title' => $article->localized('title', $locale),
                'excerpt' => $article->localized('excerpt', $locale),
                'content' => $article->localized('content', $locale),
                'cover_image' => $article->cover_image,
                'published_at' => $article->published_at?->toIso8601String(),
                'updated_at' => $article->updated_at?->toIso8601String(),
                'category' => $article->category?->localized('name', $locale),
                'category_slug' => $article->category?->slug,
                'author' => $article->author?->name,
                'tags' => $article->tags->pluck('name'),
            ],
            'related' => Article::published()
                ->where('id', '!=', $article->id)
                ->when($article->category_id, fn ($query) => $query->where('category_id', $article->category_id))
                ->latest('published_at')
                ->take(3)
                ->get()
                ->map(fn (Article $item) => [
                    'slug' => $item->slug,
                    'title' => $item->localized('title', $locale),
                    'cover_image' => $item->cover_image,
                    'published_at' => $item->published_at?->toIso8601String(),
                ]),
            'seo' => [
                ...Seo::links($locale, "/news/{$article->slug}"),
                'jsonLd' => Seo::article($article, $locale),
            ],
        ]);
    }

    /**
     * The bilingual article shape the list components already consume.
     *
     * @return array<string, mixed>
     */
    private function shape(Article $article): array
    {
        return [
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
            'category' => $article->category ? [
                'id' => (string) $article->category->id,
                'slug' => $article->category->slug,
                'nameId' => $article->category->name_id,
                'nameEn' => $article->category->name_en,
            ] : null,
            'createdAt' => $article->created_at?->toIso8601String(),
            'updatedAt' => $article->updated_at?->toIso8601String(),
        ];
    }
}
