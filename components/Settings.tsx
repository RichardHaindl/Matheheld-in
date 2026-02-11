
import React from 'react';
import { GameSettings, OperationType } from '../types';

interface SettingsProps {
  settings: GameSettings;
  setSettings: (s: GameSettings) => void;
  onStart: () => void;
  onOpenAlbum: () => void;
  collectedCount: number;
}

const Settings: React.FC<SettingsProps> = ({ settings, setSettings, onStart, onOpenAlbum, collectedCount }) => {
  const toggleOperation = (op: OperationType) => {
    setSettings({
      ...settings,
      operations: {
        ...settings.operations,
        [op]: !settings.operations[op]
      }
    });
  };

  const isAnyOpSelected = Object.values(settings.operations).some(v => v);

  return (
    <div className="bg-white rounded-3xl p-8 shadow-xl max-w-md w-full border-4 border-pink-200">
      <h2 className="text-3xl font-bold text-pink-600 mb-6 text-center comic-font">Einstellungen 🛠️</h2>
      
      <div className="space-y-4">
        <div>
          <p className="font-bold text-gray-700 mb-3 text-lg">Rechnungen wählen:</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { type: OperationType.ADDITION, label: 'Plus', symbol: '+', color: 'green' },
              { type: OperationType.SUBTRACTION, label: 'Minus', symbol: '-', color: 'blue' },
              { type: OperationType.MULTIPLICATION, label: 'Mal', symbol: '×', color: 'yellow' },
              { type: OperationType.DIVISION, label: 'Geteilt', symbol: '÷', color: 'purple' },
            ].map(op => (
              <button
                key={op.type}
                onClick={() => toggleOperation(op.type)}
                className={`p-4 rounded-2xl border-b-4 transition-all ${settings.operations[op.type] ? `bg-${op.color}-100 border-${op.color}-500 text-${op.color}-700 scale-105` : 'bg-gray-50 border-gray-200 text-gray-400'}`}
              >
                <div className="text-2xl mb-1">{op.symbol}</div>
                <div className="text-sm font-bold">{op.label}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <div 
            className="flex items-center justify-between bg-pink-50 p-4 rounded-2xl cursor-pointer select-none border-2 border-pink-100" 
            onClick={() => setSettings({...settings, allowTensCrossing: !settings.allowTensCrossing})}
          >
            <div>
              <p className="font-bold text-pink-700">Zehnerüberschreitung</p>
              <div className="flex items-center space-x-1 mt-0.5">
                 <span className="text-[10px] bg-blue-100 text-blue-600 px-1.5 rounded border border-blue-200 font-bold">RARE Sticker 🔵</span>
              </div>
            </div>
            <div className={`w-12 h-7 flex items-center rounded-full p-1 transition-colors duration-300 ${settings.allowTensCrossing ? 'bg-pink-500' : 'bg-gray-300'}`}>
              <div className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${settings.allowTensCrossing ? 'translate-x-5' : 'translate-x-0'}`}></div>
            </div>
          </div>

          <div 
            className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer select-none border-2 transition-all ${settings.isAdvancedMode ? 'bg-purple-50 border-purple-200' : 'bg-gray-50 border-gray-100'}`}
            onClick={() => setSettings({...settings, isAdvancedMode: !settings.isAdvancedMode})}
          >
            <div>
              <p className={`font-bold ${settings.isAdvancedMode ? 'text-purple-700' : 'text-gray-400'}`}>Profi-Modus 💎</p>
              <div className="flex items-center space-x-1 mt-0.5">
                 <span className="text-[10px] bg-purple-100 text-purple-600 px-1.5 rounded border border-purple-200 font-bold">EPIC Sticker 🟣</span>
              </div>
            </div>
            <div className={`w-12 h-7 flex items-center rounded-full p-1 transition-colors duration-300 ${settings.isAdvancedMode ? 'bg-purple-500' : 'bg-gray-300'}`}>
              <div className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${settings.isAdvancedMode ? 'translate-x-5' : 'translate-x-0'}`}></div>
            </div>
          </div>
          
          {settings.allowTensCrossing && settings.isAdvancedMode && (
             <div className="text-center text-[10px] font-bold text-yellow-600 bg-yellow-50 border border-yellow-200 p-2 rounded-xl animate-pulse">
                ✨ WOW! Chance auf LEGENDARY Sticker! ✨
             </div>
          )}
        </div>

        <button
          onClick={onStart}
          disabled={!isAnyOpSelected}
          className={`w-full py-4 rounded-2xl text-xl font-bold transition-all transform active:scale-95 shadow-lg border-b-4 mt-2 ${isAnyOpSelected ? 'bg-gradient-to-r from-pink-500 to-orange-400 text-white border-pink-700' : 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed'}`}
        >
          Spielen! 🚀
        </button>

        <button
          onClick={onOpenAlbum}
          className="w-full py-3 rounded-2xl text-lg font-bold text-pink-500 bg-white border-2 border-pink-200 hover:bg-pink-50 transition-all flex items-center justify-center space-x-2"
        >
          <span>Mein Sticker-Album</span>
          <span>📒</span>
          <span className="bg-pink-100 text-pink-600 text-xs px-2 py-0.5 rounded-full border border-pink-200">{collectedCount}</span>
        </button>
      </div>
    </div>
  );
};

export default Settings;
