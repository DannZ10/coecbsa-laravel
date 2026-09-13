<?php

namespace App\Http\Requests\Admin;

use App\Enums\ProgramStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class ProgramRequest extends FormRequest
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
            'tag_label_id' => ['required', 'string', 'max:120'],
            'tag_label_en' => ['nullable', 'string', 'max:120'],
            'place_id' => ['required', 'string', 'max:160'],
            'place_en' => ['nullable', 'string', 'max:160'],
            'desc_id' => ['required', 'string', 'max:1000'],
            'desc_en' => ['nullable', 'string', 'max:1000'],
            'funder_id' => ['required', 'string', 'max:200'],
            'funder_en' => ['nullable', 'string', 'max:200'],
            'details_id' => ['nullable', 'string', 'max:2000'],
            'details_en' => ['nullable', 'string', 'max:2000'],
            'image' => ['required', 'string', 'max:500', 'url'],
            'status' => ['required', Rule::enum(ProgramStatus::class)],
            'position' => ['required', 'integer', 'min:0', 'max:999'],
            'slug' => [
                'nullable', 'string', 'max:220', 'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/',
                Rule::unique('programs', 'slug')->ignore($this->route('program')),
            ],
        ];
    }

    protected function prepareForValidation(): void
    {
        $slug = trim((string) $this->input('slug', ''));

        if ($slug === '' && $this->filled('title_id')) {
            $slug = Str::slug((string) $this->input('title_id'));
        }

        $this->merge([
            'slug' => $slug === '' ? null : $slug,
            'position' => (int) $this->input('position', 0),
        ]);
    }
}
