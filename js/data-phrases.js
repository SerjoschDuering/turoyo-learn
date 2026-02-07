/* data-phrases.js -- Phrase & dialogue data for sentence exercises */
/* No dependencies. Exposes PHRASES and DIALOGUES globals.          */

var PHRASES = [
  // === GREETINGS ===
  {
    id: "ph_01",
    turoyo: ["Shlomo", "lux"],
    en: "Peace be upon you",
    de: "Friede sei mit dir",
    cat: "greetings"
  },
  {
    id: "ph_02",
    turoyo: ["Aydarbo", "hat"],
    en: "How are you?",
    de: "Wie geht es dir?",
    cat: "greetings"
  },
  {
    id: "ph_03",
    turoyo: ["Towo-no", "tawdi"],
    en: "I'm fine, thanks",
    de: "Gut, danke",
    cat: "greetings"
  },
  {
    id: "ph_04",
    turoyo: ["Mu", "shmux"],
    en: "What's your name?",
    de: "Wie heisst du?",
    cat: "greetings"
  },
  // === FAMILY ===
  {
    id: "ph_05",
    turoyo: ["U", "bab-i", "ko", "shoghel", "b-u", "bayto"],
    en: "My father works at home",
    de: "Mein Vater arbeitet zu Hause",
    cat: "family"
  },
  {
    id: "ph_06",
    turoyo: ["I", "em-i", "ko", "tabxo", "muklo"],
    en: "My mother cooks food",
    de: "Meine Mutter kocht Essen",
    cat: "family"
  },
  {
    id: "ph_07",
    turoyo: ["Kitl-i", "tre", "ahunone", "u", "hdo", "hoto"],
    en: "I have two brothers and one sister",
    de: "Ich habe zwei Brueder und eine Schwester",
    cat: "family"
  },
  // === DAILY ===
  {
    id: "ph_08",
    turoyo: ["Ko", "ezze-no", "l-u", "shuqo"],
    en: "I'm going to the market",
    de: "Ich gehe zum Markt",
    cat: "daily"
  },
  {
    id: "ph_09",
    turoyo: ["Kit", "maye"],
    en: "Is there water?",
    de: "Gibt es Wasser?",
    cat: "daily"
  },
  {
    id: "ph_10",
    turoyo: ["Tawdi", "ghalabe"],
    en: "Thank you very much",
    de: "Vielen Dank",
    cat: "greetings"
  },
  {
    id: "ph_11",
    turoyo: ["Lo", "ko", "foham-ono"],
    en: "I don't understand",
    de: "Ich verstehe nicht",
    cat: "daily"
  },
  {
    id: "ph_12",
    turoyo: ["Gd", "othe-no", "ramhel"],
    en: "I will come tomorrow",
    de: "Ich werde morgen kommen",
    cat: "daily"
  },
  {
    id: "ph_13",
    turoyo: ["Ko", "mcalem-at", "Surayt"],
    en: "Do you speak Surayt?",
    de: "Sprichst du Surayt?",
    cat: "daily"
  },
  {
    id: "ph_14",
    turoyo: ["Tox", "teh", "gab-i"],
    en: "Come, sit next to me",
    de: "Komm, setz dich neben mich",
    cat: "greetings"
  }
];

var DIALOGUES = [
  {
    id: "dlg_01",
    title: "Meeting Someone",
    titleDe: "Jemanden treffen",
    turns: [
      { speaker: "A", turoyo: "Shlomo! Mu shmux?", en: "Hello! What's your name?", de: "Hallo! Wie heisst du?" },
      { speaker: "B", turoyo: "Shlomo! Shm-i Yuhanon-yo. U hat?", en: "Hello! My name is Yuhanon. And you?", de: "Hallo! Mein Name ist Yuhanon. Und du?" },
      { speaker: "A", turoyo: "Shm-i Maryam-yo. M-ayko hat?", en: "My name is Maryam. Where are you from?", de: "Mein Name ist Maryam. Woher kommst du?" },
      { speaker: "B", turoyo: "Eno m-Almanya-no. U hat?", en: "I am from Germany. And you?", de: "Ich bin aus Deutschland. Und du?" },
      { speaker: "A", turoyo: "Eno ste m-Almanya-no. Tawdi!", en: "I am also from Germany. Thanks!", de: "Ich bin auch aus Deutschland. Danke!" }
    ]
  },
  {
    id: "dlg_02",
    title: "At the Market",
    titleDe: "Auf dem Markt",
    turns: [
      { speaker: "A", turoyo: "Shlomo! Kmo koshto u lahmo?", en: "Hello! How much does the bread cost?", de: "Hallo! Wie viel kostet das Brot?" },
      { speaker: "B", turoyo: "U lahmo b-tre euro.", en: "The bread is two euros.", de: "Das Brot kostet zwei Euro." },
      { speaker: "A", turoyo: "Towo. Kitlux basro ste?", en: "Good. Do you also have meat?", de: "Gut. Haben Sie auch Fleisch?" },
      { speaker: "B", turoyo: "Ewa, kit basro towo. Kmo kobcat?", en: "Yes, there is good meat. How much do you want?", de: "Ja, es gibt gutes Fleisch. Wie viel moechten Sie?" },
      { speaker: "A", turoyo: "Ha kilo, b-basimo.", en: "One kilo, please.", de: "Ein Kilo, bitte." },
      { speaker: "B", turoyo: "Tfadal. Tawdi lux!", en: "Here you go. Thank you!", de: "Bitte sehr. Danke!" }
    ]
  },
  {
    id: "dlg_03",
    title: "Visiting Family",
    titleDe: "Familie besuchen",
    turns: [
      { speaker: "A", turoyo: "Shlomo, hol-i! Aydarbo hat?", en: "Hello, my uncle! How are you?", de: "Hallo, mein Onkel! Wie geht es dir?" },
      { speaker: "B", turoyo: "Shlomo, abr-i! Towo-no, tawdi l-Aloho.", en: "Hello, my son! I'm good, thanks to God.", de: "Hallo, mein Sohn! Gut, Gott sei Dank." },
      { speaker: "A", turoyo: "I em-i ko dersho shlomo lux.", en: "My mother sends greetings to you.", de: "Meine Mutter laesst gruessen." },
      { speaker: "B", turoyo: "Tawdi. Tox, teh gab-an, shti chaye!", en: "Thanks. Come, sit with us, drink tea!", de: "Danke. Komm, setz dich zu uns, trink Tee!" },
      { speaker: "A", turoyo: "Tawdi ghalabe. B-shayno!", en: "Thank you very much. Goodbye!", de: "Vielen Dank. Auf Wiedersehen!" }
    ]
  }
];
