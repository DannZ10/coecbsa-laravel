<?php

namespace App\Models;

use App\Models\Concerns\HasBilingualText;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Album extends Model
{
    use HasBilingualText;

    protected $fillable = ['slug', 'name_id', 'name_en'];

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    /** @return HasMany<GalleryItem, $this> */
    public function items(): HasMany
    {
        return $this->hasMany(GalleryItem::class);
    }
}
