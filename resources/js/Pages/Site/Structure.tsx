import SiteLayout from '@/Layouts/SiteLayout';
import { StrukturPage } from '@/Components/pages/StrukturPage';
import { useTranslations } from '@/lib/i18n';

export default function Structure() {
    const nav = useTranslations('nav');

    return (
        <SiteLayout title={nav('structure')}>
            <StrukturPage />
        </SiteLayout>
    );
}
