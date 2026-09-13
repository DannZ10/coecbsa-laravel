import type { Article } from '@/types/api';
import { Hero } from '@/Components/organisms/Hero';
import { About } from '@/Components/organisms/About';
import { FocusAreas } from '@/Components/organisms/FocusAreas';
import { Programs } from '@/Components/organisms/Programs';
import { Impact } from '@/Components/organisms/Impact';
import { News } from '@/Components/organisms/News';
import { Partners } from '@/Components/organisms/Partners';
import { Contact } from '@/Components/organisms/Contact';
import type { ImpactContent, PartnerContent, ProgramContent } from '@/types/api';

export function LandingTemplate({
  articles,
  available,
  programs,
  partners,
  impact,
}: {
  articles: Article[];
  available: boolean;
  programs?: ProgramContent[];
  partners?: PartnerContent[];
  impact?: ImpactContent;
}) {
  return (
    <>
      <Hero />
      <About />
      <FocusAreas />
      <Programs items={programs} />
      <Impact content={impact} />
      <News articles={articles} available={available} />
      <Partners items={partners} />
      <Contact />
    </>
  );
}
