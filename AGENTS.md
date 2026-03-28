# Sauerteig – Agent Guide

Sauerteig is a German-language interactive web app that walks users step-by-step through baking sourdough bread. It is deployed as a static site on GitHub Pages.

## Tech Stack

- **React 19** with **TypeScript 6** (strict mode)
- **Vite 8** as build tool and dev server
- **date-fns 4** for time formatting (German locale)
- **react-swipeable** for touch gestures
- **ESLint** + **oxlint** for linting, **Prettier** for formatting
- **lefthook** for pre-commit hooks
- **Semantic Release** for automated versioning and changelogs

## Commands

```bash
yarn install        # install dependencies
yarn start          # start dev server (http://localhost:5173)
yarn build          # type-check + Vite build
yarn dist           # clear dist/ then build
yarn lint           # run all linters (Prettier, oxlint, ESLint)
yarn fix            # auto-fix all linting issues
yarn test           # placeholder (no tests yet)
```

Always use `yarn`, not `npm`, for all package management and script execution.

After making any code changes, always run `yarn fix` to catch and auto-fix linting or formatting errors before committing.

## Project Structure

```
src/
  index.tsx            # entry point (React StrictMode)
  App.tsx              # root component, wraps with SauerteigProvider
  Content.tsx          # main layout: navigation, theme toggle, step display
  Introduction.tsx     # step 0 – table of contents and ingredient overview
  Step.tsx             # displays a single recipe step with countdown timer
  SauerteigProvider.tsx # React Context for current step (persisted to localStorage)
  data.ts              # recipe data: 6 steps, ingredients, timings
  index.css            # global styles with CSS custom properties for theming
public/
  img/                 # bread logo in sizes 16–512px + SVG
  manifest.json        # PWA manifest
index.html             # HTML entry point
```

## Key Architecture Decisions

- **State management**: React Context (`SauerteigContext`) for the current step; no external state library.
- **Persistence**: `localStorage` keys – `SauerteigStep` (current step), `SauerteigTheme` (light/dark preference).
- **Theme**: CSS custom properties on `:root[data-theme]`. System preference detected via `prefers-color-scheme`; user override persisted to `localStorage`.
- **Navigation**: keyboard (arrow keys), swipe gestures, and on-screen buttons all supported.
- **Base URL**: `/sauerteig` in production, empty string in development (see `vite.config.ts`).

## Conventions

- **Branches**: use the format `<fix/feat/chore>/<branch-name>` (e.g. `feat/dark-mode`, `fix/icon-alignment`). Do not prefix branch names with `claude/`.
- **Commits**: follow Conventional Commits (Angular preset) – `feat:`, `fix:`, `chore:`, etc. Breaking changes use `BREAKING CHANGE:` in the footer. Do not add Claude session URLs to commit messages or PR texts.
- **Versioning**: automated via Semantic Release on push to `main`.
- **Language**: all UI content and comments are in German.
- **Code style**: 2-space indent, LF line endings, UTF-8 (enforced by `.editorconfig` and Prettier).
- **TypeScript**: strict mode enabled; no `any` without justification.

## CI/CD

- **build_test_publish.yml**: runs lint → test → build on every push/PR to `main`; deploys to GitHub Pages (`gh-pages` branch) on `main` merges.
- **codeql.yml**: CodeQL security analysis on push/PR to `main` and weekly.
- **yarn_update.yml**: monthly automated yarn update PR.
- **dependabot.yml**: automated dependency version updates.

## Pre-commit Hooks (lefthook)

Runs sequentially on staged files:

1. Prettier – formats `.js/.ts/.jsx/.tsx/.css/.json/.md/.yml`
2. oxlint – fast lint + autofix for TypeScript/JavaScript
3. ESLint – full lint + autofix for TypeScript/JavaScript

Always run `yarn fix` before committing if hooks fail.
