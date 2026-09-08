import React from 'react';
import { X, Check } from 'lucide-react';

export default function DifficultyScreen({ difficulty, setDifficulty, onBack }) {
  const difficulties = [
    { id: 'easy', label: 'Easy', desc: 'Universally known words. Fun and casual.' },
    { id: 'medium', label: 'Medium', desc: 'Specific but recognizable words.' },
    { id: 'hard', label: 'Hard', desc: 'Obscure, difficult concepts. Big brain mode.' },
  ];

  const handleSelect = (id) => {
    setDifficulty(id);
  };

  const handleDone = () => {
    onBack();
  };

  return (
    <div className="flex-col" style={{ flex: 1, gap: '16px' }}>
      <div className="flex-row align-center justify-center" style={{ position: 'relative', marginBottom: '20px' }}>
        <button onClick={onBack} className="btn-icon" style={{ position: 'absolute', left: 0 }}>
          <X size={20} />
        </button>
        <h2 style={{ fontSize: '18px' }}>Difficulty Level</h2>
        <button onClick={handleDone} className="btn-icon" style={{ position: 'absolute', right: 0, color: 'var(--primary-blue)', fontWeight: 700, fontSize: '14px', borderRadius: '8px', padding: '6px 14px' }}>
          Done
        </button>
      </div>

      <div className="flex-col" style={{ gap: '12px' }}>
        {difficulties.map(diff => (
          <div 
            key={diff.id} 
            className="list-item" 
            onClick={() => handleSelect(diff.id)}
            style={{ 
              cursor: 'pointer', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'flex-start',
              border: difficulty === diff.id ? '2px solid var(--primary-blue)' : '2px solid transparent'
            }}
          >
            <div className="flex-row space-between align-center" style={{ width: '100%' }}>
              <span style={{ fontWeight: 600, fontSize: '18px', textTransform: 'capitalize' }}>
                {diff.label}
              </span>
              {difficulty === diff.id && <Check size={20} color="var(--primary-blue)" />}
            </div>
            <p style={{ margin: 0, marginTop: '8px', fontSize: '12px', color: 'var(--text-gray)' }}>
              {diff.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
