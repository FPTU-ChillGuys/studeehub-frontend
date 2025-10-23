# Flashcard Practice Mode & Mastery Tracking

## 📚 Overview

Hệ thống học tập flashcard với Practice Mode và theo dõi tiến độ mastery, lấy cảm hứng từ Quizlet.

## ✨ Features Implemented

### F3: Review Flashcards - Practice Mode
- **Study Mode**: Học tất cả các thẻ trong deck
- **Review Mode**: Chỉ học các thẻ chưa mastered (cần ôn tập)
- **Interactive Practice**: Click card để flip, sau đó chọn Correct/Wrong
- **Real-time Feedback**: Cập nhật mastery level ngay lập tức
- **Session Statistics**: Theo dõi correct/wrong trong phiên học

### F4: Track Flashcard Mastery
- **4 Mastery Levels**:
  - 🆕 **Not Started**: Chưa học
  - 📖 **Learning**: Đang học (có một số lần thực hành)
  - 💡 **Familiar**: Quen thuộc (≥70% accuracy, streak ≥2)
  - ⭐ **Mastered**: Thuộc lòng (≥90% accuracy, streak ≥3)

- **Statistics Tracked**:
  - ✅ Correct count per card
  - ❌ Incorrect count per card
  - 🔥 Streak (consecutive correct answers)
  - 📊 Overall deck accuracy
  - 📈 Total reviews count
  - 📅 Last reviewed timestamp

### 💾 LocalStorage Persistence
- Tất cả dữ liệu mastery được lưu trong localStorage
- Key: `flashcard_mastery_data`
- Tự động sync mỗi lần answer
- Giữ nguyên progress khi refresh page

## 🏗️ Architecture

### New Files Created

1. **`/src/lib/flashcardMastery.ts`**
   - Core logic cho mastery tracking
   - LocalStorage management
   - Statistics calculation
   - Algorithm để tính mastery level

2. **`/src/components/notebook-detail/PracticeMode.tsx`**
   - Practice Mode UI
   - Wrong/Right buttons
   - Real-time stats display
   - Review mode toggle

3. **`/src/components/notebook-detail/FlashcardStats.tsx`**
   - Mini stats widget cho deck list
   - Hiển thị mastered count và accuracy

4. **`/src/components/ui/progress.tsx`**
   - Progress bar component
   - Sử dụng trong practice mode

### Modified Files

1. **`/src/Types/index.ts`**
   - Added `FlashcardWithId` interface
   - Extended `FlashcardDeck` to use cards with IDs

2. **`/src/components/notebook-detail/FlashcardDetail.tsx`**
   - Added "Practice Mode" button
   - Toggle between normal view và practice mode

3. **`/src/components/notebook-detail/FlashcardsList.tsx`**
   - Integrated `FlashcardStats` component
   - Hiển thị progress trong list view

## 🎯 How It Works

### Mastery Algorithm

```typescript
function calculateMasteryLevel(correct, incorrect, streak):
  total = correct + incorrect
  
  if total == 0:
    return 'not-started'
  
  accuracy = correct / total
  
  if accuracy >= 0.9 AND streak >= 3:
    return 'mastered'
  
  if accuracy >= 0.7 AND streak >= 2:
    return 'familiar'
  
  if total >= 1:
    return 'learning'
  
  return 'not-started'
```

### Data Structure

```typescript
{
  decks: {
    "deck-id-1": {
      deckId: "deck-id-1",
      totalReviews: 25,
      lastPracticed: "2025-10-23T...",
      practiceMode: "study",
      cards: {
        "card-id-1": {
          cardId: "card-id-1",
          correct: 8,
          incorrect: 2,
          streak: 3,
          lastReviewed: "2025-10-23T...",
          masteryLevel: "mastered"
        },
        // ... more cards
      }
    },
    // ... more decks
  }
}
```

## 🎮 User Flow

### Normal Study Mode
1. User clicks vào một deck trong list
2. View chuyển sang FlashcardDetail
3. Click "Practice Mode" button
4. PracticeMode component loads với deck data
5. User flip card và chọn Correct/Wrong
6. Stats cập nhật real-time
7. Auto move to next card

### Review Mode
1. Trong Practice Mode, click "Review Mode"
2. Hệ thống filter chỉ các cards chưa mastered
3. Sắp xếp theo priority: incorrect > learning > familiar
4. Practice chỉ các cards cần ôn tập

### Mastery Progression
```
Not Started → Learning → Familiar → Mastered
     ↓            ↓          ↓           ↓
   0 tries    1+ tries   70%+ acc    90%+ acc
                         2+ streak   3+ streak
```

## 🔧 API Reference

### flashcardMastery.ts

```typescript
// Load data from localStorage
loadMasteryData(): FlashcardMasteryData

// Save data to localStorage  
saveMasteryData(data: FlashcardMasteryData): void

// Get or initialize deck mastery
getDeckMastery(deckId: string, cardIds: string[]): DeckMastery

// Record answer (updates mastery)
recordAnswer(deckId: string, cardId: string, isCorrect: boolean): CardMastery

// Get cards needing review
getCardsNeedingReview(deckId: string): string[]

// Get statistics
getDeckStatistics(deckId: string): DeckStats

// Reset deck progress
resetDeckMastery(deckId: string): void

// Utility functions
calculateMasteryLevel(correct, incorrect, streak): MasteryLevel
getMasteryColor(level: MasteryLevel): string
```

## 🎨 UI Components

### Practice Mode Layout
```
┌─────────────────────────────┐
│ ← Exit Practice             │
│ Practice Mode    [Learning] │
│ Deck Title                  │
│ Progress: Card 5/10 ████░░  │
├─────────────────────────────┤
│ Session: 3 ✅ 1 ❌ 75% 📊   │
├─────────────────────────────┤
│ Deck Progress               │
│ Mastered: 2/10              │
│ Familiar: 3  Learning: 5    │
├─────────────────────────────┤
│                             │
│     [Flashcard Display]     │
│                             │
├─────────────────────────────┤
│ [❌ Wrong]    [✅ Correct]  │
│ [📖 Review Mode (3 cards)]  │
│ [↻ Restart Session]         │
└─────────────────────────────┘
```

## 📊 Statistics Dashboard

### Deck List View
Each deck card shows:
- Title
- Card count
- 🏆 Mastered: X/Total
- 📈 Accuracy: X%

## 🔮 Future Enhancements

### Phase 2 (Backend Integration)
- [ ] Save mastery data to database
- [ ] Sync across devices
- [ ] Historical progress charts
- [ ] Spaced repetition algorithm (SM-2)

### Phase 3 (Advanced Features)
- [ ] Daily streak tracking
- [ ] Achievement system
- [ ] Study reminders
- [ ] Export progress reports
- [ ] Competitive leaderboards

## 🐛 Known Limitations

1. **LocalStorage only**: Data chỉ lưu local, không sync cross-device
2. **No spaced repetition**: Chưa có algorithm SR như Anki
3. **Manual card flip**: User phải flip trước khi answer
4. **No undo**: Không thể undo wrong answer

## 📝 Notes

- Mastery levels dựa trên Quizlet's learning system
- Streak reset về 0 khi answer wrong
- Review mode auto-sort cards by priority
- All timestamps are ISO 8601 format
- Data persists until user clears browser data

## 🎓 References

- [react-quizlet-flashcard Documentation](https://flashcard.abs.moe/docs)
- [Quizlet Learning System](https://quizlet.com/features/learn)
- [Spaced Repetition (SuperMemo SM-2)](https://www.supermemo.com/en/archives1990-2015/english/ol/sm2)
