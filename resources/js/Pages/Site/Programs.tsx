import SiteLayout from '@/Layouts/SiteLayout';
import { ProgramPage } from '@/Components/pages/ProgramPage';
import { useTranslations } from '@/lib/i18n';
import type { ProgramContent } from '@/types/api';

export default function Programs({ programs }: { programs: ProgramContent[] }) {
    const nav = useTranslations('nav');

    return (
        <SiteLayout title={nav('programs')}>
            <ProgramPage items={programs.length ? programs : undefined} />
        </SiteLayout>
    );
}
