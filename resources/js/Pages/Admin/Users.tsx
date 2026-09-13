import { Head, useForm, usePage } from '@inertiajs/react';
import { Pencil, Plus, Save, Trash2, Users as UsersIcon, X } from 'lucide-react';
import * as React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/admin/button';
import { ConfirmDialog } from '@/Components/admin/confirm-dialog';
import { AdminPageHeader } from '@/Components/admin/page-header';
import { Alert } from '@/Components/ui/alert';
import { EmptyState } from '@/Components/ui/empty-state';
import { Field } from '@/Components/ui/field';
import { Input } from '@/Components/ui/input';
import { useLocale, useTranslations, type SharedProps } from '@/lib/i18n';
import { cn, formatDate } from '@/lib/utils';

type Operator = {
    id: number;
    name: string;
    email: string;
    role: string;
    is_active: boolean;
    has_password: boolean;
    has_google: boolean;
    last_login_at: string | null;
};

const EMPTY = {
    name: '',
    email: '',
    role: 'editor',
    is_active: true,
    password: '',
    password_confirmation: '',
};

export default function Users({ users, roles }: { users: Operator[]; roles: string[] }) {
    const t = useTranslations('admin.users');
    const tCommon = useTranslations('admin.common');
    const tRole = useTranslations('admin.role');
    const locale = useLocale();
    const me = usePage<SharedProps>().props.auth.user;

    const [editing, setEditing] = React.useState<Operator | null>(null);
    const [pendingDelete, setPendingDelete] = React.useState<Operator | null>(null);

    const form = useForm(EMPTY);
    const remove = useForm({});

    function reset() {
        setEditing(null);
        form.reset();
        form.clearErrors();
    }

    function startEdit(user: Operator) {
        setEditing(user);
        form.clearErrors();
        form.setData({
            name: user.name,
            email: user.email,
            role: user.role,
            is_active: user.is_active,
            password: '',
            password_confirmation: '',
        });
    }

    const editingSelf = editing !== null && me !== null && editing.id === me.id;

    return (
        <AdminLayout>
            <Head title={t('title')} />

            <AdminPageHeader index="07" title={t('title')} description={t('subtitle')} />

            <form
                className="space-y-4 border-y border-line py-6"
                onSubmit={(event) => {
                    event.preventDefault();
                    const options = { preserveScroll: true, onSuccess: () => reset() };
                    if (editing) form.put(`/admin/users/${editing.id}`, options);
                    else form.post('/admin/users', options);
                }}
            >
                <h2 className="font-display text-base font-bold text-foreground">
                    {editing ? t('editTitle', { name: editing.name }) : t('addTitle')}
                </h2>

                {editingSelf && <Alert variant="info">{t('selfEditNotice')}</Alert>}

                <div className="grid gap-4 sm:grid-cols-2">
                    <Field id="name" label={t('name')} required error={form.errors.name}>
                        <Input id="name" value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} />
                    </Field>
                    <Field id="email" label={t('email')} required error={form.errors.email}>
                        <Input id="email" type="email" value={form.data.email} onChange={(e) => form.setData('email', e.target.value)} />
                    </Field>

                    <Field id="role" label={t('role')} error={form.errors.role}>
                        <select
                            id="role"
                            value={form.data.role}
                            disabled={editingSelf}
                            onChange={(e) => form.setData('role', e.target.value)}
                            className="h-11 w-full rounded-md border border-line bg-surface px-3 text-sm text-foreground disabled:opacity-55"
                        >
                            {roles.map((role) => (
                                <option key={role} value={role}>
                                    {tRole(role)}
                                </option>
                            ))}
                        </select>
                    </Field>

                    {editing && (
                        <Field id="is_active" label={t('active')}>
                            <label className="flex h-11 items-center gap-2 text-sm text-foreground">
                                <input
                                    id="is_active"
                                    type="checkbox"
                                    checked={form.data.is_active}
                                    disabled={editingSelf}
                                    onChange={(e) => form.setData('is_active', e.target.checked)}
                                    className="h-4 w-4 rounded border-line disabled:opacity-55"
                                />
                                {t('activeHelper')}
                            </label>
                        </Field>
                    )}

                    <Field id="password" label={t('password')} helper={t('passwordHelper')} error={form.errors.password}>
                        <Input id="password" type="password" autoComplete="new-password" value={form.data.password} onChange={(e) => form.setData('password', e.target.value)} />
                    </Field>
                    <Field id="password_confirmation" label={t('passwordConfirm')}>
                        <Input
                            id="password_confirmation"
                            type="password"
                            autoComplete="new-password"
                            value={form.data.password_confirmation}
                            onChange={(e) => form.setData('password_confirmation', e.target.value)}
                        />
                    </Field>
                </div>

                <div className="flex gap-2">
                    <Button type="submit" loading={form.processing}>
                        {editing ? <Save className="h-4 w-4" aria-hidden /> : <Plus className="h-4 w-4" aria-hidden />}
                        {editing ? tCommon('saveChanges') : tCommon('add')}
                    </Button>
                    {editing && (
                        <Button type="button" variant="ghost" onClick={reset}>
                            <X className="h-4 w-4" aria-hidden />
                            {tCommon('cancel')}
                        </Button>
                    )}
                </div>
            </form>

            {users.length === 0 ? (
                <EmptyState icon={UsersIcon} title={t('empty')} className="mt-6 border-0 bg-transparent" />
            ) : (
                <ul className="divide-y divide-line">
                    {users.map((user) => (
                        <li key={user.id} className="flex items-center gap-3 py-3">
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium text-foreground">
                                    {user.name}
                                    {!user.is_active && (
                                        <span className="ml-2 rounded bg-surface-2 px-1.5 py-0.5 text-xs font-normal text-foreground-subtle">
                                            {t('inactive')}
                                        </span>
                                    )}
                                </p>
                                <p className="truncate text-xs text-foreground-subtle">
                                    {user.email} · {tRole(user.role)}
                                    {user.has_google ? ` · ${t('googleLinked')}` : ''}
                                    {!user.has_password ? ` · ${t('googleOnly')}` : ''}
                                    {user.last_login_at ? ` · ${t('lastLogin', { date: formatDate(user.last_login_at, locale) })}` : ''}
                                </p>
                            </div>
                            <Button variant="ghost" size="icon" aria-label={tCommon('editAria', { name: user.name })} onClick={() => startEdit(user)}>
                                <Pencil className="h-4 w-4" aria-hidden />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                disabled={me?.id === user.id}
                                aria-label={tCommon('deleteAria', { name: user.name })}
                                onClick={() => setPendingDelete(user)}
                            >
                                <Trash2 className={cn('h-4 w-4', me?.id === user.id ? 'text-foreground-subtle' : 'text-danger')} aria-hidden />
                            </Button>
                        </li>
                    ))}
                </ul>
            )}

            <ConfirmDialog
                open={pendingDelete !== null}
                onOpenChange={(open) => !open && setPendingDelete(null)}
                title={t('deleteTitle')}
                description={
                    <>
                        <strong className="text-foreground">{pendingDelete?.name}</strong> {t('deleteBody')}
                    </>
                }
                pending={remove.processing}
                onConfirm={() =>
                    pendingDelete &&
                    remove.delete(`/admin/users/${pendingDelete.id}`, {
                        preserveScroll: true,
                        onSuccess: () => setPendingDelete(null),
                    })
                }
            />
        </AdminLayout>
    );
}
