import React from 'react';
import type { Player } from '../types';
import '../styles/components/GameEnd.css';

interface GameEndProps {
  winner: Player;
  players: Player[];
  onBackToMenu: () => void;
}

const GameEnd: React.FC<GameEndProps> = ({ winner, players, onBackToMenu }) => {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="game-end">
      <div className="game-end-container">
        <h1>Partida Finalizada</h1>

        <div className="winner-section">
          <h2>Ganador</h2>
          <div className={`winner-badge ${winner.shape}`}>
            <div className="shape"></div>
            <p className="winner-score">{winner.score} puntos</p>
          </div>
        </div>

        <div className="final-standings">
          <h3>Clasificación Final</h3>
          <div className="standings-list">
            {sortedPlayers.map((player, idx) => (
              <div key={player.id} className={`final-standing rank-${idx + 1}`}>
                <span className="rank">#{idx + 1}</span>
                <div className={`shape ${player.shape}`}></div>
                <span className="score">{player.score} pts</span>
              </div>
            ))}
          </div>
        </div>

        <button className="btn-menu" onClick={onBackToMenu}>
          Volver al Menú
        </button>
      </div>
    </div>
  );
};

export default GameEnd;
