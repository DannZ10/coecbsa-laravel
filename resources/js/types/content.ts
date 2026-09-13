/**
 * Shapes for the static, per-locale content layer (src/content/{id,en}).
 * Every field must be sourced from Docs/01 — never invented (AD-4). Fields that
 * are not yet verifiable are marked optional and left empty, and tracked on the
 * content-gap list feeding card X1.
 */

export type IconName =
  | 'recycle'
  | 'sprout'
  | 'users'
  | 'handshake'
  | 'leaf'
  | 'flask'
  | 'target'
  | 'network';

export type FocusArea = {
  slug: string;
  title: string;
  description: string;
  icon: IconName;
};

export type SdgTag = {
  number: number;
  label: string;
};

export type Person = {
  slug: string;
  name: string;
  /** Academic title / credentials, e.g. "Dr. …, STP, M.Si". */
  title: string;
  /** Role within CoE CBSA. */
  role: string;
  division?: string;
  photo?: string;
  links?: { label: string; href: string }[];
};

export type PersonGroup = {
  division: string;
  members: Person[];
};

export type StakeholderCluster = {
  title: string;
  members: string[];
};

export type Program = {
  slug: string;
  title: string;
  summary: string;
  funder?: string;
  location?: string;
  goals?: string[];
  stakeholderClusters?: StakeholderCluster[];
  activities?: string[];
  quote?: { text: string; author: string };
  sdgs?: SdgTag[];
};

export type ImpactStat = {
  /** Numeric value, or null when the real figure is not yet confirmed (X1). */
  value: number | null;
  label: string;
  suffix?: string;
};

export type Project = {
  slug: string;
  title: string;
  summary: string;
  partners?: string[];
  location?: string;
  date?: string;
  sdgs?: SdgTag[];
};

export type Partner = {
  name: string;
  category: 'government' | 'banking' | 'community' | 'academic';
  logo?: string;
  href?: string;
};

export type FaqOrValue = {
  title: string;
  description: string;
};

export type HomeContent = {
  hero: {
    eyebrow: string;
    headline: string;
    subheadline: string;
    primaryCta: string;
    secondaryCta: string;
  };
  about: {
    eyebrow: string;
    title: string;
    body: string;
    pillars: FaqOrValue[];
    approaches: string[];
  };
  sections: {
    focusEyebrow: string;
    focusTitle: string;
    focusDescription: string;
    programsEyebrow: string;
    programsTitle: string;
    programsDescription: string;
    impactEyebrow: string;
    impactTitle: string;
    impactDescription: string;
    newsEyebrow: string;
    newsTitle: string;
    newsDescription: string;
    partnersEyebrow: string;
    partnersTitle: string;
    ctaTitle: string;
    ctaBody: string;
  };
};

export type ContactContent = {
  address: string;
  phone: string;
  phoneHref: string;
  email?: string;
  mapEmbedUrl: string;
  hours?: string;
};

export type LocaleContent = {
  home: HomeContent;
  focusAreas: FocusArea[];
  people: PersonGroup[];
  programs: Program[];
  projects: { items: Project[]; impact: ImpactStat[] };
  partners: Partner[];
  contact: ContactContent;
};
