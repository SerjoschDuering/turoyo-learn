/* data-loader.js -- Bridge between API content and global data vars */
/* Depends on: api.js, data.js, data-alphabet.js, data-phrases.js, conv-data.js */
/* Tries API first, falls back to built-in JS data. Zero changes to consumers. */

var DataLoader = (function () {
  'use strict';

  var TAG = '[DataLoader]';

  /* ---- Field mappers ---- */

  function mapWords(rows) {
    return rows.map(function (r) {
      var w = {
        id: r.word_id, latin: r.latin, serto: r.serto || '',
        en: r.en || '', de: r.de || '', cat: (r.category || '').toLowerCase(),
        note: r.note || ''
      };
      if (r.gender) w.gender = r.gender;
      return w;
    });
  }

  function rebuildCategories(words) {
    var cats = {};
    var meta = {
      greetings: { name: 'Greetings', de: 'Begrüßungen', icon: '\uD83D\uDC4B', color: '#58CC02' },
      family:    { name: 'Family', de: 'Familie', icon: '\uD83D\uDC68\u200D\uD83D\uDC69\u200D\uD83D\uDC67\u200D\uD83D\uDC66', color: '#E8A317' },
      food:      { name: 'Food & Drink', de: 'Essen & Trinken', icon: '\uD83C\uDF5E', color: '#D33131' },
      body:      { name: 'Body', de: 'Körper', icon: '\uD83E\uDEC0', color: '#8549BA' },
      nature:    { name: 'Nature & Time', de: 'Natur & Zeit', icon: '\u2600\uFE0F', color: '#1CB0F6' },
      house:     { name: 'Home', de: 'Zuhause', icon: '\uD83C\uDFE0', color: '#F49000' },
      animals:   { name: 'Animals', de: 'Tiere', icon: '\uD83D\uDC15', color: '#89E219' },
      numbers:   { name: 'Numbers', de: 'Zahlen', icon: '\uD83D\uDD22', color: '#4A6FA5' },
      grammar:   { name: 'Grammar', de: 'Grammatik', icon: '\uD83E\uDDE9', color: '#CE82FF' }
    };
    words.forEach(function (w) {
      if (w.cat && !cats[w.cat]) cats[w.cat] = meta[w.cat] || { name: w.cat, de: w.cat, icon: '\uD83D\uDCCC', color: '#999' };
    });
    return cats;
  }

  function mapAlphabet(rows) {
    return rows.map(function (r) {
      var ex;
      try { ex = typeof r.examples === 'string' ? JSON.parse(r.examples) : (r.examples || []); }
      catch (e) { ex = []; }
      return {
        id: r.letter_id, serto: r.letter || '', name: r.name || '',
        latin: r.latin || '', sound: r.sound || '', group: r.group || '',
        note: r.note || '',
        forms: {
          isolated: r.form_isolated || '', initial: r.form_initial || '',
          medial: r.form_medial || '', final: r.form_final || ''
        },
        examples: ex
      };
    });
  }

  function mapPhrases(rows) {
    return rows.map(function (r) {
      var words = typeof r.turoyo_words === 'string'
        ? r.turoyo_words.split('|').map(function (s) { return s.trim(); })
        : (r.turoyo_words || []);
      return {
        id: r.phrase_id, turoyo: words,
        en: r.en || '', de: r.de || '',
        cat: (r.category || '').toLowerCase()
      };
    });
  }

  function mapConversations(rows) {
    var groups = {};
    rows.sort(function (a, b) { return (a.turn_order || 0) - (b.turn_order || 0); });
    rows.forEach(function (r) {
      var cid = r.conv_id;
      if (!groups[cid]) {
        groups[cid] = {
          id: cid, title: r.conv_title || cid,
          titleDe: r.conv_title_de || r.conv_title || cid,
          icon: r.icon || '\uD83D\uDCAC',
          difficulty: r.difficulty || 1,
          turns: []
        };
      }
      var turn = {
        speaker: r.speaker || 'A',
        turoyo: r.turoyo || '', en: r.en || '', de: r.de || '',
        blank: !!(r.is_exercise)
      };
      if (r.is_exercise) {
        turn.type = r.exercise_type || 'options';
        if (r.options) {
          try {
            turn.options = typeof r.options === 'string' ? JSON.parse(r.options) : r.options;
          } catch (e) {
            turn.options = r.options.split('|').map(function (s) { return s.trim(); });
          }
        }
        if (r.hint) turn.hint = r.hint;
      }
      groups[cid].turns.push(turn);
    });
    return Object.values(groups);
  }

  function mapProverbs(rows) {
    var proverbs = [];
    var details = [];
    rows.forEach(function (r) {
      proverbs.push({ latin: r.latin || '', en: r.en || '', de: r.de || '' });
      var words;
      try { words = typeof r.word_breakdown === 'string' ? JSON.parse(r.word_breakdown) : (r.word_breakdown || []); }
      catch (e) { words = []; }
      details.push({
        latin: r.latin || '', en: r.en || '', de: r.de || '',
        words: words,
        grammar: r.grammar_note || '',
        culture: r.culture_note || ''
      });
    });
    return { proverbs: proverbs, details: details };
  }

  /* ---- Main init ---- */

  function init() {
    return API.fetchContent().then(function (data) {
      if (!data || !data.words || !data.words.length) {
        console.log(TAG, 'No API data, using built-in data');
        return;
      }

      // Splice API data into globals
      if (data.words) {
        var mapped = mapWords(data.words);
        WORDS.length = 0;
        mapped.forEach(function (w) { WORDS.push(w); });
        var newCats = rebuildCategories(WORDS);
        // Merge — keep existing for icons/colors, add new ones
        Object.keys(newCats).forEach(function (k) {
          if (!CATEGORIES[k]) CATEGORIES[k] = newCats[k];
        });
      }

      if (data.alphabet && data.alphabet.length) {
        var letters = mapAlphabet(data.alphabet);
        ALPHABET.length = 0;
        letters.forEach(function (l) { ALPHABET.push(l); });
      }

      if (data.phrases && data.phrases.length) {
        var phrases = mapPhrases(data.phrases);
        PHRASES.length = 0;
        phrases.forEach(function (p) { PHRASES.push(p); });
      }

      if (data.conversations && data.conversations.length) {
        var convs = mapConversations(data.conversations);
        CONV_SCRIPTS.length = 0;
        convs.forEach(function (c) { CONV_SCRIPTS.push(c); });
      }

      if (data.proverbs && data.proverbs.length) {
        var prov = mapProverbs(data.proverbs);
        PROVERBS.length = 0;
        prov.proverbs.forEach(function (p) { PROVERBS.push(p); });
        PROVERB_DETAILS.length = 0;
        prov.details.forEach(function (d) { PROVERB_DETAILS.push(d); });
      }

      console.log(TAG, 'API data loaded:', WORDS.length, 'words,',
        ALPHABET.length, 'letters,', PHRASES.length, 'phrases,',
        CONV_SCRIPTS.length, 'conversations');

    }).catch(function (err) {
      console.log(TAG, 'API unavailable, using built-in data:', err.message || err);
    });
  }

  return { init: init };
})();
