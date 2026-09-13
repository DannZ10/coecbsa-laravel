<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Album;
use App\Models\GalleryItem;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class GalleryController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Gallery', [
            'albums' => Album::withCount('items')->orderBy('name_id')->get(),
            'items' => GalleryItem::with('album:id,name_id')
                ->orderBy('position')
                ->orderBy('id')
                ->get(),
        ]);
    }

    public function storeAlbum(Request $request): RedirectResponse
    {
        Album::create($this->albumRules($request));

        return back()->with('success', __('flash.created'));
    }

    public function updateAlbum(Request $request, Album $album): RedirectResponse
    {
        $album->update($this->albumRules($request, $album));

        return back()->with('success', __('flash.updated'));
    }

    public function destroyAlbum(Album $album): RedirectResponse
    {
        // Items survive and fall back to "no album": the foreign key is
        // nullOnDelete, so removing a grouping never deletes photographs.
        $album->delete();

        return back()->with('success', __('flash.deleted'));
    }

    public function storeItem(Request $request): RedirectResponse
    {
        GalleryItem::create($this->itemRules($request));

        return back()->with('success', __('flash.created'));
    }

    public function updateItem(Request $request, GalleryItem $item): RedirectResponse
    {
        $item->update($this->itemRules($request));

        return back()->with('success', __('flash.updated'));
    }

    public function destroyItem(GalleryItem $item): RedirectResponse
    {
        $item->delete();

        return back()->with('success', __('flash.deleted'));
    }

    /**
     * @return array<string, mixed>
     */
    private function albumRules(Request $request, ?Album $album = null): array
    {
        $data = $request->validate([
            'name_id' => ['required', 'string', 'max:160'],
            'name_en' => ['nullable', 'string', 'max:160'],
            'slug' => [
                'nullable', 'string', 'max:180', 'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/',
                Rule::unique('albums', 'slug')->ignore($album),
            ],
        ]);

        $data['slug'] = $data['slug'] ?: str($data['name_id'])->slug()->value();

        return $data;
    }

    /**
     * @return array<string, mixed>
     */
    private function itemRules(Request $request): array
    {
        return $request->validate([
            'album_id' => ['nullable', Rule::exists('albums', 'id')],
            'title_id' => ['nullable', 'string', 'max:200'],
            'title_en' => ['nullable', 'string', 'max:200'],
            'caption_id' => ['nullable', 'string', 'max:500'],
            'caption_en' => ['nullable', 'string', 'max:500'],
            'image_url' => ['required', 'string', 'max:500', 'url'],
            'position' => ['required', 'integer', 'min:0', 'max:999'],
        ]);
    }
}
