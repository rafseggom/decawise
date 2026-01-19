import React, { useState } from 'react';
import '../styles/components/MainMenu.css';

interface MainMenuProps {
  onNewGame: () => void;
  onContinueGame: () => void;
  canContinue: boolean;
}

const MainMenu: React.FC<MainMenuProps> = ({ onNewGame, onContinueGame, canContinue }) => {
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const logoPath = `${import.meta.env.BASE_URL}logo.png`;

  return (
    <div className="main-menu">
      <div className="menu-container">
        <div className="menu-header">
          <img src={logoPath} alt="DecaWise Logo" className="menu-logo" />
          <h1 className="menu-title">DecaWise</h1>
          <img src={logoPath} alt="DecaWise Logo" className="menu-logo" />
        </div>
        
        <div className="menu-buttons">
          <button className="menu-button primary" onClick={onNewGame}>
            Iniciar Partida
          </button>
          <button
            className="menu-button secondary"
            onClick={onContinueGame}
            disabled={!canContinue}
          >
            Continuar Partida
          </button>
          <button 
            className="menu-button info"
            onClick={() => setShowHowToPlay(true)}
          >
            ¿Cómo jugar?
          </button>
        </div>

        <div className="menu-footer">
          <div className="version">v0.0.0</div>
          <div className="github-links">
            <a 
              href="https://github.com/rafseggom" 
              target="_blank" 
              rel="noopener noreferrer"
              className="github-link"
              title="Perfil de GitHub"
            >
              <svg viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
              </svg>
              @rafseggom
            </a>
            <a 
              href="https://github.com/rafseggom/decawise" 
              target="_blank" 
              rel="noopener noreferrer"
              className="github-link"
              title="Repositorio en GitHub"
            >
              <svg viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
                <path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z"></path>
              </svg>
              Repositorio
            </a>
          </div>
        </div>
      </div>

      {showHowToPlay && (
        <div className="modal-overlay" onClick={() => setShowHowToPlay(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowHowToPlay(false)}>
              ✕
            </button>
            <h2>¿Cómo jugar?</h2>
            <div className="modal-body">
              <section>
                <h3>🎯 Objetivo</h3>
                <p>Ser el primer jugador en alcanzar el número de puntos establecido.</p>
              </section>

              <section>
                <h3>🎮 Tu Turno</h3>
                <ol>
                  <li><strong>Di en voz alta</strong> qué opción crees correcta</li>
                  <li><strong>Haz clic en la tarjeta</strong> para revelarla</li>
                  <li>Si <strong>aciertas</strong>: ganas 1 punto y sigues jugando</li>
                  <li>Si <strong>fallas</strong>: haz clic en tu nombre para eliminarte</li>
                </ol>
              </section>

              <section>
                <h3>✋ Plantarse</h3>
                <p>Haz clic en tu nombre para <strong>plantarte</strong> y conservar tus puntos de la ronda.</p>
              </section>

              <section>
                <h3>🔄 Reactivación</h3>
                <p>Si te has plantado o eliminado, haz clic en tu nombre para volver a jugar.</p>
              </section>

              <section>
                <h3>🏆 Fin de Ronda</h3>
                <p>Solo los jugadores <strong>no eliminados</strong> suman sus puntos al total.</p>
              </section>

              <section>
                <h3>🎲 Tipos de Preguntas</h3>
                <ul>
                  <li><strong>VERDADERO/FALSO</strong>: Determina si es correcto</li>
                  <li><strong>ORDENAR</strong>: Ordena del 1 al 10</li>
                  <li><strong>NÚMERO</strong>: Indica valores numéricos</li>
                  <li><strong>TEXTO</strong>: Relaciona opciones con respuestas</li>
                </ul>
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainMenu;