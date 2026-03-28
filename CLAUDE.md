# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm run dev               # Start dev server (Turbopack)

# Build (runs Chakra typegen + Prisma generate before Next.js build)
npm run build

# Database
npx prisma generate                        # Regenerate Prisma client
npx prisma migrate dev --name <name>       # Create and run a migration
npx prisma studio                          # Open Prisma Studio

# Chakra UI
npx @chakra-ui/cli typegen ./theme/index.ts  # Regenerate Chakra types (run after theme changes)

# Lint
npm run lint
```

No test framework is configured.

## Architecture

**Stack**: Next.js 16 (App Router) · React 19 · TypeScript · PostgreSQL via Prisma 7 · NextAuth 5 · Chakra UI 3 · Mantine · BlockNote · Tailwind CSS 4

### App Router structure

- `app/home` — authenticated dashboard showing user's learns
- `app/learns/[id]` — dynamic learn session; child routes:
  - `[notebookId]` — BlockNote editor for a specific notebook
  - `overview` — resources, notes, flashcards, practice tasks
- `app/review-learns` — spaced repetition review interface
- `app/login`, `app/signup` — auth pages
- `app/api/auth` — NextAuth route handler
- `app/lib` — server actions (Prisma mutations)

### Key files

| File | Purpose |
|------|---------|
| `auth.ts` | NextAuth setup (Credentials + Google providers) |
| `auth.config.ts` | Auth callbacks, session shape, route protection |
| `prisma.ts` | Prisma client singleton (PrismaPg adapter) |
| `theme/index.ts` | Chakra UI theme root — import recipes here |
| `theme/recipes/` | Chakra component recipes (button, input, checkbox…) |
| `components/ElearnerNoteEditor.tsx` | BlockNote editor wrapper |
| `service/knowledge-test.ts` | Spaced repetition scheduling logic |

### Database models (Prisma)

- **User** — email (PK), password (nullable for OAuth)
- **Learn** — a study topic owned by a User; has Resources, NoteFiles, FlashCards, PracticeTasks
- **Resource** — URL/link attached to a Learn, supports self-referential parent nesting
- **FlashCard** — spaced-repetition card with `stage`, `due` date, `options` (JSON), `answerType`
- **PracticeTask** — task with same `stage`/`due` fields as FlashCard
- **NoteFile** — notebook within a Learn (emoji, cover)
- **NoteFileBlock / LearnNoteBlock** — individual BlockNote blocks stored as `type` + `data` (JSON) + `order`

### UI conventions

- Chakra UI is the primary component system; use its theme recipes in `theme/recipes/` for styling variants.
- Mantine is used alongside Chakra specifically for BlockNote's Mantine integration (`@blocknote/mantine`).
- Tailwind is available but used sparingly — prefer Chakra props.
- After changing `theme/index.ts` or any recipe, run `npx @chakra-ui/cli typegen ./theme/index.ts` to keep generated types in sync (the build script does this automatically).

### Auth

NextAuth 5 (beta). Session contains `user.email`. Middleware in `auth.config.ts` redirects unauthenticated users to `/login`. Google OAuth and email/password (bcryptjs) are both supported.

### Data flow

- Server Components are the default; interactive pages are marked `"use client"`.
- Mutations go through server actions in `app/lib/`.
- BlockNote blocks are serialized to JSON and stored per-block in `NoteFileBlock`/`LearnNoteBlock` with an `order` integer.
- Spaced repetition stages and `due` dates are managed by `service/knowledge-test.ts`.
