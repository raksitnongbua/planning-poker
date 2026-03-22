<div align="center">

# 🐾 Corgi Planning Poker

**A charming, high-performance, real-time planning poker tool for modern agile teams.**

[**corgiplanningpoker.com**](https://www.corgiplanningpoker.com)

---

[![GitHub Release](https://img.shields.io/github/v/release/raksitnongbua/planning-poker?style=for-the-badge&color=orange)](https://github.com/raksitnongbua/planning-poker/releases)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Bun](https://img.shields.io/badge/Bun-Package_Manager-fbf0df?style=for-the-badge&logo=bun&logoColor=black)](https://bun.sh/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

</div>

---

## ✨ Features

*   **Real-Time Sync** — Seamless WebSocket-powered voting and simultaneous card reveals to eliminate anchoring bias.
*   **Emoji Throwables** — Add personality to your sessions! Arm and throw emojis at teammates with physics-based arcs, multiplayer sync, and impact effects.
*   **Zero-Friction Onboarding** — No account required. Automated guest identity via middleware means you can start a room and invite your team in under 10 seconds.
*   **Flexible Card Decks** — Choose from Fibonacci, T-Shirt sizes, Powers of 2, or create a fully custom sequence tailored to your team's workflow.
*   **Cross-Device Continuity** — Optional Google Sign-In to persist your identity and room history across browsers and devices.
*   **Device-Tailored Experience** — Fully responsive design with specific optimizations for desktop productivity and mobile-first participation.
*   **Jira Integration** — Connect a Jira issue directly to your room. View ticket details, sync estimation results back to a Jira field, and keep your backlog up to date without leaving the session.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) |
| **UI Library** | React 19 |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS + shadcn/ui (Radix UI) |
| **State** | Zustand (Global UI) + TanStack Query (Server State) |
| **Real-time** | WebSockets (`react-use-websocket`) |
| **Auth** | NextAuth.js (Optional Google Auth) |
| **Observability** | Sentry (Monitoring) + Vercel Analytics |
| **Deployment** | Vercel |
| **Runtime** | Bun |

---

## 🚀 Getting Started

### Prerequisites

*   [Bun](https://bun.sh/) installed on your machine.

### Installation

```bash
bun install
```

### Environment Configuration

Copy `.env.example` to `.env.local` and configure your keys:

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_ENDPOINT` | Go-based REST API base URL |
| `NEXT_PUBLIC_WS_ENDPOINT` | WebSocket backend endpoint |
| `NEXT_PUBLIC_ORIGIN_URL` | App origin (for invite links) |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth credentials |
| `NEXTAUTH_SECRET` | Secret for NextAuth JWT |
| `SENTRY_DSN` | Sentry DSN for error tracking |

### Development

```bash
bun dev
```

Open [**http://localhost:3000**](http://localhost:3000) to view the app.

---

## 📁 Project Structure

```text
src/
├── app/                  # Next.js App Router pages (Blog, Room, Privacy, etc.)
├── components/           # React components
│   ├── Home/             # Animated landing page
│   ├── Room/             # Main poker room logic & WebSocket sync
│   ├── ThrowLauncher/    # Emoji physics, panel & multiplayer sync
│   ├── Table/            # Interactive seat & avatar system
│   └── ui/               # Primitive shadcn/ui components
├── store/                # Global Zustand stores
├── i18n/                 # next-intl configuration (EN/TH support)
└── lib/                  # Shared utilities and configurations
```

---

## 🔌 Architecture & Backend

Corgi Planning Poker follows a decoupled architecture:
*   **Frontend**: This Next.js repository handles the interactive UI, local state, and guest identity middleware.
*   **Backend**: Connects to a high-concurrency [**Golang-based WebSocket service**](https://github.com/raksitnongbua/planning-poker-service) that manages room state, member synchronization, and message broadcasting.

---

## 🤝 Contributing

Contributions are welcome! Whether it's fixing a bug, adding a feature, or improving documentation:

1.  Fork the repository.
2.  Create a feature branch: `git checkout -b feature/your-feature`.
3.  Commit your changes: `git commit -m "feat: add your feature"`.
4.  Push to your fork and open a pull request.

---

## 📄 License

Distributed under the [MIT License](./LICENSE).

---

<div align="center">
  Built with ❤️ by <a href="https://github.com/raksitnongbua">Raksit Nongbua</a> & Kimi the Corgi.
</div>
