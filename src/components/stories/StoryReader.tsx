import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Story, StoryWord } from '../../types/story';
import { AudioButton } from '../quiz/AudioButton';
import { AccentButton, GhostButton } from '../ui/Button';
import { ProgressBar } from '../ui/ProgressBar';

// Conjunctions, prepositions and relative pronouns (ที่, ว่า, และ, แต่…) glue clauses together.
function isConnector(word: StoryWord) {
  return /^(conjunction|preposition|relative pronoun)/i.test(word.grammarNote);
}

function isPunctuation(word: StoryWord) {
  return word.romanization.trim() === '';
}

// Decides which words get a space before them. Opening quotes hug the next word, closing quotes hug the previous one.
function spacesBefore(words: StoryWord[]) {
  let insideQuote = false;
  return words.map((word, i) => {
    if (i === 0) {
      if (word.thai === '"') insideQuote = true;
      return false;
    }
    if (word.thai === '"') {
      const opening = !insideQuote;
      insideQuote = opening;
      return opening;
    }
    if (isPunctuation(word)) return false;
    return !(insideQuote && words[i - 1].thai === '"');
  });
}

interface SentenceProps {
  words: StoryWord[];
  split: boolean;
  selected: number | null;
  onSelect: (i: number) => void;
}

// Renders the sentence word by word so each word can be tapped. When joined, the words sit flush and read as the original sentence.
function TappableSentence({ words, split, selected, onSelect }: SentenceProps) {
  const spaces = split ? spacesBefore(words) : words.map(() => false);
  return (
    <>
      {words.map((word, i) => {
        const color = isConnector(word) ? 'text-connector' : '';
        if (isPunctuation(word)) {
          return (
            <span key={i} className={split ? 'whitespace-nowrap' : ''}>
              {word.thai}
            </span>
          );
        }
        return (
          <span key={i}>
            {spaces[i] && ' '}
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                onSelect(i);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelect(i);
                }
              }}
              className={`cursor-pointer rounded transition-colors ${split ? 'whitespace-nowrap' : ''} ${color} ${
                selected === i ? 'bg-accent/25 underline decoration-accent decoration-2 underline-offset-8' : ''
              }`}
            >
              {word.thai}
            </span>
          </span>
        );
      })}
    </>
  );
}

function WordSheet({ word, onClose }: { word: StoryWord; onClose: () => void }) {
  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 40, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 420, damping: 38 }}
      onClick={(e) => e.stopPropagation()}
      className="rounded-2xl border border-border-accent bg-app-card-light p-4 shadow-[0_-8px_24px_rgba(0,0,0,0.5)]"
    >
      <div className="flex items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className={`font-thai-looped font-semibold text-3xl leading-tight ${isConnector(word) ? 'text-connector' : ''}`}>
            {word.thai}
          </div>
          <div className="text-txt-secondary text-sm mt-1">{word.pronunciation || word.romanization}</div>
        </div>
        <AudioButton text={word.thai} />
        <button
          onClick={onClose}
          aria-label="Close"
          className="w-9 h-9 rounded-full bg-app-surface text-txt-secondary shrink-0"
        >
          ✕
        </button>
      </div>
      <div className="text-txt-primary text-lg font-semibold mt-3">{word.english}</div>
      <div className="text-txt-tertiary text-sm mt-0.5">{word.grammarNote}</div>
    </motion.div>
  );
}

interface Props {
  story: Story;
  onExit: () => void;
}

export function StoryReader({ story, onExit }: Props) {
  const [index, setIndex] = useState(0);
  const [split, setSplit] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);

  const sentence = story.sentences[index];
  const progressPct = (index / story.sentences.length) * 100;
  const selectedWord = selected === null ? null : sentence.words[selected];

  function next() {
    if (index + 1 < story.sentences.length) {
      setIndex((i) => i + 1);
      setSelected(null);
    }
  }

  function prev() {
    if (index > 0) {
      setIndex((i) => i - 1);
      setSelected(null);
    }
  }

  return (
    <div className="flex-1 min-h-0 flex flex-col p-3 gap-3 overflow-y-auto" onClick={() => setSelected(null)}>
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={onExit}
          className="px-4 py-2 rounded-lg bg-app-surface text-danger font-semibold text-sm shrink-0"
        >
          ✕ Exit
        </button>
        <div className="text-txt-secondary text-sm font-semibold truncate px-2">{story.title.english}</div>
        <div className="text-txt-secondary text-sm font-semibold shrink-0">
          {index + 1} / {story.sentences.length}
        </div>
      </div>
      <ProgressBar value={progressPct} />

      <div className="flex flex-col gap-4 pb-2">
        {sentence.newParagraph && index > 0 && <div className="h-2" />}

        <div className="relative bg-app-card-light border border-border-accent rounded-2xl p-5 pt-10 flex flex-col items-center gap-2 text-center">
          <button
            onClick={() => setSplit((s) => !s)}
            aria-pressed={split}
            className={`absolute top-2 right-2 px-3 py-1 rounded-lg text-xs font-semibold ${
              split ? 'bg-accent text-app-bg' : 'bg-app-surface text-txt-secondary'
            }`}
          >
            {split ? 'Joined' : 'Split words'}
          </button>
          <div className="font-thai-looped font-semibold text-3xl">
            <TappableSentence
              words={sentence.words}
              split={split}
              selected={selected}
              onSelect={(i) => setSelected((cur) => (cur === i ? null : i))}
            />
          </div>
          <AudioButton text={sentence.thai} />
          <div className="text-txt-primary text-base mt-1">{sentence.english}</div>
          <div className="text-txt-tertiary text-xs mt-1">Tap a word for its meaning</div>
        </div>
      </div>

      {/* Pinned above the nav buttons so Next/Previous stay reachable while a word is open. */}
      <div className="mt-auto sticky bottom-0 flex flex-col gap-2 pt-2 bg-app-bg">
        <AnimatePresence>
          {selectedWord && <WordSheet word={selectedWord} onClose={() => setSelected(null)} />}
        </AnimatePresence>
        <div className="flex gap-2">
          <GhostButton onClick={prev} className="flex-1 bg-app-surface justify-center" disabled={index === 0}>
            ← Previous
          </GhostButton>
          {index + 1 < story.sentences.length ? (
            <AccentButton onClick={next} className="flex-1">
              Next →
            </AccentButton>
          ) : (
            <AccentButton onClick={onExit} className="flex-1">
              Finish 🎉
            </AccentButton>
          )}
        </div>
      </div>
    </div>
  );
}
