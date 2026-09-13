import { Head, useForm } from '@inertiajs/react';
import { ImagePlus, Loader2, Pencil, Plus, Save, SlidersHorizontal, Trash2, X } from 'lucide-react';
import * as React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { ContentTabs } from '@/Components/admin/content-tabs';
import { Button } from '@/Components/admin/button';
import { ConfirmDialog } from '@/Components/admin/confirm-dialog';
import { AdminPageHeader } from '@/Components/admin/page-header';
import { uploadImage } from '@/Components/admin/upload';
import { EmptyState } from '@/Components/ui/empty-state';
import { Field } from '@/Components/ui/field';
import { Input, Textarea } from '@/Components/ui/input';
import { useTranslations } from '@/lib/i18n';
import { slugify } from '@/lib/utils';

type Program = {
    id: number;
    slug: string;
    tag_label_id: string;
    tag_label_en: string | null;
    title_id: string;
    title_en: string | null;
    place_id: string;
    place_en: string | null;
    desc_id: string;
    desc_en: string | null;
    funder_id: string;
    funder_en: string | null;
    details_id: string | null;
    details_en: string | null;
    image: string;
    status: string;
    position: number;
};

const EMPTY = {
    slug: '',
    tag_label_id: '',
    tag_label_en: '',
    title_id: '',
    title_en: '',
    place_id: '',
    place_en: '',
    desc_id: '',
    desc_en: '',
    funder_id: '',
    funder_en: '',
    details_id: '',
    details_en: '',
    image: '',
    status: 'ongoing',
    position: 0,
};

export default function Programs({ programs, statuses }: { programs: Program[]; statuses: string[] }) {
    const t = useTranslations('admin.content');
    const tCommon = useTranslations('admin.common');
    const tStatus = useTranslations('admin.programStatus');

    const [editing, setEditing] = React.useState<Program | null>(null);
    const [pendingDelete, setPendingDelete] = React.useState<Program | null>(null);
    const [uploading, setUploading] = React.useState(false);

    const form = useForm(EMPTY);
    const remove = useForm({});

    function reset() {
        setEditing(null);
        form.reset();
        form.clearErrors();
    }

    function startEdit(program: Program) {
        setEditing(program);
        form.clearErrors();
        form.setData({
            slug: program.slug,
            tag_label_id: program.tag_label_id,
            tag_label_en: program.tag_label_en ?? '',
            title_id: program.title_id,
            title_en: program.title_en ?? '',
            place_id: program.place_id,
            place_en: program.place_en ?? '',
            desc_id: program.desc_id,
            desc_en: program.desc_en ?? '',
            funder_id: program.funder_id,
            funder_en: program.funder_en ?? '',
            details_id: program.details_id ?? '',
            details_en: program.details_en ?? '',
            image: program.image,
            status: program.status,
            position: program.position,
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    async function pickImage(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
            form.setData('image', await uploadImage(file));
        } finally {
            setUploading(false);
            event.target.value = '';
        }
    }

    function submit(event: React.FormEvent) {
        event.preventDefault();
        const options = { preserveScroll: true, onSuccess: () => reset() };
        if (editing) form.put(`/admin/content/programs/${editing.id}`, options);
        else form.post('/admin/content/programs', options);
    }

    return (
        <AdminLayout title={t('programs')}>
            <Head title={t('programs')} />

            <AdminPageHeader index="03" title={t('programs')} description={t('programsSubtitle')} />
            <ContentTabs current="programs" />

            <form onSubmit={submit} className="space-y-4 border-y border-line py-6">
                <h2 className="font-display text-base font-bold text-foreground">
                    {editing ? t('editProgram', { name: editing.title_id }) : t('addProgram')}
                </h2>

                <div className="grid gap-4 sm:grid-cols-2">
                    <Field id="title_id" label={t('titleId')} required error={form.errors.title_id}>
                        <Input id="title_id" value={form.data.title_id} onChange={(e) => form.setData('title_id', e.target.value)} />
                    </Field>
                    <Field id="title_en" label={t('titleEn')} error={form.errors.title_en}>
                        <Input id="title_en" value={form.data.title_en} onChange={(e) => form.setData('title_en', e.target.value)} />
                    </Field>

                    <Field id="tag_label_id" label={t('tagLabelId')} required helper={t('tagLabelHelper')} error={form.errors.tag_label_id}>
                        <Input id="tag_label_id" value={form.data.tag_label_id} onChange={(e) => form.setData('tag_label_id', e.target.value)} />
                    </Field>
                    <Field id="tag_label_en" label={t('tagLabelEn')} error={form.errors.tag_label_en}>
                        <Input id="tag_label_en" value={form.data.tag_label_en} onChange={(e) => form.setData('tag_label_en', e.target.value)} />
                    </Field>

                    <Field id="place_id" label={t('placeId')} required error={form.errors.place_id}>
                        <Input id="place_id" value={form.data.place_id} onChange={(e) => form.setData('place_id', e.target.value)} />
                    </Field>
                    <Field id="place_en" label={t('placeEn')} error={form.errors.place_en}>
                        <Input id="place_en" value={form.data.place_en} onChange={(e) => form.setData('place_en', e.target.value)} />
                    </Field>

                    <Field id="funder_id" label={t('funderId')} required error={form.errors.funder_id}>
                        <Input id="funder_id" value={form.data.funder_id} onChange={(e) => form.setData('funder_id', e.target.value)} />
                    </Field>
                    <Field id="funder_en" label={t('funderEn')} error={form.errors.funder_en}>
                        <Input id="funder_en" value={form.data.funder_en} onChange={(e) => form.setData('funder_en', e.target.value)} />
                    </Field>

                    <Field id="desc_id" label={t('descId')} required className="sm:col-span-2" error={form.errors.desc_id}>
                        <Textarea id="desc_id" rows={3} value={form.data.desc_id} onChange={(e) => form.setData('desc_id', e.target.value)} />
                    </Field>
                    <Field id="desc_en" label={t('descEn')} className="sm:col-span-2" error={form.errors.desc_en}>
                        <Textarea id="desc_en" rows={3} value={form.data.desc_en} onChange={(e) => form.setData('desc_en', e.target.value)} />
                    </Field>

                    <Field id="details_id" label={t('detailsId')} className="sm:col-span-2" error={form.errors.details_id}>
                        <Textarea id="details_id" rows={3} value={form.data.details_id} onChange={(e) => form.setData('details_id', e.target.value)} />
                    </Field>
                    <Field id="details_en" label={t('detailsEn')} className="sm:col-span-2" error={form.errors.details_en}>
                        <Textarea id="details_en" rows={3} value={form.data.details_en} onChange={(e) => form.setData('details_en', e.target.value)} />
                    </Field>

                    <Field id="status" label={tCommon('status')} error={form.errors.status}>
                        <select
                            id="status"
                            value={form.data.status}
                            onChange={(e) => form.setData('status', e.target.value)}
                            className="h-11 w-full rounded-md border border-line bg-surface px-3 text-sm text-foreground"
                        >
                            {statuses.map((status) => (
                                <option key={status} value={status}>
                                    {tStatus(status)}
                                </option>
                            ))}
                        </select>
                    </Field>

                    <Field id="position" label={t('position')} helper={t('positionHelper')} error={form.errors.position}>
                        <Input
                            id="position"
                            type="number"
                            min={0}
                            value={form.data.position}
                            onChange={(e) => form.setData('position', Number(e.target.value))}
                        />
                    </Field>

                    <Field id="image" label={t('image')} required className="sm:col-span-2" error={form.errors.image}>
                        <div className="space-y-2">
                            {form.data.image && (
                                <img src={form.data.image} alt="" className="aspect-[3/2] w-full max-w-sm rounded-md border border-line object-cover" />
                            )}
                            <div className="flex gap-2">
                                <Input
                                    id="image"
                                    value={form.data.image}
                                    placeholder="https://"
                                    onChange={(e) => form.setData('image', e.target.value)}
                                />
                                <input id="program-image" type="file" accept="image/jpeg,image/png,image/webp,image/avif" className="sr-only" onChange={pickImage} />
                                <Button asChild variant="secondary">
                                    <label htmlFor="program-image" className="cursor-pointer whitespace-nowrap">
                                        {uploading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <ImagePlus className="h-4 w-4" aria-hidden />}
                                        {t('upload')}
                                    </label>
                                </Button>
                            </div>
                        </div>
                    </Field>

                    <Field
                        id="slug"
                        label={t('slug')}
                        className="sm:col-span-2"
                        error={form.errors.slug}
                        helper={form.data.slug.trim() || !form.data.title_id ? t('slugHelper') : t('slugDerived', { slug: slugify(form.data.title_id) })}
                    >
                        <Input id="slug" value={form.data.slug} onChange={(e) => form.setData('slug', slugify(e.target.value))} />
                    </Field>
                </div>

                <div className="flex gap-2">
                    <Button type="submit" loading={form.processing} disabled={form.processing}>
                        {editing ? <Save className="h-4 w-4" aria-hidden /> : <Plus className="h-4 w-4" aria-hidden />}
                        {editing ? tCommon('saveChanges') : tCommon('add')}
                    </Button>
                    {editing && (
                        <Button type="button" variant="ghost" onClick={reset}>
                            <X className="h-4 w-4" aria-hidden />
                            {tCommon('cancel')}
                        </Button>
                    )}
                </div>
            </form>

            {programs.length === 0 ? (
                <EmptyState icon={SlidersHorizontal} title={t('programsEmpty')} className="mt-6 border-0 bg-transparent" />
            ) : (
                <ul className="divide-y divide-line">
                    {programs.map((program) => (
                        <li key={program.id} className="flex items-center gap-4 py-3">
                            <img src={program.image} alt="" width={96} height={64} loading="lazy" className="hidden h-16 w-24 shrink-0 rounded-md object-cover sm:block" />
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium text-foreground">{program.title_id}</p>
                                <p className="truncate text-xs text-foreground-subtle">
                                    #{program.position} · {tStatus(program.status)} · {program.place_id}
                                </p>
                            </div>
                            <Button variant="ghost" size="icon" aria-label={tCommon('editAria', { name: program.title_id })} onClick={() => startEdit(program)}>
                                <Pencil className="h-4 w-4" aria-hidden />
                            </Button>
                            <Button variant="ghost" size="icon" aria-label={tCommon('deleteAria', { name: program.title_id })} onClick={() => setPendingDelete(program)}>
                                <Trash2 className="h-4 w-4 text-danger" aria-hidden />
                            </Button>
                        </li>
                    ))}
                </ul>
            )}

            <ConfirmDialog
                open={pendingDelete !== null}
                onOpenChange={(open) => !open && setPendingDelete(null)}
                title={t('deleteProgramTitle')}
                description={
                    <>
                        <strong className="text-foreground">{pendingDelete?.title_id}</strong> {t('deleteProgramBody')}
                    </>
                }
                pending={remove.processing}
                onConfirm={() =>
                    pendingDelete &&
                    remove.delete(`/admin/content/programs/${pendingDelete.id}`, {
                        preserveScroll: true,
                        onSuccess: () => setPendingDelete(null),
                    })
                }
            />
        </AdminLayout>
    );
}
