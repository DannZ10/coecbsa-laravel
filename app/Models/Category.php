<?php

namespace App\Models;

use App\Models\Concerns\HasBilingualText;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    use HasBilingualText;

    protected $fillable = ['slug', 'name_id', 'name_en'];

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    /** @return HasMany<Article, $this> */
    public function articles(): HasMany
    {
        return $this->hasMany(Article::class);
    }
}
