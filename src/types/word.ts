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
  english: string;
  categoryId: string;
  custom?: boolean;
}
