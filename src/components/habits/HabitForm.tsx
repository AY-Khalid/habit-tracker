'use client';

import { useState } from 'react';
import { Habit } from '@/types/habit';
import { validateHabitName } from '@/lib/validators';

type Props = {
  // if editing, pass the existing habit
  initialHabit?: Habit;
  onSave: (name: string, description: string) => void;
  onCancel: () => void;
};

export default function HabitForm({
  initialHabit,
  onSave,
  onCancel,
}: Props) {
  const [name, setName] = useState(initialHabit?.name ?? '');
  const [description, setDescription] = useState(
    initialHabit?.description ?? ''
  );
  const [error, setError] = useState<string | null>(null);

  function handleSave() {
    // Validate name using our utility function
    const validation = validateHabitName(name);

    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    setError(null);
    onSave(validation.value, description.trim());
  }

  return (
    <div
      data-testid="habit-form"
      className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {initialHabit ? 'Edit Habit' : 'New Habit'}
      </h3>

      {/* Error Message */}
      {error && (
        <div
          role="alert"
          className="mb-4 p-3 bg-red-50 border border-red-200
                     text-red-700 rounded-lg text-sm"
        >
          {error}
        </div>
      )}

      {/* Habit Name */}
      <div className="mb-4">
        <label
          htmlFor="habit-name"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Habit Name <span className="text-red-500">*</span>
        </label>
        <input
          id="habit-name"
          data-testid="habit-name-input"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Drink Water"
          maxLength={61}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-indigo-500
                     focus:border-transparent text-gray-900"
        />
      </div>

      {/* Description */}
      <div className="mb-4">
        <label
          htmlFor="habit-description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Description{' '}
          <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <input
          id="habit-description"
          data-testid="habit-description-input"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g. 8 glasses a day"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-indigo-500
                     focus:border-transparent text-gray-900"
        />
      </div>

      {/* Frequency */}
      <div className="mb-6">
        <label
          htmlFor="habit-frequency"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Frequency
        </label>
        <select
          id="habit-frequency"
          data-testid="habit-frequency-select"
          defaultValue="daily"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-indigo-500
                     focus:border-transparent text-gray-900 bg-indigo-100"
                     disabled
        >
          <option value="daily">Daily</option>
        </select>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          data-testid="habit-save-button"
          type="button"
          onClick={handleSave}
          className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg
                     font-medium hover:bg-indigo-700 transition-colors
                     focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {initialHabit ? 'Save Changes' : 'Create Habit'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg
                     font-medium hover:bg-gray-200 transition-colors
                     focus:outline-none focus:ring-2 focus:ring-gray-400"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}