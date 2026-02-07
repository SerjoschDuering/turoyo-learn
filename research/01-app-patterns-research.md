# Language Learning App Design Patterns Research

Research compiled for the Turoyo (Aramean/Surayt) learning app.

---

## 1. What Makes Top Language Learning Apps Successful

### Duolingo (128M+ monthly users, $14B valuation)

**Core mechanics:** Bite-sized lessons (5-20 min), gamification-first design, adaptive AI difficulty, social features (leaderboards, friend streaks), free tier with ads + subscription upsell.

**Why it works:**
- Streaks create daily habit loops (users with 7-day streaks are 3.6x more likely to stay engaged long-term)
- XP leaderboards drive 40% more engagement through social competition
- Lessons feel like games, not homework -- multiple choice, word tiles, listening, speaking
- Aggressive A/B testing culture -- every feature is data-validated
- Push notifications are carefully timed (boosted engagement by 25%)

**Weakness for minority languages:** Content pipeline requires massive investment. Duolingo has no Turoyo course and likely never will. But the UX patterns are gold.

### Babbel (10M+ subscribers)

**Core mechanics:** Conversation-focused 10-15 min lessons, grammar explanations inline, speech recognition, review manager with spaced repetition.

**Why it works:**
- Structured CEFR-level curriculum (A1 to B2)
- Grammar is taught explicitly, not just pattern-matched
- "Babbel Speak" AI speaking trainer for low-pressure practice
- Multiple review modes: flashcards, listening drills, verbal practice, writing exercises
- Practical real-world dialogues

**Key takeaway for Turoyo:** Babbel proves that structured grammar + conversation focus works for serious learners. Turoyo learners (often heritage speakers) need exactly this.

### Memrise

**Core mechanics:** Video clips of native speakers, vocabulary-first approach, spaced repetition, mnemonic images.

**Why it works:**
- Real native speaker video clips make learning feel authentic and personal
- Mnemonic associations help vocabulary stick
- Community-created courses allow content for niche languages
- Focus on how words actually sound in context

**Key takeaway for Turoyo:** Native speaker recordings are essential. Memrise's model of showing real people speaking is powerful for endangered languages where hearing authentic pronunciation matters enormously.

### Anki (open-source, millions of users)

**Core mechanics:** Customizable flashcard SRS, user-created decks, full control over intervals and card templates, plugin ecosystem.

**Why it works:**
- Complete user control over learning material
- Powerful SRS algorithm (SM-2, now optionally FSRS)
- Community-shared decks for any subject
- Cross-platform sync

**Weakness:** Steep learning curve, ugly default UI, no guided curriculum. Power users love it; casual learners abandon it.

### Drops (Kahoot Group)

**Core mechanics:** Visual vocabulary learning, minimalist illustration-based design, 5-minute daily sessions, swipe/tap micro-games.

**Why it works:**
- Gorgeous minimalist illustrations for every word -- no text clutter
- Strictly 5-minute free sessions create urgency and habit
- Fast-paced games keep engagement high
- Supports 50+ languages including some minority ones (Hawaiian, Maori)
- Swipe-based interactions feel native to mobile

**Key takeaway for Turoyo:** Drops proves that vocabulary-focused, visually beautiful apps with short sessions can drive daily engagement. The illustration approach also sidesteps the need for complex sentence-level content early on.

### Pimsleur

**Core mechanics:** Audio-first 30-minute lessons, Graduated Interval Recall (spaced repetition built into audio), anticipation principle (pause before translation), conversation focus.

**Why it works:**
- Pronunciation-first approach builds confidence
- Graduated Interval Recall naturally spaces vocabulary within each lesson
- Supports 50+ languages
- Great for commute/hands-free learning

**Key takeaway for Turoyo:** An audio component is critical. Turoyo has significant dialectal variation and many learners in the diaspora grew up hearing the language but cannot speak it fluently. Audio-first features serve this audience directly.

### LingoDeer

**Core mechanics:** Grammar-focused structured lessons, AI feedback, speech recognition, sentence building exercises.

**Why it works:**
- Systematic grammar progression (especially strong for Asian languages)
- Clear grammar explanations with examples
- Sentence building exercises teach word order naturally

### Busuu

**Core mechanics:** CEFR-aligned curriculum, community correction (native speakers review your writing/speaking), AI conversation practice, offline mode.

**Why it works:**
- Human feedback from native speakers creates accountability and authenticity
- AI conversation tools simulate real-life dialogues
- Adapts difficulty based on performance
- Official language certificates

**Key takeaway for Turoyo:** Community correction is a standout feature. The Turoyo diaspora community could serve as native-speaker reviewers, creating a virtuous cycle of engagement.

---

## 2. Gamification That Actually Works

### What Research Shows

| Mechanic | Effect | Source |
|----------|--------|--------|
| Streaks | +60% commitment; 7-day streak users 3.6x more likely to stay | Duolingo internal data |
| XP Leaderboards | +40% engagement, +15% lesson completions | Duolingo A/B tests |
| Badges/Achievements | +30% completion rates | Multiple studies |
| Streak Freeze | -21% churn for at-risk users | Duolingo |
| Streaks + Milestones combined | 40-60% higher DAU vs single mechanic | Industry data |

### What Works

- **Daily streaks** -- The single most powerful retention mechanic. Simple to implement, universally effective.
- **Progress bars within lessons** -- Show how far through a lesson you are. Creates completion motivation.
- **XP/Points system** -- Earn points for correct answers, bonus for combos, daily goals.
- **Leaderboards** -- Weekly competitions among a small group (Duolingo uses "leagues" of ~30 users). Social comparison drives engagement.
- **Milestone celebrations** -- Animations/confetti for completing units, reaching streak milestones (7, 30, 100, 365 days).
- **Hearts/Lives system** -- Limited mistakes allowed per session. Creates stakes. Controversial but effective at driving subscriptions.

### What to Avoid

- **Over-gamification** -- Research shows users can become more focused on streaks and rankings than actual learning. Balance is critical.
- **Punitive mechanics** -- Losing all progress on a missed day kills motivation. Always offer streak freezes or grace periods.
- **Forced social features** -- Not everyone wants competition. Make leaderboards opt-in.

### Recommendations for Turoyo App

1. **Implement daily streaks** with streak freeze (1 free per week, earn more through activity)
2. **Simple XP system**: 10 XP per correct answer, 50 XP lesson completion bonus, daily goal of 50/100/200 XP
3. **Progress tracking per topic** (family words: 45%, food: 20%, etc.)
4. **Weekly optional leaderboard** among friends/community
5. **Milestone celebrations** with Turoyo cultural elements (church bells, Tur Abdin imagery, traditional patterns)
6. **Skip the hearts/lives system** -- for an endangered language, never punish someone for trying to learn

---

## 3. Spaced Repetition Systems (SRS)

### How the Major Systems Work

#### SM-2 (SuperMemo 2, 1987)

The classic algorithm used by Anki (until recently). Fixed formula based on user ratings.

**How it works:**
1. User rates recall: 0 (complete blackout) to 5 (perfect)
2. If rating < 3, card resets to beginning
3. If rating >= 3, interval multiplied by an "ease factor" (starts at 2.5)
4. Ease factor adjusts based on performance

**Intervals example:** 1 day -> 6 days -> 15 days -> 38 days -> ...

**Pros:** Simple, well-tested over decades.
**Cons:** Same formula for everyone, ease factor can spiral ("ease hell"), created from limited data.

#### FSRS (Free Spaced Repetition Scheduler, 2023)

Modern algorithm trained on 700M+ reviews from 20,000 users. Now the default in Anki.

**How it works:**
1. Uses 19 weight parameters learned from real user data
2. Predicts probability of forgetting for each card
3. Schedules review just before predicted forgetting point
4. Adapts to individual user's memory patterns over time

**Performance vs SM-2:**
- 20-30% fewer daily reviews for same retention
- In academic testing: FSRS 89.6% success vs SM-2 47.1%
- Learns personal memory patterns automatically

**Key parameters:**
- `requestRetention`: Target retention rate (0.8 = aggressive, 0.9 = balanced, 0.95 = conservative)
- `maximumInterval`: Longest time between reviews (e.g., 365 days)
- `w[0-18]`: Weight parameters (auto-optimized from user data)

#### WaniKani (for Japanese kanji)

Fixed interval ladder: 4h -> 8h -> 1d -> 2d -> 7d -> 14d -> 1mo -> 4mo

Simple but inflexible. Works for WaniKani's specific use case (kanji learning with mnemonics) but not recommended as a general approach.

### Implementation Recommendation for Turoyo App

**Use FSRS via the `ts-fsrs` or `femto-fsrs` library.** Here is why:

1. **`ts-fsrs`** -- Full-featured TypeScript implementation, actively maintained, well-documented
2. **`femto-fsrs`** -- Zero-dependency ~100-line implementation, perfect for a lightweight web app
3. **`simple-ts-fsrs`** -- Minimal implementation, easy to integrate

**Practical implementation plan:**

```
Card state stored per user per word:
{
  wordId: "turoyo_family_001",
  stability: 1.0,        // How well-learned (higher = more stable)
  difficulty: 5.0,        // How hard for this user (1-10)
  due: "2026-02-07T10:00", // Next review time
  lastReview: "2026-02-06T10:00",
  reps: 3,                // Number of reviews
  lapses: 0,              // Times forgotten
  state: "review"         // new | learning | review | relearning
}
```

**Settings for Turoyo learners:**
- `requestRetention: 0.9` -- balanced (not too many reviews, good retention)
- `maximumInterval: 180` -- 6 months max (endangered language needs more frequent contact)
- Start with default FSRS weights, let algorithm optimize per-user over time

---

## 4. Lesson Structure Patterns

### Common Exercise Types Across Apps

| Exercise Type | Description | Best For | Difficulty |
|---|---|---|---|
| **Picture-word matching** | Tap the image that matches the word | New vocabulary | Easiest |
| **Multiple choice (L2->L1)** | "What does 'bayto' mean?" with 4 options | Recognition | Easy |
| **Multiple choice (L1->L2)** | "How do you say 'house'?" with 4 options | Recall | Medium |
| **Audio recognition** | Listen to audio, pick the correct word/image | Listening | Easy-Medium |
| **Fill in the blank** | Complete the sentence with missing word | Context | Medium |
| **Word tile sentence building** | Arrange word tiles into correct sentence order | Syntax/grammar | Medium-Hard |
| **Typing/spelling** | Type the translation from memory | Production | Hard |
| **Matching pairs** | Connect L1 words to L2 equivalents | Review | Medium |
| **Listening + transcription** | Hear a word/phrase, type what you hear | Spelling + Listening | Hard |
| **Speaking/pronunciation** | Say the word, get feedback via speech recognition | Production | Hard |

### Optimal Lesson Flow (Based on Duolingo/Babbel Patterns)

```
1. INTRODUCE (2-3 new items)
   - Show word + image + audio (native speaker)
   - User taps to hear pronunciation
   - Simple "tap the matching image" exercise

2. REINFORCE (practice new items)
   - Multiple choice (L2 -> L1)
   - Multiple choice (L1 -> L2)
   - Audio recognition

3. CHALLENGE (increase difficulty)
   - Fill in the blank
   - Word tile sentence building
   - Typing exercise

4. MIX (combine new + previously learned)
   - Exercises mixing new vocabulary with older items
   - Creates natural spaced repetition within the lesson

5. SUMMARY
   - Show all words learned
   - XP earned, streak updated
   - Option to add words to favorites
```

### Lesson Sizing

- **Micro-lesson (Drops style):** 5 minutes, 5-8 new words, vocabulary only
- **Standard lesson (Duolingo style):** 10-15 minutes, 3-5 new items, mixed exercises
- **Deep lesson (Babbel style):** 15-20 minutes, includes grammar explanation, dialogue, culture note

### Recommendations for Turoyo App

**Start with two lesson formats:**

1. **Vocabulary Sprint (5 min):** Image-word association, multiple choice, matching. Introduce 5-7 new words per session. Perfect for daily habit building.

2. **Full Lesson (10-15 min):** Grammar introduction -> dialogue with audio -> exercises -> review. Cover 3-5 new items plus grammar concept. Include cultural context notes.

**Topic structure for Turoyo:**
- Unit 1: Greetings & Introductions (Shlomo! / Shlomux!)
- Unit 2: Family (bayto, babo, yemo, ahuno, hoso...)
- Unit 3: Numbers & Counting
- Unit 4: Food & Drink
- Unit 5: Daily Life / Around the House
- Unit 6: Body Parts
- Unit 7: Colors & Descriptions
- Unit 8: Time & Calendar
- Unit 9: At the Market / Shopping
- Unit 10: Church & Community (important cultural context)
- (expand based on Surayt.com A1/A2 curriculum)

---

## 5. Vocabulary Management

### Features Found Across Top Apps

**Word Bank / Personal Dictionary:**
- All learned words in one searchable list
- Filter by: topic, mastery level, date learned, favorites
- Tap any word to hear pronunciation, see example sentence
- Mark words as "mastered" or "needs practice"

**Progress Tracking Per Word:**
- Visual indicator: new -> learning -> reviewing -> mastered
- Number of times reviewed, success rate percentage
- Time until next review (SRS integration)
- WordUp-style "Knowledge Map" showing overall vocabulary coverage

**Custom Lists / Decks:**
- Let users create custom word lists (e.g., "words grandma uses", "church vocabulary")
- Share lists with other learners
- Import/export capability

**Review Modes (Babbel pattern):**
- Flashcard mode (tap to flip)
- Listening drill (hear word, pick meaning)
- Spelling practice (type the word)
- Quick quiz (mixed exercise types)

### Recommendations for Turoyo App

1. **Vocabulary Bank** with every word encountered, showing:
   - Turoyo word (Syriac script + Latin transliteration)
   - Audio pronunciation (native speaker)
   - English/German/Swedish/Turkish translation (user's L1)
   - Example sentence
   - SRS status (due date, strength indicator)
   - Topic tag

2. **Favorites system** -- Heart icon on any word to add to personal favorites list

3. **Custom lists** -- Users create named lists (good for heritage speakers collecting family dialect words)

4. **Daily review queue** -- Pulls from SRS algorithm. Shows count: "12 words to review today"

5. **Search** -- Search across all vocabulary by any language

6. **Progress dashboard:**
   - Total words learned (number + visual graph)
   - Words by mastery level (pie chart: new/learning/strong/mastered)
   - Daily/weekly review streak
   - Topic completion percentages

---

## 6. Mobile-First UX Patterns

### Navigation

- **Bottom tab navigation** is the standard (21% faster than top nav). Typical tabs:
  - Home/Learn (main lesson flow)
  - Review (SRS review queue)
  - Vocabulary (word bank)
  - Profile/Progress
- Duolingo uses: Home, Characters, Leaderboard, Shop, Profile

### Card-Based UI

- Flashcards and exercise cards should be full-width, centered, with large touch targets
- Swipe left/right for "know it" / "don't know it" (Tinder-style, used by many flashcard apps)
- Swipe up to skip, swipe down for hint
- Cards should have generous padding, large text (18-24px for target language)

### Haptic Feedback Patterns

| Action | Haptic Type | Purpose |
|---|---|---|
| Correct answer | Light success tap | Positive reinforcement |
| Wrong answer | Double tap (error) | Alert without frustration |
| Streak milestone | Heavy impact | Celebration |
| Card flip | Soft tap | Tactile confirmation |
| Swipe registered | Light tap | Gesture acknowledged |
| Lesson complete | Success pattern | Achievement |

**Implementation:** Use the Web Vibration API (`navigator.vibrate()`) for PWAs or native haptics for app builds. Trigger haptics precisely when the visual animation occurs for best effect.

### Progress Indicators

- **Lesson progress:** Horizontal bar at top of screen, fills as exercises complete
- **Topic progress:** Circular progress rings on topic cards (like Apple Watch activity rings)
- **Daily goal:** Animated bar showing XP earned vs. daily target
- **Overall level:** Simple level number with progress to next level

### Dark Mode

Essential in 2025-2026. Implement CSS custom properties for theme switching. Many learners study at night.

### Typography for Syriac/Aramaic Script

- **Critical consideration:** Turoyo can be written in Syriac script (Serto) and Latin transliteration
- Use a properly rendered Syriac web font (e.g., East Syriac Adiabene, Estrangelo)
- Support RTL layout for Syriac script sections
- Always show both scripts side by side (learners may know only Latin)
- Font size for Syriac: minimum 20px (complex glyphs need space)

### Offline Support (PWA)

- **Service Worker** caches lesson data, audio files, images
- IndexedDB stores vocabulary bank, SRS state, progress data locally
- Sync to server when connection returns
- Mark content as "available offline" with download indicator
- Critical for Turoyo learners who may have poor connectivity in Tur Abdin region or during travel

### Recommended Tech Stack for Static/PWA

```
HTML/CSS/JS (vanilla or lightweight framework)
- Service Worker for offline caching
- IndexedDB for local data storage
- Web Audio API for pronunciation playback
- Vibration API for haptics
- CSS custom properties for theming
- Hosted on sites.run8n.xyz/turoyo-learn/
```

---

## 7. What Works for Minority/Endangered Languages

### Existing Platforms and Lessons Learned

**7000 Languages (nonprofit):**
- Partners directly with communities to build courses
- Free, no ads
- Uses volunteer linguists and community members
- Technology based on transparent.com platform
- Serves Ojibwe, Cree, Dakota, and others
- Lesson: Community partnership is non-negotiable for authenticity

**FirstVoices:**
- 50+ Indigenous languages with dictionaries, recordings, learning materials
- Created in collaboration with native speakers
- Multimedia: audio, images, cultural context
- Lesson: A dictionary/archive component alongside lessons adds long-term value

**Drops:**
- Includes Hawaiian, Maori among 50+ languages
- Vocabulary-only approach works well for minority languages where full curriculum is hard to produce
- Visual illustrations bypass translation issues
- Lesson: Start with vocabulary. You can teach words before you can teach grammar.

**Living Tongues Institute / Living Dictionaries:**
- Collaborative multimedia dictionaries
- "Citizen linguists" contribute recordings and definitions
- Rapid growth through community engagement
- Lesson: Crowdsourced content from native speakers is the only scalable approach for endangered languages

**Surayt-Aramaic App (existing Turoyo resource):**
- Developed through EU Erasmus+ project (2017-2020), Freie Universitat Berlin
- 16 learning units at A1-A2 level
- Available in 7 instruction languages (EN, DE, SV, FR, NL, AR, TR)
- Lesson: There is already an academic curriculum to build upon. Do not reinvent the wheel.

**Oromoyo.ai:**
- AI-assisted translation for Turoyo/Syriac variants
- Emerging tool, demonstrates community demand for digital Turoyo resources

### Challenges Specific to Endangered Languages

1. **Limited content creators:** Few fluent speakers who can create learning materials. Solution: Make content creation dead simple. Record button in app, community validation.

2. **Dialectal variation:** Turoyo varies between villages (Midyat vs. Anhel vs. Kfarze). Solution: Tag content by dialect, let users choose their focus, but expose them to variation.

3. **No standardized orthography:** Multiple writing systems (Syriac Serto, Latin transliteration, Arabic script historically). Solution: Support multiple scripts, always show transliteration.

4. **Small user base:** Cannot rely on viral growth. Solution: Deep engagement over broad reach. Target diaspora communities in Sweden, Germany, Netherlands, USA.

5. **Cultural sensitivity:** Language is tied to identity, religion, and politics. Solution: Work with community leaders, include cultural context, respect diverse backgrounds within the Suryoyo/Aramean community.

6. **Sustainability:** Small market cannot support venture-backed business. Solution: Open source, grant funding (EU Erasmus+, UNESCO), community donations, optional premium features.

### Recommendations for Turoyo App

1. **Partner with existing academic work** -- Build on the Surayt-Aramaic Online Project curriculum (A1/A2 levels already developed)
2. **Community recording portal** -- Let native speakers contribute audio recordings. Simple interface: see word -> tap record -> submit
3. **Dialect awareness** -- Tag all content with dialect. Default to standard Surayt but allow filtering
4. **Multi-script display** -- Every word shown in Syriac (Serto) + Latin transliteration
5. **Cultural context notes** -- Brief notes explaining cultural significance of words/phrases (e.g., church terms, village life vocabulary)
6. **Offline-first** -- Many potential users are elderly speakers in Turkey/diaspora with inconsistent internet
7. **Open content license** -- All community-contributed content under Creative Commons to ensure preservation

---

## 8. AI-Powered Features

### What Exists in 2025-2026

**AI Conversation Partners:**
- Duolingo's "Lily" AI character adapts to skill level, provides conversational practice
- Busuu's AI conversation tools simulate real dialogues with instant feedback
- Babbel's "Speak" feature offers low-pressure AI speaking practice

**Image Recognition for Vocabulary:**
- **Dex Camera:** Physical AI device for kids -- point at objects, get translations in 8 languages + 34 dialects
- **AIlingo:** Mobile app using object detection + image captioning for contextual vocabulary learning in real-world settings
- **Google Lens:** Already translates text in images for major languages

**Adaptive Difficulty:**
- AI adjusts exercise difficulty based on user performance
- Duolingo reports 20% higher completion rates with adaptive AI
- Harder words shown more frequently, mastered words spaced further apart

**Grammar Explanations:**
- AI generates contextual grammar explanations (ChatGPT-style)
- LingoDeer uses AI feedback on grammar exercises
- Potential: User asks "why is it 'bayto' not 'bayti'?" and gets an explanation

**Speech Recognition & Pronunciation Feedback:**
- Most major apps now include speech recognition
- User speaks, app evaluates pronunciation accuracy
- Challenging for minority languages due to lack of training data

### Feasibility Assessment for Turoyo

| Feature | Feasibility | Notes |
|---|---|---|
| **AI Grammar Explanations** | HIGH | Use LLM API (Claude/GPT) with Turoyo grammar rules as context. Works even with limited training data. |
| **Adaptive Difficulty** | HIGH | FSRS handles this automatically. Layer exercise type selection on top. |
| **Image-to-Word (Camera)** | MEDIUM | Use general object detection (pre-trained models) + map detected objects to Turoyo vocabulary. Works for concrete nouns. |
| **AI Conversation Partner** | MEDIUM | LLMs can be prompted with Turoyo vocabulary and grammar rules. Quality depends on how much Turoyo data is in training sets. |
| **Speech Recognition** | LOW | Very limited Turoyo speech data for training. Could use general Arabic/Semitic models as starting point but accuracy would be poor. |
| **AI Translation** | MEDIUM | Oromoyo.ai already attempting this. Quality improving but not reliable enough for learning context yet. |

### Recommendations for Turoyo App

**Phase 1 (launch):**
- Adaptive difficulty via FSRS (no AI needed, algorithm handles it)
- Pre-recorded native speaker audio for all vocabulary (human quality, not TTS)

**Phase 2 (post-launch):**
- AI grammar explanations: Feed Turoyo grammar rules (from academic sources) to Claude/GPT API. User taps "explain" on any grammar point and gets a contextual explanation.
- Camera vocabulary: Use device camera + object detection API -> map detected object label (English) -> look up in Turoyo dictionary -> show word + pronunciation. Works for 200-500 common objects.

**Phase 3 (future):**
- AI conversation practice with carefully constrained vocabulary (limit to learned words)
- Community-validated pronunciation feedback (human speakers rate recordings, not AI)
- Progressive speech recognition as more Turoyo audio data is collected from users (with consent)

---

## 9. Synthesis: Feature Recommendations for Turoyo App

### Must-Have (MVP)

| Feature | Inspired By | Priority |
|---|---|---|
| Vocabulary lessons with image + audio | Drops, Duolingo | P0 |
| Spaced repetition review queue (FSRS) | Anki, Memrise | P0 |
| Daily streak tracking | Duolingo | P0 |
| Multiple exercise types (match, MC, fill-in, tiles) | Duolingo, Babbel | P0 |
| Dual-script display (Syriac + Latin) | Language-specific need | P0 |
| Native speaker audio for all words | Memrise, Pimsleur | P0 |
| Offline support (PWA + Service Worker) | Practical need | P0 |
| Vocabulary bank with search + favorites | Multiple apps | P0 |
| Progress tracking (words learned, streak, topic %) | All apps | P0 |
| Dark mode | UX standard | P0 |

### Should-Have (v1.1)

| Feature | Inspired By | Priority |
|---|---|---|
| XP system with daily goals | Duolingo | P1 |
| Grammar explanation cards within lessons | Babbel, LingoDeer | P1 |
| Cultural context notes | 7000 Languages | P1 |
| Custom word lists | Anki, WordWise | P1 |
| Community audio recording portal | Living Dictionaries | P1 |
| Dialect tagging | Language-specific need | P1 |
| Weekly leaderboard (opt-in) | Duolingo | P1 |
| Haptic feedback | Mobile UX standard | P1 |

### Nice-to-Have (v2+)

| Feature | Inspired By | Priority |
|---|---|---|
| AI grammar explanations (LLM-powered) | Duolingo Lily | P2 |
| Camera vocabulary (point at object, learn word) | Dex, AIlingo | P2 |
| AI conversation practice | Busuu, Babbel Speak | P2 |
| Community correction (native speakers review) | Busuu | P2 |
| Sharing/social features | Duolingo | P2 |
| Mini-stories with comprehension questions | Duolingo Stories | P2 |
| Achievements/badges system | Duolingo | P2 |

### Technical Architecture Summary

```
Frontend: Vanilla JS or lightweight framework (Preact/Svelte)
Hosting: sites.run8n.xyz/turoyo-learn/ (static PWA)
Data: JSON files for lesson content, IndexedDB for user state
SRS: femto-fsrs or ts-fsrs (TypeScript, runs client-side)
Audio: Pre-recorded MP3/OGG files, Web Audio API playback
Offline: Service Worker + Cache API
Sync: Optional backend via run8n webhooks for cross-device sync
Auth: Optional, can start anonymous with local storage
Scripts: Syriac font (Serto) loaded via @font-face
Theming: CSS custom properties for light/dark mode
```

### Key Design Principles

1. **Vocabulary first, grammar second.** Start teaching words. Grammar comes after learners have a foundation.
2. **Audio is non-negotiable.** Every word must have a native speaker recording. Turoyo is an oral tradition; text alone is insufficient.
3. **Respect the community.** Partner with speakers, credit contributors, use open licenses.
4. **Offline-first.** Do not assume reliable internet. The app must work fully offline after initial download.
5. **Dual-script always.** Never show only Syriac or only Latin. Always both.
6. **Short sessions, high frequency.** 5-minute daily vocabulary sprints are better than 30-minute weekly sessions for habit formation.
7. **Celebrate, never punish.** No hearts/lives system. Every attempt to learn an endangered language should be encouraged.
8. **Start simple, iterate.** Launch with vocabulary + SRS. Add grammar, AI, community features over time.
