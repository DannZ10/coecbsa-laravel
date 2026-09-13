<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

/**
 * Google sign-in, written against Laravel's HTTP client rather than Socialite.
 *
 * Socialite requires Guzzle ^6|^7 while this app ships Guzzle 8, and the
 * resolvable versions pull firebase/php-jwt releases under advisory
 * GHSA-2x45-7fc3-mxwq — a JWT library we would only need in order to verify an
 * id_token. We do not need one: the profile is read from Google's userinfo
 * endpoint in a server-to-server TLS call, so there is no third-party-held
 * token whose signature must be checked.
 *
 * The callback links to an existing user by verified email and never creates
 * an account, so the admin list cannot be joined by anyone with a Google
 * address.
 */
class GoogleController extends Controller
{
    private const AUTH_ENDPOINT = 'https://accounts.google.com/o/oauth2/v2/auth';

    private const TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token';

    private const USERINFO_ENDPOINT = 'https://openidconnect.googleapis.com/v1/userinfo';

    public function redirect(Request $request): RedirectResponse
    {
        if (! $this->configured()) {
            return redirect()->route('admin.login')
                ->with('error', __('auth.google_unavailable'));
        }

        $state = Str::random(40);
        $verifier = Str::random(96);

        $request->session()->put('google_oauth_state', $state);
        $request->session()->put('google_oauth_verifier', $verifier);

        $query = http_build_query([
            'client_id' => config('coecbsa.google.client_id'),
            'redirect_uri' => config('coecbsa.google.redirect_uri'),
            'response_type' => 'code',
            'scope' => 'openid email profile',
            'state' => $state,
            // PKCE. The client secret alone would satisfy Google, but a code
            // intercepted at the redirect is worthless without the verifier.
            'code_challenge' => rtrim(strtr(base64_encode(hash('sha256', $verifier, true)), '+/', '-_'), '='),
            'code_challenge_method' => 'S256',
            'prompt' => 'select_account',
        ]);

        return redirect()->away(self::AUTH_ENDPOINT.'?'.$query);
    }

    public function callback(Request $request): RedirectResponse
    {
        $state = $request->session()->pull('google_oauth_state');
        $verifier = $request->session()->pull('google_oauth_verifier');

        // Compared in constant time, and only against a value this session
        // itself issued: without it, an attacker could complete the flow in a
        // victim's browser with their own code.
        if (! is_string($state) || ! is_string($request->query('state'))
            || ! hash_equals($state, (string) $request->query('state'))) {
            return $this->fail('state mismatch');
        }

        if (! $request->filled('code') || ! is_string($verifier)) {
            return $this->fail('missing authorization code');
        }

        $token = Http::asForm()->post(self::TOKEN_ENDPOINT, [
            'client_id' => config('coecbsa.google.client_id'),
            'client_secret' => config('coecbsa.google.client_secret'),
            'code' => $request->string('code')->toString(),
            'code_verifier' => $verifier,
            'grant_type' => 'authorization_code',
            'redirect_uri' => config('coecbsa.google.redirect_uri'),
        ]);

        if ($token->failed()) {
            return $this->fail('token exchange failed');
        }

        $profile = Http::withToken((string) $token->json('access_token'))
            ->get(self::USERINFO_ENDPOINT);

        if ($profile->failed()) {
            return $this->fail('userinfo request failed');
        }

        $email = $profile->json('email');
        $googleId = $profile->json('sub');

        // An unverified Google address proves nothing: anyone can put someone
        // else's address on an account they own until Google confirms it.
        if (! is_string($email) || ! is_string($googleId) || $profile->json('email_verified') !== true) {
            return $this->fail('unverified Google account');
        }

        $user = User::where('email', $email)->first();

        if (! $user || ! $user->is_active) {
            return $this->fail("no active account for {$email}");
        }

        // Bind the Google subject on first use, then require it to keep
        // matching. A rebound subject for the same address would mean the
        // address changed hands.
        if ($user->google_id === null) {
            $user->google_id = $googleId;
        } elseif (! hash_equals($user->google_id, $googleId)) {
            return $this->fail("google subject changed for {$email}");
        }

        $user->last_login_at = now();
        $user->save();

        Auth::login($user, remember: true);
        $request->session()->regenerate();

        return redirect()->intended(route('admin.dashboard'));
    }

    private function configured(): bool
    {
        return (bool) config('coecbsa.google.client_id')
            && (bool) config('coecbsa.google.client_secret')
            && (bool) config('coecbsa.google.redirect_uri');
    }

    /** One opaque message to the user; the reason goes to the log only. */
    private function fail(string $reason): RedirectResponse
    {
        Log::warning('Google sign-in rejected', ['reason' => $reason]);

        return redirect()->route('admin.login')->with('error', __('auth.google_failed'));
    }
}
