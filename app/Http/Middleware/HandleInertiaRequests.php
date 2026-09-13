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

            // The message catalogue for the active locale, minus the half this
            // request cannot use: the public site never reads `admin.*` and the
            // CMS never reads the marketing copy under `content`. Sending both
            // would put ~26 KB of JSON in every page's HTML.
            'translations' => fn () => self::messages(
                app()->getLocale(),
                $request->is('admin', 'admin/*'),
            ),

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
    private static function messages(string $locale, bool $admin): array
    {
        static $cache = [];

        $key = $locale.($admin ? ':admin' : ':public');

        if (isset($cache[$key])) {
            return $cache[$key];
        }

        $path = lang_path("{$locale}.json");

        if (! is_file($path)) {
            return $cache[$key] = [];
        }

        $decoded = json_decode((string) file_get_contents($path), true);

        if (! is_array($decoded)) {
            return $cache[$key] = [];
        }

        if ($admin) {
            // The panel still needs the shared `nav`/`common` namespaces, but
            // not the marketing copy the public pages render.
            unset($decoded['content']);
        } else {
            unset($decoded['admin']);
        }

        return $cache[$key] = $decoded;
    }
}
