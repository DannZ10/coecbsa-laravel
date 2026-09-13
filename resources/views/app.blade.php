@php
    // The public site is light-only by design: `data-theme="light"` is what
    // excludes it from the `prefers-color-scheme: dark` block in tokens.css, so
    // a visitor whose OS is dark still gets the intended palette. The admin
    // panel keeps both themes and sets its own attribute.
    $isAdmin = request()->is('admin', 'admin/*');
    $jsonLd = $page['props']['seo']['jsonLd'] ?? null;
    $canonical = $page['props']['seo']['canonical'] ?? null;
    $alternates = $page['props']['seo']['alternates'] ?? [];
@endphp
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @if (! $isAdmin) data-theme="light" @endif>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="icon" href="/icon.svg" type="image/svg+xml">

    @if ($canonical)
        <link rel="canonical" href="{{ $canonical }}">
    @endif
    @foreach ($alternates as $hreflang => $href)
        <link rel="alternate" hreflang="{{ $hreflang }}" href="{{ $href }}">
    @endforeach

    {{-- Emitted from server data rather than from React, so structured data is
         present even when the bundle fails to load or a crawler skips JS. --}}
    @if ($jsonLd)
        <script type="application/ld+json" nonce="{{ $cspNonce ?? '' }}">{!! json_encode($jsonLd, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) !!}</script>
    @endif

    {{-- No Ziggy: every URL a page needs is already a string prop from the
         controller that rendered it, so shipping the whole route table to the
         browser would buy nothing. --}}
    @viteReactRefresh
    @vite(['resources/css/globals.css', 'resources/js/app.tsx'])
    @inertiaHead
</head>
<body class="min-h-dvh {{ $isAdmin ? '' : 'bg-paper text-ink' }} antialiased">
    @inertia
</body>
</html>
