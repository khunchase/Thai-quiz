export interface Category {
  id: string;
  name: string;
  icon: string;
  custom?: boolean;
}

export interface WordPart {
  thai: string;
  romanization: string;
  english: string;
}

export interface Word {
  id: string;
  thai: string;
  romanization: string;
  /**
   * Tone-marked pronunciation guide (Paiboon-style): unmarked = mid tone,
   * à = low, â = falling, á = high, ǎ = rising. Optional — falls back to
   * `romanization` for display when absent (e.g. user-added words).
   */
  pronunciation?: string;
  english: string;
  categoryId: string;
  /** Difficulty tier 1 (basic) - 5 (advanced). Gates quiz access via progression. */
  level: number;
  custom?: boolean;
  /** For transparent compounds, the component words this word is built from. */
  breakdown?: WordPart[];
}
