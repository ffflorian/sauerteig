![Sauerteig logo](public/img/sauerteig_128.png)

# sauerteig [![Build Status](https://github.com/ffflorian/sauerteig/workflows/Main/badge.svg)](https://github.com/ffflorian/sauerteig/actions/)

Bake the best sour dough bread.

Sauerteig is an installable Progressive Web App that walks you through baking sourdough bread one step at a time. The recipe and all UI text are in German.

## Features

- **Step-by-step guide**: six stages from the starter (Anstellsauer) to the finished loaf, with ingredients and instructions for each step.
- **Reminder timers**: start a countdown for any waiting period and get a browser notification when it expires - even hours or days later.
- **Light and dark theme**: follows your system preference and can be toggled manually; your choice is remembered.
- **Multiple navigation modes**: arrow keys, swipe gestures, and on-screen buttons.
- **Progress persistence**: your current step and running timers are stored in `localStorage`, so you can close the app and pick up where you left off.
- **Installable PWA**: add it to your home screen and use it offline-friendly.

## Tech stack

React 19, TypeScript 6, and Vite 8. See [AGENTS.md](AGENTS.md) for the full stack, project structure, and contribution conventions.

## Install

```
yarn
```

## Start

Runs the dev server at http://localhost:5173 and opens it in your browser.

```
yarn start
```

## Build

Type-checks and bundles into `dist/`.

```
yarn dist
```

## Docker

The app ships as an nginx-served Docker image (see [`Dockerfile`](Dockerfile)).

```
docker build -t sauerteig .
docker run -p 8080:8080 sauerteig
```

The container exposes the app on port 8080 and provides a `/_health` endpoint.

## Recipe

The full recipe is also available as plain text in [Rezept.md](Rezept.md).

## License

[GPL-3.0](LICENSE)
