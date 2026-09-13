<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\MediaUploadRequest;
use App\Models\Media;
use App\Services\MediaService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MediaController extends Controller
{
    public function __construct(private readonly MediaService $media) {}

    public function index(Request $request): Response
    {
        $items = Media::query()
            ->with('uploader:id,name')
            ->latest('id')
            ->paginate(24)
            ->withQueryString()
            ->through(fn (Media $item) => [
                'id' => $item->id,
                'url' => $item->url,
                'filename' => $item->filename,
                'type' => $item->type,
                'size' => $item->size,
                'width' => $item->width,
                'height' => $item->height,
                'alt_id' => $item->alt_id,
                'alt_en' => $item->alt_en,
                'uploader' => $item->uploader?->name,
                'created_at' => $item->created_at?->toIso8601String(),
            ]);

        return Inertia::render('Admin/Media', [
            'media' => $items,
            'accept' => $this->media->acceptedMimeTypes(),
            'maxSizeKb' => (int) config('coecbsa.media.max_size_kb'),
        ]);
    }

    public function store(MediaUploadRequest $request): RedirectResponse|JsonResponse
    {
        $media = $this->media->store($request->file('file'), $request->user());

        // The rich-text editor uploads with Accept: application/json because it
        // needs the URL back in order to insert the image; every other caller
        // is an Inertia visit that just wants the library to refresh.
        if ($request->wantsJson()) {
            return response()->json(['url' => $media->url, 'id' => $media->id]);
        }

        return back()->with('success', __('flash.created'));
    }

    public function update(Request $request, Media $media): RedirectResponse
    {
        $media->update($request->validate([
            'alt_id' => ['nullable', 'string', 'max:255'],
            'alt_en' => ['nullable', 'string', 'max:255'],
        ]));

        return back()->with('success', __('flash.updated'));
    }

    public function destroy(Media $media): RedirectResponse
    {
        if (! $this->media->delete($media)) {
            // The row is kept when the object could not be removed, so the
            // operator sees something to retry instead of an orphaned public
            // file nothing points at.
            return back()->with('error', __('flash.delete_failed'));
        }

        return back()->with('success', __('flash.deleted'));
    }
}
