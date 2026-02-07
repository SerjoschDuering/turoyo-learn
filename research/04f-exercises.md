# Turoyo Grammar Exercises for the App

> 10 exercise templates with correct answers.
> Each exercise is structured for programmatic use.

## Exercise 1: Match the Greeting

```yaml
type: "matching"
level: "beginner"
instruction_de: "Verbinde die Surayt-Begruessung mit der deutschen Uebersetzung."
instruction_en: "Match the Surayt greeting with the German translation."
pairs:
  - left: "Šlomo"
    right: "Hallo / Friede"
  - left: "Tawdi"
    right: "Danke"
  - left: "B-šayno"
    right: "Auf Wiedersehen"
  - left: "Ewa"
    right: "Ja"
  - left: "Lo"
    right: "Nein"
distractors_right:
  - "Bitte"
  - "Guten Morgen"
```

## Exercise 2: Fill in the Family Member

```yaml
type: "fill_in_blank"
level: "beginner"
instruction_de: "Ergaenze das fehlende Wort."
instruction_en: "Fill in the missing word."
questions:
  - sentence: "I ___ ko ṭabxo muklo."
    blank_position: 2
    correct_answer: "emo"
    hint_de: "Meine ___ kocht Essen."
    hint_en: "My ___ cooks food."
    options: ["babo", "emo", "aḥuno", "ḥoṯo"]

  - sentence: "U ___ ko šoġël b-u bayto."
    blank_position: 2
    correct_answer: "babo"
    hint_de: "Der ___ arbeitet zu Hause."
    hint_en: "The ___ works at home."
    options: ["babo", "emo", "barṯo", "abro"]

  - sentence: "Kitl-i tre ___."
    blank_position: 3
    correct_answer: "aḥunone"
    hint_de: "Ich habe zwei ___."
    hint_en: "I have two ___."
    options: ["aḥunone", "ḥoṯoṯe", "abrone", "bnoṯe"]
```

## Exercise 3: Number Recognition

```yaml
type: "multiple_choice"
level: "beginner"
instruction_de: "Waehle die richtige Zahl."
instruction_en: "Choose the correct number."
questions:
  - question: "Tre"
    correct_answer: "2"
    options: ["1", "2", "3", "4"]

  - question: "Ḥamšo"
    correct_answer: "5"
    options: ["3", "4", "5", "6"]

  - question: "Casro"
    correct_answer: "10"
    options: ["7", "8", "9", "10"]

  - question: "Tloṯo"
    correct_answer: "3"
    options: ["2", "3", "4", "5"]

  - question: "Šawco"
    correct_answer: "7"
    options: ["5", "6", "7", "8"]
```

## Exercise 4: Gender Agreement - Adjectives

```yaml
type: "multiple_choice"
level: "intermediate"
instruction_de: "Waehle die richtige Form des Adjektivs."
instruction_en: "Choose the correct form of the adjective."
questions:
  - sentence: "U bayto ___ (gross)"
    correct_answer: "rabo"
    options: ["rabo", "rabṯo", "rabe"]
    explanation_de: "bayto ist maennlich, daher rabo."
    explanation_en: "bayto is masculine, so rabo."

  - sentence: "I aṯto ___ (schoen)"
    correct_answer: "šafirto"
    options: ["šafiro", "šafirto", "šafire"]
    explanation_de: "aṯto ist weiblich, daher šafirto."
    explanation_en: "aṯto is feminine, so šafirto."

  - sentence: "A bote ___ (gross)"
    correct_answer: "rabe"
    options: ["rabo", "rabṯo", "rabe"]
    explanation_de: "bote ist Plural, daher rabe."
    explanation_en: "bote is plural, so rabe."

  - sentence: "U gawro ___ (gut)"
    correct_answer: "ṭowo"
    options: ["ṭowo", "ṭowto", "ṭowe"]
    explanation_de: "gawro ist maennlich, daher ṭowo."
    explanation_en: "gawro is masculine, so ṭowo."
```

## Exercise 5: Articles - Choose the Correct Definite Article

```yaml
type: "multiple_choice"
level: "beginner"
instruction_de: "Waehle den richtigen bestimmten Artikel."
instruction_en: "Choose the correct definite article."
questions:
  - noun: "gawro (Mann)"
    correct_answer: "u-gawro"
    options: ["u-gawro", "i-gawro", "a-gawro"]
    explanation: "Masculine singular = u-"

  - noun: "aṯto (Frau)"
    correct_answer: "i-aṯto"
    options: ["u-aṯto", "i-aṯto", "a-aṯto"]
    explanation: "Feminine singular = i-"

  - noun: "gawrone (Maenner)"
    correct_answer: "a-gawrone"
    options: ["u-gawrone", "i-gawrone", "a-gawrone"]
    explanation: "Plural = a-"

  - noun: "emo (Mutter)"
    correct_answer: "i-emo"
    options: ["u-emo", "i-emo", "a-emo"]
    explanation: "Feminine singular = i-"
```

## Exercise 6: Translate the Phrase

```yaml
type: "multiple_choice"
level: "intermediate"
instruction_de: "Waehle die richtige Uebersetzung."
instruction_en: "Choose the correct translation."
questions:
  - turoyo: "Kitl-i tre aḥunone."
    correct_de: "Ich habe zwei Brueder."
    options_de:
      - "Ich habe zwei Brueder."
      - "Ich habe drei Schwestern."
      - "Du hast zwei Brueder."
      - "Wir haben zwei Brueder."

  - turoyo: "Ko ëzze-no l-u šuqo."
    correct_de: "Ich gehe zum Markt."
    options_de:
      - "Ich komme vom Markt."
      - "Ich gehe zum Markt."
      - "Du gehst zum Markt."
      - "Ich gehe nach Hause."

  - turoyo: "I emo ko šoṯyo čaye."
    correct_de: "Die Mutter trinkt Tee."
    options_de:
      - "Die Mutter kocht Tee."
      - "Der Vater trinkt Tee."
      - "Die Mutter trinkt Tee."
      - "Die Mutter trinkt Kaffee."
```

## Exercise 7: Possession - Build the Sentence

```yaml
type: "fill_in_blank"
level: "intermediate"
instruction_de: "Ergaenze mit kitl- oder latl- (haben / nicht haben)."
instruction_en: "Complete with kitl- or latl- (to have / not to have)."
questions:
  - german: "Ich habe ein Buch."
    template: "___ kṯowo."
    correct_answer: "Kitl-i"
    options: ["Kitl-i", "Latl-i", "Kitl-e", "Latl-e"]

  - german: "Er hat kein Geld."
    template: "___ zuze."
    correct_answer: "Latl-e"
    options: ["Kitl-e", "Latl-e", "Kitl-i", "Latl-i"]

  - german: "Wir haben ein Haus."
    template: "___ bayto."
    correct_answer: "Kitl-an"
    options: ["Kitl-an", "Latl-an", "Kitl-i", "Kitl-e"]

  - german: "Hast du Zeit?"
    template: "___ zabno?"
    correct_answer: "Kitlux"
    options: ["Kitlux", "Kitl-i", "Kitl-e", "Latlux"]
```

## Exercise 8: Color Matching

```yaml
type: "matching"
level: "beginner"
instruction_de: "Verbinde die Farbe auf Surayt mit der deutschen Uebersetzung."
instruction_en: "Match the Surayt color with the German translation."
pairs:
  - left: "semoqo"
    right: "rot"
  - left: "komo"
    right: "schwarz"
  - left: "ḥeworo"
    right: "weiss"
  - left: "yaroqo"
    right: "gruen"
  - left: "zarqo"
    right: "blau"
  - left: "šacuṯo"
    right: "gelb"
distractors_right:
  - "braun"
  - "grau"
  - "orange"
```

## Exercise 9: Present Tense with ko-

```yaml
type: "fill_in_blank"
level: "intermediate"
instruction_de: "Bilde den Satz in der Gegenwartsform mit ko-."
instruction_en: "Form the sentence in present tense with ko-."
questions:
  - german: "Ich lese ein Buch."
    template: "Ko ___-ono ḥa kṯowo."
    correct_answer: "griš"
    hint: "griše = to read"

  - german: "Er geht zum Markt."
    template: "Ko ___-o l-u šuqo."
    correct_answer: "ëzze"
    hint: "ëzze = to go"

  - german: "Wir trinken Tee."
    template: "Ko ___-ina čaye."
    correct_answer: "šoṯ"
    hint: "šoṯe = to drink"

  - german: "Sie (f.) schlaeft."
    template: "Ko ___-o."
    correct_answer: "domëx"
    hint: "dmox = to sleep"
```

## Exercise 10: Build a Dialogue

```yaml
type: "ordering"
level: "intermediate"
instruction_de: "Bringe die Saetze in die richtige Reihenfolge fuer ein Gespraech."
instruction_en: "Put the sentences in the correct order for a conversation."
correct_order:
  - position: 1
    speaker: "A"
    turoyo: "Šlomo! Aydarbo hat?"
    german: "Hallo! Wie geht es dir?"

  - position: 2
    speaker: "B"
    turoyo: "Šlomo! Ṭowo-no, tawdi. U hat?"
    german: "Hallo! Mir geht es gut, danke. Und dir?"

  - position: 3
    speaker: "A"
    turoyo: "Ste ṭowo-no. L-ayko ko ëzz-at?"
    german: "Mir auch gut. Wohin gehst du?"

  - position: 4
    speaker: "B"
    turoyo: "Ko ëzze-no l-u šuqo. Tox cam-i!"
    german: "Ich gehe zum Markt. Komm mit mir!"

  - position: 5
    speaker: "A"
    turoyo: "Ewa, gd oṯe-no!"
    german: "Ja, ich komme!"
```

## Exercise Design Notes for App Development

### Difficulty Progression

1. **Level 1 (Beginner A1)**: Recognition exercises -- matching, multiple choice with images
2. **Level 2 (Beginner A2)**: Fill-in-blank with word banks, simple translations
3. **Level 3 (Intermediate B1)**: Free-form input, sentence building, dialogue ordering
4. **Level 4 (Intermediate B2)**: Listening comprehension, gender/number agreement

### Audio Requirements

Each vocabulary item and phrase should have:
- Native speaker audio recording (Midyat dialect preferred as standard)
- Slow pronunciation variant for learners
- Normal speed variant

### Gamification Suggestions

- Award "Serto stars" for completing exercises in Syriac script
- Village map of Tur Abdin that unlocks as vocabulary grows
- Family tree builder using family vocabulary
- Market simulation using numbers and food vocabulary
