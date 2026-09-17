/**
 * Responsive-image helpers.
 *
 * The public pages source their photography from the Unsplash CDN, whose URLs
 * already carry `auto=format` (it negotiates AVIF/WebP from the `Accept` header).
 * What was missing was width negotiation: every `<img>` fetched the full-size
 * original regardless of the viewport, and the hero alone shipped a 1600×2000
 * file as the LCP. Because the CDN also honours the `w`, `h` and `q` query
 * params, one width ladder produces a real `srcSet` for every DPR without
 * pre-generating any files.
 *
 * Uploaded media is different: the pipeline stores exactly one WebP per image,
 * so those URLs get a single `src` and no ladder — see `unsplashSrcSet` bailing
 * out for non-Unsplash sources.
 */

/** Width ladder for responsive Unsplash sources, in CSS pixels. Tune here. */
export const UNSPLASH_WIDTHS = [320, 480, 640, 768, 960, 1280, 1600] as const;

/**
 * Default Unsplash re-encode quality (1–100). Lower means fewer bytes.
 * 68 is visually clean for photos that sit behind a gradient, grain or overlay
 * (hero, focus areas). Raise it per-call via `Picture`'s `quality` prop for a
 * full-bleed, uncovered image if banding shows — this is the calibration knob.
 */
export const UNSPLASH_QUALITY = 68;

const UNSPLASH_HOST = 'images.unsplash.com';

export function isUnsplash(src: string): boolean {
    return src.includes(UNSPLASH_HOST);
}

type SrcSetOptions = { widths?: readonly number[]; quality?: number };

/**
 * Build a width-based `srcSet` for an Unsplash CDN url, or `undefined` for any
 * other source. Widths above the source's own `w` are dropped — the CDN would
 * upscale, which only wastes bytes — and the source's native width is kept as
 * the top rung so the largest displays still get full resolution. The source
 * aspect ratio (its `w`:`h`) is preserved at every rung so `fit=crop` returns a
 * consistent crop.
 */
export function unsplashSrcSet(src: string, options: SrcSetOptions = {}): string | undefined {
    if (!isUnsplash(src)) return undefined;

    let parsed: URL;
    try {
        parsed = new URL(src);
    } catch {
        return undefined;
    }

    const { widths = UNSPLASH_WIDTHS, quality = UNSPLASH_QUALITY } = options;
    const base = Number(parsed.searchParams.get('w'));
    const baseHeight = Number(parsed.searchParams.get('h'));
    const aspect = base && baseHeight ? baseHeight / base : undefined;

    const ladder = widths.filter((w) => !base || w <= base);
    if (base && !ladder.includes(base)) ladder.push(base);
    if (ladder.length === 0) return undefined;

    return ladder
        .map((w) => {
            const url = new URL(src);
            url.searchParams.set('w', String(w));
            if (aspect) url.searchParams.set('h', String(Math.round(w * aspect)));
            url.searchParams.set('q', String(quality));
            url.searchParams.set('auto', 'format');
            url.searchParams.set('fit', 'crop');
            return `${url.toString()} ${w}w`;
        })
        .join(', ');
}
