import React, { useState } from 'react';
import type { PlayerShape } from '../types';
import '../styles/components/PlayerSelection.css';

interface PlayerSelectionProps {
  onPlayersSelected: (numPlayers: number) => void;
}

const SHAPES: PlayerShape[] = ['triangle', 'circle', 'square', 'star'];
const SHAPE_LABELS: Record<PlayerShape, string> = {
  triangle: 'Triángulo',
  circle: 'Círculo',
  square: 'Cuadrado',
  star: 'Estrella',
};

const PlayerSelection: React.FC<PlayerSelectionProps> = ({ onPlayersSelected }) => {
  const [numPlayers, setNumPlayers] = useState(2);

  const handleContinue = () => {
    onPlayersSelected(numPlayers);
  };

  return (
    <div className="player-selection">
      <div className="selection-container">
        <h2>Número de Jugadores</h2>
        <div className="number-selector">
          <button
            onClick={() => setNumPlayers(Math.max(2, numPlayers - 1))}
            className="selector-btn"
          >
            −
          </button>
          <span className="number-display">{numPlayers}</span>
          <button
            onClick={() => setNumPlayers(Math.min(4, numPlayers + 1))}
            className="selector-btn"
          >
            +
          </button>
        </div>
        <p className="info-text">Se asignarán formas geométricas a cada jugador</p>
        <div className="shapes-preview">
          {Array.from({ length: numPlayers }).map((_, idx) => (
            <div key={idx} className="shape-item">
              <div className={`shape ${SHAPES[idx]}`}></div>
              <p>{SHAPE_LABELS[SHAPES[idx]]}</p>
            </div>
          ))}
        </div>
        <button className="btn-continue" onClick={handleContinue}>
          Continuar
        </button>
      </div>
    </div>
  );
};

export default PlayerSelection;