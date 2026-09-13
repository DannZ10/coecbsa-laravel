import SiteLayout from '@/Layouts/SiteLayout';
import { TentangPage } from '@/Components/pages/TentangPage';
import { useTranslations } from '@/lib/i18n';

export default function About() {
    const nav = useTranslations('nav');

    return (
        <SiteLayout title={nav('about')}>
            <TentangPage />
        </SiteLayout>
    );
}
