import * as React from 'react';
import { cn } from '@/lib/utils';

type PictureProps = Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'width' | 'height'> & {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    /** Fills the nearest positioned ancestor, like next/image's `fill`. */
    fill?: boolean;
    /** Loads eagerly at high priority — for the LCP image only. */
    priority?: boolean;
};

/**
 * Replacement for next/image, matching the props the ported components pass.
 *
 * No srcset: the upload pipeline stores exactly one WebP per image, so listing
 * alternative widths would advertise files that do not exist. What matters for
 * layout stability is here — explicit width and height, or `fill` inside a
 * sized box — and that is what next/image was mainly buying on this site.
 */
export function Picture({
    src,
    alt,
    width,
    height,
    fill = false,
    priority = false,
    className,
    sizes,
    ...props
}: PictureProps) {
    return (
        <img
            src={src}
            alt={alt}
            width={fill ? undefined : width}
            height={fill ? undefined : height}
            sizes={sizes}
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : undefined}
            decoding={priority ? 'sync' : 'async'}
            className={cn(fill && 'absolute inset-0 h-full w-full object-cover', className)}
            {...props}
        />
    );
}
