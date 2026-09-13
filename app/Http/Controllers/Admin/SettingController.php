<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class SettingController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('Admin/Settings', [
            'profile' => [
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role->value,
                'has_password' => $user->password !== null,
                'has_google' => $user->google_id !== null,
            ],
        ]);
    }

    public function updateProfile(Request $request): RedirectResponse
    {
        $request->user()->update($request->validate([
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:190', Rule::unique('users', 'email')->ignore($request->user())],
        ]));

        return back()->with('success', __('flash.updated'));
    }

    public function updatePassword(Request $request): RedirectResponse
    {
        $user = $request->user();

        $data = $request->validate([
            // Required only when one is already set. A Google-only operator has
            // no current password to prove, and demanding one would leave them
            // unable to ever set the first.
            'current_password' => [
                $user->password === null ? 'nullable' : 'required',
                'current_password',
            ],
            'password' => ['required', 'confirmed', Password::min(12)],
        ]);

        $user->update(['password' => Hash::make($data['password'])]);

        return back()->with('success', __('flash.updated'));
    }
}
