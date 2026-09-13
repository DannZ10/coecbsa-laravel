import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { CheckCircle2, AlertTriangle, XCircle, Info, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const alertVariants = cva('flex gap-3 rounded-md border p-4 text-sm', {
  variants: {
    variant: {
      info: 'border-info/30 bg-info-bg text-info-fg',
      success: 'border-success/30 bg-success-bg text-success-fg',
      warning: 'border-warning/30 bg-warning-bg text-warning-fg',
      danger: 'border-danger/30 bg-danger-bg text-danger-fg',
    },
  },
  defaultVariants: { variant: 'info' },
});

const ICONS: Record<NonNullable<VariantProps<typeof alertVariants>['variant']>, LucideIcon> = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  danger: XCircle,
};

export interface AlertProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'>,
    VariantProps<typeof alertVariants> {
  title?: React.ReactNode;
}

export function Alert({ className, variant = 'info', title, children, ...props }: AlertProps) {
  const Icon = ICONS[variant ?? 'info'];
  return (
    <div role="alert" className={cn(alertVariants({ variant }), className)} {...props}>
      <Icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
      <div className="flex-1">
        {title && <p className="font-semibold">{title}</p>}
        {children && <div className={cn(title && 'mt-1', 'leading-relaxed')}>{children}</div>}
      </div>
    </div>
  );
}
