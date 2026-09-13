<?php

namespace Tests\Feature;

use App\Models\Media;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class MediaUploadTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Storage::fake('public');
        config(['coecbsa.media.disk' => 'public']);
    }

    public function test_an_image_is_re_encoded_to_webp(): void
    {
        $this->actingAs(User::factory()->create())
            ->post('/admin/media', ['file' => UploadedFile::fake()->image('foto.png', 900, 600)]);

        $media = Media::firstOrFail();

        // The key, the recorded type and the bytes all agree, which is the
        // fix this pipeline exists to keep.
        $this->assertStringEndsWith('.webp', $media->path);
        $this->assertSame('image/webp', $media->type);
        Storage::disk('public')->assertExists($media->path);
        $this->assertStringStartsWith('RIFF', Storage::disk('public')->get($media->path));
    }

    public function test_an_oversized_image_is_scaled_down(): void
    {
        $this->actingAs(User::factory()->create())
            ->post('/admin/media', ['file' => UploadedFile::fake()->image('besar.png', 3000, 2000)]);

        $media = Media::firstOrFail();

        $this->assertSame(2400, $media->width);
        $this->assertSame(1600, $media->height);
    }

    /**
     * The rule is `mimetypes`, which reads the bytes — not `mimes`, which
     * trusts the extension. A PDF in a public bucket is what that distinction
     * prevents.
     */
    public function test_a_pdf_is_rejected(): void
    {
        $this->actingAs(User::factory()->create())
            ->post('/admin/media', ['file' => UploadedFile::fake()->create('dokumen.pdf', 40, 'application/pdf')])
            ->assertSessionHasErrors('file');

        $this->assertDatabaseCount('media', 0);
    }

    public function test_deleting_removes_the_object_as_well_as_the_row(): void
    {
        $this->actingAs(User::factory()->create())
            ->post('/admin/media', ['file' => UploadedFile::fake()->image('hapus.png', 400, 300)]);

        $media = Media::firstOrFail();
        $path = $media->path;

        $this->actingAs(User::factory()->create())->delete("/admin/media/{$media->id}");

        $this->assertDatabaseCount('media', 0);
        Storage::disk('public')->assertMissing($path);
    }

    public function test_a_guest_cannot_upload(): void
    {
        $this->post('/admin/media', ['file' => UploadedFile::fake()->image('tamu.png')])
            ->assertRedirect(route('admin.login'));

        $this->assertDatabaseCount('media', 0);
    }
}
