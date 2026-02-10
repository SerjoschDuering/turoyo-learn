# n8n Workflows -- Reference Copies

These JSON files are **reference snapshots** of the n8n workflows that power the
Surayt Learn backend. They are already deployed and running on `run8n.xyz`.

**You do not need to import these.** They are here so the repo has a record of what
is running on the server.

## Workflows

| File | Workflow | ID | Nodes |
|------|----------|----|-------|
| `workflow-content-api.json` | Surayt Content API | `1lAXLYXbcpkrHZdc` | 8 |
| `workflow-user-api.json` | Surayt User API | `WJVgvn9AaEQOBgeN` | 16 |
| `workflow-audio-api.json` | Surayt Audio API | `s6V10msYVTScyQMp` | 15 |

## When to use these files

- **Disaster recovery**: If the n8n instance is reset, import these via
  n8n UI (Settings > Import) or the n8n REST API.
- **Code review**: To see exactly what each workflow does without logging into n8n.
- **Versioning**: To track changes to the backend logic alongside the frontend code.

## How to update these snapshots

Ask Claude Code:

```
Fetch the latest n8n workflow JSONs and update the files in the n8n/ folder
```

## Full API documentation

See [`docs/api-reference.md`](../docs/api-reference.md) for endpoints, request/response
formats, and curl test commands.
