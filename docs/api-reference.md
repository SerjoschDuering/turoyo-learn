# API Reference for Surayt Learn

Primary API: n8n webhooks. NocoDB reference included for admin/backend use.

---

## 1. Overview

The app uses **n8n workflows** (hosted at `run8n.xyz`) as its API layer. n8n acts as a
secure proxy to NocoDB -- the NocoDB API token lives in n8n's credential vault and is
never exposed to the browser.

**The NocoDB REST API is documented below for reference but should NOT be called
directly from the frontend.** Only n8n workflows and admin scripts should use it.

| API | Base URL | Method | Auth |
|-----|----------|--------|------|
| Content | `https://run8n.xyz/webhook/surayt-content` | GET | None (public) |
| User | `https://run8n.xyz/webhook/surayt-user` | POST | `X-App-Key` header |
| Audio | `https://run8n.xyz/webhook/surayt-audio` | POST | `X-App-Key` + token |

---

## 2. n8n Webhook Endpoints (Primary API)

### 2.1 Content API -- GET, public

Fetches all 5 content tables from NocoDB in parallel and returns a merged object.

**Workflow:** `1lAXLYXbcpkrHZdc` ([link](https://run8n.xyz/workflow/1lAXLYXbcpkrHZdc))

```bash
curl -s https://run8n.xyz/webhook/surayt-content | jq 'keys'
```

**Response:**
```json
{
  "words": [], "alphabet": [], "phrases": [],
  "conversations": [], "proverbs": [],
  "_fetched_at": "2026-02-08T12:00:00Z"
}
```

**Frontend:** `API.fetchContent()` -- caches in memory + localStorage, falls back to cache offline.

---

### 2.2 User API -- POST, 4 actions

**Workflow:** `WJVgvn9AaEQOBgeN` ([link](https://run8n.xyz/workflow/WJVgvn9AaEQOBgeN))

All requests require `X-App-Key: surayt-2026-key` header and a JSON body with `action`.

#### create_user

```bash
curl -s -X POST https://run8n.xyz/webhook/surayt-user \
  -H "Content-Type: application/json" -H "X-App-Key: surayt-2026-key" \
  -d '{"action":"create_user","display_name":"Maryam","lang":"en"}' | jq .
```

Response: `{ "token": "abc123...", "display_name": "Maryam", "preferred_lang": "en", "created_at": "...", "progress": "{...}" }`

Frontend: `API.createUser(name, lang)` -- auto-stores token in localStorage.

#### get_user

```bash
curl -s -X POST https://run8n.xyz/webhook/surayt-user \
  -H "Content-Type: application/json" -H "X-App-Key: surayt-2026-key" \
  -d '{"action":"get_user","token":"TOKEN_HERE"}' | jq .
```

Response: Full user row (token, display_name, progress, last_active, preferred_lang).

Frontend: `API.getUser(token)`

#### update_progress

```bash
curl -s -X POST https://run8n.xyz/webhook/surayt-user \
  -H "Content-Type: application/json" -H "X-App-Key: surayt-2026-key" \
  -d '{"action":"update_progress","token":"TOKEN_HERE","progress":{"xp":460,"streak":5,"lessons":{},"lastDate":"2026-02-08"}}' | jq .
```

Response: Updated user row. Uses NocoDB bulk PATCH with `where=(token,eq,X)`.

Frontend: `API.updateProgress(progressObj)` -- debounced to max once per 5s. Flushes on page hide.

#### heartbeat

```bash
curl -s -X POST https://run8n.xyz/webhook/surayt-user \
  -H "Content-Type: application/json" -H "X-App-Key: surayt-2026-key" \
  -d '{"action":"heartbeat","token":"TOKEN_HERE"}' | jq .
```

Response: Updated user row (only `last_active` changed).

Frontend: `API.heartbeat()`

---

### 2.3 Audio API -- POST, 3 actions

**Workflow:** `s6V10msYVTScyQMp` ([link](https://run8n.xyz/workflow/s6V10msYVTScyQMp))

Requires `X-App-Key: surayt-2026-key` header AND `token` in the JSON body.

#### upload

Creates a recording entry. `speaker` maps to `speaker_name` column; `type` is SingleSelect.

```bash
curl -s -X POST https://run8n.xyz/webhook/surayt-audio \
  -H "Content-Type: application/json" -H "X-App-Key: surayt-2026-key" \
  -d '{"action":"upload","token":"TOKEN","word_id":"greet_01","type":"word","speaker":"Maryam","duration":3}' | jq .
```

Frontend: `API.uploadRecording({ wordId, type, speaker, duration })`

#### list

Returns the authenticated user's recordings, sorted by `recorded_at` DESC.

```bash
curl -s -X POST https://run8n.xyz/webhook/surayt-audio \
  -H "Content-Type: application/json" -H "X-App-Key: surayt-2026-key" \
  -d '{"action":"list","token":"TOKEN"}' | jq .
```

Response: `{ "list": [], "pageInfo": {} }`

Frontend: `API.listRecordings(token)`

#### delete

Deletes a recording only if the caller owns it.

```bash
curl -s -X POST https://run8n.xyz/webhook/surayt-audio \
  -H "Content-Type: application/json" -H "X-App-Key: surayt-2026-key" \
  -d '{"action":"delete","token":"TOKEN","row_id":"ROW_ID"}' | jq .
```

Response: `{ "deleted": true }` or `{ "error": "Not your recording" }`

Frontend: `API.deleteRecording(rowId)`

---

### 2.4 Authentication Strategy

| Layer | Content API | User / Audio APIs |
|-------|-------------|-------------------|
| App-level | None (public) | `X-App-Key: surayt-2026-key` header |
| User-level | N/A | `token` in JSON body |
| NocoDB token | In n8n vault, never sent to browser | Same |

---

## 3. NocoDB REST API Reference (Backend/Admin Only)

> **These endpoints require the `xc-token` and should only be used from n8n workflows
> or admin scripts, never from the browser.**

### Connection Details

| | |
|---|---|
| **Base URL** | `https://nocodb.run8n.xyz/api/v2` |
| **Base ID** | `pfc85e1x5bmxs0g` |
| **Auth header** | `xc-token: $NOCODB_API_KEY` |
| **Alt auth** | `Authorization: Bearer <token>` |

### Project Table IDs

| Table | Table ID | Used By |
|-------|----------|---------|
| Words | `mkcdwpsyyfwe0nm` | Content API |
| Alphabet | `m8k6y3ysretdvbs` | Content API |
| Phrases | `mryyw32blyw2si5` | Content API |
| Conversations | `mz4kt75lu24ixzg` | Content API |
| Proverbs | `mqrmp6lbua5qe7e` | Content API |
| Users | `mjxqqok17wp6329` | User API |
| Audio Recordings | `mblag22rb4fnng8` | Audio API |

### Key Endpoints

**List rows:**
```
GET /api/v2/meta/bases/{base_id}/tables          # list tables
GET /api/v2/meta/tables/{table_id}               # table details + column IDs
```

**Create table:**
```
POST /api/v2/meta/bases/{base_id}/tables
Body: { "table_name": "...", "title": "...", "columns": [...] }
```

**Add column:**
```
POST /api/v2/meta/tables/{table_id}/columns
Body: { "title": "...", "column_name": "...", "uidt": "SingleLineText" }
```

**Update column (e.g. SingleSelect options):**
```
PATCH /api/v2/meta/columns/{column_id}
Body: { "colOptions": { "options": [{ "title": "...", "color": "#..." }] } }
```

### Common Column Types (uidt)

`SingleLineText`, `LongText`, `Number`, `Decimal`, `SingleSelect`, `MultiSelect`,
`Checkbox`, `DateTime`, `CreatedTime`, `LastModifiedTime`, `JSON`, `Attachment`

### SingleSelect Column Example

```json
{
  "title": "Category",
  "column_name": "category",
  "uidt": "SingleSelect",
  "colOptions": {
    "options": [
      { "title": "Greetings", "color": "#808080" },
      { "title": "Family", "color": "#3366FF" }
    ]
  }
}
```

### Known Issues

- Column names with spaces/underscores may be stripped during table creation (bug #9438). Workaround: create table first, add columns separately.
- SingleSelect tags are not auto-created when posting records with new values. Define all options upfront.
- Use `xc-token` header (not `xc-auth-token`).

---

## 4. Error Handling

### n8n Webhook Errors

| Condition | API | Response |
|-----------|-----|----------|
| Bad/missing `X-App-Key` | User | `{ "error": "Unauthorized or unknown action" }` |
| Bad/missing `X-App-Key` | Audio | `{ "error": "Unauthorized" }` |
| Token not found | User | `{ "error": "User not found" }` |
| Ownership mismatch | Audio | `{ "error": "Not your recording" }` |

### NocoDB Errors

| Condition | Response |
|-----------|----------|
| Invalid/missing xc-token | `{ "error": "AUTHENTICATION_REQUIRED" }` |
| Wrong base/table ID | HTTP 404 |

### Frontend Error Handling

The `post()` helper in `js/api.js` throws on non-2xx responses. `fetchContent()` catches
errors and falls back to localStorage cache. `updateProgress()` silently drops failures
(fire-and-forget after debounce).

---

## 5. Frontend Wrapper: js/api.js

`js/api.js` exposes a global `API` object (no dependencies, IIFE pattern).

**Exported methods:**

| Method | Maps to |
|--------|---------|
| `API.fetchContent()` | Content API GET |
| `API.createUser(name, lang)` | User API `create_user` |
| `API.getUser(token)` | User API `get_user` |
| `API.updateProgress(obj)` | User API `update_progress` (debounced 5s) |
| `API.heartbeat()` | User API `heartbeat` |
| `API.uploadRecording(opts)` | Audio API `upload` |
| `API.listRecordings(token)` | Audio API `list` |
| `API.deleteRecording(rowId)` | Audio API `delete` |
| `API.getToken()` / `API.setToken(t)` | localStorage helpers |
| `API.flushProgress()` | Force-send pending progress |

Auto-flushes pending progress on `visibilitychange` (hidden) and `beforeunload`.
