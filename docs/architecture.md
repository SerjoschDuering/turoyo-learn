# Surayt Learn -- Architecture Reference

Technical architecture and setup reference for Surayt Learn.

> A PWA for learning Turoyo (Surayt), backed by NocoDB for content management
> and n8n webhooks as a secure API proxy. Deployed on GitHub Pages.

---

## 1. System Overview

| Layer | Tool | URL | Status |
|---|---|---|---|
| Frontend | Static PWA on GitHub Pages | `https://{username}.github.io/turoyo-learn/` | Live |
| API proxy | n8n webhooks on run8n.xyz | `https://run8n.xyz/webhook/surayt-*` | Live (3 workflows) |
| Database | NocoDB | `https://nocodb.run8n.xyz` (workspace: Surayt-App) | Live (7 tables, seeded) |
| Audio storage | NocoDB attachments via n8n | -- | Workflow ready, not wired in frontend |
| Auth | Token in localStorage, validated by n8n | -- | Workflow ready, not wired in frontend |

Content is managed by non-programmers in NocoDB's spreadsheet UI.
n8n workflows can also add content via AI-driven PDF extraction.

---

## 2. Architecture Diagram

```
 Browser (PWA)
   |
   |--- GET  /webhook/surayt-content ----> [n8n: Content API] ---> NocoDB (5 content tables)
   |--- POST /webhook/surayt-user -------> [n8n: User API]    ---> NocoDB (users table)
   |--- POST /webhook/surayt-audio ------> [n8n: Audio API]   ---> NocoDB (audio_recordings)
   |
   |  X-App-Key header on user/audio      n8n holds NocoDB API
   |  No NocoDB token in browser           token in credential vault
```

Fallback: if the API is unreachable, the frontend falls back to built-in JS data
files (`js/data.js`, `js/data-phrases.js`, etc.).

---

## 3. NocoDB Tables

7 tables in the **Surayt-App** workspace at `nocodb.run8n.xyz`.

### Content tables (5)

| Table | Rows | Key fields |
|---|---|---|
| **words** | ~90 | `word_id` (unique), `latin`, `serto`, `en`, `de`, `category`, `gender`, `note`, `root`, `pos`, `source` |
| **alphabet** | 22 | `letter_id`, `letter`, `name`, `latin`, `sound`, forms (isolated/initial/medial/final), `group`, `note`, `examples` |
| **phrases** | ~14 | `phrase_id`, `turoyo_words` (pipe-separated), `en`, `de`, `category` |
| **conversations** | ~42 | `conv_id`, `conv_title`, `turn_order`, `speaker`, `turoyo`, `en`, `de`, `is_exercise`, `exercise_type`, `options`, `hint` |
| **proverbs** | 3 | `latin`, `en`, `de`, `word_breakdown` (JSON), `grammar_note`, `culture_note` |

### Words table -- expanded schema

| Field | Type | Example / Notes |
|---|---|---|
| word_id | Text (unique) | `greet_01`, `food_11` -- never change after creation |
| latin | Text | `shlomo` |
| serto | Text | Syriac script, optional |
| en / de | Text | English / German translations |
| category | SingleSelect | Greetings, Family, Food, Body, Nature, House, Animals, Numbers, Grammar |
| gender | SingleSelect | m, f, or blank |
| note | Text | Cultural / etymology note |
| root, root_meaning, pos, related_words, root_family, root_example | Text | Grammar fields (optional) |
| source | Text | Provenance, e.g. "Slomo Surayt Ch.3" |

### User tables (2)

| Table | Key fields |
|---|---|
| **users** | `token`, `display_name`, `lang`, `progress` (JSON blob), `last_active` |
| **audio_recordings** | `user_token`, `word_id`, `type`, `title`, `speaker_name`, `audio_file` (Attachment), `duration`, `recorded_at` |

**Progress JSON shape:**
```json
{
  "xp": 450, "streak": 3, "last_date": "2026-02-07",
  "lessons": { "greetings": 3, "family": 1 },
  "srs": { "greet_01": { "due": 1738900000, "stability": 2.5, "reps": 4 } },
  "conv_done": ["conv_greet"], "proverbs_seen": ["prov_01"]
}
```

### Design rationale

- **No categories table** -- SingleSelect on words handles 9 categories.
- **Conversations denormalized** (1 row = 1 turn) -- flat spreadsheet is easier for non-programmers.
- **JSON blob for progress** -- one GET, one PUT; avoids 5+ join tables.
- **Pipe-separated arrays** -- `Shlomo|lux` is easier in a spreadsheet than JSON arrays.
- **URL token auth** -- simplest auth for family/community use, no passwords.

---

## 4. n8n Workflows

All workflows are deployed on `run8n.xyz`. Webhook URLs are public-facing.

### 4.1 Content API

| | |
|---|---|
| ID | `1lAXLYXbcpkrHZdc` |
| n8n link | https://run8n.xyz/workflow/1lAXLYXbcpkrHZdc |
| Webhook | `GET https://run8n.xyz/webhook/surayt-content` |
| Auth | None (public, read-only) |
| Nodes | 8 |
| Returns | JSON with keys: `words`, `alphabet`, `phrases`, `conversations`, `proverbs` |

```bash
curl https://run8n.xyz/webhook/surayt-content
```

### 4.2 User API

| | |
|---|---|
| ID | `WJVgvn9AaEQOBgeN` |
| n8n link | https://run8n.xyz/workflow/WJVgvn9AaEQOBgeN |
| Webhook | `POST https://run8n.xyz/webhook/surayt-user` |
| Auth | `X-App-Key: surayt-2026-key` |
| Nodes | 16 |
| Actions | `create_user`, `get_user`, `update_progress` |

```bash
# Create user
curl -X POST https://run8n.xyz/webhook/surayt-user \
  -H "Content-Type: application/json" \
  -H "X-App-Key: surayt-2026-key" \
  -d '{"action":"create_user","display_name":"Test","lang":"en"}'

# Get user (use token from create response)
curl -X POST https://run8n.xyz/webhook/surayt-user \
  -H "Content-Type: application/json" \
  -H "X-App-Key: surayt-2026-key" \
  -d '{"action":"get_user","token":"TOKEN_HERE"}'
```

### 4.3 Audio API

| | |
|---|---|
| ID | `s6V10msYVTScyQMp` |
| n8n link | https://run8n.xyz/workflow/s6V10msYVTScyQMp |
| Webhook | `POST https://run8n.xyz/webhook/surayt-audio` |
| Auth | `X-App-Key: surayt-2026-key` |
| Nodes | 15 |
| Purpose | Upload/retrieve audio recordings for words |

---

## 5. Auth Strategy

```
Browser                          n8n                         NocoDB
  |                               |                            |
  |-- X-App-Key: surayt-2026-key ->  validates key              |
  |                               |-- NocoDB API token -------> |
  |                               |   (stored in n8n vault)     |
  |<-- user token ---------------<|                             |
  |                               |                            |
  |  (stores token in localStorage)                            |
```

- **NocoDB API token** never reaches the browser. Stored in n8n's credential vault.
- **X-App-Key** (`surayt-2026-key`) is a shared app-level secret sent as a header on user/audio requests. The content endpoint is fully public.
- **User tokens** are returned by `create_user` and stored in `localStorage`. Sent back on subsequent requests to identify the user.
- No passwords, no OAuth -- designed for low-friction family/community use.

---

## 6. File Structure

```
turoyo-learn/
  index.html              Main PWA entry point
  demo.html               Demo/showcase page
  css/                    Stylesheets
  js/
    api.js                Frontend API wrapper (calls n8n webhooks)
    data.js               Built-in word data (offline fallback)
    data-alphabet.js      Built-in alphabet data
    data-phrases.js       Built-in phrase data
    conv-data.js          Built-in conversation data
    demo-data.js          Demo scenario data
    version-a.js          Lesson mode (vocabulary drills)
    version-b.js          SRS review mode
    conversations.js      Conversation practice UI
    grammar.js            Grammar reference UI
    script-tab.js         Serto script tab
    recorder.js           Audio recording logic
    recorder-ui.js        Audio recording UI
    exercise-types.js     Exercise type definitions
    vfx.js                Visual effects (confetti, etc.)
    demo-engine.js        Demo walkthrough engine
  n8n/
    workflow-content-api.json   Backup of Content API workflow
    workflow-user-api.json      Backup of User API workflow
    workflow-audio-api.json     Backup of Audio API workflow
    README.md                   Workflow reference notes
  docs/
    architecture.md       This file
    n8n-api.md            Full API endpoint documentation
  plan/
    backend-migration.md  Migration plan and checklist
```

---

## 7. Deployment

### Frontend -- GitHub Pages

The PWA is deployed automatically from the `main` branch via GitHub Pages.

**Repo:** `https://github.com/SerjoschDuering/turoyo-learn`

To update: push to `main` and GitHub Pages rebuilds automatically.

### Backend -- run8n.xyz

n8n and NocoDB are self-hosted on `91.98.144.66`. No deployment steps needed
for the backend unless workflows change. See section 9 for restore procedures.

---

## 8. Migration Status

### Done

- [x] GitHub repo created, GitHub Pages deployment active
- [x] NocoDB tables created with correct field types
- [x] Content seeded (90 words, 22 letters, 14 phrases, 42 conv rows, 3 proverbs)
- [x] n8n proxy workflows built (Content, User, Audio)
- [x] `js/api.js` frontend wrapper added
- [x] API documented in `docs/n8n-api.md`
- [x] Workflow JSONs stored in `n8n/` folder

### Remaining

- [ ] Wire `version-a.js` to read words from API instead of local `data.js`
- [ ] Wire `version-b.js` to read/write progress via User API
- [ ] Wire `conversations.js` to read from API
- [ ] Wire `recorder.js` to upload via Audio API
- [ ] Add user creation / login flow in the UI
- [ ] Implement offline fallback (API -> localStorage cache -> retry on reconnect)
- [ ] Build n8n workflow for PDF -> AI -> vocabulary extraction

**Summary:** Backend is live. Frontend still reads from local JS data files.
Next phase is wiring each frontend module to the API.

---

## 9. n8n Workflow Backups

Three JSON snapshots in `n8n/`:

| File | Workflow | ID |
|---|---|---|
| `workflow-content-api.json` | Surayt Content API | `1lAXLYXbcpkrHZdc` |
| `workflow-user-api.json` | Surayt User API | `WJVgvn9AaEQOBgeN` |
| `workflow-audio-api.json` | Surayt Audio API | `s6V10msYVTScyQMp` |

**These are reference snapshots**, not live-synced. The actual workflows run on `run8n.xyz`.

### Restoring from backup

Import via n8n UI: **Settings > Import** and select the JSON file.

Or via the n8n REST API:
```bash
source ~/.run8n.env
curl -X POST "https://run8n.xyz/api/v1/workflows" \
  -H "X-N8N-API-KEY: $N8N_API_KEY" \
  -H "Content-Type: application/json" \
  -d @n8n/workflow-content-api.json
```

### Updating snapshots

Ask Claude Code to fetch the latest workflow JSONs and update the files:
```
Fetch the latest n8n workflow JSONs and update the files in the n8n/ folder
```

Or manually export from n8n UI and overwrite the files in `n8n/`.
