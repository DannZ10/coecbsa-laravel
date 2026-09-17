import * as React from 'react';
import { cn } from '@/lib/utils';
import { unsplashSrcSet } from '@/lib/images';

type PictureProps = Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'width' | 'height'> & {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    /** Fills the nearest positioned ancestor, like next/image's `fill`. */
    fill?: boolean;
    /** Loads eagerly at high priority — for the LCP image only. */
    priority?: boolean;
    /** Unsplash re-encode quality (1–100); defaults to the ladder default. */
    quality?: number;
};

/**
 * Responsive drop-in for next/image, matching the props the ported components pass.
 *
 * Unsplash CDN sources get a width `srcSet` (see `lib/images`) plus `auto=format`,
 * so the browser fetches an appropriately sized AVIF/WebP for its viewport and DPR
 * instead of the full-resolution original — the largest byte win on the public
 * pages. Uploaded media has exactly one stored WebP, so it keeps a single `src`
 * and no srcSet; advertising widths that do not exist would 404. Explicit
 * width/height, or `fill` inside a sized box, keeps CLS at zero.
 *
 * Pass `sizes` whenever the rendered width is not ~100vw, or the browser will
 * over-fetch from the ladder.
 */
export function Picture({
    src,
    alt,
    width,
    height,
    fill = false,
    priority = false,
    quality,
    className,
    sizes,
    ...props
}: PictureProps) {
    const [failed, setFailed] = React.useState(false);
    const srcSet = unsplashSrcSet(src, quality != null ? { quality } : undefined);

    if (failed) {
        // A broken image keeps its reserved box and accessible description.
        return (
            <div
                className={cn(fill && 'absolute inset-0 h-full w-full', className)}
                style={{
                    backgroundColor: 'var(--muted)',
                    width: fill ? undefined : width,
                    height: fill ? undefined : height,
                }}
                role={alt ? 'img' : undefined}
                aria-label={alt || undefined}
                aria-hidden={!alt || undefined}
            />
        );
    }

    return (
        <img
            src={src}
            srcSet={srcSet}
            sizes={srcSet ? sizes : undefined}
            alt={alt}
            width={fill ? undefined : width}
            height={fill ? undefined : height}
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : undefined}
            decoding={priority ? 'sync' : 'async'}
            onError={() => setFailed(true)}
            className={cn(fill && 'absolute inset-0 h-full w-full object-cover', className)}
            {...props}
        />
    );
}
