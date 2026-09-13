import { Head, useForm } from '@inertiajs/react';
import { Handshake, Pencil, Plus, Save, Trash2, X } from 'lucide-react';
import * as React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/admin/button';
import { ConfirmDialog } from '@/Components/admin/confirm-dialog';
import { ContentTabs } from '@/Components/admin/content-tabs';
import { AdminPageHeader } from '@/Components/admin/page-header';
import { EmptyState } from '@/Components/ui/empty-state';
import { Field } from '@/Components/ui/field';
import { Input } from '@/Components/ui/input';
import { useTranslations } from '@/lib/i18n';
import { slugify } from '@/lib/utils';

type Partner = {
    id: number;
    slug: string;
    name_id: string;
    name_en: string | null;
    group_label_id: string;
    group_label_en: string | null;
    logo_url: string | null;
    href: string | null;
    position: number;
};

const EMPTY = {
    slug: '',
    name_id: '',
    name_en: '',
    group_label_id: '',
    group_label_en: '',
    logo_url: '',
    href: '',
    position: 0,
};

export default function Partners({ partners, groups }: { partners: Partner[]; groups: string[] }) {
    const t = useTranslations('admin.content');
    const tCommon = useTranslations('admin.common');

    const [editing, setEditing] = React.useState<Partner | null>(null);
    const [pendingDelete, setPendingDelete] = React.useState<Partner | null>(null);

    const form = useForm(EMPTY);
    const remove = useForm({});

    function reset() {
        setEditing(null);
        form.reset();
        form.clearErrors();
    }

    function startEdit(partner: Partner) {
        setEditing(partner);
        form.clearErrors();
        form.setData({
            slug: partner.slug,
            name_id: partner.name_id,
            name_en: partner.name_en ?? '',
            group_label_id: partner.group_label_id,
            group_label_en: partner.group_label_en ?? '',
            logo_url: partner.logo_url ?? '',
            href: partner.href ?? '',
            position: partner.position,
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function submit(event: React.FormEvent) {
        event.preventDefault();
        const options = { preserveScroll: true, onSuccess: () => reset() };
        if (editing) form.put(`/admin/content/partners/${editing.id}`, options);
        else form.post('/admin/content/partners', options);
    }

    // Grouped for display exactly as the public partner strip groups them.
    const grouped = partners.reduce<Record<string, Partner[]>>((acc, partner) => {
        (acc[partner.group_label_id] ??= []).push(partner);
        return acc;
    }, {});

    return (
        <AdminLayout title={t('partners')}>
            <Head title={t('partners')} />

            <AdminPageHeader index="03" title={t('partners')} description={t('partnersSubtitle')} />
            <ContentTabs current="partners" />

            <form onSubmit={submit} className="space-y-4 border-y border-line py-6">
                <h2 className="font-display text-base font-bold text-foreground">
                    {editing ? t('editPartner', { name: editing.name_id }) : t('addPartner')}
                </h2>

                <div className="grid gap-4 sm:grid-cols-2">
                    <Field id="name_id" label={t('nameId')} required error={form.errors.name_id}>
                        <Input id="name_id" value={form.data.name_id} onChange={(e) => form.setData('name_id', e.target.value)} />
                    </Field>
                    <Field id="name_en" label={t('nameEn')} error={form.errors.name_en}>
                        <Input id="name_en" value={form.data.name_en} onChange={(e) => form.setData('name_en', e.target.value)} />
                    </Field>

                    <Field id="group_label_id" label={t('groupLabelId')} required helper={t('groupLabelHelper')} error={form.errors.group_label_id}>
                        <>
                            <Input
                                id="group_label_id"
                                list="partner-groups"
                                value={form.data.group_label_id}
                                onChange={(e) => form.setData('group_label_id', e.target.value)}
                            />
                            {/* Suggestions only: a new group is still allowed,
                                but the existing spellings are one keystroke
                                away so the strip does not sprout near-duplicates. */}
                            <datalist id="partner-groups">
                                {groups.map((group) => (
                                    <option key={group} value={group} />
                                ))}
                            </datalist>
                        </>
                    </Field>
                    <Field id="group_label_en" label={t('groupLabelEn')} error={form.errors.group_label_en}>
                        <Input id="group_label_en" value={form.data.group_label_en} onChange={(e) => form.setData('group_label_en', e.target.value)} />
                    </Field>

                    <Field id="logo_url" label={t('logoUrl')} error={form.errors.logo_url}>
                        <Input id="logo_url" value={form.data.logo_url} placeholder="https://" onChange={(e) => form.setData('logo_url', e.target.value)} />
                    </Field>
                    <Field id="href" label={t('href')} error={form.errors.href}>
                        <Input id="href" value={form.data.href} placeholder="https://" onChange={(e) => form.setData('href', e.target.value)} />
                    </Field>

                    <Field id="position" label={t('position')} helper={t('positionHelper')} error={form.errors.position}>
                        <Input id="position" type="number" min={0} value={form.data.position} onChange={(e) => form.setData('position', Number(e.target.value))} />
                    </Field>

                    <Field
                        id="slug"
                        label={t('slug')}
                        error={form.errors.slug}
                        helper={form.data.slug.trim() || !form.data.name_id ? t('slugHelper') : t('slugDerived', { slug: slugify(form.data.name_id) })}
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

            {partners.length === 0 ? (
                <EmptyState icon={Handshake} title={t('partnersEmpty')} className="mt-6 border-0 bg-transparent" />
            ) : (
                Object.entries(grouped).map(([group, members]) => (
                    <section key={group} className="border-b border-line py-4">
                        <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-foreground-subtle">{group}</h3>
                        <ul className="divide-y divide-line">
                            {members.map((partner) => (
                                <li key={partner.id} className="flex items-center gap-3 py-2">
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-medium text-foreground">{partner.name_id}</p>
                                        <p className="truncate text-xs text-foreground-subtle">#{partner.position}{partner.href ? ` · ${partner.href}` : ''}</p>
                                    </div>
                                    <Button variant="ghost" size="icon" aria-label={tCommon('editAria', { name: partner.name_id })} onClick={() => startEdit(partner)}>
                                        <Pencil className="h-4 w-4" aria-hidden />
                                    </Button>
                                    <Button variant="ghost" size="icon" aria-label={tCommon('deleteAria', { name: partner.name_id })} onClick={() => setPendingDelete(partner)}>
                                        <Trash2 className="h-4 w-4 text-danger" aria-hidden />
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    </section>
                ))
            )}

            <ConfirmDialog
                open={pendingDelete !== null}
                onOpenChange={(open) => !open && setPendingDelete(null)}
                title={t('deletePartnerTitle')}
                description={
                    <>
                        <strong className="text-foreground">{pendingDelete?.name_id}</strong> {t('deletePartnerBody')}
                    </>
                }
                pending={remove.processing}
                onConfirm={() =>
                    pendingDelete &&
                    remove.delete(`/admin/content/partners/${pendingDelete.id}`, {
                        preserveScroll: true,
                        onSuccess: () => setPendingDelete(null),
                    })
                }
            />
        </AdminLayout>
    );
}
