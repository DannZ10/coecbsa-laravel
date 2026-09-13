import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, ImagePlus, Loader2, Save, Trash2, X } from 'lucide-react';
import * as React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/admin/button';
import { ConfirmDialog } from '@/Components/admin/confirm-dialog';
import { AdminPageHeader } from '@/Components/admin/page-header';
import { RichTextEditor } from '@/Components/admin/rich-text-editor';
import { uploadImage } from '@/Components/admin/upload';
import { Field } from '@/Components/ui/field';
import { Input, Textarea } from '@/Components/ui/input';
import { useTranslations } from '@/lib/i18n';
import { cn, slugify } from '@/lib/utils';

type ArticlePayload = {
    id: number;
    slug: string;
    title_id: string;
    title_en: string;
    excerpt_id: string;
    excerpt_en: string;
    content_id: string;
    content_en: string;
    cover_image: string;
    status: string;
    published_at: string | null;
    category_id: number | null;
    tags: number[];
};

const EMPTY = {
    slug: '',
    title_id: '',
    title_en: '',
    excerpt_id: '',
    excerpt_en: '',
    content_id: '',
    content_en: '',
    cover_image: '',
    status: 'draft',
    published_at: '',
    category_id: '' as number | '',
    tags: [] as number[],
};

export default function ArticleForm({
    article,
    categories,
    tags,
}: {
    article: ArticlePayload | null;
    categories: { id: number; name: string }[];
    tags: { id: number; name: string }[];
}) {
    const t = useTranslations('admin.editor');
    const tNews = useTranslations('admin.news');
    const tCommon = useTranslations('admin.common');
    const tStatus = useTranslations('admin.status');

    const [tab, setTab] = React.useState<'id' | 'en'>('id');
    const [uploading, setUploading] = React.useState(false);
    const [uploadError, setUploadError] = React.useState<string | null>(null);
    const [confirmDelete, setConfirmDelete] = React.useState(false);

    const form = useForm(
        article
            ? {
                  ...EMPTY,
                  ...article,
                  published_at: article.published_at ?? '',
                  category_id: article.category_id ?? ('' as const),
              }
            : EMPTY,
    );
    const remove = useForm({});

    function submit(event: React.FormEvent) {
        event.preventDefault();

        if (article) {
            form.put(`/admin/news/${article.id}`, { preserveScroll: true });
        } else {
            form.post('/admin/news');
        }
    }

    async function pickCover(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (!file) return;

        setUploadError(null);
        setUploading(true);
        try {
            form.setData('cover_image', await uploadImage(file));
        } catch (cause) {
            setUploadError(cause instanceof Error ? cause.message : t('uploadFailed'));
        } finally {
            setUploading(false);
            event.target.value = '';
        }
    }

    const isIndonesian = tab === 'id';

    return (
        <AdminLayout title={article ? tNews('editTitle') : tNews('create')}>
            <Head title={article ? form.data.title_id || tNews('editTitle') : tNews('create')} />

            <AdminPageHeader
                index="02"
                title={article ? tNews('editTitle') : tNews('create')}
                description={tNews('editSubtitle')}
                actions={
                    <Button asChild variant="ghost">
                        <Link href="/admin/news">
                            <ArrowLeft className="h-4 w-4" aria-hidden />
                            {tNews('backToList')}
                        </Link>
                    </Button>
                }
            />

            <form onSubmit={submit} className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
                <div className="space-y-5">
                    {/* One tab pair for the whole body rather than a duplicated
                        set of fields: the writer edits one language at a time,
                        and both versions post together on save. */}
                    <div role="tablist" aria-label={t('languageTabs')} className="flex gap-1 border-b border-line">
                        {(['id', 'en'] as const).map((code) => (
                            <button
                                key={code}
                                type="button"
                                role="tab"
                                aria-selected={tab === code}
                                onClick={() => setTab(code)}
                                className={cn(
                                    '-mb-px border-b-2 px-4 py-2 text-sm font-semibold transition-colors',
                                    tab === code
                                        ? 'border-primary text-primary'
                                        : 'border-transparent text-foreground-muted hover:text-foreground',
                                )}
                            >
                                {code === 'id' ? t('indonesian') : t('english')}
                            </button>
                        ))}
                    </div>

                    <Field
                        id={`title_${tab}`}
                        label={isIndonesian ? t('titleId') : t('titleEn')}
                        required={isIndonesian}
                        error={isIndonesian ? form.errors.title_id : form.errors.title_en}
                    >
                        <Input
                            id={`title_${tab}`}
                            value={isIndonesian ? form.data.title_id : form.data.title_en}
                            onChange={(event) =>
                                form.setData(isIndonesian ? 'title_id' : 'title_en', event.target.value)
                            }
                        />
                    </Field>

                    <Field
                        id={`excerpt_${tab}`}
                        label={isIndonesian ? t('excerptId') : t('excerptEn')}
                        helper={t('excerptHelper')}
                        error={isIndonesian ? form.errors.excerpt_id : form.errors.excerpt_en}
                    >
                        <Textarea
                            id={`excerpt_${tab}`}
                            rows={3}
                            value={isIndonesian ? form.data.excerpt_id : form.data.excerpt_en}
                            onChange={(event) =>
                                form.setData(isIndonesian ? 'excerpt_id' : 'excerpt_en', event.target.value)
                            }
                        />
                    </Field>

                    <Field
                        id={`content_${tab}`}
                        label={isIndonesian ? t('contentId') : t('contentEn')}
                        required={isIndonesian}
                        error={isIndonesian ? form.errors.content_id : form.errors.content_en}
                    >
                        <RichTextEditor
                            key={tab}
                            ariaLabel={isIndonesian ? t('contentId') : t('contentEn')}
                            value={isIndonesian ? form.data.content_id : form.data.content_en}
                            onChange={(html) => form.setData(isIndonesian ? 'content_id' : 'content_en', html)}
                        />
                    </Field>
                </div>

                <aside className="space-y-5 lg:border-l lg:border-line lg:pl-6">
                    <Field id="status" label={tCommon('status')} error={form.errors.status}>
                        <select
                            id="status"
                            value={form.data.status}
                            onChange={(event) => form.setData('status', event.target.value)}
                            className="h-11 w-full rounded-md border border-line bg-surface px-3 text-sm text-foreground"
                        >
                            {['draft', 'published', 'scheduled'].map((status) => (
                                <option key={status} value={status}>
                                    {tStatus(status)}
                                </option>
                            ))}
                        </select>
                    </Field>

                    {form.data.status !== 'draft' && (
                        <Field
                            id="published_at"
                            label={t('publishedAt')}
                            helper={form.data.status === 'published' ? t('publishedNowHelper') : t('scheduledHelper')}
                            error={form.errors.published_at}
                        >
                            <Input
                                id="published_at"
                                type="datetime-local"
                                value={form.data.published_at}
                                onChange={(event) => form.setData('published_at', event.target.value)}
                            />
                        </Field>
                    )}

                    <Field id="category_id" label={tCommon('category')} error={form.errors.category_id}>
                        <select
                            id="category_id"
                            value={form.data.category_id === '' ? '' : String(form.data.category_id)}
                            onChange={(event) =>
                                form.setData('category_id', event.target.value === '' ? '' : Number(event.target.value))
                            }
                            className="h-11 w-full rounded-md border border-line bg-surface px-3 text-sm text-foreground"
                        >
                            <option value="">{tCommon('optional')}</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </Field>

                    <fieldset>
                        <legend className="text-sm font-medium text-foreground">{t('tags')}</legend>
                        <div className="mt-2 flex flex-wrap gap-2">
                            {tags.map((tag) => {
                                const checked = form.data.tags.includes(tag.id);
                                return (
                                    <label
                                        key={tag.id}
                                        className={cn(
                                            'cursor-pointer rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                                            checked
                                                ? 'border-primary bg-primary text-primary-fg'
                                                : 'border-line text-foreground-muted hover:bg-surface-2',
                                        )}
                                    >
                                        <input
                                            type="checkbox"
                                            className="sr-only"
                                            checked={checked}
                                            onChange={() =>
                                                form.setData(
                                                    'tags',
                                                    checked
                                                        ? form.data.tags.filter((id) => id !== tag.id)
                                                        : [...form.data.tags, tag.id],
                                                )
                                            }
                                        />
                                        {tag.name}
                                    </label>
                                );
                            })}
                        </div>
                    </fieldset>

                    <Field id="cover_image" label={t('coverImage')} error={form.errors.cover_image ?? uploadError ?? undefined}>
                        <div className="space-y-2">
                            {form.data.cover_image && (
                                <div className="relative">
                                    <img
                                        src={form.data.cover_image}
                                        alt=""
                                        className="aspect-[3/2] w-full rounded-md border border-line object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => form.setData('cover_image', '')}
                                        aria-label={t('removeCover')}
                                        className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-stone-950/70 text-white"
                                    >
                                        <X className="h-4 w-4" aria-hidden />
                                    </button>
                                </div>
                            )}
                            <input
                                id="cover-file"
                                type="file"
                                accept="image/jpeg,image/png,image/webp,image/avif"
                                className="sr-only"
                                onChange={pickCover}
                            />
                            <Button asChild variant="secondary" className="w-full">
                                <label htmlFor="cover-file" className="cursor-pointer">
                                    {uploading ? (
                                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                                    ) : (
                                        <ImagePlus className="h-4 w-4" aria-hidden />
                                    )}
                                    {form.data.cover_image ? t('replaceCover') : t('addCover')}
                                </label>
                            </Button>
                        </div>
                    </Field>

                    <Field
                        id="slug"
                        label={t('slug')}
                        error={form.errors.slug}
                        helper={
                            form.data.slug.trim() || !form.data.title_id
                                ? t('slugHelper')
                                : t('slugDerived', { slug: slugify(form.data.title_id) })
                        }
                    >
                        <Input
                            id="slug"
                            value={form.data.slug}
                            onChange={(event) => form.setData('slug', slugify(event.target.value))}
                        />
                    </Field>

                    <div className="flex flex-col gap-2 border-t border-line pt-4">
                        <Button type="submit" loading={form.processing} disabled={form.processing}>
                            <Save className="h-4 w-4" aria-hidden />
                            {tCommon('save')}
                        </Button>
                        {article && (
                            <Button type="button" variant="ghost" onClick={() => setConfirmDelete(true)}>
                                <Trash2 className="h-4 w-4 text-danger" aria-hidden />
                                {tCommon('delete')}
                            </Button>
                        )}
                    </div>
                </aside>
            </form>

            <ConfirmDialog
                open={confirmDelete}
                onOpenChange={setConfirmDelete}
                title={tNews('deleteTitle')}
                description={
                    <>
                        <strong className="text-foreground">{form.data.title_id}</strong> {tNews('deleteBody')}
                    </>
                }
                pending={remove.processing}
                onConfirm={() => article && remove.delete(`/admin/news/${article.id}`)}
            />
        </AdminLayout>
    );
}
