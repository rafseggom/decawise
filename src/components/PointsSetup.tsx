import React from 'react';
import type { Player } from '../types';
import '../styles/components/PointsSetup.css';

interface PointsSetupProps {
  players: Player[];
  onPointsSelected: (points: number) => void;
}

const PointsSetup: React.FC<PointsSetupProps> = ({ players, onPointsSelected }) => {
  const [selectedPoints, setSelectedPoints] = React.useState(10);

  return (
    <div className="points-setup">
      <div className="setup-container">
        <h2>Puntos para Ganar</h2>
        <p className="info-text">Elige cuántos puntos necesita un jugador para ganar la partida</p>

        <div className="points-options">
          {[5, 10, 15, 20, 25, 30].map((points) => (
            <button
              key={points}
              className={`points-btn ${selectedPoints === points ? 'active' : ''}`}
              onClick={() => setSelectedPoints(points)}
            >
              {points}
            </button>
          ))}
        </div>

        <div className="players-preview">
          <h3>Jugadores:</h3>
          <div className="players-grid">
            {players.map((player) => (
              <div key={player.id} className="player-preview">
                <div className={`shape ${player.shape}`}></div>
              </div>
            ))}
          </div>
        </div>

        <button className="btn-start" onClick={() => onPointsSelected(selectedPoints)}>
          Comenzar Partida
        </button>
      </div>
    </div>
  );
};

export default PointsSetup;
