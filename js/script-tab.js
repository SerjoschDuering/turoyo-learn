/* script-tab.js -- Serto Script Explorer tab */
/* Depends on: ALPHABET from data-alphabet.js */
/* Exposes: ScriptTab global object           */

var ScriptTab = (function() {
  var page = null;
  var selectedIdx = -1;

  function init() {
    page = document.getElementById('page-script');
    if (!page || typeof ALPHABET === 'undefined') return;
    renderExplorer('all');
  }

  function renderExplorer(group) {
    var filtered = group === 'all' ? ALPHABET :
      ALPHABET.filter(function(a) { return a.group === group; });
    var lang = (typeof T !== 'undefined') ? T.key() : 'en';

    var tabs = '<div class="st-tabs">' +
      '<button class="st-tab' + (group === 'all' ? ' active' : '') +
        '" onclick="ScriptTab.filter(\'all\')">All</button>' +
      '<button class="st-tab' + (group === 'connect-both' ? ' active' : '') +
        '" onclick="ScriptTab.filter(\'connect-both\')">Both-connect</button>' +
      '<button class="st-tab' + (group === 'connect-right' ? ' active' : '') +
        '" onclick="ScriptTab.filter(\'connect-right\')">Right-only</button>' +
    '</div>';

    var grid = '<div class="st-grid">';
    for (var i = 0; i < filtered.length; i++) {
      var a = filtered[i];
      var realIdx = ALPHABET.indexOf(a);
      grid += '<div class="st-cell' + (realIdx === selectedIdx ? ' st-selected' : '') +
        '" data-idx="' + realIdx + '">' +
        '<div class="st-serto">' + a.serto + '</div>' +
        '<div class="st-latin">' + a.latin.charAt(0) + '</div>' +
      '</div>';
    }
    grid += '</div>';

    var detail = selectedIdx >= 0 ? renderDetail(ALPHABET[selectedIdx], lang) : '';

    var info = '<div class="st-info-bar">' +
      '<span class="st-info-tag st-tag-both">Both-connect: ' +
        ALPHABET.filter(function(a) { return a.group === 'connect-both'; }).length + '</span>' +
      '<span class="st-info-tag st-tag-right">Right-only: ' +
        ALPHABET.filter(function(a) { return a.group === 'connect-right'; }).length + '</span>' +
    '</div>';

    page.innerHTML = '<div class="st-explorer">' +
      '<div class="st-header">' +
        '<h2>Serto Script</h2>' +
        '<p class="st-sub">Learn the Aramean alphabet</p>' +
      '</div>' + info + tabs + grid + detail +
      '<div class="st-quiz-cta card" id="st-quiz-cta">' +
        '<h3>Test Yourself</h3>' +
        '<p>Can you recognize the letters?</p>' +
        '<button class="btn btn-primary" onclick="ScriptTab.startQuiz()">' +
          'Letter Quiz</button>' +
      '</div>' +
    '</div>';

    page.querySelectorAll('.st-cell').forEach(function(el) {
      el.addEventListener('click', function() {
        selectedIdx = parseInt(el.getAttribute('data-idx'));
        renderExplorer(group);
      });
    });
  }

  function renderDetail(a, lang) {
    var connect = a.group === 'connect-both'
      ? 'Connects in both directions' : 'Connects only to the right';
    var exHtml = '';
    if (a.examples) {
      for (var i = 0; i < a.examples.length; i++) {
        var e = a.examples[i];
        var meaning = lang === 'de' ? (e.de || e.en) : (e.en || e.de);
        exHtml += '<div class="st-example">' +
          '<span class="st-ex-serto serto">' + e.serto + '</span>' +
          '<span class="st-ex-latin">' + e.word + '</span>' +
          '<span class="st-ex-meaning">' + meaning + '</span>' +
        '</div>';
      }
    }
    return '<div class="st-detail card">' +
      '<div class="st-detail-top">' +
        '<div class="st-detail-serto serto">' + a.serto + '</div>' +
        '<div class="st-detail-info">' +
          '<h3>' + a.name + ' \u2014 ' + a.latin + '</h3>' +
          '<p>Sound: /' + a.sound + '/</p>' +
          '<p class="st-connect-info">' + connect + '</p>' +
          (a.note ? '<p class="st-note">' + a.note + '</p>' : '') +
        '</div>' +
      '</div>' +
      '<div class="st-forms">' +
        '<div class="st-form"><div class="st-form-label">Isolated</div>' +
          '<div class="st-form-char serto">' + a.forms.isolated + '</div></div>' +
        '<div class="st-form"><div class="st-form-label">Initial</div>' +
          '<div class="st-form-char serto">...' + a.forms.initial + '</div></div>' +
        '<div class="st-form"><div class="st-form-label">Final</div>' +
          '<div class="st-form-char serto">' + a.forms.final + '...</div></div>' +
      '</div>' +
      (exHtml ? '<div class="st-examples"><h4>Example words</h4>' + exHtml + '</div>' : '') +
    '</div>';
  }

  /* === Letter Quiz === */
  function startQuiz() {
    if (!ALPHABET || ALPHABET.length < 4) return;
    var pool = ALPHABET.slice();
    var questions = shuffle(pool).slice(0, 8);
    var qIdx = 0, score = 0;

    function showQ() {
      if (qIdx >= questions.length) { finishQuiz(score, questions.length); return; }
      var q = questions[qIdx];
      var distractors = shuffle(pool.filter(function(a) {
        return a.id !== q.id;
      })).slice(0, 3).map(function(a) { return a.name; });
      var opts = shuffle([q.name].concat(distractors));
      var answered = false;

      page.innerHTML = '<div class="st-quiz">' +
        '<div class="st-quiz-header">' +
          '<button class="va-close-btn" id="st-quiz-close">&times;</button>' +
          '<div class="progress-bar" style="flex:1"><div class="progress-fill" ' +
            'style="width:' + ((qIdx / questions.length) * 100) + '%;background:var(--green)"></div></div>' +
          '<span class="va-q-count">' + (qIdx + 1) + '/' + questions.length + '</span>' +
        '</div>' +
        '<div class="card" style="text-align:center;padding:32px 20px">' +
          '<p class="st-quiz-prompt">What letter is this?</p>' +
          '<div class="serto" style="font-size:4rem;margin:16px 0">' + q.serto + '</div>' +
        '</div>' +
        '<div class="options">' +
          opts.map(function(o, i) {
            return '<button class="option-btn" data-idx="' + i + '">' + o + '</button>';
          }).join('') +
        '</div>' +
        '<div id="st-quiz-fb"></div>' +
      '</div>';

      page.querySelector('#st-quiz-close').addEventListener('click', function() {
        selectedIdx = -1; renderExplorer('all');
      });
      page.querySelectorAll('.option-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
          if (answered) return;
          answered = true;
          var chosen = opts[parseInt(btn.getAttribute('data-idx'))];
          var ok = chosen === q.name;
          if (ok) score++;
          page.querySelectorAll('.option-btn').forEach(function(b, j) {
            b.classList.add('disabled');
            if (opts[j] === q.name) b.classList.add('correct');
            if (b === btn && !ok) b.classList.add('wrong');
          });
          if (typeof VFX !== 'undefined') VFX.screenFlash(ok ? 'green' : 'red');
          var fb = page.querySelector('#st-quiz-fb');
          fb.innerHTML = ok
            ? '<div class="feedback ok">' + q.name + ' \u2014 /' + q.sound + '/</div>'
            : '<div class="feedback no">That\'s ' + q.name + ' (/' + q.sound + '/)</div>';
          setTimeout(function() { qIdx++; showQ(); }, 1200);
        });
      });
    }
    showQ();
  }

  function finishQuiz(score, total) {
    var pct = Math.round((score / total) * 100);
    if (typeof VFX !== 'undefined') VFX.spawnConfetti(pct === 100 ? 30 : 12, 30);
    page.innerHTML = '<div class="st-quiz-finish">' +
      '<div class="card" style="text-align:center;padding:32px 20px">' +
        '<div style="font-size:3rem;margin-bottom:12px">' +
          (pct === 100 ? '\uD83C\uDFC6' : pct >= 60 ? '\u2B50' : '\uD83D\uDCAA') + '</div>' +
        '<h2>' + (pct === 100 ? 'Perfect!' : pct >= 60 ? 'Great job!' : 'Keep practicing!') + '</h2>' +
        '<div class="stat-row">' +
          '<div class="stat"><div class="num" style="color:var(--green)">' + score + '/' + total + '</div>' +
            '<div class="label">Correct</div></div>' +
          '<div class="stat"><div class="num">' + pct + '%</div>' +
            '<div class="label">Score</div></div>' +
        '</div>' +
      '</div>' +
      '<button class="btn btn-primary" style="margin-top:20px" ' +
        'onclick="ScriptTab.init()">Back to Script</button>' +
    '</div>';
  }

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  return {
    init: init,
    filter: function(g) { renderExplorer(g); },
    startQuiz: startQuiz
  };
})();
