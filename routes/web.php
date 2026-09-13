<?php

use App\Http\Controllers\Admin\ArticleController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\GalleryController;
use App\Http\Controllers\Admin\ImpactController;
use App\Http\Controllers\Admin\InboxController;
use App\Http\Controllers\Admin\MediaController;
use App\Http\Controllers\Admin\PartnerController;
use App\Http\Controllers\Admin\ProgramController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Admin\UserController;
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

        Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

        // Bound by id, not by the model's slug route key: editing a slug would
        // otherwise change the URL of the row being edited mid-request.
        Route::get('categories', [CategoryController::class, 'index'])->name('categories');
        Route::post('categories', [CategoryController::class, 'store']);
        Route::put('categories/{category:id}', [CategoryController::class, 'update']);
        Route::delete('categories/{category:id}', [CategoryController::class, 'destroy']);

        Route::get('news', [ArticleController::class, 'index'])->name('news');
        Route::get('news/create', [ArticleController::class, 'create'])->name('news.create');
        Route::post('news', [ArticleController::class, 'store']);
        Route::get('news/{article:id}/edit', [ArticleController::class, 'edit'])->name('news.edit');
        Route::put('news/{article:id}', [ArticleController::class, 'update']);
        Route::delete('news/{article:id}', [ArticleController::class, 'destroy']);

        // Three routes rather than one page: the previous CMS put programs,
        // partners and impact in a single 910-line screen, where a validation
        // failure in one section discarded unsaved edits in the others.
        Route::redirect('content', '/admin/content/programs');
        Route::get('content/programs', [ProgramController::class, 'index'])->name('content.programs');
        Route::post('content/programs', [ProgramController::class, 'store']);
        Route::put('content/programs/{program:id}', [ProgramController::class, 'update']);
        Route::delete('content/programs/{program:id}', [ProgramController::class, 'destroy']);

        Route::get('content/partners', [PartnerController::class, 'index'])->name('content.partners');
        Route::post('content/partners', [PartnerController::class, 'store']);
        Route::put('content/partners/{partner:id}', [PartnerController::class, 'update']);
        Route::delete('content/partners/{partner:id}', [PartnerController::class, 'destroy']);

        Route::get('content/impact', [ImpactController::class, 'index'])->name('content.impact');
        Route::put('content/impact', [ImpactController::class, 'update']);

        Route::get('media', [MediaController::class, 'index'])->name('media');
        Route::post('media', [MediaController::class, 'store']);
        Route::put('media/{media:id}', [MediaController::class, 'update']);
        Route::delete('media/{media:id}', [MediaController::class, 'destroy']);

        Route::get('gallery', [GalleryController::class, 'index'])->name('gallery');
        Route::post('gallery/albums', [GalleryController::class, 'storeAlbum']);
        Route::put('gallery/albums/{album:id}', [GalleryController::class, 'updateAlbum']);
        Route::delete('gallery/albums/{album:id}', [GalleryController::class, 'destroyAlbum']);
        Route::post('gallery/items', [GalleryController::class, 'storeItem']);
        Route::put('gallery/items/{item:id}', [GalleryController::class, 'updateItem']);
        Route::delete('gallery/items/{item:id}', [GalleryController::class, 'destroyItem']);

        Route::get('contact', [InboxController::class, 'index'])->name('contact');
        Route::put('contact/{message:id}', [InboxController::class, 'update']);
        Route::delete('contact/{message:id}', [InboxController::class, 'destroy']);

        Route::get('settings', [SettingController::class, 'index'])->name('settings');
        Route::put('settings/profile', [SettingController::class, 'updateProfile']);
        Route::put('settings/password', [SettingController::class, 'updatePassword']);

        // Managing operators is the one capability an editor must not have.
        Route::middleware('can:manage-users')->group(function () {
            Route::get('users', [UserController::class, 'index'])->name('users');
            Route::post('users', [UserController::class, 'store']);
            Route::put('users/{user:id}', [UserController::class, 'update']);
            Route::delete('users/{user:id}', [UserController::class, 'destroy']);
        });

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
