import React, { useState, useEffect } from 'react';
import { X, HelpCircle, User, FastForward } from 'lucide-react';

export default function DiscussionScreen({ timeConfig, players, onReveal, onQuit }) {
  const [showQuit, setShowQuit] = useState(false);
  // Timer state
  const [timeLeft, setTimeLeft] = useState(null);
  const [timerStatus, setTimerStatus] = useState('idle'); // idle, running, ended, all_done
  
  // Pick a random starting player to keep the game fair and unpredictable
  const [startIndex] = useState(() => Math.floor(Math.random() * players.length));
  
  // Turn state (how many turns have passed)
  const [turnCount, setTurnCount] = useState(0);

  // Configuration
  const hasTimer = timeConfig && timeConfig.type !== 'none';
  const totalTurns = hasTimer ? players.length * (timeConfig.rounds || 1) : 1;
  const currentRound = hasTimer ? Math.floor(turnCount / players.length) + 1 : 1;
  const currentPlayer = hasTimer ? players[(startIndex + turnCount) % players.length] : null;

  // Global effect for the running clock
  useEffect(() => {
    if (timerStatus !== 'running' || timeLeft === null) return;
    
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setTimerStatus('ended');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [timerStatus, timeLeft]);

  // Handle starting a turn / overall timer
  const handleStart = () => {
    setTimeLeft(timeConfig.value);
    setTimerStatus('running');
  };

  // Handle ending a turn early
  const handleEndEarly = () => {
    setTimeLeft(0);
    setTimerStatus('ended');
  };

  // Handle moving to the next person
  const handleNextPerson = () => {
    const nextCount = turnCount + 1;
    if (nextCount >= totalTurns) {
      setTimerStatus('all_done');
    } else {
      setTurnCount(nextCount);
      setTimerStatus('idle');
      setTimeLeft(null);
    }
  };

  const formatTime = (seconds) => {
    if (seconds === null) return null;
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // Render Turn-Based UI
  const renderTurnBasedUI = () => {
    if (timerStatus === 'all_done') {
      return (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--primary-red)', marginBottom: '16px' }}>
            Time's Up!
          </div>
          <p style={{ color: 'var(--text-gray)' }}>All rounds have finished. It's time to vote.</p>
        </div>
      );
    }

    return (
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ fontSize: '14px', color: 'var(--text-gray)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
          Round {currentRound} of {timeConfig.rounds || 1}
        </div>
        <div className="flex-row align-center" style={{ gap: '8px', fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>
          <User size={24} className="icon-blue" /> {currentPlayer.name}'s Turn
        </div>

        <div style={{ height: '180px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
          {/* Persistent Timer Display */}
          <div 
            className={timerStatus === 'running' && timeLeft <= 10 ? 'timer-pulse' : ''}
            style={{ 
              fontSize: '80px', 
              fontWeight: 'bold', 
              color: (timerStatus === 'running' && timeLeft <= 10) || timerStatus === 'ended' ? 'var(--primary-red)' : 'var(--primary-blue)',
              fontFamily: 'monospace',
              lineHeight: '1',
              marginBottom: '24px'
            }}
          >
            {formatTime(timerStatus === 'idle' ? timeConfig.value : (timeLeft !== null ? timeLeft : 0))}
          </div>

          {/* Unified Action Button */}
          <div style={{ width: '100%', maxWidth: '280px', height: '56px' }}>
            {timerStatus === 'idle' && (
              <button className="btn-primary" onClick={handleStart} style={{ width: '100%', height: '100%', fontSize: '18px' }}>
                Start Timer
              </button>
            )}
            {timerStatus === 'running' && (
              <button 
                onClick={handleEndEarly}
                style={{ 
                  width: '100%', height: '100%', fontSize: '16px', fontWeight: 600, 
                  backgroundColor: 'var(--bg-color-light)', border: '1px solid var(--card-border)', 
                  borderRadius: '12px', color: 'var(--text-dark)', cursor: 'pointer',
                  boxShadow: 'var(--card-shadow)'
                }}
              >
                End Turn Early
              </button>
            )}
            {timerStatus === 'ended' && (
              <button className="btn-primary mt-0" onClick={handleNextPerson} style={{ width: '100%', height: '100%', fontSize: '18px', gap: '8px' }}>
                Next Person <FastForward size={20} />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-col" style={{ flex: 1 }}>
      <div className="flex-row space-between align-center" style={{ marginBottom: '40px' }}>
        <div className="flex-row align-center" style={{ gap: '8px', fontSize: '14px', fontWeight: 600 }}>
          Guess the Imposter
        </div>
        <button className="btn-icon" onClick={() => setShowQuit(true)}>
          <X size={20} />
        </button>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '24px' }}>
        
        {hasTimer ? renderTurnBasedUI() : (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', color: 'var(--text-dark)' }}>
              <HelpCircle size={64} />
              <p style={{ fontSize: '16px', color: 'var(--text-gray)', marginTop: '16px' }}>
                No timer set. Discuss freely!
              </p>
            </div>
          </div>
        )}

        {(!hasTimer || timerStatus === 'all_done') && (
          <button 
            className="btn-primary" 
            onClick={onReveal} 
            style={{ 
              width: '100%',
              padding: '18px', 
              fontSize: '18px', 
              fontWeight: 700,
              marginTop: '24px'
            }}
          >
            Reveal Imposter
          </button>
        )}
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
