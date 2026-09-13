import SiteLayout from '@/Layouts/SiteLayout';
import { KontakPage } from '@/Components/pages/KontakPage';
import { useTranslations } from '@/lib/i18n';

export default function Contact() {
    const nav = useTranslations('nav');

    return (
        <SiteLayout title={nav('contact')}>
            <KontakPage />
        </SiteLayout>
    );
}
