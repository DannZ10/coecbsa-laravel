import { Head, useForm } from '@inertiajs/react';
import { KeyRound, UserCog } from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/admin/button';
import { AdminPageHeader } from '@/Components/admin/page-header';
import { AdminSection } from '@/Components/admin/section';
import { Alert } from '@/Components/ui/alert';
import { Field } from '@/Components/ui/field';
import { Input } from '@/Components/ui/input';
import { useTranslations } from '@/lib/i18n';

type Profile = {
    name: string;
    email: string;
    role: string;
    has_password: boolean;
    has_google: boolean;
};

export default function Settings({ profile }: { profile: Profile }) {
    const t = useTranslations('admin.settings');
    const tCommon = useTranslations('admin.common');
    const tRole = useTranslations('admin.role');

    const profileForm = useForm({ name: profile.name, email: profile.email });
    const passwordForm = useForm({ current_password: '', password: '', password_confirmation: '' });

    return (
        <AdminLayout>
            <Head title={t('title')} />

            <AdminPageHeader index="08" title={t('title')} description={t('subtitle')} />

            <AdminSection index="01" title={t('profile')} description={t('profileHelper')}>
                <form
                    className="space-y-4"
                    onSubmit={(event) => {
                        event.preventDefault();
                        profileForm.put('/admin/settings/profile', { preserveScroll: true });
                    }}
                >
                    <div className="grid gap-4 sm:grid-cols-2">
                        <Field id="name" label={t('name')} required error={profileForm.errors.name}>
                            <Input id="name" value={profileForm.data.name} onChange={(e) => profileForm.setData('name', e.target.value)} />
                        </Field>
                        <Field id="email" label={t('email')} required error={profileForm.errors.email}>
                            <Input id="email" type="email" value={profileForm.data.email} onChange={(e) => profileForm.setData('email', e.target.value)} />
                        </Field>
                    </div>

                    <p className="text-sm text-foreground-muted">
                        {t('roleLine', { role: tRole(profile.role) })}
                        {profile.has_google ? ` · ${t('googleLinked')}` : ''}
                    </p>

                    <Button type="submit" loading={profileForm.processing}>
                        <UserCog className="h-4 w-4" aria-hidden />
                        {tCommon('saveChanges')}
                    </Button>
                </form>
            </AdminSection>

            <AdminSection index="02" title={t('password')} description={t('passwordHelper')}>
                <form
                    className="space-y-4"
                    onSubmit={(event) => {
                        event.preventDefault();
                        passwordForm.put('/admin/settings/password', {
                            preserveScroll: true,
                            onSuccess: () => passwordForm.reset(),
                        });
                    }}
                >
                    {!profile.has_password && <Alert variant="info">{t('noPasswordYet')}</Alert>}

                    <div className="grid gap-4 sm:grid-cols-2">
                        {profile.has_password && (
                            <Field
                                id="current_password"
                                label={t('currentPassword')}
                                required
                                className="sm:col-span-2"
                                error={passwordForm.errors.current_password}
                            >
                                <Input
                                    id="current_password"
                                    type="password"
                                    autoComplete="current-password"
                                    value={passwordForm.data.current_password}
                                    onChange={(e) => passwordForm.setData('current_password', e.target.value)}
                                />
                            </Field>
                        )}

                        <Field id="password" label={t('newPassword')} required helper={t('minLength')} error={passwordForm.errors.password}>
                            <Input
                                id="password"
                                type="password"
                                autoComplete="new-password"
                                value={passwordForm.data.password}
                                onChange={(e) => passwordForm.setData('password', e.target.value)}
                            />
                        </Field>

                        <Field id="password_confirmation" label={t('confirmPassword')} required>
                            <Input
                                id="password_confirmation"
                                type="password"
                                autoComplete="new-password"
                                value={passwordForm.data.password_confirmation}
                                onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)}
                            />
                        </Field>
                    </div>

                    <Button type="submit" loading={passwordForm.processing}>
                        <KeyRound className="h-4 w-4" aria-hidden />
                        {t('changePassword')}
                    </Button>
                </form>
            </AdminSection>
        </AdminLayout>
    );
}
