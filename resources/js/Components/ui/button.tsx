import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-semibold',
    'transition-colors duration-fast ease-standard select-none',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background',
    'disabled:pointer-events-none disabled:opacity-55',
  ],
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-fg shadow-primary hover:bg-primary-hover active:bg-primary-active',
        secondary: 'border border-line-strong bg-surface text-foreground hover:bg-surface-2',
        outline: 'border border-primary text-primary hover:bg-primary-subtle',
        ghost: 'text-foreground-muted hover:bg-surface-2 hover:text-foreground',
        danger: 'bg-danger text-white hover:opacity-90 active:opacity-100',
      },
      size: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-11 px-5 text-sm',
        lg: 'h-12 px-7 text-base',
        icon: 'h-11 w-11',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        {...props}
      >
        {/* Radix Slot requires exactly one child, and a falsy expression still
            counts as one — so `asChild` must forward `children` untouched. */}
        {asChild ? (
          children
        ) : (
          <>
            {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
            {children}
          </>
        )}
      </Comp>
    );
  },
);
Button.displayName = 'Button';

export { buttonVariants };
