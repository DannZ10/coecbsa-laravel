<?php

namespace App\Providers;

use App\Models\Album;
use App\Models\Article;
use App\Models\Category;
use App\Models\GalleryItem;
use App\Models\ImpactSdg;
use App\Models\ImpactStat;
use App\Models\Partner;
use App\Models\Program;
use App\Models\User;
use App\Support\SiteCache;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /** Every model whose rows the public pages cache. */
    private const CACHED_MODELS = [
        Article::class,
        Album::class,
        Category::class,
        GalleryItem::class,
        ImpactSdg::class,
        ImpactStat::class,
        Partner::class,
        Program::class,
    ];

    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        // Managing operators is the one capability an editor must not have.
        // Defined as a gate rather than checked inline so the route, the
        // controller and the sidebar all read the same rule.
        Gate::define('manage-users', fn (User $user) => $user->isSuperAdmin());

        // Saving anything the public site caches drops those keys, so an editor
        // sees their change on the live page immediately rather than waiting
        // out the TTL and reporting the CMS as broken.
        foreach (self::CACHED_MODELS as $model) {
            $model::saved(fn (Model $instance) => SiteCache::flush());
            $model::deleted(fn (Model $instance) => SiteCache::flush());
        }
    }
}
