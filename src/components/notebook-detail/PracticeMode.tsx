import React, { useState, useEffect } from "react";
import "react-quizlet-flashcard/dist/index.css";
import { FlashcardArray, useFlashcardArray } from "react-quizlet-flashcard";
import { Button } from "../ui/button";
import { ArrowLeft, CheckCircle2, XCircle, RotateCcw, Undo2, Trophy, BookOpen, GraduationCap } from "lucide-react";
import { FlashcardDeck } from "@/Types";
import {
  getDeckMastery,
  recordAnswer,
  getCardsNeedingReview,
  CardMastery,
} from "@/lib/flashcardMastery";
import { Progress } from "../ui/progress";
import { Badge } from "../ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface PracticeModeProps {
  deck: FlashcardDeck;
  onBackToDetail: () => void;
}

interface AnswerHistory {
  cardId: string;
  cardIndex: number;
  isCorrect: boolean;
  previousMastery: CardMastery;
}

const STORAGE_KEY_PREFIX = 'practice_session_';

const PracticeMode: React.FC<PracticeModeProps> = ({ deck, onBackToDetail }) => {
  const [deckMastery, setDeckMastery] = useState(() => 
    getDeckMastery(deck.id, deck.cards.map(c => c.id))
  );
  const [sessionStats, setSessionStats] = useState({ correct: 0, incorrect: 0, studied: 0 });
  const [hasFlipped, setHasFlipped] = useState(false);
  const [reviewMode, setReviewMode] = useState<'all' | 'review'>('all');
  const [reviewCards, setReviewCards] = useState<string[]>([]);
  const [answerHistory, setAnswerHistory] = useState<AnswerHistory[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  // Load session from localStorage
  useEffect(() => {
    const storageKey = `${STORAGE_KEY_PREFIX}${deck.id}`;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setSessionStats(data.sessionStats || { correct: 0, incorrect: 0, studied: 0 });
        setAnswerHistory(data.answerHistory || []);
      } catch (e) {
        console.error('Failed to load session:', e);
      }
    }
  }, [deck.id]);

  // Save session to localStorage
  useEffect(() => {
    const storageKey = `${STORAGE_KEY_PREFIX}${deck.id}`;
    const data = {
      sessionStats,
      answerHistory,
      timestamp: Date.now(),
    };
    localStorage.setItem(storageKey, JSON.stringify(data));
  }, [sessionStats, answerHistory, deck.id]);

  // Determine which cards to show
  const cardsToShow = reviewMode === 'review' && reviewCards.length > 0
    ? deck.cards.filter(card => reviewCards.includes(card.id))
    : deck.cards;

  const flipArrayHook = useFlashcardArray({
    deckLength: cardsToShow.length,
    showCount: false,
    showControls: false,
    cycle: false,
    onCardChange: () => {
      setHasFlipped(false);
    },
    onFlip: (cardIndex, state) => {
      // state is 'front' or 'back' string
      if (state === 'back') {
        setHasFlipped(true);
      }
    },
  });

  const refreshMastery = () => {
    const updatedMastery = getDeckMastery(deck.id, deck.cards.map(c => c.id));
    setDeckMastery(updatedMastery);
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

    // Save current state to history before making changes
    const previousMastery = { ...deckMastery.cards[currentCard.id] };
    
    // Record answer
    recordAnswer(deck.id, currentCard.id, isCorrect);
    
    // Update session stats
    setSessionStats(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      incorrect: prev.incorrect + (isCorrect ? 0 : 1),
      studied: prev.studied + 1,
    }));

    // Add to history
    setAnswerHistory(prev => [...prev, {
      cardId: currentCard.id,
      cardIndex: flipArrayHook.currentCard,
      isCorrect,
      previousMastery,
    }]);

    // Refresh deck mastery
    refreshMastery();

    // Check if this is the last card
    const isLastCard = flipArrayHook.currentCard >= cardsToShow.length - 1;
    
    if (isLastCard) {
      // Show completion screen
      setTimeout(() => {
        setIsComplete(true);
      }, 500);
    } else {
      // Move to next card after a short delay
      setTimeout(() => {
        flipArrayHook.nextCard();
      }, 500);
    }
  };

  const handleUndo = () => {
    if (answerHistory.length === 0) return;

    const lastAnswer = answerHistory[answerHistory.length - 1];
    
    // Restore previous mastery
    const masteryData = getDeckMastery(deck.id, deck.cards.map(c => c.id));
    masteryData.cards[lastAnswer.cardId] = lastAnswer.previousMastery;
    localStorage.setItem('flashcard_mastery_data', JSON.stringify(masteryData));
    
    // Update session stats (subtract the last answer)
    setSessionStats(prev => ({
      correct: prev.correct - (lastAnswer.isCorrect ? 1 : 0),
      incorrect: prev.incorrect - (lastAnswer.isCorrect ? 0 : 1),
      studied: prev.studied - 1, // Decrease studied count
    }));

    // Remove from history
    setAnswerHistory(prev => prev.slice(0, -1));

    // Refresh mastery
    refreshMastery();

    // Go back to previous card if needed
    if (flipArrayHook.currentCard > lastAnswer.cardIndex) {
      flipArrayHook.setCurrentCard(lastAnswer.cardIndex);
    }
    
    setHasFlipped(false);
    
    // If was on complete screen and undoing, go back to practice
    if (isComplete) {
      setIsComplete(false);
    }
  };

  const handleReset = () => {
    // Clear localStorage for this session
    const storageKey = `${STORAGE_KEY_PREFIX}${deck.id}`;
    localStorage.removeItem(storageKey);
    
    // Reset to first card
    while (flipArrayHook.currentCard > 0) {
      flipArrayHook.setCurrentCard(flipArrayHook.currentCard - 1);
    }
    setSessionStats({ correct: 0, incorrect: 0, studied: 0 });
    setAnswerHistory([]);
    setHasFlipped(false);
    setIsComplete(false);
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

  const handleExitComplete = () => {
    handleReset();
    onBackToDetail();
  };

  const currentCard = cardsToShow[flipArrayHook.currentCard];
  const progress = ((flipArrayHook.currentCard + 1) / cardsToShow.length) * 100;

  // Completion Screen
  if (isComplete) {
    return (
      <div className="w-[27%] flex flex-col border-l border-border overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-border bg-card">
          <button
            onClick={handleExitComplete}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-3"
          >
            <ArrowLeft className="w-4 h-4" />
            Exit Practice
          </button>
          
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-foreground">Completed!</h2>
            <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200">
              <Trophy className="w-3 h-3 mr-1" />
              Done
            </Badge>
          </div>
        </div>

        {/* Completion Stats - Vertical Layout */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-sm mx-auto space-y-4">
            {/* Trophy Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-yellow-100 flex items-center justify-center">
                <Trophy className="w-12 h-12 text-yellow-600" />
              </div>
            </div>

            {/* Stats Cards - Vertical */}
            <div className="space-y-3">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <div className="text-4xl font-bold text-green-600 mb-1">
                  {sessionStats.correct}
                </div>
                <div className="text-sm text-green-700">Correct</div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                <div className="text-4xl font-bold text-red-600 mb-1">
                  {sessionStats.incorrect}
                </div>
                <div className="text-sm text-red-700">Wrong</div>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
                <div className="text-4xl font-bold text-purple-600 mb-1">
                  {sessionStats.studied}
                </div>
                <div className="text-sm text-purple-700">Cards Studied</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-4">
              <Button
                onClick={handleReset}
                className="w-full"
                size="lg"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Practice Again
              </Button>
              <Button
                onClick={handleExitComplete}
                variant="outline"
                className="w-full"
                size="lg"
              >
                Back to Deck
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Practice Screen (existing)

  // Practice Screen
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
          <Badge variant="outline" className="text-blue-600 bg-blue-50 border-blue-200">
            {reviewMode === 'review' ? 'Review' : 'Practice'}
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

      {/* Session Stats - Compact with Icons */}
      <div className="p-3 bg-muted/30 border-b border-border">
        <TooltipProvider>
          <div className="flex items-center justify-around">
            {/* Studied */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1 cursor-help">
                  <GraduationCap className="w-4 h-4 text-purple-600" />
                  <span className="text-lg font-bold text-purple-600">
                    {sessionStats.studied}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Cards Studied</p>
              </TooltipContent>
            </Tooltip>

            {/* Correct */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1 cursor-help">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span className="text-lg font-bold text-green-600">
                    {sessionStats.correct}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Correct Answers</p>
              </TooltipContent>
            </Tooltip>

            {/* Wrong */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1 cursor-help">
                  <XCircle className="w-4 h-4 text-red-600" />
                  <span className="text-lg font-bold text-red-600">
                    {sessionStats.incorrect}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Wrong Answers</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </div>

      {/* Flashcard Display */}
      {currentCard && (
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 flex flex-col items-center justify-center p-6 overflow-auto">
            <FlashcardArray
              className="max-w-80 max-h-3/4"
              deck={cardsToShow}
              flipArrayHook={flipArrayHook}
            />
          </div>

          {/* Answer Buttons */}
          <div className="p-4 border-t border-border bg-card space-y-2">
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

            {/* Action Buttons Row with Tooltips */}
            <TooltipProvider>
              <div className="flex gap-2">
                {/* Undo Button */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={handleUndo}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      disabled={answerHistory.length === 0}
                    >
                      <Undo2 className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Undo Last Answer</p>
                  </TooltipContent>
                </Tooltip>

                {/* Mode Toggle */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={toggleReviewMode}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <BookOpen className="w-4 h-4" />
                      {reviewMode === 'review' && (
                        <span className="ml-1 text-xs">({getCardsNeedingReview(deck.id).length})</span>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{reviewMode === 'all' 
                      ? `Review Mode (${getCardsNeedingReview(deck.id).length} cards)` 
                      : 'Study All Cards'}</p>
                  </TooltipContent>
                </Tooltip>

                {/* Reset Button */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={handleReset}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Restart Session</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          </div>
        </div>
      )}
    </div>
  );
};

export default PracticeMode;
