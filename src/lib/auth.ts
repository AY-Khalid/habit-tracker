import { User, Session } from '@/types/auth';
import {
  getUsers,
  saveUsers,
  saveSession,
  clearSession,
} from '@/lib/storage';
import { generateId } from '@/lib/id';

export type SignupResult =
  | { success: true; session: Session }
  | { success: false; error: string };

export type LoginResult =
  | { success: true; session: Session }
  | { success: false; error: string };

export function signUp(
  email: string,
  password: string
): SignupResult {
  const users = getUsers();

  // Check for duplicate email
  const exists = users.find(
    (u) => u.email === email.trim().toLowerCase()
  );

  if (exists) {
    return { success: false, error: 'User already exists' };
  }

  // Create new user
  const newUser: User = {
    id: generateId(),
    email: email.trim().toLowerCase(),
    password: password.trim(),
    createdAt: new Date().toISOString(),
  };

  saveUsers([...users, newUser]);

  const session: Session = {
    userId: newUser.id,
    email: newUser.email,
  };

  saveSession(session);

  return { success: true, session };
}

export function logIn(
  email: string,
  password: string
): LoginResult {
  const users = getUsers();

  const user = users.find(
    (u) => u.email === email.trim().toLowerCase()
  );

  if (!user || user.password !== password.trim()) {
    return { success: false, error: 'Invalid email or password' };
  }

  const session: Session = {
    userId: user.id,
    email: user.email,
  };

  saveSession(session);

  return { success: true, session };
}

export function logOut(): void {
  clearSession();
}