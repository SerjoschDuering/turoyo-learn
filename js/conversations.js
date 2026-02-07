/* conversations.js -- Conversation mini-exercises & enhanced proverbs */
/* Depends on: WORDS, PROVERBS from data.js                            */
/* Depends on: CONV_SCRIPTS, PROVERB_DETAILS from conv-data.js         */
/* Exposes: ConversationMode global object                             */

var ConversationMode = {
  _container: null,
  _convState: null,
  LS_DONE: 'turoyo_conv_done',
  LS_PROV: 'turoyo_prov_seen',

  _getDone: function() {
    try { return JSON.parse(localStorage.getItem(this.LS_DONE)) || []; }
    catch(e) { return []; }
  },
  _saveDone: function(arr) { localStorage.setItem(this.LS_DONE, JSON.stringify(arr)); },

  init: function(container) {
    this._container = container;
    container.innerHTML = '';
    var h = '<h2 style="margin-bottom:4px">Conversations</h2>';
    h += '<p style="color:var(--text2);font-size:.9rem;margin-bottom:16px">';
    h += 'Practice real dialogues</p>';
    h += '<div class="conv-grid">';
    var done = this._getDone();
    for (var i = 0; i < CONV_SCRIPTS.length; i++) {
      var c = CONV_SCRIPTS[i];
      var isDone = done.indexOf(c.id) !== -1;
      var dots = '';
      for (var d = 0; d < 3; d++) {
        dots += '<span class="conv-dot' + (d < c.difficulty ? ' conv-dot-active' : '') + '"></span>';
      }
      h += '<div class="conv-topic' + (isDone ? ' conv-topic-done' : '') + '" data-conv="' + c.id + '">';
      h += '<div class="conv-topic-icon">' + c.icon + '</div>';
      h += '<div class="conv-topic-title">' + c.title + '</div>';
      h += '<div class="conv-topic-de">' + c.titleDe + '</div>';
      h += '<div class="conv-difficulty">' + dots + '</div>';
      if (isDone) h += '<div class="conv-check">&#10003;</div>';
      h += '</div>';
    }
    h += '</div>';
    container.innerHTML = h;

    container.querySelectorAll('.conv-topic').forEach(function(el) {
      el.addEventListener('click', function() {
        ConversationMode.startConversation(el.getAttribute('data-conv'));
      });
    });
  },

  startConversation: function(convId) {
    var script = null;
    for (var i = 0; i < CONV_SCRIPTS.length; i++) {
      if (CONV_SCRIPTS[i].id === convId) { script = CONV_SCRIPTS[i]; break; }
    }
    if (!script || !this._container) return;
    this._convState = { script: script, turnIdx: 0, score: 0, total: 0 };
    var ct = this._container;
    ct.innerHTML = '<div class="conv-header">' +
      '<button class="conv-back" onclick="ConversationMode.init(ConversationMode._container)">' +
      '&larr;</button>' +
      '<span>' + script.icon + ' ' + script.title + '</span><span></span></div>' +
      '<div class="conv-chat" id="conv-chat"></div>' +
      '<div id="conv-input-area"></div>';
    this._advanceTurns();
  },

  _advanceTurns: function() {
    var st = this._convState;
    if (!st) return;
    var chat = document.getElementById('conv-chat');
    var inputArea = document.getElementById('conv-input-area');
    if (!chat || !inputArea) return;
    if (st.turnIdx >= st.script.turns.length) {
      this._complete();
      return;
    }
    var turn = st.script.turns[st.turnIdx];
    if (!turn.blank) {
      this._addBubble(chat, turn, st.turnIdx);
      st.turnIdx++;
      setTimeout(function() { ConversationMode._advanceTurns(); }, 600);
      return;
    }
    this._addBlankBubble(chat, turn, st.turnIdx);
    st.total++;
    inputArea.innerHTML = '';
    if (turn.type === 'options') {
      this._renderOptions(inputArea, turn);
    } else {
      this._renderTyping(inputArea, turn);
    }
  },

  _addBubble: function(chat, turn) {
    var cls = turn.speaker === 'A' ? 'conv-bubble-a' : 'conv-bubble-b';
    var b = document.createElement('div');
    b.className = 'conv-bubble ' + cls;
    b.style.animationDelay = '0s';
    b.innerHTML = '<div class="conv-bubble-text">' + turn.turoyo + '</div>' +
      '<div class="conv-bubble-en">' + turn.en + '</div>';
    chat.appendChild(b);
    chat.scrollTop = chat.scrollHeight;
  },

  _addBlankBubble: function(chat, turn, idx) {
    var cls = turn.speaker === 'A' ? 'conv-bubble-a' : 'conv-bubble-b';
    var b = document.createElement('div');
    b.className = 'conv-bubble ' + cls + ' conv-blank';
    b.id = 'conv-blank-' + idx;
    b.innerHTML = '<div class="conv-bubble-text">???</div>' +
      '<div class="conv-bubble-en">' + turn.en + '</div>';
    chat.appendChild(b);
    chat.scrollTop = chat.scrollHeight;
  },

  _renderOptions: function(area, turn) {
    var h = '<div class="conv-options">';
    var opts = turn.options || [];
    for (var i = 0; i < opts.length; i++) {
      h += '<button class="conv-opt-btn" data-val="' +
        opts[i].replace(/"/g, '&quot;') + '">' + opts[i] + '</button>';
    }
    h += '</div>';
    area.innerHTML = h;
    area.querySelectorAll('.conv-opt-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        ConversationMode._checkAnswer(btn.getAttribute('data-val'), turn);
      });
    });
  },

  _renderTyping: function(area, turn) {
    var h = '<div class="conv-typing">';
    h += '<input type="text" class="conv-input" placeholder="Type in Turoyo..."';
    h += ' id="conv-type-input">';
    h += '<button class="conv-send-btn" id="conv-send">&#10148;</button>';
    h += '</div>';
    if (turn.hint) {
      h += '<div class="conv-hint">Hint: starts with "' + turn.hint + '"</div>';
    }
    area.innerHTML = h;
    var input = document.getElementById('conv-type-input');
    var send = document.getElementById('conv-send');
    input.focus();
    var handler = function() {
      ConversationMode._checkAnswer(input.value.trim(), turn);
    };
    send.addEventListener('click', handler);
    input.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') handler();
    });
  },

  _checkAnswer: function(answer, turn) {
    var st = this._convState;
    var correct = turn.turoyo.replace(/\s*___\s*/g, '').toLowerCase().trim();
    var given = answer.toLowerCase().trim();
    var isCorrect = given === correct;
    if (turn.type === 'typing' && turn.hint) {
      isCorrect = given.indexOf(turn.hint.toLowerCase()) === 0
        && given.length >= turn.hint.length;
    }
    var blankEl = document.getElementById('conv-blank-' + st.turnIdx);
    if (isCorrect) {
      st.score++;
      if (blankEl) {
        blankEl.classList.remove('conv-blank');
        blankEl.classList.add('conv-correct');
        blankEl.querySelector('.conv-bubble-text').textContent = turn.turoyo;
      }
      st.turnIdx++;
      document.getElementById('conv-input-area').innerHTML = '';
      setTimeout(function() { ConversationMode._advanceTurns(); }, 500);
    } else {
      if (blankEl) {
        blankEl.classList.add('conv-shake');
        setTimeout(function() { blankEl.classList.remove('conv-shake'); }, 500);
      }
      var hintEl = document.querySelector('.conv-hint');
      if (!hintEl) {
        var ia = document.getElementById('conv-input-area');
        var d = document.createElement('div');
        d.className = 'conv-hint';
        d.textContent = 'Try: ' + turn.turoyo;
        ia.appendChild(d);
      } else {
        hintEl.textContent = 'Try: ' + turn.turoyo;
      }
    }
  },

  _complete: function() {
    var st = this._convState;
    var xp = st.score * 15;
    var done = this._getDone();
    if (done.indexOf(st.script.id) === -1) {
      done.push(st.script.id);
      this._saveDone(done);
    }
    this._container.innerHTML = '<div class="conv-complete">' +
      '<div class="conv-complete-icon">&#127881;</div>' +
      '<h2>Conversation Complete!</h2>' +
      '<div class="conv-complete-stats">' +
      '<div class="stat"><div class="num">' + st.score + '/' + st.total +
      '</div><div class="label">Correct</div></div>' +
      '<div class="stat"><div class="num">+' + xp +
      '</div><div class="label">XP</div></div></div>' +
      '<button class="btn btn-primary" style="margin-top:24px" ' +
      'onclick="ConversationMode.init(ConversationMode._container)">' +
      'Back to Topics</button></div>';
  },

  /* Enhanced Proverb of the Day */
  enhancedProverb: function(container) {
    var today = new Date();
    var seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    var allProvs = PROVERB_DETAILS.length > 0 ? PROVERB_DETAILS : [];
    if (allProvs.length === 0) { container.innerHTML = ''; return; }
    var idx = seed % allProvs.length;
    var prov = allProvs[idx];

    var h = '<div class="prov-card">';
    h += '<h3>Proverb of the Day</h3>';
    h += '<div class="prov-text">' + prov.latin + '</div>';
    h += '<div class="prov-en">' + prov.en + '</div>';
    if (prov.de) h += '<div class="prov-de">' + prov.de + '</div>';
    h += '<button class="btn btn-secondary prov-break-btn" id="prov-break-btn">';
    h += 'Break it down</button>';
    h += '<div class="prov-breakdown" id="prov-breakdown" style="display:none">';
    h += '<div class="prov-words">';
    if (prov.words) {
      for (var i = 0; i < prov.words.length; i++) {
        var pw = prov.words[i];
        h += '<div class="prov-word" style="animation-delay:' + (i * 0.1) + 's">';
        h += '<span class="prov-word-main">' + pw.w + '</span>';
        h += '<span class="prov-word-meaning">' + pw.m + '</span>';
        h += '<span class="prov-word-grammar">' + pw.g + '</span>';
        h += '</div>';
      }
    }
    h += '</div>';
    if (prov.grammar) {
      h += '<div class="prov-grammar-note"><strong>Grammar:</strong> ';
      h += prov.grammar + '</div>';
    }
    if (prov.culture) {
      h += '<div class="prov-culture-note"><strong>Culture:</strong> ';
      h += prov.culture + '</div>';
    }
    h += '</div></div>';
    container.innerHTML = h;

    var btn = document.getElementById('prov-break-btn');
    var bd = document.getElementById('prov-breakdown');
    btn.addEventListener('click', function() {
      if (bd.style.display === 'none') {
        bd.style.display = 'block';
        btn.textContent = 'Hide breakdown';
        try {
          var seen = JSON.parse(localStorage.getItem(ConversationMode.LS_PROV) || '[]');
          if (seen.indexOf(idx) === -1) {
            seen.push(idx);
            localStorage.setItem(ConversationMode.LS_PROV, JSON.stringify(seen));
          }
        } catch(e) {}
      } else {
        bd.style.display = 'none';
        btn.textContent = 'Break it down';
      }
    });
  }
};
