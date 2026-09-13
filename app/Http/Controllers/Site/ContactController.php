<?php

namespace App\Http\Controllers\Site;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use App\Support\Seo;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ContactController extends Controller
{
    public function show(string $locale): Response
    {
        return Inertia::render('Site/Contact', [
            'seo' => [
                ...Seo::links($locale, '/contact'),
                'jsonLd' => Seo::breadcrumb([
                    ['name' => __('nav.home'), 'path' => ''],
                    ['name' => __('nav.contact')],
                ], $locale),
            ],
        ]);
    }

    /**
     * The only write on the site that does not require a session, and so the
     * only one that needs its own rate limit. The throttle is applied on the
     * route, keyed by address.
     */
    public function store(Request $request, string $locale): RedirectResponse
    {
        ContactMessage::create($request->validate([
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:190'],
            'subject' => ['nullable', 'string', 'max:200'],
            'message' => ['required', 'string', 'min:10', 'max:4000'],
        ]));

        return back()->with('success', __('contact.sent'));
    }
}
