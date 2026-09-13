import { ContactForm } from '@/Components/contact/contact-form';
import { Kicker } from '@/Components/atoms/Kicker';
import { useI18n } from '@/lib/i18n';

export function KontakPage() {
  const { t } = useI18n();
  return (
    <section className="min-h-[calc(100svh-4rem)] border-b border-border bg-paper-2 pb-16 pt-32 sm:pb-24 sm:pt-40">
      <div className="mx-auto max-w-3xl px-5 sm:px-8 lg:px-12">
        <Kicker no="07">{t({ id: 'Kirim Pesan', en: 'Send a Message' })}</Kicker>
        <h1 className="mt-5 font-display text-3xl font-extrabold tracking-tight text-forest-900 sm:text-4xl">
          {t({
            id: 'Ceritakan rencana kolaborasi Anda.',
            en: 'Tell us about your collaboration idea.',
          })}
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          {t({
            id: 'Isi formulir berikut dan tim CoE CBSA akan menindaklanjuti melalui email.',
            en: 'Complete the form and the CoE CBSA team will follow up by email.',
          })}
        </p>
        <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
