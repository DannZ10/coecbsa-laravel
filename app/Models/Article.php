<?php

namespace App\Models;

use App\Enums\ArticleStatus;
use App\Models\Concerns\HasBilingualText;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Article extends Model
{
    /** @use HasFactory<\Database\Factories\ArticleFactory> */
    use HasBilingualText, HasFactory;

    protected $fillable = [
        'slug', 'title_id', 'title_en', 'excerpt_id', 'excerpt_en',
        'content_id', 'content_en', 'cover_image', 'status', 'published_at',
        'author_id', 'category_id',
    ];

    protected function casts(): array
    {
        return [
            'status' => ArticleStatus::class,
            'published_at' => 'datetime',
        ];
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    /** @return BelongsTo<User, $this> */
    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    /** @return BelongsTo<Category, $this> */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /** @return BelongsToMany<Tag, $this> */
    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class);
    }

    /**
     * Publicly visible articles.
     *
     * A SCHEDULED article whose time has passed is public; a PUBLISHED one with
     * a future date is not. Both checks live here so no controller can forget
     * one and leak a draft.
     *
     * @param  Builder<Article>  $query
     */
    public function scopePublished(Builder $query): void
    {
        $query->whereIn('status', [ArticleStatus::Published, ArticleStatus::Scheduled])
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now());
    }
}
