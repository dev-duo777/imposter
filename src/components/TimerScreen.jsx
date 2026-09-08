import React, { useState } from 'react';
import { Check, X } from 'lucide-react';

export default function TimerScreen({ timeConfig, setTimeConfig, onBack }) {
  // Local draft state — changes only commit when user hits "Done"
  const [draft, setDraft] = useState({ ...timeConfig });
  const [customValue, setCustomValue] = useState('');

  const handleDone = () => {
    setTimeConfig(draft);
    onBack();
  };

  const handleCustomPerPerson = (e) => {
    e.preventDefault();
    const val = parseInt(customValue);
    if (!isNaN(val) && val > 0) {
      setDraft({ type: 'per_person', value: val, rounds: draft.rounds || 1 });
      setCustomValue('');
    }
  };

  return (
    <div className="flex-col" style={{ flex: 1, gap: '16px', overflowY: 'auto', paddingBottom: '24px' }}>
      <div className="flex-row align-center justify-center" style={{ position: 'relative', marginBottom: '10px' }}>
        <button onClick={onBack} className="btn-icon" style={{ position: 'absolute', left: 0 }}>
          <X size={20} />
        </button>
        <h2 style={{ fontSize: '18px' }}>Timer Settings</h2>
        <button onClick={handleDone} className="btn-icon" style={{ position: 'absolute', right: 0, color: 'var(--primary-blue)', fontWeight: 700, fontSize: '14px', borderRadius: '8px', padding: '6px 14px' }}>
          Done
        </button>
      </div>

      {/* Per Person Options */}
      <div>
        <h3 style={{ fontSize: '14px', color: 'var(--text-gray)', marginBottom: '8px' }}>Per Person Time Limit</h3>
        <div className="flex-col" style={{ gap: '8px' }}>
          {[10, 20, 30].map(secs => (
            <div 
              key={`pp-${secs}`} 
              className="list-item" 
              onClick={() => setDraft({ ...draft, type: 'per_person', value: secs, rounds: draft.rounds || 1 })}
              style={{ cursor: 'pointer', border: draft.type === 'per_person' && draft.value === secs ? '2px solid var(--primary-blue)' : '2px solid transparent' }}
            >
              <span style={{ fontWeight: 600 }}>{secs} Seconds</span>
              {draft.type === 'per_person' && draft.value === secs && <Check size={20} color="var(--primary-blue)" />}
            </div>
          ))}
          <form onSubmit={handleCustomPerPerson} className="list-item flex-row space-between">
             <input 
               type="number" 
               placeholder="Custom (sec)" 
               value={customValue}
               onChange={e => setCustomValue(e.target.value)}
               style={{ border: 'none', outline: 'none', background: 'transparent', width: '100px', fontWeight: 600, color: 'var(--text-dark)' }}
             />
             <button type="submit" className="btn-primary" style={{ padding: '4px 12px', fontSize: '12px' }}>Set</button>
          </form>
        </div>
      </div>

      {draft.type === 'per_person' && (
        <div style={{ marginTop: '16px' }}>
          <h3 style={{ fontSize: '14px', color: 'var(--text-gray)', marginBottom: '8px' }}>How Many Rounds?</h3>
          <div className="flex-row" style={{ gap: '8px' }}>
            {[1, 2, 3].map(r => (
              <div 
                key={`r-${r}`} 
                className="list-item flex-row justify-center" 
                onClick={() => setDraft({ ...draft, rounds: r })}
                style={{ cursor: 'pointer', flex: 1, border: draft.rounds === r ? '2px solid var(--primary-blue)' : '2px solid transparent' }}
              >
                <span style={{ fontWeight: 600 }}>{r}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <hr style={{ border: 'none', borderTop: '1px solid var(--card-border)', margin: '16px 0' }} />
      
      <div 
        className="list-item justify-center" 
        onClick={() => setDraft({ type: 'none', value: 0, rounds: 1 })}
        style={{ cursor: 'pointer', border: draft.type === 'none' ? '2px solid var(--primary-red)' : '2px solid transparent', color: 'var(--primary-red)' }}
      >
        <span style={{ fontWeight: 600 }}>No Timer</span>
      </div>

    </div>
  );
}
