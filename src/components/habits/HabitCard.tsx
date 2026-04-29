'use client';

import { useState } from 'react';
import { Habit } from '@/types/habit';
import { getHabitSlug } from '@/lib/slug';
import { calculateCurrentStreak } from '@/lib/streaks';
import { toggleHabitCompletion } from '@/lib/habits';
import { updateHabit, deleteHabit } from '@/lib/storage';
import HabitForm from './HabitForm';

type Props = {
  habit: Habit;
  onHabitsChange: () => void;
};

export default function HabitCard({ habit, onHabitsChange }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  // Calculate slug for data-testid values
  const slug = getHabitSlug(habit.name);

  // Calculate current streak
  const streak = calculateCurrentStreak(habit.completions, today);

  // Check if habit is completed today
  const isCompletedToday = habit.completions.includes(today);

  // ── Handlers ──────────────────────────────

  function handleToggleComplete() {
    const updated = toggleHabitCompletion(habit, today);
    updateHabit(updated);
    onHabitsChange();
  }

  function handleEdit(name: string, description: string) {
    const updated: Habit = {
      ...habit,       // keep id, userId, createdAt, completions
      name,
      description,
    };
    updateHabit(updated);
    setIsEditing(false);
    onHabitsChange();
  }

  function handleDelete() {
    deleteHabit(habit.id);
    setShowDeleteConfirm(false);
    onHabitsChange();
  }

  // ── Edit Mode ─────────────────────────────

  if (isEditing) {
    return (
      <HabitForm
        initialHabit={habit}
        onSave={handleEdit}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  // ── Normal Card View ──────────────────────

  return (
    <div
      data-testid={`habit-card-${slug}`}
      className={`border rounded-2xl p-5 mb-4 shadow-sm
                  transition-all duration-200
                  ${isCompletedToday
                    ? 'border-green-300 bg-green-50'
                    : 'border-gray-200 bg-white'
                  }`}
    >
      {/* Top Row — Name + Streak */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3
            className={`text-lg font-semibold
                        ${isCompletedToday
                          ? 'text-green-800'
                          : 'text-gray-900'
                        }`}
          >
            {habit.name}
            {isCompletedToday && (
              <span className="ml-2 text-green-600 text-sm font-normal">
                &gt;&gt;&gt; Done today
              </span>
            )}
          </h3>
          <p className="text-[12px] text-gray-500 mt-[-4px] mb-2">
          <span className='font-bold text-gray-400'>Created on: </span>{new Date(habit.createdAt).toLocaleDateString()}
        </p>
          {habit.description && (
            <p className="text-sm text-gray-500 mt-1">
              {habit.description}
            </p>
          )}
        </div>

        {/* Streak Badge */}
        <div className="flex flex-col items-center m-auto">
            <div
              data-testid={`habit-streak-${slug}`}
              className={`flex items-center gap-1 px-3 py-1 rounded-full
                          text-sm font-medium ml-4
                          ${streak > 0
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-gray-100 text-gray-500'
                          }`}
            >
              {streak} day{streak !== 1 ? 's' : ''} 
              
            </div>
            <p className='text-[10px] ml-4 font-bold text-gray-400'>Streaks</p>
        </div>
      </div>

      {/* Bottom Row — Action Buttons */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Complete Toggle */}
        <button
          data-testid={`habit-complete-${slug}`}
          type="button"
          onClick={handleToggleComplete}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium
                      transition-colors focus:outline-none focus:ring-2
                      ${isCompletedToday
                        ? 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500'
                      }`}
        >
          {isCompletedToday ? 'Completed' : 'Mark Complete'}
        </button>

        {/* Edit Button */}
        <button
          data-testid={`habit-edit-${slug}`}
          type="button"
          onClick={() => setIsEditing(true)}
          className="py-2 px-4 rounded-lg text-sm font-medium
                     bg-gray-100 text-gray-700 hover:bg-gray-200
                     transition-colors focus:outline-none
                     focus:ring-2 focus:ring-gray-400"
        >
          Edit
        </button>

        {/* Delete Button */}
        <button
          data-testid={`habit-delete-${slug}`}
          type="button"
          onClick={() => setShowDeleteConfirm(true)}
          className="py-2 px-4 rounded-lg text-sm font-medium
                     bg-red-50 text-red-600 hover:bg-red-100
                     transition-colors focus:outline-none
                     focus:ring-2 focus:ring-red-400"
        >
          Delete
        </button>
      </div>

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-sm text-red-800 font-medium mb-3">
            Are you sure you want to delete &quot;{habit.name}&quot;?
            This cannot be undone.
          </p>
          <div className="flex gap-2">
            <button
              data-testid="confirm-delete-button"
              type="button"
              onClick={handleDelete}
              className="flex-1 bg-red-600 text-white py-2 px-4
                         rounded-lg text-sm font-medium
                         hover:bg-red-700 transition-colors
                         focus:outline-none focus:ring-2
                         focus:ring-red-500"
            >
              Yes, Delete
            </button>
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(false)}
              className="flex-1 bg-white text-gray-700 py-2 px-4
                         rounded-lg text-sm font-medium border
                         border-gray-300 hover:bg-gray-50
                         transition-colors focus:outline-none
                         focus:ring-2 focus:ring-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}