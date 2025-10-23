// Flashcard Mastery Tracking System
// Inspired by Quizlet's learning algorithm

export interface CardMastery {
  cardId: string;
  correct: number;
  incorrect: number;
  lastReviewed: string; // ISO date string
  masteryLevel: 'not-started' | 'learning' | 'familiar' | 'mastered';
  streak: number; // consecutive correct answers
}

export interface DeckMastery {
  deckId: string;
  cards: Record<string, CardMastery>; // cardId -> CardMastery
  totalReviews: number;
  lastPracticed: string; // ISO date string
  practiceMode: 'study' | 'review' | 'test';
}

export interface FlashcardMasteryData {
  decks: Record<string, DeckMastery>; // deckId -> DeckMastery
}

const STORAGE_KEY = 'flashcard_mastery_data';

// Calculate mastery level based on performance
export const calculateMasteryLevel = (
  correct: number,
  incorrect: number,
  streak: number
): CardMastery['masteryLevel'] => {
  const total = correct + incorrect;
  
  if (total === 0) return 'not-started';
  
  const accuracy = correct / total;
  
  // Mastered: 90%+ accuracy with 3+ streak
  if (accuracy >= 0.9 && streak >= 3) return 'mastered';
  
  // Familiar: 70%+ accuracy with 2+ streak
  if (accuracy >= 0.7 && streak >= 2) return 'familiar';
  
  // Learning: has some practice
  if (total >= 1) return 'learning';
  
  return 'not-started';
};

// Get mastery color for UI
export const getMasteryColor = (level: CardMastery['masteryLevel']): string => {
  switch (level) {
    case 'mastered':
      return 'text-green-600 bg-green-50 border-green-200';
    case 'familiar':
      return 'text-blue-600 bg-blue-50 border-blue-200';
    case 'learning':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

// Load mastery data from localStorage
export const loadMasteryData = (): FlashcardMasteryData => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return { decks: {} };
    
    const parsed = JSON.parse(data);
    
    // Validate structure
    if (!parsed.decks || typeof parsed.decks !== 'object') {
      console.warn('Invalid mastery data structure, resetting...');
      return { decks: {} };
    }
    
    return parsed;
  } catch (error) {
    console.error('Failed to load mastery data:', error);
    return { decks: {} };
  }
};

// Save mastery data to localStorage
export const saveMasteryData = (data: FlashcardMasteryData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save mastery data:', error);
  }
};

// Clear all mastery data (for debugging/reset)
export const clearMasteryData = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    console.log('Mastery data cleared');
  } catch (error) {
    console.error('Failed to clear mastery data:', error);
  }
};

// Initialize deck mastery if not exists
export const initializeDeckMastery = (
  deckId: string,
  cardIds: string[]
): DeckMastery => {
  const cards: Record<string, CardMastery> = {};
  
  cardIds.forEach(cardId => {
    cards[cardId] = {
      cardId,
      correct: 0,
      incorrect: 0,
      lastReviewed: new Date().toISOString(),
      masteryLevel: 'not-started',
      streak: 0,
    };
  });
  
  return {
    deckId,
    cards,
    totalReviews: 0,
    lastPracticed: new Date().toISOString(),
    practiceMode: 'study',
  };
};

// Get deck mastery, initialize if not exists
export const getDeckMastery = (deckId: string, cardIds: string[]): DeckMastery => {
  const data = loadMasteryData();
  
  if (!data.decks[deckId]) {
    const deckMastery = initializeDeckMastery(deckId, cardIds);
    data.decks[deckId] = deckMastery;
    saveMasteryData(data);
    return deckMastery;
  }
  
  const currentDeck = data.decks[deckId];
  
  // Fix corrupted data - if cards is undefined or not an object, reinitialize
  if (!currentDeck.cards || typeof currentDeck.cards !== 'object') {
    console.warn('Corrupted deck data detected, reinitializing...');
    currentDeck.cards = {};
  }
  
  // Ensure all cards exist (in case new cards were added)
  const existingCardIds = Object.keys(currentDeck.cards);
  const missingCardIds = cardIds.filter(id => !existingCardIds.includes(id));
  
  if (missingCardIds.length > 0) {
    missingCardIds.forEach(cardId => {
      currentDeck.cards[cardId] = {
        cardId,
        correct: 0,
        incorrect: 0,
        lastReviewed: new Date().toISOString(),
        masteryLevel: 'not-started',
        streak: 0,
      };
    });
    saveMasteryData(data);
  }
  
  return currentDeck;
};

// Record answer (correct or incorrect)
export const recordAnswer = (
  deckId: string,
  cardId: string,
  isCorrect: boolean
): CardMastery => {
  const data = loadMasteryData();
  
  // Safe check for deck existence
  if (!data.decks || !data.decks[deckId]) {
    console.error(`Deck ${deckId} not found`);
    // Return default card mastery
    return {
      cardId,
      correct: isCorrect ? 1 : 0,
      incorrect: isCorrect ? 0 : 1,
      lastReviewed: new Date().toISOString(),
      masteryLevel: 'learning',
      streak: isCorrect ? 1 : 0,
    };
  }
  
  const deckMastery = data.decks[deckId];
  
  if (!deckMastery.cards || !deckMastery.cards[cardId]) {
    console.error(`Card ${cardId} not found in deck ${deckId}`);
    // Initialize card if not exists
    deckMastery.cards = deckMastery.cards || {};
    deckMastery.cards[cardId] = {
      cardId,
      correct: 0,
      incorrect: 0,
      lastReviewed: new Date().toISOString(),
      masteryLevel: 'not-started',
      streak: 0,
    };
  }
  
  const cardMastery = deckMastery.cards[cardId];
  
  // Update stats
  if (isCorrect) {
    cardMastery.correct++;
    cardMastery.streak++;
  } else {
    cardMastery.incorrect++;
    cardMastery.streak = 0; // reset streak on wrong answer
  }
  
  cardMastery.lastReviewed = new Date().toISOString();
  cardMastery.masteryLevel = calculateMasteryLevel(
    cardMastery.correct,
    cardMastery.incorrect,
    cardMastery.streak
  );
  
  // Update deck stats
  deckMastery.totalReviews++;
  deckMastery.lastPracticed = new Date().toISOString();
  
  saveMasteryData(data);
  
  return cardMastery;
};

// Get cards that need review (not mastered)
export const getCardsNeedingReview = (deckId: string): string[] => {
  const data = loadMasteryData();
  
  // Safe access with null checks
  if (!data.decks || !data.decks[deckId] || !data.decks[deckId].cards) {
    return [];
  }
  
  const deckMastery = data.decks[deckId];
  
  return Object.values(deckMastery.cards)
    .filter(card => card.masteryLevel !== 'mastered')
    .sort((a, b) => {
      // Priority: incorrect > learning > familiar > not-started
      const priority = {
        'not-started': 3,
        'learning': 2,
        'familiar': 1,
        'mastered': 0,
      };
      
      // Sort by priority first, then by incorrect count
      const priorityDiff = priority[b.masteryLevel] - priority[a.masteryLevel];
      if (priorityDiff !== 0) return priorityDiff;
      
      return b.incorrect - a.incorrect;
    })
    .map(card => card.cardId);
};

// Get deck statistics
export const getDeckStatistics = (deckId: string) => {
  const data = loadMasteryData();
  
  // Safe access with null check
  if (!data.decks || !data.decks[deckId]) {
    return {
      totalCards: 0,
      notStarted: 0,
      learning: 0,
      familiar: 0,
      mastered: 0,
      totalReviews: 0,
      accuracy: 0,
    };
  }
  
  const deckMastery = data.decks[deckId];
  const cards = Object.values(deckMastery.cards || {});
  const totalCards = cards.length;
  
  const stats = cards.reduce(
    (acc, card) => {
      acc[card.masteryLevel]++;
      acc.totalCorrect += card.correct;
      acc.totalIncorrect += card.incorrect;
      return acc;
    },
    {
      'not-started': 0,
      'learning': 0,
      'familiar': 0,
      'mastered': 0,
      totalCorrect: 0,
      totalIncorrect: 0,
    }
  );
  
  const totalAnswers = stats.totalCorrect + stats.totalIncorrect;
  const accuracy = totalAnswers > 0 ? (stats.totalCorrect / totalAnswers) * 100 : 0;
  
  return {
    totalCards,
    notStarted: stats['not-started'],
    learning: stats['learning'],
    familiar: stats['familiar'],
    mastered: stats['mastered'],
    totalReviews: deckMastery.totalReviews,
    accuracy: Math.round(accuracy),
  };
};

// Reset deck mastery
export const resetDeckMastery = (deckId: string): void => {
  const data = loadMasteryData();
  
  if (data.decks[deckId]) {
    delete data.decks[deckId];
    saveMasteryData(data);
  }
};

// Set practice mode
export const setPracticeMode = (
  deckId: string,
  mode: DeckMastery['practiceMode']
): void => {
  const data = loadMasteryData();
  
  if (data.decks[deckId]) {
    data.decks[deckId].practiceMode = mode;
    saveMasteryData(data);
  }
};
