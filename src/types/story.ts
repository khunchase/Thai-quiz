export interface StoryWord {
  thai: string;
  romanization: string;
  pronunciation: string;
  english: string;
  /** Part of speech or grammatical role — shown for every word. */
  grammarNote: string;
}

export interface StorySentence {
  thai: string;
  english: string;
  words: StoryWord[];
  /** True if this sentence starts a new paragraph in the source text. */
  newParagraph?: boolean;
}

export interface Story {
  id: string;
  title: {
    thai: string;
    english: string;
  };
  sentences: StorySentence[];
}
