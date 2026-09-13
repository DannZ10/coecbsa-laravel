import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cn } from '@/lib/utils';

export const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & { required?: boolean }
>(({ className, children, required, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn('text-sm font-medium text-foreground', className)}
    {...props}
  >
    {children}
    {required && (
      <span className="ml-0.5 text-danger" aria-hidden>
        *
      </span>
    )}
  </LabelPrimitive.Root>
));
Label.displayName = 'Label';

/**
 * Field: composes label + control + helper/error text with the right aria wiring.
 * Pass the same `id` you give the control; describedby/invalid are derived.
 */
export function Field({
  id,
  label,
  required,
  helper,
  error,
  children,
  className,
}: {
  id: string;
  label?: React.ReactNode;
  required?: boolean;
  helper?: React.ReactNode;
  error?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  const helperId = helper ? `${id}-helper` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <Label htmlFor={id} required={required}>
          {label}
        </Label>
      )}
      {children}
      {helper && !error && (
        <p id={helperId} className="text-xs text-foreground-subtle">
          {helper}
        </p>
      )}
      {error && (
        <p id={errorId} className="text-xs font-medium text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
