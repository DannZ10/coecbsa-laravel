<?php

namespace App\Support;

use App\Http\Middleware\SetLocale;
use Illuminate\Support\Facades\Cache;

/**
 * Invalidates the public site's cached content.
 *
 * The keys are enumerated rather than flushed by tag because the database and
 * file cache stores do not support tags, and adding Redis purely to tag five
 * keys would be a service to run for no other reason.
 */
class SiteCache
{
    private const GROUPS = ['programs', 'partners', 'impact', 'gallery', 'latest'];

    public static function flush(): void
    {
        foreach (self::GROUPS as $group) {
            foreach (SetLocale::SUPPORTED as $locale) {
                Cache::forget("site:{$group}:{$locale}");
            }
        }
    }
}
