import { Card } from './gameLogic';
import { findSumCombinations } from './gameLogic';

export class BasraBot {
  private memory: {
    playedCards: Card[];
    remainingCards: Card[];
  };

  constructor(initialDeck: Card[]) {
    this.memory = {
      playedCards: [],
      remainingCards: [...initialDeck]
    };
  }

  // Main decision making function
  public makeMove(table: Card[], hand: Card[]): Card {
    // Update memory
    this.updateMemory(hand);

    // 1. Check for guaranteed Basra opportunities
    const basraMove = this.findGuaranteedBasra(table, hand);
    if (basraMove) return basraMove;

    // 2. Avoid setting up opponent Basras
    const safeCards = this.filterDangerousCards(table, hand);

    // 3. Prioritize playing non-7♦ when possible
    const nonDangerous = safeCards.filter(card => 
      !(card.rank === '7' && card.suit === 'diamonds')
    );

    // 4. Select optimal card to play
    return this.selectOptimalCard(
      nonDangerous.length > 0 ? nonDangerous : safeCards,
      table
    );
  }

  private updateMemory(hand: Card[]): void {
    // In a complete implementation, this would track which cards have been played
    // For GitHub web editor, we'll keep it simple
  }

  private findGuaranteedBasra(table: Card[], hand: Card[]): Card | null {
    for (const card of hand) {
      // Check for direct matches
      if (table.some(t => t.rank === card.rank)) {
        return card;
      }

      // Check for sum combinations
      const combinations = findSumCombinations(table, card.value);
      if (combinations.length > 0) {
        // Prefer combinations that don't leave valuable cards
        const safeCombination = combinations.find(combo => 
          !combo.some(c => c.rank === '10' || c.rank === 'jack')
        );
        if (safeCombination) {
          return card;
        }
      }
    }
    return null;
  }

  private filterDangerousCards(table: Card[], hand: Card[]): Card[] {
    return hand.filter(card => {
      // Don't play cards that would set up obvious Basras
      if (card.rank === '7' && card.suit === 'diamonds') {
        return false;
      }

      // Don't play cards that complete sums for opponent
      if (table.some(t => t.value + card.value === 10)) {
        return false;
      }

      return true;
    });
  }

  private selectOptimalCard(cards: Card[], table: Card[]): Card {
    // Simple strategy: play the lowest value card first
    return [...cards].sort((a, b) => a.value - b.value)[0];
  }
}