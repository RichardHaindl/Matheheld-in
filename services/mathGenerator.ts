
import { Equation, OperationType, GameSettings, TaskFormat } from '../types';

export const generateEquation = (settings: GameSettings): Equation => {
  const activeOps = Object.entries(settings.operations)
    .filter(([_, active]) => active)
    .map(([op, _]) => op as OperationType);

  if (activeOps.length === 0) {
    activeOps.push(OperationType.ADDITION);
  }

  const type = activeOps[Math.floor(Math.random() * activeOps.length)];
  let a = 0;
  let b = 0;
  let result = 0;
  let operator = '';
  let isTensCrossing = false;
  let shortcutHint = '';

  // Increase chance of crossing tasks if allowed, to make it more challenging
  const forceCrossingChance = settings.allowTensCrossing ? 0.6 : 0;

  switch (type) {
    case OperationType.ADDITION:
      operator = '+';
      while (true) {
        a = Math.floor(Math.random() * 80) + 5;
        b = Math.floor(Math.random() * 18) + 2;
        result = a + b;
        if (result > 100) continue;
        
        // Addition crossing: Unit sum is 10 or more (e.g., 25 + 7 -> 5+7=12)
        isTensCrossing = (a % 10) + (b % 10) >= 10;
        
        if (settings.isAdvancedMode) {
          if (b === 9) shortcutHint = "Trick: Rechne +10 und dann -1";
          else if (b === 11) shortcutHint = "Trick: Rechne +10 und dann +1";
          else if (isTensCrossing && (a % 10 !== 0)) shortcutHint = `Zehnerstopp: ${a} + ${10 - (a % 10)} = ${a + 10 - (a % 10)} ...`;
        }
        
        const isDesirable = Math.random() < forceCrossingChance ? isTensCrossing : true;
        if ((settings.allowTensCrossing || !isTensCrossing) && isDesirable) break;
      }
      break;

    case OperationType.SUBTRACTION:
      operator = '-';
      while (true) {
        a = Math.floor(Math.random() * 90) + 10;
        b = Math.floor(Math.random() * 18) + 2;
        result = a - b;
        if (result < 0) continue;
        
        // Subtraction crossing: Unit of A is smaller than Unit of B (e.g., 50 - 14 -> 0 < 4)
        isTensCrossing = (a % 10) < (b % 10);
        
        if (settings.isAdvancedMode) {
          if (b === 9) shortcutHint = "Trick: Rechne -10 und dann +1";
          else if (b === 11) shortcutHint = "Trick: Rechne -10 und dann -1";
          else if (isTensCrossing && (a % 10 !== 0)) shortcutHint = `Zehnerstopp: ${a} - ${a % 10} = ${a - (a % 10)} ...`;
        }

        const isDesirable = Math.random() < forceCrossingChance ? isTensCrossing : true;
        if ((settings.allowTensCrossing || !isTensCrossing) && isDesirable) break;
      }
      break;

    case OperationType.MULTIPLICATION:
      operator = '×';
      a = Math.floor(Math.random() * 9) + 2;
      b = Math.floor(Math.random() * 8) + 3;
      result = a * b;
      isTensCrossing = result > 10;
      break;

    case OperationType.DIVISION:
      operator = '÷';
      while (true) {
        const divisor = Math.floor(Math.random() * 9) + 2;
        const quotient = Math.floor(Math.random() * 9) + 2;
        a = divisor * quotient;
        b = divisor;
        result = quotient;
        isTensCrossing = a > 10;
        if (a <= 100 && (a > 10 || Math.random() > 0.7)) break;
      }
      break;
  }

  // Handle task format for advanced mode
  let format = TaskFormat.STANDARD;
  let targetValue = result;
  let displayValue1: any = a;
  let displayValue2: any = b;
  let displayValue3: any = result;

  if (settings.isAdvancedMode && Math.random() > 0.4) {
    const r = Math.random();
    if (r > 0.5) {
      format = TaskFormat.MISSING_PART; // A + ? = C
      displayValue2 = '?';
      targetValue = b;
      // Hide calculation hints that would reveal 'b'
      shortcutHint = ''; 
    } else {
      format = TaskFormat.MISSING_START; // ? + B = C
      displayValue1 = '?';
      targetValue = a;
      // Hide calculation hints that would reveal 'a'
      shortcutHint = '';
    }
  } else {
    displayValue3 = '?';
  }

  return {
    id: Math.random().toString(36).substr(2, 9),
    a, b, operator, result, type, isTensCrossing,
    format, targetValue, displayValue1, displayValue2, displayValue3,
    shortcutHint
  };
};
