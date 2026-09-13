import { forwardRef, type ReactNode } from 'react';
import { Link as LocaleLink, usePathname, type LinkProps as LocaleLinkProps } from '@/lib/navigation';

const routes: Record<string, string> = {
  '/tentang': '/about', '/struktur': '/structure', '/fokus': '/focus-areas', '/program': '/programs',
  '/berita': '/news', '/kontak': '/contact',
};

export function resolveRoute(to: string) {
  const [pathname, ...suffix] = to.split(/(?=[?#])/);
  return (routes[pathname ?? '/'] ?? pathname ?? '/') + suffix.join('');
}

type LinkProps = Omit<LocaleLinkProps, 'href'> & { to: string };

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link({ to, ...props }, ref) {
  return <LocaleLink ref={ref} href={resolveRoute(to)} {...props} />;
});

type Active = { isActive: boolean };
type NavLinkProps = Omit<LinkProps, 'className' | 'children' | 'ref'> & {
  className?: string | ((state: Active) => string);
  children?: ReactNode | ((state: Active) => ReactNode);
};

export function NavLink({ to, className, children, ...props }: NavLinkProps) {
  const pathname = usePathname();
  const href = resolveRoute(to);
  const state = { isActive: pathname === href || (href !== '/' && pathname.startsWith(href + '/')) };
  return (
    <Link to={to} aria-current={state.isActive ? 'page' : undefined}
      className={typeof className === 'function' ? className(state) : className} {...props}>
      {typeof children === 'function' ? children(state) : children}
    </Link>
  );
}

export function useLocation() {
  const pathname = usePathname();
  return { pathname: Object.entries(routes).find(([, route]) => route === pathname)?.[0] ?? pathname };
}
