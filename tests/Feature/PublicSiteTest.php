<?php

namespace Tests\Feature;

use App\Models\Article;
use App\Models\ContactMessage;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\RateLimiter;
use Tests\TestCase;

class PublicSiteTest extends TestCase
{
    use RefreshDatabase;

    /** @return array<int, array{string}> */
    public static function publicPaths(): array
    {
        return [
            [''],
            ['/about'],
            ['/structure'],
            ['/focus-areas'],
            ['/programs'],
            ['/news'],
            ['/gallery'],
            ['/contact'],
        ];
    }

    #[\PHPUnit\Framework\Attributes\DataProvider('publicPaths')]
    public function test_every_public_page_answers_in_both_locales(string $path): void
    {
        $this->get("/id{$path}")->assertOk();
        $this->get("/en{$path}")->assertOk();
    }

    public function test_the_root_redirects_to_the_default_locale(): void
    {
        $this->get('/')->assertRedirect('/id');
    }

    public function test_an_unknown_locale_is_not_routed(): void
    {
        $this->get('/de')->assertNotFound();
    }

    public function test_the_sitemap_lists_published_articles_and_omits_drafts(): void
    {
        $published = Article::factory()->create();
        $draft = Article::factory()->draft()->create();

        $response = $this->get('/sitemap.xml')->assertOk();
        $body = $response->getContent();

        $this->assertStringContainsString("/id/news/{$published->slug}", $body);
        $this->assertStringContainsString("/en/news/{$published->slug}", $body);
        $this->assertStringNotContainsString($draft->slug, $body);
    }

    public function test_robots_points_at_the_sitemap_and_excludes_the_panel(): void
    {
        $response = $this->get('/robots.txt')->assertOk();

        $this->assertStringContainsString('Disallow: /admin', $response->getContent());
        $this->assertStringContainsString('sitemap.xml', $response->getContent());
    }

    public function test_the_contact_form_stores_a_message(): void
    {
        $this->post('/id/contact', [
            'name' => 'Pengirim',
            'email' => 'pengirim@contoh.test',
            'subject' => 'Kolaborasi',
            'message' => 'Kami ingin berkolaborasi dalam program maggot BSF.',
        ])->assertRedirect();

        $this->assertDatabaseCount('contact_messages', 1);
    }

    public function test_a_short_message_is_rejected(): void
    {
        $this->post('/id/contact', [
            'name' => 'Pengirim',
            'email' => 'pengirim@contoh.test',
            'message' => 'halo',
        ])->assertSessionHasErrors('message');

        $this->assertDatabaseCount('contact_messages', 0);
    }

    /** The only unauthenticated write on the site, so the only one rate limited. */
    public function test_the_sixth_submission_within_the_hour_is_refused(): void
    {
        RateLimiter::clear('');

        $payload = [
            'name' => 'Pengirim',
            'email' => 'pengirim@contoh.test',
            'message' => 'Pesan yang cukup panjang untuk lolos validasi minimum.',
        ];

        for ($submission = 1; $submission <= 5; $submission++) {
            $this->post('/id/contact', $payload)->assertRedirect();
        }

        $this->post('/id/contact', $payload)->assertStatus(429);

        $this->assertSame(5, ContactMessage::count());
    }
}
