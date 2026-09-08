import React from 'react';
import { X, CheckCircle2, Circle } from 'lucide-react';

export default function ImpostersScreen({ imposterCount, setImposterCount, maxImposters, onBack }) {
  // Generate options up to either 3 (for visual feedback when disabled) or maxImposters
  const listLength = Math.max(3, maxImposters);
  const options = Array.from({ length: listLength }, (_, i) => i + 1);

  const handleDone = () => {
    onBack();
  };

  return (
    <div className="flex-col" style={{ flex: 1, gap: '16px' }}>
      <div className="flex-row align-center justify-center" style={{ position: 'relative', marginBottom: '20px' }}>
        <button onClick={onBack} className="btn-icon" style={{ position: 'absolute', left: 0 }}>
          <X size={20} />
        </button>
        <h2 style={{ fontSize: '18px' }}>Imposters</h2>
        <button onClick={handleDone} className="btn-icon" style={{ position: 'absolute', right: 0, color: 'var(--primary-blue)', fontWeight: 700, fontSize: '14px', borderRadius: '8px', padding: '6px 14px' }}>
          Done
        </button>
      </div>

      <div className="flex-col">
        {options.map((num) => {
          const isSelected = num === imposterCount;
          const isDisabled = num > maxImposters;
          
          return (
            <div 
              key={num} 
              className="list-item" 
              onClick={() => !isDisabled && setImposterCount(num)}
              style={{ cursor: isDisabled ? 'not-allowed' : 'pointer', opacity: isDisabled ? 0.3 : 1, padding: '20px 0' }}
            >
              <div className="flex-row align-center" style={{ gap: '12px' }}>
                <div style={{
                  backgroundColor: '#eef2f5', 
                  color: 'var(--text-gray)',
                  fontWeight: 'bold',
                  width: '24px', height: '24px', 
                  borderRadius: '4px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '12px'
                }}>
                  {num}
                </div>
                <span>{num} {num === 1 ? 'Imposter' : 'Imposters'}</span>
              </div>
              {isSelected ? (
                <CheckCircle2 size={24} color="var(--primary-blue)" fill="var(--primary-blue)" stroke="white" />
              ) : (
                <Circle size={24} color="var(--card-border)" />
              )}
            </div>
          );
        })}
      </div>

      <p className="text-center mt-4" style={{ fontSize: '12px', color: 'var(--text-gray)' }}>
        Choose how many imposters will sneak in. The max depends on the number of players.
      </p>
    </div>
  );
}
