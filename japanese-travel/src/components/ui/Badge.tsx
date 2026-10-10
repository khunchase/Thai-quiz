import type { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  active?: boolean;
  onClick?: () => void;
}

export function Badge({ children, active, onClick }: BadgeProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
        active ? 'bg-accent text-app-bg' : 'bg-app-surface text-txt-secondary'
      }`}
    >
      {children}
    </button>
  );
}
