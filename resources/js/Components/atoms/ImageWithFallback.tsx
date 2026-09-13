import { useState, type ImgHTMLAttributes } from 'react';

type ImageWithFallbackProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & {
  src?: string;
};

/** A failed image keeps its reserved dimensions and accessible description. */
export function ImageWithFallback({ src, alt, style, className, loading = 'lazy', onError, ...rest }: ImageWithFallbackProps) {
  const [failedSrc, setFailedSrc] = useState<string>();
  if (src && failedSrc === src) {
    return <div className={className} style={{ ...style, backgroundColor: 'var(--muted)' }} role={alt ? 'img' : undefined} aria-label={alt || undefined} aria-hidden={!alt || undefined} />;
  }
  // Reference art uses native images to preserve its crop and original visual.
  // eslint-disable-next-line @next/next/no-img-element
  return <img {...rest} src={src} alt={alt ?? ''} className={className} style={style} loading={loading}
    onError={(event) => { setFailedSrc(src); onError?.(event); }} />;
}
