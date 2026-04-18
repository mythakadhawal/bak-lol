import { ReactNode } from 'react';

type BadgeVariant =
  | 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
  | 'item' | 'help' | 'other'
  | 'open' | 'closed'
  | 'tag';

const ICONS: Record<string, string> = {
  upcoming: '🕐',
  ongoing: '🟢',
  completed: '✓',
  cancelled: '✗',
  item: '📦',
  help: '🤝',
  other: '•',
  open: '🟢',
  closed: '✓',
};

interface BadgeProps {
  variant: BadgeVariant;
  children: ReactNode;
  showIcon?: boolean;
}

export function Badge({ variant, children, showIcon = true }: BadgeProps) {
  return (
    <span className={`badge badge--${variant}`}>
      {showIcon && ICONS[variant] && (
        <span style={{ fontSize: '0.65em' }}>{ICONS[variant]}</span>
      )}
      {children}
    </span>
  );
}

// Tag pill for department, hostel, etc.
interface TagProps {
  children: ReactNode;
}

export function Tag({ children }: TagProps) {
  return <span className="badge badge--tag">{children}</span>;
}
