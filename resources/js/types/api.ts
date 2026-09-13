/**
 * API response contract — mirrors Docs/03-arsitektur.md §6 (the seam). The web
 * app builds against these shapes and mocks responses until the backend lands;
 * do not change the contract here without agreement with the backend lane.
 */

export type ApiMeta = {
  page: number;
  limit: number;
  total: number;
};

export type ApiSuccess<T> = {
  success: true;
  data: T;
  meta?: ApiMeta;
};

export type ApiError = {
  success: false;
  error: { code: string; message: string; details?: unknown[] };
};

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export type ArticleStatus = 'DRAFT' | 'PUBLISHED' | 'SCHEDULED';

export type Category = {
  id: string;
  nameId: string;
  nameEn?: string | null;
  slug: string;
};

export type Tag = {
  id: string;
  name: string;
  slug: string;
};

export type Article = {
  id: string;
  slug: string;
  titleId: string;
  titleEn?: string | null;
  excerptId?: string | null;
  excerptEn?: string | null;
  contentId: string;
  contentEn?: string | null;
  coverImage?: string | null;
  status: ArticleStatus;
  publishedAt?: string | null;
  author?: { id: string; name: string } | null;
  category?: Category | null;
  tags?: Tag[];
  createdAt: string;
  updatedAt: string;
};

export type Album = {
  id: string;
  nameId: string;
  nameEn?: string | null;
  slug: string;
};

export type GalleryItem = {
  id: string;
  titleId?: string | null;
  titleEn?: string | null;
  captionId?: string | null;
  captionEn?: string | null;
  imageUrl: string;
  thumbnailUrl?: string | null;
  order: number;
  albumId?: string | null;
  createdAt: string;
};

export type ProgramStatus = 'ONGOING' | 'PLANNED' | 'COMPLETED';

export type ProgramContent = {
  id: string;
  slug: string;
  tagId: string;
  tagEn?: string | null;
  titleId: string;
  titleEn?: string | null;
  placeId: string;
  placeEn?: string | null;
  descId: string;
  descEn?: string | null;
  funderId: string;
  funderEn?: string | null;
  image: string;
  detailsId?: string | null;
  detailsEn?: string | null;
  status: ProgramStatus;
  order: number;
  createdAt: string;
  updatedAt: string;
};

export type PartnerContent = {
  id: string;
  slug: string;
  nameId: string;
  nameEn?: string | null;
  groupId: string;
  groupEn?: string | null;
  logoUrl?: string | null;
  href?: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
};

export type ImpactStatContent = {
  id: string;
  key: string;
  value: string;
  labelId: string;
  labelEn?: string | null;
  order: number;
};

export type ImpactSdgContent = {
  id: string;
  code: string;
  labelId: string;
  labelEn?: string | null;
  descriptionId: string;
  descriptionEn?: string | null;
  order: number;
};

export type ImpactContent = {
  stats: ImpactStatContent[];
  sdgs: ImpactSdgContent[];
};

export type Media = {
  id: string;
  url: string;
  type: string;
  filename: string;
  size: number;
  width?: number | null;
  height?: number | null;
  altId?: string | null;
  altEn?: string | null;
  uploadedBy?: string | null;
  createdAt: string;
};

export type AdminUserRecord = {
  id: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'EDITOR';
  isActive: boolean;
  lastLoginAt?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ContactMessageRecord = {
  id: string;
  name: string;
  email: string;
  subject?: string | null;
  message: string;
  isRead: boolean;
  createdAt: string;
};

/** Pick the locale-appropriate field, falling back to Indonesian. */
export function pickLocale(
  locale: string,
  id: string | null | undefined,
  en: string | null | undefined,
): string {
  if (locale === 'en' && en) return en;
  return id ?? en ?? '';
}
