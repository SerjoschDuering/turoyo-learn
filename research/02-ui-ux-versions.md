# Turoyo Learn - UI/UX Design: Two Versions

## Table of Contents

1. [Shared Foundation](#shared-foundation)
2. [VERSION A - Gamified "Leshono"](#version-a---gamified-leshono)
3. [VERSION B - Calm Study "Surayt"](#version-b---calm-study-surayt)
4. [Cross-Cutting Concerns](#cross-cutting-concerns)
5. [Data Model](#data-model)
6. [Technical Approach](#technical-approach)

---

## Shared Foundation

### Turoyo Script Technical Requirements

Turoyo (Surayt) uses the **Serto** variant of the Syriac script. Key facts:

- **Direction:** Right-to-left (RTL) for Syriac; left-to-right (LTR) for Latin transliteration
- **Unicode range:** U+0700 to U+074F (Syriac block)
- **22 basic consonants**, 5 vowel diacritics (based on Greek letters), 3 matres lectionis
- **Fully pointed** in the 2017 orthography (functions as an alphabet, not an abjad)
- **Font:** Meltho font family from Beth Mardutho (free, 20+ OpenType fonts). Primary choice: **Serto Jerusalem** or **Serto Kharput**
- All word-initial vowels attach to silent alaph (U+0710)
- 8 letters join only rightward; others join both sides

### Dual-Script Display Pattern

Every word in the app must display in both scripts. The standard layout:

```
+----------------------------------+
|        ܫܠܳܡܐ                      |   <-- Serto (RTL, large)
|       shlomo                     |   <-- Latin transliteration (LTR, smaller)
|       "peace"                    |   <-- English meaning (smallest)
+----------------------------------+
```

CSS approach for dual-script cards:

```css
.word-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}
.word-serto {
  direction: rtl;
  font-family: 'Serto Jerusalem', 'Serto Kharput', serif;
  font-size: 2rem;
  unicode-bidi: bidi-override;
  line-height: 1.6; /* extra height for diacritics above/below */
}
.word-latin {
  direction: ltr;
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  color: var(--text-secondary);
  font-style: italic;
}
.word-meaning {
  direction: ltr;
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  color: var(--text-tertiary);
}
```

### Font Loading Strategy

Self-host the Serto font files (WOFF2) since they are not on Google Fonts:

```css
@font-face {
  font-family: 'Serto Jerusalem';
  src: url('/fonts/SyrCOMJerusalem.woff2') format('woff2'),
       url('/fonts/SyrCOMJerusalem.woff') format('woff');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}
```

Download the Meltho package from bethmardutho.org and convert to WOFF2 for web use.

---

## VERSION A - Gamified "Leshono"

**App Name:** Leshono (ܠܫܢܐ - "language" in Turoyo)

**Design Philosophy:** Energetic, rewarding, social. Every interaction feels like a mini-game. Inspired by Duolingo's proven gamification loop but with a distinct cultural identity rooted in Aramean heritage.

### 1. Screen Flow

```
ONBOARDING (3 screens)
  |
  v
HOME (Lesson Path)  <-->  PROFILE (Stats/Achievements)
  |                          |
  v                          v
LESSON (Exercise Flow)    STREAK CALENDAR
  |                          |
  v                          v
LESSON COMPLETE           LEADERBOARD
  |
  v
DAILY REVIEW (optional)
```

**Complete Screen List:**

| # | Screen | Purpose |
|---|--------|---------|
| 1 | Splash | Animated logo, 1.5s |
| 2 | Onboarding 1 | "Learn the language of your ancestors" + illustration |
| 3 | Onboarding 2 | Pick daily goal (5/10/15/20 min) |
| 4 | Onboarding 3 | Pick experience level (Beginner/Some/Intermediate) |
| 5 | Home | Scrollable lesson path (vertical node tree) |
| 6 | Lesson Intro | Unit title, word preview, "Start" CTA |
| 7 | Exercise: Match Pairs | Match Serto to Latin/English (6 pairs) |
| 8 | Exercise: Multiple Choice | "What does ܫܠܳܡܐ mean?" + 4 options |
| 9 | Exercise: Listen & Choose | Audio plays, pick the correct word |
| 10 | Exercise: Type Answer | See English, type Latin transliteration |
| 11 | Exercise: Picture Match | See image, pick correct Turoyo word |
| 12 | Exercise: Build Sentence | Arrange word tiles into a sentence |
| 13 | Lesson Complete | XP earned, streak update, accuracy % |
| 14 | Profile | Avatar, XP total, level, streak, achievements grid |
| 15 | Streak Calendar | Heatmap of daily activity |
| 16 | Leaderboard | Weekly rankings (local or global) |
| 17 | Achievements | Badge collection (locked/unlocked grid) |
| 18 | Settings | Sound, notifications, daily goal, script preference |
| 19 | Alphabet Reference | Scrollable Serto alphabet chart |

### 2. Core Interaction Patterns

**A typical 5-minute session:**

1. User opens app -> Home screen, sees their position on the lesson path
2. Taps next available lesson node -> Lesson Intro shows "Unit 3: Family Words" with 5 word previews
3. Taps "Start" -> Series of 8-12 exercises:
   - Exercise 1: Match 4 pairs (Serto <-> English) - tap to select, tap to match
   - Exercise 2: Multiple choice - "What does ܐܒܐ mean?" -> Father / Mother / Brother / Sister
   - Exercise 3: Listen exercise - audio plays "babo", pick correct Serto word
   - Exercise 4: Type it - see "mother" + image, type "emo" in Latin
   - Exercise 5: Picture match - photo of a house, pick ܒܰܝܬܐ from 4 options
   - Exercise 6-8: Increasing difficulty, mixing previously learned words
4. Progress bar fills across top. Hearts system: start with 5, lose 1 per mistake.
5. Lesson Complete screen: "+25 XP", streak counter increments, confetti animation
6. Optional: "Review weak words?" -> Quick 3-card SRS review

**Interaction details:**

- **Correct answer:** Green flash, checkmark animation, subtle haptic, +XP counter bumps
- **Wrong answer:** Red shake, correct answer revealed, -1 heart, brief explanation
- **Streak freeze:** If user misses a day, one free "streak freeze" per week
- **Level up:** Full-screen celebration with Aramean-inspired geometric animation

### 3. Color Scheme and Visual Style

**Primary Palette - "Aramean Gold & Garden"**

Inspired by the golden hues of Tur Abdin (the Turoyo homeland) and lush greenery, rather than copying Duolingo's exact palette.

```css
:root {
  /* Primary */
  --color-primary: #2D9F3E;         /* Rich green - correct/CTA */
  --color-primary-light: #4FBF62;   /* Hover state */
  --color-primary-dark: #1E7A2E;    /* Active state */

  /* Accent - Aramean Gold */
  --color-accent: #E8A317;          /* Gold - XP, achievements */
  --color-accent-light: #F5C24A;    /* Star fill */
  --color-accent-dark: #C48A0F;     /* Gold pressed */

  /* Feedback */
  --color-error: #E24545;           /* Wrong answer red */
  --color-error-light: #FDEAEA;     /* Error background */
  --color-error-dark: #B33030;      /* Error active */
  --color-success: #2D9F3E;         /* Reuses primary green */
  --color-success-light: #E8F5E9;   /* Success background */

  /* XP & Levels */
  --color-xp: #4A90D9;             /* Blue for XP indicators */
  --color-streak: #FF9800;         /* Orange for streak fire */

  /* Neutrals */
  --color-bg: #F7F7F7;             /* Page background */
  --color-surface: #FFFFFF;         /* Card background */
  --color-surface-elevated: #FFFFFF;
  --color-border: #E0E0E0;
  --color-text-primary: #2C2C2C;
  --color-text-secondary: #6B6B6B;
  --color-text-tertiary: #9E9E9E;
  --color-text-on-primary: #FFFFFF;

  /* Lesson Path */
  --color-unit-1: #2D9F3E;         /* Green */
  --color-unit-2: #4A90D9;         /* Blue */
  --color-unit-3: #E8A317;         /* Gold */
  --color-unit-4: #9B59B6;         /* Purple */
  --color-unit-5: #E24545;         /* Red/Coral */

  /* Typography */
  --font-ui: 'Inter', -apple-system, sans-serif;
  --font-serto: 'Serto Jerusalem', 'Serto Kharput', serif;
  --font-display: 'Nunito', 'Inter', sans-serif;

  /* Spacing */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;

  /* Radii */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-card: 0 2px 8px rgba(0,0,0,0.08);
  --shadow-button: 0 4px 0 var(--color-primary-dark);
  --shadow-elevated: 0 4px 16px rgba(0,0,0,0.12);
}
```

**Visual Style:**

- **Buttons:** Chunky 3D-style with bottom shadow (like Duolingo). 48px min height, rounded corners (12px).
- **Cards:** White surface, 8px radius, subtle shadow. Slight scale animation on tap.
- **Icons:** Rounded, filled style. Custom illustrated icons where possible.
- **Illustrations:** Semi-flat style with subtle gradients. Cultural motifs: pomegranates, geometric Syriac patterns, Tur Abdin landscapes.
- **Animations:** Bouncy spring curves (`cubic-bezier(0.34, 1.56, 0.64, 1)`). Confetti on milestones. Pulse on streak counter.
- **Font sizes:** Serto script always 1.5x-2x the UI font size for readability.
- **Lesson path:** Vertical scrolling node tree. Nodes are circles (48px) connected by curved lines. Completed = solid color with checkmark. Current = pulsing ring. Locked = gray.

**Button component example:**

```css
.btn-primary {
  background-color: var(--color-primary);
  color: var(--color-text-on-primary);
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 700;
  padding: 12px 24px;
  border: none;
  border-radius: var(--radius-md);
  box-shadow: 0 4px 0 var(--color-primary-dark);
  transform: translateY(0);
  transition: transform 0.1s, box-shadow 0.1s;
  min-height: 48px;
  width: 100%;
  cursor: pointer;
}
.btn-primary:active {
  transform: translateY(4px);
  box-shadow: 0 0 0 var(--color-primary-dark);
}
```

### 4. Tab/Navigation Structure

**Bottom tab bar** with 4 tabs:

```
+----------+----------+----------+----------+
|  Learn   |  Review  | Leaders  | Profile  |
|  (home)  |  (SRS)   | (social) | (stats)  |
+----------+----------+----------+----------+
```

| Tab | Icon | Content |
|-----|------|---------|
| **Learn** | Book icon | Lesson path tree, daily goal progress |
| **Review** | Refresh arrows | Quick review of weak words, daily recap |
| **Leaders** | Trophy icon | Weekly leaderboard, friend activity |
| **Profile** | Person icon | Stats, achievements, streak calendar, settings |

**Navigation rules:**
- Tab bar always visible except during active lessons (full-screen immersive)
- Lessons have a top progress bar + close (X) button to exit
- Back gesture/button on detail screens
- Modal overlays for achievements, level-up celebrations

```css
.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 64px;
  background: var(--color-surface);
  border-top: 1px solid var(--color-border);
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding-bottom: env(safe-area-inset-bottom);
  z-index: 100;
}
.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  font-size: 0.7rem;
  color: var(--color-text-tertiary);
  text-decoration: none;
  padding: 8px 16px;
}
.tab-item.active {
  color: var(--color-primary);
}
.tab-item.active .tab-icon {
  transform: scale(1.1);
}
```

### 5. Exercise Component Designs

**Match Pairs Layout:**

```
+---------------------------------------+
| Match the pairs              3/6 done |
+---------------------------------------+
|                                       |
|  [  ܐܒܐ  ]       [  mother  ]        |
|  [  ܐܡܐ  ]       [  father  ]        |
|  [  ܐܚܐ  ]       [ brother  ]        |
|  [  ܚܬܐ  ]       [  sister  ]        |
|                                       |
+---------------------------------------+
| Progress: [========------] 60%        |
+---------------------------------------+
```

```css
.match-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-sm);
  padding: var(--space-md);
}
.match-tile {
  padding: 14px 12px;
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  text-align: center;
  font-size: 1.1rem;
  background: var(--color-surface);
  transition: border-color 0.2s, background 0.2s, transform 0.15s;
  min-height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.match-tile.selected {
  border-color: var(--color-primary);
  background: var(--color-success-light);
  transform: scale(1.03);
}
.match-tile.matched {
  border-color: var(--color-primary);
  background: var(--color-success-light);
  opacity: 0.6;
  pointer-events: none;
}
.match-tile.wrong {
  border-color: var(--color-error);
  background: var(--color-error-light);
  animation: shake 0.3s ease-in-out;
}
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-6px); }
  75% { transform: translateX(6px); }
}
```

**Multiple Choice Layout:**

```
+---------------------------------------+
|  X                    [====---] 4/8   |
+---------------------------------------+
|                                       |
|           ܫܠܳܡܐ                       |
|          shlomo                       |
|                                       |
|   What does this word mean?           |
|                                       |
|  +----------------------------------+ |
|  |  Peace                           | |
|  +----------------------------------+ |
|  +----------------------------------+ |
|  |  War                             | |
|  +----------------------------------+ |
|  +----------------------------------+ |
|  |  Friend                          | |
|  +----------------------------------+ |
|  +----------------------------------+ |
|  |  House                           | |
|  +----------------------------------+ |
|                                       |
+---------------------------------------+
```

```css
.choice-option {
  width: 100%;
  padding: 16px 20px;
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  font-size: 1rem;
  font-family: var(--font-ui);
  text-align: left;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
}
.choice-option:hover {
  border-color: var(--color-primary-light);
  background: #F0FAF1;
}
.choice-option.correct {
  border-color: var(--color-primary);
  background: var(--color-success-light);
}
.choice-option.incorrect {
  border-color: var(--color-error);
  background: var(--color-error-light);
}
```

---

## VERSION B - Calm Study "Surayt"

**App Name:** Surayt (the modern self-designation for Turoyo)

**Design Philosophy:** Quiet, focused, respectful of the learner's time. No pressure, no streaks, no competition. A personal study companion. Inspired by Mochi Cards, Apple's design language, and the meditative quality of calligraphy.

### 1. Screen Flow

```
ONBOARDING (2 screens, minimal)
  |
  v
HOME (Dashboard)
  |
  +---> FLASHCARD REVIEW (SRS session)
  |       |
  |       v
  |     SESSION SUMMARY
  |
  +---> WORD COLLECTIONS
  |       |
  |       v
  |     COLLECTION DETAIL -> WORD DETAIL
  |
  +---> GRAMMAR REFERENCE
  |       |
  |       v
  |     TOPIC DETAIL (expandable sections)
  |
  +---> PHOTO TRANSLATE (Camera/Gallery -> Identify -> Learn)
  |
  +---> ALPHABET EXPLORER
          |
          v
        LETTER DETAIL (stroke, sound, examples)
```

**Complete Screen List:**

| # | Screen | Purpose |
|---|--------|---------|
| 1 | Welcome | Minimal welcome, language picker (if multi-lang later) |
| 2 | Onboarding | Brief explanation of SRS + how the app works |
| 3 | Home/Dashboard | Today's review count, recent words, quick actions |
| 4 | Flashcard Review | Full-screen card flip interface, swipe or tap to rate |
| 5 | Session Summary | Words reviewed, accuracy, next review time |
| 6 | Word Collections | Grid of themed word sets (Family, Food, Nature, etc.) |
| 7 | Collection Detail | Word list within a collection, progress per word |
| 8 | Word Detail | Large Serto display, transliteration, audio, example sentence, related words |
| 9 | Favorites | User-bookmarked words, custom collections |
| 10 | Grammar Reference | Expandable topic list (Pronouns, Verbs, Plurals, etc.) |
| 11 | Grammar Topic | Content page with examples, tables, and inline Serto |
| 12 | Alphabet Explorer | Full Serto alphabet grid, tap for detail |
| 13 | Letter Detail | Letter in context, pronunciation, stroke direction, example words |
| 14 | Photo Translate | Camera viewfinder / image picker -> object detection -> word display |
| 15 | Search | Search across all words by English, Latin, or Serto |
| 16 | Settings | Theme (light/dark), font size, SRS intervals, data export |

### 2. Core Interaction Patterns

**A typical 5-minute session:**

1. User opens app -> Dashboard shows "12 words due for review" with a calm blue indicator
2. Taps "Start Review" -> Full-screen flashcard appears:
   - Front: Serto word ܒܰܝܬܐ in large calligraphic font, centered on screen
   - User taps card or swipes up -> Card flips with a smooth 3D rotation:
   - Back: "bayto" (Latin), "house" (English), example sentence, small speaker icon for audio
3. User self-rates: swipe left = "Again", swipe down = "Hard", swipe right = "Good", swipe up = "Easy"
   - Or tap one of 4 buttons at the bottom: Again | Hard | Good | Easy
   - Each button shows next review interval: "1m" | "6m" | "1d" | "4d"
4. Next card appears with a gentle slide transition
5. After all due cards: summary screen shows words reviewed, weak spots, next session time
6. User might then browse a collection, tap a word to see full detail, and add it to favorites

**Interaction details:**

- **Card flip:** CSS 3D transform, 0.4s ease-out. Front fades, back appears.
- **Swipe gestures:** Horizontal swipe threshold 80px. Card tilts slightly in swipe direction.
- **Rating feedback:** Subtle color wash - green for Good/Easy, amber for Hard, red for Again. No jarring animations.
- **No hearts, no lives, no penalties.** Mistakes are just data for the SRS algorithm.
- **Session can be paused and resumed.** Progress saved to localStorage after each card.
- **"Zen mode":** Optional setting that hides all stats and just shows cards.

### 3. Color Scheme and Visual Style

**Primary Palette - "Parchment & Ink"**

Inspired by ancient manuscripts, monastery libraries, and the warm tones of Mesopotamian architecture.

```css
:root {
  /* Light theme (default) */
  --color-primary: #4A6FA5;         /* Muted indigo-blue */
  --color-primary-light: #6B8FC5;   /* Hover */
  --color-primary-dark: #3A5A87;    /* Active */
  --color-primary-subtle: #EDF2F9;  /* Tinted background */

  /* Accent - Warm Saffron */
  --color-accent: #C4883A;          /* Warm saffron/amber */
  --color-accent-light: #D9A55E;
  --color-accent-subtle: #FDF5EB;

  /* Feedback - Muted tones */
  --color-again: #C25B56;           /* Soft red */
  --color-hard: #D4953A;            /* Amber */
  --color-good: #5B9A6F;            /* Sage green */
  --color-easy: #4A6FA5;            /* Matches primary */

  /* Neutrals - Warm */
  --color-bg: #FAF8F5;              /* Warm parchment white */
  --color-surface: #FFFFFF;
  --color-surface-alt: #F5F2EE;     /* Slightly tinted card */
  --color-border: #E8E4DE;          /* Warm gray border */
  --color-divider: #F0ECE6;
  --color-text-primary: #2C2A27;    /* Near-black, warm */
  --color-text-secondary: #7A756D;
  --color-text-tertiary: #ADA89F;
  --color-text-on-primary: #FFFFFF;

  /* Serto-specific */
  --color-serto-text: #1A1815;      /* Very dark warm black for max readability */
  --color-serto-bg: #FBF9F6;        /* Parchment tint behind Serto */

  /* Dark theme overrides (toggled via [data-theme="dark"]) */
  /* --color-bg: #1C1B19; */
  /* --color-surface: #2A2825; */
  /* --color-text-primary: #E8E4DE; */
  /* --color-serto-text: #F0ECE6; */

  /* Typography */
  --font-ui: 'Inter', -apple-system, sans-serif;
  --font-serto: 'Serto Jerusalem', 'Serto Kharput', serif;
  --font-serif: 'Source Serif 4', 'Georgia', serif;

  /* Spacing - 4px base */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;
  --space-3xl: 64px;

  /* Radii - softer, more rounded */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 20px;

  /* Shadows - very subtle */
  --shadow-sm: 0 1px 3px rgba(44,42,39,0.06);
  --shadow-md: 0 2px 8px rgba(44,42,39,0.08);
  --shadow-lg: 0 4px 16px rgba(44,42,39,0.1);

  /* Transitions */
  --ease-out: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  --ease-spring: cubic-bezier(0.34, 1.2, 0.64, 1);
  --duration-fast: 0.15s;
  --duration-normal: 0.3s;
  --duration-slow: 0.5s;
}

/* Dark theme */
[data-theme="dark"] {
  --color-bg: #1C1B19;
  --color-surface: #2A2825;
  --color-surface-alt: #343230;
  --color-border: #3E3C38;
  --color-divider: #343230;
  --color-text-primary: #E8E4DE;
  --color-text-secondary: #9E9A93;
  --color-text-tertiary: #6B675F;
  --color-serto-text: #F0ECE6;
  --color-serto-bg: #2A2825;
  --color-primary: #6B8FC5;
  --color-primary-subtle: #2A3344;
  --color-accent-subtle: #3D3225;
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.2);
  --shadow-md: 0 2px 8px rgba(0,0,0,0.25);
  --shadow-lg: 0 4px 16px rgba(0,0,0,0.3);
}
```

**Visual Style:**

- **Buttons:** Flat or very subtly raised. No 3D effects. 44px min height (Apple HIG). Generous padding.
- **Cards:** Warm white background, thin warm-gray border (1px), very faint shadow. No hard edges.
- **Typography:** Source Serif 4 for headings (connects to manuscript feel). Inter for body text. Serto Jerusalem for all Turoyo script.
- **Whitespace:** Generous. At least 16px padding on all containers, 24px between sections.
- **Animations:** Gentle eases, no bounces. Card flip is smooth 3D rotate. Page transitions are horizontal slides (200ms).
- **Icons:** Thin line style (1.5px stroke). Minimal, functional.
- **No mascot, no confetti, no celebrations.** The reward is learning itself.
- **Dark mode:** Full dark theme support with warm dark tones (not pure black).

**Flashcard component example:**

```css
.flashcard-container {
  perspective: 1000px;
  width: 100%;
  max-width: 360px;
  margin: 0 auto;
  aspect-ratio: 3/4;
}
.flashcard {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.5s var(--ease-out);
  cursor: pointer;
}
.flashcard.flipped {
  transform: rotateY(180deg);
}
.flashcard-face {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  border-radius: var(--radius-xl);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-md);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-xl);
}
.flashcard-back {
  transform: rotateY(180deg);
}
.flashcard-serto {
  font-family: var(--font-serto);
  font-size: 3rem;
  color: var(--color-serto-text);
  direction: rtl;
  line-height: 1.6;
  text-align: center;
}
.flashcard-latin {
  font-family: var(--font-ui);
  font-size: 1.25rem;
  color: var(--color-text-secondary);
  font-style: italic;
  margin-top: var(--space-sm);
}
```

**Rating buttons:**

```css
.rating-bar {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-sm);
  padding: var(--space-md);
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--color-bg);
  border-top: 1px solid var(--color-border);
  padding-bottom: calc(var(--space-md) + env(safe-area-inset-bottom));
}
.rating-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 10px 8px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  font-family: var(--font-ui);
  cursor: pointer;
  transition: background var(--duration-fast), border-color var(--duration-fast);
}
.rating-btn .label {
  font-size: 0.8rem;
  font-weight: 600;
}
.rating-btn .interval {
  font-size: 0.65rem;
  color: var(--color-text-tertiary);
}
.rating-btn--again { --btn-color: var(--color-again); }
.rating-btn--hard { --btn-color: var(--color-hard); }
.rating-btn--good { --btn-color: var(--color-good); }
.rating-btn--easy { --btn-color: var(--color-easy); }
.rating-btn:active {
  background: color-mix(in srgb, var(--btn-color) 10%, var(--color-surface));
  border-color: var(--btn-color);
}
```

### 4. Tab/Navigation Structure

**Bottom tab bar** with 4 tabs (thinner, more refined than Version A):

```
+-----------+-----------+-----------+-----------+
|   Home    |  Browse   |  Grammar  |  More     |
| (review)  | (words)   | (ref)     | (tools)   |
+-----------+-----------+-----------+-----------+
```

| Tab | Icon | Content |
|-----|------|---------|
| **Home** | Circle/dot icon | Dashboard: due reviews, recent activity, quick start |
| **Browse** | Grid icon | Word collections, favorites, search |
| **Grammar** | Book open icon | Grammar reference topics, expandable sections |
| **More** | Three dots | Photo translate, alphabet explorer, settings, about |

**Navigation rules:**
- Tab bar visible on all screens except during active flashcard review
- During review: full-screen immersive mode, only card + rating buttons
- Swipe back gesture on all detail screens
- No modals for content (use full pages). Modals only for confirmations.
- Search accessible from Browse tab header (pull-down or tap)

```css
.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 56px;
  background: color-mix(in srgb, var(--color-bg) 85%, transparent);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-top: 1px solid var(--color-divider);
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding-bottom: env(safe-area-inset-bottom);
  z-index: 100;
}
.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  font-size: 0.65rem;
  font-weight: 500;
  color: var(--color-text-tertiary);
  text-decoration: none;
  padding: 6px 20px;
  transition: color var(--duration-fast);
}
.tab-item.active {
  color: var(--color-primary);
}
```

### 5. Dashboard Layout (Version B)

```
+---------------------------------------+
|  Surayt                   [settings]  |
+---------------------------------------+
|                                       |
|  Good morning                         |
|                                       |
|  +------ Review Card ---------------+ |
|  |  12 words due                    | |
|  |                                  | |
|  |  [  Start Review  ]             | |
|  |                                  | |
|  |  Next review: 3 new, 9 review   | |
|  +----------------------------------+ |
|                                       |
|  Recently Learned                     |
|  +------+ +------+ +------+          |
|  | ܫܠܳܡܐ | |  ܒܰܝܬ | |  ܡܝܐ |          |
|  |shlomo| | bayto| |  mayo|          |
|  +------+ +------+ +------+          |
|                                       |
|  Your Progress                        |
|  Total words: 47  |  Known: 31       |
|  [==========--------] 66%            |
|                                       |
|  Collections                          |
|  +--------+  +--------+              |
|  |Greetings|  | Family |              |
|  | 12/15   |  |  8/12  |              |
|  +--------+  +--------+              |
|                                       |
+---------------------------------------+
|  Home  |  Browse  | Grammar |  More   |
+---------------------------------------+
```

```css
.dashboard {
  padding: var(--space-lg) var(--space-md);
  padding-bottom: calc(56px + env(safe-area-inset-bottom) + var(--space-lg));
}
.review-card {
  background: var(--color-primary-subtle);
  border: 1px solid color-mix(in srgb, var(--color-primary) 20%, transparent);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  text-align: center;
  margin-bottom: var(--space-xl);
}
.review-card .count {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-primary);
  font-family: var(--font-ui);
}
.review-card .subtitle {
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  margin-top: var(--space-xs);
}
.recent-words {
  display: flex;
  gap: var(--space-sm);
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  padding-bottom: var(--space-sm);
}
.recent-word-chip {
  flex-shrink: 0;
  scroll-snap-align: start;
  padding: var(--space-sm) var(--space-md);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  text-align: center;
  min-width: 80px;
}
.recent-word-chip .serto {
  font-family: var(--font-serto);
  font-size: 1.3rem;
  direction: rtl;
  color: var(--color-serto-text);
}
.recent-word-chip .latin {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  margin-top: 2px;
}
```

---

## Cross-Cutting Concerns

### RTL/LTR Mixed Script Handling

This is the most significant technical challenge. Strategy:

**1. Container-level direction:**

```css
/* Default app direction is LTR (English UI) */
html { direction: ltr; }

/* Any element displaying Serto gets its own RTL context */
[lang="syc"], .serto-text {
  direction: rtl;
  unicode-bidi: isolate;
  font-family: var(--font-serto);
  text-align: right;
}

/* For inline Serto within LTR text */
.serto-inline {
  direction: rtl;
  unicode-bidi: embed;
  font-family: var(--font-serto);
}
```

**2. HTML structure for bilingual display:**

```html
<div class="word-card">
  <span class="serto-text" lang="syc">ܫܠܳܡܐ</span>
  <span class="transliteration" lang="tru-Latn">shlomo</span>
  <span class="meaning" lang="en">peace</span>
</div>
```

**3. Bidirectional exercise layouts:**

For match exercises where Serto appears on one side and English on the other, use CSS grid with explicit column directions:

```css
.match-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}
.match-col-serto {
  direction: rtl;
  text-align: center; /* center-align avoids RTL/LTR alignment conflicts */
}
.match-col-english {
  direction: ltr;
  text-align: center;
}
```

**4. Input handling for Latin transliteration:**

Users type Latin text (LTR), so all text inputs remain LTR. No Syriac keyboard input needed for MVP -- learners type "shlomo" not "ܫܠܳܡܐ".

```css
.answer-input {
  direction: ltr;
  font-family: var(--font-ui);
  text-align: center;
  font-size: 1.2rem;
  padding: 12px 16px;
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  width: 100%;
  outline: none;
  transition: border-color 0.2s;
}
.answer-input:focus {
  border-color: var(--color-primary);
}
```

### Audio Integration

**Current approach (MVP - mocked):**

```javascript
// Audio data stored as base64 in localStorage or as small MP3 files
// For MVP: use Web Speech API for approximate pronunciation
const speakWord = (latinText) => {
  // Web Speech API as fallback (not accurate for Turoyo but functional)
  const utterance = new SpeechSynthesisUtterance(latinText);
  utterance.lang = 'ar'; // Arabic is closest available voice
  utterance.rate = 0.8;  // Slow down
  speechSynthesis.speak(utterance);
};
```

**Production approach (future):**

```javascript
// Pre-recorded audio files per word, stored in /audio/ folder
// Loaded on demand, cached by service worker
const playAudio = async (wordId) => {
  const audio = new Audio(`/audio/${wordId}.mp3`);
  audio.playbackRate = 1.0;
  try {
    await audio.play();
  } catch (e) {
    // Fallback to Web Speech API
    speakWord(words[wordId].latin);
  }
};
```

**Audio file strategy:**
- Record native speakers saying each word (crowdsource from community)
- Store as MP3 at 32kbps mono (very small, ~5KB per word)
- 500 words = ~2.5MB total, cacheable by service worker
- Include in PWA cache for offline use

**Speaker button component:**

```css
.audio-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1.5px solid var(--color-border);
  background: var(--color-surface);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
}
.audio-btn:active {
  background: var(--color-primary-subtle);
  border-color: var(--color-primary);
}
.audio-btn.playing {
  animation: pulse-ring 0.8s ease-out;
}
@keyframes pulse-ring {
  0% { box-shadow: 0 0 0 0 rgba(74,111,165,0.3); }
  100% { box-shadow: 0 0 0 12px rgba(74,111,165,0); }
}
```

### Offline-First Approach

**Service Worker Strategy:**

```javascript
// sw.js - Cache-first for all app assets
const CACHE_NAME = 'turoyo-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/css/main.css',
  '/js/app.js',
  '/js/data.js',
  '/js/srs.js',
  '/fonts/SyrCOMJerusalem.woff2',
  '/manifest.json',
  // All word audio files
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then(cached => cached || fetch(event.request))
  );
});
```

**Data storage hierarchy:**

| Data | Storage | Reason |
|------|---------|--------|
| Word database | Static JS file (bundled) | Never changes at runtime |
| Lesson content | Static JS file | Pre-authored content |
| User progress | localStorage | Simple key-value, < 5MB |
| SRS card states | localStorage | Small per-card objects |
| Settings | localStorage | Preferences |
| Audio cache | Cache API (via SW) | Binary files, large |
| Font files | Cache API (via SW) | Binary, cached forever |

**localStorage schema:**

```javascript
// Key: 'turoyo_user'
{
  "name": "Learner",
  "dailyGoalMinutes": 10,
  "createdAt": "2026-02-06T00:00:00Z",
  "settings": {
    "theme": "light",
    "fontSize": "medium",
    "showSerto": true,
    "showLatin": true,
    "soundEnabled": true
  }
}

// Key: 'turoyo_progress'
{
  "xp": 450,                    // Version A only
  "level": 3,                   // Version A only
  "streak": 7,                  // Version A only
  "streakFreezes": 1,           // Version A only
  "lastActiveDate": "2026-02-06",
  "lessonsCompleted": [1,2,3,4,5],
  "totalReviews": 234,
  "totalCorrect": 198,
  "wordsLearned": 47,
  "favorites": ["w_shlomo", "w_bayto", "w_emo"]
}

// Key: 'turoyo_cards'
// Object keyed by word ID, storing SRS state per word
{
  "w_shlomo": {
    "difficulty": 0.3,
    "stability": 12.5,
    "due": "2026-02-08T10:00:00Z",
    "reps": 5,
    "lapses": 0,
    "state": "review",     // "new" | "learning" | "review" | "relearning"
    "lastReview": "2026-02-06T09:30:00Z",
    "lastRating": 3        // 1=Again, 2=Hard, 3=Good, 4=Easy
  },
  "w_bayto": { ... },
  ...
}
```

---

## Data Model

### Word Entry

```javascript
// Each word in the static database
{
  id: "w_shlomo",
  serto: "ܫܠܳܡܐ",           // Syriac script (UTF-8 encoded)
  latin: "shlomo",           // Latin transliteration
  english: "peace",          // English meaning
  category: "greetings",     // Category/collection ID
  partOfSpeech: "noun",      // noun, verb, adjective, etc.
  gender: "masculine",       // masculine, feminine, or null
  plural: {
    serto: "ܫܠܳܡ̈ܐ",
    latin: "shlome"
  },
  audioFile: "shlomo.mp3",   // Filename in /audio/
  exampleSentence: {
    serto: "ܫܠܳܡܐ ܥܠܰܝܟ",
    latin: "shlomo alakh",
    english: "Peace be upon you"
  },
  difficulty: 1,             // 1-5 (used for ordering in lessons)
  relatedWords: ["w_shlomo_alakh"],
  tags: ["basic", "greeting", "common"]
}
```

### Lesson Entry (Version A only)

```javascript
{
  id: "lesson_3_1",
  unitId: "unit_3",
  unitTitle: "Family",
  lessonNumber: 1,
  title: "Parents & Siblings",
  description: "Learn words for close family members",
  wordIds: ["w_babo", "w_emo", "w_akho", "w_khotho"],
  exercises: [
    {
      type: "match_pairs",
      pairs: [
        { serto: "w_babo", match: "father" },
        { serto: "w_emo", match: "mother" },
        { serto: "w_akho", match: "brother" },
        { serto: "w_khotho", match: "sister" }
      ]
    },
    {
      type: "multiple_choice",
      wordId: "w_babo",
      question: "What does ܐܒܐ mean?",
      correctAnswer: "father",
      distractors: ["mother", "brother", "uncle"]
    },
    {
      type: "type_answer",
      prompt: "Type the Turoyo word for 'mother'",
      acceptedAnswers: ["emo", "Emo"]
    },
    {
      type: "listen_choose",
      wordId: "w_akho",
      options: ["w_babo", "w_emo", "w_akho", "w_khotho"]
    }
  ],
  xpReward: 25,
  prerequisiteLessons: ["lesson_2_3"]
}
```

### Unit Entry (Version A only)

```javascript
{
  id: "unit_3",
  title: "Family",
  description: "People closest to you",
  color: "#E8A317",
  icon: "family",
  lessons: ["lesson_3_1", "lesson_3_2", "lesson_3_3"],
  order: 3,
  prerequisiteUnits: ["unit_2"]
}
```

### Collection Entry (Version B only)

```javascript
{
  id: "col_greetings",
  title: "Greetings & Basics",
  description: "Essential phrases for everyday conversation",
  icon: "hand-wave",
  wordIds: ["w_shlomo", "w_shlomo_alakh", "w_tawdi", "w_lo", "w_he"],
  color: "#4A6FA5",
  order: 1
}
```

### Grammar Entry (Version B only)

```javascript
{
  id: "gram_pronouns",
  title: "Personal Pronouns",
  order: 1,
  sections: [
    {
      heading: "Subject Pronouns",
      content: "Turoyo has distinct pronouns for...",
      table: {
        headers: ["Person", "Serto", "Latin", "English"],
        rows: [
          ["1sg", "ܐܢܐ", "ono", "I"],
          ["2sg.m", "ܐܰܬ", "at", "you (m)"],
          ["2sg.f", "ܐܰܬ", "at", "you (f)"],
          ["3sg.m", "ܗܘ", "hu", "he"],
          ["3sg.f", "ܗܝ", "hi", "she"]
        ]
      }
    }
  ]
}
```

### Achievement Entry (Version A only)

```javascript
{
  id: "ach_first_lesson",
  title: "First Steps",
  description: "Complete your first lesson",
  icon: "star",
  condition: { type: "lessons_completed", count: 1 },
  xpBonus: 10,
  unlocked: false
}
```

### Complete Data File Structure

```
turoyo-learn/
  js/
    data/
      words.js          // All word entries (~200-500 words)
      lessons.js        // Version A: lesson definitions
      units.js          // Version A: unit structure
      collections.js    // Version B: word collection groupings
      grammar.js        // Version B: grammar reference content
      achievements.js   // Version A: achievement definitions
      alphabet.js       // Shared: Serto alphabet data
```

---

## Technical Approach

### Architecture: Static PWA with localStorage

```
turoyo-learn/
  index.html              # SPA shell (< 500 lines)
  manifest.json           # PWA manifest
  sw.js                   # Service worker
  css/
    variables.css         # Design tokens (shared)
    base.css              # Reset, typography, global styles
    components.css        # Buttons, cards, inputs
    layout.css            # Tab bar, page containers
    exercises.css         # Version A: exercise-specific styles
    flashcard.css         # Version B: flashcard-specific styles
    rtl.css               # RTL/bidi overrides
  js/
    app.js                # Router, state management, init
    router.js             # Hash-based SPA router
    state.js              # localStorage read/write, state management
    srs.js                # SRS algorithm (simplified FSRS)
    audio.js              # Audio playback manager
    components/
      TabBar.js
      WordCard.js
      FlashCard.js        # Version B
      ExerciseMatch.js    # Version A
      ExerciseChoice.js   # Version A
      ExerciseType.js     # Version A
      ProgressBar.js
      LessonPath.js       # Version A
      ReviewSession.js    # Version B
    data/
      words.js
      lessons.js
      collections.js
      grammar.js
      alphabet.js
  fonts/
    SyrCOMJerusalem.woff2
    SyrCOMJerusalem.woff
  audio/                  # Word pronunciation files
    shlomo.mp3
    bayto.mp3
    ...
  icons/                  # PWA icons
    icon-192.png
    icon-512.png
```

### SPA Router (Hash-based)

No build tools, no bundler. Pure vanilla JS with hash routing:

```javascript
// router.js
class Router {
  constructor() {
    this.routes = {};
    this.currentRoute = null;
    window.addEventListener('hashchange', () => this.handleRoute());
  }

  register(path, handler) {
    this.routes[path] = handler;
  }

  handleRoute() {
    const hash = window.location.hash.slice(1) || '/';
    const [path, ...params] = hash.split('/').filter(Boolean);
    const route = '/' + (path || '');

    if (this.routes[route]) {
      this.currentRoute = route;
      this.routes[route](params);
    }
  }

  navigate(path) {
    window.location.hash = path;
  }
}
```

### SRS Algorithm (Simplified FSRS)

A lightweight implementation suitable for localStorage:

```javascript
// srs.js
const SRS = {
  // Rating constants
  AGAIN: 1,
  HARD: 2,
  GOOD: 3,
  EASY: 4,

  // Default parameters (tuned from FSRS research)
  params: {
    requestRetention: 0.9,
    maximumInterval: 365,
    w: [0.4, 0.6, 2.4, 5.8, 4.93, 0.94, 0.86, 0.01,
        1.49, 0.14, 0.94, 2.18, 0.05, 0.34, 1.26, 0.29, 2.61]
  },

  createCard(wordId) {
    return {
      wordId,
      difficulty: 0,
      stability: 0,
      due: new Date().toISOString(),
      reps: 0,
      lapses: 0,
      state: 'new',
      lastReview: null,
      lastRating: null
    };
  },

  getNextIntervals(card) {
    // Returns preview of intervals for each rating
    return {
      again: this._calculateInterval(card, this.AGAIN),
      hard: this._calculateInterval(card, this.HARD),
      good: this._calculateInterval(card, this.GOOD),
      easy: this._calculateInterval(card, this.EASY)
    };
  },

  review(card, rating) {
    const now = new Date();
    const updated = { ...card };

    if (card.state === 'new') {
      // First review: set initial stability based on rating
      updated.stability = [0.5, 1, 3, 8][rating - 1];
      updated.difficulty = Math.max(0, Math.min(1, 0.5 - (rating - 3) * 0.15));
      updated.state = rating === 1 ? 'learning' : 'review';
    } else {
      // Subsequent reviews
      if (rating === 1) {
        updated.lapses += 1;
        updated.stability = Math.max(0.5, updated.stability * 0.3);
        updated.state = 'relearning';
      } else {
        const multiplier = { 2: 1.2, 3: 2.5, 4: 4.0 }[rating];
        updated.stability = Math.min(
          this.params.maximumInterval,
          updated.stability * multiplier
        );
        updated.difficulty = Math.max(0, Math.min(1,
          updated.difficulty - (rating - 3) * 0.05
        ));
        updated.state = 'review';
      }
    }

    updated.reps += 1;
    updated.lastReview = now.toISOString();
    updated.lastRating = rating;
    updated.due = new Date(
      now.getTime() + updated.stability * 24 * 60 * 60 * 1000
    ).toISOString();

    return updated;
  },

  _calculateInterval(card, rating) {
    const temp = this.review({ ...card }, rating);
    const days = temp.stability;
    if (days < 1) return `${Math.round(days * 24 * 60)}m`;
    if (days < 30) return `${Math.round(days)}d`;
    return `${Math.round(days / 30)}mo`;
  },

  getDueCards(cards) {
    const now = new Date();
    return Object.values(cards)
      .filter(c => new Date(c.due) <= now)
      .sort((a, b) => new Date(a.due) - new Date(b.due));
  }
};
```

### PWA Manifest

```json
{
  "name": "Turoyo Learn",
  "short_name": "Turoyo",
  "description": "Learn the Turoyo (Aramean) language",
  "start_url": "/turoyo-learn/",
  "display": "standalone",
  "background_color": "#FAF8F5",
  "theme_color": "#4A6FA5",
  "orientation": "portrait",
  "icons": [
    { "src": "icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "icons/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

### State Management Pattern

No framework. Vanilla JS with a simple pub/sub store:

```javascript
// state.js
const Store = {
  _state: {},
  _listeners: {},

  init() {
    // Load from localStorage
    this._state = {
      user: JSON.parse(localStorage.getItem('turoyo_user') || 'null'),
      progress: JSON.parse(localStorage.getItem('turoyo_progress') || '{}'),
      cards: JSON.parse(localStorage.getItem('turoyo_cards') || '{}')
    };
  },

  get(key) {
    return this._state[key];
  },

  set(key, value) {
    this._state[key] = value;
    localStorage.setItem(`turoyo_${key}`, JSON.stringify(value));
    this._notify(key, value);
  },

  subscribe(key, callback) {
    if (!this._listeners[key]) this._listeners[key] = [];
    this._listeners[key].push(callback);
    return () => {
      this._listeners[key] = this._listeners[key].filter(cb => cb !== callback);
    };
  },

  _notify(key, value) {
    (this._listeners[key] || []).forEach(cb => cb(value));
  }
};
```

### Photo Translate (Version B)

Uses the device camera to capture images, then identifies objects for vocabulary learning. For a static site, we have two options:

**Option 1 - On-device ML (TensorFlow.js + MobileNet):**

```javascript
// photo-translate.js
// Uses TensorFlow.js with MobileNet for object detection
// ~5MB model, cached by service worker after first load

import * as mobilenet from '@tensorflow-models/mobilenet';

let model = null;

async function loadModel() {
  if (!model) {
    model = await mobilenet.load({ version: 2, alpha: 0.5 }); // Smallest variant
  }
  return model;
}

async function classifyImage(imageElement) {
  const m = await loadModel();
  const predictions = await m.classify(imageElement, 5);
  // Map English labels to Turoyo words
  return predictions
    .map(p => ({
      english: p.className,
      confidence: p.probability,
      turoyoWord: findTuroyoWord(p.className)
    }))
    .filter(p => p.turoyoWord !== null);
}

function findTuroyoWord(englishLabel) {
  // Search word database for matching English meaning
  const normalized = englishLabel.toLowerCase();
  return WORDS.find(w =>
    w.english.toLowerCase() === normalized ||
    w.tags.includes(normalized)
  ) || null;
}
```

**Option 2 - Simpler approach (curated image categories):**

Pre-define categories of common objects (food, household, nature, body parts) with reference images. User takes a photo, we show the closest matching category and its words. Less impressive but 100% offline and very small.

### Responsive Layout

Mobile-first, max-width constrained:

```css
/* base.css */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-size: 16px;
  -webkit-text-size-adjust: 100%;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  font-family: var(--font-ui);
  background: var(--color-bg);
  color: var(--color-text-primary);
  min-height: 100dvh;
  overflow-x: hidden;
}

.app-container {
  max-width: 480px;
  margin: 0 auto;
  min-height: 100dvh;
  position: relative;
}

.page {
  padding: var(--space-md);
  padding-bottom: calc(64px + env(safe-area-inset-bottom) + var(--space-md));
  min-height: 100dvh;
}

/* Safe area for notched phones */
@supports (padding: env(safe-area-inset-top)) {
  .page-header {
    padding-top: calc(var(--space-md) + env(safe-area-inset-top));
  }
}
```

---

## Comparison Summary

| Aspect | Version A (Leshono) | Version B (Surayt) |
|--------|--------------------|--------------------|
| **Target user** | Casual learner, heritage speaker wanting to reconnect | Serious student, self-motivated learner |
| **Session length** | 5-10 min (structured) | 2-20 min (flexible) |
| **Motivation model** | External (XP, streaks, leaderboard) | Internal (curiosity, progress tracking) |
| **Color mood** | Bright green + gold, playful | Warm parchment + indigo, calm |
| **Typography** | Nunito (display) + Inter (body) | Source Serif 4 (headings) + Inter (body) |
| **Primary font size (Serto)** | 1.5-2rem | 2-3rem (larger, more prominent) |
| **Animations** | Bouncy, celebratory, frequent | Subtle, smooth, infrequent |
| **Content structure** | Linear lesson path | Free-form browse + SRS |
| **Exercise types** | 6+ types (match, choice, listen, type, picture, sentence) | Flashcard flip + self-rating only |
| **Grammar** | Embedded in lessons (learn by doing) | Dedicated reference section |
| **Social features** | Leaderboard, friend challenges | None |
| **Dark mode** | No (bright colors don't adapt well) | Yes (warm dark palette) |
| **Offline size estimate** | ~3-5MB (more assets, illustrations) | ~1-3MB (minimal, text-heavy) |
| **Complexity to build** | High (many exercise types, game logic) | Medium (SRS engine, fewer screens) |
| **Maintenance burden** | High (content authoring per lesson) | Low (word database + SRS handles rest) |
| **Build order recommendation** | Build after B is validated | Build first (simpler MVP) |

---

## Recommended Approach

**Build Version B first** as the MVP. Reasons:

1. Smaller scope, faster to launch and test with real users
2. The SRS engine is the core value -- flashcard review works with any amount of content
3. Word database created for B is reused entirely for A
4. Grammar reference and alphabet explorer provide standalone value even without gamification
5. Version A's gamification layer can be added on top of B's data and SRS foundation
6. Dark mode and clean design feels more "app-like" with less effort (no illustrations needed)

**Phase 1 (Version B MVP):** Dashboard, flashcard review, word collections, alphabet explorer, basic SRS, offline PWA
**Phase 2 (Version B complete):** Grammar reference, photo translate, favorites, search, dark mode
**Phase 3 (Version A):** Lesson path, exercise types, XP/streaks, achievements, leaderboard

---

## Research Sources

- [Duolingo Brand Color Guidelines](https://design.duolingo.com/identity/color)
- [Duolingo UX Case Study - Usability Geek](https://usabilitygeek.com/ux-case-study-duolingo/)
- [Turoyo Orthographic Notes - r12a](https://r12a.github.io/scripts/syrc/tru.html)
- [Turoyo Language and Alphabet - Omniglot](https://www.omniglot.com/writing/turoyo.htm)
- [Beth Mardutho Syriac Fonts (Meltho)](https://sedra.bethmardutho.org/about/fonts)
- [FSRS.js - Open Spaced Repetition](https://github.com/open-spaced-repetition/fsrs.js)
- [W3C - RTL Rendering of LTR Scripts](https://www.w3.org/International/questions/qa-ltr-scripts-in-rtl)
- [MDN - Progressive Web Apps](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [web.dev - Offline Data for PWAs](https://web.dev/learn/pwa/offline-data)
- [Syriac Unicode Block (U+0700-074F)](https://www.alanwood.net/unicode/syriac.html)
