import { describe, it, expect } from 'vitest';
import { validateHabitName } from '@/lib/validators';

describe('validateHabitName', () => {
  it('returns an error when habit name is empty', () => {
    
    const input = '   '; 

    
    const result = validateHabitName(input);

    
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Habit name is required');
  });

  it('returns an error when habit name exceeds 60 characters', () => {
    
    const input = 'A'.repeat(61); // 61 letter A's in a row

    
    const result = validateHabitName(input);

    
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Habit name must be 60 characters or fewer');
  });

  it('returns a trimmed value when habit name is valid', () => {
    // Arrange
    const input = '  Drink Water  ';

    // Act
    const result = validateHabitName(input);

    // Assert
    expect(result.valid).toBe(true);
    expect(result.value).toBe('Drink Water');
    expect(result.error).toBeNull();
  });
});