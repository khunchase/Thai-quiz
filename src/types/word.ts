export interface Category {
  id: string;
  name: string;
  icon: string;
  custom?: boolean;
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
  custom?: boolean;
}
