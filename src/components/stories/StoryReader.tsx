import { useState } from 'react';
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

function SplitSentence({ words }: { words: StoryWord[] }) {
  const spaces = spacesBefore(words);
  return (
    <>
      {words.map((word, i) => (
        <span key={i}>
          {spaces[i] && ' '}
          <span className={`whitespace-nowrap ${isConnector(word) ? 'text-connector' : ''}`}>{word.thai}</span>
        </span>
      ))}
    </>
  );
}

interface Props {
  story: Story;
  onExit: () => void;
}

export function StoryReader({ story, onExit }: Props) {
  const [index, setIndex] = useState(0);
  const [split, setSplit] = useState(false);

  const sentence = story.sentences[index];
  const progressPct = (index / story.sentences.length) * 100;
  const breakdownWords = sentence.words.filter((w) => w.romanization.trim() !== '');

  function next() {
    if (index + 1 < story.sentences.length) setIndex((i) => i + 1);
  }

  function prev() {
    if (index > 0) setIndex((i) => i - 1);
  }

  return (
    <div className="flex-1 min-h-0 flex flex-col p-3 gap-3 overflow-y-auto">
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
            {split ? <SplitSentence words={sentence.words} /> : sentence.thai}
          </div>
          <AudioButton text={sentence.thai} />
          <div className="text-txt-primary text-base mt-1">{sentence.english}</div>
        </div>

        <div>
          <div className="text-txt-tertiary text-xs font-semibold uppercase tracking-wide mb-2 px-1">
            Word by word
          </div>
          <div className="flex flex-col gap-2">
            {breakdownWords.map((word, i) => (
              <div
                key={i}
                className="bg-app-card rounded-lg border border-border p-3 flex items-start gap-3"
              >
                <div className="shrink-0 text-center w-24">
                  <div className={`font-thai-looped text-xl leading-tight ${isConnector(word) ? 'text-connector' : ''}`}>
                    {word.thai}
                  </div>
                  <div className="text-txt-secondary text-xs mt-0.5">{word.pronunciation || word.romanization}</div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-txt-primary text-sm font-semibold">{word.english}</div>
                  <div className="text-txt-tertiary text-xs mt-0.5">{word.grammarNote}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-auto flex gap-2 pt-2">
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
  );
}
