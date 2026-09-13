import { Head, router, useForm } from '@inertiajs/react';
import { Mail, MailOpen, Search, Trash2 } from 'lucide-react';
import * as React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/admin/button';
import { ConfirmDialog } from '@/Components/admin/confirm-dialog';
import { AdminPageHeader } from '@/Components/admin/page-header';
import { EmptyState } from '@/Components/ui/empty-state';
import { Input } from '@/Components/ui/input';
import { Pagination, type Paginated } from '@/Components/ui/pagination';
import { useLocale, useTranslations } from '@/lib/i18n';
import { cn, formatDate } from '@/lib/utils';

type Message = {
    id: number;
    name: string;
    email: string;
    subject: string | null;
    message: string;
    is_read: boolean;
    created_at: string;
};

export default function Inbox({
    messages,
    filters,
    unreadTotal,
}: {
    messages: Paginated<Message>;
    filters: { q?: string; unread?: string };
    unreadTotal: number;
}) {
    const t = useTranslations('admin.inbox');
    const tCommon = useTranslations('admin.common');
    const locale = useLocale();

    const [q, setQ] = React.useState(filters.q ?? '');
    const [open, setOpen] = React.useState<number | null>(null);
    const [pendingDelete, setPendingDelete] = React.useState<Message | null>(null);
    const remove = useForm({});
    const mark = useForm({ is_read: true });

    function setRead(message: Message, isRead: boolean) {
        mark.transform(() => ({ is_read: isRead }));
        mark.put(`/admin/contact/${message.id}`, { preserveScroll: true, preserveState: false });
    }

    return (
        <AdminLayout>
            <Head title={t('title')} />

            <AdminPageHeader
                index="06"
                title={t('title')}
                description={t('subtitle')}
                actions={
                    unreadTotal > 0 ? (
                        <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-fg">
                            {t('unreadCount', { count: unreadTotal })}
                        </span>
                    ) : undefined
                }
            />

            <form
                className="flex flex-wrap items-center gap-3 border-y border-line py-4"
                onSubmit={(event) => {
                    event.preventDefault();
                    router.get('/admin/contact', { ...filters, q }, { preserveState: true, replace: true });
                }}
            >
                <div className="relative min-w-[14rem] flex-1">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-subtle" aria-hidden />
                    <Input value={q} onChange={(event) => setQ(event.target.value)} placeholder={t('searchPlaceholder')} aria-label={tCommon('search')} className="pl-9" />
                </div>

                <label className="flex items-center gap-2 text-sm text-foreground-muted">
                    <input
                        type="checkbox"
                        checked={filters.unread === '1'}
                        onChange={(event) =>
                            router.get(
                                '/admin/contact',
                                { ...filters, q, unread: event.target.checked ? '1' : undefined },
                                { preserveState: true, replace: true },
                            )
                        }
                        className="h-4 w-4 rounded border-line"
                    />
                    {t('onlyUnread')}
                </label>

                <Button type="submit" variant="secondary">
                    {tCommon('apply')}
                </Button>
            </form>

            {messages.data.length === 0 ? (
                <EmptyState icon={Mail} title={t('empty')} description={t('emptyBody')} className="mt-6" />
            ) : (
                <ul className="divide-y divide-line">
                    {messages.data.map((message) => (
                        <li key={message.id} className={cn('py-3', !message.is_read && 'bg-primary-subtle/40')}>
                            <div className="flex items-start gap-3">
                                <button
                                    type="button"
                                    className="min-w-0 flex-1 text-left"
                                    aria-expanded={open === message.id}
                                    onClick={() => {
                                        setOpen(open === message.id ? null : message.id);
                                        // Opening a message marks it read, which is
                                        // what the unread badge counts.
                                        if (!message.is_read) setRead(message, true);
                                    }}
                                >
                                    <p className="truncate text-sm font-medium text-foreground">
                                        {message.subject || t('noSubject')}
                                    </p>
                                    <p className="truncate text-xs text-foreground-subtle">
                                        {message.name} · {message.email} · {formatDate(message.created_at, locale)}
                                    </p>
                                </button>

                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-9 w-9"
                                    aria-label={message.is_read ? t('markUnread') : t('markRead')}
                                    title={message.is_read ? t('markUnread') : t('markRead')}
                                    onClick={() => setRead(message, !message.is_read)}
                                >
                                    {message.is_read ? <MailOpen className="h-4 w-4" aria-hidden /> : <Mail className="h-4 w-4" aria-hidden />}
                                </Button>

                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-9 w-9"
                                    aria-label={tCommon('deleteAria', { name: message.name })}
                                    onClick={() => setPendingDelete(message)}
                                >
                                    <Trash2 className="h-4 w-4 text-danger" aria-hidden />
                                </Button>
                            </div>

                            {open === message.id && (
                                <div className="mt-3 space-y-3 rounded-md border border-line bg-surface p-4">
                                    {/* Rendered as text, never as HTML: this is
                                        unauthenticated public input. */}
                                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">{message.message}</p>
                                    <a href={`mailto:${message.email}`} className="text-sm font-semibold text-link hover:text-link-hover">
                                        {t('reply')}
                                    </a>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}

            <Pagination links={messages.links} label={tCommon('page')} className="mt-8" />

            <ConfirmDialog
                open={pendingDelete !== null}
                onOpenChange={(value) => !value && setPendingDelete(null)}
                title={t('deleteTitle')}
                description={t('deleteBody')}
                pending={remove.processing}
                onConfirm={() =>
                    pendingDelete &&
                    remove.delete(`/admin/contact/${pendingDelete.id}`, {
                        preserveScroll: true,
                        onSuccess: () => setPendingDelete(null),
                    })
                }
            />
        </AdminLayout>
    );
}
