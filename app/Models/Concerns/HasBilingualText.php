<?php

namespace App\Models\Concerns;

/**
 * Reads a `<field>_id` / `<field>_en` column pair for the active locale.
 *
 * The `_id` suffix is the ISO 639-1 code for Indonesian, not a foreign key.
 * Indonesian is the source language and is never null, so it is also the
 * fallback whenever the English column is empty — an unfinished translation
 * shows the original rather than a blank card.
 */
trait HasBilingualText
{
    public function localized(string $field, ?string $locale = null): string
    {
        $locale ??= app()->getLocale();

        if ($locale === 'en') {
            $english = $this->getAttribute("{$field}_en");

            if (is_string($english) && trim($english) !== '') {
                return $english;
            }
        }

        return (string) ($this->getAttribute("{$field}_id") ?? '');
    }
}
