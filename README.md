<div align="center">

# 🐾 Corgi Planning Poker

A free, real-time planning poker app for agile teams — featuring a charming corgi mascot.

**[corgiplanningpoker.com](https://www.corgiplanningpoker.com)**

---

![Version](https://img.shields.io/badge/version-2.3.0-blue?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?style=for-the-badge&logo=vercel&logoColor=white)
![Bun](https://img.shields.io/badge/Bun-Package_Manager-fbf0df?style=for-the-badge&logo=bun&logoColor=black)

</div>

---

## ✨ Features

- **Real-time collaboration** — Vote and reveal estimates simultaneously with your team via WebSockets
- **Emoji throwables** — Arm an emoji and throw it at teammates with physics-based gravity arc, impact bursts, and multiplayer sync
- **Custom card configurations** — Choose from Fibonacci, Fibo+Manday, T-shirt sizes, or custom sequences
- **Room history** — Review past estimation sessions from recent rooms
- **No account required** — Just create a room and share the link
- **Responsive design** — Optimised for **Mac M5 14" (1512×982)** and **iPhone Pro (393×852)** as primary targets; fully usable across all screen sizes

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| UI Library | React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS + shadcn/ui (Radix UI) |
| State | Zustand + TanStack Query |
| Real-time | WebSockets (`react-use-websocket`) |
| Auth | NextAuth.js |
| Monitoring | Sentry |
| Analytics | Vercel Analytics + Speed Insights |
| Deployment | Vercel |
| Package Manager | Bun |

---

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh/) installed on your machine

### Installation

```bash
bun install
```

### Development

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
bun run build
bun start
```

### Lint

```bash
bun run lint
```

---

## 📁 Project Structure

```
src/
├── app/                  # Next.js App Router pages
│   ├── page.tsx          # Home page
│   ├── new-room/         # Create new room
│   ├── room/[id]/        # Planning poker room
│   ├── recent-rooms/     # Room history
│   └── privacy-policy/   # Privacy policy
├── components/           # UI components
│   ├── Home/             # Landing page
│   ├── Room/             # Poker room
│   ├── ThrowLauncher/    # Emoji throw feature (panel, overlay, physics hook)
│   ├── Table/            # Poker table with seat avatars
│   ├── NewRoom/          # Room creation form
│   ├── Navbar/           # Navigation
│   ├── Footer/           # Footer
│   └── ui/               # Shared shadcn/ui components
docs/
├── THROW_LAUNCHER.md     # ThrowLauncher feature guide
└── WS_THROW_EMOJI.md     # WebSocket API spec for multiplayer throw sync
└── ...
```

---

## 🔌 Backend

This frontend connects to **Planning Poker Service** — a Golang-based WebSocket backend that manages rooms, members, and voting state.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to your fork and open a pull request

---

## 📄 License

[MIT](./LICENSE)

---

## 📦 Changelog

### v2.3.0
- **Responsive**: primary targets Mac M5 14" (1512×982) desktop and iPhone Pro (393×852) mobile — CSS transform table scaling, horizontal snap-scroll card bar, mobile bottom sheet for players
- Room UX: collapsible/draggable voter panel (160–320px), hover preview when collapsed, time ago per player (supports m/h/d/mo)
- Room UX: ThrowPanel default expanded on desktop, revamped to match design system
- Room UX: card idle animation slowed, avatar ring visibility fixed, avatar overflow clipping fixed, pill name badges with hover tooltip
- Room UX: optimistic card selection, fix voted state flicker, fix member lookup for Google-authenticated users
- Room Creation: glassmorphism form card, Continue Room section (latest room), Fibo+Manday preset deck (`0–13`)
- Recent Rooms: responsive card list on mobile, fix broken date overflow
- Navbar: edge-to-edge layout
- Refactor: Room.tsx (~1274 lines) split into VoterPanel, ChatWidget, MobilePlayersSheet, ActivityFeed components

### v2.2.0
- Chat widget (coming soon placeholder), activity feed, jumbo card result with animated average score
- Room table responsive scaling, dark design system overhaul

### v2.1.0
- Add ThrowLauncher — physics-based emoji throwing with gravity arc, spin, impact burst, and floating holding preview
- Multiplayer sync: `THROW_EMOJI` / `EMOJI_THROWN` WebSocket events with resolution-independent targeting
- Custom SVG crosshair cursor, text selection disabled while aiming, disarm hint bar
- Spectator mode: panel and overlays hidden for spectators
- Docs: `WS_THROW_EMOJI.md` backend API spec and `THROW_LAUNCHER.md` feature guide

### v2.0.2
- Upgrade Next.js 14 → 16 and React 18 → 19
- Update all Radix UI packages and Sentry v7 → v10
- Add Turbopack config and migrate to flat ESLint config
- SEO improvements: metadata, OG tags, schema markup

### v2.0.1
- Polish navbar and room layout
- Update home page content and copy

### v2.0.0
- Revamp room page with table-first layout
- Redesign home page with new SEO-focused content

> Full release history: [GitHub Releases](https://github.com/raksitnongbua/planning-poker/releases)
