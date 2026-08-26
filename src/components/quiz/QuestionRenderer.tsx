import type { QuizQuestion, Grade } from '../../types/quiz';
import { MultipleChoiceQuestion } from './MultipleChoiceQuestion';
import { TypedAnswerQuestion } from './TypedAnswerQuestion';
import { FlashcardQuestion } from './FlashcardQuestion';

interface Props {
  question: QuizQuestion;
  onAnswered: (grade: Grade, correct: boolean, userAnswer?: string) => void;
}

export function QuestionRenderer({ question, onAnswered }: Props) {
  switch (question.type) {
    case 'multiple-choice':
      return <MultipleChoiceQuestion question={question} onAnswered={onAnswered} />;
    case 'typed':
      return <TypedAnswerQuestion question={question} onAnswered={onAnswered} />;
    case 'flashcard':
      return <FlashcardQuestion question={question} onAnswered={onAnswered} />;
  }
}
