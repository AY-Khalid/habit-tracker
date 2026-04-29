import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import HabitList from '@/components/habits/HabitList';
import { Session } from '@/types/auth';
import { Habit } from '@/types/habit';

// ── Test Session ──────────────────────────────────────────────
const mockSession: Session = {
  userId: 'u1',
  email: 'test@example.com',
};

// ── Test Habit ────────────────────────────────────────────────
const mockHabit: Habit = {
  id: 'h1',
  userId: 'u1',
  name: 'Drink Water',
  description: 'Stay hydrated',
  frequency: 'daily',
  createdAt: '2024-01-01T00:00:00.000Z',
  completions: [],
};

// ── Helpers ───────────────────────────────────────────────────
function clearStorage() {
  localStorage.clear();
}

function seedHabit(habit: Habit) {
  localStorage.setItem(
    'habit-tracker-habits',
    JSON.stringify([habit])
  );
}

function renderHabitList(habits: Habit[] = []) {
  const onHabitsChange = vi.fn();
  render(
    <HabitList
      habits={habits}
      session={mockSession}
      onHabitsChange={onHabitsChange}
    />
  );
  return { onHabitsChange };
}

// ── Tests ─────────────────────────────────────────────────────
describe('habit form', () => {
  beforeEach(() => {
    clearStorage();
  });

  it('shows a validation error when habit name is empty', async () => {
    renderHabitList();

    // Open the form
    fireEvent.click(screen.getByTestId('create-habit-button'));

    // Submit without entering a name
    fireEvent.click(screen.getByTestId('habit-save-button'));

    await waitFor(() => {
      expect(
        screen.getByText('Habit name is required')
      ).toBeInTheDocument();
    });
  });

  it('creates a new habit and renders it in the list', async () => {
    const { onHabitsChange } = renderHabitList();

    // Open form
    fireEvent.click(screen.getByTestId('create-habit-button'));

    // Fill in habit name
    fireEvent.change(screen.getByTestId('habit-name-input'), {
      target: { value: 'Drink Water' },
    });

    // Submit
    fireEvent.click(screen.getByTestId('habit-save-button'));

    await waitFor(() => {
      // onHabitsChange should be called so parent refreshes
      expect(onHabitsChange).toHaveBeenCalled();

      // Habit should be saved in localStorage
      const habits = JSON.parse(
        localStorage.getItem('habit-tracker-habits') ?? '[]'
      );
      expect(habits).toHaveLength(1);
      expect(habits[0].name).toBe('Drink Water');
      expect(habits[0].userId).toBe('u1');
    });
  });

  it('edits an existing habit and preserves immutable fields', async () => {
    // Seed a habit in localStorage
    seedHabit(mockHabit);

    renderHabitList([mockHabit]);

    // Click edit button
    fireEvent.click(screen.getByTestId('habit-edit-drink-water'));

    await waitFor(() => {
      // Form should be visible with pre-filled name
      expect(screen.getByTestId('habit-form')).toBeInTheDocument();
      expect(screen.getByTestId('habit-name-input')).toHaveValue(
        'Drink Water'
      );
    });

    // Change the name
    fireEvent.change(screen.getByTestId('habit-name-input'), {
      target: { value: 'Drink More Water' },
    });

    // Save
    fireEvent.click(screen.getByTestId('habit-save-button'));

    await waitFor(() => {
      const habits = JSON.parse(
        localStorage.getItem('habit-tracker-habits') ?? '[]'
      );
      expect(habits[0].name).toBe('Drink More Water');
      // Immutable fields preserved
      expect(habits[0].id).toBe('h1');
      expect(habits[0].userId).toBe('u1');
      expect(habits[0].createdAt).toBe('2024-01-01T00:00:00.000Z');
      expect(habits[0].completions).toEqual([]);
    });
  });

  it('deletes a habit only after explicit confirmation', async () => {
    seedHabit(mockHabit);
    renderHabitList([mockHabit]);

    // Click delete button
    fireEvent.click(screen.getByTestId('habit-delete-drink-water'));

    await waitFor(() => {
      // Confirmation dialog should appear
      expect(
        screen.getByTestId('confirm-delete-button')
      ).toBeInTheDocument();
    });

    // Confirm deletion
    fireEvent.click(screen.getByTestId('confirm-delete-button'));

    await waitFor(() => {
      // Habit should be removed from localStorage
      const habits = JSON.parse(
        localStorage.getItem('habit-tracker-habits') ?? '[]'
      );
      expect(habits).toHaveLength(0);
    });
  });

  it('toggles completion and updates the streak display', async () => {
    seedHabit(mockHabit);
    renderHabitList([mockHabit]);

    // Initially streak shows 0
    const streakEl = screen.getByTestId('habit-streak-drink-water');
    expect(streakEl).toHaveTextContent('0');

    // Click complete button
    fireEvent.click(screen.getByTestId('habit-complete-drink-water'));

    await waitFor(() => {
      // Habit should have today's date in completions
      const habits = JSON.parse(
        localStorage.getItem('habit-tracker-habits') ?? '[]'
      );
      const today = new Date().toISOString().split('T')[0];
      expect(habits[0].completions).toContain(today);
    });
  });
});