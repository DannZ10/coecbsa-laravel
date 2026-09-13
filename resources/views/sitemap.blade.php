{{-- Each URL carries the full hreflang set, so a crawler that finds one
     locale is told about the other and neither is treated as a duplicate. --}}
<?php echo '<?xml version="1.0" encoding="UTF-8"?>'."\n"; ?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
@foreach ($urls as $url)
    <url>
        <loc>{{ $url['loc'] }}</loc>
@foreach ($url['alternates'] as $alternate)
        <xhtml:link rel="alternate" hreflang="{{ $alternate }}" href="{{ $base }}/{{ $alternate }}{{ $url['path'] }}"/>
@endforeach
        <xhtml:link rel="alternate" hreflang="x-default" href="{{ $base }}/id{{ $url['path'] }}"/>
@if ($url['lastmod'])
        <lastmod>{{ $url['lastmod'] }}</lastmod>
@endif
    </url>
@endforeach
</urlset>
