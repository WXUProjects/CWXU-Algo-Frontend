# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CWXU-Algo-Frontend (无锡学院算法协会前端) — a monitoring and statistics platform for a university algorithm association. Tracks competitive programming activity across multiple OJ platforms (NowCoder, Luogu, AtCoder, CodeForces, LeetCode) with heatmaps, rankings, contest tracking, and an admin dashboard.

## Commands

```sh
npm install          # Install dependencies
npm run dev          # Dev server on port 3000
npm run build        # Type-check + build (parallel)
npm run build-only   # Build without type-checking
npm run type-check   # Run vue-tsc --build
npm run preview      # Preview production build
```

No linter, formatter, or test framework is configured.

## Tech Stack

- Vue 3 + Composition API (`<script setup lang="ts">`)
- TypeScript 5.9
- Vite 7 (with `@` alias → `./src/`)
- Pinia (Composition API style stores)
- Vue Router (HTML5 history mode)
- Axios for HTTP
- ECharts + vue-echarts for charts
- Pure CSS with custom properties (no Tailwind, no preprocessors, no component library)
- Node `^20.19.0 || >=22.12.0`

## Architecture

### API Layer

All API calls are in `src/utils/api.ts` — a single `API` class with static nested objects organizing endpoints into namespaces: `API.user.auth.*`, `API.user.profile.*`, `API.user.group.*`, `API.core.*`, `API.agent.*`.

Every method returns a `stdResponse<T>` with `{ message, success, data }`. Authenticated requests include a `Bearer` JWT header. Passwords are SHA256-hashed client-side before transmission.

Vite proxies `/api/*` to `VITE_API_URL/v1/*` in development (configured in `vite.config.ts`).

### Routing & Auth

Routes in `src/router/index.ts` with two guards:
- `loginGuard` — requires `userStore.isLogin`, redirects to `/login?redirect=...`
- `adminGuard` — requires `userStore.isAdmin`, redirects to `/`

All route components are lazy-loaded via dynamic `import()`.

### State Management

Two Pinia stores using Composition API style:
- `useUserStore` (`src/stores/user.ts`) — auth state (derived from JWT), user profile, role checks
- `useBotLogStore` (`src/stores/bot-log.ts`) — bot message log with timestamps

### Styling

- Dark/light theme toggled via `data-theme` attribute on `<html>` with variables in `src/assets/css/theme.css`
- Responsive font sizes in `src/assets/css/fontsize.css` (6 breakpoints)
- Scoped styles in Vue SFCs
- Layout: fixed sidebar (320px) + scrollable main content
- Responsive breakpoints: 1024px, 860px, 640px, 480px

### Toast Notification System

Custom event-based: utility dispatches `CustomEvent` on `window` (`src/utils/toast.ts`), `ToastNotification.vue` listens and renders.

### Build-time Constants

`__GIT_HASH__` and `__GIT_DATE__` injected via `vite.config.ts` for footer display.

## Key Directories

- `src/views/` — page-level components (one per route)
- `src/views/Dashboard/` — admin-only pages (Statistics, Group, User)
- `src/components/` — reusable UI components (Calendar heatmap, Rank, Terminal, etc.)
- `src/utils/` — utility classes (API, JWT, hash, validation, links, analysis, bot messages)
- `src/stores/` — Pinia stores
- `src/router/` — route definitions and guards
- `src/assets/css/` — global CSS (theme, fonts, shared table/nav styles)

## Conventions

- Comments and UI text are primarily in Chinese
- Utility modules use ES6 classes with static methods (not plain objects or functions)
- `@` path alias maps to `./src/`
- Environment variables: `VITE_API_URL` (backend base URL)
