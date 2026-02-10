# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Surayt Learn is a language-learning PWA for Turoyo (Surayt), a modern Aramaic language. It is a **vanilla HTML/CSS/JS app with no build step, no bundler, no framework, no npm**. All JS loads via `<script>` tags in `index.html`.

## Development Commands

```bash
# Serve locally (any static server works, there is no build process)
python3 -m http.server 8000
# Then open http://localhost:8000

# Deploy (GitHub Pages auto-deploys from main branch)
git push origin main
```

There are no tests, linters, or build steps. Changes take effect immediately on page reload.

## Architecture

### Single-page app with tab navigation

Everything is in `index.html`. Five tabs controlled by `switchTab()`:

| Tab | Page ID | JS module | What it does |
|-----|---------|-----------|-------------|
| Home | `page-overview` | inline in index.html | Landing page, proverb of the day, category grid |
| Practice | `page-a` | `version-a.js` (VersionA) | Gamified lessons: typing, matching, sentence exercises |
| Study | `page-b` | `version-b.js` (VersionB) | SRS flashcards with FSRS algorithm |
| Script | `page-script` | `script-tab.js` (ScriptTab) | Serto alphabet explorer |
| Record | `page-rec` | `recorder.js` (Recorder) | Audio pronunciation recorder |

### Data layer (dual: local JS + NocoDB)

Content currently loads from local JS files. The API layer exists but frontend modules haven't been wired to use it yet.

**Local JS data files** (loaded via script tags, expose global constants):
- `data.js` → `WORDS` (90 items), `CATEGORIES` (9), `PROVERBS` (3)
- `data-alphabet.js` → `ALPHABET` (22 letters, uses `var`)
- `data-phrases.js` → `PHRASES` (14 items, uses `var`)
- `conv-data.js` → `CONV_SCRIPTS` (6 conversations), `PROVERB_DETAILS` (3, uses `var`)

**NocoDB** (same data, synced): 7 tables at `nocodb.run8n.xyz`, accessed through n8n webhooks.

**Important**: `data.js` uses `const`, the other data files use `var`. This matters if loading them in Node.js with `vm.runInContext` (only `var` creates context properties).

### Backend proxy (n8n → NocoDB)

The browser never talks to NocoDB directly. Three n8n workflows proxy all requests:

| Webhook | Method | Auth | n8n Workflow ID |
|---------|--------|------|-----------------|
| `/webhook/surayt-content` | GET | None (public) | `1lAXLYXbcpkrHZdc` |
| `/webhook/surayt-user` | POST | `X-App-Key` header | `WJVgvn9AaEQOBgeN` |
| `/webhook/surayt-audio` | POST | `X-App-Key` + token | `s6V10msYVTScyQMp` |

The NocoDB API token lives in n8n's credential vault (ID `RwsNAtv3iBCVs2i1`), never in the browser.

`js/api.js` wraps all three endpoints. Progress writes are debounced (5s) and flushed on `visibilitychange`.

### JS module pattern

All modules use either IIFE (`const X = (() => { ... })()`) or object literal (`var X = { ... }`) patterns. They expose a single global: `VersionA`, `VersionB`, `ConversationMode`, `Recorder`, `ScriptTab`, `GrammarXray`, `ExerciseTypes`, `VFX`, `API`.

Dependencies are declared in file headers as comments. Load order in `index.html` matters:
`api.js` → `data.js` → `data-alphabet.js` → `data-phrases.js` → `vfx.js` → `exercise-types.js` → `version-a.js` → `version-b.js` → `grammar.js` → `conv-data.js` → `conversations.js` → `recorder-ui.js` → `recorder.js` → `script-tab.js`

### localStorage keys

All user state is in localStorage (not yet migrated to API):

| Key | Module | Content |
|-----|--------|---------|
| `turoyo_a_xp`, `_streak`, `_lessons`, `_last_date` | VersionA | Practice progress |
| `turoyo_b_cards`, `_b_stats` | VersionB | SRS card state |
| `turoyo_conv_done`, `_prov_seen` | ConversationMode | Completed conversations/proverbs |
| `turoyo_rec_speaker`, `_stories` | Recorder | Speaker name, story recordings |
| `turoyo_lang` | index.html | UI language (en/de) |
| `turoyo_welcomed` | index.html | Onboarding shown flag |
| `surayt_user_token` | API | User auth token |
| `surayt_api_content` | API | Cached content from n8n |

### Bilingual support

`window.T(obj)` returns `obj.en` or `obj.de` based on `localStorage.turoyo_lang`. All user-facing content objects have `en` and `de` fields.

## Conventions

- **File size limit**: 400 lines max per file. Split large files into modules.
- **No build tools**: Plain JS with `var`/`const`, no imports/exports, no JSX, no TypeScript.
- **Serto text**: Always pair with Latin transliteration. Requires Noto Sans Syriac font.
- **Word objects**: `{id, latin, serto, en, de, cat, note?, gender?}` — see `data.js` for the shape.
- **Data sync**: When adding content to JS data files, also upload to NocoDB tables to keep them in sync.

## Key documentation

| Doc | What it covers |
|-----|---------------|
| `docs/architecture.md` | System setup, NocoDB tables, n8n workflows, deployment, migration status |
| `docs/api-reference.md` | All webhook endpoints with curl examples, NocoDB admin reference |
| `docs/app-design.md` | Design philosophy, UI versions, feature rationale |
| `docs/language-reference.md` | Turoyo grammar, vocabulary patterns, exercise types |
| `n8n/` | Workflow JSON backups (already deployed on run8n.xyz) |

## Migration status

Backend is live (n8n + NocoDB). Frontend still reads from local JS files. Remaining work:
- Wire `version-a.js`, `version-b.js`, `conversations.js`, `recorder.js` to use `API.fetchContent()` instead of global JS constants
- Add user creation/login flow in the UI
- Implement offline fallback (API → localStorage cache → retry on reconnect)
