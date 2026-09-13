import { Button } from "@/Components/atoms/Button";
import { useI18n } from "@/lib/i18n";

export function NotFound() {
  const { t } = useI18n();
  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center gap-6 bg-forest-900 px-5 text-center text-paper">
      <span className="font-display text-7xl font-extrabold text-amber sm:text-8xl">404</span>
      <p className="max-w-sm text-forest-300">
        {t({
          id: "Halaman yang Anda cari tidak ditemukan.",
          en: "The page you are looking for could not be found.",
        })}
      </p>
      <Button to="/" variant="paper" from="left">
        {t({ id: "Kembali ke beranda", en: "Back to home" })}
      </Button>
    </section>
  );
}
