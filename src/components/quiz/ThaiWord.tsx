interface ThaiWordProps {
  text: string;
  size?: 'lg' | 'md' | 'sm';
  align?: 'center' | 'left';
  mutedSecondary?: boolean;
  className?: string;
}

const SIZE_CLASSES = {
  lg: { primary: 'text-4xl', secondary: 'text-4xl' },
  md: { primary: 'text-3xl', secondary: 'text-3xl' },
  sm: { primary: 'text-xl', secondary: 'text-xl' },
};

/**
 * Shows a Thai word in two type styles at once — loopless "Noto Sans Thai"
 * (modern/simplified letterforms) and looped "Noto Sans Thai Looped"
 * (traditional letterforms) — since readers used to one style can find
 * the other hard to parse.
 */
export function ThaiWord({ text, size = 'lg', align = 'center', mutedSecondary = true, className = '' }: ThaiWordProps) {
  const s = SIZE_CLASSES[size];
  return (
    <div className={`flex flex-col ${align === 'center' ? 'items-center' : 'items-start'} gap-0.5 ${className}`}>
      <span className={`font-thai font-semibold ${s.primary}`}>{text}</span>
      <span className={`font-thai-looped ${s.secondary} ${mutedSecondary ? 'text-txt-secondary' : 'opacity-70'}`}>
        {text}
      </span>
    </div>
  );
}
