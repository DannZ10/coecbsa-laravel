import { Head, useForm } from '@inertiajs/react';
import { Pencil, Plus, Save, Tags, Trash2, X } from 'lucide-react';
import * as React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/admin/button';
import { ConfirmDialog } from '@/Components/admin/confirm-dialog';
import { AdminPageHeader } from '@/Components/admin/page-header';
import { Alert } from '@/Components/ui/alert';
import { EmptyState } from '@/Components/ui/empty-state';
import { Field } from '@/Components/ui/field';
import { Input } from '@/Components/ui/input';
import { useTranslations } from '@/lib/i18n';
import { slugify } from '@/lib/utils';

type Category = {
    id: number;
    slug: string;
    name_id: string;
    name_en: string | null;
    articles_count: number;
};

export default function Categories({ categories }: { categories: Category[] }) {
    const t = useTranslations('admin.categories');
    const tCommon = useTranslations('admin.common');

    const [editing, setEditing] = React.useState<Category | null>(null);
    const [pendingDelete, setPendingDelete] = React.useState<Category | null>(null);

    // One form helper for both create and edit: the only difference is the URL
    // and the verb, so a second one would be two copies of the same fields.
    const form = useForm({ name_id: '', name_en: '', slug: '' });
    const remove = useForm({});

    function reset() {
        setEditing(null);
        form.reset();
        form.clearErrors();
    }

    function submit(event: React.FormEvent) {
        event.preventDefault();

        const options = { preserveScroll: true, onSuccess: () => reset() };

        if (editing) {
            form.put(`/admin/categories/${editing.id}`, options);
        } else {
            form.post('/admin/categories', options);
        }
    }

    function startEdit(category: Category) {
        setEditing(category);
        form.clearErrors();
        form.setData({
            name_id: category.name_id,
            name_en: category.name_en ?? '',
            slug: category.slug,
        });
    }

    return (
        <AdminLayout>
            <Head title={t('title')} />

            <div className="mx-auto max-w-3xl">
                <AdminPageHeader index="01" title={t('title')} description={t('subtitle')} />

                <form onSubmit={submit} className="space-y-4 border-y border-line py-6">
                    <h2 className="font-display text-base font-bold text-foreground">
                        {editing ? t('editTitle', { name: editing.name_id }) : t('addTitle')}
                    </h2>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <Field id="name_id" label={t('nameId')} required error={form.errors.name_id}>
                            <Input
                                id="name_id"
                                value={form.data.name_id}
                                aria-invalid={Boolean(form.errors.name_id)}
                                placeholder={t('nameIdPlaceholder')}
                                onChange={(event) => form.setData('name_id', event.target.value)}
                            />
                        </Field>

                        <Field id="name_en" label={t('nameEn')} error={form.errors.name_en}>
                            <Input
                                id="name_en"
                                value={form.data.name_en}
                                placeholder={t('nameEnPlaceholder')}
                                onChange={(event) => form.setData('name_en', event.target.value)}
                            />
                        </Field>

                        <Field
                            id="slug"
                            label={t('slug')}
                            className="sm:col-span-2"
                            error={form.errors.slug}
                            helper={
                                form.data.slug.trim() || !form.data.name_id
                                    ? t('slugHelper')
                                    : t('slugDerived', { slug: slugify(form.data.name_id) })
                            }
                        >
                            <Input
                                id="slug"
                                value={form.data.slug}
                                aria-invalid={Boolean(form.errors.slug)}
                                placeholder={t('slugPlaceholder')}
                                onChange={(event) => form.setData('slug', slugify(event.target.value))}
                            />
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

                <div className="border-t border-line">
                    {categories.length === 0 ? (
                        <EmptyState
                            icon={Tags}
                            title={t('empty')}
                            description={t('emptyBody')}
                            className="border-0 bg-transparent"
                        />
                    ) : (
                        <ul className="divide-y divide-line">
                            {categories.map((category) => (
                                <li key={category.id} className="flex items-center gap-3 px-4 py-3 sm:px-5">
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-medium text-foreground">
                                            {category.name_id}
                                            {category.name_en && (
                                                <span className="ml-2 font-normal text-foreground-subtle">
                                                    · {category.name_en}
                                                </span>
                                            )}
                                        </p>
                                        <p className="truncate font-mono text-xs text-foreground-subtle">
                                            /{category.slug} · {t('articleCount', { count: category.articles_count })}
                                        </p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        aria-label={tCommon('editAria', { name: category.name_id })}
                                        onClick={() => startEdit(category)}
                                    >
                                        <Pencil className="h-4 w-4" aria-hidden />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        aria-label={tCommon('deleteAria', { name: category.name_id })}
                                        onClick={() => setPendingDelete(category)}
                                    >
                                        <Trash2 className="h-4 w-4 text-danger" aria-hidden />
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {pendingDelete !== null && pendingDelete.articles_count > 0 && (
                    <Alert variant="warning" className="mt-4">
                        {t('deleteWarning', { count: pendingDelete.articles_count })}
                    </Alert>
                )}

                <ConfirmDialog
                    open={pendingDelete !== null}
                    onOpenChange={(open) => !open && setPendingDelete(null)}
                    title={t('deleteTitle')}
                    description={
                        <>
                            <strong className="text-foreground">{pendingDelete?.name_id}</strong> {t('deleteBody')}
                        </>
                    }
                    pending={remove.processing}
                    onConfirm={() =>
                        pendingDelete &&
                        remove.delete(`/admin/categories/${pendingDelete.id}`, {
                            preserveScroll: true,
                            onSuccess: () => setPendingDelete(null),
                        })
                    }
                />
            </div>
        </AdminLayout>
    );
}
