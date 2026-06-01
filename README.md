<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript" />
  <img src="https://img.shields.io/badge/Prisma-7-2D3748?style=for-the-badge&logo=prisma" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss" />
  <img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" />
</p>

# 🎵 Vybe — Let Your Fans Choose the Music

**Vybe** is a real-time collaborative music queue where creators share a link, fans add YouTube tracks and upvote their favorites, and the most popular song plays next — automatically. Think of it as a democratic jukebox for streamers, DJs, and content creators.

---

## ✨ Features

- 🔐 **Google Authentication** — One-click sign in via NextAuth with Google OAuth
- 🎶 **Add Songs** — Paste any YouTube link to add a track to the queue
- 👍 **Upvote System** — Fans upvote songs; the most voted song plays next
- ⏱️ **Real-time Queue** — Queue auto-refreshes every 10 seconds for all viewers
- ▶️ **Now Playing** — Embedded YouTube player with auto-play and auto-advance to the next top song
- 🔗 **Shareable Links** — One-click copy of your unique creator queue link
- 🚫 **Duplicate Protection** — Users can only upvote a song once; duplicate votes are handled gracefully
- 🏠 **Landing Page** — Modern dark-themed landing page with feature showcase and auth-aware CTAs
- 🎨 **OKLCh Design System** — Custom warm coral/red color palette using CSS custom properties

> **Coming soon:** Spaces — support for multiple streaming rooms per creator

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) |
| **Database** | [PostgreSQL](https://www.postgresql.org/) |
| **ORM** | [Prisma 7](https://www.prisma.io/) with `@prisma/adapter-pg` |
| **Auth** | [NextAuth.js 4](https://next-auth.js.org/) (Google Provider) |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) |
| **UI Components** | [Radix UI](https://www.radix-ui.com/) primitives |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **YouTube** | [youtube-player](https://www.npmjs.com/package/youtube-player) (playback) + [youtube-search-api](https://www.npmjs.com/package/youtube-search-api) (metadata) |
| **Notifications** | [Sonner](https://sonner.emilkowal.dev/) |
| **HTTP Client** | [Axios](https://axios-http.com/) |

---

## 📁 Project Structure

```
vybe/
├── app/
│   ├── api/
│   │   └── streams/
│   │       ├── route.ts              # GET queue & POST add song
│   │       ├── next/route.ts         # GET play next (most upvoted)
│   │       ├── upvote/route.ts       # POST upvote a song
│   │       └── downvote/route.ts     # POST remove an upvote
│   ├── components/
│   │   ├── Appbar.tsx                # Navbar with auth (Music icon + login/logout)
│   │   └── StreamView.tsx            # Main queue + player + voting UI
│   ├── creator/
│   │   └── [...creatorId]/page.tsx   # Public fan-facing queue (no player controls)
│   ├── dashboard/
│   │   └── page.tsx                  # Creator dashboard (with player + play next)
│   ├── lib/
│   │   ├── authOptions.ts            # NextAuth config (Google provider + callbacks)
│   │   ├── db.ts                     # Prisma client singleton
│   │   └── utils.ts                  # Shared utilities (YT_REGEX, cn())
│   ├── generated/prisma/             # Auto-generated Prisma client
│   ├── globals.css                   # Design tokens (OKLCh color system)
│   ├── layout.tsx                    # Root layout (fonts, providers, toaster)
│   └── page.tsx                      # Landing page
├── components/ui/                    # shadcn/ui components (Button, Card, Input, etc.)
├── prisma/
│   └── schema.prisma                 # Database schema
├── providers.tsx                     # NextAuth SessionProvider wrapper
└── package.json
```

---

## 🗄️ Database Schema

```
User ──┐
       ├──< Stream ──< Upvote >── User
       │      │
       │      └── CurrentStream
       │
       └──< Space ──< Stream
```

### Models

| Model | Purpose | Key constraints |
|-------|---------|-----------------|
| **User** | Authenticated users | `email @unique` |
| **Stream** | YouTube songs in queue | `userId` FK → User |
| **Upvote** | Vote on a song | `@@unique([userId, streamId])` — one vote per user per song |
| **CurrentStream** | What's currently playing | `userId @unique` — one active stream per user |
| **Space** | Room grouping (future) | `hostId` FK → User |

### Enums

- `StreamType` — `Spotify` | `Youtube`
- `Provider` — `Google` | `Credentials`

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ 
- **PostgreSQL** database (local or hosted — e.g. [Neon](https://neon.tech), [Supabase](https://supabase.com))
- **Google OAuth** credentials from [Google Cloud Console](https://console.cloud.google.com/)

### 1. Clone & Install

```bash
git clone https://github.com/Haarush2006/Vybe.git
cd vybe
npm install
```

### 2. Environment Variables

Create a `.env` file in the project root:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/vybe"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# NextAuth
NEXTAUTH_SECRET="generate-a-random-secret-string"
NEXTAUTH_URL="http://localhost:3000"
```

> **Tip:** Generate a secret with `openssl rand -base64 32`

### 3. Setup Database

```bash
# Create tables and generate Prisma client
npx prisma migrate dev --name init
npx prisma generate
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you should see the landing page.

### 5. Production Build

```bash
npm run build
npm start
```

---

## 📡 API Reference

All API routes require authentication (except `GET /api/streams` for public queue viewing).

### Streams

| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| `GET` | `/api/streams?creatorId=<id>` | — | Fetch queue (sorted by votes) + currently playing stream |
| `POST` | `/api/streams` | `{ creatorId, url }` | Add a YouTube song to the queue |

### Playback

| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| `GET` | `/api/streams/next` | — | Play the most upvoted unplayed song. Marks it as played and sets it as current. |

### Voting

| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| `POST` | `/api/streams/upvote` | `{ streamId }` | Upvote a song. Returns `400` if already upvoted. |
| `POST` | `/api/streams/downvote` | `{ streamId }` | Remove your upvote from a song. |

### Response Format

**GET `/api/streams`** returns:
```json
{
  "streams": [
    {
      "id": "uuid",
      "title": "Song Title",
      "url": "https://youtube.com/...",
      "smallImg": "https://...",
      "bigImg": "https://...",
      "upvotes": 5,
      "voted": true
    }
  ],
  "activeStream": {
    "stream": { "id": "uuid", "title": "Currently Playing", ... }
  }
}
```

---

## 🎨 Design System

The UI uses a custom dark theme built on the **OKLCh** color space for perceptually uniform colors.

### Color Tokens

| Token | OKLCh Value | Preview | Usage |
|-------|-------------|---------|-------|
| `--primary` | `oklch(0.72 0.3 21)` | 🔴 Warm coral | Buttons, active states, accents, icons |
| `--accent` | `oklch(0.68 0.28 21)` | 🟠 Deep coral | Hover states, secondary accents |
| `--background` | `oklch(0.08 0 0)` | ⚫ Near black | Page background |
| `--card` | `oklch(0.12 0 0)` | ⬛ Dark gray | Card backgrounds |
| `--secondary` | `oklch(0.2 0 0)` | 🔘 Medium dark | Secondary surfaces |
| `--muted` | `oklch(0.25 0 0)` | 🔘 Muted surface | Disabled / muted backgrounds |
| `--border` | `oklch(0.18 0 0)` | ➖ Subtle border | Borders, dividers |
| `--input` | `oklch(0.15 0 0)` | ⬛ Input dark | Input field backgrounds |
| `--foreground` | `oklch(0.95 0 0)` | ⚪ Near white | Primary text |
| `--muted-foreground` | `oklch(0.65 0 0)` | 🩶 Gray | Secondary / placeholder text |

### Usage in Components

```tsx
// Buttons
className="bg-primary hover:bg-primary/90 text-primary-foreground"

// Cards
className="bg-card border-border hover:border-primary/30"

// Voted state
className={stream.voted ? 'bg-primary/20 text-primary' : 'hover:bg-primary/20'}

// Text
className="text-foreground"         // Primary text
className="text-muted-foreground"   // Secondary text
```

All tokens are defined in `app/globals.css` as CSS custom properties and mapped through Tailwind's `@theme inline` block.

---

## 🔑 Key Pages

| Route | Access | Description |
|-------|--------|-------------|
| `/` | Public | Landing page with features, CTA, and auth |
| `/dashboard` | Authenticated | Creator view with YouTube player + play next controls |
| `/creator/[creatorId]` | Public | Fan-facing queue — add songs & vote (no player controls) |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is private and not licensed for public distribution.
