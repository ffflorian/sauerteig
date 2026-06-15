# AGENTS Guide

This file explains how coding agents should work in this repository.

## General

### Approach

- Think before acting. Read existing files before writing code.
- Be concise in output but thorough in reasoning.
- Prefer editing over rewriting whole files.
- Do not re-read files you have already read.
- Test your code before declaring done.
- No sycophantic openers or closing fluff.
- Keep solutions simple and direct.
- User instructions always override this file.

### Output

- Return code first. Explanation after, only if non-obvious.
- No inline prose. Use comments sparingly - only where logic is unclear.
- No boilerplate unless explicitly requested.

### Code Rules

- Simplest working solution. No over-engineering.
- No abstractions for single-use operations.
- No speculative features or "you might also want..."
- Read the file before modifying it. Never edit blind.
- No docstrings or type annotations on code not being changed.
- No error handling for scenarios that cannot happen.
- Three similar lines is better than a premature abstraction.
- Always use curly braces for `if` statements, even single-line ones.

### Review Rules

- State the bug. Show the fix. Stop.
- No suggestions beyond the scope of the review.
- No compliments on the code before or after the review.

### Debugging Rules

- Never speculate about a bug without reading the relevant code first.
- State what you found, where, and the fix. One pass.
- If cause is unclear: say so. Do not guess.

### Simple Formatting

- No em dashes, smart quotes, or decorative Unicode symbols.
- Plain hyphens and straight quotes only.
- Natural language characters (accented letters, CJK, etc.) are fine when the content requires them.
- Code output must be copy-paste safe.

## Tech Stack

### Frontend (`packages/frontend`)

- **React 19** with **TypeScript 6** (strict mode)
- **Vite 8** as build tool and dev server
- **date-fns 4** for time formatting (German locale)
- **react-swipeable** for touch gestures
- **vitest 4** + **@testing-library/react** for unit and component tests

### Backend (`packages/backend`)

- **NestJS 11** with **TypeScript 6** (strict mode)
- **Mongoose 9** for MongoDB access
- **web-push 3** for Web Push notifications
- **vitest 4** for unit tests

### Shared

- **ESLint** + **oxlint** for linting, **Prettier** for formatting
- **lefthook** for pre-commit hooks
- **Semantic Release** for automated versioning and changelogs

## Commands

Run from the repo root unless noted. All root scripts delegate to every workspace via `yarn workspaces foreach`.

```bash
yarn install  # install all workspace dependencies
yarn build    # type-check + build all packages
yarn dist     # clean then build all packages
yarn lint     # run all linters across all packages
yarn fix      # auto-fix all linting issues across all packages
yarn test     # run all tests across all packages
```

Per-workspace commands (when you only need one package):

```bash
yarn workspace sauerteig-frontend start  # frontend dev server (http://localhost:5173)
yarn workspace sauerteig-backend dev     # backend dev server (http://localhost:3000)
yarn workspace sauerteig-frontend test   # frontend tests only
yarn workspace sauerteig-backend test    # backend tests only
```

Always use `yarn`, not `npm`, for all package management and script execution.

After finishing any code changes, always run `yarn fix` and `yarn build` to catch linting, formatting, and type errors before committing.

## Project Structure

```
packages/
  frontend/
    src/
      index.tsx             # entry point (React StrictMode)
      App.tsx               # root component, wraps with SauerteigProvider
      Content.tsx           # main layout: navigation, theme toggle, step display, progress bar
      Introduction.tsx      # step 0 - table of contents and ingredient overview
      Step.tsx              # displays a single recipe step with reminder timers
      ReminderTimer.tsx     # countdown timer with browser notification on expiry
      ProgressBar.tsx       # thin bar above the navigation showing cumulative step progress
      SauerteigContext.ts   # React Context definition for the current step
      SauerteigProvider.tsx # Context provider (current step persisted to localStorage)
      data.ts               # recipe data: 6 steps, ingredients, timings
      index.css             # global styles with CSS custom properties for theming
      references.d.ts       # Vite client type references
      __tests__/            # vitest test suite (96 tests, >=80% coverage)
    public/
      img/                  # bread logo in sizes 16-512px + SVG
      manifest.json         # PWA manifest
      robots.txt            # crawler directives
    index.html              # HTML entry point
    vite.config.ts          # Vite + vitest config
  backend/
    src/
      main.ts               # NestJS entry point
      app.module.ts         # root module
      config/config.ts      # env var config (PORT, VAPID keys, MongoDB URI, etc.)
      health/               # GET /_health endpoint
      push/                 # Web Push scheduling: controller, service, scheduler, schema
      __tests__/            # vitest test suite (12 tests, >=80% coverage)
    vitest.config.ts        # vitest config
frontend.Dockerfile         # multi-stage build: Vite + nginx (port 8080, /_health)
backend.Dockerfile          # multi-stage build: NestJS (port 3000)
Rezept.md                   # the full recipe as plain text
```

## Key Architecture Decisions

- **State management**: React Context (`SauerteigContext`) for the current step; no external state library.
- **Persistence**: `localStorage` keys - `SauerteigStep` (current step), `SauerteigTheme` (light/dark preference), `SauerteigStep_<stepItemId>` (one per preparation step, `'true'`/`'false'`), `SauerteigIngredients_<stepId>` (JSON boolean array per page), plus one `SauerteigTimer_<stepItemId>` per reminder timer storing its expiry timestamp.
- **Reminder timers**: `ReminderTimer` lets the user start a countdown for a waiting period. The expiry timestamp is stored in `localStorage` so the countdown survives reloads, and a browser `Notification` fires when it expires (requires notification permission). The backend schedules a fallback push notification via Web Push for when the app is not open.
- **Progress bar**: `ProgressBar` is a thin bar rendered above the navigation buttons. `Content` derives a cumulative fraction from `localStorage` (checked preparation steps across all pages divided by the total number of preparation steps), so it advances across pages and does not reset when navigating. `Step` reports changes through an `onStepsChange` callback that triggers a recount. Ingredient checkboxes do not count toward progress.
- **Checklists**: preparation steps (Zubereitung) are sequential - a step is only checkable once every step above it is checked, and unchecking a step clears the steps below it (the checked items stay a contiguous prefix). Ingredient checkboxes (Zutaten on step pages and the intro's "Benötigt werden" list) are independent and checkable in any order.
- **Theme**: CSS custom properties on `:root[data-theme]`. System preference detected via `prefers-color-scheme`; user override persisted to `localStorage`.
- **Navigation**: keyboard (arrow keys), swipe gestures (`react-swipeable`), and on-screen buttons all supported.
- **Deployment**: each package is built into its own Docker image (`frontend.Dockerfile`, `backend.Dockerfile`) and deployed to Coolify by the CI workflow. Frontend is served from the site root, so assets use relative paths.

## Conventions

- **Branches**: use the format `<fix/feat/chore>/<branch-name>` (e.g. `feat/dark-mode`, `fix/icon-alignment`). Do not prefix branch names with `claude/`.
- **Commits**: follow Conventional Commits (Angular preset) – `feat:`, `fix:`, `chore:`, etc. Breaking changes use `BREAKING CHANGE:` in the footer. Do not add Claude session URLs to commit messages or PR texts.
- **Versioning**: automated via Semantic Release on push to `main`.
- **Language**: user-facing UI content is in German. All code (including code comments), commit messages, and PR descriptions are in English.
- **Code style**: 2-space indent, LF line endings, UTF-8 (enforced by `.editorconfig` and Prettier).
- **TypeScript**: strict mode enabled; no `any` without justification.

## CI/CD

- **main.yml**: on push/PR to `main`, lints + builds TypeScript, validates the nginx config, and lints the Dockerfile (hadolint). On push to `main` it then publishes a release (Semantic Release) and Docker image and deploys to Coolify. Deploy lives in this workflow because GitHub does not fire `release` events for releases created with `GITHUB_TOKEN`.
- **force_release.yml**: manually forces a release via `workflow_dispatch`.
- **git_mirror.yml**: mirrors `main` to Codeberg and GitLab on push.
- **yarn_update.yml**: monthly (and on its own change) automated yarn update PR.
- **delete_old_packages.yml**: weekly cleanup of old container package versions (keeps the latest 2).
- **dependabot.yml**: weekly dependency updates for npm, Docker, and GitHub Actions.

## Pre-commit Hooks (lefthook)

Runs sequentially on staged files:

1. Prettier – formats `.js/.ts/.jsx/.tsx/.css/.json/.md/.yml`
2. oxlint – fast lint + autofix for TypeScript/JavaScript
3. ESLint – full lint + autofix for TypeScript/JavaScript

Always run `yarn fix` before committing if hooks fail.
