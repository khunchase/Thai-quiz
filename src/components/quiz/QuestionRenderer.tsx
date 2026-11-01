import type { QuizQuestion, Grade } from '../../types/quiz';
import type { ExerciseFrame } from './ExerciseLayout';
import type { ScheduleOptions } from '../../lib/srs';
import { MultipleChoiceQuestion } from './MultipleChoiceQuestion';
import { TypedAnswerQuestion } from './TypedAnswerQuestion';
import { FlashcardQuestion } from './FlashcardQuestion';
import { ConnectorQuestion } from './ConnectorQuestion';

interface Props extends ExerciseFrame {
  question: QuizQuestion;
  onAnswered: (grade: Grade, correct: boolean, userAnswer?: string, options?: ScheduleOptions) => void;
  onMarkWord?: (wordId: string, grade: Grade, correct: boolean) => void;
}

export function QuestionRenderer({ question, onMarkWord, ...props }: Props) {
  switch (question.type) {
    case 'multiple-choice':
      return <MultipleChoiceQuestion question={question} onMarkWord={onMarkWord} {...props} />;
    case 'typed':
      return <TypedAnswerQuestion question={question} {...props} />;
    case 'flashcard':
      return <FlashcardQuestion question={question} {...props} />;
    case 'connector':
      return <ConnectorQuestion question={question} onMarkWord={onMarkWord} {...props} />;
  }
}
