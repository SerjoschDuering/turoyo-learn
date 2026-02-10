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

### Data layer (dual: local JS + NocoDB via DataLoader)

On boot, `DataLoader.init()` tries the API first, then falls back to built-in JS data. The overview renders immediately with built-in data; if the API responds, it re-renders with fresh content.

**Built-in JS data files** (loaded via script tags, expose global arrays/objects):
- `data.js` → `WORDS` (90 items), `CATEGORIES` (9), `PROVERBS` (3)
- `data-alphabet.js` → `ALPHABET` (22 letters, uses `var`)
- `data-phrases.js` → `PHRASES` (14 items, uses `var`)
- `conv-data.js` → `CONV_SCRIPTS` (6 conversations), `PROVERB_DETAILS` (3, uses `var`)

**DataLoader** (`js/data-loader.js`): Calls `API.fetchContent()`, maps API fields to the global shapes above, splices data in-place using `.length = 0; forEach push`. All consumer modules continue reading the same globals.

**NocoDB** (same data, synced): 7 tables at `nocodb.run8n.xyz`, accessed through n8n webhooks.

**Important**: `data.js` uses `const`, the other data files use `var`. Both support in-place mutation (`.length=0`, `.push()`).

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

All modules use either IIFE (`const X = (() => { ... })()`) or object literal (`var X = { ... }`) patterns. They expose a single global: `VersionA`, `VersionB`, `ConversationMode`, `Recorder`, `ScriptTab`, `GrammarXray`, `ExerciseTypes`, `VFX`, `API`, `DataLoader`.

Dependencies are declared in file headers as comments. Load order in `index.html` matters:
`api.js` → `data.js` → `data-alphabet.js` → `data-phrases.js` → `data-loader.js` → `vfx.js` → `exercise-types.js` → `version-a.js` → `version-b.js` → `grammar.js` → `conv-data.js` → `conversations.js` → `recorder-ui.js` → `recorder.js` → `script-tab.js`

### localStorage keys

User state is in localStorage as primary store, synced to API when a user token exists:

| Key | Module | Content |
|-----|--------|---------|
| `turoyo_a_xp`, `_streak`, `_lessons`, `_last_date` | VersionA | Practice progress |
| `turoyo_b_cards`, `_b_stats` | VersionB | SRS card state |
| `turoyo_conv_done`, `_prov_seen` | ConversationMode | Completed conversations/proverbs |
| `turoyo_rec_speaker`, `_stories` | Recorder | Speaker name, story recordings |
| `turoyo_lang` | index.html | UI language (en/de) |
| `turoyo_welcomed` | index.html | Onboarding shown flag |
| `turoyo_user_name` | index.html | User display name |
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

Backend is wired. `DataLoader` bridges API → global JS vars. Service Worker enables offline PWA. User auth creates accounts via n8n. Progress syncs (debounced) to server. Remaining work:
- Build n8n workflow for PDF → AI → vocabulary extraction *(requires n8n admin)*
- Expand grammar root analysis beyond 30 words *(content task)*
- Add more conversation scripts *(content task)*
- n8n audio workflow needs fixing to actually store audio binary (currently metadata-only)
