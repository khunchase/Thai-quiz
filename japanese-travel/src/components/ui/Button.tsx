import type { ReactNode, ButtonHTMLAttributes } from 'react';

interface AccentButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  size?: 'large' | 'medium' | 'small';
}

export function AccentButton({ children, size = 'large', className = '', ...props }: AccentButtonProps) {
  const sizes = {
    large: 'h-14 text-base',
    medium: 'h-11 text-sm',
    small: 'h-9 text-xs',
  };
  return (
    <button
      className={`w-full ${sizes[size]} rounded-lg font-semibold
        bg-gradient-to-b from-accent-light to-accent text-app-bg
        active:scale-[0.98] transition-transform duration-150
        disabled:opacity-40 disabled:pointer-events-none ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

interface SecondaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export function SecondaryButton({ children, className = '', ...props }: SecondaryButtonProps) {
  return (
    <button
      className={`px-4 py-2 rounded-lg font-semibold text-sm text-accent bg-accent/15
        active:scale-[0.98] transition-transform duration-150
        disabled:opacity-40 disabled:pointer-events-none ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

interface GhostButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export function GhostButton({ children, className = '', ...props }: GhostButtonProps) {
  return (
    <button
      className={`px-3 py-1.5 rounded-lg font-medium text-sm text-txt-secondary
        active:scale-[0.98] transition-transform duration-150
        disabled:opacity-40 disabled:pointer-events-none ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
