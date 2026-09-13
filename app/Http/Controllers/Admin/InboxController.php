<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class InboxController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = $request->validate([
            'q' => ['nullable', 'string', 'max:120'],
            'unread' => ['nullable', 'in:1'],
        ]);

        $messages = ContactMessage::query()
            ->when($filters['q'] ?? null, fn ($query, $term) => $query->where(
                fn ($sub) => $sub
                    ->whereRaw('LOWER(name) LIKE ?', ['%'.mb_strtolower($term).'%'])
                    ->orWhereRaw('LOWER(email) LIKE ?', ['%'.mb_strtolower($term).'%'])
                    ->orWhereRaw('LOWER(subject) LIKE ?', ['%'.mb_strtolower($term).'%']),
            ))
            ->when($filters['unread'] ?? null, fn ($query) => $query->where('is_read', false))
            ->latest('created_at')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Admin/Inbox', [
            'messages' => $messages,
            'filters' => $filters,
            // Counts the whole inbox, not the current page: a badge that only
            // counted this page would read 0 on page two.
            'unreadTotal' => ContactMessage::where('is_read', false)->count(),
        ]);
    }

    public function update(Request $request, ContactMessage $message): RedirectResponse
    {
        $message->update($request->validate([
            'is_read' => ['required', 'boolean'],
        ]));

        return back();
    }

    public function destroy(ContactMessage $message): RedirectResponse
    {
        $message->delete();

        return back()->with('success', __('flash.deleted'));
    }
}
