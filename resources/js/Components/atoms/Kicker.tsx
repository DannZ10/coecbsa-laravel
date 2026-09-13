type KickerProps = {
  children: React.ReactNode;
  no?: string;
  tone?: 'forest' | 'amber' | 'paper';
  className?: string;
};

/** Small eyebrow label. Section labels use a tilde prefix when `no` is supplied. */
export function Kicker({ children, no, tone = 'forest', className = '' }: KickerProps) {
  const color =
    tone === 'amber' ? 'text-amber' : tone === 'paper' ? 'text-amber-soft' : 'text-forest-600';
  return (
    <span className={`kicker inline-flex items-center gap-1.5 ${color} ${className}`}>
      {no && <span className="text-current opacity-100">~</span>}
      <span className="opacity-90">{children}</span>
    </span>
  );
}
