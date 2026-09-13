import { Head, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useTranslations, type SharedProps } from '@/lib/i18n';

export default function Dashboard() {
    const t = useTranslations('admin.dashboard');
    const tNav = useTranslations('admin.nav');
    const user = usePage<SharedProps>().props.auth.user;

    return (
        <AdminLayout>
            <Head title={tNav('dashboard')} />
            <header className="cms-page-header">
                <p className="cms-page-kicker">{tNav('cms')}</p>
                <h1 className="cms-page-heading">{t('greeting', { name: user?.name ?? '' })}</h1>
                <p className="cms-page-description">{t('subtitle')}</p>
            </header>
        </AdminLayout>
    );
}
