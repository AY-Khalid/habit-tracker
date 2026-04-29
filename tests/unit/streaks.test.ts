import { describe, it, expect } from 'vitest';
import { calculateCurrentStreak } from '@/lib/streaks';

describe('calculateCurrentStreak', () => {
  it('returns 0 when completions is empty', () => {
    
    const completions: string[] = [];
    const today = '2024-01-17';
    
    const result = calculateCurrentStreak(completions, today);

   
    expect(result).toBe(0);
  });

  it('returns 0 when today is not completed', () => {
    
    const today = '2024-01-17';
    const yesterday = '2024-01-16';
    const completions = [yesterday]; // only yesterday done, not today


    const result = calculateCurrentStreak(completions, today);


    expect(result).toBe(0);
  });

  it('returns the correct streak for consecutive completed days', () => {
  
    const today = '2024-01-17';
    const completions = [
      '2024-01-15',
      '2024-01-16',
      '2024-01-17',
    ];

    const result = calculateCurrentStreak(completions, today);

    expect(result).toBe(3);
  });

  it('ignores duplicate completion dates', () => {

    const today = '2024-01-17';
    const completions = [
      '2024-01-17',
      '2024-01-17',
      '2024-01-16',
    ];

   
    const result = calculateCurrentStreak(completions, today);

    expect(result).toBe(2); 
  });

  it('breaks the streak when a calendar day is missing', () => {
    
    const today = '2024-01-17';
    const completions = [
      '2024-01-15', 
      '2024-01-17',
    ];

    const result = calculateCurrentStreak(completions, today);

    expect(result).toBe(1);
  });
});
