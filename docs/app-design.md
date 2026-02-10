# Surayt Learn -- App Design Document

> Consolidated from research/01-03 files. Design decisions for the Surayt Learn app.

---

## 1. Design Philosophy

### Core Principles

| Principle | Rationale |
|-----------|-----------|
| **Vocabulary first, grammar second** | Drops and Memrise prove words can be taught before grammar. Heritage speakers already have passive vocab to activate. |
| **Audio is non-negotiable** | Turoyo is an oral tradition. Text alone is insufficient. Every word needs a native speaker recording. |
| **Offline-first (PWA)** | Users in Tur Abdin, elderly diaspora, or travelers may lack reliable internet. Core experience must work without a connection. |
| **Dual-script always** | Serto (RTL) + Latin transliteration shown together. Learners may know only one script. Never display just one. |
| **Celebrate, never punish** | No hearts/lives system. For an endangered language, every attempt to learn must be encouraged. |
| **Respect over gamification** | This is not a game. Tone is warm and familial. Features pass the "grandma test" -- would this make someone's grandmother proud? |
| **Preservation is a feature** | Recording elders, archiving dialects, and crowdsourcing audio are first-class concerns, not afterthoughts. |
| **Family is the platform** | The real social network is families passing down a language, not strangers on a leaderboard. |
| **Dialect-inclusive** | No dialect is "wrong." Tag content by region (Midyat, Anhel, Kfarze). Let users pick their family variant. |
| **Short sessions, high frequency** | 2-5 min daily vocabulary sprints beat 30 min weekly sessions for habit formation. |

### Patterns Borrowed From Other Apps

| App | What We Take | What We Skip |
|-----|-------------|-------------|
| **Duolingo** | Streaks, XP, bite-sized lessons, exercise variety, progress bars | Hearts/lives, punishment for missed days, stranger leaderboards |
| **Anki/FSRS** | Spaced repetition algorithm (FSRS), per-word tracking | Ugly UI, steep learning curve, no guided curriculum |
| **Memrise** | Native speaker video/audio, mnemonic associations | Community-created chaos, vocabulary-only limitation |
| **Babbel** | Structured grammar + conversation focus, multiple review modes | Paywall on everything |
| **Drops** | Visual vocabulary, 5-min sessions, illustration-based design | Vocabulary-only cap |
| **Busuu** | Community correction from native speakers | Heavy social pressure |
| **Pimsleur** | Audio-first, graduated interval recall | 30-min sessions only, no visual component |

### Why FSRS for Spaced Repetition

FSRS (Free Spaced Repetition Scheduler, 2023) replaces SM-2 with a modern algorithm trained on 700M+ reviews. Key wins:
- 20-30% fewer daily reviews for same retention rate
- Adapts to individual memory patterns over time
- Our settings: `requestRetention: 0.9`, `maximumInterval: 180 days` (shorter max for an endangered language needing frequent contact)
- Runs entirely client-side via `ts-fsrs` or `femto-fsrs` (zero-dependency, ~100 lines)

---

## 2. UI Versions

We designed two UX variants. **Version B ships first** as the MVP because it is simpler to build, and its SRS engine and word database become the foundation for Version A later.

### Version A -- "Leshono" (Gamified)

**Name:** Leshono (language). **Vibe:** Energetic, rewarding, social. Duolingo-style gamification with Aramean cultural identity.

**Tabs (bottom bar):**

| Tab | Purpose |
|-----|---------|
| Learn | Vertical lesson path (node tree). Tap next node to start a lesson. |
| Review | SRS-based quick review of weak words. |
| Leaders | Weekly opt-in leaderboard among friends/community. |
| Profile | Stats, achievements grid, streak calendar, settings. |

**Lesson flow:** Onboarding (pick goal + level) -> scrollable lesson path -> 8-12 exercises per lesson -> XP earned + streak updated -> optional SRS review.

**Exercise types:** Match pairs, multiple choice (L2->L1 and L1->L2), listen & choose, type answer, picture match, sentence building (word tiles).

**Visual style:** Chunky 3D buttons with bottom shadow. "Aramean Gold & Garden" palette (rich green + gold accents). Bouncy spring animations. Confetti on milestones. Cultural motifs (pomegranates, geometric Syriac patterns, Tur Abdin landscapes). Nunito for display, Inter for body.

**Gamification:** Daily streaks with free freeze (1/week). XP system (10/correct, 50/lesson bonus). Progress bars per topic. Weekly leaderboard. Milestone celebrations with Aramean cultural elements.

**Build complexity:** High -- many exercise types, game logic, illustration assets, content authoring per lesson.

### Version B -- "Surayt" (Calm Study) -- MVP

**Name:** Surayt (modern self-designation). **Vibe:** Quiet, focused, respectful. A personal study companion inspired by Mochi Cards and Apple design language.

**Tabs (bottom bar):**

| Tab | Purpose |
|-----|---------|
| Home | Dashboard: due review count, recent words, progress summary, quick start. |
| Browse | Word collections grid, favorites, search. |
| Grammar | Expandable reference topics (pronouns, verbs, plurals, etc.). |
| More | Photo translate, alphabet explorer, settings, about. |

**Review flow:** Dashboard shows "12 words due" -> tap Start Review -> full-screen flashcard (Serto front, translation back) -> self-rate: Again / Hard / Good / Easy (with next interval preview) -> session summary.

**Visual style:** Flat buttons (44px min, Apple HIG). "Parchment & Ink" palette (warm off-white + muted indigo + saffron accents). Gentle ease transitions, no bounces. Source Serif 4 for headings (manuscript feel), Inter for body. Full dark mode with warm dark tones. Generous whitespace. No mascot, no confetti. The reward is learning.

**Build complexity:** Medium -- SRS engine + flashcards + word database. Fewer screens, lower maintenance burden.

### Version Comparison

| Aspect | A (Leshono) | B (Surayt) |
|--------|------------|-----------|
| Target user | Casual/heritage learner wanting to reconnect | Serious, self-motivated student |
| Motivation | External (XP, streaks, leaderboard) | Internal (curiosity, progress) |
| Session length | 5-10 min (structured) | 2-20 min (flexible) |
| Content structure | Linear lesson path | Free-form browse + SRS |
| Exercise types | 6+ interactive types | Flashcard flip + self-rating |
| Grammar | Embedded in lessons (learn by doing) | Dedicated reference section |
| Dark mode | No | Yes |
| Offline size | ~3-5 MB | ~1-3 MB |
| Build order | Phase 3 (after B validated) | **Phase 1 (MVP)** |

---

## 3. Key Features

### 3.1 Spaced Repetition (FSRS)

Per-word card state stored in localStorage:

```
{ wordId, stability, difficulty, due, reps, lapses, state, lastReview, lastRating }
```

States: `new` -> `learning` -> `review` -> `relearning` (on lapse). Rating buttons show next interval preview. Due cards sorted oldest-first.

### 3.2 Dual-Script Display

Every word renders as: Serto (large, RTL, `unicode-bidi: isolate`) + Latin transliteration (smaller, italic) + meaning (smallest). Serto uses self-hosted Meltho fonts (Serto Jerusalem / Serto Kharput, WOFF2). Minimum Serto font size: 20px. RTL containers use `[lang="syc"]` attribute. Users type Latin transliteration only (no Syriac keyboard in MVP).

### 3.3 Conversation Mode (AI)

Chat interface for scenario-based practice (ordering food, greeting elders, family gatherings). AI responds in Turoyo with tap-to-translate. Grammar corrections inline, non-intrusive. Difficulty adapts to learned vocabulary. Requires LLM API via Windmill webhook. **Phase:** v1.1 (post-MVP).

### 3.4 Audio Recorder ("Ask Hathto/Babo")

Record family elders saying words, phrases, and stories. Attach recordings to vocabulary items. Build a personal "family voice library." MVP: saves to IndexedDB locally. Future: share with community (with consent). **Why critical:** Every elder who dies takes unique dialect knowledge. This turns the app into an archival tool.

### 3.5 Grammar X-Ray ("Word X-Ray")

Tap any Turoyo word -> slide-up panel shows: root letters + root meaning, grammatical form (conjugation, declension), related words sharing the root, cognates in Arabic/Hebrew, position in sentence. Powered by LLM API with Turoyo grammar rules as context. **Phase:** v1.1.

### 3.6 Photo Vocabulary ("Point & Learn")

Camera -> vision model identifies objects -> overlay Turoyo words with gender, plural, example sentence. Cultural twist: detecting food/clothing/religious items surfaces cultural notes. Technical: static site sends image to Windmill webhook calling vision model. Fallback: on-device TF.js MobileNet for ~200-500 common objects. **Phase:** v1.1-v2.

### 3.7 Proverb Engine

Daily proverb with word-by-word breakdown. Grammar extracted naturally from proverbs. Weekly deep dive: cultural context, when to use it, equivalent sayings. Completion exercises. Collect proverbs like achievements. **Why:** Proverbs are inherently memorable and shareable.

### 3.8 Story Library ("Hkoyotho")

Folk tales, family narratives, historical accounts as interactive reading. Tap-to-translate on every word. Audio narration. Comprehension questions. Graded by difficulty. Crowdsourced family stories (future).

### 3.9 Progress Visualization

Multiple metaphors considered:
- **Village map:** illustrated Turoyo village. Areas (market, church, home, fields) come alive as related vocabulary is learned.
- **Growing garden/tree:** daily practice adds growth. Missing a day pauses growth but doesn't kill it.
- **"I can" statements:** concrete abilities ("I can greet someone") instead of abstract levels.
- **Vocabulary constellation:** words as stars clustered by topic.

### 3.10 Offline-First (PWA)

Service Worker caches all assets (HTML, CSS, JS, fonts, audio). IndexedDB/localStorage stores user progress, SRS state, settings. Sync to server when connection returns (future). Audio files: MP3 at 32kbps mono, ~5KB/word, 500 words = ~2.5MB total.

---

## 4. What Makes This App Unique

### vs. Duolingo / Babbel / Drops

| Differentiator | Details |
|---------------|---------|
| **Family voice recordings** | No other app lets you learn from your own grandparents' voice. This is language preservation, not just learning. |
| **Cultural context on every word** | Learn "lahmo" (bread) and get the role of bread in Aramean hospitality, a proverb, a photo of traditional baking. |
| **Dialect-aware** | Content tagged by village/region. "My dialect" setting. No dialect declared "wrong." |
| **Proverb-driven learning** | Proverbs as the backbone of grammar and culture. Compressed wisdom that gives learners something real to say. |
| **Emotional onboarding** | "You already know 47 Turoyo words!" quiz activates passive heritage knowledge. Family connection prompt creates a personal goal from minute one. |
| **Non-punitive streaks** | Growing garden metaphor. Weekly target (4/7 days) instead of daily. "Welcome back" instead of "you broke your streak." |
| **Interactive stories** | Choose-your-path fiction in Turoyo. Branching narratives teach different vocabulary per playthrough. |
| **Preservation-first mindset** | Elder interview kit, community audio portal, open content licenses (CC). Not just learning -- archiving a living language. |
| **Kitchen Turoyo** | Learn through cooking. Recipes in Turoyo with glossary. Food is the last cultural practice to survive in diaspora. |
| **Cultural calendar** | Vocabulary tied to Akitu, Christmas/Easter (Syriac tradition), harvest, weddings. Creates natural urgency. |

### The Endangered Language Difference

Standard app patterns assume millions of users and unlimited content creators. Turoyo has neither. Our design accounts for:
- **Limited content creators** -> make contribution dead simple (record button, community validation)
- **Dialectal variation** -> tag, don't standardize
- **No standard orthography** -> support multiple scripts, always show transliteration
- **Small user base** -> deep engagement over broad reach, target diaspora (Sweden, Germany, Netherlands, USA)
- **Cultural sensitivity** -> language is tied to identity, religion, politics. Work with community leaders.
- **Sustainability** -> open source, grant funding (EU Erasmus+, UNESCO), community donations

---

## 5. Future Ideas (Not Yet Built)

### v1.1 -- Add API Features
- AI grammar explainer (LLM via Windmill webhook)
- Photo vocabulary scanner (vision model API)
- "Ask Hathto" recording tool (Web Audio API, local storage)
- Contextual sentence generator (3-5 sentences per word at learner's level)
- Pronunciation coach (waveform comparison, minimal pair drills, slow-motion audio)

### v2.0 -- Add Backend
- User accounts and cloud sync
- Community word submissions with dialect tags and voting
- Family challenges (shared progress, family leaderboard, cross-generational: grandparents contribute audio, grandchildren learn)
- Elder interview kit (structured questions, recording interface, auto-transcription, community archive)
- Dialect explorer with village map and side-by-side comparison

### Wild Ideas (Validated Later)
- **Time capsule recordings:** Record yourself at month 1, 6, 12. Hear your own progress.
- **Lullaby mode:** Learn traditional lullabies. Play for children at bedtime. Passive Turoyo exposure.
- **Walk & learn:** Audio-only mode for commuting. No screen needed. Like a Turoyo podcast.
- **Dream journal:** Write daily in Turoyo with AI assistance. Start with one sentence.
- **Handwriting practice:** Trace Serto letters on touchscreen with stroke order animation.
- **Listening comprehension scenes:** Illustrated scenes (market, dinner, church) with ambient Turoyo audio.

---

## 6. Technical Stack

```
Frontend:       Vanilla JS (no framework, no bundler)
Routing:        Hash-based SPA router
State:          localStorage + pub/sub store
SRS:            femto-fsrs or ts-fsrs (client-side)
Audio:          Pre-recorded MP3 (32kbps mono), Web Audio API playback
Offline:        Service Worker + Cache API
Fonts:          Self-hosted Meltho WOFF2 (Serto Jerusalem)
Theming:        CSS custom properties (light/dark)
Hosting:        GitHub Pages ({username}.github.io/turoyo-learn/)
Auth:           None for v1 (anonymous, local storage)
API (v1.1+):    Windmill webhooks for LLM/vision model calls
```

### Build Phases

| Phase | Scope | Complexity |
|-------|-------|-----------|
| **1 (MVP)** | Version B: dashboard, flashcard SRS review, word collections, alphabet explorer, offline PWA | Medium |
| **2 (B complete)** | Grammar reference, photo translate, favorites, search, dark mode, proverbs | Medium |
| **3 (Version A)** | Lesson path, 6+ exercise types, XP/streaks, achievements, leaderboard | High |
| **4 (Backend)** | Accounts, sync, community features, family tools, elder archive | High |
