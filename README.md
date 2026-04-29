# Habit Tracker PWA

A mobile-first Progressive Web App for tracking daily habits, built with Next.js, TypeScript, Tailwind CSS, and localStorage persistence.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Setup Instructions](#setup-instructions)
- [Run Instructions](#run-instructions)
- [Test Instructions](#test-instructions)
- [Local Persistence Structure](#local-persistence-structure)
- [PWA Implementation](#pwa-implementation)
- [Trade-offs and Limitations](#trade-offs-and-limitations)
- [Test File Map](#test-file-map)

---

## Project Overview

Habit Tracker is a fully client-side Progressive Web App that allows users to:

- **Sign up and log in** using email and password (stored locally)
- **Create, edit, and delete habits** with name and description
- **Mark habits complete** for today and unmark them
- **View a live streak counter** showing consecutive days completed
- **Persist all data** across page reloads using localStorage
- **Install the app** on mobile or desktop as a PWA
- **Load the app shell offline** after the first visit

The app is built with a focus on technical discipline, deterministic behavior, and full testability across unit, integration, and end-to-end test layers.

---

## Setup Instructions

### Prerequisites

Make sure you have the following installed on your machine:

- **Node.js** v18 or higher — [https://nodejs.org](https://nodejs.org)
- **npm** v9 or higher (comes with Node.js)
- **Git** — [https://git-scm.com](https://git-scm.com)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/habit-tracker.git
cd habit-tracker
```

2. Install dependencies:

```bash
npm install
```

3. Install Playwright browsers (required for E2E tests):

```bash
npx playwright install
```

---

## Run Instructions

### Development Server

Start the local development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The app hot-reloads as you edit files.

### Production Build

To build and run the production version:

```bash
npm run build
npm run start
```

Open [http://localhost:3000](http://localhost:3000) to view the production build. PWA features like the service worker and offline support work fully in production mode.

---

## Test Instructions

### Run All Tests

Run the complete test suite (unit + integration + E2E):

```bashh
npm test
```

### Unit Tests Only

Tests for pure utility functions in `src/lib/`:

```bash
npm run test:unit
```

This also generates a **coverage report**. After running, open the visual HTML report:

```bash
# Windows
start coverage/index.html

# Mac
open coverage/index.html
```

Coverage threshold: **80% line coverage** for all files in `src/lib/`.

### Integration Tests Only

Tests for UI components and user interactions:

```bash
npm run test:integration
```

### End-to-End Tests Only

Full browser tests using Playwright:

```bash
npm run test:e2e
```

To view the Playwright test report after a run:

```bash
npx playwright show-report
```

### Test Summary

| Suite | File | Tests |
|---|---|---|
| Unit | `tests/unit/slug.test.ts` | 3 |
| Unit | `tests/unit/validators.test.ts` | 3 |
| Unit | `tests/unit/streaks.test.ts` | 5 |
| Unit | `tests/unit/habits.test.ts` | 4 |
| Integration | `tests/integration/auth-flow.test.tsx` | 4 |
| Integration | `tests/integration/habit-form.test.tsx` | 5 |
| E2E | `tests/e2e/app.spec.ts` | 10 |
| **Total** | | **34** |

---

## Local Persistence Structure

All data is stored in the browser's `localStorage`. No server, database, or external API is used. Data persists across page reloads and browser restarts until the user clears their browser data.

### Storage Keys

| Key | Type | Description |
|---|---|---|
| `habit-tracker-users` | JSON array | All registered users |
| `habit-tracker-session` | JSON object or null | The currently logged-in user's session |
| `habit-tracker-habits` | JSON array | All habits across all users |

### Data Shapes

**User** — stored inside `habit-tracker-users`:
```json
{
  "id": "k7f2xz1j9abc",
  "email": "user@example.com",
  "password": "mypassword",
  "createdAt": "2024-01-15T08:30:00.000Z"
}
```

**Session** — stored in `habit-tracker-session`:
```json
{
  "userId": "k7f2xz1j9abc",
  "email": "user@example.com"
}
```

**Habit** — stored inside `habit-tracker-habits`:
```json
{
  "id": "m3n8yz2k4def",
  "userId": "k7f2xz1j9abc",
  "name": "Drink Water",
  "description": "8 glasses a day",
  "frequency": "daily",
  "createdAt": "2024-01-15T08:35:00.000Z",
  "completions": ["2024-01-15", "2024-01-16", "2024-01-17"]
}
```

### How It Works

- On **signup**, a new user object is created with a generated ID and saved to `habit-tracker-users`. A session is immediately created in `habit-tracker-session`.
- On **login**, the user is looked up by email and password match. If valid, a session is written to `habit-tracker-session`.
- On **logout**, `habit-tracker-session` is set to `null` and the user is redirected to `/login`.
- **Habits** are filtered by `userId` so each user only sees their own habits.
- **Completions** are stored as an array of `YYYY-MM-DD` date strings. Duplicates are prevented.
- **Streaks** are calculated in real time from the completions array — no streak value is stored directly.

---

## PWA Implementation

The app is a fully installable Progressive Web App supported by three components:

### 1. Web App Manifest (`public/manifest.json`)

Tells the browser how to install and display the app:

- Sets the app `name` and `short_name`
- Defines `start_url` as `/`
- Sets `display: standalone` so the app opens without browser chrome
- Specifies `theme_color` and `background_color`
- References icons at 192×192 and 512×512

### 2. Service Worker (`public/sw.js`)

Handles caching and offline support using a **cache-first strategy**:

- **Install event** — opens a named cache and pre-caches the app shell (all main routes and the manifest)
- **Activate event** — deletes any old caches from previous versions
- **Fetch event** — serves requests from cache first; falls back to the network if not cached; caches new responses for future offline use; returns the cached root `/` for any navigation request that fails offline

The service worker is registered on the client via a `RegisterSW.jsx` component mounted in the src/components/shared directory.

### 3. Icons (`public/icons/`)

Two PNG icons are included:
- `icon-192.png` — used on Android home screens and in the install prompt
- `icon-512.png` — used for splash screens and high-resolution displays

### Installation

After loading the app once in Chrome or Edge, an install icon appears in the address bar. Clicking it installs the app as a standalone application. On mobile, use **Add to Home Screen** from the browser menu.

---

## Trade-offs and Limitations

### Security
Passwords are stored in plain text in localStorage. This is intentional for this stage of the project which is front-end focused with no backend. In a production app, passwords would be hashed server-side and never stored in the browser. And there is no password confirmation on signup, so users could easily mistype their password and be unable to log in later.

### Data Privacy
All data lives in the user's browser. There is no sync across devices. Clearing browser data or using a different browser starts fresh with no history.

### Authentication
Authentication is simulated locally. There are no tokens, expiry times, or server-side session validation. Anyone with access to the browser's DevTools can read or modify stored data.

### Offline Limitations
The service worker caches the app shell so the UI loads offline. However, since all data is already in localStorage, the full app including habits and sessions is available offline without any extra work. The offline limitation mainly applies to the initial load before the service worker installs.

### Frequency
Only `daily` frequency is implemented for habits. Weekly, monthly, or custom frequencies are not supported in this stage.

### Multi-device
Because localStorage is browser-specific, habits created on one device are not available on another device or browser.

### Streak Calculation
Streaks are calculated purely from the `completions` array at render time. If a user completes a habit and then changes their system clock, streak calculations may behave unexpectedly.

---

## Test File Map

Each test file targets a specific layer of the application. The table below maps every required test file to the exact behavior it verifies.

### Unit Tests — `tests/unit/`

| File | Function Tested | Behaviors Verified |
|---|---|---|
| `slug.test.ts` | `getHabitSlug()` | Converts habit names to lowercase hyphenated slugs; trims and collapses spaces; removes special characters |
| `validators.test.ts` | `validateHabitName()` | Rejects empty names; rejects names over 60 characters; returns trimmed value for valid input |
| `streaks.test.ts` | `calculateCurrentStreak()` | Returns 0 for empty completions; returns 0 when today is not completed; counts consecutive days correctly; ignores duplicates; breaks on missing days |
| `habits.test.ts` | `toggleHabitCompletion()` | Adds a date when not present; removes a date when already present; does not mutate original habit; prevents duplicate dates |

### Integration Tests — `tests/integration/`

| File | Component Tested | Behaviors Verified |
|---|---|---|
| `auth-flow.test.tsx` | `SignupForm`, `LoginForm` | Signup creates a user and session in localStorage; duplicate email shows error; login stores session for valid credentials; wrong credentials show error message |
| `habit-form.test.tsx` | `HabitList`, `HabitForm`, `HabitCard` | Empty name shows validation error; new habit is saved and reflected in localStorage; editing preserves immutable fields (id, userId, createdAt, completions); delete requires confirmation before removing; toggling completion saves date and updates streak display |

### End-to-End Tests — `tests/e2e/`

| File | Scope | Behaviors Verified |
|---|---|---|
| `app.spec.ts` | Full app in real browser | Splash screen visible before redirect; unauthenticated users redirected to `/login`; authenticated users redirected to `/dashboard`; `/dashboard` protected from unauthenticated access; signup flow creates account and lands on dashboard; login loads only that user's habits; habit creation appears as a card; completing a habit updates streak display; session and habits survive page reload; logout clears session and redirects; app shell loads from cache when offline |

---

## Tech Stack

| Technology | Purpose |
|---|---|
| Next.js 14 (App Router) | Framework and routing |
| React 18 | UI components |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| localStorage | Client-side persistence |
| Vitest | Unit and integration test runner |
| React Testing Library | Component testing utilities |
| Playwright | End-to-end browser testing |

---

## Project Structure

```
habit-tracker/
├── public/
│   ├── manifest.json        # PWA manifest
│   ├── sw.js                # Service worker
│   └── icons/
│       ├── icon-192.png
│       └── icon-512.png
├── src/
│   ├── app/
│   │   ├── page.tsx         # / — splash screen + redirect
│   │   ├── login/page.tsx   # /login
│   │   ├── signup/page.tsx  # /signup
│   │   └── dashboard/page.tsx # /dashboard
│   ├── components/
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   └── SignupForm.tsx
│   │   ├── habits/
│   │   │   ├── HabitCard.tsx
│   │   │   ├── HabitForm.tsx
│   │   │   └── HabitList.tsx
│   │   └── shared/
│   │       ├── SplashScreen.tsx
│   │       └── ServiceWorkerRegistrar.tsx
│   ├── lib/
│   │   ├── slug.ts
│   │   ├── validators.ts
│   │   ├── streaks.ts
│   │   ├── habits.ts
│   │   ├── storage.ts
│   │   └── id.ts
│   └── types/
│       ├── auth.ts
│       └── habit.ts
└── tests/
    ├── unit/
    │   ├── slug.test.ts
    │   ├── validators.test.ts
    │   ├── streaks.test.ts
    │   └── habits.test.ts
    ├── integration/
    │   ├── auth-flow.test.tsx
    │   └── habit-form.test.tsx
    └── e2e/
        └── app.spec.ts
```
