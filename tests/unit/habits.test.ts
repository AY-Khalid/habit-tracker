import { describe, it, expect } from 'vitest';
import { toggleHabitCompletion } from '@/lib/habits';
import { Habit } from '@/types/habit';


const baseHabit: Habit = {
  id: 'h1',
  userId: 'u1',
  name: 'Drink Water',
  description: 'Stay hydrated',
  frequency: 'daily',
  createdAt: '2024-01-01',
  completions: [],
};

describe('toggleHabitCompletion', () => {
  it('adds a completion date when the date is not present', () => {

    const date = '2024-01-17';
    const result = toggleHabitCompletion(baseHabit, date);
    expect(result.completions).toContain(date);
  });

  it('removes a completion date when the date already exists', () => {
    const date = '2024-01-17';
    const habitWithCompletion: Habit = {
      ...baseHabit,
      completions: [date], 
    };

    const result = toggleHabitCompletion(habitWithCompletion, date);

    expect(result.completions).not.toContain(date);
  });

  it('does not mutate the original habit object', () => {

    const date = '2024-01-17';
    const original: Habit = {
      ...baseHabit,
      completions: [],
    };

    toggleHabitCompletion(original, date);


    expect(original.completions).toEqual([]);
  });

  it('does not return duplicate completion dates', () => {


    const date = '2024-01-17';
    const habitWithDuplicate: Habit = {
      ...baseHabit,
      completions: [date, date],
    };


    const result = toggleHabitCompletion(habitWithDuplicate, date);

    const count = result.completions.filter((d) => d === date).length;
    expect(count).toBe(0);
  });
});
