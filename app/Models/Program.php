<?php

namespace App\Models;

use App\Enums\ProgramStatus;
use App\Models\Concerns\HasBilingualText;
use Illuminate\Database\Eloquent\Model;

class Program extends Model
{
    use HasBilingualText;

    protected $fillable = [
        'slug', 'tag_label_id', 'tag_label_en', 'title_id', 'title_en',
        'place_id', 'place_en', 'desc_id', 'desc_en', 'funder_id', 'funder_en',
        'image', 'details_id', 'details_en', 'status', 'position',
    ];

    protected function casts(): array
    {
        return ['status' => ProgramStatus::class, 'position' => 'integer'];
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }
}
