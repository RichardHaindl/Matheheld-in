
import React, { useState } from 'react';
import { Sticker } from '../types';
import { ALL_STICKERS } from '../services/stickers';

interface StickerAlbumProps {
  collectedIds: string[];
  onBack: () => void;
  onReset: () => void;
}

const StickerAlbum: React.FC<StickerAlbumProps> = ({ collectedIds, onBack, onReset }) => {
  const categories = ['ANIMALS', 'SPACE', 'FOOD', 'OBJECTS'];
  const categoryNames: Record<string, string> = {
    'ANIMALS': 'Tiere 🐼',
    'SPACE': 'Weltraum 🚀',
    'FOOD': 'Leckereien 🍦',
    'OBJECTS': 'Coole Dinge 🎸'
  };

  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const isFull = collectedIds.length === ALL_STICKERS.length;

  const getRarityStyles = (rarity: string) => {
    switch (rarity) {
      case 'LEGENDARY': 
        return {
          border: 'border-yellow-400',
          bg: 'bg-yellow-50',
          glow: 'shadow-[0_0_15px_rgba(250,204,21,0.6)]',
          badge: 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white',
          label: 'LEGENDÄR'
        };
      case 'EPIC':
        return {
          border: 'border-purple-400',
          bg: 'bg-purple-50',
          glow: 'shadow-[0_0_15px_rgba(192,132,252,0.6)]',
          badge: 'bg-gradient-to-r from-purple-400 to-pink-400 text-white',
          label: 'EPISCH'
        };
      case 'RARE':
        return {
          border: 'border-blue-400',
          bg: 'bg-blue-50',
          glow: 'shadow-[0_0_15px_rgba(96,165,250,0.6)]',
          badge: 'bg-gradient-to-r from-blue-400 to-cyan-400 text-white',
          label: 'SELTEN'
        };
      default: // COMMON
        return {
          border: 'border-gray-200',
          bg: 'bg-white',
          glow: 'shadow-sm', // No strong glow for common
          badge: 'bg-gray-200 text-gray-500',
          label: 'NORMAL'
        };
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl max-w-5xl w-full border-4 border-pink-200 h-[85vh] overflow-hidden flex flex-col relative">
      
      {/* Reset Modal */}
      {showConfirmReset && (
        <div className="absolute inset-0 bg-white/95 z-50 flex flex-col items-center justify-center p-8 text-center backdrop-blur-sm">
          <div className="text-6xl mb-4">😲</div>
          <h3 className="text-2xl font-bold text-red-500 mb-2">Album wirklich leeren?</h3>
          <p className="text-gray-600 mb-6">Alle deine Sticker gehen verloren und du kannst von vorne sammeln.</p>
          <div className="flex space-x-4">
             <button onClick={() => setShowConfirmReset(false)} className="px-6 py-3 bg-gray-200 rounded-xl font-bold text-gray-700">Abbrechen</button>
             <button onClick={() => { onReset(); setShowConfirmReset(false); }} className="px-6 py-3 bg-red-500 text-white rounded-xl font-bold shadow-lg">Ja, leeren!</button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
            <h2 className="text-3xl font-bold text-pink-600 comic-font">Album 📒</h2>
            {isFull && <span className="bg-yellow-400 text-yellow-900 text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-wider animate-pulse">Komplett!</span>}
        </div>
        <button onClick={onBack} className="text-3xl bg-gray-100 rounded-full w-12 h-12 hover:bg-gray-200 flex items-center justify-center transition-colors">❌</button>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-2 pb-4">
        {categories.map(cat => {
          const stickers = ALL_STICKERS.filter(s => s.category === cat);
          return (
            <div key={cat} className="mb-8">
              <h3 className="text-xl font-bold text-gray-600 mb-4 bg-gray-50 inline-block px-4 py-1 rounded-full border border-gray-100">{categoryNames[cat]}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                {stickers.map(sticker => {
                  const isCollected = collectedIds.includes(sticker.id);
                  const styles = getRarityStyles(sticker.rarity);
                  
                  return (
                    <div 
                      key={sticker.id}
                      className={`
                        aspect-square rounded-2xl flex flex-col items-center justify-center p-2 border-[3px] transition-all relative overflow-hidden group select-none
                        ${isCollected ? `${styles.border} ${styles.bg} ${styles.glow} scale-100 hover:scale-105 z-0 hover:z-10` : 'bg-gray-100 border-gray-200 opacity-60 grayscale'}
                      `}
                    >
                      {/* Rarity Badge */}
                      {isCollected && (
                        <div className={`absolute top-0 right-0 ${styles.badge} text-[8px] font-black px-2 py-1 rounded-bl-xl shadow-sm z-20 tracking-wider`}>
                          {styles.label}
                        </div>
                      )}

                      {/* Sparkles for Legendary/Epic */}
                      {isCollected && (sticker.rarity === 'LEGENDARY' || sticker.rarity === 'EPIC') && (
                         <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/40 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none translate-x-[-100%] group-hover:translate-x-[100%] transform transition-transform" style={{ transitionDuration: '1s' }}></div>
                      )}
                      
                      <div className={`text-5xl md:text-6xl mb-2 transition-transform duration-300 ${isCollected ? 'group-hover:rotate-6 group-hover:scale-110 drop-shadow-sm' : 'blur-[2px]'}`}>
                        {isCollected ? sticker.emoji : '?'}
                      </div>
                      <div className={`text-[10px] font-bold text-center uppercase tracking-wide truncate w-full px-1 ${isCollected ? 'text-gray-600' : 'text-gray-400'}`}>
                        {isCollected ? sticker.name : '???'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center bg-white">
        <div className="text-gray-400 text-xs font-bold">
          {collectedIds.length} / {ALL_STICKERS.length} gesammelt
        </div>
        {isFull && (
            <button 
                onClick={() => setShowConfirmReset(true)}
                className="text-xs text-red-400 font-bold bg-red-50 px-3 py-1 rounded-full border border-red-100 hover:bg-red-100 transition-colors"
            >
                Album zurücksetzen 🔄
            </button>
        )}
      </div>
    </div>
  );
};

export default StickerAlbum;
