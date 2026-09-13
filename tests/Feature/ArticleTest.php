<?php

namespace Tests\Feature;

use App\Models\Article;
use App\Models\Category;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ArticleTest extends TestCase
{
    use RefreshDatabase;

    private function editor(): User
    {
        return User::factory()->create();
    }

    public function test_slug_is_derived_from_the_indonesian_title(): void
    {
        $this->actingAs($this->editor())->post('/admin/news', [
            'title_id' => 'Forum Kolaborasi Multipihak',
            'content_id' => '<p>Isi</p>',
            'status' => 'draft',
        ]);

        $this->assertDatabaseHas('articles', ['slug' => 'forum-kolaborasi-multipihak']);
    }

    public function test_duplicate_slug_is_rejected(): void
    {
        Article::factory()->create(['slug' => 'sudah-ada']);

        $this->actingAs($this->editor())
            ->post('/admin/news', [
                'title_id' => 'Judul',
                'slug' => 'sudah-ada',
                'content_id' => '<p>Isi</p>',
                'status' => 'draft',
            ])
            ->assertSessionHasErrors('slug');

        $this->assertSame(1, Article::where('slug', 'sudah-ada')->count());
    }

    /**
     * Sanitising on save means the stored HTML is already safe, so every
     * consumer is covered without each remembering to clean it.
     */
    public function test_hostile_html_is_stripped_on_save(): void
    {
        $this->actingAs($this->editor())->post('/admin/news', [
            'title_id' => 'Uji Sanitasi',
            'content_id' => '<p>Halo</p><script>alert(1)</script>'
                .'<p onclick="steal()">klik</p>'
                .'<a href="javascript:alert(2)">tautan</a>'
                .'<iframe src="https://evil.test"></iframe>',
            'status' => 'draft',
        ]);

        $stored = (string) Article::where('slug', 'uji-sanitasi')->value('content_id');

        $this->assertStringNotContainsString('<script', $stored);
        $this->assertStringNotContainsString('onclick', $stored);
        $this->assertStringNotContainsString('javascript:', $stored);
        $this->assertStringNotContainsString('<iframe', $stored);
        $this->assertStringContainsString('<p>Halo</p>', $stored);
    }

    public function test_publishing_without_a_date_publishes_now(): void
    {
        $this->actingAs($this->editor())->post('/admin/news', [
            'title_id' => 'Terbit Sekarang',
            'content_id' => '<p>Isi</p>',
            'status' => 'published',
        ]);

        $article = Article::where('slug', 'terbit-sekarang')->firstOrFail();

        $this->assertNotNull($article->published_at);
    }

    public function test_scheduled_without_a_date_is_rejected(): void
    {
        $this->actingAs($this->editor())
            ->post('/admin/news', [
                'title_id' => 'Terjadwal',
                'content_id' => '<p>Isi</p>',
                'status' => 'scheduled',
                'published_at' => '',
            ])
            ->assertSessionHasErrors('published_at');

        $this->assertDatabaseCount('articles', 0);
    }

    public function test_a_draft_returns_404_on_the_public_site(): void
    {
        $article = Article::factory()->draft()->create();

        $this->get("/id/news/{$article->slug}")->assertNotFound();
    }

    /** A future date must not be public, whatever the status column says. */
    public function test_a_future_dated_article_is_not_public(): void
    {
        $article = Article::factory()->scheduledAhead()->create();

        $this->get("/id/news/{$article->slug}")->assertNotFound();
    }

    public function test_a_published_article_is_public(): void
    {
        $article = Article::factory()->create();

        $this->get("/id/news/{$article->slug}")->assertOk();
    }

    public function test_deleting_a_category_keeps_its_articles(): void
    {
        $category = Category::create(['slug' => 'kegiatan', 'name_id' => 'Kegiatan']);
        $article = Article::factory()->create(['category_id' => $category->id]);

        $this->actingAs($this->editor())->delete("/admin/categories/{$category->id}");

        $this->assertDatabaseHas('articles', ['id' => $article->id, 'category_id' => null]);
    }
}
