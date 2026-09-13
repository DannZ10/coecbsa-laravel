<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class PartnerRequest extends FormRequest
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
            'name_id' => ['required', 'string', 'max:160'],
            'name_en' => ['nullable', 'string', 'max:160'],
            'group_label_id' => ['required', 'string', 'max:120'],
            'group_label_en' => ['nullable', 'string', 'max:120'],
            'logo_url' => ['nullable', 'string', 'max:500', 'url'],
            'href' => ['nullable', 'string', 'max:500', 'url'],
            'position' => ['required', 'integer', 'min:0', 'max:999'],
            'slug' => [
                'nullable', 'string', 'max:220', 'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/',
                Rule::unique('partners', 'slug')->ignore($this->route('partner')),
            ],
        ];
    }

    protected function prepareForValidation(): void
    {
        $slug = trim((string) $this->input('slug', ''));

        if ($slug === '' && $this->filled('name_id')) {
            $slug = Str::slug((string) $this->input('name_id'));
        }

        $this->merge([
            'slug' => $slug === '' ? null : $slug,
            'position' => (int) $this->input('position', 0),
        ]);
    }
}
