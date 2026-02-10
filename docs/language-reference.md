# Turoyo (Surayt) Language Reference

> **Consolidated from `research/04*.md` files.** For the actual word/phrase data, see `js/data.js` or the NocoDB tables. This document is a concise reference guide, not a data dump.

---

## 1. Language Overview

**Turoyo** (also called **Surayt** or **Suryoyo**) is a living Neo-Aramaic language from the Central Neo-Aramaic branch (Semitic family). The name comes from **turo** ("mountain"), referring to the **Tur Abdin** region in southeastern Turkey.

| Fact | Detail |
|------|--------|
| Classification | Afro-Asiatic > Semitic > Aramaic > Eastern > Central Neo-Aramaic |
| Closest relative | Mlahso (nearly extinct) |
| Speakers | 50,000--250,000 worldwide |
| UNESCO status | Severely Endangered |
| Homeland | Tur Abdin, SE Turkey (~1,500 remaining) |
| Largest diaspora | Sweden and Germany (tens of thousands each) |
| Lexical makeup | 72% Aramaic, 13% Arabic, 8% Kurdish, ~5% Turkish, ~2% other |
| Official status | None in any country |

### Writing Systems

| System | Details |
|--------|---------|
| **Serto** (Western Syriac) | Traditional script. RTL, 22 consonants, vowels via diacritics. Used in religious/cultural contexts. |
| **Latin** (standardized 2015) | Developed 1970s Sweden/Germany. Standardized at Cambridge International Surayt Conference (Aug 2015). Primary script for diaspora learners. |

### Key Transliteration Characters

| Char | IPA | Description | Char | IPA | Description |
|------|-----|-------------|------|-----|-------------|
| e | /e/ | Close-mid front | ḥ | /h/ | Pharyngeal fricative |
| o | /o/ | Close-mid back | ṭ | /t'/ | Emphatic t |
| c | /c/ | Pharyngeal fricative | ṣ | /s'/ | Emphatic s |
| š | /s/ | "sh" sound | ḏ | /d/ | "th" as in *that* |
| ġ | /G/ | Voiced velar fric. | ṯ | /T/ | "th" as in *think* |
| x | /x/ | Voiceless velar fric. | č | /tS/ | "ch" sound |

Full transliteration table with IPA is in `research/04-turoyo-language-data.md`.

---

## 2. Grammar Basics

### Sentence Structure

Default: **VSO** (Verb-Subject-Object), but SVO is common in diaspora speech.

```
Griše  u-gawro  u-kṯowo     "The man read the book"
VERB   SUBJECT  OBJECT
```

### Gender and Number

Two genders (m./f.), two numbers (sg./pl.). Most m. nouns end in **-o**, most f. nouns in **-to/-ṯo**.

| Plural pattern | Example sg. | Example pl. |
|---------------|-------------|-------------|
| m. -o -> -e/-one | gawro | gawrone (men) |
| f. -to -> -oṯe | aṯto | aṯṯoṯe (women) |
| Irregular | bayto | bote (houses) |

### Definite Articles

| | Masculine | Feminine | Plural |
|---|-----------|----------|--------|
| Definite | u- | i- | a- / an- |
| Indefinite | ha (one) | hdo (one) | (none) |

Example: `u-gawro` = the man, `i-aṯto` = the woman, `a-gawrone` = the men.

### Personal Pronouns

| Person | Singular | Plural |
|--------|----------|--------|
| 1st | eno / ono (I) | ahna (we) |
| 2nd | hat (you) | hatu (you pl.) |
| 3rd m. | hiye (he) | hne (they) |
| 3rd f. | hiya (she) | hne (they) |

### Object/Possessive Suffixes

| Person | Object | Possessive |
|--------|--------|------------|
| 1sg | -i | didi |
| 2sg m. | -ox | didox |
| 2sg f. | -ax | didax |
| 3sg m. | -e | dide |
| 3sg f. | -a | dida |
| 1pl | -an | didan |
| 2pl | -ayxu | didayxu |
| 3pl | -aye | didaye |

### Demonstratives

| | Sg. m. | Sg. f. | Plural |
|---|--------|--------|--------|
| This | hano | hathe | hani |
| That | hawo | hayo | hanek |

### Verb System (Aspect-Based)

| Tense | Marker | Example (griše = to read) |
|-------|--------|---------------------------|
| Present | ko- + stem | ko grish-ono (I am reading) |
| Past | stem + -wa | grish-wa-no (I was reading) |
| Future | gd- + present | gd grish-ono (I will read) |
| Imperative | bare stem | gresh! (read!) |

**Present conjugation with ko-:**

| Person | Form |
|--------|------|
| I | ko grish-ono |
| you | ko grish-at |
| he | ko grish-o |
| she | ko gresh-o |
| we | ko grish-ina |
| you pl. | ko grish-utu |
| they | ko gresh-i |

### Copula (To Be)

Enclitic suffixes: `-no` (I am), `-at` (you are), `-yo` (he/she is), `-na` (we are), `-utu` (you pl. are), `-ne` (they are).

```
Eno towo-no = I am good.    Hat towo-at = You are good.
```

### Existence and Possession

| Concept | Positive | Negative |
|---------|----------|----------|
| There is | kit / kito | layt / layto |
| To have | kitl- + suffix | latl- + suffix |
| Can/able | kib- + suffix | layb- + suffix |

```
Kitl-i kṯowo = I have a book.    Latl-i zabno = I don't have time.
```

### Prepositions (with article fusion)

| Prep | Meaning | +m.sg | +f.sg | +pl |
|------|---------|-------|-------|-----|
| m- | from | m-u | m-i | m-a |
| l- | to/for | l-u | l-i | l-a |
| b- | in | b-u | b-i | b-a |
| d- | of | d-u | d-i | d-a |
| cal | on/about | cal u- | cal i- | cal a- |

### Key Conjunctions

| Turoyo | English | Turoyo | English |
|--------|---------|--------|---------|
| u | and | elo | but |
| aw | or | lo | not |
| iza | if | cal d- | because |
| d- | that/who | hul | until |
| xud | like | ste | also |

### Adjective Agreement

Adjectives follow the noun and agree in gender: m. `-o`, f. `-to`.

```
u-bayto rabo = the big house (m.)    i-aṯto šafirto = the beautiful woman (f.)
```

---

## 3. Vocabulary by Category (Representative Examples)

> Full word lists are in `js/data.js` and NocoDB. Below are samples per category.

### Greetings

| Turoyo | English | German |
|--------|---------|--------|
| šlomo | Hello / Peace | Hallo / Friede |
| šlomo lux / lax | Peace to you (m./f.) | Friede sei mit dir |
| tawdi | Thank you | Danke |
| b-šayno | Goodbye | Auf Wiedersehen |
| aydarbo hat? | How are you? | Wie geht es dir? |
| towo-no, tawdi | I'm good, thanks | Mir geht es gut, danke |
| mu šmux? | What's your name? (m.) | Wie heisst du? |

### Family (selected)

| Turoyo | English | Gender |
|--------|---------|--------|
| babo | Father | m. |
| emo | Mother | f. |
| abro / barṯo | Son / Daughter | m./f. |
| ahuno / hoṯo | Brother / Sister | m./f. |
| gawro / aṯto | Man (husband) / Woman (wife) | m./f. |
| jdo / mayme | Grandfather / Grandmother | m./f. |
| cammo / camṯo | Uncle / Aunt (paternal) | m./f. |

### Numbers (1--10, m. form)

| # | Turoyo | # | Turoyo |
|---|--------|---|--------|
| 1 | ha | 6 | ëšto |
| 2 | tre | 7 | šawco |
| 3 | tloṯo | 8 | tmanyo |
| 4 | arbco | 9 | tëšco |
| 5 | hamšo | 10 | casro |

Higher: cisri (20), mo (100), alfo (1000). Numbers have m./f. forms.

### Colors (m. form shown)

| Turoyo | English | Turoyo | English |
|--------|---------|--------|---------|
| semoqo | red | zarqo | blue |
| komo | black | yaroqo | green |
| heworo | white | šacuṯo | yellow |

### Food and Drinks (selected)

| Turoyo | English | Turoyo | English |
|--------|---------|--------|---------|
| lahmo | bread | hamro | wine |
| maye | water | basro | meat |
| halbo | milk | muklo | food |
| čaye | tea | melho | salt |

### Body Parts (selected)

| Turoyo | English | Turoyo | English |
|--------|---------|--------|---------|
| rišo | head | iḏo | hand |
| cayno | eye | lebo | heart |
| femo | mouth | lešono | tongue/language |

### Animals (selected)

| Turoyo | English | Turoyo | English |
|--------|---------|--------|---------|
| kalbo | dog | teyro | bird |
| qaṭo | cat | ṯurṯo | cow |
| sisyo | horse | emro | lamb |

### House, Nature, Time (selected)

| Turoyo | English | Turoyo | English |
|--------|---------|--------|---------|
| bayto | house | šëmšo | sun |
| tarco | door | arco | earth |
| kṯowo | book | yawmo | day |
| nuro | fire | lalyo | night |

### Common Verbs

| Turoyo | English | Turoyo | English |
|--------|---------|--------|---------|
| oṯe | to come | oxël | to eat |
| zox | to go | šoṯe | to drink |
| griše | to read | dmox | to sleep |
| koṯaw | to write | mcalem | to speak |

### Common Adjectives and Adverbs

| Turoyo | English | Turoyo | English |
|--------|---------|--------|---------|
| rabo / rabṯo | big | harke | here |
| nacimo / nacimto | small | tamo | there |
| towo / towto | good | oʕdo | now |
| šafiro / šafirto | beautiful | ġalabe | very/much |

---

## 4. Key Phrases and Dialogues

### Essential Patterns

| Pattern | Example | Translation |
|---------|---------|-------------|
| Greeting | Šlomo, aydarbo hat? | Hello, how are you? |
| Reply | Towo-no, tawdi. U hat? | I'm good, thanks. And you? |
| Introduction | Šm-i Yuhanon-yo. | My name is Yuhanon. |
| Origin | Eno m-Almanya-no. | I am from Germany. |
| Language | Ko mcalem-at Surayt? | Do you speak Surayt? |
| Not understand | Lo ko foham-ono. | I don't understand. |
| Possession | Kitl-i tre ahunone. | I have two brothers. |
| Future | Gd oṯe-no ramhël. | I will come tomorrow. |
| Direction | L-ayko ko ëzz-at? | Where are you going? |
| Blessing | Aloho mbarëx. | God bless you. |

### Sample Dialogue: Greeting a Relative

```
A: Šlomo, hol-i! Aydarbo hat?          (Hello, my uncle! How are you?)
B: Šlomo, abr-i! Towo-no, tawdi        (Hello, my son! I'm good, thanks
   l-Aloho. U hat?                       to God. And you?)
A: Ste towo-no. I em-i ko dëršo        (I'm also good. My mother sends
   šlomo lux.                            greetings to you.)
B: Tawdi. Tox, tëh gab-an, šṯi čaye!  (Thanks. Come, sit with us, drink tea!)
A: Tawdi ġalabe. Elo latl-i zabno.     (Thank you very much. But I have no time.)
B: Towo, gd hoze-na hdode ramhël.      (Good, we'll see each other tomorrow.
   B-šayno!                              Goodbye!)
```

### Sample Dialogue: At the Market

```
A: Šlomo! Kmo košto u lahmo?            (Hello! How much does the bread cost?)
B: U lahmo b-tre euro.                  (The bread is two euros.)
A: Towo. Kitlux basro ste?             (Good. Do you also have meat?)
B: Ewa, kit basro towo. Kmo kobcat?    (Yes, good meat. How much do you want?)
A: Ha kilo, b-basimo.                   (One kilo, please.)
B: Tfadal. Kulle b-casro euro.         (Here you go. All for ten euros.)
```

### Proverbs and Idioms

| Turoyo | English |
|--------|---------|
| U lešono xayifo me sayfono. | The tongue is sharper than a sword. |
| Latl-i lebo. | I have no heart (not in the mood). |
| Kit flefle b-aye. | There's chilli in them (hyperactive). |
| U bayto d-lo kit be kṯowe, xud qëwro yo. | A house without books is like a grave. |

### Cultural Notes

- **Hospitality**: Offering tea/food to guests is deeply ingrained; refusing is considered rude.
- **Religious expressions**: "Aloho mbarëx" and "tawdi l-Aloho" are woven into everyday speech.
- **Family distinctions**: Separate terms for paternal vs. maternal uncle/aunt reflect kinship importance.
- **Village identity**: Dialect differences between Tur Abdin villages (Midyat, Anhel, Kfarze) are a source of pride.

---

## 5. Exercise Types in the App

| # | Type | Level | Description |
|---|------|-------|-------------|
| 1 | **Matching** | Beginner | Match Surayt greetings to German translations (with distractors) |
| 2 | **Fill-in-blank** | Beginner | Complete sentences with correct family member word (word bank) |
| 3 | **Multiple choice** | Beginner | Number recognition (Surayt word -> digit) |
| 4 | **Multiple choice** | Intermediate | Gender agreement -- choose correct adjective form for noun |
| 5 | **Multiple choice** | Beginner | Choose correct definite article (u-/i-/a-) for a noun |
| 6 | **Translation MC** | Intermediate | Choose correct German translation for a Surayt sentence |
| 7 | **Fill-in-blank** | Intermediate | Possession with kitl-/latl- (have/don't have) |
| 8 | **Matching** | Beginner | Color vocabulary matching with distractors |
| 9 | **Fill-in-blank** | Intermediate | Present tense conjugation with ko- prefix |
| 10 | **Ordering** | Intermediate | Arrange sentences into correct dialogue order |

### Difficulty Progression

1. **A1 Beginner**: Recognition -- matching, MC with images
2. **A2 Beginner**: Fill-in-blank with word banks, simple translations
3. **B1 Intermediate**: Free-form input, sentence building, dialogue ordering
4. **B2 Intermediate**: Listening comprehension, gender/number agreement

### Gamification Ideas

- "Serto stars" for completing exercises in Syriac script
- Tur Abdin village map that unlocks as vocabulary grows
- Family tree builder using family vocabulary
- Market simulation using numbers and food vocabulary

---

## Sources

- Slomo Surayt online course (surayt.com) -- Cambridge 2015 standard
- Barsky, Furman, Loesov (2018): "Two-Hundred-Word Swadesh List for Turoyo"
- Suryoyo Simple grammar reference (cheesefrog.github.io)
- Omniglot -- Turoyo writing system
