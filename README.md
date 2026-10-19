# Abhash Khadka — Portfolio & Blog

A modern, bilingual (English / Japanese) personal portfolio and blog built with Next.js, React, Tailwind CSS, and Firebase, featuring a custom CMS admin dashboard and AI-powered translations.

## Tech Stack

- **Framework:** Next.js 16 (App Router) — build uses `next build --webpack` (Turbopack + Serwist is unsupported)
- **UI:** React 19, Tailwind CSS 4, `@tailwindcss/typography`
- **Backend:** Firebase (Firestore + Storage)
- **PWA:** Serwist (`@serwist/next`)
- **Editor:** Tiptap
- **AI:** Google Generative AI (Gemini) for admin translations
- **Language:** TypeScript

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

3. Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> **Note:** In development the admin password defaults to `000Nepal` if `ADMIN_PASSWORD` is unset. In production an unset `ADMIN_PASSWORD` fails closed (login is disabled), so always set it.

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start dev server |
| `npm run build` | Production build (webpack mode, required by Serwist) |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm test` | Run unit tests once (Vitest) |
| `npm run test:watch` | Run tests in watch mode |

## Project Structure

```
src/
├── app/            # App Router routes (public pages, (auth), admin, metadata)
├── components/     # Reusable UI components
├── contexts/       # LanguageContext (en/ja) and global state
├── lib/            # firebase.ts, data.ts (fetching/typing), actions.ts (server actions)
└── proxy.ts        # Edge protection for /admin/*
```

## Admin

- Visit `/admin` — login is password-protected via an HTTP-only session cookie.
- All mutation server actions re-verify the session server-side (`requireAuth`).
- Public actions (contact form, comments, likes) are rate-limited per IP.

## Deployment

Security headers (CSP, HSTS, etc.) are defined in `netlify.toml`. If you deploy to another host, replicate those headers there.
