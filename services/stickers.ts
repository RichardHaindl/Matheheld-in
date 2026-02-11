
import { Sticker, GameSettings } from '../types';

export const ALL_STICKERS: Sticker[] = [
  // Animals
  { id: 'cat', emoji: '🐱', name: 'Minka', rarity: 'COMMON', category: 'ANIMALS' },
  { id: 'dog', emoji: '🐶', name: 'Bello', rarity: 'COMMON', category: 'ANIMALS' },
  { id: 'fox', emoji: '🦊', name: 'Foxy', rarity: 'RARE', category: 'ANIMALS' },
  { id: 'lion', emoji: '🦁', name: 'Leo', rarity: 'EPIC', category: 'ANIMALS' },
  { id: 'unicorn', emoji: '🦄', name: 'Sternschnuppe', rarity: 'LEGENDARY', category: 'ANIMALS' },
  { id: 'dino', emoji: '🦖', name: 'Rex', rarity: 'LEGENDARY', category: 'ANIMALS' },
  { id: 'panda', emoji: '🐼', name: 'Bambus', rarity: 'RARE', category: 'ANIMALS' },
  { id: 'koala', emoji: '🐨', name: 'Koko', rarity: 'COMMON', category: 'ANIMALS' },
  { id: 'frog', emoji: '🐸', name: 'Quak', rarity: 'COMMON', category: 'ANIMALS' },
  { id: 'butterfly', emoji: '🦋', name: 'Falter', rarity: 'RARE', category: 'ANIMALS' },

  // Space
  { id: 'rocket', emoji: '🚀', name: 'Rakete', rarity: 'RARE', category: 'SPACE' },
  { id: 'alien', emoji: '👽', name: 'Zorg', rarity: 'EPIC', category: 'SPACE' },
  { id: 'planet', emoji: '🪐', name: 'Saturn', rarity: 'LEGENDARY', category: 'SPACE' },
  { id: 'star', emoji: '⭐', name: 'Sternchen', rarity: 'COMMON', category: 'SPACE' },
  { id: 'astronaut', emoji: '👨‍🚀', name: 'Tom', rarity: 'LEGENDARY', category: 'SPACE' },
  { id: 'moon', emoji: '🌙', name: 'Luna', rarity: 'COMMON', category: 'SPACE' },
  { id: 'ufo', emoji: '🛸', name: 'Ufo', rarity: 'EPIC', category: 'SPACE' },

  // Food
  { id: 'pizza', emoji: '🍕', name: 'Pizza', rarity: 'COMMON', category: 'FOOD' },
  { id: 'icecream', emoji: '🍦', name: 'Vanille', rarity: 'COMMON', category: 'FOOD' },
  { id: 'donut', emoji: '🍩', name: 'Streusel', rarity: 'RARE', category: 'FOOD' },
  { id: 'cookie', emoji: '🍪', name: 'Keks', rarity: 'COMMON', category: 'FOOD' },
  { id: 'burger', emoji: '🍔', name: 'Burger', rarity: 'COMMON', category: 'FOOD' },
  { id: 'fries', emoji: '🍟', name: 'Pommes', rarity: 'COMMON', category: 'FOOD' },
  { id: 'cupcake', emoji: '🧁', name: 'Törtchen', rarity: 'RARE', category: 'FOOD' },
  
  // Objects
  { id: 'gem', emoji: '💎', name: 'Diamant', rarity: 'LEGENDARY', category: 'OBJECTS' },
  { id: 'crown', emoji: '👑', name: 'Krone', rarity: 'LEGENDARY', category: 'OBJECTS' },
  { id: 'gift', emoji: '🎁', name: 'Geschenk', rarity: 'COMMON', category: 'OBJECTS' },
  { id: 'balloon', emoji: '🎈', name: 'Luftballon', rarity: 'COMMON', category: 'OBJECTS' },
  { id: 'trophy', emoji: '🏆', name: 'Pokal', rarity: 'EPIC', category: 'OBJECTS' },
  { id: 'guitar', emoji: '🎸', name: 'Rockstar', rarity: 'EPIC', category: 'OBJECTS' },
  { id: 'robot', emoji: '🤖', name: 'Robo', rarity: 'RARE', category: 'OBJECTS' },
  { id: 'medal', emoji: '🥇', name: 'Medaille', rarity: 'EPIC', category: 'OBJECTS' }
];

interface RewardResult {
  sticker: Sticker | null;
  reason: 'LOW_SCORE' | 'ALBUM_FULL' | 'SUCCESS';
  rarityWon?: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
  maxPossibleRarity?: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
}

export const getRewardSticker = (collectedIds: string[], score: number, total: number, settings: GameSettings): RewardResult => {
  const percentage = score / total;

  if (percentage < 0.5) {
    return { sticker: null, reason: 'LOW_SCORE' };
  }

  // 1. Determine Max Potential Rarity based on Mode
  // Levels: 0=Common, 1=Rare, 2=Epic, 3=Legendary
  let maxPotentialLevel = 0; 
  if (settings.allowTensCrossing && settings.isAdvancedMode) {
    maxPotentialLevel = 3; // Legendary
  } else if (settings.isAdvancedMode) {
    maxPotentialLevel = 2; // Epic
  } else if (settings.allowTensCrossing) {
    maxPotentialLevel = 1; // Rare
  } else {
    maxPotentialLevel = 0; // Common
  }

  // 2. Adjust Rarity based on Score (Performance Drop)
  let wonLevel = -1;
  if (percentage === 1) { // 100% -> Max Reward
    wonLevel = maxPotentialLevel;
  } else if (percentage >= 0.8) { // 80%+ -> One tier lower
    wonLevel = Math.max(0, maxPotentialLevel - 1);
  } else { // 50%+ -> Two tiers lower (min Common)
    wonLevel = Math.max(0, maxPotentialLevel - 2);
  }

  const rarityMap = ['COMMON', 'RARE', 'EPIC', 'LEGENDARY'] as const;
  const wonRarity = rarityMap[wonLevel];
  const maxPossibleRarity = rarityMap[maxPotentialLevel];

  // 3. Select Sticker
  const uncollected = ALL_STICKERS.filter(s => !collectedIds.includes(s.id));
  
  if (uncollected.length === 0) {
    return { sticker: null, reason: 'ALBUM_FULL' };
  }

  // Try to find a sticker of the won rarity
  // If full, downgrade to lower rarities until we find one
  let selectedSticker: Sticker | undefined;
  
  // Search order: Won Rarity -> Lower Rarities -> Higher Rarities (if everything low is full)
  // Construct search order
  const searchOrder = [];
  // Add won level down to 0
  for (let i = wonLevel; i >= 0; i--) searchOrder.push(rarityMap[i]);
  // Add levels above won level (in case they collected all commons/rares but have legendaries left)
  for (let i = wonLevel + 1; i <= 3; i++) searchOrder.push(rarityMap[i]);

  for (const r of searchOrder) {
    const available = uncollected.filter(s => s.rarity === r);
    if (available.length > 0) {
      const randomIndex = Math.floor(Math.random() * available.length);
      selectedSticker = available[randomIndex];
      break;
    }
  }

  // Fallback (should be covered by above, but safe check)
  if (!selectedSticker) {
     const randomIndex = Math.floor(Math.random() * uncollected.length);
     selectedSticker = uncollected[randomIndex];
  }

  return { 
    sticker: selectedSticker, 
    reason: 'SUCCESS',
    rarityWon: selectedSticker.rarity, // Use the actual rarity of the sticker found
    maxPossibleRarity
  };
};
