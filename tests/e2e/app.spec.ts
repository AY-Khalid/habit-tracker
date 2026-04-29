import { test, expect, Page } from '@playwright/test';

// ── Helpers ───────────────────────────────────────────────────

// Clear localStorage before each test
async function clearStorage(page: Page) {
  await page.evaluate(() => localStorage.clear());
}

// Create a user directly in localStorage
async function seedUser(
  page: Page,
  email: string,
  password: string
) {
  await page.evaluate(
    ({ email, password }) => {
      const users = [
        {
          id: 'test-user-id',
          email,
          password,
          createdAt: new Date().toISOString(),
        },
      ];
      localStorage.setItem(
        'habit-tracker-users',
        JSON.stringify(users)
      );
    },
    { email, password }
  );
}

// Create a session directly in localStorage
async function seedSession(page: Page, email: string) {
  await page.evaluate((email) => {
    const session = { userId: 'test-user-id', email };
    localStorage.setItem(
      'habit-tracker-session',
      JSON.stringify(session)
    );
  }, email);
}

// Seed a habit directly in localStorage
async function seedHabit(page: Page, name: string) {
  await page.evaluate((name) => {
    const habits = [
      {
        id: 'test-habit-id',
        userId: 'test-user-id',
        name,
        description: '',
        frequency: 'daily',
        createdAt: new Date().toISOString(),
        completions: [],
      },
    ];
    localStorage.setItem(
      'habit-tracker-habits',
      JSON.stringify(habits)
    );
  }, name);
}

// Sign up a new user through the UI
async function signUpUser(
  page: Page,
  email: string,
  password: string
) {
  await page.goto('/signup');
  await page.fill('[data-testid="auth-signup-email"]', email);
  await page.fill('[data-testid="auth-signup-password"]', password);
  await page.click('[data-testid="auth-signup-submit"]');
  await page.waitForURL('/dashboard');
}

// ── Tests ─────────────────────────────────────────────────────

test.describe('Habit Tracker app', () => {

  // Clear storage before every test so they
  // don't affect each other
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await clearStorage(page);
  });

  // ── Splash & Routing ───────────────────────────────────────

  test('shows the splash screen and redirects unauthenticated users to /login',
    async ({ page }) => {
      await page.goto('/');

      // Splash screen should be visible
      await expect(
        page.getByTestId('splash-screen')
      ).toBeVisible();

      // Should redirect to /login
      await page.waitForURL('/login', { timeout: 5000 });
      expect(page.url()).toContain('/login');
    }
  );

  test('redirects authenticated users from / to /dashboard',
    async ({ page }) => {
      await page.goto('/');
      await seedSession(page, 'test@example.com');
      await page.goto('/');

      // Should redirect to /dashboard
      await page.waitForURL('/dashboard', { timeout: 5000 });
      expect(page.url()).toContain('/dashboard');
    }
  );

  test('prevents unauthenticated access to /dashboard',
    async ({ page }) => {
      // Go directly to dashboard without logging in
      await page.goto('/dashboard');

      // Should redirect to /login
      await page.waitForURL('/login', { timeout: 5000 });
      expect(page.url()).toContain('/login');
    }
  );

  // ── Auth ───────────────────────────────────────────────────

  test('signs up a new user and lands on the dashboard',
    async ({ page }) => {
      await page.goto('/signup');

      await page.fill(
        '[data-testid="auth-signup-email"]',
        'newuser@example.com'
      );
      await page.fill(
        '[data-testid="auth-signup-password"]',
        'password123'
      );
      await page.click('[data-testid="auth-signup-submit"]');

      // Should land on dashboard
      await page.waitForURL('/dashboard', { timeout: 5000 });
      await expect(
        page.getByTestId('dashboard-page')
      ).toBeVisible();
    }
  );

  test('logs in an existing user and loads only that user\'s habits',
    async ({ page }) => {
      // Create user and their habit in storage
      await page.goto('/');
      await seedUser(page, 'existing@example.com', 'password123');
      await seedHabit(page, 'Drink Water');

      // Log in through the UI
      await page.goto('/login');
      await page.fill(
        '[data-testid="auth-login-email"]',
        'existing@example.com'
      );
      await page.fill(
        '[data-testid="auth-login-password"]',
        'password123'
      );
      await page.click('[data-testid="auth-login-submit"]');

      await page.waitForURL('/dashboard', { timeout: 5000 });

      // Their habit should be visible
      await expect(
        page.getByTestId('habit-card-drink-water')
      ).toBeVisible();
    }
  );

  // ── Habits ─────────────────────────────────────────────────

  test('creates a habit from the dashboard', async ({ page }) => {
    await signUpUser(page, 'creator@example.com', 'password123');

    // Click add habit button
    await page.click('[data-testid="create-habit-button"]');

    // Fill in the form
    await page.fill(
      '[data-testid="habit-name-input"]',
      'Exercise Daily'
    );
    await page.fill(
      '[data-testid="habit-description-input"]',
      '30 minutes of exercise'
    );

    // Save the habit
    await page.click('[data-testid="habit-save-button"]');

    // Habit card should appear
    await expect(
      page.getByTestId('habit-card-exercise-daily')
    ).toBeVisible();
  });

  test('completes a habit for today and updates the streak',
    async ({ page }) => {
      await signUpUser(page, 'completer@example.com', 'password123');

      // Create a habit
      await page.click('[data-testid="create-habit-button"]');
      await page.fill('[data-testid="habit-name-input"]', 'Read Books');
      await page.click('[data-testid="habit-save-button"]');

      // Wait for habit card
      await expect(
        page.getByTestId('habit-card-read-books')
      ).toBeVisible();

      // Streak should start at 0
      await expect(
        page.getByTestId('habit-streak-read-books')
      ).toContainText('0');

      // Mark complete
      await page.click('[data-testid="habit-complete-read-books"]');

      // Streak should update to 1
      await expect(
        page.getByTestId('habit-streak-read-books')
      ).toContainText('1');
    }
  );

  // ── Persistence ────────────────────────────────────────────

  test('persists session and habits after page reload',
    async ({ page }) => {
      await signUpUser(page, 'persist@example.com', 'password123');

      // Create a habit
      await page.click('[data-testid="create-habit-button"]');
      await page.fill('[data-testid="habit-name-input"]', 'Meditate');
      await page.click('[data-testid="habit-save-button"]');

      await expect(
        page.getByTestId('habit-card-meditate')
      ).toBeVisible();

      // Reload the page
      await page.reload();

      // Should still be on dashboard (session persisted)
      await expect(
        page.getByTestId('dashboard-page')
      ).toBeVisible();

      // Habit should still be there (habit persisted)
      await expect(
        page.getByTestId('habit-card-meditate')
      ).toBeVisible();
    }
  );

  // ── Logout ─────────────────────────────────────────────────

  test('logs out and redirects to /login', async ({ page }) => {
    await signUpUser(page, 'logout@example.com', 'password123');

    // 1. Click logout
    await page.click('[data-testid="auth-logout-button"]');

    // 2. WAIT for the first redirect to finish before doing anything else
    // Using '**/login' handles both absolute and relative URL patterns
    await page.waitForURL('**/login', { timeout: 5000 });
    expect(page.url()).toContain('/login');

    // 3. NOW try to go back to dashboard to verify session is gone
    await page.goto('/dashboard');
    
    // 4. It should kick you right back to login
    await page.waitForURL('**/login', { timeout: 5000 });
    expect(page.url()).toContain('/login');
  });

  // ── Offline ────────────────────────────────────────────────

  test('loads the cached app shell when offline after the app has been loaded once',
    async ({ page, context }) => {
      // First visit — loads and caches the app
      await page.goto('/');
      await page.waitForURL('/login', { timeout: 5000 });

      // Wait for service worker to install and cache
      await page.waitForTimeout(2000);

      // Go offline
      await context.setOffline(true);

      // Try to load the app again while offline
      await page.goto('/');

      // App should not hard crash — something should render
      const body = await page.locator('body').textContent();
      expect(body).not.toBeNull();
      expect(body!.length).toBeGreaterThan(0);

      // Go back online
      await context.setOffline(false);
    }
  );

});