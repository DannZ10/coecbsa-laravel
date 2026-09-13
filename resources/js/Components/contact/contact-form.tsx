import * as React from 'react';
import { Send } from 'lucide-react';
import { useTranslations } from '@/lib/i18n';
import { Button } from '@/Components/ui/button';
import { Input, Textarea } from '@/Components/ui/input';
import { Field } from '@/Components/ui/field';
import { Alert } from '@/Components/ui/alert';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000/api/v1';

const MIN_MESSAGE_LENGTH = 10;

type FormState = { name: string; email: string; subject: string; message: string };
const EMPTY: FormState = { name: '', email: '', subject: '', message: '' };

type FieldErrors = Partial<Record<keyof FormState, string>>;

/**
 * Contact form (PRD FR-P8), posting to `POST /contact`.
 *
 * The request goes straight from the browser to the API rather than through a
 * Next route handler: the endpoint is rate limited per IP, and proxying it
 * would bucket every visitor under the web server's address.
 *
 * There is no phone field — `ContactMessage` (PRD §9) stores name, email,
 * subject, and message, and a column nobody reads is not worth a migration.
 */
export function ContactForm() {
  const t = useTranslations('contact');
  const [form, setForm] = React.useState<FormState>(EMPTY);
  const [errors, setErrors] = React.useState<FieldErrors>({});
  const [status, setStatus] = React.useState<'idle' | 'sending' | 'sent' | 'failed'>('idle');
  const [failure, setFailure] = React.useState<string | null>(null);

  function set<K extends keyof FormState>(key: K, value: string) {
    setForm((previous) => ({ ...previous, [key]: value }));
    setErrors((previous) => ({ ...previous, [key]: undefined }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const clientErrors: FieldErrors = {};
    if (!form.name.trim()) clientErrors.name = t('requiredName');
    if (!form.email.trim()) clientErrors.email = t('requiredEmail');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      clientErrors.email = t('invalidEmail');
    }
    if (form.message.trim().length < MIN_MESSAGE_LENGTH) {
      clientErrors.message = t('shortMessage');
    }

    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      return;
    }

    setStatus('sending');
    setFailure(null);

    try {
      const response = await fetch(`${API_BASE_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          ...(form.subject.trim() && { subject: form.subject.trim() }),
          message: form.message.trim(),
        }),
      });

      if (response.ok) {
        setForm(EMPTY);
        setStatus('sent');
        return;
      }

      setStatus('failed');
      setFailure(response.status === 429 ? t('rateLimited') : t('failedBody'));
    } catch {
      setStatus('failed');
      setFailure(t('failedBody'));
    }
  }

  if (status === 'sent') {
    return (
      <div className="mt-6 space-y-4">
        <Alert variant="success" title={t('successTitle')}>
          {t('successBody')}
        </Alert>
        <Button type="button" variant="ghost" onClick={() => setStatus('idle')}>
          {t('sendAnother')}
        </Button>
      </div>
    );
  }

  const sending = status === 'sending';

  return (
    <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
      {failure && (
        <Alert variant="danger" title={t('failedTitle')}>
          {failure}
        </Alert>
      )}

      <Field id="contact-name" label={t('name')} required error={errors.name}>
        <Input
          id="contact-name"
          name="name"
          autoComplete="name"
          value={form.name}
          aria-invalid={Boolean(errors.name)}
          placeholder={t('namePlaceholder')}
          onChange={(event) => set('name', event.target.value)}
        />
      </Field>

      <Field id="contact-email" label={t('email')} required error={errors.email}>
        <Input
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          value={form.email}
          aria-invalid={Boolean(errors.email)}
          placeholder={t('emailPlaceholder')}
          onChange={(event) => set('email', event.target.value)}
        />
      </Field>

      <Field id="contact-subject" label={t('subject')}>
        <Input
          id="contact-subject"
          name="subject"
          value={form.subject}
          placeholder={t('subjectPlaceholder')}
          onChange={(event) => set('subject', event.target.value)}
        />
      </Field>

      <Field id="contact-message" label={t('message')} required error={errors.message}>
        <Textarea
          id="contact-message"
          name="message"
          rows={4}
          value={form.message}
          aria-invalid={Boolean(errors.message)}
          placeholder={t('messagePlaceholder')}
          onChange={(event) => set('message', event.target.value)}
        />
      </Field>

      <Button type="submit" size="lg" className="w-full sm:w-auto" loading={sending} disabled={sending}>
        <Send className="h-4 w-4" aria-hidden />
        {sending ? t('sending') : t('submit')}
      </Button>
    </form>
  );
}
