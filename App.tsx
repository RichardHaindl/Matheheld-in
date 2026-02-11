
import React, { useState, useCallback, useEffect } from 'react';
import { OperationType, GameSettings, Equation, GameState, Sticker } from './types';
import { generateEquation } from './services/mathGenerator';
import { getRewardSticker } from './services/stickers';
import Settings from './components/Settings';
import EquationCard from './components/EquationCard';
import FeedbackOverlay from './components/FeedbackOverlay';
import SummaryScreen from './components/SummaryScreen';
import StickerAlbum from './components/StickerAlbum';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.SETTINGS);
  const [settings, setSettings] = useState<GameSettings>({
    operations: {
      [OperationType.ADDITION]: true,
      [OperationType.SUBTRACTION]: true,
      [OperationType.MULTIPLICATION]: false,
      [OperationType.DIVISION]: false
    },
    allowTensCrossing: false,
    isAdvancedMode: false,
    maxRange: 100,
    questionsPerSession: 10
  });
  
  // Game Session State
  const [currentEquation, setCurrentEquation] = useState<Equation | null>(null);
  const [sessionStats, setSessionStats] = useState({ correct: 0, total: 0 });
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean, userAnswer: number } | null>(null);
  
  // Sticker State
  const [collectedStickerIds, setCollectedStickerIds] = useState<string[]>([]);
  const [rewardResult, setRewardResult] = useState<{
    sticker: Sticker | null;
    reason: 'LOW_SCORE' | 'ALBUM_FULL' | 'SUCCESS';
    rarityWon?: string;
    maxPossibleRarity?: string;
  }>({ sticker: null, reason: 'LOW_SCORE' });

  useEffect(() => {
    const saved = localStorage.getItem('matheheldin_stickers');
    if (saved) {
      try {
        setCollectedStickerIds(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load stickers", e);
      }
    }
  }, []);

  const saveSticker = (id: string) => {
    const newIds = [...collectedStickerIds, id];
    setCollectedStickerIds(newIds);
    localStorage.setItem('matheheldin_stickers', JSON.stringify(newIds));
  };

  const resetAlbum = () => {
      setCollectedStickerIds([]);
      localStorage.removeItem('matheheldin_stickers');
  };

  const nextTask = useCallback(() => {
    // Check if session ended
    if (currentQuestionIndex >= settings.questionsPerSession - 1 && feedback) {
      finishSession();
      return;
    }

    // Generate new if just starting or continuing
    const eq = generateEquation(settings);
    setCurrentEquation(eq);
    setFeedback(null);
    if (feedback) { // only increment if we are coming from a feedback state (i.e. not first load)
        setCurrentQuestionIndex(prev => prev + 1);
    }
  }, [settings, currentQuestionIndex, feedback]);

  const startGame = () => {
    setSessionStats({ correct: 0, total: 0 });
    setCurrentQuestionIndex(0);
    setGameState(GameState.PLAYING);
    // Generate first equation directly
    const eq = generateEquation(settings);
    setCurrentEquation(eq);
    setFeedback(null);
  };

  const finishSession = () => {
    const result = getRewardSticker(collectedStickerIds, sessionStats.correct, sessionStats.total, settings);
    setRewardResult(result);
    
    if (result.sticker) {
        saveSticker(result.sticker.id);
    }
    setGameState(GameState.SUMMARY);
  };

  const handleSolve = (answer: number) => {
    if (!currentEquation) return;
    const isCorrect = answer === currentEquation.targetValue;
    setFeedback({ isCorrect, userAnswer: answer });
    setSessionStats(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1
    }));
  };

  const backToSettings = () => {
    setGameState(GameState.SETTINGS);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-pink-200 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
      
      <header className="fixed top-0 w-full p-4 flex justify-between items-center z-40 bg-white/50 backdrop-blur-md border-b border-pink-100">
        <div className="flex items-center space-x-2" onClick={backToSettings}>
          <span className="text-3xl">🦉</span>
          <h1 className="text-2xl font-bold text-pink-600 comic-font cursor-pointer">Matheheldin</h1>
        </div>
        {gameState === GameState.PLAYING && (
          <button 
            onClick={backToSettings}
            className="text-gray-400 hover:text-pink-500 transition-colors font-bold text-sm"
          >
            BEENDEN ✖
          </button>
        )}
      </header>

      <main className="w-full flex justify-center items-center mt-16 pb-8">
        {gameState === GameState.SETTINGS && (
          <Settings 
            settings={settings} 
            setSettings={setSettings} 
            onStart={startGame} 
            onOpenAlbum={() => setGameState(GameState.ALBUM)}
            collectedCount={collectedStickerIds.length}
          />
        )}

        {gameState === GameState.PLAYING && currentEquation && (
          <EquationCard 
            equation={currentEquation} 
            onSolve={handleSolve} 
            progress={{ current: currentQuestionIndex + 1, total: settings.questionsPerSession }}
          />
        )}

        {gameState === GameState.SUMMARY && (
          <SummaryScreen 
            correct={sessionStats.correct} 
            total={sessionStats.total} 
            reward={rewardResult}
            onHome={startGame} 
            onOpenAlbum={() => setGameState(GameState.ALBUM)}
          />
        )}

        {gameState === GameState.ALBUM && (
          <StickerAlbum 
            collectedIds={collectedStickerIds} 
            onBack={() => setGameState(GameState.SETTINGS)}
            onReset={resetAlbum}
          />
        )}
      </main>

      {feedback && currentEquation && gameState === GameState.PLAYING && (
        <FeedbackOverlay 
          isCorrect={feedback.isCorrect}
          equation={currentEquation}
          userAnswer={feedback.userAnswer}
          onNext={nextTask}
        />
      )}
    </div>
  );
};

export default App;
