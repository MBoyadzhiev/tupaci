import { useState } from 'react';
import { PhotoModal } from './PhotoModal';
import './Standings.css';

export function Standings({ standings }) {
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const handlePhotoClick = (player) => {
    setSelectedPlayer(player);
  };

  const handleCloseModal = () => {
    setSelectedPlayer(null);
  };

  return (
    <>
      <div className="standings">
        <h2 className="standings-title">Класиране</h2>
        <div className="standings-list">
          {standings.map((player, index) => (
            <div key={player.id} className="standings-item">
              <div className="standings-rank">{index + 1}.</div>
              <div 
                className="standings-photo"
                onClick={() => handlePhotoClick(player)}
                style={{ cursor: 'pointer' }}
              >
                <img 
                  src={player.photo} 
                  alt={player.name}
                  onError={(e) => {
                    // Fallback to placeholder if image doesn't exist
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(player.name)}&background=667eea&color=fff&size=40`;
                  }}
                />
              </div>
              <div className="standings-name">{player.name}</div>
              <div className="standings-score">
                {player.totalScore} точки
                {player.matchPoints > 0 && (
                  <span className="match-points"> (+{player.matchPoints})</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <PhotoModal 
        player={selectedPlayer} 
        isOpen={!!selectedPlayer} 
        onClose={handleCloseModal} 
      />
    </>
  );
}

