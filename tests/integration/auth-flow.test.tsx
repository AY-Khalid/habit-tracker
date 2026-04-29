import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import SignupForm from '@/components/auth/SignupForm';
import LoginForm from '@/components/auth/LoginForm';


function clearStorage() {
  localStorage.clear();
}

function renderSignup() {
  return render(<SignupForm />);
}

function renderLogin() {
  return render(<LoginForm />);
}

async function fillAndSubmitSignup(email: string, password: string) {
  fireEvent.change(screen.getByTestId('auth-signup-email'), {
    target: { value: email },
  });
  fireEvent.change(screen.getByTestId('auth-signup-password'), {
    target: { value: password },
  });
  fireEvent.click(screen.getByTestId('auth-signup-submit'));
}

async function fillAndSubmitLogin(email: string, password: string) {
  fireEvent.change(screen.getByTestId('auth-login-email'), {
    target: { value: email },
  });
  fireEvent.change(screen.getByTestId('auth-login-password'), {
    target: { value: password },
  });
  fireEvent.click(screen.getByTestId('auth-login-submit'));
}


describe('auth flow', () => {
  beforeEach(() => {
    clearStorage(); // fresh localStorage before each test
  });

  it('submits the signup form and creates a session', async () => {
    renderSignup();

    await fillAndSubmitSignup('test@example.com', 'password123');

    await waitFor(() => {
      // Session should be saved in localStorage
      const session = JSON.parse(
        localStorage.getItem('habit-tracker-session') ?? 'null'
      );
      expect(session).not.toBeNull();
      expect(session.email).toBe('test@example.com');
    });

    // User should be saved in localStorage
    const users = JSON.parse(
      localStorage.getItem('habit-tracker-users') ?? '[]'
    );
    expect(users).toHaveLength(1);
    expect(users[0].email).toBe('test@example.com');
  });

 it('shows an error for duplicate signup email', async () => {
  renderSignup();

  await fillAndSubmitSignup('test@example.com', 'password123');

  await waitFor(() => {
    const users = JSON.parse(
      localStorage.getItem('habit-tracker-users') ?? '[]'
    );
    expect(users).toHaveLength(1);
  });

  cleanup();

  localStorage.setItem(
    'habit-tracker-users',
    JSON.stringify([
      {
        id: 'existing',
        email: 'test@example.com',
        password: 'password123',
        createdAt: new Date().toISOString(),
      },
    ])
  );

  renderSignup();

  await fillAndSubmitSignup('test@example.com', 'password123');

  await waitFor(() => {
    expect(screen.getByText('User already exists')).toBeInTheDocument();
  });
});

  it('submits the login form and stores the active session', async () => {
    // First create a user
    localStorage.setItem(
      'habit-tracker-users',
      JSON.stringify([{
        id: 'u1',
        email: 'login@example.com',
        password: 'mypassword',
        createdAt: new Date().toISOString(),
      }])
    );

    renderLogin();

    await fillAndSubmitLogin('login@example.com', 'mypassword');

    await waitFor(() => {
      const session = JSON.parse(
        localStorage.getItem('habit-tracker-session') ?? 'null'
      );
      expect(session).not.toBeNull();
      expect(session.email).toBe('login@example.com');
      expect(session.userId).toBe('u1');
    });
  });

  it('shows an error for invalid login credentials', async () => {
    // Create a user with known password
    localStorage.setItem(
      'habit-tracker-users',
      JSON.stringify([{
        id: 'u1',
        email: 'user@example.com',
        password: 'correctpassword',
        createdAt: new Date().toISOString(),
      }])
    );

    renderLogin();

    // Try wrong password
    await fillAndSubmitLogin('user@example.com', 'wrongpassword');

    await waitFor(() => {
      expect(
        screen.getByText('Invalid email or password')
      ).toBeInTheDocument();
    });
  });
});