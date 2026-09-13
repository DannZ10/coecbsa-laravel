import { Head, useForm } from '@inertiajs/react';
import { ArrowDown, ArrowUp, ImagePlus, Images, Loader2, Pencil, Plus, Save, Trash2, X } from 'lucide-react';
import * as React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/admin/button';
import { ConfirmDialog } from '@/Components/admin/confirm-dialog';
import { AdminPageHeader } from '@/Components/admin/page-header';
import { uploadImage } from '@/Components/admin/upload';
import { EmptyState } from '@/Components/ui/empty-state';
import { Field } from '@/Components/ui/field';
import { Input, Textarea } from '@/Components/ui/input';
import { useTranslations } from '@/lib/i18n';

type Album = { id: number; slug: string; name_id: string; name_en: string | null; items_count: number };
type Item = {
    id: number;
    album_id: number | null;
    title_id: string | null;
    title_en: string | null;
    caption_id: string | null;
    caption_en: string | null;
    image_url: string;
    position: number;
    album: { id: number; name_id: string } | null;
};

const EMPTY_ITEM = {
    album_id: '' as number | '',
    title_id: '',
    title_en: '',
    caption_id: '',
    caption_en: '',
    image_url: '',
    position: 0,
};

export default function Gallery({ albums, items }: { albums: Album[]; items: Item[] }) {
    const t = useTranslations('admin.gallery');
    const tCommon = useTranslations('admin.common');

    const [editingItem, setEditingItem] = React.useState<Item | null>(null);
    const [pendingDelete, setPendingDelete] = React.useState<Item | null>(null);
    const [uploading, setUploading] = React.useState(false);

    const albumForm = useForm({ name_id: '', name_en: '', slug: '' });
    const itemForm = useForm(EMPTY_ITEM);
    const reorder = useForm({});
    const remove = useForm({});

    function resetItem() {
        setEditingItem(null);
        itemForm.reset();
        itemForm.clearErrors();
    }

    function startEdit(item: Item) {
        setEditingItem(item);
        itemForm.clearErrors();
        itemForm.setData({
            album_id: item.album_id ?? '',
            title_id: item.title_id ?? '',
            title_en: item.title_en ?? '',
            caption_id: item.caption_id ?? '',
            caption_en: item.caption_en ?? '',
            image_url: item.image_url,
            position: item.position,
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    async function pickImage(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
            itemForm.setData('image_url', await uploadImage(file));
        } finally {
            setUploading(false);
            event.target.value = '';
        }
    }

    /**
     * Swaps a photo's order number with its neighbour.
     *
     * Two buttons instead of drag and drop: the order is a plain integer the
     * editor can also type, it works with a keyboard and on a phone, and it
     * needs no drag-and-drop library.
     */
    function move(item: Item, direction: -1 | 1) {
        const ordered = [...items].sort((a, b) => a.position - b.position);
        const index = ordered.findIndex((candidate) => candidate.id === item.id);
        const neighbour = ordered[index + direction];
        if (!neighbour) return;

        // transform() mutates the helper and returns void, so it cannot be
        // chained onto put().
        reorder.transform(() => ({ ...item, position: neighbour.position }));
        reorder.put(`/admin/gallery/items/${item.id}`, { preserveScroll: true });
    }

    return (
        <AdminLayout>
            <Head title={t('title')} />

            <AdminPageHeader index="04" title={t('title')} description={t('subtitle')} />

            <section className="border-y border-line py-6">
                <h2 className="font-display text-base font-bold text-foreground">{t('albums')}</h2>
                <form
                    className="mt-3 flex flex-wrap items-end gap-3"
                    onSubmit={(event) => {
                        event.preventDefault();
                        albumForm.post('/admin/gallery/albums', {
                            preserveScroll: true,
                            onSuccess: () => albumForm.reset(),
                        });
                    }}
                >
                    <Field id="album_name_id" label={t('albumNameId')} required error={albumForm.errors.name_id} className="min-w-[12rem] flex-1">
                        <Input id="album_name_id" value={albumForm.data.name_id} onChange={(e) => albumForm.setData('name_id', e.target.value)} />
                    </Field>
                    <Field id="album_name_en" label={t('albumNameEn')} error={albumForm.errors.name_en} className="min-w-[12rem] flex-1">
                        <Input id="album_name_en" value={albumForm.data.name_en} onChange={(e) => albumForm.setData('name_en', e.target.value)} />
                    </Field>
                    <Button type="submit" loading={albumForm.processing}>
                        <Plus className="h-4 w-4" aria-hidden />
                        {tCommon('add')}
                    </Button>
                </form>

                {albums.length > 0 && (
                    <ul className="mt-4 flex flex-wrap gap-2">
                        {albums.map((album) => (
                            <li key={album.id} className="flex items-center gap-2 rounded-full border border-line px-3 py-1 text-xs">
                                <span className="font-medium text-foreground">{album.name_id}</span>
                                <span className="text-foreground-subtle">{album.items_count}</span>
                                <button
                                    type="button"
                                    aria-label={tCommon('deleteAria', { name: album.name_id })}
                                    onClick={() => remove.delete(`/admin/gallery/albums/${album.id}`, { preserveScroll: true })}
                                    className="text-danger"
                                >
                                    <X className="h-3.5 w-3.5" aria-hidden />
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            <form
                className="space-y-4 border-b border-line py-6"
                onSubmit={(event) => {
                    event.preventDefault();
                    const options = { preserveScroll: true, onSuccess: () => resetItem() };
                    if (editingItem) itemForm.put(`/admin/gallery/items/${editingItem.id}`, options);
                    else itemForm.post('/admin/gallery/items', options);
                }}
            >
                <h2 className="font-display text-base font-bold text-foreground">
                    {editingItem ? t('editItem') : t('addItem')}
                </h2>

                <div className="grid gap-4 sm:grid-cols-2">
                    <Field id="title_id" label={t('itemTitleId')} error={itemForm.errors.title_id}>
                        <Input id="title_id" value={itemForm.data.title_id} onChange={(e) => itemForm.setData('title_id', e.target.value)} />
                    </Field>
                    <Field id="title_en" label={t('itemTitleEn')} error={itemForm.errors.title_en}>
                        <Input id="title_en" value={itemForm.data.title_en} onChange={(e) => itemForm.setData('title_en', e.target.value)} />
                    </Field>

                    <Field id="caption_id" label={t('captionId')} error={itemForm.errors.caption_id}>
                        <Textarea id="caption_id" rows={2} value={itemForm.data.caption_id} onChange={(e) => itemForm.setData('caption_id', e.target.value)} />
                    </Field>
                    <Field id="caption_en" label={t('captionEn')} error={itemForm.errors.caption_en}>
                        <Textarea id="caption_en" rows={2} value={itemForm.data.caption_en} onChange={(e) => itemForm.setData('caption_en', e.target.value)} />
                    </Field>

                    <Field id="album_id" label={t('album')} error={itemForm.errors.album_id}>
                        <select
                            id="album_id"
                            value={itemForm.data.album_id === '' ? '' : String(itemForm.data.album_id)}
                            onChange={(e) => itemForm.setData('album_id', e.target.value === '' ? '' : Number(e.target.value))}
                            className="h-11 w-full rounded-md border border-line bg-surface px-3 text-sm text-foreground"
                        >
                            <option value="">{tCommon('optional')}</option>
                            {albums.map((album) => (
                                <option key={album.id} value={album.id}>
                                    {album.name_id}
                                </option>
                            ))}
                        </select>
                    </Field>

                    <Field id="position" label={t('position')} helper={t('positionHelper')} error={itemForm.errors.position}>
                        <Input id="position" type="number" min={0} value={itemForm.data.position} onChange={(e) => itemForm.setData('position', Number(e.target.value))} />
                    </Field>

                    <Field id="image_url" label={t('image')} required className="sm:col-span-2" error={itemForm.errors.image_url}>
                        <div className="space-y-2">
                            {itemForm.data.image_url && (
                                <img src={itemForm.data.image_url} alt="" className="aspect-[3/2] w-full max-w-sm rounded-md border border-line object-cover" />
                            )}
                            <div className="flex gap-2">
                                <Input id="image_url" value={itemForm.data.image_url} placeholder="https://" onChange={(e) => itemForm.setData('image_url', e.target.value)} />
                                <input id="gallery-image" type="file" accept="image/jpeg,image/png,image/webp,image/avif" className="sr-only" onChange={pickImage} />
                                <Button asChild variant="secondary">
                                    <label htmlFor="gallery-image" className="cursor-pointer whitespace-nowrap">
                                        {uploading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <ImagePlus className="h-4 w-4" aria-hidden />}
                                        {t('upload')}
                                    </label>
                                </Button>
                            </div>
                        </div>
                    </Field>
                </div>

                <div className="flex gap-2">
                    <Button type="submit" loading={itemForm.processing}>
                        {editingItem ? <Save className="h-4 w-4" aria-hidden /> : <Plus className="h-4 w-4" aria-hidden />}
                        {editingItem ? tCommon('saveChanges') : tCommon('add')}
                    </Button>
                    {editingItem && (
                        <Button type="button" variant="ghost" onClick={resetItem}>
                            <X className="h-4 w-4" aria-hidden />
                            {tCommon('cancel')}
                        </Button>
                    )}
                </div>
            </form>

            {items.length === 0 ? (
                <EmptyState icon={Images} title={t('empty')} description={t('emptyBody')} className="mt-6" />
            ) : (
                <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((item, index) => (
                        <li key={item.id} className="overflow-hidden rounded-lg border border-line bg-surface">
                            <img src={item.image_url} alt={item.title_id ?? ''} loading="lazy" className="aspect-[4/3] w-full bg-surface-2 object-cover" />
                            <div className="space-y-1 p-3">
                                <p className="truncate text-sm font-medium text-foreground">{item.title_id ?? tCommon('untitled')}</p>
                                <p className="text-xs text-foreground-subtle">
                                    #{item.position}
                                    {item.album ? ` · ${item.album.name_id}` : ''}
                                </p>
                                <div className="flex items-center gap-1 pt-1">
                                    <Button size="icon" variant="ghost" className="h-9 w-9" aria-label={t('moveUp')} disabled={index === 0} onClick={() => move(item, -1)}>
                                        <ArrowUp className="h-4 w-4" aria-hidden />
                                    </Button>
                                    <Button size="icon" variant="ghost" className="h-9 w-9" aria-label={t('moveDown')} disabled={index === items.length - 1} onClick={() => move(item, 1)}>
                                        <ArrowDown className="h-4 w-4" aria-hidden />
                                    </Button>
                                    <Button size="icon" variant="ghost" className="ml-auto h-9 w-9" aria-label={tCommon('editAria', { name: item.title_id ?? '' })} onClick={() => startEdit(item)}>
                                        <Pencil className="h-4 w-4" aria-hidden />
                                    </Button>
                                    <Button size="icon" variant="ghost" className="h-9 w-9" aria-label={tCommon('deleteAria', { name: item.title_id ?? '' })} onClick={() => setPendingDelete(item)}>
                                        <Trash2 className="h-4 w-4 text-danger" aria-hidden />
                                    </Button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            <ConfirmDialog
                open={pendingDelete !== null}
                onOpenChange={(open) => !open && setPendingDelete(null)}
                title={t('deleteTitle')}
                description={t('deleteBody')}
                pending={remove.processing}
                onConfirm={() =>
                    pendingDelete &&
                    remove.delete(`/admin/gallery/items/${pendingDelete.id}`, {
                        preserveScroll: true,
                        onSuccess: () => setPendingDelete(null),
                    })
                }
            />
        </AdminLayout>
    );
}
