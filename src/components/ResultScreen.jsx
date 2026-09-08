import React from 'react';
import { X, XCircle } from 'lucide-react';
import api from '../api';

export default function ResultScreen({ game, onRestart }) {
  const imposters = game.players.filter(p => p.is_imposter);
  
  const handleRestart = () => {
    // Optionally call api to mark game finished
    api.post(`games/${game.id}/finish/`).catch(console.error);
    onRestart();
  };

  return (
    <div className="flex-col" style={{ flex: 1 }}>
      <div className="flex-row space-between align-center" style={{ marginBottom: '40px' }}>
        <div className="flex-row align-center" style={{ gap: '8px', fontSize: '14px', fontWeight: 600 }}>
          Guess the Imposter
        </div>
        <button className="btn-icon" onClick={handleRestart}>
          <X size={20} />
        </button>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '24px' }}>
        <XCircle size={80} color="var(--primary-red)" />
        <div style={{ fontSize: '14px', color: 'var(--text-gray)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '1px' }}>The Imposter</div>
        <h2 style={{ fontSize: '36px', textAlign: 'center', color: 'var(--primary-red)', fontWeight: 900 }}>
          {imposters.map(i => i.name).join(' & ')}
        </h2>
        
        <div className="card text-center" style={{ width: '100%', marginBottom: '16px' }}>
          <p style={{ color: 'var(--text-gray)', fontSize: '14px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>The Secret Word was</p>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--primary-blue)', marginBottom: '24px' }}>{game.secret_word}</p>
          
          <p style={{ color: 'var(--text-gray)', fontSize: '14px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>The Imposter's Hint was</p>
          <p style={{ fontSize: '24px', fontWeight: '800', color: 'var(--secondary-yellow)' }}>{game.imposter_hint}</p>
        </div>

        <button className="btn-primary" onClick={handleRestart} style={{ width: '100%', padding: '18px', fontSize: '18px', fontWeight: 700 }}>
          Play Again
        </button>
      </div>
    </div>
  );
}
