<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\View;
use Illuminate\Support\Facades\Vite;
use Symfony\Component\HttpFoundation\Response;

/**
 * Security headers, ported from the Next app's next.config.ts.
 *
 * One difference, and it is an improvement: that build had to keep
 * `script-src 'unsafe-inline'` because the App Router streams inline RSC
 * payload scripts. Inertia ships its page data in a `data-page` attribute, not
 * in a script, so every script tag we emit can carry a per-request nonce and
 * 'unsafe-inline' is gone from script-src.
 */
class SecurityHeaders
{
    public function handle(Request $request, Closure $next): Response
    {
        // Laravel hands the same nonce to @vite; the root view reads it from
        // the shared variable for the JSON-LD tag.
        $nonce = Vite::useCspNonce();
        View::share('cspNonce', $nonce);

        $response = $next($request);

        foreach ($this->headers($nonce) as $key => $value) {
            $response->headers->set($key, $value);
        }

        return $response;
    }

    /**
     * @return array<string, string>
     */
    private function headers(string $nonce): array
    {
        $headers = [
            'Content-Security-Policy' => $this->contentSecurityPolicy($nonce),
            'X-Content-Type-Options' => 'nosniff',
            'X-Frame-Options' => 'DENY',
            'Referrer-Policy' => 'strict-origin-when-cross-origin',
            'Permissions-Policy' => 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
        ];

        // Keyed off the canonical app URL rather than the environment name:
        // `php artisan serve` can run with APP_ENV=production locally too, and
        // sending HSTS from http://localhost would pin the developer's browser
        // to https://localhost for two years.
        if ($this->secure()) {
            $headers['Strict-Transport-Security'] = 'max-age=63072000; includeSubDomains; preload';
        }

        return $headers;
    }

    /** Whether the canonical origin is https; gates HSTS and the upgrade directive. */
    private function secure(): bool
    {
        return str_starts_with((string) config('app.url'), 'https://');
    }

    private function contentSecurityPolicy(string $nonce): string
    {
        $scriptSrc = ["'self'", "'nonce-{$nonce}'", "'strict-dynamic'"];
        $connectSrc = ["'self'"];
        $styleSrc = ["'self'", "'unsafe-inline'"];

        // Vite's dev server injects its client over HMR from another origin and
        // rewrites styles at runtime; neither survives the production policy.
        if (app()->environment('local')) {
            $devOrigin = 'http://localhost:5173';
            $scriptSrc[] = $devOrigin;
            $connectSrc[] = $devOrigin;
            $connectSrc[] = 'ws://localhost:5173';
            $styleSrc[] = $devOrigin;
        }

        // `https:` rather than the media bucket alone. The CMS lets an editor
        // paste any image URL and the seeded content points at a stock photo
        // host, so a bucket-only policy silently breaks every one of them —
        // which is what a Lighthouse run caught. Images cannot execute, so this
        // is a display permission, not a script one. The storage origin stays
        // listed for the plain-http local case.
        $storage = $this->storageOrigin();
        $imgSrc = array_filter(["'self'", 'data:', 'blob:', 'https:', $storage]);

        return implode('; ', array_filter([
            "default-src 'self'",
            'script-src '.implode(' ', $scriptSrc),
            'style-src '.implode(' ', $styleSrc),
            'img-src '.implode(' ', $imgSrc),
            "font-src 'self' data:",
            // The contact page embeds a Google Maps iframe; without frame-src it
            // falls back to default-src and the map is blocked.
            'frame-src https://www.google.com',
            'connect-src '.implode(' ', $connectSrc),
            "frame-ancestors 'none'",
            "object-src 'none'",
            "base-uri 'self'",
            "form-action 'self'",
            // Only meaningful on an https origin. On http it rewrites the page's
            // own same-origin subresource requests, which is why Lighthouse
            // could not download robots.txt here.
            $this->secure() ? 'upgrade-insecure-requests' : null,
        ]));
    }

    /**
     * Origin that serves uploaded media, derived from the same config the
     * upload pipeline writes to, so a deployment cannot end up with a policy
     * that blocks its own images.
     */
    private function storageOrigin(): ?string
    {
        $url = config('filesystems.disks.media.url') ?? config('filesystems.disks.public.url');

        if (! is_string($url) || $url === '') {
            return null;
        }

        $parts = parse_url($url);

        return isset($parts['scheme'], $parts['host'])
            ? $parts['scheme'].'://'.$parts['host'].(isset($parts['port']) ? ':'.$parts['port'] : '')
            : null;
    }
}
