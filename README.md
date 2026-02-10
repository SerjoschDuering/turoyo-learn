# Surayt Learn

A language-learning app for **Turoyo (Surayt)**, the modern Aramaic language spoken by the
Suryoye people. Built as a lightweight web app that works on phones, tablets and desktops
-- even offline.

## What This App Does

- **Learn words** across categories (greetings, family, food, animals ...)
- **Practice the Serto alphabet** (the script Turoyo is written in)
- **Study phrases & dialogues** with interactive fill-in-the-blank exercises
- **Read conversations** with audio and grammar notes
- **Explore proverbs** with word-by-word breakdowns
- **Record your own pronunciation** and compare it

---

## Glossary -- Tech Terms for Beginners

If you have never programmed before, here are terms you will see in this document:

| Term | What it means |
|------|---------------|
| **Terminal** | A text window on your computer where you type commands instead of clicking buttons. On Mac it is called "Terminal", on Windows "Command Prompt" or "PowerShell". Think of it as texting your computer. |
| **Repository (repo)** | A folder that contains all the code for a project, plus its full history of changes. Think of it as a shared Google Drive folder but for code. |
| **Git** | A tool that tracks every change you make to code. Like "undo history" but it never forgets and works across people. |
| **Clone** | Downloading a copy of a repository to your computer. |
| **Commit** | Saving a snapshot of your changes with a short description. Like pressing "Save" in a video game. |
| **Push** | Uploading your saved commits to the online repository so others can see them. |
| **Branch** | A separate copy of the code where you can experiment without affecting the main version. |
| **PR (Pull Request)** | A request to merge your branch into the main code. Others can review your changes first. |
| **HTML** | The language that describes the structure of a web page (headings, paragraphs, buttons). |
| **CSS** | The language that describes how a web page looks (colors, fonts, spacing). |
| **JavaScript (JS)** | The language that makes a web page interactive (clicks, animations, data). |
| **JSON** | A way to store structured data as text. Looks like `{"name": "Maryam", "age": 25}`. |
| **API** | A way for two programs to talk to each other over the internet. Like a waiter taking your order to the kitchen and bringing back food. |
| **Webhook** | A special URL that triggers an action when you visit it or send data to it. |
| **PWA** | Progressive Web App -- a website that can be "installed" on your phone and work offline, like a native app. |
| **localhost** | Your own computer acting as a temporary website. Only you can see it. |
| **Deploy** | Publishing your app so anyone on the internet can use it. |
| **n8n** | An automation tool (like Zapier) that we use as our backend server. It connects the app to the database. |
| **NocoDB** | A spreadsheet-like database where all our words, phrases and user data live. Think of it as Google Sheets but for apps. |
| **Claude Code** | An AI assistant that runs in your terminal. You describe what you want in plain English and it writes the code for you. |

---

## Architecture -- How It All Fits Together

```
YOU (phone / laptop browser)
  |
  |  opens the app
  v
+---------------------------+
|   Surayt Learn (PWA)      |     HTML + CSS + JS files
|   Hosted on GitHub Pages  |     hosted for free
+---------------------------+
  |                |
  | fetch content  | save progress / recordings
  | (public)       | (needs app key)
  v                v
+---------------------------+
|   n8n Webhooks            |     3 automation workflows
|   run8n.xyz               |     acts as a secure middleman
+---------------------------+
  |
  | reads/writes data
  | (NocoDB token stays here,
  |  never sent to browser)
  v
+---------------------------+
|   NocoDB Database         |     7 tables (words, alphabet,
|   nocodb.run8n.xyz        |     phrases, conversations,
+---------------------------+     proverbs, users, audio)
```

**Why the middleman?** The database needs a secret password (API token) to access.
We cannot put that password in the browser -- anyone could steal it. So n8n holds the
password and the browser only talks to n8n.

### Key files

```
turoyo-learn/
  index.html          -- the single HTML page (everything is in here)
  manifest.json       -- makes it installable as a phone app
  css/                 -- how it looks (colors, layout, animations)
    main.css           -- shared styles
    exercises.css      -- quiz / exercise styles
    recorder.css       -- audio recorder styles
    ...
  js/                  -- how it works (logic, data, interactions)
    data.js            -- words, categories, proverbs
    data-alphabet.js   -- the 22 Serto letters
    data-phrases.js    -- phrases for exercises
    conv-data.js       -- conversation scripts + proverb details
    api.js             -- talks to the n8n backend
    version-a.js       -- main app logic (tab A)
    version-b.js       -- extended features (tab B)
    conversations.js   -- conversation player
    recorder.js        -- audio recording engine
    grammar.js         -- grammar chat feature
    ...
  docs/                -- technical documentation
    api-reference.md   -- full API reference for all 3 webhooks
    architecture.md    -- system architecture & deployment
    app-design.md      -- design decisions & tech stack
    language-reference.md -- Turoyo language guide
```

---

## Getting Started

### What you need

1. **A computer** (Mac, Windows, or Linux)
2. **Claude Code** installed -- [install guide](https://docs.anthropic.com/en/docs/claude-code)
3. **A GitHub account** -- [sign up free](https://github.com)

### First-time setup

Open your terminal and tell Claude Code:

```
claude
```

Then type in plain English:

```
Clone the turoyo-learn repo and serve it locally so I can see it in my browser
```

Claude Code will:
1. Clone the repository
2. Start a local web server
3. Give you a URL like `http://localhost:8000` to open in your browser

That's it. The app is running on your computer.

---

## Guide 1: How to Add New Data

All the learning content (words, letters, phrases, conversations, proverbs) lives in
JavaScript files inside the `js/` folder AND in the NocoDB database. When you add data,
you add it to both places.

### Two ways to add content

| Method | Best for | What you do |
|--------|----------|-------------|
| 🗣 **Claude Code** | A few words at a time | Describe them in plain English -- Claude Code handles the rest |
| 📊 **CSV / Spreadsheet** | Dozens or hundreds at once | Prepare a CSV, then tell Claude Code to import it |
| ⚙️ **n8n Workflow** | Automated pipelines (PDF, API, scheduled) | Build a workflow on run8n.xyz that writes directly to NocoDB |

*"3 new words from grandma"* → Claude Code. *"50 animals from a dictionary"* → CSV.
*"A whole PDF textbook"* → see the batch PDF tip further below.

For CSV import, prepare columns `latin, serto, en, de, category` and say:
```
Import the words from /path/to/my-words.csv into data.js and upload them to NocoDB
```

---

### Adding a new word

**Step 1.** Open Claude Code in the project folder and say:

```
Add a new Turoyo word: "mayyo" means "water" in English and "Wasser" in German.
It belongs to the "food" category. The Serto script is ܡܝܐ.
```

Claude Code will:
- Open `js/data.js`
- Add a new entry to the `WORDS` array following the existing pattern
- Upload it to the NocoDB Words table

**Step 2.** Verify it worked:

```
Show me the last 3 words in data.js
```

### Adding a new phrase

Say to Claude Code:

```
Add a new phrase to data-phrases.js:
  Turoyo words: ["Ayko", "yo", "u", "beṯ-taḥroyoṯo"]
  English: "Where is the bathroom?"
  German: "Wo ist das Badezimmer?"
  Category: "travel"
```

### Adding a new conversation

Say to Claude Code:

```
Add a new conversation to conv-data.js about ordering food at a restaurant.
It should have 6 turns between a customer and a waiter.
Include 2 fill-in-the-blank exercises.
Make it difficulty level 2.
```

### Adding a new proverb

```
Add a new Turoyo proverb to data.js:
  Latin: "U xaylo b-u xuyodo yo."
  English: "Strength is in unity."
  German: "Die Kraft liegt in der Einheit."
Also add a word breakdown and grammar note to PROVERB_DETAILS in conv-data.js.
```

### Uploading data to NocoDB

After adding data to the JS files, tell Claude Code:

```
Upload the new data to the NocoDB tables so the backend stays in sync
```

### 💡 Tip: Batch-adding vocabulary from PDFs (future feature)

If you have a Turoyo textbook or word list as a PDF, you can build an n8n workflow
that extracts vocabulary automatically using AI. This is not built yet, but here is
how it would work:

```
Step 1:  Upload PDF to n8n (via webhook or manual trigger)
Step 2:  n8n extracts text from PDF (using the "Extract from File" node)
Step 3:  Send extracted text to Claude/GPT with a prompt like:
           "Extract all Turoyo vocabulary from this text.
            Return JSON with: latin, serto, en, de, category, source."
Step 4:  Parse the AI response (Code node: JSON.parse)
Step 5:  For each word: insert into NocoDB Words table
Step 6:  Return a summary: "Added 47 words from Chapter 3"
```

The `source` column in NocoDB tracks where each word came from (e.g. "Slomo Surayt Ch.3"),
so you always know which PDF produced which words.

To build this, tell Claude Code:

```
Build an n8n workflow that takes a PDF, extracts Turoyo vocabulary using AI,
and inserts the words into the NocoDB Words table. Follow the pattern from
the existing surayt workflows. Tag it with Surayt-App.
```

---

## Guide 2: How to Add a New Feature

### Example: Adding a "Daily Word" feature

**Step 1.** Describe what you want to Claude Code:

```
I want a "Daily Word" feature. Every day, the app should show one random word
at the top of the home screen with its Serto script, pronunciation and meaning.
It should be different each day but the same for all users on the same day.
```

Claude Code will:
1. Think about where to put the code
2. Show you a plan
3. Ask for your approval
4. Write the code across the necessary files

**Step 2.** Review the plan. Claude Code might say something like:

> "I'll add a getDailyWord() function to version-a.js that picks a word based on
> today's date. Then I'll add a card component to index.html and style it in main.css."

Type `yes` to approve, or describe changes you want.

**Step 3.** Test it:

```
Serve the app locally so I can test the daily word feature
```

**Step 4.** When you are happy:

```
Commit this with a message about adding the daily word feature
```

### Example: Adding a new tab

```
Add a new tab called "Culture" that shows Suryoyo cultural notes,
traditions, and historical context for the language.
Put it between the Conversations and Recorder tabs.
```

### Example: Changing the design

```
Change the color scheme to use more gold and deep red colors,
inspired by traditional Aramean patterns
```

---

## Fork to Work on Your Own Copy

If you want your own version of the app (to customize, add your own content, or
host under your own account), **fork** the repository:

1. Go to: https://github.com/SerjoschDuering/turoyo-learn
2. Click the **"Fork"** button (top right)
3. GitHub creates a copy under your account
4. Enable GitHub Pages on your fork:
   - Go to your fork's **Settings** → **Pages**
   - Under **Source**, select **Deploy from a branch**
   - Under **Branch**, select **main** and folder **/ (root)**
   - Click **Save**
5. Your app will be live at: `https://{your-username}.github.io/turoyo-learn/`

From now on, any changes you push to your fork's `main` branch will
automatically update your live site.

---

## How to Deploy

The app is hosted on **GitHub Pages** (free). Deploying means pushing your
changes to GitHub -- the website updates automatically.

### Deploy with Claude Code

After making and testing your changes, say:

```
Commit my changes and push to GitHub
```

Claude Code will:
1. Show you what changed
2. Write a commit message
3. Push to GitHub
4. GitHub Pages will automatically update the live site (takes about 1 minute)

### First-time setup (enable GitHub Pages)

1. Go to your repository on GitHub
2. Click **Settings** → **Pages** (in the left sidebar)
3. Under **Source**, select **Deploy from a branch**
4. Under **Branch**, select **main** and folder **/ (root)**
5. Click **Save**
6. Wait ~1 minute, then refresh -- you'll see your live URL:
   `https://{your-username}.github.io/turoyo-learn/`

That's it. From now on, every push to `main` automatically rebuilds and
updates the live site. No extra commands or CI setup needed -- GitHub Pages
handles it.

---

## Common Tasks -- Quick Reference

| What you want | What to say to Claude Code |
|---|---|
| Run the app locally | "Serve this app on localhost" |
| Add a word | "Add the word X meaning Y to the vocabulary" |
| Fix a bug | "The quiz is not showing the correct answer, can you fix it?" |
| Change a style | "Make the font size bigger on the word cards" |
| See the database | "Show me what's in the NocoDB words table" |
| Test the API | "Test the content API webhook" |
| Check what changed | "Show me git status" |
| Undo last change | "Undo my last commit" |
| Update the database | "Sync the JS data files to NocoDB" |
| Read the API docs | "Show me docs/api-reference.md" |

---

## Project Links

| What | Where |
|------|-------|
| Live app | GitHub Pages (after deploy) |
| Database UI | `nocodb.run8n.xyz` |
| n8n workflows | `run8n.xyz` |
| Architecture & setup | `docs/architecture.md` |
| API reference | `docs/api-reference.md` |
| App design decisions | `docs/app-design.md` |
| Turoyo language guide | `docs/language-reference.md` |
| n8n workflow backups | `n8n/` |

---

## Troubleshooting

**"The app shows no words / empty screen"**
The data might not have loaded. Tell Claude Code: "Check if data.js has any syntax errors"

**"I broke something and want to start over"**
Tell Claude Code: "Reset my changes to the last commit" -- this undoes everything
since your last save point.

**"The API is not responding"**
The n8n workflows might be paused. Tell Claude Code: "Check if the n8n surayt
workflows are active and activate them if not"

**"I want to see what the database looks like"**
Open `nocodb.run8n.xyz` in your browser. It looks like a spreadsheet.
All 7 tables (Words, Alphabet, Phrases, Conversations, Proverbs, Users,
Audio Recordings) are visible there.
