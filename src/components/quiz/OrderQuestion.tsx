import { useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { createPortal } from 'react-dom';
import type { QuizQuestion, Grade } from '../../types/quiz';
import { gradeForMultipleChoice, GRADE_GIVE_UP, type ScheduleOptions } from '../../lib/srs';
import { closestOrder, isCorrectOrder } from '../../data/word-order';
import { useSettingsStore, singleThaiFontClass } from '../../stores/settings-store';
import { AccentButton, GhostButton } from '../ui/Button';
import { ExerciseLayout, type ExerciseFrame } from './ExerciseLayout';

interface Props extends ExerciseFrame {
  question: QuizQuestion;
  onAnswered: (grade: Grade, correct: boolean, userAnswer?: string, options?: ScheduleOptions) => void;
}

type Result = 'right' | 'wrong' | 'gave-up';

/** A block being held: which one, where it came from, and where the finger is. */
interface Drag {
  block: number;
  from: 'answer' | 'bank';
  /** Finger position, and where on the block it grabbed, for drawing the block under the finger. */
  x: number;
  y: number;
  grabX: number;
  grabY: number;
  width: number;
  /** Where in the answer it would land if let go now; null when it's not over the answer. */
  dropAt: number | null;
}

/** How far a finger has to move before a press becomes a drag instead of a tap. */
const DRAG_THRESHOLD = 6;

/**
 * Put the shuffled word blocks in order to make the Thai for an English sentence.
 * Tap a block to add it to the end (or send it back), or drag it to exactly where it goes.
 * The word bank never moves: a used block leaves a dotted gap in its place.
 */
export function OrderQuestion({ question, onAnswered, ...frame }: Props) {
  const fontStyle = useSettingsStore((s) => s.settings.thaiFontStyle);
  const { word, orderSentence: sentence, blockOrder = [] } = question;
  /** Block indexes in the answer row, in order. */
  const [placed, setPlaced] = useState<number[]>([]);
  const [result, setResult] = useState<Result | null>(null);
  const [drag, setDrag] = useState<Drag | null>(null);
  /** The block pressed, where, and the answer row as it was then (it can't change mid-drag). */
  const press = useRef<{
    block: number;
    from: 'answer' | 'bank';
    x: number;
    y: number;
    el: HTMLElement;
    placed: number[];
  } | null>(null);
  const answerRef = useRef<HTMLDivElement>(null);
  const answerBlockRefs = useRef(new Map<number, HTMLElement>());
  // Window listeners read this, since the held block's own element disappears while it's lifted.
  const dragRef = useRef<Drag | null>(null);
  if (!sentence) return null;

  const answered = result !== null;
  const built = placed.map((i) => sentence.chunks[i]);
  const allPlaced = placed.length === sentence.chunks.length;
  const target = closestOrder(sentence, built);
  const fullThai = sentence.chunks.join('');
  const grade: Grade | null =
    result === null ? null : result === 'gave-up' ? GRADE_GIVE_UP : gradeForMultipleChoice(result === 'right');
  const thaiFont = singleThaiFontClass(fontStyle);

  function tap(block: number) {
    if (answered) return;
    setPlaced((p) => (p.includes(block) ? p.filter((b) => b !== block) : [...p, block]));
  }

  /** Where a block dropped at (x, y) would go in the answer, or null when (x, y) isn't over the answer. */
  function dropIndex(x: number, y: number, held: number): number | null {
    const box = answerRef.current?.getBoundingClientRect();
    const slack = 24;
    if (!box || x < box.left - slack || x > box.right + slack || y < box.top - slack || y > box.bottom + slack) {
      return null;
    }
    const others = (press.current?.placed ?? []).filter((b) => b !== held);
    for (let i = 0; i < others.length; i++) {
      const r = answerBlockRefs.current.get(others[i])?.getBoundingClientRect();
      if (!r) continue;
      // Above this block's line, or on its line and left of its middle: it goes before this block.
      if (y < r.top || (y <= r.bottom && x < r.left + r.width / 2)) return i;
    }
    return others.length;
  }

  function updateDrag(next: Drag | null) {
    dragRef.current = next;
    setDrag(next);
  }

  function onPointerDown(e: ReactPointerEvent<HTMLElement>, block: number, from: 'answer' | 'bank') {
    if (answered || e.button !== 0 || press.current) return;
    press.current = { block, from, x: e.clientX, y: e.clientY, el: e.currentTarget, placed };
    const stop = () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', cancel);
    };
    const up = () => {
      stop();
      onPointerUp();
    };
    const cancel = () => {
      stop();
      onPointerCancel();
    };
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', cancel);
  }

  function onPointerMove(e: PointerEvent) {
    const p = press.current;
    if (!p) return;
    const drag = dragRef.current;
    if (!drag) {
      if (Math.hypot(e.clientX - p.x, e.clientY - p.y) < DRAG_THRESHOLD) return;
      const r = p.el.getBoundingClientRect();
      updateDrag({
        block: p.block,
        from: p.from,
        x: e.clientX,
        y: e.clientY,
        grabX: p.x - r.left,
        grabY: p.y - r.top,
        width: r.width,
        dropAt: dropIndex(e.clientX, e.clientY, p.block),
      });
      return;
    }
    updateDrag({ ...drag, x: e.clientX, y: e.clientY, dropAt: dropIndex(e.clientX, e.clientY, drag.block) });
  }

  function onPointerUp() {
    const p = press.current;
    press.current = null;
    const drag = dragRef.current;
    if (!p) return;
    if (!drag) {
      tap(p.block);
      return;
    }
    const { block, dropAt } = drag;
    updateDrag(null);
    setPlaced((prev) => {
      const rest = prev.filter((b) => b !== block);
      // Let go outside the answer: the block goes back to the bank.
      if (dropAt === null) return rest;
      return [...rest.slice(0, dropAt), block, ...rest.slice(dropAt)];
    });
  }

  function onPointerCancel() {
    press.current = null;
    updateDrag(null);
  }

  function check() {
    if (answered || !allPlaced || !sentence) return;
    setResult(isCorrectOrder(sentence, built) ? 'right' : 'wrong');
  }

  function next() {
    if (grade === null) return;
    onAnswered(grade, result === 'right', built.join(' '));
  }

  const blockBase = `${thaiFont} text-3xl font-semibold px-3 py-2 rounded-lg border-2 leading-snug select-none`;
  const handlers = (block: number, from: 'answer' | 'bank') => ({
    onPointerDown: (e: ReactPointerEvent<HTMLElement>) => onPointerDown(e, block, from),
    // Holding a block shouldn't scroll the page or open the long-press menu.
    onContextMenu: (e: { preventDefault: () => void }) => e.preventDefault(),
    style: { touchAction: 'none' as const },
  });

  // The answer row as drawn: the held block is lifted out, and a dotted gap shows where it would land.
  const rowItems: (number | 'gap')[] = placed.filter((b) => b !== drag?.block);
  if (drag && drag.dropAt !== null) rowItems.splice(drag.dropAt, 0, 'gap');
  const heldText = drag ? sentence.chunks[drag.block] : '';

  return (
    <ExerciseLayout
      {...frame}
      word={word}
      answered={answered}
      pendingGrade={grade}
      onNext={next}
      playText={fullThai}
      // Hearing the sentence would give the order away.
      playDisabled={!answered}
    >
      <div className="flex flex-col gap-2 py-2">
        <div className="text-txt-secondary font-semibold">Put the words in order</div>
        <div className="text-txt-primary text-xl font-semibold">{sentence.english}</div>
      </div>

      {/* Answer row */}
      <div
        ref={answerRef}
        className={`min-h-20 rounded-xl border-2 border-dashed p-2 flex flex-wrap content-start gap-2 transition-colors ${
          result === 'right'
            ? 'border-success'
            : answered
              ? 'border-danger'
              : drag?.dropAt !== null && drag
                ? 'border-accent bg-accent/5'
                : 'border-border'
        }`}
      >
        {rowItems.length === 0 && (
          <div className="self-center w-full text-center text-txt-tertiary text-sm">Tap or drag the words here</div>
        )}
        {rowItems.map((item, pos) => {
          if (item === 'gap') {
            return (
              <div key="gap" className={`${blockBase} border-dashed border-accent text-transparent`}>
                {heldText}
              </div>
            );
          }
          const placedPos = placed.indexOf(item);
          let style = 'bg-app-card border-accent/60 text-txt-primary';
          if (answered) {
            style =
              built[placedPos] === target[placedPos]
                ? 'bg-success/15 border-success text-success'
                : 'bg-danger/15 border-danger text-danger';
          }
          return (
            <button
              key={item}
              ref={(el) => {
                if (el) answerBlockRefs.current.set(item, el);
                else answerBlockRefs.current.delete(item);
              }}
              type="button"
              disabled={answered}
              aria-label={`${sentence.chunks[item]}, position ${pos + 1}`}
              className={`${blockBase} ${style} ${answered ? '' : 'cursor-grab active:scale-95'}`}
              {...handlers(item, 'answer')}
            >
              {sentence.chunks[item]}
            </button>
          );
        })}
      </div>

      {/* Word bank: blocks keep their spot; a used one leaves a dotted gap. */}
      {!answered && (
        <div className="flex flex-wrap justify-center gap-2">
          {blockOrder.map((block) => {
            const used = placed.includes(block) || drag?.block === block;
            if (used) {
              return (
                <div key={block} aria-hidden className={`${blockBase} border-dashed border-border text-transparent`}>
                  {sentence.chunks[block]}
                </div>
              );
            }
            return (
              <button
                key={block}
                type="button"
                className={`${blockBase} bg-app-surface border-border text-txt-primary cursor-grab active:scale-95`}
                {...handlers(block, 'bank')}
              >
                {sentence.chunks[block]}
              </button>
            );
          })}
        </div>
      )}

      {!answered && (
        <>
          <AccentButton onClick={check} disabled={!allPlaced}>
            Check
          </AccentButton>
          <div className="flex justify-center gap-2">
            {placed.length > 0 && <GhostButton onClick={() => setPlaced([])}>Clear</GhostButton>}
            <GhostButton onClick={() => setResult('gave-up')}>I don't know</GhostButton>
          </div>
        </>
      )}

      {answered && (
        <div className="text-center flex flex-col gap-1">
          <div className={`font-bold ${result === 'right' ? 'text-success' : 'text-danger'}`}>
            {result === 'right' ? 'Correct!' : result === 'wrong' ? 'Not quite' : 'The answer is'}
          </div>
          {result !== 'right' && (
            <div className={`${thaiFont} text-3xl font-semibold text-txt-primary`}>{sentence.chunks.join(' ')}</div>
          )}
          {result === 'right' && built.join('') !== fullThai && (
            <div className="text-txt-tertiary text-xs">
              Also right: <span className={thaiFont}>{sentence.chunks.join(' ')}</span>
            </div>
          )}
        </div>
      )}

      {/* The held block follows the finger. */}
      {drag &&
        createPortal(
          <div
            className={`${blockBase} fixed z-[70] pointer-events-none bg-app-card border-accent text-txt-primary shadow-[0_8px_24px_rgba(0,0,0,0.5)] scale-105`}
            style={{ left: drag.x - drag.grabX, top: drag.y - drag.grabY, width: drag.width }}
          >
            {heldText}
          </div>,
          document.body
        )}
    </ExerciseLayout>
  );
}
