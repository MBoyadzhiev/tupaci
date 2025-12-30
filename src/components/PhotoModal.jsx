import './PhotoModal.css';

export function PhotoModal({ player, isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="photo-modal-overlay" onClick={onClose}>
      <div className="photo-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="photo-modal-close" onClick={onClose}>×</button>
        <img 
          src={player.photo} 
          alt={player.name}
          className="photo-modal-image"
          onError={(e) => {
            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(player.name)}&background=667eea&color=fff&size=200`;
          }}
        />
        <div className="photo-modal-name">{player.name}</div>
      </div>
    </div>
  );
}

