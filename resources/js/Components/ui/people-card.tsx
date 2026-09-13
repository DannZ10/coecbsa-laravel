import { Picture as Image } from '@/Components/atoms/Picture';
import { UserRound } from 'lucide-react';
import type { Person } from '@/types/content';

export function PeopleCard({ person }: { person: Person }) {
  const initials = person.name
    .split(' ')
    .filter((w) => /[A-Za-z]/.test(w[0] ?? ''))
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');

  return (
    <article className="flex flex-col items-center rounded-lg border border-line bg-surface p-6 text-center shadow-sm">
      <div className="relative h-28 w-28 overflow-hidden rounded-full bg-primary-subtle">
        {person.photo ? (
          <Image
            src={person.photo}
            alt={person.name}
            fill
            sizes="112px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-primary">
            {initials ? (
              <span className="font-display text-2xl font-bold">{initials}</span>
            ) : (
              <UserRound className="h-10 w-10" aria-hidden />
            )}
          </div>
        )}
      </div>
      <h3 className="mt-4 font-display text-lg font-bold leading-snug tracking-tight text-foreground">
        {person.name}
      </h3>
      {person.title && <p className="mt-0.5 text-xs text-foreground-subtle">{person.title}</p>}
      <p className="mt-2 text-sm font-medium text-primary-subtle-fg">{person.role}</p>
      {person.links && person.links.length > 0 && (
        <ul className="mt-3 flex flex-wrap justify-center gap-2">
          {person.links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[2rem] items-center rounded-md border border-line px-2.5 text-xs font-medium text-foreground-muted hover:border-line-strong hover:text-foreground"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
