import React from 'react';
import type { Question, Player } from '../types';
import '../styles/components/QuestionDisplay.css';

interface QuestionDisplayProps {
  question: Question;
  players: Player[];
  onOptionSelected: (optionIndex: number, playerId: string) => void;
  onPlayerAction: (playerId: string) => void;
  onPlayerEliminated: (playerId: string) => void;
  onPlayerReactivated: (playerId: string) => void;
  currentRound: number;
  currentPlayerIndex: number;
  answeredOptions: Set<number>;
}

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  question,
  players,
  onOptionSelected,
  onPlayerAction,
  onPlayerEliminated,
  onPlayerReactivated,
  currentRound,
  currentPlayerIndex,
  answeredOptions,
}) => {
  const currentPlayer = players[currentPlayerIndex];
  
  const activePlayerCount = players.filter(
    (p) => !p.isEliminated && !p.hasPassedThisRound
  ).length;

  const handleOptionClick = (optionIndex: number) => {
    // No permitir clickar opciones ya respondidas
    if (answeredOptions.has(optionIndex)) return;
    
    // Solo el jugador actual puede responder
    if (currentPlayer.isEliminated || currentPlayer.hasPassedThisRound) return;

    // Simplemente marcar como respondida - el jugador suma puntos
    onOptionSelected(optionIndex, currentPlayer.id);
  };

  const handlePlayerClick = (playerId: string) => {
    const playerIndex = players.findIndex(p => p.id === playerId);
    const player = players[playerIndex];
    
    if (!player) return;

    // Si el jugador ya está plantado o eliminado, reactivarlo
    if (player.hasPassedThisRound || player.isEliminated) {
      onPlayerReactivated(playerId);
      return;
    }

    // Si es mi turno → me planto
    if (playerIndex === currentPlayerIndex) {
      onPlayerAction(playerId); // Plantarse
    } else {
      // Si NO es mi turno → me he equivocado, me elimino
      onPlayerEliminated(playerId);
    }
  };

  return (
    <div className="question-display">
      {/* Indicador de turno actual */}
      <div className="turn-indicator">
        <div className={`turn-player ${currentPlayer.shape}`}>
          <div className={`shape ${currentPlayer.shape}`} style={{ width: '35px', height: '35px' }}></div>
          <span>Turno de {currentPlayer.name}</span>
        </div>
      </div>

      {/* Contenedor principal */}
      <div className="game-container">
        {/* 5 opciones superiores */}
        <div className="options-row options-top">
          {question.opciones.slice(0, 5).map((option, idx) => {
            const isRevealed = answeredOptions.has(idx);
            
            return (
              <button
                key={idx}
                className={`option-card ${isRevealed ? 'revealed' : 'hidden'}`}
                onClick={() => handleOptionClick(idx)}
                disabled={isRevealed}
              >
                {isRevealed ? (
                  <div className="option-content revealed-content">
                    <span className="option-label">{option.texto}</span>
                    <span className="option-divider">→</span>
                    <span className="option-answer">{String(option.valor)}</span>
                  </div>
                ) : (
                  <div className="option-content">
                    <span className="option-text">{option.texto}</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Pregunta central */}
        <div className="question-center">
          <div className="question-tema">{question.tema}</div>
          <div className="question-text-center">{question.pregunta}</div>
          <div className="question-type">{question.tipo}</div>
        </div>

        {/* 5 opciones inferiores */}
        <div className="options-row options-bottom">
          {question.opciones.slice(5, 10).map((option, idx) => {
            const actualIdx = idx + 5;
            const isRevealed = answeredOptions.has(actualIdx);
            
            return (
              <button
                key={actualIdx}
                className={`option-card ${isRevealed ? 'revealed' : 'hidden'}`}
                onClick={() => handleOptionClick(actualIdx)}
                disabled={isRevealed}
              >
                {isRevealed ? (
                  <div className="option-content revealed-content">
                    <span className="option-label">{option.texto}</span>
                    <span className="option-divider">→</span>
                    <span className="option-answer">{String(option.valor)}</span>
                  </div>
                ) : (
                  <div className="option-content">
                    <span className="option-text">{option.texto}</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Panel de jugadores */}
      <div className="player-panel">
        <h3>Jugadores</h3>
        <div className="players-grid">
          {players.map((player, idx) => (
            <div
              key={player.id}
              className={`player-card ${player.shape} ${
                player.isEliminated ? 'eliminated' : ''
              } ${player.hasPassedThisRound ? 'passed' : ''} ${
                idx === currentPlayerIndex ? 'current' : ''
              }`}
              onClick={() => handlePlayerClick(player.id)}
              style={{ cursor: 'pointer' }}
              title={
                player.isEliminated || player.hasPassedThisRound
                  ? 'Click para reactivar'
                  : idx === currentPlayerIndex
                  ? 'Click para plantarte'
                  : 'Click si has fallado'
              }
            >
              <div className={`shape ${player.shape}`} style={{ width: '40px', height: '40px' }}></div>
              <div className="player-info">
                <span className="player-score">
                  R: {player.roundScore} | T: {player.score}
                </span>
              </div>
              {player.isEliminated && <div className="player-status">✗</div>}
              {player.hasPassedThisRound && !player.isEliminated && (
                <div className="player-status">✓</div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="round-info">
        <span>Ronda {currentRound}</span>
        <span>Activos: {activePlayerCount}/{players.length}</span>
      </div>
    </div>
  );
};

export default QuestionDisplay;