import * as React from 'react';
import { Button as BaseButton, type ButtonProps } from '@/Components/ui/button';
import { cn } from '@/lib/utils';

/** The shared accessible button, dressed in the website's rounded brand style. */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', ...props }, ref) => (
    <BaseButton ref={ref} variant={variant} data-admin-variant={variant}
      className={cn('cms-button rounded-full', className)} {...props} />
  ),
);
Button.displayName = 'AdminButton';
