<?php

namespace App\Http\Requests\Admin;

use App\Enums\ArticleStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class ArticleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'title_id' => ['required', 'string', 'max:200'],
            'title_en' => ['nullable', 'string', 'max:200'],
            'excerpt_id' => ['nullable', 'string', 'max:400'],
            'excerpt_en' => ['nullable', 'string', 'max:400'],
            'content_id' => ['required', 'string'],
            'content_en' => ['nullable', 'string'],
            'cover_image' => ['nullable', 'string', 'max:500', 'url'],
            'status' => ['required', Rule::enum(ArticleStatus::class)],
            // Required for a scheduled post: "scheduled" with no date is not a
            // state the publishing rule can evaluate.
            'published_at' => ['nullable', 'date', Rule::requiredIf(
                fn () => $this->input('status') === ArticleStatus::Scheduled->value,
            )],
            'category_id' => ['nullable', Rule::exists('categories', 'id')],
            'tags' => ['array'],
            'tags.*' => [Rule::exists('tags', 'id')],
            'slug' => [
                'nullable', 'string', 'max:220', 'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/',
                Rule::unique('articles', 'slug')->ignore($this->route('article')),
            ],
        ];
    }

    protected function prepareForValidation(): void
    {
        $slug = trim((string) $this->input('slug', ''));

        if ($slug === '' && $this->filled('title_id')) {
            $slug = Str::slug((string) $this->input('title_id'));
        }

        $this->merge(['slug' => $slug === '' ? null : $slug]);
    }
}
