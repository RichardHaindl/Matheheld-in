
import React from 'react';

interface KeypadProps {
  onDigit: (digit: string) => void;
  onClear: () => void;
  onSubmit: () => void;
}

const Keypad: React.FC<KeypadProps> = ({ onDigit, onClear, onSubmit }) => {
  const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

  return (
    <div className="grid grid-cols-3 gap-3 w-full max-w-[320px] mt-6">
      {digits.map((d) => (
        <button
          key={d}
          onClick={() => onDigit(d)}
          className="h-16 bg-white border-b-4 border-gray-200 active:border-b-0 active:translate-y-1 rounded-2xl text-2xl font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
        >
          {d}
        </button>
      ))}
      <button
        onClick={onClear}
        className="h-16 bg-orange-100 border-b-4 border-orange-200 active:border-b-0 active:translate-y-1 rounded-2xl text-xl font-bold text-orange-600 hover:bg-orange-200 transition-all shadow-sm"
      >
        ⌫
      </button>
      <button
        onClick={onSubmit}
        className="h-16 bg-green-500 border-b-4 border-green-700 active:border-b-0 active:translate-y-1 rounded-2xl text-xl font-bold text-white hover:bg-green-600 transition-all shadow-sm flex items-center justify-center"
      >
        Fertig!
      </button>
    </div>
  );
};

export default Keypad;
