import { describe, it, expect } from 'vitest';
import { getHabitSlug } from '@/lib/slug';


describe('getHabitSlug', () => {
  it('returns lowercase hyphenated slug for a basic habit name', () => {

    const input = 'Drink Water';


    const result = getHabitSlug(input);


    expect(result).toBe('drink-water');
  });

  it('trims outer spaces and collapses repeated internal spaces', () => {

    const input = '  Read   Books  ';

    const result = getHabitSlug(input);


    expect(result).toBe('read-books');
  });

  it('removes non alphanumeric characters except hyphens', () => {

    const input = 'Wake Up!!!';


    const result = getHabitSlug(input);


    expect(result).toBe('wake-up');
  });
});