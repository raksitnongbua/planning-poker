# ThrowLauncher Feature

A fun, physics-based emoji throwing feature for the Planning Poker room. Players can arm an emoji and throw it at teammates or anywhere on the table. Disabled entirely for spectators.

---

## File Structure

```
src/components/ThrowLauncher/
  useThrowLauncher.ts   — all state, physics engine, keyboard handler
  ThrowPanel.tsx        — fixed left-side launcher UI (armed state, emoji grid)
  ThrowOverlay.tsx      — fixed full-screen overlays (projectiles, impacts, holding preview)
  index.ts              — barrel export
  THROW_LAUNCHER.md     — this file
```

---

## User Flow

```
1. Click an emoji in the left panel  →  emoji is "armed" (panel border turns orange)
2. Hover over a player card          →  holding preview floats above the card
3. Click the card / table area       →  emoji flies in a gravity arc toward target
4. On landing                        →  impact burst + ring animation plays
5. Emoji stays armed                 →  can throw multiple times
6. Click same emoji / press Esc      →  disarm
```

---

## Architecture

### `useThrowLauncher(shooterRef)`

Custom hook that owns all throw state. Takes a `React.RefObject<HTMLDivElement>` pointing to the **current user's own player card** (the projectile launch origin).

#### State

| Field | Type | Description |
|---|---|---|
| `armedEmoji` | `string \| null` | Currently armed emoji. `null` = idle. |
| `thrown` | `ThrownItem[]` | Active in-flight projectiles (renders in DOM via id). |
| `impacts` | `ThrownItem[]` | Active impact bursts at target coordinates. |
| `isExpanded` | `boolean` | Whether the emoji grid is open. Defaults to `true`. |
| `hoveredMemberId` | `string \| null` | ID of the member card being hovered while armed. |
| `hoveredCardCenter` | `{x,y} \| null` | Viewport coordinates of the hovered card's top-center. |

#### Returned API

| Method / Value | Description |
|---|---|
| `handleArmEmoji(emoji)` | Arms the emoji, or disarms if same emoji is clicked again. Clears hover state. |
| `handleFire(x, y)` | Fires the armed emoji toward viewport coordinates. No-op if nothing armed. |
| `disarm()` | Clears `armedEmoji`, `hoveredMemberId`, `hoveredCardCenter`. |
| `toggleExpanded()` | Toggles the emoji grid open/closed. |
| `setHoveredMemberId` | Raw setter — used by Room to report which card is hovered. |
| `setHoveredCardCenter` | Raw setter — used by Room to report the card's top-center coords. |

#### Physics Engine (`fireAt`)

Runs a `requestAnimationFrame` loop — no CSS animation classes, direct DOM style mutation for performance.

```
Parabolic Y:  y = startY + dy*t  -  arcHeight * 4*t*(1-t)
              └─ linear target ──┘  └─── arc peak at t=0.5 ────┘

arcHeight   = min(distance * 0.4, 220px)   — taller arc for longer throws
duration    = clamp(distance * 0.9, 600ms, 1100ms)
scale       = grows 1→1.375 during flight, shrinks to 0.05 on landing
opacity     = fades 1→0 from t=0.8 onward
spin        = spinDir * t * 480°  (direction: left throw spins left, right spins right)
```

**No-spin emojis** (`NO_SPIN_EMOJIS`): `🔥 🎉 🧨 🎃 🧸 ❤️ 💀` — these don't rotate during flight because their shape/direction looks unnatural when spinning.

**Impact effect**: When `t >= 1`, a hit entry is added to `impacts` state and auto-removed after 600ms. Two layered CSS animations play at the target:
- `animate-hit` — emoji scales 1.5→3.2 and fades
- `animate-hit-ring` — orange ring expands 0.2→3.5 and fades

#### Fallback origin

If `shooterRef.current` is null (user hasn't joined, or panel is collapsed), the projectile launches from `(window.innerWidth - 80, window.innerHeight / 2)` — the right-center edge.

---

### `ThrowPanel`

The floating left-side panel. Purely presentational — receives everything via props.

```tsx
<ThrowPanel
  armedEmoji={launcher.armedEmoji}
  isExpanded={launcher.isExpanded}
  onToggleExpand={launcher.toggleExpanded}
  onArmEmoji={launcher.handleArmEmoji}
  onDisarm={launcher.disarm}
/>
```

**Idle state**: ghost panel with 🎯 icon + "THROW" label. Matches the page's `bg-background/95 border-border/40 backdrop-blur-md`.

**Armed state**: panel border shifts to `border-primary/30`, header shows the armed emoji with an orange dot badge. Hovering the header emoji reveals a `✕` (disarm on click).

**Emoji grid**: 25 emojis in a 2-column grid. Armed emoji highlighted with `border-primary/40 bg-primary/15`. Scrollable via `overflow-y-auto` hidden scrollbar.

**Position**: `fixed left-3 top-[72px]` — top-left, just below the navbar.

---

### `ThrowOverlay`

Renders three independent layers on top of everything (`z-40`/`z-50`):

```tsx
<ThrowOverlay
  armedEmoji={launcher.armedEmoji}
  hoveredCardCenter={launcher.hoveredCardCenter}
  thrown={launcher.thrown}
  impacts={launcher.impacts}
/>
```

| Layer | Condition | Description |
|---|---|---|
| Holding preview | `armedEmoji && hoveredCardCenter` | Armed emoji floats and bobs (`animate-float`) above hovered card with "CLICK TO THROW" pill and `▾` arrow |
| Flying items | `thrown.length > 0` | One `<div id="thrown-{id}">` per projectile. Positioned by RAF loop. `willChange: transform, left, top, opacity`. |
| Impact bursts | `impacts.length > 0` | Emoji (`animate-hit`) + ring (`animate-hit-ring`) at target coords. Auto-removed at 600ms. |

---

## Integration in Room.tsx

```tsx
// 1. Ref pointing to current user's own player card
const myCardRef = React.useRef<HTMLDivElement>(null)

// 2. Hook
const launcher = useThrowLauncher(myCardRef)

// 3. Attach ref to current user's card
<div ref={member.id === id ? myCardRef : undefined} ...>

// 4. Table area — fire on click
<div
  className={launcher.armedEmoji ? 'cursor-crosshair' : ''}
  onClick={(e) => launcher.handleFire(e.clientX, e.clientY)}
>

// 5. Member cards — hover preview + click to fire
<div
  onMouseEnter={(e) => {
    if (!launcher.armedEmoji) return
    const r = e.currentTarget.getBoundingClientRect()
    launcher.setHoveredMemberId(member.id)
    launcher.setHoveredCardCenter({ x: r.left + r.width / 2, y: r.top })
  }}
  onMouseLeave={() => {
    launcher.setHoveredMemberId(null)
    launcher.setHoveredCardCenter(null)
  }}
  onClick={(e) => {
    if (!launcher.armedEmoji) return
    const r = e.currentTarget.getBoundingClientRect()
    launcher.handleFire(r.left + r.width / 2, r.top + r.height / 2)
  }}
>

// 6. Render — gated for spectators
{!isSpectator && (
  <>
    <ThrowPanel ... />
    <ThrowOverlay ... />
  </>
)}
```

---

## Tailwind Animations

Defined in `tailwind.config.ts`:

| Name | Duration | Usage |
|---|---|---|
| `animate-hit` | 500ms ease-out | Emoji splat at impact point |
| `animate-hit-ring` | 500ms ease-out | Orange ring burst at impact |
| `animate-float` | 1.1s ease-in-out infinite | Holding preview bob above hovered card |

---

## Emoji List (25 total)

`🗑️ 🚀 ❤️ 💩 🎉 💣 ⚡ 🍕 🥊 🔥 💀 🧨 🎃 🍌 🥚 🏈 ❄️ 🥕 🍔 👟 🦴 🫐 🧸 🎈 🍩`

No-spin (fly without rotation): `🔥 🎉 🧨 🎃 🧸 ❤️ 💀`

---

## Constraints

- **Spectators**: `ThrowPanel` and `ThrowOverlay` are not rendered. `disarm()` is called when a player switches to spectator mode.
- **Multiple in-flight**: Concurrent throws are fully supported — each has a unique `throwId` and its own RAF loop.
- **No CSS animation for trajectory**: The flight path uses direct DOM style mutation (`el.style.*`) via RAF for smooth, precise parabolic control unavailable in pure CSS keyframes.
