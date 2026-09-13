<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Seeded super admin
    |--------------------------------------------------------------------------
    |
    | Read here rather than through env() at the call site: once
    | `config:cache` has run, env() returns null everywhere outside config,
    | which would silently seed an account with an empty name and a random
    | password nobody recorded.
    |
    */

    'admin' => [
        'name' => env('ADMIN_NAME', 'Super Admin'),
        'email' => env('ADMIN_EMAIL', 'admin@cbsa.ub.ac.id'),
        'password' => env('ADMIN_PASSWORD'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Google sign-in
    |--------------------------------------------------------------------------
    |
    | The callback links to an existing user by verified email and never
    | creates accounts, so the admin list stays closed.
    |
    */

    'google' => [
        'client_id' => env('GOOGLE_CLIENT_ID'),
        'client_secret' => env('GOOGLE_CLIENT_SECRET'),
        'redirect_uri' => env('GOOGLE_REDIRECT_URI'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Uploaded media
    |--------------------------------------------------------------------------
    |
    | ACCEPTED_MIME is the single source of truth for what may enter the public
    | bucket. The upload validation and the CMS file picker both read it, so
    | they cannot drift apart — the drift is what previously let PDFs into a
    | public bucket.
    |
    */

    'media' => [
        'disk' => env('MEDIA_DISK', 'public'),
        'accepted_mime' => ['image/jpeg', 'image/png', 'image/webp', 'image/avif'],
        'max_size_kb' => 8192,
        // Uploaded images are re-encoded to this format; the stored key, the
        // Content-Type and the `media.type` column all follow the bytes.
        'encode_to' => 'webp',
        'encode_quality' => 82,
        'max_dimension' => 2400,
    ],

];
