import React from 'react';
import type { Player } from '../types';
import '../styles/components/RoundEnd.css';

interface RoundEndProps {
  players: Player[];
  currentRound: number;
  onNextRound: () => void;
}

const RoundEnd: React.FC<RoundEndProps> = ({ players, currentRound, onNextRound }) => {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="round-end">
      <div className="round-end-container">
        <h2>Fin de la Ronda {currentRound}</h2>

        <div className="standings">
          <h3>Puntuación de la Ronda</h3>
          <div className="standings-list">
            {sortedPlayers.map((player, idx) => (
              <div key={player.id} className={`standing-item rank-${idx + 1} ${player.isEliminated ? 'eliminated' : ''}`}>
                <span className="rank">#{idx + 1}</span>
                <div className={`shape ${player.shape}`}></div>
                <div className="player-scores">
                  <span className="round-points">+{player.isEliminated ? 0 : player.roundScore} pts</span>
                  <span className="total-points">Total: {player.score}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button className="btn-next" onClick={onNextRound}>
          Siguiente Ronda
        </button>
      </div>
    </div>
  );
};

export default RoundEnd;
