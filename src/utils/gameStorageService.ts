import type { GameState } from '../types';

const STORAGE_KEY = 'smart10_game_state';

export const gameStorageService = {
  saveGame: (state: GameState): void => {
    try {
      // Convertir Set a Array para serialización
      const stateToSave = {
        ...state,
        answeredOptionsInRound: Array.from(state.answeredOptionsInRound),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (error) {
      console.error('Error saving game state:', error);
    }
  },

  loadGame: (): GameState | null => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return null;

      const state = JSON.parse(saved);
      // Convertir Array de vuelta a Set
      return {
        ...state,
        answeredOptionsInRound: new Set(state.answeredOptionsInRound),
      };
    } catch (error) {
      console.error('Error loading game state:', error);
      return null;
    }
  },

  deleteGame: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error deleting game state:', error);
    }
  },

  hasGame: (): boolean => {
    return localStorage.getItem(STORAGE_KEY) !== null;
  },
};
