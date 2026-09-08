import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, XCircle } from 'lucide-react';

export default function RevealScreen({ game, onFinishReveal, onQuit }) {
  const [currentPlayerIdx, setCurrentPlayerIdx] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [hasViewed, setHasViewed] = useState(false);
  const [showQuit, setShowQuit] = useState(false);

  const players = game.players;
  const currentPlayer = players[currentPlayerIdx];
  const isLastPlayer = currentPlayerIdx === players.length - 1;

  // Auto-hide logic
  useEffect(() => {
    let timer;
    if (isRevealed) {
      setHasViewed(true);
      timer = setTimeout(() => {
        setIsRevealed(false);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [isRevealed]);

  const handleNext = () => {
    // Strictly hide the card before moving to the next player
    setIsRevealed(false);
    
    // Use a tiny timeout to let the hide take effect before changing state,
    // though React handles state batching, a timeout ensures no flickering of old data on the new card.
    setTimeout(() => {
      if (isLastPlayer) {
        onFinishReveal();
      } else {
        setCurrentPlayerIdx(prev => prev + 1);
        setHasViewed(false);
      }
    }, 50);
  };

  const handleTapCard = () => {
    setIsRevealed(!isRevealed);
  };

  return (
    <div className="flex-col" style={{ flex: 1, position: 'relative' }}>
      <div className="flex-row space-between align-center" style={{ marginBottom: '40px' }}>
        <div className="flex-row align-center" style={{ gap: '8px', fontSize: '14px', fontWeight: 600 }}>
          Guess the Imposter
        </div>
        <button className="btn-icon" onClick={() => setShowQuit(true)}>
          <X size={20} />
        </button>
      </div>

      {/* Progress Indicator */}
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <div style={{ fontSize: '13px', color: 'var(--text-gray)', fontWeight: 500 }}>
          Player {currentPlayerIdx + 1} of {players.length}
        </div>
        <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', marginTop: '8px' }}>
          {players.map((_, i) => (
            <div key={i} style={{
              width: i === currentPlayerIdx ? '24px' : '8px',
              height: '8px',
              borderRadius: '4px',
              backgroundColor: i < currentPlayerIdx ? 'var(--primary-blue)' : i === currentPlayerIdx ? '#000000' : 'var(--card-border)',
              transition: 'all 0.3s ease'
            }} />
          ))}
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        
        {/* The Card */}
        <div 
          onClick={handleTapCard}
          style={{
            background: '#000000',
            color: 'white',
            borderRadius: '20px',
            width: '240px',
            height: '320px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
            // Mathematically slide up by 100px for a massive 120px overlap
            transform: isRevealed ? 'translateY(-100px) scale(1)' : 'translateY(0) scale(1)',
            transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
            position: 'absolute',
            zIndex: 2,
          }}
        >
          <img src="/hero_card.png" alt="Spy" style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '12px', marginBottom: '16px' }} />
          <h2 style={{ fontSize: '24px', margin: 0 }}>{currentPlayer.name}</h2>
          <p style={{ fontSize: '14px', opacity: 0.8, marginTop: '8px' }}>
            {isRevealed ? 'Tap to hide' : 'Tap to reveal'}
          </p>
        </div>

        {/* The Secret Word (Underneath the card) */}
        <div style={{
          width: '240px',
          height: '320px',
          background: 'var(--bg-color-light)',
          border: '1px solid var(--card-border)',
          borderRadius: '20px',
          padding: '120px 24px 24px 24px', // 120px top padding matches the exact overlap distance
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center', // Now it perfectly centers in the remaining un-overlapped space!
          opacity: isRevealed ? 1 : 0,
          // Slide down by 100px for a 120px overlap
          transform: isRevealed ? 'translateY(100px)' : 'translateY(0)',
          transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s ease',
          position: 'absolute',
          zIndex: 1,
          boxShadow: 'var(--card-shadow)'
        }}>
          {currentPlayer.is_imposter ? (
            <>
              <XCircle size={32} color="var(--primary-red)" style={{marginBottom: '12px'}} />
              <h3 style={{ fontSize: '18px', textAlign: 'center', color: 'var(--text-gray)' }}>Imposter</h3>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--primary-red)', margin: '8px 0', textAlign: 'center' }}>
                {game.imposter_hint}
              </div>
              <p style={{ fontSize: '12px', textAlign: 'center', color: 'var(--text-gray)', marginTop: '8px' }}>
                Blend in with the others.
              </p>
            </>
          ) : (
            <>
              <CheckCircle2 size={32} color="var(--primary-blue)" style={{marginBottom: '12px'}} />
              <h3 style={{ fontSize: '18px', textAlign: 'center', color: 'var(--text-gray)' }}>The word is</h3>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--primary-blue)', margin: '8px 0' }}>
                {game.secret_word}
              </div>
              <p style={{ fontSize: '12px', textAlign: 'center', color: 'var(--text-gray)', marginTop: '8px' }}>
                Make sure no one else sees it.
              </p>
            </>
          )}
        </div>
      </div>

      <div className="flex-col align-center" style={{ paddingTop: '16px' }}>
        <button 
          className="btn-primary" 
          onClick={handleNext}
          disabled={!hasViewed || isRevealed} 
          style={{ width: '100%', padding: '16px', fontSize: '16px' }}
        >
          {isLastPlayer ? 'Start Discussion' : 'Next Player'}
        </button>
        <p style={{ fontSize: '12px', color: 'var(--text-gray)', marginTop: '12px', textAlign: 'center', height: '14px' }}>
          {isRevealed 
            ? "Auto-hiding in 3s. Or tap to hide." 
            : (!hasViewed ? "Tap the card to view your role." : (isLastPlayer ? "All done! Time to discuss." : "Pass phone to the next player."))}
        </p>
      </div>

      {/* Quit Modal */}
      {showQuit && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'fadeIn 0.2s ease'
        }}>
          <div className="card flex-col align-center" style={{ width: '80%', maxWidth: '400px', padding: '24px', animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}>
            <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>Quit Game?</h3>
            <p style={{ color: 'var(--text-gray)', textAlign: 'center', fontSize: '14px', marginBottom: '24px' }}>
              Are you sure you want to end the game and go back to setup?
            </p>
            <div className="flex-row space-between" style={{ width: '100%', gap: '12px' }}>
              <button 
                onClick={() => setShowQuit(false)} 
                style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid var(--card-border)', background: 'transparent', fontWeight: 600 }}
              >
                Cancel
              </button>
              <button 
                onClick={onQuit} 
                style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', background: 'var(--primary-red)', color: 'white', fontWeight: 600 }}
              >
                Quit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
