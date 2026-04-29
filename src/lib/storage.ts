import { User, Session } from '@/types/auth';
import { Habit } from '@/types/habit';
import { STORAGE_KEYS } from '@/lib/constants';


// const STORAGE_KEYS = {
//   users: 'habit-tracker-users',
//   session: 'habit-tracker-session',
//   habits: 'habit-tracker-habits',
// } as const;

export function getUsers(): User[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.users);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveUsers(users: User[]): void {
  localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users));
}

export function getUserByEmail(email: string): User | undefined {
  const users = getUsers();
  return users.find((u) => u.email === email);
}

export function addUser(user: User): void {
  const users = getUsers();
  users.push(user);
  saveUsers(users);
}


export function getSession(): Session | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.session);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveSession(session: Session): void {
  localStorage.setItem(STORAGE_KEYS.session, JSON.stringify(session));
}

export function clearSession(): void {
  localStorage.removeItem(STORAGE_KEYS.session);
}


export function getHabits(): Habit[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.habits);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveHabits(habits: Habit[]): void {
  localStorage.setItem(STORAGE_KEYS.habits, JSON.stringify(habits));
}

export function getHabitsByUser(userId: string): Habit[] {
  const habits = getHabits();
  return habits.filter((h) => h.userId === userId);
}

export function addHabit(habit: Habit): void {
  const habits = getHabits();
  habits.push(habit);
  saveHabits(habits);
}

export function updateHabit(updated: Habit): void {
  const habits = getHabits();
  const index = habits.findIndex((h) => h.id === updated.id);
  if (index !== -1) {
    habits[index] = updated;
    saveHabits(habits);
  }
}

export function deleteHabit(habitId: string): void {
  const habits = getHabits();
  const filtered = habits.filter((h) => h.id !== habitId);
  saveHabits(filtered);
}