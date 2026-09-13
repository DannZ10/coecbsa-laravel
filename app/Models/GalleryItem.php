<?php

namespace App\Models;

use App\Models\Concerns\HasBilingualText;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GalleryItem extends Model
{
    use HasBilingualText;

    protected $fillable = [
        'album_id', 'title_id', 'title_en', 'caption_id', 'caption_en',
        'image_url', 'thumbnail_url', 'position',
    ];

    /** @return BelongsTo<Album, $this> */
    public function album(): BelongsTo
    {
        return $this->belongsTo(Album::class);
    }
}
