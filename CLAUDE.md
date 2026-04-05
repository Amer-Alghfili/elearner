# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## About Elearner

Elearner is an all-in-one learning companion that consolidates the entire study workflow into a single platform. A typical learner juggles multiple tools across four key steps:

1. **Pick resources** — books, online courses, YouTube playlists
2. **Study and take notes** — note-taking apps like Notion or Obsidian
3. **Bookmark useful resources** — browser bookmarks, Raindrop, Pocket
4. **Active recall** — spaced-repetition flashcard apps like Anki or Quizlet

Elearner replaces all of these: learners save resources, write notes, create flashcards (with spaced repetition), and track practice tasks — all organized around **learns** (study topics owned by a user).

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

### Spaced repetition review flow

FlashCards and PracticeTasks share the same spaced repetition model: each has a `stage` (0–4), a `due` date, and an `answeredAt` timestamp.

**Stage intervals** (`service/knowledge-test.ts`):

| Stage | Next review in |
|-------|---------------|
| 0     | 1 day         |
| 1     | 3 days        |
| 2     | 7 days        |
| 3     | 14 days       |
| 4     | 30 days (max) |

**What happens when a user answers** (`app/review-learns/[id]/action.ts`):
1. The submitted stage is `current_stage + 1` (capped at 4), set via a hidden form field in the UI.
2. `calculateDueDate(newStage)` computes the next `due` date.
3. The item's `stage`, `due`, `answeredAt`, and (for flashcards) `submitted_answer` are updated in the database.

**Which items appear for review** (`app/review-learns/filters.ts`):
Items are shown if either:
- Their `due` date is ≤ now (i.e. they are due or overdue), **or**
- They were already answered today (`answeredAt` between start-of-today and start-of-tomorrow) — this keeps answered items visible for the rest of the day so users can revisit them.

**Review UI** (`app/review-learns/[id]/KnowledgeItemTestFlow.tsx`):
- Items are sorted with answered items first, unanswered after.
- The user starts at the first unanswered item.
- Flashcards support three answer types: `open-ended`, `multiple-choices`, and `true-false`.
- Practice tasks display their description as read-only BlockNote content.
- After answering the last item, the user is redirected to `/home` with a success toast.
