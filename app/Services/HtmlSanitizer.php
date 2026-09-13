<?php

namespace App\Services;

use HTMLPurifier;
use HTMLPurifier_Config;

/**
 * Cleans rich-text HTML on the way into the database.
 *
 * Sanitising on save rather than on render means the stored value is already
 * safe, so every consumer — the public page, a feed, an export — is covered
 * without each having to remember. The editor can only produce the tags the
 * TipTap toolbar offers, so the allowlist is exactly those.
 */
class HtmlSanitizer
{
    private HTMLPurifier $purifier;

    public function __construct()
    {
        $config = HTMLPurifier_Config::createDefault();

        $config->set('Cache.SerializerPath', storage_path('framework/cache/htmlpurifier'));
        $config->set('HTML.Allowed', implode(',', [
            'p', 'br', 'strong', 'em', 'u', 's',
            'h2', 'h3', 'h4',
            'ul', 'ol', 'li',
            'blockquote', 'code', 'pre',
            'a[href|title|rel|target]',
            'img[src|alt|width|height|loading]',
            'figure', 'figcaption', 'hr',
        ]));
        $config->set('HTML.TargetBlank', true);
        // rel="noopener noreferrer" is added to every target=_blank link, so an
        // editor cannot paste one that leaks window.opener to the destination.
        $config->set('HTML.Nofollow', false);
        $config->set('URI.AllowedSchemes', ['http' => true, 'https' => true, 'mailto' => true]);
        $config->set('AutoFormat.RemoveEmpty', true);

        if (! is_dir(storage_path('framework/cache/htmlpurifier'))) {
            mkdir(storage_path('framework/cache/htmlpurifier'), 0775, true);
        }

        $this->purifier = new HTMLPurifier($config);
    }

    public function clean(?string $html): ?string
    {
        if ($html === null || trim($html) === '') {
            return null;
        }

        return $this->purifier->purify($html);
    }
}
