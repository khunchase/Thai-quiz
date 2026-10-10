import { Fragment } from 'react';
import { parseFurigana } from '../lib/furigana';
import { useSettingsStore } from '../stores/settings-store';

interface FuriganaProps {
  markup: string;
  className?: string;
  /** Override the global furigana setting (e.g. always show on answer reveal). */
  show?: boolean;
}

export function Furigana({ markup, className = '', show }: FuriganaProps) {
  const globalShow = useSettingsStore((s) => s.settings.furigana);
  const visible = show ?? globalShow;
  return (
    <span lang="ja" className={`font-jp ${visible ? '' : 'furigana-hidden'} ${className}`}>
      {parseFurigana(markup).map((seg, i) =>
        seg.reading ? (
          <ruby key={i}>
            {seg.text}
            <rt>{seg.reading}</rt>
          </ruby>
        ) : (
          <Fragment key={i}>{seg.text}</Fragment>
        )
      )}
    </span>
  );
}
