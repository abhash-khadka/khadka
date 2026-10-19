<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project Overview: Personal Portfolio & Blog

This project is a modern, bilingual personal portfolio and blog website built with Next.js, React, Tailwind CSS, and Firebase. It features a robust custom CMS admin dashboard for content management and AI-powered translations.

## Tech Stack
- **Framework:** Next.js 16 (App Router)
- **UI & Styling:** React 19, Tailwind CSS 4, @tailwindcss/typography
- **Backend & Database:** Firebase (Firestore & Firebase Storage)
- **PWA:** Serwist (@serwist/next)
- **Rich Text Editor:** Tiptap
- **AI Integration:** Google Generative AI (Gemini 2.5 Flash) for automated translations
- **Language:** TypeScript

## Key Features

### 1. Bilingual Support (i18n)
- Supports English and Japanese out-of-the-box using a custom React Context (`LanguageContext.tsx`).
- Website content, including landing page, portfolio, blogs, and contact info, is fetched and displayed based on the active language.

### 2. Dynamic Theming
- Native Dark and Light mode support.
- Fully customizable theme colors (backgrounds, text, accents, borders) that are stored in Firestore and dynamically applied across the app. These colors can be managed in the Admin panel.

### 3. Admin Dashboard (`/admin`)
- **Authentication:** Protected via cookie-based sessions and server-side password validation (`actions.ts`).
- **AI & Translation Settings (`/admin/ai`):** Manage Gemini API keys, select primary models (e.g. Gemini 2.5 Flash, 2.5 Pro, 2.0 Flash) or custom models, configure failover models for quota/rate limits, and test translations interactively.
- **Blog Management:** Full CRUD capabilities for blog posts utilizing a Tiptap-based rich text editor and Firebase Storage for image uploads.
- **Portfolio Management:** Add, edit, and categorize portfolio items with technology tags and external links (Live/GitHub).
- **Page Content Management:** Dynamically update Landing page (Hero, About, Images) and Contact page texts in both languages.
- **Inbox/Messages:** View and manage user messages submitted through the public contact form.

### 4. AI-Powered Translations
- Implements a server action `translateText` utilizing Google Generative AI (Gemini) to automatically assist the admin in translating content between English and Japanese.
- Resolves configuration dynamically via `getEffectiveAiConfig()` from Firestore (`site/ai`) with seamless fallback to environment variables (`GOOGLE_AI_STUDIO_API_KEY`, `GOOGLE_AI_STUDIO_MODEL`).

### 5. Server Actions & Firebase
- Employs Next.js Server Actions (`src/lib/actions.ts`) for all server-side mutations, providing a seamless, API-route-free developer experience.
- Uses Firebase Firestore as a NoSQL database (`site`, `blogs`, `portfolio`, `messages` collections) acting as a custom CMS.

### 6. Progressive Web App (PWA)
- Offline-ready and installable via Serwist integration (`manifest.ts`, `sw.ts`).

## Project Structure
- `src/app/`: Next.js App Router definitions, including public pages, `(auth)` group, and `admin` routes.
- `src/components/`: Reusable React components (Navbar, Hero, RichTextEditor, ThemeToggle, TranslateButton, etc.).
- `src/contexts/`: React contexts for global state (e.g., `LanguageContext`).
- `src/lib/`: Core logic including Firebase initialization (`firebase.ts`), data typing and fetching (`data.ts`), and Server Actions (`actions.ts`).
