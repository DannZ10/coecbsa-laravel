<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class MediaUploadRequest extends FormRequest
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
            'file' => [
                'required',
                'file',
                // `mimetypes`, not `mimes`: this inspects the bytes rather than
                // trusting the filename extension. The list is the same config
                // constant the file picker's accept attribute is built from, so
                // the two cannot drift — that drift is how PDFs once reached a
                // public bucket.
                'mimetypes:'.implode(',', (array) config('coecbsa.media.accepted_mime')),
                'max:'.(int) config('coecbsa.media.max_size_kb'),
            ],
        ];
    }
}
