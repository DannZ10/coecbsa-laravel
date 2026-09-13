import SiteLayout from '@/Layouts/SiteLayout';
import { LandingTemplate } from '@/Components/templates/LandingTemplate';
import type { Article, ImpactContent, PartnerContent, ProgramContent } from '@/types/api';

export default function Home({
    articles,
    programs,
    partners,
    impact,
}: {
    articles: Article[];
    programs: ProgramContent[];
    partners: PartnerContent[];
    impact: ImpactContent;
}) {
    return (
        <SiteLayout>
            <LandingTemplate
                articles={articles}
                // The list is rendered server-side, so it is never "still
                // loading" — only genuinely empty.
                available
                programs={programs.length ? programs : undefined}
                partners={partners.length ? partners : undefined}
                impact={impact.stats.length || impact.sdgs.length ? impact : undefined}
            />
        </SiteLayout>
    );
}
