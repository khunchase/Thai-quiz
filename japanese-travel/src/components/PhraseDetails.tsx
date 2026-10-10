import type { Phrase } from '../types/phrase';
import { Furigana } from './Furigana';
import { AudioButton } from './AudioButton';

/** Everything worth knowing about a phrase: plain-Japanese version, a reply, and the note. */
export function PhraseDetails({ phrase }: { phrase: Phrase }) {
  return (
    <div className="flex flex-col gap-3 text-sm">
      {phrase.plain && (
        <div>
          <div className="text-txt-tertiary text-[11px] font-semibold uppercase tracking-wide mb-1">In plain Japanese</div>
          <div className="flex items-center gap-2">
            <Furigana markup={phrase.plain} className="text-base flex-1" show />
            <AudioButton markup={phrase.plain} />
          </div>
        </div>
      )}
      {phrase.reply && (
        <div>
          <div className="text-txt-tertiary text-[11px] font-semibold uppercase tracking-wide mb-1">You could reply</div>
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <Furigana markup={phrase.reply.jp} className="text-base" show />
              <div className="text-txt-secondary text-xs mt-0.5">{phrase.reply.en}</div>
            </div>
            <AudioButton markup={phrase.reply.jp} />
          </div>
        </div>
      )}
      {phrase.note && (
        <div className="rounded-lg bg-indigo/10 border border-indigo/25 px-3 py-2 text-txt-secondary leading-relaxed">
          <span className="text-indigo font-semibold">Note · </span>
          {phrase.note}
        </div>
      )}
    </div>
  );
}
