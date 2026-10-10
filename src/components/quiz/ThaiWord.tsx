import { useSettingsStore, singleThaiFontClass } from '../../stores/settings-store';

interface ThaiWordProps {
  text: string;
  size?: 'lg' | 'md' | 'sm';
  align?: 'center' | 'left';
  className?: string;
}

const SIZE_CLASSES = {
  lg: 'text-5xl',
  md: 'text-4xl',
  sm: 'text-3xl',
};

export function ThaiWord({ text, size = 'lg', align = 'center', className = '' }: ThaiWordProps) {
  const fontStyle = useSettingsStore((state) => state.settings.thaiFontStyle);
  return (
    <div
      className={`${singleThaiFontClass(fontStyle)} font-semibold leading-tight ${SIZE_CLASSES[size]} ${
        align === 'center' ? 'text-center' : 'text-left'
      } ${className}`}
    >
      {text}
    </div>
  );
}
