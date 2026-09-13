<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    /** Both locales are always present in the URL, so hreflang stays unambiguous. */
    public const SUPPORTED = ['id', 'en'];

    public const DEFAULT = 'id';

    public function handle(Request $request, Closure $next): Response
    {
        $locale = $request->route('locale');

        if (! is_string($locale) || ! in_array($locale, self::SUPPORTED, true)) {
            // The admin panel is not locale-prefixed; it follows the operator's
            // own preference, kept in the session by the language switch.
            $locale = $request->session()->get('admin_locale', self::DEFAULT);
            $locale = in_array($locale, self::SUPPORTED, true) ? $locale : self::DEFAULT;
        }

        app()->setLocale($locale);

        return $next($request);
    }
}
