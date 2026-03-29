# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Commands

**Package manager:** Bun (required — not npm/yarn)

```bash
bun install         # Install dependencies
bun dev             # Start dev server with Turbopack (http://localhost:3000)
bun run build       # Production build
bun start           # Start production server
bun run lint        # ESLint check
```

No test suite is configured.

## Environment Variables

Copy `.env.example` to `.env.local`:

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_API_ENDPOINT` | REST API base URL (Go backend) |
| `NEXT_PUBLIC_WS_ENDPOINT` | WebSocket endpoint (Go backend) |
| `NEXT_PUBLIC_ORIGIN_URL` | App origin (used for invite links) |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth via NextAuth |
| `NEXTAUTH_SECRET` | NextAuth JWT secret |
| `SENTRY_DSN` | Sentry error tracking |
| `NEXT_PUBLIC_ROOM_ACTIVITY_HISTORY_ENABLED` | Set `"true"` to show round activity history feed in room (default hidden) |

## Architecture Overview

Next.js 16 (App Router) + React 19 frontend connecting to a Go WebSocket backend.

**Guest identity & SEO** (`src/proxy.ts`): On every request — generates guest UUID via `/api/v1/guest/sign-in` if no UID cookie; detects `?hl=` for locale cookie + `x-locale` header injection.

**Auth** (`src/app/api/auth/[...nextauth]/option.ts`): NextAuth with Google provider overlays the guest system. Guests can use all features.

**WebSocket room state** (`src/components/Room/Room.tsx`): Single WebSocket via `react-use-websocket`. Incoming: `NEED_TO_JOIN`, `UPDATE_ROOM`. Outgoing: `JOIN_ROOM`, `REVEAL_CARDS`, `RESET_ROOM`, `UPDATE_ESTIMATED_VALUE`.

**State management:** Zustand (`useLoadingStore`, `useUserInfoStore`) + TanStack Query for REST mutations + local `useState` for ephemeral room state.

**Custom deck configs** (`DESK_CONFIG_KEY`): `&`-delimited JSON strings in cookies. Favorites in `localStorage`.

### Component Structure

- `src/components/ui/` — shadcn/ui primitives (do not modify directly)
- `src/components/common/` — shared wrappers (e.g., `Dialog`)
- `src/components/<Feature>/` — feature components with `index.ts` barrel export
- `src/store/zustand.ts` — global Zustand stores
- `src/utils/httpClient.ts` — Axios pre-configured with `NEXT_PUBLIC_API_ENDPOINT`

### Conventions

- Path alias `@/` -> `src/`
- ESLint: sorted imports via `eslint-plugin-simple-import-sort`
- Prettier: `prettier-plugin-tailwindcss` (Tailwind class sorting)
- Dark mode only (`className="dark"` fixed on `<html>`)
- React 19 rules: see `.claude/rules/react-guidelines.md`

---

## Design System

**Core philosophy:** Dark-native, transparent layers, depth via elevation, subtle not loud.

### Color Tokens

| Token | HSL | Usage |
|---|---|---|
| `--background` | `20 14.3% 4.1%` | Page body |
| `--foreground` | `60 9.1% 97.8%` | Primary text |
| `--primary` | `20.5 90.2% 48.2%` | Orange accent — CTAs, votes |
| `--secondary` | `12 6.5% 15.1%` | Elevated surfaces |
| `--muted` | same as secondary | `bg-muted/20` items, `bg-muted/40` tabs |
| `--muted-foreground` | `24 5.4% 63.9%` | Labels, placeholders |
| `--border` | same as secondary | `border-border/40` subtle, `/60` visible |

**Common patterns:** overlay -> `bg-background/95 backdrop-blur-md` · hover -> `hover:bg-muted/40` · glow -> `bg-primary/10 border-primary/30` · success -> `text-green-400 bg-green-500/10` · warning -> `text-orange-400 bg-orange-500/15`

### Typography

| Use case | Classes |
|---|---|
| Page heading | `text-2xl font-bold tracking-tight` |
| Section label | `text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60` |
| Body | `text-sm font-medium` |
| Secondary / timestamp | `text-[10px] text-muted-foreground` |
| Badge / vote | `text-xs font-bold tabular-nums` |

Font: **Coda** (Google Fonts weight 400) via `next/font/google` in `layout.tsx`.

### Layout

**Room page** (`src/components/Room/Room.tsx`):
- Container: transparent, `md:pl-14` + dynamic right padding for voter panel
- Voter panel: `200px` default, `40px` collapsed, `160-320px` draggable, compact at `< 210px`
- ThrowPanel: `fixed left-3 top-[72px]`, `hidden md:flex`
- Cards bar: `sticky bottom-0 bg-background/95 backdrop-blur-md border-t border-border/30`
- Breakpoint `md` (768px): below -> mobile sheet, hidden panels; above -> full layout

### Component Patterns

| Component | Key classes |
|---|---|
| Voter row (normal) | `flex items-center gap-3 rounded-xl border border-border/40 bg-muted/20 px-3 py-2.5 hover:bg-muted/40` · Avatar `size-8` |
| Voter row (compact) | `gap-2 px-2 py-1.5` · Avatar `size-6` · `text-xs` · no timestamp |
| Vote badge (pre-reveal) | `bg-primary/10 text-primary/70 ring-1 ring-inset ring-primary/30` |
| Vote badge (revealed) | `bg-primary/20 text-primary` |
| Floating panel | `fixed bg-background/95 backdrop-blur-md border-l border-border/40` |
| Form card | `border-white/8 bg-secondary shadow-2xl shadow-black/60` |
| Decorative glow | `absolute left-1/2 top-1/3 size-[560px] -translate-x-1/2 rounded-full bg-primary/8 blur-[120px]` |

### Animations

Defined in `tailwind.config.ts`: `animate-shine` (CTA sweep) · `animate-aura` (button halo) · `animate-sway` (corgi banner) · `animate-shake` (icon wiggle) · `animate-heartbeat` (WS dot) · `animate-card-idle` · `animate-float` · `animate-wink`

**Transitions:** layout `transition-all duration-300` · panel width `transition-[width] duration-300` · colors `transition-colors duration-200` · drag: remove transition classes via `isDraggingPanel`

### Anti-patterns

- `bg-muted/10` on non-full-viewport containers — visible grey rectangle on dark background
- Dynamic Tailwind classes from runtime values (`` `md:pr-[${n}px]` ``) — use inline styles + static fallback class
- `window.innerWidth` in JSX render — hydration mismatch; use `md:` breakpoints or `useEffect`
- `overflow-x-auto` + `overflow-y-visible` on same element — use `md:overflow-visible` to reset
- Card images without `overflow-hidden` on the button container — visual overlap between cards
- Multiple large glow orbs — one centered glow at `bg-primary/8` max
