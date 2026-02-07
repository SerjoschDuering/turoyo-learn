/* exercise-types.js -- New exercise renderers. Depends on: WORDS, VFX */
var ExerciseTypes = (function() {
  var DMAP = {'\u1E6D':'t','\u1E24':'h','\u0161':'s','\u1E0D':'d','\u011F':'g',
    '\u1E63':'s','\u1E25':'h','\u021B':'t','\u0103':'a','\u00E7':'c','\u1E93':'z','\u0121':'g'};

  function norm(s) {
    return s.trim().toLowerCase().replace(/\s+/g,' ').split('').map(function(c) {
      return DMAP[c] || DMAP[c.toLowerCase()] || c;
    }).join('');
  }

  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function pick(a, n) { return shuffle(a).slice(0, n); }
  function seededRand(s) { var x = Math.sin(s) * 10000; return x - Math.floor(x); }
  function todaySeed() { var d = new Date(); return d.getFullYear() * 10000 + (d.getMonth()+1) * 100 + d.getDate(); }

  /* === TYPING === */
  function typing(exercise, ctn, done) {
    var w = exercise.word;
    ctn.innerHTML = '<div class="ex-typing">' +
      '<p class="ex-typing-question">Type the Latin transliteration</p>' +
      '<div class="ex-typing-prompt serto">' + w.serto + '</div>' +
      '<div class="ex-typing-meaning">' + w.en + '</div>' +
      '<input type="text" class="ex-typing-input" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Type here...">' +
      '<button class="btn btn-primary ex-typing-submit">Check</button>' +
      '<div class="ex-typing-feedback"></div></div>';
    var inp = ctn.querySelector('.ex-typing-input'), btn = ctn.querySelector('.ex-typing-submit');
    var fb = ctn.querySelector('.ex-typing-feedback'), ans = false;
    setTimeout(function() { inp.focus(); }, 100);
    function submit() {
      if (ans || !inp.value.trim()) return;
      ans = true; inp.disabled = btn.disabled = true;
      var ok = norm(inp.value) === norm(w.latin);
      fb.innerHTML = ok ? '<div class="feedback ok va-fb-pop">Correct!</div>'
        : '<div class="feedback no va-fb-shake">Answer: <strong>' + w.latin + '</strong></div>';
      VFX.screenFlash(ok ? 'green' : 'red');
      setTimeout(function() { done({correct:ok, answer:w.latin}); }, 1200);
    }
    btn.addEventListener('click', submit);
    inp.addEventListener('keydown', function(e) { if (e.key === 'Enter') submit(); });
  }

  /* === MATCH PAIRS === */
  function matchPairs(words, ctn, done) {
    var pairs = words.slice(0, 4);
    var left = shuffle(pairs.map(function(w) { return {text:w.serto, id:w.id}; }));
    var right = shuffle(pairs.map(function(w) { return {text:w.en, id:w.id}; }));
    var matched = 0, correct = 0, selL = null, selR = null;
    ctn.innerHTML = '<div class="ex-match"><p class="ex-match-title">Match the pairs</p>' +
      '<div class="ex-match-columns"><div class="ex-match-col ex-match-left">' +
      left.map(function(it) { return '<button class="ex-match-item serto" data-side="left" data-id="'+it.id+'">'+it.text+'</button>'; }).join('') +
      '</div><div class="ex-match-col ex-match-right">' +
      right.map(function(it) { return '<button class="ex-match-item" data-side="right" data-id="'+it.id+'">'+it.text+'</button>'; }).join('') +
      '</div></div></div>';
    ctn.querySelectorAll('.ex-match-item').forEach(function(b) {
      b.addEventListener('click', function() {
        if (b.classList.contains('ex-match-done')) return;
        if (b.dataset.side === 'left') {
          if (selL) selL.classList.remove('ex-match-selected');
          selL = b; b.classList.add('ex-match-selected');
        } else {
          if (selR) selR.classList.remove('ex-match-selected');
          selR = b; b.classList.add('ex-match-selected');
        }
        if (selL && selR) tryM();
      });
    });
    function tryM() {
      if (selL.dataset.id === selR.dataset.id) {
        correct++; matched++;
        selL.classList.add('ex-match-done'); selR.classList.add('ex-match-done');
        selL.classList.remove('ex-match-selected'); selR.classList.remove('ex-match-selected');
        VFX.screenFlash('green');
      } else {
        selL.classList.add('ex-match-wrong'); selR.classList.add('ex-match-wrong');
        VFX.screenFlash('red');
        var a = selL, b = selR;
        setTimeout(function() { a.classList.remove('ex-match-wrong','ex-match-selected'); b.classList.remove('ex-match-wrong','ex-match-selected'); }, 500);
      }
      selL = selR = null;
      if (matched >= pairs.length) setTimeout(function() { done({correct:correct, total:pairs.length}); }, 600);
    }
  }

  /* === SENTENCE BUILDER === */
  function sentenceBuilder(phrase, ctn, done) {
    var order = phrase.turoyo, scrambled = shuffle(order.slice()), placed = [], ans = false;
    ctn.innerHTML = '<div class="ex-sentence"><p class="ex-sentence-hint">'+phrase.en+'</p>' +
      '<div class="ex-sentence-answer"></div><div class="ex-sentence-bank"></div>' +
      '<button class="btn btn-primary ex-sentence-check" disabled>Check</button>' +
      '<div class="ex-sentence-feedback"></div></div>';
    var area = ctn.querySelector('.ex-sentence-answer'), bank = ctn.querySelector('.ex-sentence-bank');
    var chk = ctn.querySelector('.ex-sentence-check'), fb = ctn.querySelector('.ex-sentence-feedback');
    function render() {
      bank.innerHTML = ''; area.innerHTML = '';
      scrambled.forEach(function(w, i) {
        if (placed.indexOf(i) === -1) {
          var t = document.createElement('button'); t.className = 'ex-sentence-tile'; t.textContent = w;
          t.addEventListener('click', function() { placed.push(i); render(); }); bank.appendChild(t);
        }
      });
      placed.forEach(function(si, pi) {
        var t = document.createElement('button'); t.className = 'ex-sentence-tile ex-sentence-placed';
        t.textContent = scrambled[si];
        t.addEventListener('click', function() { if (!ans) { placed.splice(pi, 1); render(); } });
        area.appendChild(t);
      });
      chk.disabled = placed.length !== scrambled.length || ans;
      if (!placed.length) { var p = document.createElement('span'); p.className = 'ex-sentence-placeholder'; p.textContent = 'Tap words to build the sentence'; area.appendChild(p); }
    }
    render();
    chk.addEventListener('click', function() {
      if (ans) return; ans = true;
      var user = placed.map(function(i) { return scrambled[i]; }), ok = user.join(' ') === order.join(' ');
      fb.innerHTML = ok ? '<div class="feedback ok va-fb-pop">Correct!</div>'
        : '<div class="feedback no va-fb-shake">Correct order: <strong>'+order.join(' ')+'</strong></div>';
      VFX.screenFlash(ok ? 'green' : 'red');
      if (ok) VFX.spawnConfetti(12, 40);
      chk.disabled = true;
      setTimeout(function() { done({correct:ok}); }, 1200);
    });
  }

  /* === DAILY CHALLENGE === */
  function dailyChallenge(ctn, onComplete) {
    var seed = todaySeed(), cw = [];
    for (var i = 0; i < 3; i++) cw.push(WORDS[Math.floor(seededRand(seed + i) * WORDS.length)]);
    var types = ['mc','typing','match'], step = 0, score = 0;

    function advance(ok) { if (ok) score++; step++; step >= 3 ? finish() : renderStep(); }

    function renderStep() {
      var tp = types[step % 3];
      ctn.innerHTML = '<div class="ex-daily"><div class="ex-daily-header">' +
        '<span class="ex-daily-badge">Daily Challenge</span><span class="ex-daily-step">'+(step+1)+'/3</span>' +
        '</div><div class="ex-daily-multiplier">3x XP</div><div class="ex-daily-body"></div></div>';
      var body = ctn.querySelector('.ex-daily-body');
      if (tp === 'typing') { typing({word:cw[step]}, body, function(r) { advance(r.correct); }); }
      else if (tp === 'match' && WORDS.length >= 4) { matchPairs(pick(WORDS, 4), body, function(r) { advance(r.correct === r.total); }); }
      else { renderMC(cw[step], body, advance); }
    }

    function renderMC(word, body, cb) {
      var pool = WORDS.filter(function(w) { return w.cat === word.cat; });
      if (pool.length < 4) pool = WORDS;
      var dist = shuffle(pool.filter(function(w) { return w.id !== word.id; })).slice(0,3).map(function(w) { return w.en; });
      var opts = shuffle([word.en].concat(dist)), answered = false;
      body.innerHTML = '<div class="card va-exercise-card"><p class="va-question">What does this mean?</p>' +
        '<div class="va-prompt serto">'+word.serto+'</div></div><div class="options">' +
        opts.map(function(o,i) { return '<button class="option-btn" data-idx="'+i+'">'+o+'</button>'; }).join('')+'</div>';
      body.querySelectorAll('.option-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
          if (answered) return; answered = true;
          var ok = opts[parseInt(btn.dataset.idx,10)] === word.en;
          body.querySelectorAll('.option-btn').forEach(function(b,j) {
            b.classList.add('disabled');
            if (opts[j] === word.en) b.classList.add('correct');
            if (b === btn && !ok) b.classList.add('wrong');
          });
          VFX.screenFlash(ok ? 'green' : 'red');
          setTimeout(function() { cb(ok); }, 1200);
        });
      });
    }

    function finish() {
      var today = new Date().toISOString().slice(0,10);
      localStorage.setItem('turoyo_a_daily_' + today, '1');
      var earned = score * 30;
      VFX.spawnConfetti(30, 20);
      ctn.innerHTML = '<div class="ex-daily"><div class="ex-daily-header">' +
        '<span class="ex-daily-badge">Daily Challenge Complete!</span></div>' +
        '<div class="card" style="text-align:center;padding:24px"><h1 style="color:var(--gold)">'+score+'/3</h1>' +
        '<p style="color:var(--text2);margin:8px 0">+'+earned+' XP (3x bonus)</p></div>' +
        '<button class="btn btn-primary ex-daily-done">Continue</button></div>';
      ctn.querySelector('.ex-daily-done').addEventListener('click', function() { onComplete({score:score, xp:earned}); });
    }
    renderStep();
  }

  return { typing:typing, matchPairs:matchPairs, sentenceBuilder:sentenceBuilder, dailyChallenge:dailyChallenge };
})();
