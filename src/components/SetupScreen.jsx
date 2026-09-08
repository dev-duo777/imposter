import React from 'react';
import { Users, UserX, Lightbulb, Clock, Play, Pencil, Info, X } from 'lucide-react';

export default function SetupScreen({ players, imposterCount, difficulty, timeConfig, isStarting, onNavigate, onStart }) {
  const [showHowToPlay, setShowHowToPlay] = React.useState(false);
  
  const renderTimerText = () => {
    if (timeConfig.type === 'none') return 'Off';
    return `${timeConfig.value}s`;
  };

  return (
    <div className="flex-col" style={{ flex: 1, gap: '32px', paddingTop: '20px' }}>
      
      {/* Hero Header */}
      <div style={{ textAlign: 'center' }}>
        <img 
          src="/hero_image.png" 
          alt="Squid Game Style Imposter" 
          style={{ 
            width: '100%', 
            maxWidth: '300px', 
            borderRadius: '16px', 
            marginBottom: '16px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
          }} 
        />
        <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-gray)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>
          Social Deduction Game
        </div>
        <h1 style={{ fontSize: '32px', fontWeight: 900, lineHeight: 1.1, color: 'var(--text-dark)' }}>
          GUESS THE <br />
          <span style={{ color: 'var(--primary-red)', fontSize: '46px' }}>IMPOSTER</span>
        </h1>
        
        <button 
          onClick={() => setShowHowToPlay(true)}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--primary-blue)',
            fontWeight: 700,
            fontSize: '14px',
            marginTop: '12px',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Info size={16} /> How to Play
        </button>
      </div>

      <p className="text-center" style={{ fontSize: '14px', color: 'var(--text-gray)', padding: '0 20px', lineHeight: 1.5 }}>
        Everyone secretly views their role on this device — then the suspicion begins.
      </p>

      {/* Bento Box Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '12px', 
        width: '100%',
        marginTop: '12px',
        marginBottom: '16px'
      }}>
        
        {/* Players Card */}
        <div 
          className="card flex-col" 
          onClick={() => onNavigate('PLAYERS')}
          style={{ cursor: 'pointer', padding: '20px 16px', alignItems: 'center', justifyContent: 'center', gap: '8px', position: 'relative' }}
        >
          <Pencil size={14} color="var(--text-gray)" style={{ position: 'absolute', top: 12, right: 12 }} />
          <div className="flex-row align-center" style={{ gap: '6px', color: 'var(--text-gray)', fontSize: '14px', fontWeight: 600 }}>
            <Users size={16} /> Players
          </div>
          <div style={{ fontSize: '42px', fontWeight: 800, color: 'var(--text-dark)', lineHeight: 1 }}>
            {players.length}
          </div>
        </div>

        {/* Imposters Card */}
        <div 
          className="card flex-col" 
          onClick={() => onNavigate('IMPOSTERS')}
          style={{ cursor: 'pointer', padding: '20px 16px', alignItems: 'center', justifyContent: 'center', gap: '8px', position: 'relative' }}
        >
          <Pencil size={14} color="var(--text-gray)" style={{ position: 'absolute', top: 12, right: 12 }} />
          <div className="flex-row align-center" style={{ gap: '6px', color: 'var(--text-gray)', fontSize: '14px', fontWeight: 600 }}>
            <UserX size={16} /> Imposters
          </div>
          <div style={{ fontSize: '42px', fontWeight: 800, color: 'var(--primary-red)', lineHeight: 1 }}>
            {imposterCount}
          </div>
        </div>

        {/* Difficulty Card */}
        <div 
          className="card flex-col" 
          onClick={() => onNavigate('DIFFICULTY')}
          style={{ cursor: 'pointer', padding: '20px 16px', alignItems: 'center', justifyContent: 'center', gap: '8px', position: 'relative' }}
        >
          <Pencil size={14} color="var(--text-gray)" style={{ position: 'absolute', top: 12, right: 12 }} />
          <div className="flex-row align-center" style={{ gap: '6px', color: 'var(--text-gray)', fontSize: '14px', fontWeight: 600 }}>
            <Lightbulb size={16} /> Words
          </div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-dark)', textTransform: 'uppercase', lineHeight: 1, marginTop: '8px', marginBottom: '8px' }}>
            {difficulty}
          </div>
        </div>

        {/* Timer Card */}
        <div 
          className="card flex-col" 
          onClick={() => onNavigate('TIMER')}
          style={{ cursor: 'pointer', padding: '20px 16px', alignItems: 'center', justifyContent: 'center', gap: '8px', position: 'relative' }}
        >
          <Pencil size={14} color="var(--text-gray)" style={{ position: 'absolute', top: 12, right: 12 }} />
          <div className="flex-row align-center" style={{ gap: '6px', color: 'var(--text-gray)', fontSize: '14px', fontWeight: 600 }}>
            <Clock size={16} /> Turn Time
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-dark)', lineHeight: 1, marginTop: '4px', marginBottom: '4px' }}>
            {renderTimerText()}
          </div>
          {timeConfig.type !== 'none' && (
            <div style={{ fontSize: '12px', color: 'var(--text-gray)', fontWeight: 600 }}>
              {timeConfig.rounds} {timeConfig.rounds === 1 ? 'Round' : 'Rounds'}
            </div>
          )}
        </div>

      </div>

      {/* Massive Call to Action */}
      <button 
        className="btn-primary" 
        onClick={onStart} 
        disabled={isStarting}
        style={{ 
          marginTop: 'auto', 
          width: '100%', 
          padding: '22px', 
          fontSize: '20px', 
          fontWeight: 800, 
          letterSpacing: '1px',
          textTransform: 'uppercase',
          marginBottom: '16px',
          borderRadius: '16px',
          opacity: isStarting ? 0.7 : 1
        }}
      >
        {isStarting ? 'Generating AI Words...' : (
          <div className="flex-row justify-center align-center" style={{ gap: '12px' }}>
             <Play fill="white" size={24} /> START INTERROGATION
          </div>
        )}
      </button>

      {/* SEO & Context Content (Below the fold) */}
      <div style={{ padding: '24px 0', borderTop: '1px solid var(--card-border)', color: 'var(--text-gray)' }}>
        <h2 style={{ fontSize: '24px', color: 'var(--text-dark)', marginBottom: '16px' }}>The Ultimate Imposter Game for Friends & Family</h2>
        <p style={{ fontSize: '14px', lineHeight: 1.6, marginBottom: '24px' }}>
          Looking for the perfect imposter game to play at your next party? You've found it. Our free imposter game brings the classic social deduction experience right to your browser, no app download required.
        </p>

        <h3 style={{ fontSize: '18px', color: 'var(--text-dark)', marginBottom: '12px' }}>What is the Imposter Word Game?</h3>
        <p style={{ fontSize: '14px', lineHeight: 1.6, marginBottom: '24px' }}>
          The imposter word game is a thrilling party game where everyone receives the same secret word, except the imposters. They must bluff their way through the round without getting caught. Meanwhile, everyone else gives subtle one-word clues to prove they know the secret word, while trying to identify who's faking it.
        </p>

        <h3 style={{ fontSize: '18px', color: 'var(--text-dark)', marginBottom: '12px' }}>Built-in Imposter Game Generator</h3>
        <p style={{ fontSize: '14px', lineHeight: 1.6, marginBottom: '24px' }}>
          Forget scrambling for ideas. Our imposter game generator automatically picks from curated imposter game words across multiple difficulty levels. Everyone gathers around a single phone or tablet to view their role privately before the timer starts.
        </p>
      </div>

      {/* How to Play Bottom Sheet */}
      {showHowToPlay && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          zIndex: 1000,
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
          animation: 'fadeIn 0.2s ease'
        }}>
          <div style={{
            background: 'var(--bg-color)',
            width: '100%',
            maxWidth: '600px',
            maxHeight: '85vh',
            overflowY: 'auto',
            borderTopLeftRadius: '24px',
            borderTopRightRadius: '24px',
            padding: '24px',
            animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
          }}>
            <div className="flex-row space-between align-center" style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '24px', margin: 0 }}>How to Play</h2>
              <button className="btn-icon" onClick={() => setShowHowToPlay(false)}>
                <X size={24} />
              </button>
            </div>
            
            <div className="flex-col" style={{ gap: '20px' }}>
              <div className="card">
                <div style={{ fontWeight: 800, color: 'var(--primary-blue)', marginBottom: '4px' }}>1. Draw Cards ☝️</div>
                <p style={{ fontSize: '14px', color: 'var(--text-gray)', lineHeight: 1.5 }}>Each player views their role on the device. The Imposter(s) does not know the secret word. Everyone else gets the same word.</p>
              </div>
              <div className="card">
                <div style={{ fontWeight: 800, color: 'var(--primary-blue)', marginBottom: '4px' }}>2. Give Clues 🗣️</div>
                <p style={{ fontSize: '14px', color: 'var(--text-gray)', lineHeight: 1.5 }}>A timer starts. Each person takes turns saying exactly one word related to the secret word.</p>
              </div>
              <div className="card">
                <div style={{ fontWeight: 800, color: 'var(--primary-blue)', marginBottom: '4px' }}>3. The Goal 🎯</div>
                <p style={{ fontSize: '14px', color: 'var(--text-gray)', lineHeight: 1.5 }}>The group tries to expose the Imposter. The Imposter tries to figure out the secret word without being discovered.</p>
              </div>
              <div className="card">
                <div style={{ fontWeight: 800, color: 'var(--primary-red)', marginBottom: '4px' }}>4. Game Over 🏁</div>
                <p style={{ fontSize: '14px', color: 'var(--text-gray)', lineHeight: 1.5 }}>The game ends when the time runs out. The group votes on who the imposter is!</p>
              </div>
            </div>

            <button 
              className="btn-primary" 
              onClick={() => setShowHowToPlay(false)}
              style={{ width: '100%', padding: '16px', marginTop: '24px', fontSize: '16px' }}
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
