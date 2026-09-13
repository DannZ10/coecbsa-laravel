import { Button } from '@/Components/admin/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/Components/ui/dialog';
import { useTranslations } from '@/lib/i18n';

/**
 * Confirmation gate for destructive actions. Deletes in this CMS are not
 * reversible — there is no soft delete — so every one of them goes through
 * this rather than firing straight from a row button.
 */
export function ConfirmDialog({
    open,
    onOpenChange,
    title,
    description,
    confirmLabel,
    cancelLabel,
    pending = false,
    onConfirm,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description: React.ReactNode;
    confirmLabel?: string;
    cancelLabel?: string;
    pending?: boolean;
    onConfirm: () => void;
}) {
    const t = useTranslations('admin.common');

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                    <DialogClose asChild>
                        <Button variant="secondary" disabled={pending}>
                            {cancelLabel ?? t('cancel')}
                        </Button>
                    </DialogClose>
                    <Button variant="danger" onClick={onConfirm} loading={pending} disabled={pending}>
                        {confirmLabel ?? t('delete')}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
