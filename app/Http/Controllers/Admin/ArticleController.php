<?php

namespace App\Http\Controllers\Admin;

use App\Enums\ArticleStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ArticleRequest;
use App\Models\Article;
use App\Models\Category;
use App\Models\Tag;
use App\Services\HtmlSanitizer;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ArticleController extends Controller
{
    public function __construct(private readonly HtmlSanitizer $sanitizer) {}

    public function index(Request $request): Response
    {
        $filters = $request->validate([
            'q' => ['nullable', 'string', 'max:120'],
            'status' => ['nullable', 'string'],
            'category' => ['nullable', 'string'],
        ]);

        $articles = Article::query()
            ->with(['category:id,name_id,name_en', 'author:id,name'])
            ->when($filters['q'] ?? null, fn ($query, $term) => $query->where(
                fn ($sub) => $sub
                    // Both sides lowered so the filter behaves identically
                    // whichever database the deployment runs on: MySQL's
                    // default collation ignores case, Postgres' LIKE does not.
                    ->whereRaw('LOWER(title_id) LIKE ?', ['%'.mb_strtolower($term).'%'])
                    ->orWhereRaw('LOWER(title_en) LIKE ?', ['%'.mb_strtolower($term).'%']),
            ))
            ->when($filters['status'] ?? null, fn ($query, $status) => $query->where('status', $status))
            ->when($filters['category'] ?? null, fn ($query, $slug) => $query->whereHas(
                'category',
                fn ($sub) => $sub->where('slug', $slug),
            ))
            ->latest('created_at')
            ->paginate(15)
            ->withQueryString()
            ->through(fn (Article $article) => [
                'id' => $article->id,
                'slug' => $article->slug,
                'title_id' => $article->title_id,
                'title_en' => $article->title_en,
                'status' => $article->status->value,
                'published_at' => $article->published_at?->toIso8601String(),
                'category' => $article->category?->localized('name'),
                'author' => $article->author?->name,
                'cover_image' => $article->cover_image,
            ]);

        return Inertia::render('Admin/News/Index', [
            'articles' => $articles,
            'filters' => $filters,
            'categories' => $this->categoryOptions(),
            'statuses' => array_column(ArticleStatus::cases(), 'value'),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/News/Form', [
            'article' => null,
            'categories' => $this->categoryOptions(),
            'tags' => $this->tagOptions(),
        ]);
    }

    public function edit(Article $article): Response
    {
        $article->load('tags:id');

        return Inertia::render('Admin/News/Form', [
            'article' => [
                'id' => $article->id,
                'slug' => $article->slug,
                'title_id' => $article->title_id,
                'title_en' => $article->title_en ?? '',
                'excerpt_id' => $article->excerpt_id ?? '',
                'excerpt_en' => $article->excerpt_en ?? '',
                'content_id' => $article->content_id,
                'content_en' => $article->content_en ?? '',
                'cover_image' => $article->cover_image ?? '',
                'status' => $article->status->value,
                // datetime-local wants this shape, not ISO 8601 with a zone.
                'published_at' => $article->published_at?->format('Y-m-d\TH:i'),
                'category_id' => $article->category_id,
                'tags' => $article->tags->pluck('id')->all(),
            ],
            'categories' => $this->categoryOptions(),
            'tags' => $this->tagOptions(),
        ]);
    }

    public function store(ArticleRequest $request): RedirectResponse
    {
        $article = Article::create([
            ...$this->payload($request),
            'author_id' => $request->user()->id,
        ]);

        $article->tags()->sync($request->input('tags', []));

        return redirect()
            ->route('admin.news.edit', $article)
            ->with('success', __('flash.created'));
    }

    public function update(ArticleRequest $request, Article $article): RedirectResponse
    {
        $article->update($this->payload($request));
        $article->tags()->sync($request->input('tags', []));

        return back()->with('success', __('flash.updated'));
    }

    public function destroy(Article $article): RedirectResponse
    {
        $article->delete();

        return redirect()->route('admin.news')->with('success', __('flash.deleted'));
    }

    /**
     * @return array<string, mixed>
     */
    private function payload(ArticleRequest $request): array
    {
        $data = $request->safe()->except('tags');
        $status = ArticleStatus::from($data['status']);

        // Sanitised on the way in, so the stored HTML is already safe and every
        // consumer — the public page, a feed, an export — is covered without
        // each having to remember to clean it.
        $data['content_id'] = $this->sanitizer->clean($data['content_id']);
        $data['content_en'] = $this->sanitizer->clean($data['content_en'] ?? null);

        // Publishing without picking a moment means now. Leaving it null would
        // hide the article from the public scope, which checks the date.
        if ($status === ArticleStatus::Published && empty($data['published_at'])) {
            $data['published_at'] = now();
        }

        if ($status === ArticleStatus::Draft) {
            $data['published_at'] = null;
        }

        return $data;
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function categoryOptions(): array
    {
        return Category::orderBy('name_id')
            ->get()
            ->map(fn (Category $category) => [
                'id' => $category->id,
                'slug' => $category->slug,
                'name' => $category->localized('name'),
            ])
            ->all();
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function tagOptions(): array
    {
        return Tag::orderBy('name')->get(['id', 'name'])->all();
    }
}
