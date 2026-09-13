<?php

namespace App\Models;

use App\Models\Concerns\HasBilingualText;
use Illuminate\Database\Eloquent\Model;

class ImpactSdg extends Model
{
    use HasBilingualText;

    protected $table = 'impact_sdgs';

    protected $fillable = [
        'code', 'label_id', 'label_en', 'description_id', 'description_en', 'position',
    ];

    protected function casts(): array
    {
        return ['position' => 'integer'];
    }
}
