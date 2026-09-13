import { bi, type Bi } from '@/lib/i18n';
import type { ImpactContent, PartnerContent, ProgramContent } from '@/types/api';
import type { Program, Stat } from '@/data/content';

export function localized(id: string, en?: string | null): Bi {
  return bi(id, en || id);
}

export function programFromApi(item: ProgramContent): Program {
  return {
    tag: localized(item.tagId, item.tagEn),
    title: localized(item.titleId, item.titleEn),
    place: localized(item.placeId, item.placeEn),
    desc: localized(item.descId, item.descEn),
    funder: localized(item.funderId, item.funderEn),
    image: item.image,
    status: item.status.toLowerCase() as Program['status'],
    details:
      item.detailsId || item.detailsEn
        ? localized(item.detailsId ?? item.detailsEn ?? '', item.detailsEn)
        : undefined,
  };
}

export function impactFromApi(item: ImpactContent): { stats: Stat[]; sdgs: ImpactContent['sdgs'] } {
  return {
    stats: item.stats.map((stat) => ({
      value: stat.value,
      label: localized(stat.labelId, stat.labelEn),
    })),
    sdgs: item.sdgs,
  };
}

export function partnerName(item: PartnerContent, lang: string) {
  return lang === 'en' && item.nameEn ? item.nameEn : item.nameId;
}
