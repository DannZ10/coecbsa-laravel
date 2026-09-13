import * as React from 'react';
import { cn } from '@/lib/utils';

const base =
  'w-full rounded-md border border-line bg-surface px-3 text-sm text-foreground shadow-xs placeholder:text-foreground-subtle transition-colors duration-fast focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus disabled:cursor-not-allowed disabled:opacity-55 aria-[invalid=true]:border-danger aria-[invalid=true]:ring-danger';

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type = 'text', ...props }, ref) => (
    <input ref={ref} type={type} className={cn(base, 'h-11', className)} {...props} />
  ),
);
Input.displayName = 'Input';

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, rows = 4, ...props }, ref) => (
  <textarea ref={ref} rows={rows} className={cn(base, 'min-h-[6rem] resize-y py-2.5', className)} {...props} />
));
Textarea.displayName = 'Textarea';
