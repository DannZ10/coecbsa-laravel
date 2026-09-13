<?php

namespace App\Http\Controllers\Admin;

use App\Enums\Role;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Users', [
            'users' => User::orderBy('name')->get()->map(fn (User $user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role->value,
                'is_active' => $user->is_active,
                'has_password' => $user->password !== null,
                'has_google' => $user->google_id !== null,
                'last_login_at' => $user->last_login_at?->toIso8601String(),
            ]),
            'roles' => array_column(Role::cases(), 'value'),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:190', Rule::unique('users', 'email')],
            'role' => ['required', Rule::enum(Role::class)],
            // Optional: an operator who will only ever sign in with Google
            // needs no password, and a null hash fails Auth::attempt closed.
            'password' => ['nullable', 'confirmed', Password::min(12)],
        ]);

        User::create([
            ...$data,
            'password' => $data['password'] ? Hash::make($data['password']) : null,
            'is_active' => true,
        ]);

        return back()->with('success', __('flash.created'));
    }

    public function update(Request $request, User $user): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:190', Rule::unique('users', 'email')->ignore($user)],
            'role' => ['required', Rule::enum(Role::class)],
            'is_active' => ['required', 'boolean'],
            'password' => ['nullable', 'confirmed', Password::min(12)],
        ]);

        // A super admin must not be able to demote or deactivate themselves:
        // the last one to do so would lock the panel for everyone.
        if ($user->is($request->user())) {
            $data['role'] = $user->role->value;
            $data['is_active'] = true;
        }

        $user->fill([
            'name' => $data['name'],
            'email' => $data['email'],
            'role' => $data['role'],
            'is_active' => $data['is_active'],
        ]);

        if ($data['password']) {
            $user->password = Hash::make($data['password']);
        }

        $user->save();

        return back()->with('success', __('flash.updated'));
    }

    public function destroy(Request $request, User $user): RedirectResponse
    {
        if ($user->is($request->user())) {
            return back()->with('error', __('flash.cannot_delete_self'));
        }

        // Articles hold author_id with restrictOnDelete, so an operator who has
        // written anything is deactivated rather than removed. That keeps the
        // byline intact on pages that are already published.
        if ($user->articles()->exists()) {
            $user->update(['is_active' => false]);

            return back()->with('success', __('flash.deactivated'));
        }

        $user->delete();

        return back()->with('success', __('flash.deleted'));
    }
}
