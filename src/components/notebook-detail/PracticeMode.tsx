import React, { useState, useEffect } from "react";
import "react-quizlet-flashcard/dist/index.css";
import { FlashcardArray, useFlashcardArray } from "react-quizlet-flashcard";
import { Button } from "../ui/button";
import { ArrowLeft, CheckCircle2, XCircle, RotateCcw, Award, BookOpen } from "lucide-react";
import { FlashcardDeck } from "@/Types";
import {
  getDeckMastery,
  recordAnswer,
  getDeckStatistics,
  getCardsNeedingReview,
  CardMastery,
  getMasteryColor,
} from "@/lib/flashcardMastery";
import { Progress } from "../ui/progress";
import { Badge } from "../ui/badge";

interface PracticeModeProps {
  deck: FlashcardDeck;
  onBackToDetail: () => void;
}

const PracticeMode: React.FC<PracticeModeProps> = ({ deck, onBackToDetail }) => {
  const [deckMastery, setDeckMastery] = useState(() => 
    getDeckMastery(deck.id, deck.cards.map(c => c.id))
  );
  const [stats, setStats] = useState(() => getDeckStatistics(deck.id));
  const [sessionStats, setSessionStats] = useState({ correct: 0, incorrect: 0 });
  const [currentCardMastery, setCurrentCardMastery] = useState<CardMastery | null>(null);
  const [hasFlipped, setHasFlipped] = useState(false);
  const [reviewMode, setReviewMode] = useState<'all' | 'review'>('all');
  const [reviewCards, setReviewCards] = useState<string[]>([]);

  // Determine which cards to show
  const cardsToShow = reviewMode === 'review' && reviewCards.length > 0
    ? deck.cards.filter(card => reviewCards.includes(card.id))
    : deck.cards;

  const flipArrayHook = useFlashcardArray({
    deckLength: cardsToShow.length,
    showCount: false,
    showControls: false,
    cycle: false,
    onCardChange: (cardIndex) => {
      const card = cardsToShow[cardIndex];
      if (card && deckMastery.cards[card.id]) {
        setCurrentCardMastery(deckMastery.cards[card.id]);
      }
      setHasFlipped(false);
    },
    onFlip: (cardIndex, state) => {
      // state is 'front' or 'back' string
      if (state === 'back') {
        setHasFlipped(true);
      }
    },
  });

  // Initialize current card mastery
  useEffect(() => {
    if (cardsToShow.length > 0) {
      const firstCard = cardsToShow[0];
      if (firstCard && deckMastery.cards[firstCard.id]) {
        setCurrentCardMastery(deckMastery.cards[firstCard.id]);
      }
    }
  }, [cardsToShow, deckMastery.cards]);

  const refreshStats = () => {
    const updatedMastery = getDeckMastery(deck.id, deck.cards.map(c => c.id));
    const updatedStats = getDeckStatistics(deck.id);
    setDeckMastery(updatedMastery);
    setStats(updatedStats);
  };

  const handleAnswer = (isCorrect: boolean) => {
    if (!hasFlipped) {
      // Force flip to back first if not flipped
      flipArrayHook.flipHook.flip();
      setHasFlipped(true);
      return;
    }

    const currentCard = cardsToShow[flipArrayHook.currentCard];
    if (!currentCard) return;

    // Record answer
    const updatedCardMastery = recordAnswer(deck.id, currentCard.id, isCorrect);
    
    // Update session stats
    setSessionStats(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      incorrect: prev.incorrect + (isCorrect ? 0 : 1),
    }));

    // Update current card mastery
    setCurrentCardMastery(updatedCardMastery);

    // Refresh deck stats
    refreshStats();

    // Move to next card after a short delay
    setTimeout(() => {
      if (flipArrayHook.currentCard < cardsToShow.length - 1) {
        flipArrayHook.nextCard();
      }
    }, 500);
  };

  const handleReset = () => {
    // Reset to first card
    while (flipArrayHook.currentCard > 0) {
      flipArrayHook.setCurrentCard(flipArrayHook.currentCard - 1);
    }
    setSessionStats({ correct: 0, incorrect: 0 });
    setHasFlipped(false);
  };

  const toggleReviewMode = () => {
    const needsReview = getCardsNeedingReview(deck.id);
    setReviewCards(needsReview);
    
    if (reviewMode === 'all') {
      setReviewMode('review');
      // Reset to first card when switching modes
      handleReset();
    } else {
      setReviewMode('all');
      handleReset();
    }
  };

  const currentCard = cardsToShow[flipArrayHook.currentCard];
  const progress = ((flipArrayHook.currentCard + 1) / cardsToShow.length) * 100;
  const sessionTotal = sessionStats.correct + sessionStats.incorrect;
  const sessionAccuracy = sessionTotal > 0 
    ? Math.round((sessionStats.correct / sessionTotal) * 100) 
    : 0;

  return (
    <div className="w-[27%] flex flex-col border-l border-border overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border bg-card">
        <button
          onClick={onBackToDetail}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
          Exit Practice
        </button>
        
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-foreground">Practice Mode</h2>
          <Badge variant="outline" className={getMasteryColor(currentCardMastery?.masteryLevel || 'not-started')}>
            {currentCardMastery?.masteryLevel.replace('-', ' ')}
          </Badge>
        </div>
        
        <p className="text-sm text-muted-foreground mb-3">
          {deck.title}
        </p>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Card {flipArrayHook.currentCard + 1} of {cardsToShow.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Session Stats */}
      <div className="p-4 bg-muted/30 border-b border-border">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <div className="text-2xl font-bold text-green-600">
              {sessionStats.correct}
            </div>
            <div className="text-xs text-muted-foreground">Correct</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-600">
              {sessionStats.incorrect}
            </div>
            <div className="text-xs text-muted-foreground">Wrong</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {sessionAccuracy}%
            </div>
            <div className="text-xs text-muted-foreground">Accuracy</div>
          </div>
        </div>
      </div>

      {/* Overall Deck Stats */}
      <div className="p-4 bg-card border-b border-border">
        <div className="flex items-center gap-2 mb-2">
          <Award className="w-4 h-4 text-yellow-600" />
          <span className="text-sm font-medium">Deck Progress</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Mastered:</span>
            <span className="font-medium text-green-600">{stats.mastered}/{stats.totalCards}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Familiar:</span>
            <span className="font-medium text-blue-600">{stats.familiar}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Learning:</span>
            <span className="font-medium text-yellow-600">{stats.learning}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Accuracy:</span>
            <span className="font-medium">{stats.accuracy}%</span>
          </div>
        </div>
      </div>

      {/* Flashcard Display */}
      {currentCard && (
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 flex flex-col items-center justify-center p-6 overflow-auto">
            <FlashcardArray
              className="max-w-80"
              deck={cardsToShow}
              flipArrayHook={flipArrayHook}
            />
            
            {/* Hint */}
            {!hasFlipped && (
              <p className="text-xs text-muted-foreground mt-4 text-center">
                Click card to reveal answer
              </p>
            )}
          </div>

          {/* Answer Buttons */}
          <div className="p-4 border-t border-border bg-card space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={() => handleAnswer(false)}
                variant="outline"
                className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                disabled={!hasFlipped}
              >
                <XCircle className="w-4 h-4 mr-2" />
                Wrong
              </Button>
              <Button
                onClick={() => handleAnswer(true)}
                variant="outline"
                className="border-green-200 text-green-600 hover:bg-green-50 hover:text-green-700"
                disabled={!hasFlipped}
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Correct
              </Button>
            </div>

            {/* Mode Toggle */}
            <Button
              onClick={toggleReviewMode}
              variant="outline"
              className="w-full"
              size="sm"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              {reviewMode === 'all' 
                ? `Review Mode (${getCardsNeedingReview(deck.id).length} cards)` 
                : 'Study All Cards'}
            </Button>

            {/* Reset Button */}
            <Button
              onClick={handleReset}
              variant="ghost"
              className="w-full"
              size="sm"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Restart Session
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PracticeMode;
