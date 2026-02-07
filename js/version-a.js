/* version-a.js -- Gamified Turoyo lessons. Depends on: data.js, data-phrases.js, vfx.js, exercise-types.js */
const VersionA = (() => {
  const LS_XP = 'turoyo_a_xp';
  const LS_STREAK = 'turoyo_a_streak';
  const LS_LESSONS = 'turoyo_a_lessons';
  const LS_LAST = 'turoyo_a_last_date';
  const EXERCISES_PER_LESSON = 6;
  const XP_PER_CORRECT = 10;

  let page, state;

  function resetState() {
    state = { exercises: [], idx: 0, score: 0, combo: 0, answered: false, category: null };
  }

  /* ---------- localStorage helpers ---------- */
  function getProgress() {
    return {
      xp: parseInt(localStorage.getItem(LS_XP) || '0', 10),
      streak: parseInt(localStorage.getItem(LS_STREAK) || '0', 10),
      lessons: JSON.parse(localStorage.getItem(LS_LESSONS) || '{}'),
      lastDate: localStorage.getItem(LS_LAST) || ''
    };
  }
  function saveProgress(data) {
    if (data.xp !== undefined) localStorage.setItem(LS_XP, data.xp);
    if (data.streak !== undefined) localStorage.setItem(LS_STREAK, data.streak);
    if (data.lessons) localStorage.setItem(LS_LESSONS, JSON.stringify(data.lessons));
    if (data.lastDate) localStorage.setItem(LS_LAST, data.lastDate);
  }
  function updateStreak() {
    const p = getProgress();
    const today = new Date().toISOString().slice(0, 10);
    if (p.lastDate === today) return;
    const yesterday = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
    const streak = p.lastDate === yesterday ? p.streak + 1 : 1;
    saveProgress({ streak, lastDate: today });
  }

  /* ---------- utility ---------- */
  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  function pick(arr, n) { return shuffle(arr).slice(0, n); }
  function wordsForCategory(cat) { return WORDS.filter(w => w.cat === cat); }
  function randomDistractors(pool, correct, key, count) {
    return pick(pool.filter(w => w.id !== correct.id), count).map(w => w[key]);
  }

  /* ---------- exercise generation ---------- */
  function buildExercises(cat) {
    const pool = wordsForCategory(cat);
    if (pool.length < 4) return [];
    const chosen = pick(pool, Math.min(EXERCISES_PER_LESSON, pool.length));
    const mcTypes = ['serto_to_en', 'en_to_latin', 'latin_to_serto'];
    const allTypes = ['serto_to_en', 'en_to_latin', 'typing', 'latin_to_serto', 'match_pairs', 'sentence_build'];
    return chosen.map((word, i) => {
      const type = allTypes[i % allTypes.length];
      if (type === 'typing') return { type, word };
      if (type === 'match_pairs') return { type, words: pick(pool, 4) };
      if (type === 'sentence_build') {
        const catPhrases = typeof PHRASES !== 'undefined'
          ? PHRASES.filter(p => p.cat === cat) : [];
        if (catPhrases.length > 0) {
          return { type, phrase: catPhrases[Math.floor(Math.random() * catPhrases.length)] };
        }
        return createMCExercise(mcTypes[i % mcTypes.length], word, pool);
      }
      return createMCExercise(type, word, pool);
    });
  }
  function createMCExercise(type, word, pool) {
    let prompt, correctAnswer, options, promptClass = '';
    var mKey = (typeof T !== 'undefined') ? T.key() : 'en';
    var mVal = function(w) { return w[mKey] || w.en; };
    if (type === 'serto_to_en') {
      prompt = word.serto; promptClass = 'serto';
      correctAnswer = mVal(word);
      options = shuffle([correctAnswer, ...pool.filter(w => w.id !== word.id).slice(0,3).map(w => mVal(w))]);
    } else if (type === 'en_to_latin') {
      prompt = mVal(word); correctAnswer = word.latin;
      options = shuffle([correctAnswer, ...randomDistractors(pool, word, 'latin', 3)]);
    } else {
      prompt = word.latin; correctAnswer = word.serto;
      options = shuffle([correctAnswer, ...randomDistractors(pool, word, 'serto', 3)]);
    }
    const question = type === 'serto_to_en' ? 'What does this mean?'
      : type === 'en_to_latin' ? 'How do you say this in Turoyo?' : 'Match the Serto script';
    return { type, word, prompt, promptClass, question, correctAnswer, options };
  }

  /* ---------- rendering ---------- */
  function init() {
    page = document.getElementById('page-a');
    if (!page) return;
    resetState();
    renderHome();
  }

  function isDailyDone() {
    const today = new Date().toISOString().slice(0, 10);
    return !!localStorage.getItem('turoyo_a_daily_' + today);
  }

  function renderHome() {
    const p = getProgress();
    const catKeys = [...new Set(WORDS.map(w => w.cat))];
    let catCards = '';
    catKeys.forEach(key => {
      const c = CATEGORIES[key];
      if (!c) return;
      const count = wordsForCategory(key).length;
      const done = p.lessons[key] || 0;
      catCards += `
        <div class="cat-card va-cat-card" data-cat="${key}"
             style="border-left:4px solid ${c.color}">
          <div class="icon">${c.icon}</div>
          <div class="name">${c.name}</div>
          <div class="count">${count} words &middot; ${done} lessons</div>
          <div class="progress-bar"><div class="progress-fill"
            style="width:${Math.min(done * 20, 100)}%;background:${c.color}"></div></div>
        </div>`;
    });
    const proverb = PROVERBS[Math.floor(Math.random() * PROVERBS.length)];
    const dailyHtml = isDailyDone() ? '' : `
      <div class="va-daily-card" id="va-daily-trigger">
        <div class="va-daily-icon">&#x1F31F;</div>
        <div class="va-daily-info">
          <h3>Daily Challenge</h3>
          <p>3 exercises &middot; 3x XP bonus</p>
        </div>
      </div>`;
    page.innerHTML = `
      <div class="va-home">
        <div class="va-header card">
          <div class="stat-row">
            <div class="stat"><div class="xp-badge">${p.xp} XP</div></div>
            <div class="stat"><div class="streak-badge">${p.streak} day${p.streak !== 1 ? 's' : ''}</div></div>
          </div>
        </div>
        ${dailyHtml}
        <h2 style="margin-top:16px">Pick a lesson</h2>
        <div class="cat-grid">${catCards}</div>
        <div class="note-box" style="margin-top:20px">
          <em>${proverb.latin}</em><br>
          <span style="color:var(--text2)">${proverb.en}</span>
        </div>
      </div>`;
    page.querySelectorAll('.va-cat-card').forEach(el => {
      el.addEventListener('click', () => startLesson(el.dataset.cat));
    });
    const dailyBtn = page.querySelector('#va-daily-trigger');
    if (dailyBtn) {
      dailyBtn.addEventListener('click', () => startDailyChallenge());
    }
  }

  function startDailyChallenge() {
    page.innerHTML = '<div id="va-daily-container"></div>';
    const container = page.querySelector('#va-daily-container');
    ExerciseTypes.dailyChallenge(container, (result) => {
      const p = getProgress();
      saveProgress({ xp: p.xp + (result.xp || 0) });
      updateStreak();
      resetState();
      renderHome();
    });
  }

  function startLesson(category) {
    const exercises = buildExercises(category);
    if (!exercises.length) return;
    state = { exercises, idx: 0, score: 0, combo: 0, answered: false, category };
    showExercise();
  }

  function renderLessonShell() {
    const cat = CATEGORIES[state.category] || {};
    const progress = (state.idx / state.exercises.length) * 100;
    const comboHtml = state.combo >= 2
      ? `<div class="va-combo${state.combo >= 4 ? ' va-combo-fire' : ''}">${state.combo}x Combo!</div>` : '';
    page.innerHTML = `
      <div class="va-lesson">
        <div class="va-lesson-header">
          <button class="va-close-btn" title="Quit">&times;</button>
          <div class="progress-bar va-progress">
            <div class="progress-fill" style="width:${progress}%;background:${cat.color || 'var(--green)'}"></div>
          </div>
          <span class="va-q-count">${state.idx + 1}/${state.exercises.length}</span>
        </div>
        ${comboHtml ? `<div style="text-align:center;margin-bottom:8px">${comboHtml}</div>` : ''}
        <div id="va-exercise-body"></div>
      </div>`;
    page.querySelector('.va-close-btn').addEventListener('click', () => {
      if (confirm('Quit this lesson?')) { resetState(); renderHome(); }
    });
    return page.querySelector('#va-exercise-body');
  }

  function showExercise() {
    const ex = state.exercises[state.idx];
    const body = renderLessonShell();

    if (ex.type === 'typing') {
      ExerciseTypes.typing(ex, body, (res) => handleResult(res.correct));
    } else if (ex.type === 'match_pairs') {
      ExerciseTypes.matchPairs(ex.words, body, (res) => {
        handleResult(res.correct === res.total);
      });
    } else if (ex.type === 'sentence_build' && ex.phrase) {
      ExerciseTypes.sentenceBuilder(ex.phrase, body, (res) => handleResult(res.correct));
    } else {
      renderMC(ex, body);
    }
  }

  function renderMC(ex, body) {
    const isSerto = ex.type === 'latin_to_serto';
    body.innerHTML = `
      <div class="card va-exercise-card">
        <p class="va-question">${ex.question}</p>
        <div class="va-prompt ${ex.promptClass}">${ex.prompt}</div>
      </div>
      <div class="options">${ex.options.map((opt, i) =>
        `<button class="option-btn${isSerto ? ' serto' : ''}" data-idx="${i}">${opt}</button>`
      ).join('')}</div>
      <div id="va-feedback"></div>`;
    body.querySelectorAll('.option-btn').forEach(btn => {
      btn.addEventListener('click', () => checkMCAnswer(ex, parseInt(btn.dataset.idx, 10), body));
    });
  }

  function checkMCAnswer(ex, selectedIdx, body) {
    if (state.answered) return;
    state.answered = true;
    const chosen = ex.options[selectedIdx];
    const correct = chosen === ex.correctAnswer;
    if (correct) { state.score++; state.combo++; }
    else { state.combo = 0; }
    body.querySelectorAll('.option-btn').forEach((btn, i) => {
      btn.classList.add('disabled');
      if (ex.options[i] === ex.correctAnswer) btn.classList.add('correct');
      if (i === selectedIdx && !correct) btn.classList.add('wrong');
    });
    if (correct) {
      VFX.screenFlash('green');
      VFX.floatingXP(XP_PER_CORRECT + (state.combo >= 4 ? 5 : 0));
      if (state.combo >= 3) VFX.spawnConfetti(8 + state.combo * 2, 50);
    } else { VFX.screenFlash('red'); }
    const fb = body.querySelector('#va-feedback');
    const note = ex.word && ex.word.note ? `<br><small>${ex.word.note}</small>` : '';
    const comboMsg = correct && state.combo >= 3 ? ` <span style="color:#FF6B35">${state.combo}x!</span>` : '';
    fb.innerHTML = correct
      ? `<div class="feedback ok va-fb-pop">Correct! +${XP_PER_CORRECT} XP${comboMsg}${note}</div>`
      : `<div class="feedback no va-fb-shake">Wrong &mdash; answer: <strong>${ex.correctAnswer}</strong>${note}</div>`;
    setTimeout(() => nextExercise(), 1200);
  }

  function handleResult(correct) {
    if (correct) { state.score++; state.combo++; VFX.floatingXP(XP_PER_CORRECT + (state.combo >= 4 ? 5 : 0)); }
    else { state.combo = 0; }
    setTimeout(() => nextExercise(), 200);
  }

  function nextExercise() {
    state.idx++;
    state.answered = false;
    if (state.idx >= state.exercises.length) finishLesson();
    else showExercise();
  }

  function finishLesson() {
    const earned = state.score * XP_PER_CORRECT, total = state.exercises.length;
    const pct = Math.round((state.score / total) * 100);
    const p = getProgress(), lessons = { ...p.lessons };
    lessons[state.category] = (lessons[state.category] || 0) + 1;
    saveProgress({ xp: p.xp + earned, lessons });
    updateStreak();
    const cat = CATEGORIES[state.category] || {};
    const stars = pct === 100 ? 3 : pct >= 60 ? 2 : 1;
    const starsHtml = [0,1,2].map(i => `<span class="va-star-item">${i < stars ? '\u2B50' : '\u2606'}</span>`).join('');
    const msg = pct === 100 ? 'Perfect!' : pct >= 60 ? 'Great job!' : 'Keep practicing!';
    VFX.spawnConfetti(pct === 100 ? 40 : pct >= 60 ? 20 : 8, 20);
    if (pct === 100) setTimeout(() => VFX.spawnConfetti(25, 10), 600);
    const s = (v, l) => `<div class="stat"><div class="num" style="color:var(--green)">${v}</div><div class="label">${l}</div></div>`;
    page.innerHTML = `<div class="va-finish"><div class="card va-finish-card">
      <div class="va-finish-icon">${cat.icon || ''}</div>
      <div class="va-finish-stars va-star">${starsHtml}</div>
      <h1>${msg}</h1><p class="va-finish-sub">${cat.name} lesson complete</p>
      <div class="stat-row">${s(state.score+'/'+total,'Correct')}${s('+'+earned,'XP earned')}
        <div class="stat"><div class="num">${pct}%</div><div class="label">Score</div></div>
      </div></div><button class="btn btn-primary va-continue-btn">Continue</button></div>`;
    page.querySelector('.va-continue-btn').addEventListener('click', () => { resetState(); renderHome(); });
  }

  return { init, startLesson, showExercise, nextExercise, finishLesson, getProgress, saveProgress };
})();
