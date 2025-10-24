// Example usage of Flashcard Mastery System
import { 
  getDeckMastery, 
  recordAnswer, 
  getDeckStatistics,
  getCardsNeedingReview,
  resetDeckMastery 
} from '@/lib/flashcardMastery';

// ============================================
// Example 1: Initialize a new deck
// ============================================
const deckId = 'deck-123';
const cardIds = ['card-1', 'card-2', 'card-3'];

// Get or create deck mastery
const deckMastery = getDeckMastery(deckId, cardIds);
console.log('Initial deck state:', deckMastery);
// Output: All cards have 0 correct/incorrect, 'not-started' status

// ============================================
// Example 2: Record user answers
// ============================================

// User got card-1 correct
const card1Updated = recordAnswer(deckId, 'card-1', true);
console.log('Card 1 after correct:', card1Updated);
// Output: { correct: 1, incorrect: 0, streak: 1, masteryLevel: 'learning' }

// User got card-1 correct again
recordAnswer(deckId, 'card-1', true);
// Output: { correct: 2, incorrect: 0, streak: 2, masteryLevel: 'learning' }

// User got card-1 wrong
recordAnswer(deckId, 'card-1', false);
// Output: { correct: 2, incorrect: 1, streak: 0, masteryLevel: 'learning' }
// Note: streak resets to 0

// User got card-1 correct 3 times in a row with high accuracy
for (let i = 0; i < 3; i++) {
  recordAnswer(deckId, 'card-1', true);
}
// Output: masteryLevel will be 'mastered' (90%+ accuracy, 3+ streak)

// ============================================
// Example 3: Get deck statistics
// ============================================
const stats = getDeckStatistics(deckId);
console.log('Deck statistics:', stats);
/* Output:
{
  totalCards: 3,
  notStarted: 2,
  learning: 0,
  familiar: 0,
  mastered: 1,
  totalReviews: 6,
  accuracy: 83
}
*/

// ============================================
// Example 4: Get cards needing review
// ============================================
const needsReview = getCardsNeedingReview(deckId);
console.log('Cards to review:', needsReview);
// Output: ['card-2', 'card-3'] (cards that are not mastered)

// ============================================
// Example 5: Practice session flow
// ============================================
function practiceSession(deckId: string, cards: Array<{ id: string; question: string; answer: string }>) {
  // Start session
  console.log('Starting practice session...');
  
  cards.forEach((card, index) => {
    // Show question (in real app, this would be UI)
    console.log(`\nCard ${index + 1}: ${card.question}`);
    
    // User flips card and sees answer
    console.log(`Answer: ${card.answer}`);
    
    // User decides if they got it correct
    const isCorrect = Math.random() > 0.3; // Random for demo
    
    // Record the answer
    const result = recordAnswer(deckId, card.id, isCorrect);
    
    console.log(`Result: ${isCorrect ? '✅ Correct' : '❌ Wrong'}`);
    console.log(`Mastery: ${result.masteryLevel}, Streak: ${result.streak}`);
  });
  
  // Show session summary
  const stats = getDeckStatistics(deckId);
  console.log('\n=== Session Summary ===');
  console.log(`Total Reviews: ${stats.totalReviews}`);
  console.log(`Accuracy: ${stats.accuracy}%`);
  console.log(`Mastered: ${stats.mastered}/${stats.totalCards}`);
}

// Run practice session
const exampleCards = [
  { id: 'card-1', question: 'What is React?', answer: 'A JavaScript library for building UIs' },
  { id: 'card-2', question: 'What is TypeScript?', answer: 'A typed superset of JavaScript' },
  { id: 'card-3', question: 'What is Next.js?', answer: 'A React framework for production' },
];

practiceSession('deck-123', exampleCards);

// ============================================
// Example 6: Review mode (only unmastered cards)
// ============================================
function reviewMode(deckId: string, allCards: Array<{ id: string; question: string; answer: string }>) {
  const cardsToReview = getCardsNeedingReview(deckId);
  
  if (cardsToReview.length === 0) {
    console.log('🎉 All cards mastered! No review needed.');
    return;
  }
  
  console.log(`\n📚 Review Mode: ${cardsToReview.length} cards to review`);
  
  const reviewCards = allCards.filter(card => cardsToReview.includes(card.id));
  practiceSession(deckId, reviewCards);
}

reviewMode('deck-123', exampleCards);

// ============================================
// Example 7: Reset deck progress
// ============================================
resetDeckMastery('deck-123');
console.log('Deck progress reset!');

// ============================================
// Example 8: React Component Usage
// ============================================
/*
import React, { useState, useEffect } from 'react';
import { getDeckMastery, recordAnswer, getDeckStatistics } from '@/lib/flashcardMastery';

function PracticeComponent({ deckId, cards }) {
  const [stats, setStats] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    // Initialize deck
    getDeckMastery(deckId, cards.map(c => c.id));
    refreshStats();
  }, [deckId]);
  
  const refreshStats = () => {
    setStats(getDeckStatistics(deckId));
  };
  
  const handleAnswer = (isCorrect) => {
    const currentCard = cards[currentIndex];
    recordAnswer(deckId, currentCard.id, isCorrect);
    
    refreshStats();
    
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };
  
  return (
    <div>
      <div>Card {currentIndex + 1} of {cards.length}</div>
      <div>Mastered: {stats?.mastered}/{stats?.totalCards}</div>
      <button onClick={() => handleAnswer(false)}>Wrong</button>
      <button onClick={() => handleAnswer(true)}>Correct</button>
    </div>
  );
}
*/

export {};
