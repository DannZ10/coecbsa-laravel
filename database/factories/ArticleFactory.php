<?php

namespace Database\Factories;

use App\Enums\ArticleStatus;
use App\Models\Article;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Article>
 */
class ArticleFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = fake()->sentence(6);

        return [
            'slug' => Str::slug($title).'-'.fake()->unique()->numberBetween(1, 99999),
            'title_id' => $title,
            'title_en' => fake()->sentence(6),
            'excerpt_id' => fake()->sentence(12),
            'content_id' => '<p>'.fake()->paragraph().'</p>',
            'status' => ArticleStatus::Published,
            'published_at' => now()->subDay(),
            'author_id' => User::factory(),
        ];
    }

    public function draft(): static
    {
        return $this->state(fn () => [
            'status' => ArticleStatus::Draft,
            'published_at' => null,
        ]);
    }

    /** Published, but with a date that has not arrived yet. */
    public function scheduledAhead(): static
    {
        return $this->state(fn () => [
            'status' => ArticleStatus::Scheduled,
            'published_at' => now()->addWeek(),
        ]);
    }
}
