import React from 'react';
import '../styles/components/ExitButton.css';

interface ExitButtonProps {
  onExit: () => void;
}

const ExitButton: React.FC<ExitButtonProps> = ({ onExit }) => {
  return (
    <button className="exit-button" onClick={onExit} title="Volver al menú">
      ✕
    </button>
  );
};

export default ExitButton;
