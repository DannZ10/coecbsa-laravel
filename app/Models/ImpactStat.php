<?php

namespace App\Models;

use App\Models\Concerns\HasBilingualText;
use Illuminate\Database\Eloquent\Model;

class ImpactStat extends Model
{
    use HasBilingualText;

    protected $fillable = ['stat_key', 'value', 'label_id', 'label_en', 'position'];

    protected function casts(): array
    {
        return ['position' => 'integer'];
    }
}
