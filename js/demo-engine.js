// ============================================================
// STATE
// ============================================================
let state = {
  xp: 0, streak: 0, hearts: 3,
  currentSession: null,
  exercises: [], exIdx: 0, correct: 0, total: 0,
  matchSelected: null,
};

// ============================================================
// NAVIGATION
// ============================================================
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('screen-' + id).classList.add('active');
}
function goHome() {
  showScreen('home');
  renderHome();
}
function renderHome() {
  document.getElementById('xp-display').textContent = state.xp + ' XP';
  document.getElementById('streak-display').textContent = state.streak;
  const c = document.getElementById('session-cards');
  c.innerHTML = SESSIONS.map((s, i) => `
    <div class="session-card${i > 3 ? ' locked' : ''}" style="border-left-color:${s.color}"
         onclick="${s.type === 'explorer' ? 'openAlphabet()' : `startSession('${s.id}')`}">
      <div class="s-icon">${s.icon}</div>
      <div class="s-info">
        <div class="s-name">${s.name}</div>
        <div class="s-desc">${s.desc}</div>
      </div>
      <div class="s-badge" style="background:${s.color}22;color:${s.color}">
        ${s.type === 'explorer' ? 'Explore' : 'Lvl ' + s.level}
      </div>
    </div>
  `).join('');
}

// ============================================================
// ALPHABET EXPLORER
// ============================================================
function openAlphabet() {
  showScreen('alphabet');
  showAlphaGroup('all', document.querySelector('.alpha-tab.active'));
}
function showAlphaGroup(group, btn) {
  document.querySelectorAll('.alpha-tab').forEach(t => t.classList.remove('active'));
  if (btn) btn.classList.add('active');
  const filtered = group === 'all' ? ALPHABET : ALPHABET.filter(a => a.group === group);
  const grid = document.getElementById('alpha-grid');
  grid.innerHTML = filtered.map((a, i) => `
    <div class="alpha-cell" onclick="showCharDetail(${ALPHABET.indexOf(a)})" data-idx="${ALPHABET.indexOf(a)}">
      <div class="a-serto">${a.serto}</div>
      <div class="a-latin">${a.latin.charAt(0)}</div>
    </div>
  `).join('');
  document.getElementById('char-detail').classList.remove('show');
}
function showCharDetail(idx) {
  const a = ALPHABET[idx];
  document.querySelectorAll('.alpha-cell').forEach(c => c.classList.remove('selected'));
  const cell = document.querySelector(`.alpha-cell[data-idx="${idx}"]`);
  if (cell) cell.classList.add('selected');
  const d = document.getElementById('char-detail');
  d.classList.add('show');
  const connectInfo = a.group === 'connect-both'
    ? 'Connects in both directions'
    : 'Connects only to the right';
  d.innerHTML = `
    <div class="cd-top">
      <div class="cd-serto">${a.serto}</div>
      <div class="cd-info">
        <h3>${a.name} — ${a.latin}</h3>
        <p>Sound: /${a.sound}/</p>
        <p style="margin-top:4px;font-size:.8rem;color:var(--blue)">${connectInfo}</p>
        ${a.note ? `<p style="margin-top:4px;font-size:.8rem;color:var(--text3)">${a.note}</p>` : ''}
      </div>
    </div>
    <div class="char-forms">
      <div class="char-form"><div class="cf-label">Isolated</div><div class="cf-char">${a.forms.isolated}</div></div>
      <div class="char-form"><div class="cf-label">Initial</div><div class="cf-char">...${a.forms.initial}</div></div>
      <div class="char-form"><div class="cf-label">Final</div><div class="cf-char">${a.forms.final}...</div></div>
    </div>
    ${a.examples.length ? `
      <div class="char-examples">
        <h4>Example words</h4>
        ${a.examples.map(e => `
          <div class="example-row">
            <div class="serto" style="font-size:1.3rem;min-width:80px;text-align:right">${e.serto}</div>
            <div>
              <div class="e-info">${e.word}</div>
              <div class="e-de">${e.de}</div>
            </div>
          </div>
        `).join('')}
      </div>
    ` : ''}
  `;
  d.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ============================================================
// EXERCISE SESSION ENGINE
// ============================================================
function startSession(id) {
  const session = SESSIONS.find(s => s.id === id);
  if (!session) return;
  state.currentSession = session;
  state.hearts = 3;
  state.exercises = generateExercises(session);
  state.exIdx = 0;
  state.correct = 0;
  state.total = state.exercises.length;
  showScreen('session');
  updateSessionUI();
  renderExercise();
}

function startSmartSession() {
  // Mix exercises from all available vocab
  state.currentSession = { name: 'Smart Session', color: '#58CC02' };
  state.hearts = 3;
  state.exercises = [];
  // Pull from each category
  ['greetings', 'family', 'grammar'].forEach(cat => {
    const words = VOCAB[cat];
    const shuffled = shuffle([...words]).slice(0, 3);
    shuffled.forEach(w => {
      state.exercises.push(randomExerciseForWord(w, cat));
    });
  });
  // Add a dialogue exercise
  state.exercises.push(makeDialogueExercise());
  // Add a match exercise
  state.exercises.push(makeMatchExercise('greetings'));
  state.exercises = shuffle(state.exercises);
  state.exIdx = 0;
  state.correct = 0;
  state.total = state.exercises.length;
  showScreen('session');
  updateSessionUI();
  renderExercise();
}

function generateExercises(session) {
  const words = VOCAB[session.vocab] || VOCAB.greetings;
  const exercises = [];
  const selected = shuffle([...words]).slice(0, 6);

  selected.forEach((w, i) => {
    exercises.push(randomExerciseForWord(w, session.vocab));
  });

  // Add a matching exercise
  exercises.push(makeMatchExercise(session.vocab));

  // Add dialogue exercise if level >= 2
  if (session.level >= 2) {
    exercises.push(makeDialogueExercise());
  }

  return shuffle(exercises);
}

function randomExerciseForWord(w, cat) {
  const pool = VOCAB[cat] || VOCAB.greetings;
  const types = ['serto-to-latin', 'latin-to-meaning', 'meaning-to-serto', 'type-latin'];
  const type = types[Math.floor(Math.random() * types.length)];

  const distractors = shuffle(pool.filter(x => x.latin !== w.latin)).slice(0, 3);

  switch (type) {
    case 'serto-to-latin':
      return {
        type: 'mc', subtype: 'serto-to-latin',
        prompt: 'What does this say?',
        display: w.serto, displayType: 'serto',
        correct: w.latin,
        options: shuffle([w, ...distractors]).map(x => x.latin),
        xp: 10
      };
    case 'latin-to-meaning':
      return {
        type: 'mc', subtype: 'latin-to-meaning',
        prompt: 'What does this mean?',
        display: w.latin, displayType: 'latin',
        context: w.serto,
        correct: w.de,
        options: shuffle([w, ...distractors]).map(x => x.de),
        xp: 10
      };
    case 'meaning-to-serto':
      return {
        type: 'mc', subtype: 'meaning-to-serto',
        prompt: `Which is "${w.de}"?`,
        display: w.de, displayType: 'meaning',
        correct: w.serto,
        options: shuffle([w, ...distractors]).map(x => x.serto),
        optionStyle: 'serto',
        xp: 15
      };
    case 'type-latin':
      return {
        type: 'type', subtype: 'type-latin',
        prompt: 'Type the transliteration:',
        display: w.serto, displayType: 'serto',
        hint: w.de,
        correct: w.latin.toLowerCase().replace(/[?.!,]/g, ''),
        xp: 20
      };
  }
}

function makeMatchExercise(cat) {
  const pool = VOCAB[cat] || VOCAB.greetings;
  const pairs = shuffle([...pool]).slice(0, 4);
  return {
    type: 'match',
    prompt: 'Match the pairs',
    pairs: pairs.map(p => ({ latin: p.latin, serto: p.serto, de: p.de })),
    xp: 25
  };
}

function makeDialogueExercise() {
  const dlg = DIALOGUES[Math.floor(Math.random() * DIALOGUES.length)];
  // Pick a line to blank out
  const blankIdx = 1 + Math.floor(Math.random() * (dlg.lines.length - 2));
  const blankLine = dlg.lines[blankIdx];
  const allLines = dlg.lines.map(l => l.surayt);
  const distractors = shuffle(allLines.filter(l => l !== blankLine.surayt)).slice(0, 2);

  return {
    type: 'dialogue',
    prompt: 'Complete the dialogue',
    title: dlg.title,
    context: dlg.context,
    lines: dlg.lines,
    blankIdx: blankIdx,
    correct: blankLine.surayt,
    options: shuffle([blankLine.surayt, ...distractors]),
    xp: 20
  };
}

// ============================================================
// RENDER EXERCISES
// ============================================================
function updateSessionUI() {
  const pct = state.total > 0 ? ((state.exIdx) / state.total) * 100 : 0;
  document.getElementById('session-progress').style.width = pct + '%';
  const heartsEl = document.getElementById('session-hearts');
  heartsEl.innerHTML = Array(3).fill(0).map((_, i) =>
    i < state.hearts ? '<span style="opacity:1">&#10084;&#65039;</span>' : '<span style="opacity:.2">&#10084;&#65039;</span>'
  ).join('');
}

function renderExercise() {
  if (state.exIdx >= state.exercises.length || state.hearts <= 0) {
    finishSession();
    return;
  }
  const ex = state.exercises[state.exIdx];
  const area = document.getElementById('exercise-area');

  switch (ex.type) {
    case 'mc': renderMC(area, ex); break;
    case 'type': renderType(area, ex); break;
    case 'match': renderMatch(area, ex); break;
    case 'dialogue': renderDialogue(area, ex); break;
  }
}

function renderMC(area, ex) {
  const displayHTML = ex.displayType === 'serto'
    ? `<div class="ex-serto-big">${ex.display}</div>`
    : ex.displayType === 'meaning'
    ? `<div style="font-size:1.5rem;font-weight:700;text-align:center;margin:20px 0">${ex.display}</div>`
    : `<div style="font-size:1.8rem;font-weight:700;text-align:center;margin:20px 0">${ex.display}</div>`;

  const contextHTML = ex.context
    ? `<div class="ex-serto-med">${ex.context}</div>` : '';

  area.innerHTML = `
    <div class="exercise">
      <div class="ex-type">${ex.subtype.replace(/-/g, ' ')}</div>
      <div class="ex-prompt">${ex.prompt}</div>
      ${displayHTML}
      ${contextHTML}
      <div class="options">
        ${ex.options.map((opt, i) => `
          <button class="option-btn${ex.optionStyle === 'serto' ? ' serto' : ''}"
                  onclick="checkMC(this, ${JSON.stringify(opt) === JSON.stringify(ex.correct)}, ${ex.xp})"
                  ${ex.optionStyle === 'serto' ? 'style="text-align:center;font-size:1.4rem"' : ''}>
            ${opt}
          </button>
        `).join('')}
      </div>
      <div id="ex-feedback"></div>
    </div>
  `;
}

function checkMC(btn, isCorrect, xp) {
  const btns = btn.parentElement.querySelectorAll('.option-btn');
  btns.forEach(b => b.classList.add('disabled'));

  if (isCorrect) {
    btn.classList.add('correct');
    state.correct++;
    addXP(xp);
    showFeedback(true);
  } else {
    btn.classList.add('wrong');
    btn.classList.add('shake');
    state.hearts--;
    updateSessionUI();
    // Highlight correct
    btns.forEach(b => {
      const ex = state.exercises[state.exIdx];
      if (b.textContent.trim() === ex.correct) b.classList.add('correct');
    });
    showFeedback(false);
  }
  setTimeout(nextExercise, 1200);
}

function renderType(area, ex) {
  area.innerHTML = `
    <div class="exercise">
      <div class="ex-type">Type the answer</div>
      <div class="ex-prompt">${ex.prompt}</div>
      <div class="ex-serto-big">${ex.display}</div>
      <p style="text-align:center;font-size:.85rem;color:var(--text2);margin-bottom:16px">Hint: ${ex.hint}</p>
      <input class="type-input" id="type-answer" type="text" placeholder="Type in Latin script..."
             autocomplete="off" autocapitalize="off" spellcheck="false"
             onkeydown="if(event.key==='Enter')checkType(${ex.xp})">
      <button class="btn btn-primary continue-btn" onclick="checkType(${ex.xp})">Check</button>
      <div id="ex-feedback"></div>
    </div>
  `;
  setTimeout(() => document.getElementById('type-answer').focus(), 300);
}

function checkType(xp) {
  const input = document.getElementById('type-answer');
  const answer = input.value.trim().toLowerCase();
  const ex = state.exercises[state.exIdx];
  const correct = ex.correct.toLowerCase();

  // Allow close matches (levenshtein distance <= 1)
  if (answer === correct || levenshtein(answer, correct) <= 1) {
    input.classList.add('correct');
    state.correct++;
    addXP(xp);
    showFeedback(true, answer !== correct ? `Close! It's "${ex.correct}"` : null);
  } else {
    input.classList.add('wrong');
    state.hearts--;
    updateSessionUI();
    showFeedback(false, `Correct answer: ${ex.correct}`);
  }
  input.disabled = true;
  setTimeout(nextExercise, 1500);
}

function renderMatch(area, ex) {
  state.matchSelected = null;
  state.matchedPairs = 0;
  state.matchTotal = ex.pairs.length;

  const leftItems = shuffle(ex.pairs.map((p, i) => ({ text: p.serto, type: 'serto', idx: i })));
  const rightItems = shuffle(ex.pairs.map((p, i) => ({ text: p.de, type: 'de', idx: i })));

  area.innerHTML = `
    <div class="exercise">
      <div class="ex-type">Matching</div>
      <div class="ex-prompt">${ex.prompt}</div>
      <div class="match-grid" id="match-grid">
        ${leftItems.map(item => `
          <button class="match-btn" data-side="left" data-idx="${item.idx}"
                  onclick="selectMatch(this)">
            <span class="serto">${item.text}</span>
          </button>
        `).join('')}
        ${rightItems.map(item => `
          <button class="match-btn" data-side="right" data-idx="${item.idx}"
                  onclick="selectMatch(this)">
            ${item.text}
          </button>
        `).join('')}
      </div>
      <div id="ex-feedback"></div>
    </div>
  `;
}

function selectMatch(btn) {
  if (btn.classList.contains('matched')) return;
  const side = btn.dataset.side;
  const idx = parseInt(btn.dataset.idx);

  if (!state.matchSelected) {
    btn.classList.add('selected');
    state.matchSelected = { btn, side, idx };
  } else {
    if (state.matchSelected.side === side) {
      state.matchSelected.btn.classList.remove('selected');
      btn.classList.add('selected');
      state.matchSelected = { btn, side, idx };
    } else {
      // Check match
      if (state.matchSelected.idx === idx) {
        // Correct match
        state.matchSelected.btn.classList.remove('selected');
        state.matchSelected.btn.classList.add('matched');
        btn.classList.add('matched');
        state.matchedPairs++;
        if (state.matchedPairs >= state.matchTotal) {
          state.correct++;
          addXP(state.exercises[state.exIdx].xp);
          showFeedback(true);
          setTimeout(nextExercise, 1000);
        }
      } else {
        // Wrong match
        state.matchSelected.btn.classList.remove('selected');
        state.matchSelected.btn.classList.add('wrong-flash');
        btn.classList.add('wrong-flash');
        setTimeout(() => {
          document.querySelectorAll('.wrong-flash').forEach(b => b.classList.remove('wrong-flash'));
        }, 500);
      }
      state.matchSelected = null;
    }
  }
}

function renderDialogue(area, ex) {
  area.innerHTML = `
    <div class="exercise">
      <div class="ex-type">Dialogue</div>
      <div class="ex-prompt">${ex.prompt}</div>
      <p style="font-size:.85rem;color:var(--text2);margin-bottom:12px">${ex.context}</p>
      <div class="dialogue-box">
        ${ex.lines.map((line, i) => `
          <div class="d-line">
            <span class="d-speaker">${line.speaker}:</span>
            <span class="d-text">
              ${i === ex.blankIdx
                ? `<span class="d-blank" id="dialogue-blank">???</span>`
                : line.surayt}
            </span>
          </div>
          <div class="d-line" style="margin-bottom:12px">
            <span class="d-speaker" style="opacity:0">.</span>
            <span class="d-text" style="font-size:.8rem;color:var(--text3);font-style:italic">
              ${i === ex.blankIdx ? '...' : line.de}
            </span>
          </div>
        `).join('')}
      </div>
      <div class="options">
        ${ex.options.map(opt => `
          <button class="option-btn" style="font-size:.85rem"
                  onclick="checkDialogue(this, ${opt === ex.correct}, ${ex.xp})">
            ${opt}
          </button>
        `).join('')}
      </div>
      <div id="ex-feedback"></div>
    </div>
  `;
}

function checkDialogue(btn, isCorrect, xp) {
  const btns = btn.parentElement.querySelectorAll('.option-btn');
  btns.forEach(b => b.classList.add('disabled'));

  const blank = document.getElementById('dialogue-blank');
  const ex = state.exercises[state.exIdx];

  if (isCorrect) {
    btn.classList.add('correct');
    if (blank) { blank.textContent = ex.correct; blank.style.color = 'var(--green-dark)'; }
    state.correct++;
    addXP(xp);
    showFeedback(true);
  } else {
    btn.classList.add('wrong');
    state.hearts--;
    updateSessionUI();
    btns.forEach(b => { if (b.textContent.trim() === ex.correct) b.classList.add('correct'); });
    if (blank) { blank.textContent = ex.correct; blank.style.color = 'var(--red)'; }
    showFeedback(false);
  }
  setTimeout(nextExercise, 1500);
}

// ============================================================
// SESSION FLOW
// ============================================================
function nextExercise() {
  state.exIdx++;
  updateSessionUI();
  renderExercise();
}

function endSession() {
  goHome();
}

function finishSession() {
  state.streak++;
  showScreen('complete');
  const stats = document.getElementById('complete-stats');
  const pct = state.total > 0 ? Math.round((state.correct / state.total) * 100) : 0;
  stats.innerHTML = `
    <div class="cs-stat"><div class="cs-num" style="color:var(--green)">${state.correct}/${state.total}</div><div class="cs-label">Correct</div></div>
    <div class="cs-stat"><div class="cs-num" style="color:var(--gold)">${pct}%</div><div class="cs-label">Accuracy</div></div>
    <div class="cs-stat"><div class="cs-num" style="color:var(--orange)">${state.streak}</div><div class="cs-label">Streak</div></div>
  `;
  document.getElementById('xp-display').textContent = state.xp + ' XP';
  document.getElementById('streak-display').textContent = state.streak;
}

// ============================================================
// FEEDBACK & XP
// ============================================================
function showFeedback(ok, extra) {
  const el = document.getElementById('ex-feedback');
  if (!el) return;
  el.className = 'feedback ' + (ok ? 'ok' : 'no');
  el.textContent = ok
    ? (extra || ['Nice!', 'Correct!', 'Great!', 'Awesome!'][Math.floor(Math.random() * 4)])
    : (extra || 'Not quite...');
}

function addXP(amount) {
  state.xp += amount;
  document.getElementById('xp-display').textContent = state.xp + ' XP';
  // Pop animation
  const pop = document.createElement('div');
  pop.className = 'xp-pop';
  pop.textContent = '+' + amount + ' XP';
  document.body.appendChild(pop);
  setTimeout(() => pop.remove(), 900);
}

// ============================================================
// UTILITIES
// ============================================================
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = Math.min(
        dp[i-1][j] + 1, dp[i][j-1] + 1,
        dp[i-1][j-1] + (a[i-1] === b[j-1] ? 0 : 1)
      );
  return dp[m][n];
}

// ============================================================
// INIT
// ============================================================
renderHome();
