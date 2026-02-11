
export enum OperationType {
  ADDITION = 'ADDITION',
  SUBTRACTION = 'SUBTRACTION',
  MULTIPLICATION = 'MULTIPLICATION',
  DIVISION = 'DIVISION'
}

export enum TaskFormat {
  STANDARD = 'STANDARD', // A + B = ?
  MISSING_PART = 'MISSING_PART', // A + ? = C
  MISSING_START = 'MISSING_START' // ? + B = C
}

export enum GameState {
  SETTINGS = 'SETTINGS',
  PLAYING = 'PLAYING',
  SUMMARY = 'SUMMARY',
  ALBUM = 'ALBUM'
}

export interface Equation {
  id: string;
  a: number;
  b: number;
  operator: string;
  result: number;
  type: OperationType;
  isTensCrossing: boolean;
  format: TaskFormat;
  targetValue: number; // The value the user needs to enter
  displayValue1: string | number;
  displayValue2: string | number;
  displayValue3: string | number;
  shortcutHint?: string;
}

export interface GameSettings {
  operations: {
    [key in OperationType]: boolean;
  };
  allowTensCrossing: boolean;
  isAdvancedMode: boolean;
  maxRange: number;
  questionsPerSession: number;
}

export interface GameResult {
  equation: Equation;
  userAnswer: number;
  isCorrect: boolean;
  timestamp: number;
}

export interface Sticker {
  id: string;
  emoji: string;
  name: string;
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
  category: 'ANIMALS' | 'SPACE' | 'FOOD' | 'OBJECTS';
}
