import {
  Recycle,
  Sprout,
  Users,
  Handshake,
  Leaf,
  FlaskConical,
  Target,
  Network,
  type LucideIcon,
} from 'lucide-react';
import type { IconName } from '@/types/content';

const ICONS: Record<IconName, LucideIcon> = {
  recycle: Recycle,
  sprout: Sprout,
  users: Users,
  handshake: Handshake,
  leaf: Leaf,
  flask: FlaskConical,
  target: Target,
  network: Network,
};

export function ContentIcon({
  name,
  className,
}: {
  name: IconName;
  className?: string;
}) {
  const Icon = ICONS[name] ?? Leaf;
  return <Icon className={className} aria-hidden />;
}
