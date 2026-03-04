# WebSocket API — Throw Emoji (Multiplayer Sync)

Spec for synchronising the ThrowLauncher feature across all players connected to the same room.

**Endpoint**: `ws://<NEXT_PUBLIC_WS_ENDPOINT>/room/{userId}/{roomId}`

---

## Overview

When a player fires an emoji, the client sends `THROW_EMOJI` to the server. The server broadcasts `EMOJI_THROWN` to **all other clients** in the same room. Each receiving client plays the throw animation originating from the sender's player card.

Throw events are **fire-and-forget** — the server does not persist them and does not echo back to the sender.

---

## Messages

### Client → Server: `THROW_EMOJI`

Sent when the local user fires an emoji at a target. The payload differs depending on whether the target is a specific player card or a free-aim position.

**Targeting a player card:**
```json
{
  "action": "THROW_EMOJI",
  "payload": {
    "emoji": "🚀",
    "target_member_id": "user-bob123"
  }
}
```

**Free-aim (table / floor click):**
```json
{
  "action": "THROW_EMOJI",
  "payload": {
    "emoji": "🚀",
    "target_x_ratio": 0.45,
    "target_y_ratio": 0.38
  }
}
```

| Field | Type | Description |
|---|---|---|
| `emoji` | `string` | Single emoji character |
| `target_member_id` | `string` *(optional)* | ID of the targeted player. The **receiver** resolves this to the actual card position on their own screen, ensuring accuracy across different resolutions. |
| `target_x_ratio` | `float` 0–1 *(optional)* | Target X as a fraction of sender's `window.innerWidth`. Used only for free-aim throws. |
| `target_y_ratio` | `float` 0–1 *(optional)* | Target Y as a fraction of sender's `window.innerHeight`. Used only for free-aim throws. |

> **Why `target_member_id` instead of coords for player targets**: Player cards live in a fixed right panel. Their absolute pixel position depends on the receiver's viewport width, not the sender's. If Alice (1920px wide) sends pixel ratios and Bob (1280px wide) remaps them, the throw lands off-target. By sending the member ID, Bob looks up the card on *his* screen and gets the exact position.

---

### Server → Client: `EMOJI_THROWN`

Broadcast by the server to **all clients except the sender** when a throw is received.

```json
{
  "action": "EMOJI_THROWN",
  "payload": {
    "from_user_id": "user-abc123",
    "emoji": "🚀",
    "target_member_id": "user-bob123"
  }
}
```
or (free-aim):
```json
{
  "action": "EMOJI_THROWN",
  "payload": {
    "from_user_id": "user-abc123",
    "emoji": "🚀",
    "target_x_ratio": 0.45,
    "target_y_ratio": 0.38
  }
}
```

| Field | Type | Description |
|---|---|---|
| `from_user_id` | `string` | ID of the thrower. Receiver looks up their card by `[data-member-id]` to determine projectile origin. |
| `emoji` | `string` | Single emoji character |
| `target_member_id` | `string` *(optional)* | Present when throw targets a specific player. Receiver resolves to that card's position on their own screen. |
| `target_x_ratio` | `float` 0–1 *(optional)* | Present for free-aim throws. Receiver remaps to their own viewport dimensions. |
| `target_y_ratio` | `float` 0–1 *(optional)* | Present for free-aim throws. |

---

## Backend Requirements

1. **Route**: Handle `THROW_EMOJI` action on the existing room WebSocket handler.
2. **Broadcast**: Fan out `EMOJI_THROWN` to all connections in `roomId` **except the connection that sent the message**.
3. **No persistence**: Do not store throw events in any database or cache.
4. **No validation**: Treat `emoji` as an opaque string. No allowlist required.
5. **Payload passthrough**: Copy `emoji`, `target_x_ratio`, `target_y_ratio` verbatim. Inject `from_user_id` from the authenticated connection context (same `userId` used in the WS URL).
6. **Concurrent safety**: Multiple throws from different players in rapid succession must all be broadcast independently without dropping messages.
7. **Spectators receive**: Spectators are connected to the same room WebSocket and will receive `EMOJI_THROWN`. The frontend handles suppressing the UI for spectators.

---

## Frontend Coordinate Resolution

**DOM attribute**: Both right-panel member cards and table seat wrappers carry `data-member-id="{userId}"`.

**Throw origin** (resolved from DOM on the receiver's screen):
```ts
const fromCard = document.querySelector(`[data-member-id="${from_user_id}"]`)
const fromRect = fromCard?.getBoundingClientRect()
const fromX = fromRect ? fromRect.left + fromRect.width / 2 : window.innerWidth - 80
const fromY = fromRect ? fromRect.top + fromRect.height / 2 : window.innerHeight / 2
```

**Throw target**:
```ts
if (target_member_id) {
  // Member target (right-panel card or table seat avatar) — resolve on receiver's screen.
  // Accurate across resolutions because fixed-panel card positions differ by viewport width.
  const toCard = document.querySelector(`[data-member-id="${target_member_id}"]`)
  const toRect = toCard?.getBoundingClientRect()
  targetX = toRect ? toRect.left + toRect.width / 2 : window.innerWidth / 2
  targetY = toRect ? toRect.top + toRect.height / 2 : window.innerHeight / 2
} else {
  // Free-aim (empty table area) — simple viewport ratio remap.
  // Minor positional drift across different resolutions is acceptable.
  targetX = target_x_ratio * window.innerWidth
  targetY = target_y_ratio * window.innerHeight
}
```

**Target detection on table click**: walk up the DOM from the click target to find the nearest `[data-member-id]` ancestor within the table area. If found, treat as a member-targeted throw; otherwise treat as free-aim.

---

## Sequence Diagram

```
Alice (sender)                  Server                  Bob (receiver)
     │                             │                         │
     │── THROW_EMOJI ─────────────>│                         │
     │   { emoji, target ratios }  │                         │
     │                             │── EMOJI_THROWN ────────>│
     │   (no echo)                 │   { from_user_id:Alice, │
     │                             │     emoji,              │
     │                             │     target ratios }     │
     │                             │                         │
     │ [plays animation locally]   │          [Bob finds Alice's card,
     │                             │           re-maps ratios to his
     │                             │           viewport, plays animation]
```

---

## Error Handling

- If `from_user_id` is not found in the receiver's member list, the throw originates from the right-center fallback position `(window.innerWidth - 80, window.innerHeight / 2)`.
- If `target_x_ratio` or `target_y_ratio` are out of 0–1 range on the receiver side, the throw still fires — it may land off-screen but will not crash.
- The feature is non-critical: a dropped or malformed throw message is silently ignored.
