import { motion } from "framer-motion";
import { PageHeader } from "@/Components/molecules/PageHeader";
import { Picture } from "@/Components/atoms/Picture";
import { useI18n } from "@/lib/i18n";
import { focus } from "@/data/content";

const images = [
  "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=1000&h=800&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=1000&h=800&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1000&h=800&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1000&h=800&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1000&h=800&fit=crop&auto=format",
];

export function FokusPage() {
  const { t } = useI18n();
  return (
    <>
      <PageHeader
        no="03"
        kicker={t(focus.kicker)}
        title={t({ id: "Lima area fokus keilmuan.", en: "Five areas of focus." })}
        lead={t({
          id: "Diturunkan dari kegiatan nyata di lapangan, area fokus ini memandu riset dan program kami.",
          en: "Grounded in real field activity, these focus areas guide our research and programs.",
        })}
        backgroundImage={images[0]}
      />

      <section className="bg-paper py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          {focus.items.map((item, i) => (
            <motion.article
              key={item.no}
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className={`grid grid-cols-1 items-center gap-8 border-b border-border py-12 lg:grid-cols-2 lg:gap-16 ${
                i % 2 === 1 ? "lg:[&>div:first-child]:order-2" : ""
              }`}
            >
              <div className="overflow-hidden rounded-2xl bg-muted">
                <Picture
                  src={images[i]!}
                  alt={t(item.title)}
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="aspect-[16/10] w-full object-cover"
                />
              </div>
              <div>
                <span className="font-display text-5xl font-extrabold text-forest-800/15">{item.no}</span>
                <h2 className="mt-3 font-display text-2xl font-bold text-forest-900 sm:text-3xl">
                  {t(item.title)}
                </h2>
                <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
                  {t(item.desc)}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </section>
    </>
  );
}
