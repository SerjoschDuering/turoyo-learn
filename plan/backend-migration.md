# Turoyo Learn — Backend Migration Plan

## Overview

Migrate from fully client-side (localStorage) to NocoDB backend so:
- Content is manageable via spreadsheet UI by non-programmers
- User progress persists across devices
- Audio recordings stored properly (not base64 in localStorage)
- n8n workflows can add content from PDFs via AI extraction

## Architecture

| Layer | Tool | Who |
|---|---|---|
| Frontend | Vercel (auto-deploy from GitHub) | Sister edits via GitHub web UI |
| Database + API | NocoDB (run8n stack) | Sister manages content in spreadsheet UI |
| Content pipeline | n8n → AI → NocoDB | Sister builds workflows to extract from PDFs |
| Audio storage | NocoDB attachments | App handles upload/playback |
| Auth | URL token `?user=abc123` | No passwords, no OAuth |

## Step 1: Extract Repo

- Extract `turoyo-learn/` from `static-sites` into its own GitHub repo
- Clean history or fresh start (TBD)
- Connect to Vercel for auto-deploy
- Add README for sister explaining edit/deploy workflow

## Step 2: Create NocoDB Tables

Create workspace "Turoyo Learn" on NocoDB, invite sister as Creator.

### Content Tables (sister manages)

#### `words` (~100 rows)

The main table. Sister adds vocabulary here.

| Field | Type | Notes |
|---|---|---|
| word_id | Text (unique) | `greet_01` — never rename after creation |
| latin | Text | `shlomo` |
| serto | Text | `ܫܠܳܡܐ` (needs Noto Sans Syriac font) |
| en | Text | English meaning |
| de | Text | German meaning |
| category | SingleSelect | Greetings, Family, Food, Body, Nature, House, Animals, Numbers, Grammar |
| gender | SingleSelect | m, f, (blank) |
| note | Text | Cultural/etymology note |
| root | Text | Semitic root: `sh-l-m` |
| root_meaning | Text | "peace / wholeness" |
| pos | Text | Part of speech: "noun (m.)" |
| related_words | Text | Comma-separated: `shlomo, shlomo lux, b-shayno` |
| root_family | LongText | Semitic cognate info across languages |
| root_example | Text | Usage example sentence |
| source | Text | Provenance: "Slomo Surayt Ch.3" (for n8n traceability) |

Grammar fields (root through root_example) are optional — leave blank for words without etymology data.

#### `alphabet` (22 rows)

| Field | Type | Notes |
|---|---|---|
| letter_id | Text (unique) | `let_01` |
| letter | Text | Serto character |
| name | Text | Letter name: `Bet` |
| latin | Text | `Bb` |
| sound | Text | `b` |
| form_isolated | Text | Unicode form |
| form_initial | Text | Unicode form |
| form_medial | Text | Unicode form |
| form_final | Text | Unicode form |
| group | SingleSelect | connect-both, connect-right |
| note | Text | "Silent carrier letter" etc. |
| examples | LongText | One per line: `bayto \| ܒܰܝܬܐ \| house \| Haus` |

#### `phrases` (~14 rows)

| Field | Type | Notes |
|---|---|---|
| phrase_id | Text (unique) | `ph_01` |
| turoyo_words | Text | Pipe-separated: `Shlomo\|lux` |
| en | Text | English translation |
| de | Text | German translation |
| category | SingleSelect | greetings, family, daily |

#### `conversations` (~50 rows, denormalized)

Each row = one turn of dialogue. Turns for the same conversation share `conv_id` and `conv_title`.

| Field | Type | Notes |
|---|---|---|
| conv_id | Text | `conv_greet` (same for all turns in one conversation) |
| conv_title | Text | "Meeting Someone" (repeated per turn) |
| icon | Text | Emoji, only on first turn of each conversation |
| difficulty | Number | 1-3, only on first turn |
| source | Text | "book" or blank, only on first turn |
| turn_order | Number | 1, 2, 3... |
| speaker | SingleSelect | A, B |
| turoyo | Text | Turoyo text |
| en | Text | English translation |
| de | Text | German translation |
| is_exercise | Checkbox | Whether user fills this in |
| exercise_type | SingleSelect | options, typing, (blank) |
| options | Text | Pipe-separated answer choices |
| hint | Text | Typing hint: `shm-i` |

Non-interactive dialogues (from DIALOGUES array) are also stored here with `is_exercise = false` for all turns.

#### `proverbs` (3 rows)

| Field | Type | Notes |
|---|---|---|
| latin | Text | Proverb in Latin script |
| en | Text | English translation |
| de | Text | German translation |
| word_breakdown | LongText | `Man = who (relative pronoun); d- = that (connector); lo = not (negation)` |
| grammar_note | LongText | Grammar explanation |
| culture_note | LongText | Cultural context |

### User Tables (app writes via API)

#### `users`

| Field | Type | Notes |
|---|---|---|
| token | Text (unique) | Random string, used in URL `?user=abc123` |
| display_name | Text | Optional, chosen on first visit |
| lang | SingleSelect | en, de |
| progress | JSON | ALL progress in one blob (see below) |
| last_active | DateTime | Updated on each session |

The `progress` JSON blob contains:

```json
{
  "xp": 450,
  "streak": 3,
  "last_date": "2026-02-07",
  "lessons": { "greetings": 3, "family": 1 },
  "daily": { "2026-02-07": { "score": 3, "xp": 30 } },
  "srs": {
    "greet_01": { "due": 1738900000000, "stability": 2.5, "reps": 4, "lapses": 0, "lastRating": 3 },
    "greet_02": { "due": 1738800000000, "stability": 1.0, "reps": 2, "lapses": 1, "lastRating": 2 }
  },
  "srs_stats": { "reviews": 150, "correct": 120 },
  "conv_done": ["conv_greet", "conv_market"],
  "proverbs_seen": ["prov_01"]
}
```

#### `audio_recordings`

| Field | Type | Notes |
|---|---|---|
| user_token | Text | Links to user |
| word_id | Text | Which word (blank for stories) |
| type | SingleSelect | word, story |
| title | Text | For stories |
| speaker_name | Text | "Hathto", "Babo", etc. |
| audio_file | Attachment | Actual audio file (webm/mp4) |
| duration | Number | Seconds |
| recorded_at | DateTime | |

## Step 3: Migrate App Code

### API Layer

Add a thin API module (`js/api.js`) that:
- On load: fetches all content tables, caches in memory
- On user identified: fetches user row by token
- On progress change: PATCHes the user's progress JSON
- On recording: POSTs audio as attachment

### Auth Flow

```
App loads → check URL for ?user=xxx
  → If found: fetch user from NocoDB, load progress
  → If not found: show screen with two options:
    1. "Create new profile" → generates random token, creates user row, redirects with ?user=xxx
    2. "I have a link" → paste/enter existing token
```

### Offline Fallback

Keep localStorage as cache. On load: try NocoDB first, fall back to cache if offline. Sync when reconnected. Not required for v1 but prevents breakage.

## Step 4: n8n Content Pipeline

Sister builds n8n workflows like:

```
PDF upload trigger
  → Extract text (PDF node)
  → Send to AI (Claude/GPT node): "Extract Turoyo vocabulary from this text. Return JSON with latin, serto, en, de, category."
  → Parse JSON
  → For each word: NocoDB node → insert into `words` table with source = "Filename Ch.X"
```

Variations for conversations, phrases, proverbs.

## Design Decisions & Rationale

| Decision | Why |
|---|---|
| No `categories` table | SingleSelect on `words` handles it. 9 categories don't need their own table. |
| Conversations denormalized (one row = one turn) | Flat spreadsheet is easier for non-programmer than linked records. |
| JSON blob for user progress | One GET, one PUT. Fine for handful of users. Avoids 5+ join tables. |
| Pipe-separated text for arrays | `Shlomo\|lux` is easier to edit in spreadsheet than JSON `["Shlomo","lux"]` |
| No separate dialogues table | Merged into conversations with `is_exercise = false` |
| `source` column on words | Tracks where content came from — critical for n8n PDF pipeline |
| Audio as NocoDB attachments | Replaces base64-in-localStorage (which hits 5MB quota fast) |
| URL token auth | Simplest possible auth for family/community use. No passwords. |

## Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Sister renames a `word_id` → breaks user progress links | Mark ID columns as read-only in NocoDB, add column description warning |
| JSON progress blob too large | At ~100 SRS cards = ~15-20KB, well within limits. Only a concern at 1000+ words |
| NocoDB down → app broken | Offline fallback with localStorage cache (v2) |
| API token visible in browser DevTools | Acceptable for family app. Add Windmill proxy if it ever grows |
| Serto characters show as boxes in NocoDB | Sister needs Noto Sans Syriac font installed |

## Migration Checklist

- [ ] Create new GitHub repo for turoyo-learn
- [ ] Set up Vercel deployment
- [ ] Create NocoDB workspace + invite sister
- [ ] Create all 7 tables with correct field types
- [ ] Seed content tables from current JS data files (script or manual)
- [ ] Add `js/api.js` module for NocoDB communication
- [ ] Implement auth flow (URL token)
- [ ] Migrate Version A (practice) to read content from API
- [ ] Migrate Version B (SRS) to read/write progress via API
- [ ] Migrate recorder to use NocoDB attachments
- [ ] Migrate conversations to read from API
- [ ] Migrate grammar X-ray to read from API
- [ ] Test offline fallback (v2)
- [ ] Write sister's README with workflow instructions
- [ ] Set up sample n8n workflow for PDF → words extraction
