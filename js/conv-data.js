/* conv-data.js -- Conversation scripts and proverb breakdown data */
/* Used by: conversations.js (ConversationMode)                    */

var CONV_SCRIPTS = [
  {
    id:"conv_greet",title:"Meeting Someone",titleDe:"Jemanden kennenlernen",
    icon:"\uD83D\uDC4B",difficulty:1,
    turns:[
      {speaker:"A",turoyo:"\u0161lomo!",en:"Hello!",blank:false},
      {speaker:"B",turoyo:"\u0161lomo lux!",en:"Hello to you!",blank:true,type:"options",options:["\u0161lomo lux!","tawdi","b-\u0161ayno"]},
      {speaker:"A",turoyo:"aydarbo hat?",en:"How are you?",blank:false},
      {speaker:"B",turoyo:"\u1E6Dowo-no, tawdi.",en:"I'm fine, thanks.",blank:true,type:"options",options:["\u1E6Dowo-no, tawdi.","b-\u0161ayno","lo"]},
      {speaker:"A",turoyo:"mu \u0161mux?",en:"What's your name?",blank:false},
      {speaker:"B",turoyo:"\u0161m-i ___",en:"My name is ___",blank:true,type:"typing",hint:"\u0161m-i"},
      {speaker:"A",turoyo:"\u0161afiro! B-\u0161ayno!",en:"Nice! Goodbye!",blank:false},
      {speaker:"B",turoyo:"b-\u0161ayno!",en:"Goodbye!",blank:true,type:"options",options:["b-\u0161ayno!","tawdi","\u0161lomo"]}
    ]
  },
  {
    id:"conv_market",title:"At the Market",titleDe:"Auf dem Markt",
    icon:"\uD83C\uDFEA",difficulty:2,
    turns:[
      {speaker:"A",turoyo:"\u0161lomo! Kmo ko\u0161to u la\u1E25mo?",en:"Hello! How much is the bread?",blank:false},
      {speaker:"B",turoyo:"u la\u1E25mo b-tre euro.",en:"The bread is two euros.",blank:true,type:"options",options:["u la\u1E25mo b-tre euro.","kit basro","tawdi"]},
      {speaker:"A",turoyo:"kitlux basro ste?",en:"Do you also have meat?",blank:false},
      {speaker:"B",turoyo:"ewa, kit basro \u1E6Dowo.",en:"Yes, there is good meat.",blank:true,type:"options",options:["ewa, kit basro \u1E6Dowo.","lo, latl-i","b-\u0161ayno"]},
      {speaker:"A",turoyo:"\u1E25a kilo, b-basimo.",en:"One kilo, please.",blank:false},
      {speaker:"B",turoyo:"tfadal. kulle b-casro euro.",en:"Here you go. All for ten euros.",blank:true,type:"typing",hint:"tfadal"},
      {speaker:"A",turoyo:"tawdi!",en:"Thanks!",blank:false},
      {speaker:"B",turoyo:"tawdi lux. b-\u0161ayno!",en:"Thank you. Goodbye!",blank:false}
    ]
  },
  {
    id:"conv_family",title:"Visiting Family",titleDe:"Familienbesuch",
    icon:"\uD83D\uDC68\u200D\uD83D\uDC69\u200D\uD83D\uDC67\u200D\uD83D\uDC66",difficulty:2,
    turns:[
      {speaker:"A",turoyo:"\u0161lomo, \u1E25ol-i!",en:"Hello, my uncle!",blank:false},
      {speaker:"B",turoyo:"\u0161lomo, abr-i! Aydarbo hat?",en:"Hello, my son! How are you?",blank:true,type:"options",options:["\u0161lomo, abr-i! Aydarbo hat?","tawdi","b-\u0161ayno"]},
      {speaker:"A",turoyo:"\u1E6Dowo-no. I em-i ko d\u00EBr\u0161o \u0161lomo lux.",en:"I'm good. My mother sends greetings.",blank:false},
      {speaker:"B",turoyo:"tawdi. tox, t\u00EB\u1E25 gab-an!",en:"Thanks. Come, sit with us!",blank:true,type:"options",options:["tox, t\u00EB\u1E25 gab-an!","\u0161lomo","lo"]},
      {speaker:"A",turoyo:"tawdi \u0121alabe. elo latl-i zabno.",en:"Thank you very much. But I have no time.",blank:false},
      {speaker:"B",turoyo:"gd \u1E25oze-na \u1E25\u1E0Fo\u1E0Fe ram\u1E25\u00EBl. b-\u0161ayno!",en:"We will see each other tomorrow. Goodbye!",blank:true,type:"typing",hint:"b-\u0161ayno"}
    ]
  },
  {
    id:"conv_book_greet",title:"Slomo \u2014 Meeting",titleDe:"Slomo \u2014 Kennenlernen",
    icon:"\uD83D\uDCDA",difficulty:2,source:"book",
    turns:[
      {speaker:"A",turoyo:"Slomo, ono esmi Afrem yo.",en:"Hello, my name is Afrem.",de:"Hallo, ich heisse Afrem.",blank:false},
      {speaker:"B",turoyo:"B sayno, ono esmi Aday yo.",en:"Hello, my name is Aday.",de:"Hallo, mein Name ist Aday.",blank:true,type:"options",options:["B sayno, ono esmi Aday yo.","Tawdi","Fes be slomo"]},
      {speaker:"A",turoyo:"Aydarbo hatu?",en:"How are you?",de:"Wie geht es euch?",blank:false},
      {speaker:"B",turoyo:"Tawdi, tawwe na.",en:"Thanks, we are fine.",de:"Danke, uns geht es gut.",blank:true,type:"options",options:["Tawdi, tawwe na.","B sayno","Lo"]},
      {speaker:"A",turoyo:"Men kocawdat?",en:"What do you do?",de:"Was arbeitest du?",blank:false},
      {speaker:"B",turoyo:"Komolafno Surayt.",en:"I teach Surayt.",de:"Ich unterrichte Surayt.",blank:true,type:"typing",hint:"Komolaf"},
      {speaker:"A",turoyo:"Galabe tawwo.",en:"Very good.",de:"Sehr gut.",blank:false}
    ]
  },
  {
    id:"conv_book_family",title:"Family Chat",titleDe:"Familiengespräch",
    icon:"\uD83D\uDCDA",difficulty:2,source:"book",
    turns:[
      {speaker:"A",turoyo:"Men yo esma di iqartatxu?",en:"What is your family name?",de:"Wie lautet der Name eurer Familie?",blank:false},
      {speaker:"B",turoyo:"Iqarto d Be Brahem.",en:"Family Be Brahem.",de:"Familie Be Brahem.",blank:true,type:"options",options:["Iqarto d Be Brahem.","Tawdi","Slomo"]},
      {speaker:"A",turoyo:"Kmo ahunone w hotote ketlax?",en:"How many brothers and sisters do you have?",de:"Wie viele Brüder und Schwestern hast du?",blank:false},
      {speaker:"B",turoyo:"Ketli ha ahuno w tarte hotote.",en:"I have one brother and two sisters.",de:"Ich habe einen Bruder und zwei Schwestern.",blank:true,type:"options",options:["Ketli ha ahuno w tarte hotote.","Ketli tre ahunone.","Lo ketli."]},
      {speaker:"A",turoyo:"Mayko kotitu bu serso?",en:"Where do you come from originally?",de:"Woher kommt ihr ursprünglich?",blank:false},
      {speaker:"B",turoyo:"Kotina me Turcabdin.",en:"We come from Tur Abdin.",de:"Wir kommen aus dem Turabdin.",blank:true,type:"typing",hint:"Kotina"}
    ]
  },
  {
    id:"conv_restaurant",title:"At a Restaurant",titleDe:"Im Restaurant",
    icon:"\uD83C\uDF7D\uFE0F",difficulty:3,
    turns:[
      {speaker:"A",turoyo:"\u0161lomo! kit muklo?",en:"Hello! Is there food?",blank:false},
      {speaker:"B",turoyo:"ewa! mu kobcat?",en:"Yes! What do you want?",blank:true,type:"options",options:["ewa! mu kobcat?","lo","tawdi"]},
      {speaker:"A",turoyo:"kit basro u la\u1E25mo?",en:"Is there meat and bread?",blank:false},
      {speaker:"B",turoyo:"ewa, kit. u maye ste?",en:"Yes, there is. Water too?",blank:true,type:"options",options:["ewa, kit. u maye ste?","b-\u0161ayno","lo ko foham-ono"]},
      {speaker:"A",turoyo:"ewa, u \u010Daye ste.",en:"Yes, and tea too.",blank:true,type:"options",options:["ewa, u \u010Daye ste.","lo, tawdi","b-\u0161ayno"]},
      {speaker:"B",turoyo:"tfadal! b-basimo!",en:"Here you go! Enjoy!",blank:false},
      {speaker:"A",turoyo:"tawdi \u0121alabe!",en:"Thank you very much!",blank:true,type:"typing",hint:"tawdi"}
    ]
  }
];

/* Proverb breakdown data for enhanced proverb display */
var PROVERB_DETAILS = [
  {
    latin:"Man d-lo ko yolaf, lo ko yodac.",
    en:"He who does not learn, does not know.",
    de:"Wer nicht lernt, wei\u00DF nicht.",
    words:[
      {w:"Man",m:"who/whoever",g:"relative pronoun"},
      {w:"d-",m:"that/who",g:"relative particle"},
      {w:"lo",m:"not",g:"negation"},
      {w:"ko",m:"(present marker)",g:"habitual prefix"},
      {w:"yolaf",m:"learns",g:"verb, present"},
      {w:"lo",m:"not",g:"negation"},
      {w:"ko",m:"(present marker)",g:"habitual prefix"},
      {w:"yodac",m:"knows",g:"verb, present"}
    ],
    grammar:"VSO structure with ko- present marker. The d- particle introduces relative clauses. Doubled negation (lo...lo) emphasizes the contrast.",
    culture:"Education and knowledge are deeply valued in Suryoyo culture. The Syriac literary tradition spans over 2000 years."
  },
  {
    latin:"U le\u0161ono t\u00EB\u0161toco d-u calmo yo.",
    en:"Language is the key to the world.",
    de:"Die Sprache ist der Schl\u00FCssel zur Welt.",
    words:[
      {w:"U",m:"the (m.)",g:"definite article, masculine"},
      {w:"le\u0161ono",m:"tongue/language",g:"noun, m. Root: l-\u0161-n"},
      {w:"t\u00EB\u0161toco",m:"key",g:"noun"},
      {w:"d-",m:"of",g:"genitive particle"},
      {w:"u",m:"the (m.)",g:"definite article"},
      {w:"calmo",m:"world",g:"noun, m."},
      {w:"yo",m:"is",g:"copula, 3rd sg."}
    ],
    grammar:"Nominal sentence with copula yo (is). The d- particle marks possession (key OF the world). Definite article u- prefixed to masculine nouns.",
    culture:"Reflects the deep Aramean belief in language as identity. For Suryoye in diaspora, preserving Turoyo is preserving their world."
  },
  {
    latin:"Bayto d-lo k\u1E6Fowe, bayto xarbo yo.",
    en:"A house without books is a ruined house.",
    de:"Ein Haus ohne B\u00FCcher ist ein zerst\u00F6rtes Haus.",
    words:[
      {w:"Bayto",m:"house",g:"noun, m. Root: b-y-t"},
      {w:"d-",m:"that/which",g:"relative particle"},
      {w:"lo",m:"not/without",g:"negation"},
      {w:"k\u1E6Fowe",m:"books",g:"noun, pl. Root: k-t-b"},
      {w:"bayto",m:"house",g:"noun, m."},
      {w:"xarbo",m:"ruined/desolate",g:"adjective, m."},
      {w:"yo",m:"is",g:"copula"}
    ],
    grammar:"Relative clause with d-lo (which not = without). Adjective xarbo agrees with masculine noun bayto. Repetition of bayto creates rhetorical emphasis.",
    culture:"The Syriac literary tradition values books enormously. Monasteries in Tur Abdin were centers of manuscript preservation for centuries."
  }
];
