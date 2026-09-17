import { Images } from 'lucide-react';
import * as React from 'react';
import SiteLayout from '@/Layouts/SiteLayout';
import { Picture } from '@/Components/atoms/Picture';
import { Kicker } from '@/Components/atoms/Kicker';
import { PageHeader } from '@/Components/molecules/PageHeader';
import { Reveal } from '@/Components/atoms/Reveal';
import { EmptyState } from '@/Components/ui/empty-state';
import { useI18n, useTranslations } from '@/lib/i18n';
import { cn } from '@/lib/utils';

type Item = {
    id: number;
    title: string;
    caption: string;
    image_url: string;
    album: string | null;
    album_slug: string | null;
};

export default function Gallery({
    items,
    albums,
}: {
    items: Item[];
    albums: Record<string, string>;
}) {
    const { t } = useI18n();
    const nav = useTranslations('nav');
    const gallery = useTranslations('gallery');

    const [album, setAlbum] = React.useState<string | null>(null);

    // Filtering happens here rather than on the server: the whole gallery is
    // already in the page, so a round trip would only add latency.
    const visible = album ? items.filter((item) => item.album_slug === album) : items;
    const albumEntries = Object.entries(albums);

    return (
        <SiteLayout title={nav('gallery')} description={gallery('description')}>
            <PageHeader
                no="06"
                kicker={t({ id: 'Galeri', en: 'Gallery' })}
                title={t({ id: 'Kegiatan dalam gambar.', en: 'Our work in pictures.' })}
                lead={gallery('description')}
                backgroundImage={items[0]?.image_url}
            />

            <section className="border-b border-border bg-paper py-16 sm:py-24">
                <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
                    {albumEntries.length > 0 && (
                        <div className="mb-10 flex flex-wrap gap-2">
                            <button
                                type="button"
                                onClick={() => setAlbum(null)}
                                aria-pressed={album === null}
                                className={cn(
                                    'rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors',
                                    album === null
                                        ? 'border-forest-700 bg-forest-700 text-paper'
                                        : 'border-forest-800/20 text-forest-800 hover:bg-forest-800/[0.06]',
                                )}
                            >
                                {gallery('allAlbums')}
                            </button>
                            {albumEntries.map(([slug, name]) => (
                                <button
                                    key={slug}
                                    type="button"
                                    onClick={() => setAlbum(slug)}
                                    aria-pressed={album === slug}
                                    className={cn(
                                        'rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors',
                                        album === slug
                                            ? 'border-forest-700 bg-forest-700 text-paper'
                                            : 'border-forest-800/20 text-forest-800 hover:bg-forest-800/[0.06]',
                                    )}
                                >
                                    {name}
                                </button>
                            ))}
                        </div>
                    )}

                    {visible.length === 0 ? (
                        <EmptyState icon={Images} title={gallery('empty')} description={gallery('emptyBody')} />
                    ) : (
                        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {visible.map((item, index) => (
                                <Reveal key={item.id} delay={Math.min(index, 5) * 0.06}>
                                    <li className="group overflow-hidden rounded-2xl border border-border bg-paper-2">
                                        <div className="aspect-[4/3] overflow-hidden">
                                            <Picture
                                                src={item.image_url}
                                                alt={item.title}
                                                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                                                className="h-full w-full object-cover transition-transform duration-slow group-hover:scale-[1.04]"
                                            />
                                        </div>
                                        {(item.title || item.caption) && (
                                            <div className="p-5">
                                                {item.album && <Kicker>{item.album}</Kicker>}
                                                {item.title && (
                                                    <p className="mt-2 font-display text-base font-bold leading-snug text-forest-900">
                                                        {item.title}
                                                    </p>
                                                )}
                                                {item.caption && (
                                                    <p className="mt-1.5 text-sm leading-relaxed text-forest-800/75">
                                                        {item.caption}
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </li>
                                </Reveal>
                            ))}
                        </ul>
                    )}
                </div>
            </section>
        </SiteLayout>
    );
}
