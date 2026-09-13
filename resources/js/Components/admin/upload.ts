/**
 * Uploads one image and returns its public URL.
 *
 * Inertia's form helper is the right tool everywhere a submit ends in a page
 * update, but the rich-text editor needs the URL back in order to insert the
 * image into the document. So this posts to the same /admin/media endpoint with
 * `Accept: application/json`, which is the one branch of that controller that
 * answers with a body instead of a redirect.
 */
export async function uploadImage(file: File): Promise<string> {
    const body = new FormData();
    body.append('file', file);

    const response = await fetch('/admin/media', {
        method: 'POST',
        body,
        credentials: 'same-origin',
        headers: {
            Accept: 'application/json',
            'X-XSRF-TOKEN': readXsrfToken(),
            'X-Requested-With': 'XMLHttpRequest',
        },
    });

    if (!response.ok) {
        // Laravel answers a failed validation with 422 and the messages keyed
        // by field; show the server's own wording rather than a generic one.
        const problem = (await response.json().catch(() => null)) as
            | { message?: string; errors?: Record<string, string[]> }
            | null;

        throw new Error(problem?.errors?.file?.[0] ?? problem?.message ?? `Upload failed (${response.status})`);
    }

    const { url } = (await response.json()) as { url: string };

    return url;
}

/** Laravel sets XSRF-TOKEN as a readable, URL-encoded cookie for exactly this. */
function readXsrfToken(): string {
    const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]*)/);

    return match?.[1] ? decodeURIComponent(match[1]) : '';
}
