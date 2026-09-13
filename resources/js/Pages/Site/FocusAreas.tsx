import SiteLayout from '@/Layouts/SiteLayout';
import { FokusPage } from '@/Components/pages/FokusPage';
import { useTranslations } from '@/lib/i18n';

export default function FocusAreas() {
    const nav = useTranslations('nav');

    return (
        <SiteLayout title={nav('focusAreas')}>
            <FokusPage />
        </SiteLayout>
    );
}
