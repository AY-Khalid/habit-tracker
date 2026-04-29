'use client';

import { useState } from 'react';
import { Habit } from '@/types/habit';
import { Session } from '@/types/auth';
import { addHabit } from '@/lib/storage';
import { generateId } from '@/lib/id';
import HabitCard from './HabitCard';
import HabitForm from './HabitForm';
import { Inbox} from 'lucide-react';

type Props = {
  habits: Habit[];
  session: Session;
  onHabitsChange: () => void;
};

export default function HabitList({
  habits,
  session,
  onHabitsChange,
}: Props) {
  const [showForm, setShowForm] = useState(false);

  function handleCreateHabit(name: string, description: string) {
    const newHabit: Habit = {
      id: generateId(),
      userId: session.userId,
      name,
      description,
      frequency: 'daily',
      createdAt: new Date().toISOString(),
      completions: [],
    };

    addHabit(newHabit);
    setShowForm(false);
    onHabitsChange();
  }

  return (
    <div>
      {/* Header Row */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Daily habits
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            {habits.length} habit{habits.length !== 1 ? 's' : ''} tracked
          </p>
        </div>

        {/* Add Habit Button */}
        {!showForm && (
          <button
            data-testid="create-habit-button"
            type="button"
            onClick={() => setShowForm(true)}
            className="bg-indigo-600 text-white py-2 px-5 rounded-lg
                       font-medium hover:bg-indigo-700 transition-colors
                       focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            + Add Habit
          </button>
        )}
      </div>

      {/* Create Habit Form */}
      {showForm && (
        <HabitForm
          onSave={handleCreateHabit}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Empty State */}
      {habits.length === 0 && !showForm && (
        <div
          data-testid="empty-state"
          className="text-center py-16 px-4"
        >
          <div className="text-5xl mb-4 text-center flex items-center justify-center">
            <Inbox className="text-red-400 w-18 h-18" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No habits yet
          </h3>
          <p className="text-gray-500 mb-6">
            Start building better habits today.
            Click &quot;+ Add Habit&quot; to create your first one.
          </p>
        </div>
      )}

      {/* Habit Cards */}
      {habits.map((habit) => (
        <HabitCard
          key={habit.id}
          habit={habit}
          onHabitsChange={onHabitsChange}
        />
      ))}
    </div>
  );
}