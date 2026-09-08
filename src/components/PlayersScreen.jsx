import React, { useState } from 'react';
import { X, Edit2, Plus, Check, Trash2 } from 'lucide-react';

export default function PlayersScreen({ players, setPlayers, onBack }) {
  const [editingIdx, setEditingIdx] = useState(null);
  const [editValue, setEditValue] = useState("");

  const handleStartEdit = (idx) => {
    setEditingIdx(idx);
    setEditValue(players[idx]);
  };

  const handleSaveEdit = (idx) => {
    if (editValue.trim() !== "") {
      const newPlayers = [...players];
      newPlayers[idx] = editValue.trim();
      setPlayers(newPlayers);
    }
    setEditingIdx(null);
  };

  const handleDelete = (idx) => {
    if (players.length <= 2) return; // Minimum 2 players
    setPlayers(players.filter((_, i) => i !== idx));
  };

  const handleAdd = () => {
    setPlayers([...players, `Player ${players.length + 1}`]);
  };

  const handleDone = () => {
    // If editing, save first
    if (editingIdx !== null) handleSaveEdit(editingIdx);
    onBack();
  };

  const handleReset = () => {
    setPlayers(['Player 1', 'Player 2', 'Player 3']);
    setEditingIdx(null);
  };

  return (
    <div className="flex-col" style={{ flex: 1, gap: '16px' }}>
      <div className="flex-row align-center justify-center" style={{ position: 'relative', marginBottom: '10px' }}>
        <button onClick={onBack} className="btn-icon" style={{ position: 'absolute', left: 0 }}>
          <X size={20} />
        </button>
        <h2 style={{ fontSize: '18px' }}>Players</h2>
        <button onClick={handleDone} className="btn-icon" style={{ position: 'absolute', right: 0, color: 'var(--primary-blue)', fontWeight: 700, fontSize: '14px', borderRadius: '8px', padding: '6px 14px' }}>
          Done
        </button>
      </div>

      <div className="flex-col" style={{ gap: '8px' }}>
        {players.map((p, idx) => (
          <div key={idx} className="list-item" style={{ padding: '14px 16px' }}>
            {editingIdx === idx ? (
              <input 
                autoFocus
                type="text" 
                value={editValue} 
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={() => handleSaveEdit(idx)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveEdit(idx);
                }}
                style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  border: '1px solid var(--primary-blue)',
                  borderRadius: '8px',
                  padding: '8px',
                  width: '70%',
                  background: 'transparent',
                  color: 'var(--text-dark)',
                  outline: 'none'
                }}
              />
            ) : (
              <span style={{ fontWeight: 500 }}>{p}</span>
            )}
            
            <div className="flex-row align-center" style={{ gap: '8px' }}>
              {editingIdx === idx ? (
                <button className="btn-icon" onClick={() => handleSaveEdit(idx)} style={{ border: 'none', boxShadow: 'none' }}>
                  <Check size={18} color="var(--primary-blue)" />
                </button>
              ) : (
                <>
                  <button className="btn-icon" onClick={() => handleStartEdit(idx)} style={{ border: 'none', boxShadow: 'none' }}>
                    <Edit2 size={16} color="var(--text-gray)" />
                  </button>
                  {players.length > 2 && (
                    <button className="btn-icon" onClick={() => handleDelete(idx)} style={{ border: 'none', boxShadow: 'none' }}>
                      <Trash2 size={16} color="var(--primary-red)" />
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex-col align-center" style={{ gap: '12px', marginTop: '8px' }}>
        <button className="btn-primary" onClick={handleAdd} style={{ padding: '12px 28px', fontSize: '14px' }}>
          <Plus size={16} /> Add Player
        </button>
        <button 
          onClick={handleReset} 
          style={{ 
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-gray)', fontSize: '13px', fontWeight: 500,
            padding: '8px 16px', borderRadius: '8px',
            transition: 'color 0.15s ease'
          }}
        >
          Reset to defaults
        </button>
      </div>
    </div>
  );
}
