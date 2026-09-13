import { Head, useForm } from '@inertiajs/react';
import { ImagePlus, LibraryBig, Trash2, Upload } from 'lucide-react';
import * as React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/admin/button';
import { ConfirmDialog } from '@/Components/admin/confirm-dialog';
import { AdminPageHeader } from '@/Components/admin/page-header';
import { EmptyState } from '@/Components/ui/empty-state';
import { Field } from '@/Components/ui/field';
import { Input } from '@/Components/ui/input';
import { Pagination, type Paginated } from '@/Components/ui/pagination';
import { useTranslations } from '@/lib/i18n';

type MediaItem = {
    id: number;
    url: string;
    filename: string;
    type: string;
    size: number;
    width: number | null;
    height: number | null;
    alt_id: string | null;
    alt_en: string | null;
    uploader: string | null;
    created_at: string | null;
};

function formatSize(bytes: number): string {
    return bytes >= 1024 * 1024
        ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(bytes / 1024)} KB`;
}

export default function MediaLibrary({
    media,
    accept,
    maxSizeKb,
}: {
    media: Paginated<MediaItem>;
    accept: string[];
    maxSizeKb: number;
}) {
    const t = useTranslations('admin.media');
    const tCommon = useTranslations('admin.common');

    const fileInput = React.useRef<HTMLInputElement>(null);
    const [pendingDelete, setPendingDelete] = React.useState<MediaItem | null>(null);
    const [editing, setEditing] = React.useState<MediaItem | null>(null);

    const upload = useForm<{ file: File | null }>({ file: null });
    const alt = useForm({ alt_id: '', alt_en: '' });
    const remove = useForm({});

    function onPick(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (!file) return;

        // Posting straight from the change handler keeps the library one click
        // away: there is no staging step to abandon halfway.
        upload.setData('file', file);
        upload.post('/admin/media', {
            preserveScroll: true,
            forceFormData: true,
            onFinish: () => {
                upload.reset();
                if (fileInput.current) fileInput.current.value = '';
            },
        });
    }

    function startAlt(item: MediaItem) {
        setEditing(item);
        alt.clearErrors();
        alt.setData({ alt_id: item.alt_id ?? '', alt_en: item.alt_en ?? '' });
    }

    return (
        <AdminLayout>
            <Head title={t('title')} />

            <AdminPageHeader
                index="05"
                title={t('title')}
                description={t('subtitle', { size: String(Math.round(maxSizeKb / 1024)) })}
                actions={
                    <>
                        {/* The accept attribute is built from the same server
                            config the upload rules validate against, so the
                            picker cannot offer a type the server will reject. */}
                        <input
                            ref={fileInput}
                            type="file"
                            accept={accept.join(',')}
                            className="sr-only"
                            id="media-file"
                            onChange={onPick}
                        />
                        <Button asChild loading={upload.processing}>
                            <label htmlFor="media-file" className="cursor-pointer">
                                <Upload className="h-4 w-4" aria-hidden />
                                {t('upload')}
                            </label>
                        </Button>
                    </>
                }
            />

            {upload.errors.file && (
                <p role="alert" className="mb-4 text-sm font-medium text-danger">
                    {upload.errors.file}
                </p>
            )}

            {media.data.length === 0 ? (
                <EmptyState icon={LibraryBig} title={t('empty')} description={t('emptyBody')} />
            ) : (
                <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {media.data.map((item) => (
                        <li key={item.id} className="overflow-hidden rounded-lg border border-line bg-surface">
                            <img
                                src={item.url}
                                alt={item.alt_id ?? item.filename}
                                width={item.width ?? undefined}
                                height={item.height ?? undefined}
                                loading="lazy"
                                className="aspect-[4/3] w-full bg-surface-2 object-cover"
                            />
                            <div className="space-y-1 p-3">
                                <p className="truncate text-sm font-medium text-foreground" title={item.filename}>
                                    {item.filename}
                                </p>
                                <p className="text-xs text-foreground-subtle">
                                    {item.width}×{item.height} · {formatSize(item.size)} · {item.type}
                                </p>

                                {editing?.id === item.id ? (
                                    <form
                                        className="space-y-2 pt-2"
                                        onSubmit={(event) => {
                                            event.preventDefault();
                                            alt.put(`/admin/media/${item.id}`, {
                                                preserveScroll: true,
                                                onSuccess: () => setEditing(null),
                                            });
                                        }}
                                    >
                                        <Field id={`alt_id_${item.id}`} label={t('altId')} error={alt.errors.alt_id}>
                                            <Input
                                                id={`alt_id_${item.id}`}
                                                value={alt.data.alt_id}
                                                onChange={(event) => alt.setData('alt_id', event.target.value)}
                                            />
                                        </Field>
                                        <Field id={`alt_en_${item.id}`} label={t('altEn')} error={alt.errors.alt_en}>
                                            <Input
                                                id={`alt_en_${item.id}`}
                                                value={alt.data.alt_en}
                                                onChange={(event) => alt.setData('alt_en', event.target.value)}
                                            />
                                        </Field>
                                        <div className="flex gap-2">
                                            <Button type="submit" size="sm" loading={alt.processing}>
                                                {tCommon('save')}
                                            </Button>
                                            <Button type="button" size="sm" variant="ghost" onClick={() => setEditing(null)}>
                                                {tCommon('cancel')}
                                            </Button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="flex items-center gap-1 pt-1">
                                        <Button size="sm" variant="ghost" onClick={() => startAlt(item)}>
                                            <ImagePlus className="h-4 w-4" aria-hidden />
                                            {t('altAction')}
                                        </Button>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="ml-auto h-9 w-9"
                                            aria-label={tCommon('deleteAria', { name: item.filename })}
                                            onClick={() => setPendingDelete(item)}
                                        >
                                            <Trash2 className="h-4 w-4 text-danger" aria-hidden />
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            <Pagination links={media.links} label={tCommon('page')} className="mt-8" />

            <ConfirmDialog
                open={pendingDelete !== null}
                onOpenChange={(open) => !open && setPendingDelete(null)}
                title={t('deleteTitle')}
                description={
                    <>
                        <strong className="text-foreground">{pendingDelete?.filename}</strong> {t('deleteBody')}
                    </>
                }
                pending={remove.processing}
                onConfirm={() =>
                    pendingDelete &&
                    remove.delete(`/admin/media/${pendingDelete.id}`, {
                        preserveScroll: true,
                        onSuccess: () => setPendingDelete(null),
                    })
                }
            />
        </AdminLayout>
    );
}
