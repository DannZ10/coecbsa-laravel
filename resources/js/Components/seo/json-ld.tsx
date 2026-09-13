/**
 * Emits a JSON-LD block. The payload is built server-side from our own data
 * (never from user input), and `<` is escaped so a string value can't close
 * the script tag early.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  );
}
