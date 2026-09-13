<?php

namespace App\Models;

use App\Models\Concerns\HasBilingualText;
use Illuminate\Database\Eloquent\Model;

class Partner extends Model
{
    use HasBilingualText;

    protected $fillable = [
        'slug', 'name_id', 'name_en', 'group_label_id', 'group_label_en',
        'logo_url', 'href', 'position',
    ];

    protected function casts(): array
    {
        return ['position' => 'integer'];
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }
}
