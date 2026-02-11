
import React, { useState, useEffect, useCallback } from 'react';
import { Equation, TaskFormat } from '../types';
import Keypad from './Keypad';
import VisualHelp from './VisualHelp';

interface EquationCardProps {
  equation: Equation;
  onSolve: (answer: number) => void;
  progress: { current: number; total: number };
}

const EquationCard: React.FC<EquationCardProps> = ({ equation, onSolve, progress }) => {
  const [h, setH] = useState('');
  const [z, setZ] = useState('');
  const [e, setE] = useState('');
  const [activeBox, setActiveBox] = useState<'H' | 'Z' | 'E'>('E'); // Start with Ones (E)
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    // Reset fields when equation changes
    setH('');
    setZ('');
    setE('');
    setActiveBox('E'); // Always start at Einer
    setShowHelp(false);
  }, [equation]);

  const handleSubmit = useCallback(() => {
    const val = (parseInt(h || '0') * 100) + (parseInt(z || '0') * 10) + parseInt(e || '0');
    // Allow submission if at least one digit is entered
    if (h || z || e) {
      onSolve(val);
    }
  }, [h, z, e, onSolve]);

  const handleDigit = useCallback((digit: string) => {
    // Logic: Fill current box, then move left (E -> Z -> H)
    if (activeBox === 'E') {
      setE(digit);
      setActiveBox('Z');
    } else if (activeBox === 'Z') {
      setZ(digit);
      setActiveBox('H');
    } else if (activeBox === 'H') {
      setH(digit);
      // Stay on H or maybe auto-submit? Let's stay on H.
    }
  }, [activeBox]);

  const handleClear = useCallback(() => {
    // Logic: Clear current, move right (H -> Z -> E)
    if (activeBox === 'H') {
      if (h) setH('');
      else {
        setActiveBox('Z');
        setZ(''); // Clear the previous one too if current was empty? 
        // Better UX: Just clear current if has value, otherwise move focus back and clear
      }
    } else if (activeBox === 'Z') {
      if (z) setZ('');
      else {
        setActiveBox('E');
        setE('');
      }
    } else if (activeBox === 'E') {
      setE('');
    }
  }, [activeBox, h, z]);

  // Physical Keyboard Support
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key;
      if (/^[0-9]$/.test(key)) {
        handleDigit(key);
      } else if (key === 'Backspace') {
        handleClear();
      } else if (key === 'Enter') {
        handleSubmit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleDigit, handleClear, handleSubmit]);

  return (
    <div className="bg-white rounded-[2.5rem] p-4 md:p-8 shadow-2xl max-w-2xl w-full border-b-[12px] border-r-[12px] border-pink-100 flex flex-col items-center transition-all relative">
      
      {/* Progress Bar */}
      <div className="w-full mb-6">
        <div className="flex justify-between text-xs font-bold text-gray-400 mb-1 uppercase tracking-widest">
          <span>Runde</span>
          <span>{progress.current} / {progress.total}</span>
        </div>
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-pink-400 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(progress.current / progress.total) * 100}%` }}
            ></div>
        </div>
      </div>

      {/* Header with Difficulty Badge */}
      <div className="w-full flex justify-between items-center mb-4 px-2">
         <div className="flex space-x-2">
           {equation.isTensCrossing && (
             <div className="bg-orange-500 text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center shadow-sm">
               🔥 PROFI
             </div>
           )}
           {equation.format !== TaskFormat.STANDARD && (
             <div className="bg-purple-500 text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center shadow-sm">
               ❓ PLATZHALTER
             </div>
           )}
           {!equation.isTensCrossing && equation.format === TaskFormat.STANDARD && (
              <div className="text-[10px] font-bold text-green-500 bg-green-50 px-3 py-1 rounded-full">⭐ LEICHT</div>
           )}
         </div>
         <div className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">ID: {equation.id.toUpperCase()}</div>
      </div>

      {/* Equation Display */}
      <div className="w-full flex flex-col items-center mb-4">
        <div className="flex items-center justify-center gap-3 md:gap-6 text-5xl md:text-7xl font-bold text-gray-800 comic-font mb-4 transition-all">
          <span className={equation.displayValue1 === '?' ? 'text-pink-500 underline decoration-pink-200' : ''}>
            {equation.displayValue1}
          </span>
          <span className="text-pink-400">{equation.operator}</span>
          <span className={equation.displayValue2 === '?' ? 'text-pink-500 underline decoration-pink-200' : ''}>
            {equation.displayValue2}
          </span>
          <span className="text-pink-400">=</span>
          <span className={equation.displayValue3 === '?' ? 'text-pink-500 underline decoration-pink-200' : ''}>
            {equation.displayValue3}
          </span>
        </div>
        
        {equation.shortcutHint && (
          <div className="bg-yellow-50 text-yellow-700 text-[10px] font-bold px-4 py-1.5 rounded-lg border border-yellow-200 mb-4 animate-pulse">
            💡 {equation.shortcutHint}
          </div>
        )}

        <button 
          onClick={() => setShowHelp(!showHelp)}
          className={`text-sm font-bold px-6 py-2 rounded-full transition-all flex items-center space-x-2 transform hover:scale-105 active:scale-95 ${showHelp ? 'bg-blue-500 text-white shadow-lg' : 'bg-blue-50 text-blue-500 border-2 border-blue-100'}`}
        >
          <span>{showHelp ? 'Hilfe schließen' : 'Lernhilfe öffnen'}</span>
          <span className="text-lg">💡</span>
        </button>
      </div>

      <div className="w-full max-h-[300px] overflow-y-auto mb-4 custom-scrollbar">
        {showHelp && <VisualHelp equation={equation} />}
      </div>

      {/* Stellenwert-Tafel (H-Z-E) */}
      <div className="flex space-x-3 md:space-x-4 mb-2">
        {/* Render Order H -> Z -> E, but focus logic moves E -> Z -> H */}
        {[
          { label: 'H', val: h, color: 'green', id: 'H' as const },
          { label: 'Z', val: z, color: 'blue', id: 'Z' as const },
          { label: 'E', val: e, color: 'red', id: 'E' as const },
        ].map((box) => (
          <button
            key={box.id}
            onClick={() => setActiveBox(box.id)}
            className={`
              w-16 h-20 md:w-20 md:h-24 flex flex-col items-center justify-center rounded-2xl border-4 transition-all
              ${activeBox === box.id 
                ? `border-${box.color}-500 bg-${box.color}-50 scale-110 shadow-lg ring-4 ring-${box.color}-100 z-10` 
                : `border-${box.color}-100 bg-white text-gray-200 hover:border-${box.color}-200`}
            `}
          >
            <span className={`text-[10px] font-black text-${box.color}-600 mb-1 uppercase`}>{box.label}</span>
            <span className={`text-4xl md:text-5xl font-bold ${activeBox === box.id ? `text-${box.color}-700` : 'text-gray-500'}`}>
              {box.val || <span className="text-gray-100">.</span>}
            </span>
          </button>
        ))}
      </div>

      <p className="text-[10px] text-gray-400 mb-2 font-bold uppercase tracking-widest">
        {activeBox === 'E' ? 'Einer eingeben' : activeBox === 'Z' ? 'Zehner eingeben' : 'Hunderter eingeben'}
      </p>

      <Keypad 
        onDigit={handleDigit} 
        onClear={handleClear} 
        onSubmit={handleSubmit} 
      />

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 10px; }
      `}} />

      {/* Tailwind Cache for dynamic classes */}
      <div className="hidden border-green-500 border-blue-500 border-red-500 bg-green-50 bg-blue-50 bg-red-50 text-green-700 text-blue-700 text-red-700 ring-green-100 ring-blue-100 ring-red-100 border-green-100 border-blue-100 border-red-100"></div>
    </div>
  );
};

export default EquationCard;
