<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),

            'auth' => [
                // Only what the CMS chrome renders. Never the whole model: it
                // would put the password hash and the Google id into the HTML
                // of every admin page.
                'user' => fn () => $request->user() ? [
                    'id' => $request->user()->id,
                    'name' => $request->user()->name,
                    'email' => $request->user()->email,
                    'role' => $request->user()->role,
                ] : null,
            ],

            'locale' => app()->getLocale(),

            // The whole message catalogue for the active locale. It is ~4 KB
            // and every page reads from it, so splitting it per page would add
            // a request without saving bytes worth measuring.
            'translations' => fn () => self::messages(app()->getLocale()),

            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
        ];
    }

    /**
     * Nested message catalogue for one locale, read from lang/{locale}.json.
     *
     * Laravel's own JSON translations are flat key => string; these are nested
     * namespaces ported from the Next app's next-intl messages, so they are
     * read as data rather than through the translator.
     *
     * @return array<string, mixed>
     */
    private static function messages(string $locale): array
    {
        static $cache = [];

        if (isset($cache[$locale])) {
            return $cache[$locale];
        }

        $path = lang_path("{$locale}.json");

        if (! is_file($path)) {
            return $cache[$locale] = [];
        }

        $decoded = json_decode((string) file_get_contents($path), true);

        return $cache[$locale] = is_array($decoded) ? $decoded : [];
    }
}
