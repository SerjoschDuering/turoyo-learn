/* grammar.js -- Grammar X-ray modal for word analysis */
/* Depends on: WORDS, CATEGORIES from data.js             */
/* Exposes: GrammarXray global object                      */

var ROOTS = {
  "greet_01":{root:"š-l-m",meaning:"peace / wholeness",related:["šlomo","šlomo lux","b-šayno","mšalem"],family:"Shared with Hebrew shalom, Arabic salaam. Proto-Semitic *s-l-m.",pos:"noun",example:"Šlomo! Aydarbo hat? — Hello! How are you?"},
  "greet_02":{root:"š-l-m",meaning:"peace / wholeness",related:["šlomo","b-šayno"],family:"Greeting form: peace + to-you(m). Hebrew shalom lekha.",pos:"phrase",example:"Šlomo lux, aḥ-i! — Peace to you, my brother!"},
  "greet_06":{root:"y-d-c",meaning:"to know / confess",related:["tawdi","tawdiṯo","yodac"],family:"From Classical Syriac tawditha (thanks/confession). Hebrew toda.",pos:"noun",example:"Tawdi ġalabe! — Thank you very much!"},
  "greet_07":{root:"š-y-n",meaning:"peace / tranquility",related:["b-šayno","šayno"],family:"Related to š-l-m root family. Peaceful farewell.",pos:"phrase",example:"B-šayno! Gd ḥoze-na ḥḏoḏe. — Goodbye! We will see each other."},
  "greet_09":{root:"ṭ-w-b",meaning:"good / pleasant",related:["ṭowo","ṭowto","ṭowe"],family:"Cognate: Hebrew tov, Arabic tayyib. Core Semitic root.",pos:"adjective",example:"Ṭowo-no, tawdi. — I am fine, thanks."},
  "fam_01":{root:"b-b",meaning:"father",related:["babo","babuno","bab-i"],family:"Common Semitic: Hebrew abba, Arabic abu. One of the oldest words.",pos:"noun (m.)",example:"U bab-i ko šoġël b-u bayto. — My father works at home."},
  "fam_02":{root:"ʾ-m",meaning:"mother",related:["emo","em-i","emoṯe"],family:"Cognate: Hebrew em, Arabic umm. Universal Semitic root.",pos:"noun (f.)",example:"I em-i ko ṭabxo muklo. — My mother cooks food."},
  "fam_03":{root:"b-r",meaning:"son / child",related:["abro","barṯo","brone"],family:"Hebrew ben, Arabic ibn. Proto-Semitic *bin-.",pos:"noun (m.)",example:"Hano abr-i yo. — This is my son."},
  "fam_04":{root:"b-r-t",meaning:"daughter",related:["barṯo","abro","bnoṯe"],family:"Feminine of b-r (son). Hebrew bat, Arabic bint.",pos:"noun (f.)",example:"I barṯ-i b-u madrašto yo. — My daughter is at school."},
  "fam_05":{root:"ʾ-ḥ",meaning:"brother",related:["aḥuno","aḥunone","aḥ-i"],family:"Cognate: Hebrew aḥ, Arabic akh. Pan-Semitic kinship term.",pos:"noun (m.)",example:"Kitl-i tre aḥunone. — I have two brothers."},
  "fam_06":{root:"ḥ-t",meaning:"sister",related:["ḥoṯo","ḥoṯoṯe"],family:"Hebrew aḥot, Arabic ukht. Feminine counterpart to ʾ-ḥ.",pos:"noun (f.)",example:"I ḥoṯ-i b-Almanya yo. — My sister is in Germany."},
  "fam_07":{root:"g-w-r",meaning:"man / husband",related:["gawro","gawrone"],family:"Classical Syriac gaḇra. Aramaic root for adult male.",pos:"noun (m.)",example:"U gawro ko šoġël. — The man is working."},
  "fam_08":{root:"ʾ-n-t",meaning:"woman / wife",related:["aṯto","aṯṯoṯe"],family:"Hebrew isha (different root), Arabic imra'a. Ancient Aramaic form.",pos:"noun (f.)",example:"I aṯto šafirto yo. — The woman is beautiful."},
  "food_01":{root:"l-ḥ-m",meaning:"bread / food",related:["laḥmo","laḥme"],family:"Hebrew leḥem, Arabic laḥm (meat). Semantic shift: bread vs meat.",pos:"noun (m.)",example:"Ḥa laḥmo, b-basimo. — One bread, please."},
  "food_02":{root:"m-y",meaning:"water",related:["maye","mayyo"],family:"Hebrew mayim, Arabic ma'. Always plural in Semitic languages.",pos:"noun (m.pl.)",example:"Kit maye? — Is there water?"},
  "food_06":{root:"ḥ-m-r",meaning:"wine / ferment",related:["ḥamro","ḥamre"],family:"Hebrew ḥemer/yayin, Arabic khamr. Shared fermentation root.",pos:"noun (m.)",example:"U ḥamro ṭowo yo. — The wine is good."},
  "food_08":{root:"m-l-ḥ",meaning:"salt",related:["melḥo","malëḥ"],family:"Hebrew melaḥ, Arabic milḥ. Universally Semitic.",pos:"noun (m.)",example:"Latl-i melḥo. — I have no salt."},
  "body_01":{root:"r-š",meaning:"head / top / chief",related:["rišo","riše","rišono"],family:"Hebrew rosh, Arabic ra's. Also means chief/first.",pos:"noun (m.)",example:"U rišo ko koʾew-li. — My head hurts."},
  "body_02":{root:"c-y-n",meaning:"eye / spring",related:["cayno","cayne"],family:"Hebrew ayin, Arabic ayn. Double meaning: eye + water spring.",pos:"noun (f.)",example:"I cayno d-u yolufo. — The eye of the student."},
  "body_04":{root:"l-š-n",meaning:"tongue / language",related:["lešono","lešone"],family:"Hebrew lashon, Arabic lisan. Tongue = language in all Semitic.",pos:"noun (m.)",example:"U lešono d-emoṯe. — The mother tongue."},
  "body_06":{root:"l-b-b",meaning:"heart / core",related:["lebo","lebi"],family:"Hebrew lev/levav, Arabic lubb. Emotional and physical center.",pos:"noun (m.)",example:"Latl-i lebo. — I have no heart (not in the mood)."},
  "nat_01":{root:"š-m-š",meaning:"sun / serve",related:["šëmšo","šamošo"],family:"Hebrew shemesh, Arabic shams. Also root for deacon/servant.",pos:"noun (f.)",example:"I šëmšo ko noflo. — The sun is setting."},
  "nat_02":{root:"s-h-r",meaning:"moon / crescent",related:["sahro","sahre"],family:"Hebrew sahar, Arabic qamar (different root). Crescent imagery.",pos:"noun (m.)",example:"U sahro b-u šmayo yo. — The moon is in the sky."},
  "nat_06":{root:"b-y-t",meaning:"house / inside",related:["bayto","bote","bayṯoyo"],family:"Hebrew bayit, Arabic bayt. One of the most stable Semitic words.",pos:"noun (m.)",example:"U bayto d-lo kṯowe, bayto xarbo yo. — A house without books is a ruin."},
  "nat_10":{root:"k-t-b",meaning:"to write",related:["kṯowo","koṯaw","kṯowoyo"],family:"Hebrew katav, Arabic kataba. The writing root across all Semitic.",pos:"noun (m.)",example:"Ko qore-no u kṯowo. — I am reading the book."}
};

var GrammarXray = {
  _overlay: null,

  init: function() {
    document.addEventListener('click', function(e) {
      var el = e.target.closest('[data-word-id]');
      if (el) {
        e.preventDefault();
        GrammarXray.show(el.getAttribute('data-word-id'));
      }
    });
  },

  _getWord: function(wordId) {
    return WORDS.find(function(w) { return w.id === wordId; });
  },

  _buildGender: function(word) {
    if (!word.gender) return '';
    var g = word.gender === 'm' ? 'Masculine' : 'Feminine';
    var icon = word.gender === 'm' ? 'M' : 'F';
    return '<span class="gx-gender gx-gender-' + word.gender + '">' + icon + ' ' + g + '</span>';
  },

  _buildRelated: function(rootInfo) {
    if (!rootInfo || !rootInfo.related) return '';
    var chips = rootInfo.related.map(function(w) {
      return '<span class="gx-chip">' + w + '</span>';
    }).join('');
    return '<div class="gx-section"><h4>Related Words</h4>' +
      '<div class="gx-related">' + chips + '</div></div>';
  },

  show: function(wordId) {
    var word = this._getWord(wordId);
    if (!word) return;
    var rootInfo = ROOTS[wordId] || null;
    var cat = CATEGORIES[word.cat] || {};
    this.close();

    var overlay = document.createElement('div');
    overlay.className = 'gx-overlay';
    overlay.setAttribute('role', 'dialog');

    var modal = document.createElement('div');
    modal.className = 'gx-modal';

    /* Header */
    var html = '<button class="gx-close" aria-label="Close">&times;</button>';
    html += '<div class="gx-header">';
    html += '<div class="serto gx-serto">' + (word.serto || '') + '</div>';
    html += '<div class="gx-latin">' + word.latin + '</div>';
    html += '<div class="gx-en">' + word.en + '</div>';
    if (word.de) html += '<div class="gx-de">' + word.de + '</div>';
    html += '</div>';

    /* Category + Gender */
    html += '<div class="gx-meta">';
    if (cat.name) {
      html += '<span class="gx-cat" style="background:' + (cat.color || 'var(--text3)') + '">';
      html += (cat.icon || '') + ' ' + cat.name + '</span>';
    }
    html += this._buildGender(word);
    if (rootInfo && rootInfo.pos) {
      html += '<span class="gx-pos">' + rootInfo.pos + '</span>';
    }
    html += '</div>';

    /* Root analysis */
    if (rootInfo) {
      html += '<div class="gx-section gx-root-section">';
      html += '<h4>Semitic Root</h4>';
      html += '<div class="gx-root"><span class="gx-root-letters">' + rootInfo.root + '</span>';
      html += '<span class="gx-root-meaning">"' + rootInfo.meaning + '"</span></div>';
      html += '</div>';
      html += this._buildRelated(rootInfo);

      if (rootInfo.family) {
        html += '<div class="gx-section"><h4>Language Family</h4>';
        html += '<p class="gx-family">' + rootInfo.family + '</p></div>';
      }
      if (rootInfo.example) {
        html += '<div class="gx-section"><h4>Usage Example</h4>';
        html += '<p class="gx-example">' + rootInfo.example + '</p></div>';
      }
    }

    /* Note from data */
    if (word.note) {
      html += '<div class="gx-section"><h4>Note</h4>';
      html += '<p class="gx-note">' + word.note + '</p></div>';
    }

    modal.innerHTML = html;
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    this._overlay = overlay;

    /* Trigger animation */
    requestAnimationFrame(function() {
      overlay.classList.add('gx-active');
    });

    /* Close handlers */
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) GrammarXray.close();
    });
    modal.querySelector('.gx-close').addEventListener('click', function() {
      GrammarXray.close();
    });
    document.addEventListener('keydown', this._escHandler);
  },

  _escHandler: function(e) {
    if (e.key === 'Escape') GrammarXray.close();
  },

  close: function() {
    if (!this._overlay) return;
    var ov = this._overlay;
    ov.classList.remove('gx-active');
    ov.classList.add('gx-closing');
    setTimeout(function() {
      if (ov.parentNode) ov.parentNode.removeChild(ov);
    }, 300);
    this._overlay = null;
    document.removeEventListener('keydown', this._escHandler);
  },

  /* Utility: get root info for any word */
  getRoot: function(wordId) {
    return ROOTS[wordId] || null;
  },

  /* Utility: get all words sharing a root */
  getFamily: function(rootStr) {
    var ids = [];
    for (var k in ROOTS) {
      if (ROOTS[k].root === rootStr) ids.push(k);
    }
    return ids.map(function(id) {
      return GrammarXray._getWord(id);
    }).filter(Boolean);
  }
};
