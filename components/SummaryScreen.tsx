
import React, { useState, useEffect } from 'react';
import { Sticker } from '../types';

interface SummaryScreenProps {
  correct: number;
  total: number;
  reward: {
    sticker: Sticker | null;
    reason: 'LOW_SCORE' | 'ALBUM_FULL' | 'SUCCESS';
    rarityWon?: string;
    maxPossibleRarity?: string;
  };
  onHome: () => void;
  onOpenAlbum: () => void;
}

const SummaryScreen: React.FC<SummaryScreenProps> = ({ correct, total, reward, onHome, onOpenAlbum }) => {
  const [showSticker, setShowSticker] = useState(false);

  useEffect(() => {
    if (reward.sticker) {
      setTimeout(() => setShowSticker(true), 1000);
    }
  }, [reward]);

  const percentage = (correct / total) * 100;
  let message = "Gute Übung!";
  let subMessage = "Weiter so!";
  
  if (percentage === 100) {
    message = "Fantastisch! 🏆";
    subMessage = "Alles richtig!";
  } else if (percentage >= 80) {
    message = "Super gemacht! 🌟";
    subMessage = "Fast alles richtig!";
  } else if (percentage >= 50) {
    message = "Gut gemacht! 👍";
    subMessage = "Du wirst immer besser!";
  } else {
    message = "Nicht aufgeben! 💪";
    subMessage = "Versuch es gleich nochmal!";
  }

  const getRarityColor = (rarity?: string) => {
    switch (rarity) {
      case 'LEGENDARY': return 'from-yellow-400 to-orange-500';
      case 'EPIC': return 'from-purple-400 to-pink-500';
      case 'RARE': return 'from-blue-400 to-cyan-500';
      default: return 'from-gray-300 to-gray-400';
    }
  };

  const getRarityBorderColor = (rarity?: string) => {
    switch (rarity) {
      case 'LEGENDARY': return 'border-yellow-400';
      case 'EPIC': return 'border-purple-400';
      case 'RARE': return 'border-blue-400';
      default: return 'border-gray-200';
    }
  };

  const getRarityLabel = (rarity?: string) => {
      switch (rarity) {
      case 'LEGENDARY': return '✨ Legendär ✨';
      case 'EPIC': return '🟣 Episch 🟣';
      case 'RARE': return '🔵 Selten 🔵';
      default: return '⚪ Gewöhnlich ⚪';
    }
  }

  return (
    <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl max-w-md w-full border-b-[12px] border-r-[12px] border-purple-100 flex flex-col items-center text-center">
      <h2 className="text-3xl font-bold text-purple-600 mb-2 comic-font">Training beendet!</h2>
      <p className="text-gray-500 font-bold mb-6 text-lg">{message}</p>

      <div className="bg-purple-50 rounded-2xl p-6 w-full mb-8 border-2 border-purple-100">
        <div className="text-5xl font-black text-purple-600 mb-2">{correct} <span className="text-2xl text-purple-300">/</span> {total}</div>
        <div className="text-sm font-bold text-purple-400 uppercase tracking-widest">{subMessage}</div>
      </div>

      {reward.reason === 'SUCCESS' && reward.sticker && (
        <div className="mb-8 w-full flex flex-col items-center">
          <p className="font-bold text-gray-600 mb-1 animate-pulse">🎁 Neuer Sticker!</p>
          <p className={`text-[12px] font-black uppercase tracking-widest mb-4 bg-clip-text text-transparent bg-gradient-to-r ${getRarityColor(reward.rarityWon)}`}>
             {getRarityLabel(reward.rarityWon)}
          </p>

          <div className={`relative w-40 h-40 flex items-center justify-center transition-all duration-700 ${showSticker ? 'scale-100 rotate-0' : 'scale-0 rotate-180'}`}>
             <div className={`absolute inset-0 rounded-full animate-ping opacity-20 bg-gradient-to-r ${getRarityColor(reward.sticker.rarity)}`}></div>
             
             <div className={`relative z-10 bg-white p-6 rounded-3xl border-4 ${getRarityBorderColor(reward.sticker.rarity)} shadow-xl flex flex-col items-center transform hover:scale-110 transition-transform`}>
                <div className="text-6xl mb-2">{reward.sticker.emoji}</div>
                <div className="text-xs font-bold text-gray-500 uppercase">{reward.sticker.name}</div>
                
                {reward.sticker.rarity === 'LEGENDARY' && <span className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-md">LEGENDÄR</span>}
                {reward.sticker.rarity === 'EPIC' && <span className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-md">EPISCH</span>}
                {reward.sticker.rarity === 'RARE' && <span className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-md">SELTEN</span>}
             </div>
          </div>
          
          {reward.rarityWon !== reward.maxPossibleRarity && (
              <p className="text-[10px] text-gray-400 mt-4 max-w-xs">
                  Tipp: Wenn du alle Aufgaben richtig hast, bekommst du vielleicht einen {getRarityLabel(reward.maxPossibleRarity)} Sticker!
              </p>
          )}
        </div>
      )}

      {reward.reason === 'ALBUM_FULL' && (
         <div className="mb-8 p-6 bg-yellow-50 border-2 border-yellow-200 rounded-2xl animate-bounce">
            <div className="text-4xl mb-2">🎉🏆🎉</div>
            <p className="font-bold text-yellow-800">WOW! Album voll!</p>
            <p className="text-xs text-yellow-600 mt-1">Du hast alle Sticker gesammelt! Du bist ein echter Mathe-Profi!</p>
         </div>
      )}

      {reward.reason === 'LOW_SCORE' && (
        <div className="mb-8 p-4 bg-gray-50 rounded-xl text-gray-400 text-sm">
          Übe weiter, um mindestens 5 Fragen richtig zu haben. Dann bekommst du einen Sticker!
        </div>
      )}

      <div className="space-y-3 w-full">
        <button onClick={onOpenAlbum} className="w-full py-4 rounded-2xl font-bold text-pink-500 bg-pink-50 border-2 border-pink-100 hover:bg-pink-100 transition-all">
          Album ansehen 📒
        </button>
        <button onClick={onHome} className="w-full py-4 rounded-2xl font-bold text-white bg-purple-500 border-b-4 border-purple-700 hover:bg-purple-600 active:border-b-0 active:translate-y-1 transition-all">
          Nochmal spielen 🔄
        </button>
      </div>
    </div>
  );
};

export default SummaryScreen;
