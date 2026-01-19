export type QuestionType = 'BOOLEAN' | 'ORDER' | 'NUMBER' | 'TEXT';

export interface Option {
  texto: string;
  valor: string | number | boolean;
}

export interface Question {
  id: number;
  tema: string;
  pregunta: string;
  tipo: QuestionType;
  opciones: Option[];
}

export type PlayerShape = 'triangle' | 'circle' | 'square' | 'star';

export interface Player {
  id: string;
  shape: PlayerShape;
  name: string;
  score: number;
  roundScore: number;
  isEliminated: boolean;
  hasPassedThisRound: boolean;
}

export interface GameState {
  status: 'menu' | 'playerSetup' | 'pointsSetup' | 'playing' | 'roundEnd' | 'gameEnd';
  players: Player[];
  pointsToWin: number;
  currentQuestion: Question | null;
  currentRound: number;
  answeredOptionsInRound: Set<number>;
  winner: Player | null;
  currentPlayerIndex: number;
}
