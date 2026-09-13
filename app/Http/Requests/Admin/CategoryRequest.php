<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class CategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Route middleware already requires an authenticated operator; both
        // roles may manage taxonomy.
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $category = $this->route('category');

        return [
            'name_id' => ['required', 'string', 'max:120'],
            'name_en' => ['nullable', 'string', 'max:120'],
            'slug' => [
                'nullable', 'string', 'max:140', 'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/',
                Rule::unique('categories', 'slug')->ignore($category),
            ],
        ];
    }

    /**
     * Derive the slug from the Indonesian name when the editor leaves it blank.
     *
     * Done before validation rather than in the controller so the uniqueness
     * rule above sees the value that will actually be stored.
     */
    protected function prepareForValidation(): void
    {
        $slug = trim((string) $this->input('slug', ''));

        if ($slug === '' && $this->filled('name_id')) {
            $slug = Str::slug((string) $this->input('name_id'));
        }

        $this->merge(['slug' => $slug === '' ? null : $slug]);
    }
}
