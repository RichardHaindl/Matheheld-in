
import React from 'react';
import { Equation, OperationType } from '../types';

interface FeedbackOverlayProps {
  isCorrect: boolean;
  equation: Equation;
  userAnswer: number;
  onNext: () => void;
}

const FeedbackOverlay: React.FC<FeedbackOverlayProps> = ({ isCorrect, equation, userAnswer, onNext }) => {
  
  const Confetti = () => (
    <div className="fixed inset-0 pointer-events-none z-[60]">
      {Array.from({ length: 40 }).map((_, i) => (
        <div 
          key={i}
          className="absolute animate-fall"
          style={{
            left: `${Math.random() * 100}%`,
            top: `-20px`,
            animationDuration: `${2 + Math.random() * 3}s`,
            animationDelay: `${Math.random() * 0.5}s`
          }}
        >
          <div 
            className="w-4 h-4 rounded-sm animate-spin"
            style={{
              backgroundColor: ['#f472b6', '#3b82f6', '#22c55e', '#fbbf24', '#a855f7'][Math.floor(Math.random() * 5)],
              animationDuration: `${1 + Math.random()}s`
            }}
          />
        </div>
      ))}
    </div>
  );

  return (
    <>
      {isCorrect && <Confetti />}
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        
        <div className={`relative max-w-md w-full rounded-3xl p-8 shadow-2xl border-4 text-center z-50 animate-in zoom-in-95 duration-200 ${isCorrect ? 'border-green-400 bg-green-50' : 'border-red-400 bg-red-50'}`}>
          <div className="text-7xl mb-4 animate-bounce">
            {isCorrect ? '🌟' : '🧐'}
          </div>
          
          <h2 className={`text-3xl font-bold mb-2 comic-font ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
            {isCorrect ? 'Super gemacht!' : 'Fast richtig!'}
          </h2>

          <p className="text-xl mb-6 text-gray-700">
            {isCorrect ? (
              `Genau, ${equation.a} ${equation.operator} ${equation.b} ist ${equation.result}!`
            ) : (
              <>
                Du hast <span className="font-bold underline text-red-500">{userAnswer}</span> gesagt. <br/>
                Aber <span className="font-bold text-green-600">{equation.a} {equation.operator} {equation.b} = {equation.result}</span>!
              </>
            )}
          </p>

          {!isCorrect && (
            <div className="bg-white p-4 rounded-xl mb-6 border-2 border-red-100 text-left text-sm text-gray-600">
                <p className="font-bold mb-1 text-pink-600">💡 Profi-Tipp:</p>
                {equation.type === OperationType.ADDITION && (
                  <p>Rechne zuerst die <span className="text-red-500 font-bold">Einer ({equation.a % 10} + {equation.b % 10})</span>. Vergiss den Übertrag nicht!</p>
                )}
                {equation.type === OperationType.SUBTRACTION && (
                  <p>Zuerst die <span className="text-red-500 font-bold">Einer</span>. Wenn es nicht geht, borge dir einen <span className="text-blue-500 font-bold">Zehner</span>!</p>
                )}
                {equation.type === OperationType.MULTIPLICATION && <p>Denk an die Malreihen oder das Punktefeld!</p>}
                {equation.type === OperationType.DIVISION && <p>Überlege: Wie oft passt die Zahl hinein?</p>}
            </div>
          )}

          <button
            onClick={onNext}
            autoFocus
            className={`w-full py-4 rounded-2xl text-xl font-bold text-white transition-all transform active:scale-95 shadow-lg border-b-4 ${isCorrect ? 'bg-green-500 border-green-700 hover:bg-green-600' : 'bg-red-500 border-red-700 hover:bg-red-600'}`}
          >
            {isCorrect ? 'Weiter ➡️' : 'Ich hab\'s verstanden 🆗'}
          </button>
        </div>

        <style dangerouslySetInnerHTML={{__html: `
          @keyframes fall {
            0% { transform: translateY(-20px) rotate(0deg); }
            100% { transform: translateY(100vh) rotate(720deg); }
          }
          .animate-fall {
            animation-name: fall;
            animation-timing-function: linear;
            animation-iteration-count: 1;
          }
        `}} />
      </div>
    </>
  );
};

export default FeedbackOverlay;
