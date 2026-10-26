import { Question } from '@/types';

export interface EvaluationResult {
  isCorrect: boolean;
  userAnswerSummary: string;
  correctAnswerSummary: string;
  explanation: string;
}

export const evaluateAnswer = (
  question: Question,
  userAnswer: string | string[] | boolean | number
): EvaluationResult => {
  let isCorrect = false;
  let userAnswerSummary = String(userAnswer);
  let correctAnswerSummary = String(question.correctAnswer);

  switch (question.type) {
    case 'multiple_choice': {
      isCorrect =
        String(userAnswer).trim().toLowerCase() ===
        String(question.correctAnswer).trim().toLowerCase();
      userAnswerSummary = String(userAnswer);
      correctAnswerSummary = String(question.correctAnswer);
      break;
    }

    case 'true_false': {
      const boolUser =
        userAnswer === true ||
        String(userAnswer).toLowerCase() === 'true' ||
        String(userAnswer).toLowerCase() === 'benar';
      const boolCorrect =
        question.correctAnswer === true ||
        String(question.correctAnswer).toLowerCase() === 'true' ||
        String(question.correctAnswer).toLowerCase() === 'benar';

      isCorrect = boolUser === boolCorrect;
      userAnswerSummary = boolUser ? 'Benar' : 'Salah';
      correctAnswerSummary = boolCorrect ? 'Benar' : 'Salah';
      break;
    }

    case 'fill_blank': {
      // Normalize whitespace and quotes for coding accuracy
      const normalizeCode = (val: string) =>
        val
          .trim()
          .replace(/\s+/g, ' ')
          .replace(/["']/g, '"')
          .toLowerCase();

      isCorrect =
        normalizeCode(String(userAnswer)) ===
        normalizeCode(String(question.correctAnswer));
      userAnswerSummary = String(userAnswer);
      correctAnswerSummary = String(question.correctAnswer);
      break;
    }

    case 'order_lines': {
      if (Array.isArray(userAnswer) && Array.isArray(question.correctAnswer)) {
        isCorrect =
          userAnswer.length === question.correctAnswer.length &&
          userAnswer.every(
            (line, idx) =>
              line.trim() === (question.correctAnswer as string[])[idx].trim()
          );
        userAnswerSummary = userAnswer.join(' \u2192 ');
        correctAnswerSummary = (question.correctAnswer as string[]).join(' \u2192 ');
      }
      break;
    }

    case 'find_bug': {
      if (typeof question.buggyLine === 'number') {
        isCorrect = Number(userAnswer) === question.buggyLine;
        userAnswerSummary = `Baris ${Number(userAnswer) + 1}`;
        correctAnswerSummary = `Baris ${question.buggyLine + 1}`;
      } else {
        isCorrect =
          String(userAnswer).trim().toLowerCase() ===
          String(question.correctAnswer).trim().toLowerCase();
        userAnswerSummary = String(userAnswer);
        correctAnswerSummary = String(question.correctAnswer);
      }
      break;
    }
  }

  return {
    isCorrect,
    userAnswerSummary,
    correctAnswerSummary,
    explanation: question.explanation,
  };
};

export const calculateQuizScore = (
  correctCount: number,
  totalQuestions: number
): { score: number; passed: boolean } => {
  if (totalQuestions === 0) return { score: 100, passed: true };
  const score = Math.round((correctCount / totalQuestions) * 100);
  const passed = score >= 60; // 60% passing grade
  return { score, passed };
};
