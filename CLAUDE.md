# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

**Package manager:** Bun (required — not npm/yarn)

```bash
bun install         # Install dependencies
bun dev             # Start dev server with Turbopack (http://localhost:3000)
bun run build       # Production build
bun start           # Start production server
bun run lint        # ESLint check
```

No test suite is configured in this project.

## Environment Variables

Copy `.env.example` to `.env.local` and fill in:

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_API_ENDPOINT` | REST API base URL (Go backend) |
| `NEXT_PUBLIC_WS_ENDPOINT` | WebSocket endpoint (Go backend) |
| `NEXT_PUBLIC_ORIGIN_URL` | App origin (used for invite links) |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth via NextAuth |
| `NEXTAUTH_SECRET` | NextAuth JWT secret |
| `SENTRY_DSN` | Sentry error tracking |

## Architecture Overview

**Corgi Planning Poker** is a Next.js 14 (App Router) frontend that connects to a separate Go WebSocket backend.

### Key architectural patterns

**Guest identity via middleware** (`src/middleware.ts`): On every request, if the user has no UID cookie, the middleware calls the backend's `/api/v1/guest/sign-in` to auto-generate a guest UUID and sets it as a cookie. This UID is used for WebSocket room connections without requiring login.

**Optional Google auth** (`src/app/api/auth/[...nextauth]/option.ts`): NextAuth with Google provider overlays the guest system. Signed-in users get avatar/name persistence; guests can still use all features.

**WebSocket room state** (`src/components/Room/Room.tsx`): The main room page manages all state via a single WebSocket connection (`react-use-websocket`). Incoming messages are `action`-typed JSON (`NEED_TO_JOIN`, `UPDATE_ROOM`); outgoing messages are actions like `JOIN_ROOM`, `REVEAL_CARDS`, `RESET_ROOM`, `UPDATE_ESTIMATED_VALUE`.

**State management split**: Zustand for global UI state (loading overlay, user UID). TanStack Query for mutations (creating rooms via REST). Local `useState` for room-specific ephemeral state.

**Custom deck configs persisted in cookies** (`DESK_CONFIG_KEY`): Custom card deck configurations are stored as `&`-delimited JSON strings in cookies. Favorites are stored in `localStorage`.

### Component structure

- `src/components/ui/` — shadcn/ui primitive components (Radix UI based, do not modify directly)
- `src/components/common/` — shared wrappers (e.g., `Dialog`)
- `src/components/<Feature>/` — feature components, each with an `index.ts` barrel export
- `src/store/zustand.ts` — global Zustand stores (`useLoadingStore`, `useUserInfoStore`)
- `src/utils/httpClient.ts` — Axios instance pre-configured with `NEXT_PUBLIC_API_ENDPOINT`

### Import conventions

- Path alias `@/` maps to `src/`
- ESLint enforces sorted imports via `eslint-plugin-simple-import-sort`
- Prettier with `prettier-plugin-tailwindcss` handles formatting (Tailwind class sorting)

### Styling

Dark mode only (`className="dark"` fixed on `<html>`). Tailwind CSS with shadcn/ui design tokens (`hsl(var(--primary))` etc.). Custom animations defined in globals (`animate-shine`, `animate-sway`, `animate-aura`, `animate-shake`, `animate-spin-slow`).
