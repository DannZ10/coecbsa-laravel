<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Media extends Model
{
    // Laravel would pluralise this to "medias".
    protected $table = 'media';

    protected $fillable = [
        'url', 'type', 'filename', 'size', 'width', 'height',
        'alt_id', 'alt_en', 'uploaded_by',
    ];

    protected function casts(): array
    {
        return ['size' => 'integer', 'width' => 'integer', 'height' => 'integer'];
    }

    /** @return BelongsTo<User, $this> */
    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }
}
