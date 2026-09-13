<?php

namespace App\Services;

use App\Models\Media;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\Encoders\WebpEncoder;
use Intervention\Image\ImageManager;

/**
 * Uploads, re-encodes and deletes CMS media.
 *
 * Carries over three fixes from the Express implementation this replaces:
 *
 * 1. Everything about the stored object follows the bytes we actually write.
 *    Images are re-encoded to WebP, so the key ends in .webp, the object's
 *    Content-Type is image/webp and `media.type` says image/webp. Previously
 *    the re-encoded bytes were stored under the original extension and mime.
 * 2. The object key is recorded, not re-derived. A regex over the URL gave the
 *    whole URL back as the "key" under the S3 driver, so deletes silently left
 *    the object public.
 * 3. The accepted mime list lives in config and is read by the request rules
 *    and by the file picker alike, so the two cannot drift — the drift is how
 *    PDFs once reached a public bucket.
 */
class MediaService
{
    public function disk(): string
    {
        return (string) config('coecbsa.media.disk', 'public');
    }

    /**
     * @return list<string>
     */
    public function acceptedMimeTypes(): array
    {
        return (array) config('coecbsa.media.accepted_mime', []);
    }

    public function store(UploadedFile $file, ?User $uploader = null): Media
    {
        $manager = new ImageManager(new Driver());
        // v4 spells this decodePath(); the v3 read() helper is gone.
        $image = $manager->decodePath($file->getRealPath());

        // Scale down only. Enlarging a small upload to the ceiling would waste
        // bytes and soften the image for no benefit.
        $max = (int) config('coecbsa.media.max_dimension', 2400);
        $image->scaleDown(width: $max, height: $max);

        $encoded = $image->encode(
            new WebpEncoder(quality: (int) config('coecbsa.media.encode_quality', 82)),
        );
        $bytes = (string) $encoded;

        $path = sprintf(
            'media/%s/%s.webp',
            now()->format('Y/m'),
            Str::ulid()->toBase32(),
        );

        Storage::disk($this->disk())->put($path, $bytes, [
            'visibility' => 'public',
            'ContentType' => 'image/webp',
        ]);

        return Media::create([
            'path' => $path,
            'url' => Storage::disk($this->disk())->url($path),
            'type' => 'image/webp',
            'filename' => $this->safeFilename($file->getClientOriginalName()),
            'size' => strlen($bytes),
            'width' => $image->width(),
            'height' => $image->height(),
            'uploaded_by' => $uploader?->id,
        ]);
    }

    /**
     * Remove the object and its row.
     *
     * The row is only deleted once the object is gone, so a storage failure
     * leaves a visible record to retry rather than an orphaned public file
     * nothing points at any more.
     */
    public function delete(Media $media): bool
    {
        try {
            Storage::disk($this->disk())->delete($media->path);
        } catch (\Throwable $exception) {
            Log::error('Media object could not be deleted', [
                'media_id' => $media->id,
                'path' => $media->path,
                'message' => $exception->getMessage(),
            ]);

            return false;
        }

        $media->delete();

        return true;
    }

    /** Keeps the operator's original name readable without trusting it as a path. */
    private function safeFilename(string $original): string
    {
        $name = pathinfo($original, PATHINFO_FILENAME);

        return Str::limit(Str::slug($name) ?: 'image', 80, '').'.webp';
    }
}
