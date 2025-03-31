type Card = {
    rank: string;
    suit: string;
    value: number;
  };
  
  type GameState = {
    deck: Card[];
    table: Card[];
    playerHand: Card[];
    botHand: Card[];
    playerScore: number;
    botScore: number;
    captured: {
      player: Card[];
      bot: Card[];
    };
    winningScore: number;
    gamePhase: 'setup' | 'playing' | 'round-end' | 'game-end';
  };
  
  // Initialize a standard deck of cards
  export const initializeDeck = (): Card[] => {
    const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
    const ranks = [
      { rank: '7', value: 7 }, { rank: '8', value: 8 }, 
      { rank: '9', value: 9 }, { rank: '10', value: 10 },
      { rank: 'jack', value: 11 }, { rank: 'queen', value: 12 },
      { rank: 'king', value: 13 }, { rank: 'ace', value: 1 }
    ];
    
    const deck: Card[] = [];
    
    suits.forEach(suit => {
      ranks.forEach(rankInfo => {
        deck.push({
          rank: rankInfo.rank,
          suit,
          value: rankInfo.value
        });
      });
    });
    
    return deck;
  };
  
  // Shuffle deck using Fisher-Yates algorithm
  export const shuffleDeck = (deck: Card[]): Card[] => {
    const shuffled = [...deck];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };
  
  // Check if a play results in a Basra
  export const checkBasra = (playedCard: Card, table: Card[]): boolean => {
    // Direct match
    if (table.some(card => card.rank === playedCard.rank)) {
      return true;
    }
    
    // Sum combinations
    const targetValue = playedCard.value;
    const sumCombinations = findSumCombinations(table, targetValue);
    
    return sumCombinations.length > 0;
  };
  
  // Find all possible sum combinations
  export const findSumCombinations = (table: Card[], target: number): Card[][] => {
    const results: Card[][] = [];
    
    // This is a simplified combination finder
    // For full implementation, you'd want a recursive approach
    for (let i = 0; i < table.length; i++) {
      if (table[i].value === target) {
        results.push([table[i]]);
      }
      
      for (let j = i + 1; j < table.length; j++) {
        if (table[i].value + table[j].value === target) {
          results.push([table[i], table[j]]);
        }
      }
    }
    
    return results;
  };
  
  // Calculate scores
  export const calculateScores = (captured: Card[]): number => {
    let score = 0;
    
    // Count Basras (10 points each)
    score += captured.filter(card => card.rank === '10').length * 10;
    
    // Jack Basra (30 points)
    score += captured.filter(card => card.rank === 'jack').length * 30;
    
    // 7♦ special rule
    if (captured.some(card => card.rank === '7' && card.suit === 'diamonds')) {
      score += 20; // Additional points for 7♦
    }
    
    return score;
  };