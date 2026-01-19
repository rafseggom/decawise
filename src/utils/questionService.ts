import type { Question } from '../types';

const QUESTIONS_URL = `${import.meta.env.BASE_URL}data/questions.json`;

export const loadQuestions = async (): Promise<Question[]> => {
  try {
    const response = await fetch(QUESTIONS_URL);
    if (!response.ok) {
      throw new Error('Failed to load questions');
    }
    return await response.json();
  } catch (error) {
    console.error('Error loading questions:', error);
    return [];
  }
};

export const getRandomQuestions = (questions: Question[], count: number): Question[] => {
  const shuffled = [...questions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

export const getRandomQuestion = (questions: Question[]): Question => {
  return questions[Math.floor(Math.random() * questions.length)];
};
