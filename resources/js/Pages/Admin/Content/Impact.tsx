import { Head, useForm } from '@inertiajs/react';
import { Plus, Save, Trash2 } from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/admin/button';
import { ContentTabs } from '@/Components/admin/content-tabs';
import { AdminPageHeader } from '@/Components/admin/page-header';
import { Field } from '@/Components/ui/field';
import { Input, Textarea } from '@/Components/ui/input';
import { useTranslations } from '@/lib/i18n';

type Stat = { stat_key: string; value: string; label_id: string; label_en: string | null };
type Sdg = {
    code: string;
    label_id: string;
    label_en: string | null;
    description_id: string;
    description_en: string | null;
};

export default function Impact({ stats, sdgs }: { stats: Stat[]; sdgs: Sdg[] }) {
    const t = useTranslations('admin.content');
    const tCommon = useTranslations('admin.common');

    // Both lists are edited as one block and saved in a single transaction, so
    // the page cannot leave the impact section half-updated.
    const form = useForm({
        stats: stats.map((stat) => ({ ...stat, label_en: stat.label_en ?? '' })),
        sdgs: sdgs.map((sdg) => ({
            ...sdg,
            label_en: sdg.label_en ?? '',
            description_en: sdg.description_en ?? '',
        })),
    });

    function setStat(index: number, key: keyof Stat, value: string) {
        form.setData(
            'stats',
            form.data.stats.map((stat, i) => (i === index ? { ...stat, [key]: value } : stat)),
        );
    }

    function setSdg(index: number, key: keyof Sdg, value: string) {
        form.setData(
            'sdgs',
            form.data.sdgs.map((sdg, i) => (i === index ? { ...sdg, [key]: value } : sdg)),
        );
    }

    return (
        <AdminLayout title={t('impact')}>
            <Head title={t('impact')} />

            <AdminPageHeader index="03" title={t('impact')} description={t('impactSubtitle')} />
            <ContentTabs current="impact" />

            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    form.put('/admin/content/impact', { preserveScroll: true });
                }}
                className="space-y-10 pt-6"
            >
                <section className="space-y-4">
                    <header className="flex items-center justify-between gap-3">
                        <div>
                            <h2 className="font-display text-base font-bold text-foreground">{t('stats')}</h2>
                            <p className="text-sm text-foreground-muted">{t('statsHelper')}</p>
                        </div>
                        <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            disabled={form.data.stats.length >= 12}
                            onClick={() =>
                                form.setData('stats', [
                                    ...form.data.stats,
                                    { stat_key: '', value: '', label_id: '', label_en: '' },
                                ])
                            }
                        >
                            <Plus className="h-4 w-4" aria-hidden />
                            {tCommon('add')}
                        </Button>
                    </header>

                    <ul className="space-y-4">
                        {form.data.stats.map((stat, index) => (
                            <li key={index} className="grid gap-3 rounded-md border border-line p-4 sm:grid-cols-[8rem_6rem_1fr_1fr_auto]">
                                <Field id={`stat_key_${index}`} label={t('statKey')} error={form.errors[`stats.${index}.stat_key` as keyof typeof form.errors]}>
                                    <Input id={`stat_key_${index}`} value={stat.stat_key} onChange={(e) => setStat(index, 'stat_key', e.target.value)} />
                                </Field>
                                <Field id={`stat_value_${index}`} label={t('statValue')} error={form.errors[`stats.${index}.value` as keyof typeof form.errors]}>
                                    <Input id={`stat_value_${index}`} value={stat.value} onChange={(e) => setStat(index, 'value', e.target.value)} />
                                </Field>
                                <Field id={`stat_label_id_${index}`} label={t('labelId')} error={form.errors[`stats.${index}.label_id` as keyof typeof form.errors]}>
                                    <Input id={`stat_label_id_${index}`} value={stat.label_id} onChange={(e) => setStat(index, 'label_id', e.target.value)} />
                                </Field>
                                <Field id={`stat_label_en_${index}`} label={t('labelEn')}>
                                    <Input id={`stat_label_en_${index}`} value={stat.label_en ?? ''} onChange={(e) => setStat(index, 'label_en', e.target.value)} />
                                </Field>
                                <div className="flex items-end">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        aria-label={tCommon('deleteAria', { name: stat.label_id || stat.stat_key })}
                                        onClick={() => form.setData('stats', form.data.stats.filter((_, i) => i !== index))}
                                    >
                                        <Trash2 className="h-4 w-4 text-danger" aria-hidden />
                                    </Button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>

                <section className="space-y-4">
                    <header className="flex items-center justify-between gap-3">
                        <div>
                            <h2 className="font-display text-base font-bold text-foreground">{t('sdgs')}</h2>
                            <p className="text-sm text-foreground-muted">{t('sdgsHelper')}</p>
                        </div>
                        <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            disabled={form.data.sdgs.length >= 17}
                            onClick={() =>
                                form.setData('sdgs', [
                                    ...form.data.sdgs,
                                    { code: '', label_id: '', label_en: '', description_id: '', description_en: '' },
                                ])
                            }
                        >
                            <Plus className="h-4 w-4" aria-hidden />
                            {tCommon('add')}
                        </Button>
                    </header>

                    <ul className="space-y-4">
                        {form.data.sdgs.map((sdg, index) => (
                            <li key={index} className="grid gap-3 rounded-md border border-line p-4 sm:grid-cols-2">
                                <Field id={`sdg_code_${index}`} label={t('sdgCode')} error={form.errors[`sdgs.${index}.code` as keyof typeof form.errors]}>
                                    <Input id={`sdg_code_${index}`} value={sdg.code} onChange={(e) => setSdg(index, 'code', e.target.value)} />
                                </Field>
                                <div className="flex items-end justify-end">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        aria-label={tCommon('deleteAria', { name: sdg.label_id || sdg.code })}
                                        onClick={() => form.setData('sdgs', form.data.sdgs.filter((_, i) => i !== index))}
                                    >
                                        <Trash2 className="h-4 w-4 text-danger" aria-hidden />
                                    </Button>
                                </div>
                                <Field id={`sdg_label_id_${index}`} label={t('labelId')} error={form.errors[`sdgs.${index}.label_id` as keyof typeof form.errors]}>
                                    <Input id={`sdg_label_id_${index}`} value={sdg.label_id} onChange={(e) => setSdg(index, 'label_id', e.target.value)} />
                                </Field>
                                <Field id={`sdg_label_en_${index}`} label={t('labelEn')}>
                                    <Input id={`sdg_label_en_${index}`} value={sdg.label_en ?? ''} onChange={(e) => setSdg(index, 'label_en', e.target.value)} />
                                </Field>
                                <Field id={`sdg_desc_id_${index}`} label={t('descId')} error={form.errors[`sdgs.${index}.description_id` as keyof typeof form.errors]}>
                                    <Textarea id={`sdg_desc_id_${index}`} rows={3} value={sdg.description_id} onChange={(e) => setSdg(index, 'description_id', e.target.value)} />
                                </Field>
                                <Field id={`sdg_desc_en_${index}`} label={t('descEn')}>
                                    <Textarea id={`sdg_desc_en_${index}`} rows={3} value={sdg.description_en ?? ''} onChange={(e) => setSdg(index, 'description_en', e.target.value)} />
                                </Field>
                            </li>
                        ))}
                    </ul>
                </section>

                <Button type="submit" loading={form.processing} disabled={form.processing}>
                    <Save className="h-4 w-4" aria-hidden />
                    {tCommon('saveChanges')}
                </Button>
            </form>
        </AdminLayout>
    );
}
