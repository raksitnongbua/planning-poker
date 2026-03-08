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
| `NEXT_PUBLIC_ROOM_ACTIVITY_HISTORY_ENABLED` | Set `"true"` to show round activity history feed in room (default hidden) |

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

---

## Design System

### Design Philosophy

- **Dark-native**: The entire UI is built for dark mode only. Never use light-mode assumptions (`bg-white`, `text-black`) — always use CSS variables or Tailwind tokens.
- **Transparent layers**: Page elements should be transparent and inherit the dark page background (`hsl(20, 14.3%, 4.1%)`). Avoid adding opaque `bg-muted/10` containers that create floating rectangles against the dark background.
- **Depth via elevation**: Use `bg-secondary` for elevated surfaces (cards, panels), `bg-muted/20` for list items, and `bg-background/95 backdrop-blur-md` for fixed/sticky overlays.
- **Subtle, not loud**: Prefer `border-border/40`, opacity-based colors (`bg-primary/10`, `text-primary/70`), and soft glows over harsh borders and full-opacity fills.

---

### Color Tokens (dark mode)

| Token | HSL value | Usage |
|---|---|---|
| `--background` | `20 14.3% 4.1%` | Page body, transparent containers |
| `--foreground` | `60 9.1% 97.8%` | Primary text |
| `--card` | same as background | Use `bg-secondary` instead for visible card elevation |
| `--primary` | `20.5 90.2% 48.2%` | Orange brand accent — CTAs, highlights, votes |
| `--secondary` | `12 6.5% 15.1%` | Elevated surfaces (cards, form backgrounds) |
| `--muted` | same as secondary | Subtle fills: `bg-muted/20` list items, `bg-muted/40` tabs |
| `--muted-foreground` | `24 5.4% 63.9%` | Secondary text, labels, placeholders |
| `--border` | same as secondary | `border-border/40` subtle borders, `border-border/60` visible |

**Practical color usage:**
- Page background: no class needed (body applies `bg-background`)
- Elevated card/panel: `bg-secondary` (solid) or `bg-secondary/60` (semi-transparent)
- Fixed overlays (navbar, right panel, cards bar): `bg-background/95 backdrop-blur-md`
- Hover states on list items: `hover:bg-muted/40`
- Primary action glow: `bg-primary/10 border-primary/30`
- Success: `text-green-400 bg-green-500/10 border-green-500/60`
- Warning/active: `text-orange-400 bg-orange-500/15`

---

### Typography

| Use case | Classes |
|---|---|
| Page headings | `text-2xl font-bold tracking-tight` |
| Section label | `text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60` |
| Body text | `text-sm font-medium` |
| Secondary / timestamp | `text-[10px] text-muted-foreground` |
| Micro label | `text-[9px] font-semibold uppercase tracking-widest` |
| Badge / vote value | `text-xs font-bold tabular-nums` |

Font: **Coda** (Google Fonts, weight 400) — loaded via `next/font/google` in `layout.tsx`.

---

### Spacing & Layout

**Room page layout** (`src/components/Room/Room.tsx`):
- Main container: transparent, `md:pl-14` (56px — matches ThrowPanel width) + dynamic right padding for voter panel
- Voter panel: default `200px` wide, collapsible to `40px`, draggable `160px–320px`
- ThrowPanel: `fixed left-3 top-[72px]`, `hidden md:flex` (desktop only, collapsed by default)
- Cards bar: `sticky bottom-0`, `bg-background/95 backdrop-blur-md border-t border-border/30`
- Breakpoint: `md` (768px) — below this the right panel is hidden, ThrowPanel is hidden

**Responsive pattern:**
- Mobile-first Tailwind with `md:` prefix for desktop enhancements
- On mobile: full-width content, floating bottom sheet for players (`isMobilePlayersOpen`), horizontal scroll for cards
- On desktop: right voter panel, activity feed, ThrowPanel

---

### Component Patterns

**Player / voter row:**
```tsx
// Normal (panelWidth ≥ 210px)
<div className="flex items-center gap-3 rounded-xl border border-border/40 bg-muted/20 px-3 py-2.5 hover:border-border/70 hover:bg-muted/40">
  <Avatar className="size-8 ring-1 ring-border" />      {/* 32px */}
  <p className="text-sm font-medium truncate" />         {/* name */}
  <p className="text-[10px] text-muted-foreground" />    {/* timestamp */}
  <span className="bg-primary/20 text-primary" />        {/* vote badge */}
</div>

// Compact (panelWidth < 210px)
gap-2, px-2 py-1.5, Avatar size-6, text-xs, no timestamp
```

**Status badge:**
```tsx
// Before reveal (my own vote)
"bg-primary/10 text-primary/70 ring-1 ring-inset ring-primary/30"
// After reveal
"bg-primary/20 text-primary"
```

**Floating panel / drawer:**
```tsx
className="fixed ... bg-background/95 backdrop-blur-md border-l border-border/40"
```

**Card (form/content):**
```tsx
className="border-white/8 bg-secondary shadow-2xl shadow-black/60"
```

**Subtle glow background (decorative):**
```tsx
// Single centered glow — don't use multiple competing orbs
<div className="absolute left-1/2 top-1/3 size-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/8 blur-[120px]" />
```

---

### Animations

All custom keyframes are in `tailwind.config.ts`:

| Class | Usage |
|---|---|
| `animate-shine` | Shine sweep on CTA buttons |
| `animate-aura` | Pulsing halo behind primary buttons |
| `animate-sway` | Gentle sway for the corgi banner |
| `animate-shake` | Icon wiggle (e.g., resume room icon) |
| `animate-heartbeat` | WS status dot pulse |
| `animate-card-idle` | Floating card animation |
| `animate-float` | General floating element |
| `animate-wink` | Corgi wink animation |

**Transition defaults:**
- Layout changes: `transition-all duration-300`
- Panel width/padding: `transition-[width] duration-300`, `transition-[padding] duration-300`
- Color/opacity: `transition-colors duration-200`
- During drag: disable transitions (`isDraggingPanel` flag removes transition classes)

---

### Voter Panel Design Rules

- Default width: `200px` (compact mode at `< 210px`)
- Min width: `160px`, Max width: `320px`
- Collapsed width: `40px` (shows personal vote or player count + expand hint)
- Drag handle: left edge, `faGripVertical` icon appears on hover
- Collapse button: `faAnglesRight` inside header, right of Invite button
- Expand: click anywhere on collapsed strip

**Compact mode (`panelWidth < 210`):**
- `p-3` padding, `gap-2` gap
- Avatar `size-6`, no timestamp subtext, `text-xs` names
- Progress bar label: `"X/Y voted"` (compact)

---

### Anti-patterns to Avoid

- ❌ `bg-muted/10` on a container that doesn't cover the full viewport — creates a visible grey rectangle on the dark page
- ❌ `rounded-t-2xl shadow-md` on the main room container — same issue
- ❌ Dynamic Tailwind classes based on runtime values (e.g., `` `md:pr-[${n}px]` ``) — use inline styles + SSR-safe default Tailwind class fallback
- ❌ `window.innerWidth` in JSX render — causes hydration mismatch; use CSS `md:` breakpoints or a `useEffect` mount check
- ❌ `overflow-x-auto` + `overflow-y-visible` on the same element — CSS forces `overflow-y` to `auto`; use `md:overflow-visible` to reset both
- ❌ Card images larger than their button container without `overflow-hidden` on the button — causes visual overlap between adjacent cards
- ❌ Multiple large competing glow orbs — use one subtle centered glow at `bg-primary/8` or less
