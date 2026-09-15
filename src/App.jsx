import { useState, useEffect } from 'react';

// Components
import SetupScreen from './components/SetupScreen';
import PlayersScreen from './components/PlayersScreen';
import DifficultyScreen from './components/DifficultyScreen';
import TimerScreen from './components/TimerScreen';
import ImpostersScreen from './components/ImpostersScreen';
import RevealScreen from './components/RevealScreen';
import DiscussionScreen from './components/DiscussionScreen';
import ResultScreen from './components/ResultScreen';
import wordData from './data/words.json';

const getNextWord = (difficulty) => {
  const storageKey = `played_indices_${difficulty}`;
  const versionKey = `dataset_version_${difficulty}`;
  
  const max = wordData[difficulty]?.length || 0;
  if (max === 0) return { word: "Unknown", hint: "Unknown" }; 
  
  // Create a signature based on the first word of EVERY category to detect updates globally
  const currentSignature = `${wordData.easy?.[0]?.word}_${wordData.medium?.[0]?.word}_${wordData.hard?.[0]?.word}`;
  
  // If the dataset has changed (e.g., an app update was pushed), clear the played history
  if (localStorage.getItem(versionKey) !== currentSignature) {
    localStorage.removeItem(storageKey);
    localStorage.setItem(versionKey, currentSignature);
  }
  
  // Use localStorage to persist the played set across sessions/days
  let playedSet = new Set(JSON.parse(localStorage.getItem(storageKey) || '[]'));
  
  // If we somehow played all words, reset the set to allow replay
  if (playedSet.size >= max) {
    playedSet.clear();
  }
  
  let randomIndex;
  // Generate random numbers until we find one that hasn't been played yet
  do {
    randomIndex = Math.floor(Math.random() * max);
  } while (playedSet.has(randomIndex));
  
  // Add to played set and save to local storage
  playedSet.add(randomIndex);
  localStorage.setItem(storageKey, JSON.stringify(Array.from(playedSet)));
  
  return wordData[difficulty][randomIndex];
};

function App() {
  const [view, setView] = useState('SETUP');
  const [gameId, setGameId] = useState(null);
  const [isStarting, setIsStarting] = useState(false);
  
  // Global Game State (Before starting)
  const [players, setPlayers] = useState(['Player 1', 'Player 2', 'Player 3']);
  const [imposterCount, setImposterCount] = useState(1);
  const [difficulty, setDifficulty] = useState('easy');
  const [timeConfig, setTimeConfig] = useState({ type: 'per_person', value: 30, rounds: 1 });
  
  // Game Play State
  const [gameState, setGameState] = useState(null); // { secret_word, players: [{id, name, is_imposter}] }

  // Enforce imposter majority rule when players length changes
  useEffect(() => {
    const maxImposters = Math.max(1, Math.floor((players.length - 1) / 2));
    if (imposterCount > maxImposters) {
      setImposterCount(maxImposters);
    }
  }, [players.length, imposterCount]);

  /* 
   * LEGACY AI API REFERENCE:
   * 
   * const fetchWords = async (diff) => {
   *   if (activeFetchPromise) return await activeFetchPromise;
   *   activeFetchPromise = (async () => {
   *     let retries = 3;
   *     while (retries > 0) {
   *       try {
   *         const apiUrl = `/api/prefetch?difficulty=${diff}`;
   *         const response = await fetch(apiUrl);
   *         const data = await response.json();
   *         // Store to sessionStorage and manage array chunks...
   *         break;
   *       } catch (err) {
   *         retries--;
   *         await new Promise(res => setTimeout(res, 1000));
   *       }
   *     }
   *   })();
   *   await activeFetchPromise;
   *   activeFetchPromise = null;
   * };
   * 
   * useEffect(() => {
   *   // On load, fetch all difficulties...
   *   fetchWords('all');
   * }, []);
   */

  const handleStartGame = async () => {
    if (isStarting) return;
    setIsStarting(true);
    
    try {
      // Instantly get the next guaranteed-unique word from our massive local dataset
      const selectedWord = getNextWord(difficulty);
      
      // Slight artificial delay for UX (Preparing Game...)
      setTimeout(() => {
        // 2. Assign imposters randomly
        const shuffledPlayers = [...players].sort(() => 0.5 - Math.random());
        const imposterNames = shuffledPlayers.slice(0, imposterCount);
        
        const gamePlayers = players.map((name, index) => ({
          id: index + 1,
          name: name,
          is_imposter: imposterNames.includes(name)
        }));
        
        // 3. Set Game State
        setGameState({
          secret_word: selectedWord.word,
          imposter_hint: selectedWord.hint,
          players: gamePlayers
        });
        
        setView('REVEAL');
        setIsStarting(false);
      }, 400);
    } catch (err) {
      console.error(err);
      alert("Error starting game.");
      setIsStarting(false);
    }
  };

  const handleRestart = () => {
    setGameId(null);
    setGameState(null);
    setView('SETUP');
  };

  // Bottom sheet state — null means no sheet is open
  const [activeSheet, setActiveSheet] = useState(null);

  return (
    <div className="app-container" style={{ position: 'relative' }}>
      {view === 'SETUP' && (
        <>
          <SetupScreen 
            players={players} 
            imposterCount={imposterCount} 
            difficulty={difficulty}
            timeConfig={timeConfig}
            isStarting={isStarting}
            onNavigate={(sheet) => setActiveSheet(sheet)}
            onStart={handleStartGame}
          />

          {/* Bottom Sheet Overlay */}
          {activeSheet && (
            <>
              {/* Backdrop */}
              <div 
                onClick={() => setActiveSheet(null)} 
                style={{
                  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                  backgroundColor: 'rgba(0,0,0,0.4)',
                  zIndex: 100,
                  animation: 'fadeIn 0.2s ease'
                }}
              />
              {/* Sheet */}
              <div style={{
                position: 'fixed', bottom: 0, left: 0, right: 0, margin: '0 auto',
                maxWidth: '600px',
                backgroundColor: 'var(--bg-color)',
                borderRadius: '24px 24px 0 0',
                padding: '16px 20px 32px',
                maxHeight: '85vh',
                overflowY: 'auto',
                zIndex: 101,
                boxShadow: '0 -10px 40px rgba(0,0,0,0.15)',
                animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
              }}>
                {/* Drag Handle */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
                  <div style={{ width: '40px', height: '4px', borderRadius: '4px', backgroundColor: 'var(--card-border)' }} />
                </div>

                {activeSheet === 'PLAYERS' && (
                  <PlayersScreen 
                    players={players} 
                    setPlayers={setPlayers} 
                    onBack={() => setActiveSheet(null)} 
                  />
                )}
                {activeSheet === 'DIFFICULTY' && (
                  <DifficultyScreen 
                    difficulty={difficulty}
                    setDifficulty={setDifficulty}
                    onBack={() => setActiveSheet(null)}
                  />
                )}
                {activeSheet === 'IMPOSTERS' && (
                  <ImpostersScreen 
                    imposterCount={imposterCount} 
                    setImposterCount={setImposterCount} 
                    maxImposters={Math.max(1, Math.floor((players.length - 1) / 2))}
                    onBack={() => setActiveSheet(null)} 
                  />
                )}
                {activeSheet === 'TIMER' && (
                  <TimerScreen 
                    timeConfig={timeConfig}
                    setTimeConfig={setTimeConfig}
                    onBack={() => setActiveSheet(null)}
                  />
                )}
              </div>
            </>
          )}
        </>
      )}
      {view === 'REVEAL' && gameState && (
        <RevealScreen 
          game={gameState} 
          onFinishReveal={() => setView('DISCUSSION')} 
          onQuit={handleRestart}
        />
      )}
      {view === 'DISCUSSION' && (
        <DiscussionScreen 
          timeConfig={timeConfig}
          players={gameState.players}
          onReveal={() => setView('RESULT')} 
          onQuit={handleRestart}
        />
      )}
      {view === 'RESULT' && gameState && (
        <ResultScreen 
          game={gameState} 
          onRestart={handleRestart} 
        />
      )}
    </div>
  );
}

export default App;
