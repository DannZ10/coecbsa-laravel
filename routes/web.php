<?php

use App\Http\Controllers\Auth\GoogleController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Middleware\SetLocale;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Admin
|--------------------------------------------------------------------------
|
| Registered before the locale group. The admin panel is not locale-prefixed;
| it follows the operator's own preference, kept in the session.
|
*/

Route::prefix('admin')->name('admin.')->group(function () {
    Route::middleware('guest')->group(function () {
        Route::get('login', [LoginController::class, 'create'])->name('login');
        Route::post('login', [LoginController::class, 'store'])->middleware('throttle:20,1');

        Route::get('auth/google', [GoogleController::class, 'redirect'])->name('google');
        Route::get('auth/google/callback', [GoogleController::class, 'callback'])->name('google.callback');
    });

    Route::middleware('auth')->group(function () {
        Route::post('logout', [LoginController::class, 'destroy'])->name('logout');

        // The panel carries no locale segment, so the operator's choice is kept
        // in their session and SetLocale reads it back on every request.
        Route::post('locale', function (Request $request) {
            $validated = $request->validate([
                'locale' => ['required', 'string', Rule::in(SetLocale::SUPPORTED)],
            ]);

            $request->session()->put('admin_locale', $validated['locale']);

            return back();
        })->name('locale');

        Route::get('/', fn () => Inertia::render('Admin/Dashboard'))->name('dashboard');
    });
});

/*
|--------------------------------------------------------------------------
| Public site
|--------------------------------------------------------------------------
|
| Both locales are always in the URL so hreflang and the per-language
| sitemaps stay unambiguous. `/` redirects to the default.
|
*/

Route::redirect('/', '/'.SetLocale::DEFAULT);

Route::prefix('{locale}')
    ->whereIn('locale', SetLocale::SUPPORTED)
    ->group(function () {
        Route::get('/', fn () => Inertia::render('Welcome', [
            'laravel' => app()->version(),
            'php' => PHP_VERSION,
        ]))->name('home');
    });
