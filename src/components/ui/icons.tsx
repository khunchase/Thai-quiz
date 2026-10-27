interface IconProps {
  className?: string;
}

const STROKE = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

export function PlayIcon({ className = 'w-7 h-7' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="10" {...STROKE} />
      <path d="M10 8.2v7.6a.5.5 0 0 0 .76.43l6.1-3.8a.5.5 0 0 0 0-.86l-6.1-3.8a.5.5 0 0 0-.76.43z" fill="currentColor" />
    </svg>
  );
}

export function HelpIcon({ className = 'w-7 h-7' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="10" {...STROKE} />
      <path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 2.6-3 4.5" {...STROKE} />
      <circle cx="11.9" cy="17.6" r="0.6" fill="currentColor" stroke="currentColor" strokeWidth="0.8" />
    </svg>
  );
}

export function BackIcon({ className = 'w-6 h-6' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M15 5l-7 7 7 7" {...STROKE} strokeWidth={2.4} />
    </svg>
  );
}

export function ArrowRightIcon({ className = 'w-5 h-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M4 12h16M14 6l6 6-6 6" {...STROKE} />
    </svg>
  );
}

export function SearchIcon({ className = 'w-6 h-6' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <circle cx="11" cy="11" r="6.5" {...STROKE} />
      <path d="M16 16l4 4" {...STROKE} />
    </svg>
  );
}
