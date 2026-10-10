import type { Phrase } from '../types/phrase';

const REGISTER_LABEL = { keigo: '敬語', polite: '丁寧', casual: '普通' } as const;

export function SpeakerTag({ phrase }: { phrase: Phrase }) {
  const isStaff = phrase.speaker === 'staff';
  return (
    <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide">
      <span className={`px-1.5 py-0.5 rounded ${isStaff ? 'bg-indigo/15 text-indigo' : 'bg-accent/15 text-accent'}`}>
        {isStaff ? 'They say' : 'You say'}
      </span>
      <span lang="ja" className="px-1.5 py-0.5 rounded bg-app-surface text-txt-secondary font-jp normal-case">
        {REGISTER_LABEL[phrase.register]}
      </span>
    </div>
  );
}
