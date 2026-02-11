
import React from 'react';
import { Equation, OperationType, TaskFormat } from '../types';

interface VisualHelpProps {
  equation: Equation;
}

const VisualHelp: React.FC<VisualHelpProps> = ({ equation }) => {
  const renderBlocks = (num: number) => {
    const z = Math.floor((num % 100) / 10);
    const e = num % 10;

    return (
      <div className="flex flex-wrap items-end gap-1 p-2 border-2 border-dashed border-gray-200 rounded-xl bg-white/50">
        <div className="flex flex-wrap gap-1 items-end">
          {Array.from({ length: z }).map((_, i) => (
            <div key={`z-${i}`} className="w-1.5 h-8 bg-blue-500 border border-blue-600 rounded-sm shadow-sm" />
          ))}
        </div>
        <div className="flex flex-wrap gap-0.5 max-w-[32px]">
          {Array.from({ length: e }).map((_, i) => (
            <div key={`e-${i}`} className="w-1.5 h-1.5 bg-red-500 border border-red-600 rounded-sm shadow-sm" />
          ))}
        </div>
      </div>
    );
  };

  const getZehnerstoppInfo = () => {
    // Only show Zehnerstopp if it's a standard task AND a crossing from a non-zero unit
    if (equation.format !== TaskFormat.STANDARD || !equation.isTensCrossing) return null;

    const unit = equation.a % 10;
    if (unit === 0) return null; 

    if (equation.type === OperationType.ADDITION) {
      const neededToTen = 10 - unit;
      const rest = equation.b - neededToTen;
      if (rest <= 0) return null; 
      return { part1: neededToTen, part2: rest, midPoint: equation.a + neededToTen };
    }
    if (equation.type === OperationType.SUBTRACTION) {
      const neededToTen = unit;
      const rest = equation.b - neededToTen;
      if (rest <= 0) return null; 
      return { part1: neededToTen, part2: rest, midPoint: equation.a - neededToTen };
    }
    return null;
  };

  const zs = getZehnerstoppInfo();

  const renderPlaceholderLogic = () => {
    let explanation = "";
    let math = "";

    if (equation.type === OperationType.ADDITION) {
      explanation = "Bei Plus kannst du die Umkehraufgabe (Minus) rechnen:";
      math = `${equation.result} - ${equation.format === TaskFormat.MISSING_PART ? equation.a : equation.b} = ?`;
    } else if (equation.type === OperationType.SUBTRACTION) {
      if (equation.format === TaskFormat.MISSING_PART) { // A - ? = C
        explanation = "Wie viel musst du wegnehmen, damit " + equation.result + " übrig bleibt?";
        math = `${equation.a} - ${equation.result} = ?`;
      } else { // ? - B = C
        explanation = "Rechne die Umkehraufgabe (Plus):";
        math = `${equation.result} + ${equation.b} = ?`;
      }
    } else if (equation.type === OperationType.MULTIPLICATION) {
      // For ? * B = C or A * ? = C, the check is C / known
      explanation = "Überlege mit der Umkehraufgabe (Geteilt):";
      math = `${equation.result} ÷ ${equation.format === TaskFormat.MISSING_PART ? equation.a : equation.b} = ?`;
    } else if (equation.type === OperationType.DIVISION) {
      // For A / ? = C or ? / B = C
      if (equation.format === TaskFormat.MISSING_PART) {
        // A / ? = C --> Check: C * ? = A
        explanation = "Welche Zahl mal " + equation.result + " ergibt " + equation.a + "?";
        math = `${equation.result} × ? = ${equation.a}`;
      } else {
        // ? / B = C --> Check: C * B = ?
        explanation = "Rechne die Umkehraufgabe (Mal):";
        math = `${equation.result} × ${equation.b} = ?`;
      }
    }

    return (
      <div className="mt-2 p-4 bg-purple-50 rounded-2xl border-2 border-purple-100 shadow-sm">
        <p className="font-bold text-purple-700 mb-1 text-sm flex items-center">
          <span className="mr-2">🧩</span> Platzhalter-Logik
        </p>
        <p className="text-gray-600 text-[11px] mb-3 leading-relaxed">{explanation}</p>
        <div className="text-center text-xl font-mono font-bold text-purple-800 bg-white py-3 rounded-xl border border-purple-200 shadow-inner">
          {math}
        </div>
      </div>
    );
  };

  const renderStandardContent = () => {
    if (equation.type === OperationType.MULTIPLICATION) {
      return (
        <div className="flex flex-col items-center space-y-2 p-4 bg-white rounded-xl shadow-inner border border-yellow-100">
          <p className="text-[10px] font-bold text-yellow-600 mb-2 uppercase tracking-wide">Das Punktefeld ({equation.a} × {equation.b})</p>
          <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${equation.b}, minmax(0, 1fr))` }}>
            {Array.from({ length: equation.a * equation.b }).map((_, i) => (
              <div key={i} className="w-2.5 h-2.5 rounded-full bg-yellow-400 border border-yellow-600 shadow-sm" />
            ))}
          </div>
          <p className="text-[9px] text-gray-400 italic mt-2">💡 Du kannst auch {equation.b} × {equation.a} rechnen!</p>
        </div>
      );
    }

    if (equation.type === OperationType.DIVISION) {
      return (
        <div className="flex flex-col items-center w-full p-4 bg-white rounded-xl shadow-inner border border-purple-100">
          <p className="text-[10px] font-bold text-purple-600 mb-3 uppercase tracking-wide">Wie oft passt die {equation.b} in die {equation.a}?</p>
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {Array.from({ length: equation.a / equation.b }).map((_, groupIdx) => (
              <div key={groupIdx} className="flex flex-wrap gap-0.5 p-1.5 bg-purple-50 border-2 border-purple-200 rounded-lg shadow-sm relative">
                <span className="absolute -top-2 -right-2 bg-purple-500 text-white text-[8px] w-4 h-4 flex items-center justify-center rounded-full font-bold shadow-sm">{groupIdx + 1}</span>
                {Array.from({ length: equation.b }).map((_, dotIdx) => (
                  <div key={dotIdx} className="w-2 h-2 rounded-full bg-purple-400" />
                ))}
              </div>
            ))}
          </div>
          <p className="text-[10px] text-gray-400 italic font-bold">💡 Umkehraufgabe: {equation.result} × {equation.b} = {equation.a}</p>
        </div>
      );
    }

    return (
      <>
        <div className="flex items-center justify-between mb-4 px-1">
          <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">
            {zs ? '💡 Schlaue Strategie' : '🔢 Einer-Zuerst Methode'}
          </p>
        </div>
        
        <div className="flex items-center justify-center space-x-6 mb-4">
          {renderBlocks(equation.a)}
          <span className="text-2xl font-bold text-pink-300">{equation.operator}</span>
          {renderBlocks(equation.b)}
        </div>

        {zs && (
          <div className="p-4 bg-orange-50/80 rounded-2xl border-2 border-orange-100 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <p className="text-[10px] font-bold text-orange-600 uppercase mb-3 text-center">Der Zehnerstopp-Weg</p>
            <div className="flex items-center justify-around">
              <div className="flex flex-col items-center">
                <div className="bg-white px-3 py-2 rounded-xl border-b-4 border-orange-200 font-bold text-gray-700 text-sm shadow-sm">
                  {equation.a} {equation.operator} <span className="text-orange-500">{zs.part1}</span>
                </div>
                <div className="text-[11px] font-bold text-gray-400 mt-1">= {zs.midPoint}</div>
              </div>
              <div className="text-2xl text-orange-300 transform scale-150">➜</div>
              <div className="flex flex-col items-center">
                <div className="bg-white px-3 py-2 rounded-xl border-b-4 border-orange-200 font-bold text-gray-700 text-sm shadow-sm">
                  {zs.midPoint} {equation.operator} <span className="text-orange-500">{zs.part2}</span>
                </div>
                <div className="text-[11px] font-bold text-gray-400 mt-1">= {equation.result}</div>
              </div>
            </div>
            <p className="text-[10px] text-gray-400 mt-4 italic text-center px-2">
              Zerlege die <span className="font-bold text-gray-600">{equation.b}</span> in <span className="text-orange-600 font-bold">{zs.part1}</span> und <span className="text-orange-600 font-bold">{zs.part2}</span>.
            </p>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="w-full mt-4 p-4 bg-white/40 rounded-[2rem] border border-blue-50 shadow-inner backdrop-blur-sm">
      {equation.format !== TaskFormat.STANDARD ? renderPlaceholderLogic() : renderStandardContent()}
    </div>
  );
};

export default VisualHelp;
