import { useEffect, useState, useCallback } from 'react';
import './App.css';
import type { GameState, Player, PlayerShape, Question } from './types';
import MainMenu from './components/MainMenu';
import PlayerSelection from './components/PlayerSelection';
import PointsSetup from './components/PointsSetup';
import QuestionDisplay from './components/QuestionDisplay';
import RoundEnd from './components/RoundEnd';
import GameEnd from './components/GameEnd';
import ExitButton from './components/ExitButton';
import { loadQuestions, getRandomQuestion } from './utils/questionService';
import { gameStorageService } from './utils/gameStorageService';

const SHAPES: PlayerShape[] = ['triangle', 'circle', 'square', 'star'];

function App() {
  const [gameState, setGameState] = useState<GameState>({
    status: 'menu',
    players: [],
    pointsToWin: 10,
    currentQuestion: null,
    currentRound: 1,
    answeredOptionsInRound: new Set<number>(),
    winner: null,
    currentPlayerIndex: 0,
  });

  const [questions, setQuestions] = useState<Question[]>([]);
  const [savedGameState, setSavedGameState] = useState<GameState | null>(() => {
    // Inicializar savedGameState con el valor de localStorage
    return gameStorageService.loadGame();
  });

  // Cargar preguntas al iniciar
  useEffect(() => {
    loadQuestions().then((loadedQuestions) => {
      setQuestions(loadedQuestions);
    });
  }, []);

  // Guardar estado en localStorage
  const saveGameState = useCallback((state: GameState) => {
    gameStorageService.saveGame(state);
    setSavedGameState(state);
  }, []);

  const handleNewGame = () => {
    setGameState({
      status: 'playerSetup',
      players: [],
      pointsToWin: 10,
      currentQuestion: null,
      currentRound: 1,
      answeredOptionsInRound: new Set<number>(),
      winner: null,
      currentPlayerIndex: 0,
    });
  };

  const handleContinueGame = () => {
    if (savedGameState) {
      setGameState(savedGameState);
    }
  };

  const handlePlayersSelected = (numPlayers: number) => {
    const newPlayers: Player[] = Array.from({ length: numPlayers }, (_, idx) => ({
      id: `player_${idx}`,
      shape: SHAPES[idx],
      name: `Jugador ${idx + 1}`,
      score: 0,
      roundScore: 0,
      isEliminated: false,
      hasPassedThisRound: false,
    }));

    setGameState((prev) => ({
      ...prev,
      status: 'pointsSetup',
      players: newPlayers,
    }));
  };

  const handlePointsSelected = (points: number) => {
    const newState = {
      ...gameState,
      pointsToWin: points,
      status: 'playing' as const,
      currentQuestion: getRandomQuestion(questions),
    };
    setGameState(newState);
    saveGameState(newState);
  };

  const handleOptionSelected = (optionIndex: number, playerId: string) => {
    
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    
    // Solo el jugador actual puede responder
    if (currentPlayer.id !== playerId || currentPlayer.isEliminated || currentPlayer.hasPassedThisRound) {
      return;
    }

    // La opción ya fue respondida
    if (gameState.answeredOptionsInRound.has(optionIndex)) {
      return;
    }

    // Marcar opción como respondida
    const newAnsweredOptions = new Set(gameState.answeredOptionsInRound);
    newAnsweredOptions.add(optionIndex);

    // Incrementar puntuación del jugador actual
    const updatedPlayers = gameState.players.map((p, idx) => 
      idx === gameState.currentPlayerIndex
        ? { ...p, roundScore: p.roundScore + 1 }
        : p
    );

    // Calcular siguiente jugador activo
    let nextPlayerIndex = gameState.currentPlayerIndex;
    const activePlayers = updatedPlayers.filter(p => !p.isEliminated && !p.hasPassedThisRound);
    
    if (activePlayers.length > 0) {
      // Encontrar siguiente jugador activo
      let searchIndex = (gameState.currentPlayerIndex + 1) % updatedPlayers.length;
      let iterations = 0;
      
      while (iterations < updatedPlayers.length) {
        const player = updatedPlayers[searchIndex];
        if (!player.isEliminated && !player.hasPassedThisRound) {
          nextPlayerIndex = searchIndex;
          break;
        }
        searchIndex = (searchIndex + 1) % updatedPlayers.length;
        iterations++;
      }
    }

    const newState = {
      ...gameState,
      players: updatedPlayers,
      answeredOptionsInRound: newAnsweredOptions,
      currentPlayerIndex: nextPlayerIndex,
    };

    // Verificar si la ronda terminó
    if (gameState.currentQuestion && (newAnsweredOptions.size === gameState.currentQuestion.opciones.length || activePlayers.length === 0)) {
      newState.status = 'roundEnd' as const;
    }

    setGameState(newState);
    saveGameState(newState);
  };

  const handlePlayerAction = (playerId: string) => {
    const playerIndex = gameState.players.findIndex(p => p.id === playerId);
    const player = gameState.players[playerIndex];
    
    if (!player || player.isEliminated) return;

    // Solo el jugador actual puede rendirse o eliminarse
    if (playerIndex !== gameState.currentPlayerIndex) return;

    const updatedPlayers = gameState.players.map((p, idx) => {
      if (idx === playerIndex) {
        // El jugador se rinde (se marca como hasPassedThisRound)
        return { ...p, hasPassedThisRound: true };
      }
      return p;
    });

    // Encontrar siguiente jugador activo
    let nextPlayerIndex = gameState.currentPlayerIndex;
    const activePlayers = updatedPlayers.filter(
      (p) => !p.isEliminated && !p.hasPassedThisRound
    );
    
    if (activePlayers.length > 0) {
      let searchIndex = (gameState.currentPlayerIndex + 1) % updatedPlayers.length;
      let iterations = 0;
      
      while (iterations < updatedPlayers.length) {
        const nextPlayer = updatedPlayers[searchIndex];
        if (!nextPlayer.isEliminated && !nextPlayer.hasPassedThisRound) {
          nextPlayerIndex = searchIndex;
          break;
        }
        searchIndex = (searchIndex + 1) % updatedPlayers.length;
        iterations++;
      }
    }

    const newState = { 
      ...gameState, 
      players: updatedPlayers,
      currentPlayerIndex: nextPlayerIndex,
    };

    // Verificar si la ronda terminó: todas las opciones respondidas
    if (gameState.answeredOptionsInRound.size === gameState.currentQuestion?.opciones.length) {
      newState.status = 'roundEnd' as const;
    }
    // Si todos están eliminados/rendidos Y aún quedan opciones, también terminar
    else if (activePlayers.length === 0 && gameState.answeredOptionsInRound.size < (gameState.currentQuestion?.opciones.length || 0)) {
      newState.status = 'roundEnd' as const;
    }

    setGameState(newState);
    saveGameState(newState);
  };

  const handlePlayerEliminated = (playerId: string) => {
    const playerIndex = gameState.players.findIndex(p => p.id === playerId);
    const player = gameState.players[playerIndex];
    
    if (!player || player.isEliminated) return;

    const updatedPlayers = gameState.players.map((p, idx) => {
      if (idx === playerIndex) {
        // El jugador es eliminado (mantiene sus puntos, pero no se sumarán al final)
        return { ...p, isEliminated: true, hasPassedThisRound: true };
      }
      return p;
    });

    // Calcular jugadores activos
    const activePlayers = updatedPlayers.filter(
      (p) => !p.isEliminated && !p.hasPassedThisRound
    );

    // Si el jugador eliminado es el jugador actual, avanzar el turno
    let nextPlayerIndex = gameState.currentPlayerIndex;
    
    if (playerIndex === gameState.currentPlayerIndex && activePlayers.length > 0) {
      // Encontrar siguiente jugador activo
      let searchIndex = (gameState.currentPlayerIndex + 1) % updatedPlayers.length;
      let iterations = 0;
      
      while (iterations < updatedPlayers.length) {
        const nextPlayer = updatedPlayers[searchIndex];
        if (!nextPlayer.isEliminated && !nextPlayer.hasPassedThisRound) {
          nextPlayerIndex = searchIndex;
          break;
        }
        searchIndex = (searchIndex + 1) % updatedPlayers.length;
        iterations++;
      }
    }

    const newState = { 
      ...gameState, 
      players: updatedPlayers,
      currentPlayerIndex: nextPlayerIndex,
    };

    // Verificar si la ronda terminó: todas las opciones respondidas
    if (gameState.answeredOptionsInRound.size === gameState.currentQuestion?.opciones.length) {
      newState.status = 'roundEnd' as const;
    }
    // Si todos están eliminados/rendidos Y aún quedan opciones, también terminar
    else if (activePlayers.length === 0 && gameState.answeredOptionsInRound.size < (gameState.currentQuestion?.opciones.length || 0)) {
      newState.status = 'roundEnd' as const;
    }

    setGameState(newState);
    saveGameState(newState);
  };

  const handlePlayerReactivated = (playerId: string) => {
    const playerIndex = gameState.players.findIndex(p => p.id === playerId);
    const player = gameState.players[playerIndex];
    
    if (!player) return;

    // Reactivar jugador (quitar estado de eliminado/plantado)
    const updatedPlayers = gameState.players.map((p, idx) => {
      if (idx === playerIndex) {
        return { ...p, isEliminated: false, hasPassedThisRound: false };
      }
      return p;
    });

    const newState = { 
      ...gameState, 
      players: updatedPlayers,
    };

    setGameState(newState);
    saveGameState(newState);
  };

  const handleSkipQuestion = () => {
    // Generar nueva pregunta sin penalización
    const newState = {
      ...gameState,
      currentQuestion: getRandomQuestion(questions),
      answeredOptionsInRound: new Set<number>(),
    };

    setGameState(newState);
    saveGameState(newState);
  };

  const handleNextRound = () => {
    const updatedPlayers = gameState.players.map((p) => ({
      ...p,
      // Solo sumar puntos si el jugador NO fue eliminado
      score: p.isEliminated ? p.score : p.score + p.roundScore,
      roundScore: 0,
      hasPassedThisRound: false,
      isEliminated: false, // Reiniciar estado de eliminación para nueva ronda
    }));

    // Verificar si hay ganador
    const winner = updatedPlayers.find((p) => p.score >= gameState.pointsToWin);

    if (winner) {
      const newState = {
        ...gameState,
        players: updatedPlayers,
        status: 'gameEnd' as const,
        winner,
      };
      setGameState(newState);
      localStorage.removeItem('smart10_game_state');
      gameStorageService.deleteGame();
      return;
    }

    const newState = {
      ...gameState,
      players: updatedPlayers,
      currentRound: gameState.currentRound + 1,
      currentQuestion: getRandomQuestion(questions),
      status: 'playing' as const,
      answeredOptionsInRound: new Set<number>(),
      currentPlayerIndex: 0,
    };

    setGameState(newState);
    saveGameState(newState);
  };

  const handleBackToMenu = () => {
    setGameState({
      status: 'menu',
      players: [],
      pointsToWin: 10,
      currentQuestion: null,
      currentRound: 1,
      answeredOptionsInRound: new Set(),
      currentPlayerIndex: 0,
      winner: null,
    });
    gameStorageService.deleteGame();
  };

  return (
    <div className="app">
      {gameState.status !== 'menu' && (
        <ExitButton onExit={handleBackToMenu} />
      )}

      {gameState.status === 'menu' && (
        <MainMenu
          onNewGame={handleNewGame}
          onContinueGame={handleContinueGame}
          canContinue={!!savedGameState}
        />
      )}

      {gameState.status === 'playerSetup' && (
        <PlayerSelection onPlayersSelected={handlePlayersSelected} />
      )}

      {gameState.status === 'pointsSetup' && (
        <PointsSetup players={gameState.players} onPointsSelected={handlePointsSelected} />
      )}

      {gameState.status === 'playing' && gameState.currentQuestion && (
        <QuestionDisplay
          question={gameState.currentQuestion}
          players={gameState.players}
          onOptionSelected={handleOptionSelected}
          onPlayerAction={handlePlayerAction}
          onPlayerEliminated={handlePlayerEliminated}
          onPlayerReactivated={handlePlayerReactivated}
          onSkipQuestion={handleSkipQuestion}
          currentRound={gameState.currentRound}
          currentPlayerIndex={gameState.currentPlayerIndex}
          answeredOptions={gameState.answeredOptionsInRound}
        />
      )}

      {gameState.status === 'roundEnd' && (
        <RoundEnd
          players={gameState.players}
          currentRound={gameState.currentRound}
          onNextRound={handleNextRound}
        />
      )}

      {gameState.status === 'gameEnd' && gameState.winner && (
        <GameEnd
          winner={gameState.winner}
          players={gameState.players}
          onBackToMenu={handleBackToMenu}
        />
      )}
    </div>
  );
}

export default App;
