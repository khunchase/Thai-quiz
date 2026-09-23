import { useSettingsStore, singleThaiFontClass } from '../../stores/settings-store';

interface ThaiWordProps {
  text: string;
  size?: 'lg' | 'md' | 'sm';
  align?: 'center' | 'left';
  mutedSecondary?: boolean;
  className?: string;
}

const SIZE_CLASSES = {
  lg: { primary: 'text-5xl', secondary: 'text-5xl' },
  md: { primary: 'text-4xl', secondary: 'text-4xl' },
  sm: { primary: 'text-3xl', secondary: 'text-3xl' },
};

/**
 * Shows a Thai word in the font style chosen in Settings. By default
 * ('both') it shows looped "Noto Sans Thai Looped" (traditional
 * letterforms) on top and loopless "Noto Sans Thai" (modern/simplified
 * letterforms) below, since readers used to one style can find the other
 * hard to parse. Picking a single style in Settings shows just that one.
 */
export function ThaiWord({ text, size = 'lg', align = 'center', mutedSecondary = true, className = '' }: ThaiWordProps) {
  const s = SIZE_CLASSES[size];
  const fontStyle = useSettingsStore((state) => state.settings.thaiFontStyle);
  const alignClass = align === 'center' ? 'items-center' : 'items-start';

  if (fontStyle !== 'both') {
    return (
      <div className={`flex flex-col ${alignClass} ${className}`}>
        <span className={`${singleThaiFontClass(fontStyle)} font-semibold ${s.primary}`}>{text}</span>
      </div>
    );
  }

  return (
    <div className={`flex flex-col ${alignClass} gap-0.5 ${className}`}>
      <span className={`font-thai-looped font-semibold ${s.primary}`}>{text}</span>
      <span className={`font-thai ${s.secondary} ${mutedSecondary ? 'text-txt-secondary' : 'opacity-70'}`}>
        {text}
      </span>
    </div>
  );
}
