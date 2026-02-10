/* Version B - Calm Study / SRS Flashcard Mode */
/* Depends on: WORDS, CATEGORIES, PROVERBS from data.js */

const VersionB = {
  page: null,
  cards: {},
  session: { queue: [], index: 0, results: [] },
  STORAGE_KEY: 'turoyo_b_cards',
  STATS_KEY: 'turoyo_b_stats',

  /* ---- Persistence ---- */
  loadCards() {
    try { this.cards = JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || {}; }
    catch { this.cards = {}; }
  },
  saveCards() { localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.cards)); },
  loadStats() {
    try { return JSON.parse(localStorage.getItem(this.STATS_KEY)) || { reviews: 0, correct: 0 }; }
    catch { return { reviews: 0, correct: 0 }; }
  },
  saveStats(s) { localStorage.setItem(this.STATS_KEY, JSON.stringify(s)); },

  /* ---- SRS helpers ---- */
  ensureCard(wordId) {
    if (!this.cards[wordId]) {
      this.cards[wordId] = { wordId, due: Date.now(), stability: 0.5, reps: 0, lapses: 0, lastRating: null };
      this.saveCards();
    }
    return this.cards[wordId];
  },
  getDueCards() {
    const now = Date.now();
    return Object.values(this.cards).filter(c => c.due <= now)
      .sort((a, b) => a.due - b.due);
  },
  getLearnedCount() { return Object.values(this.cards).filter(c => c.reps > 0).length; },
  intervalLabel(days) {
    if (days < 1) return Math.max(1, Math.round(days * 24 * 60)) + 'm';
    if (days < 30) return Math.round(days) + 'd';
    return Math.round(days / 30) + 'mo';
  },
  previewIntervals(card) {
    return {
      1: this.intervalLabel(0.5),
      2: this.intervalLabel(Math.max(0.5, (card.stability || 0.5) * 1.2)),
      3: this.intervalLabel(Math.max(0.5, (card.stability || 0.5) * 2.5)),
      4: this.intervalLabel(Math.max(0.5, (card.stability || 0.5) * 4.0))
    };
  },

  /* ---- Init ---- */
  init() {
    this.page = document.getElementById('page-b');
    this.loadCards();
    WORDS.forEach(w => this.ensureCard(w.id));
    this.renderDashboard();

    // Try restoring SRS state from server (merge, prefer newer)
    if (typeof API !== 'undefined' && API.getToken()) {
      var self = this;
      API.getUser().then(function (user) {
        if (!user || !user.progress || !user.progress.srs) return;
        var remote = user.progress.srs;
        var changed = false;
        Object.keys(remote).forEach(function (wid) {
          var rc = remote[wid];
          var lc = self.cards[wid];
          if (!lc || (rc.due > lc.due)) {
            self.cards[wid] = rc;
            changed = true;
          }
        });
        if (changed) { self.saveCards(); self.renderDashboard(); }
      }).catch(function () {});
    }
  },

  /* ---- Dashboard ---- */
  renderDashboard() {
    this.loadCards();
    const due = this.getDueCards();
    const learned = this.getLearnedCount();
    const stats = this.loadStats();
    const accuracy = stats.reviews > 0 ? Math.round(stats.correct / stats.reviews * 100) : 0;
    const proverb = PROVERBS[Math.floor(Math.random() * PROVERBS.length)];

    const recentIds = Object.values(this.cards)
      .filter(c => c.reps > 0).sort((a, b) => (b.due - b.stability * 864e5) - (a.due - a.stability * 864e5))
      .slice(0, 6).map(c => c.wordId);
    const recentWords = recentIds.map(id => WORDS.find(w => w.id === id)).filter(Boolean);

    const catHtml = Object.entries(CATEGORIES).map(([key, cat]) => {
      const count = WORDS.filter(w => w.cat === key).length;
      return `<div class="cat-card" onclick="VersionB.showCollection('${key}')">
        <div class="icon">${cat.icon}</div>
        <div class="name">${cat.name}</div>
        <div class="count">${count} words</div>
      </div>`;
    }).join('');

    const recentHtml = recentWords.length > 0
      ? `<div class="word-chips">${recentWords.map(w =>
          `<div class="word-chip"><span class="serto">${w.serto}</span><span class="latin">${w.latin}</span></div>`
        ).join('')}</div>` : '<p class="b-empty">Start reviewing to see recent words here.</p>';

    this.page.innerHTML = `
      <div class="b-dashboard">
        <div class="b-proverb card">
          <p class="b-proverb-latin">${proverb.latin}</p>
          <p class="b-proverb-en">${proverb.en}</p>
        </div>
        <div class="b-review-card card">
          <div class="b-due-count">${due.length}</div>
          <div class="b-due-label">words due for review</div>
          <button class="btn btn-b" onclick="VersionB.startReview()">${due.length > 0 ? 'Start Review' : 'Study All Words'}</button>
        </div>
        <h3>Recently Learned</h3>
        ${recentHtml}
        <div class="stat-row">
          <div class="stat"><div class="num">${learned}</div><div class="label">Learned</div></div>
          <div class="stat"><div class="num">${stats.reviews}</div><div class="label">Reviews</div></div>
          <div class="stat"><div class="num">${accuracy}%</div><div class="label">Accuracy</div></div>
        </div>
        <h3>Collections</h3>
        <div class="cat-grid">${catHtml}</div>
      </div>`;
  },

  /* ---- Review session ---- */
  startReview() {
    this.loadCards();
    let queue = this.getDueCards();
    if (queue.length === 0) queue = Object.values(this.cards).slice();
    // Shuffle
    for (let i = queue.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [queue[i], queue[j]] = [queue[j], queue[i]];
    }
    this.session = { queue: queue.slice(0, 20), index: 0, results: [] };
    this.showCard();
  },

  showCard() {
    const { queue, index } = this.session;
    if (index >= queue.length) { this.finishReview(); return; }
    const card = queue[index];
    const word = WORDS.find(w => w.id === card.wordId);
    if (!word) { this.session.index++; this.showCard(); return; }

    const progress = Math.round((index / queue.length) * 100);
    this.page.innerHTML = `
      <div class="b-review">
        <div class="b-review-header">
          <button class="b-close-btn" onclick="VersionB.renderDashboard()">&#x2715;</button>
          <span class="b-review-count">${index + 1} / ${queue.length}</span>
        </div>
        <div class="progress-bar"><div class="progress-fill" style="width:${progress}%;background:var(--b-primary)"></div></div>
        <div class="flashcard b-flashcard" onclick="VersionB.revealCard()">
          <div class="serto">${word.serto}</div>
          <div class="latin">${word.latin}</div>
          <div class="meaning">${word.en}${word.de ? ' / ' + word.de : ''}</div>
          <div class="tap-hint">Tap to reveal</div>
        </div>
        <div class="b-note-area">${word.note ? `<div class="note-box">${word.note}</div>` : ''}</div>
        <div class="rating-bar b-rating-bar" style="display:none" id="b-ratings"></div>
      </div>`;
  },

  revealCard() {
    const fc = this.page.querySelector('.flashcard');
    if (!fc || fc.classList.contains('revealed')) return;
    fc.classList.add('revealed');

    const card = this.session.queue[this.session.index];
    const intervals = this.previewIntervals(card);
    const bar = document.getElementById('b-ratings');
    bar.innerHTML = [
      { r: 1, cls: 'r1', lbl: 'Again', iv: intervals[1] },
      { r: 2, cls: 'r2', lbl: 'Hard',  iv: intervals[2] },
      { r: 3, cls: 'r3', lbl: 'Good',  iv: intervals[3] },
      { r: 4, cls: 'r4', lbl: 'Easy',  iv: intervals[4] }
    ].map(b => `<button class="rating-btn ${b.cls}" onclick="VersionB.rateCard(${b.r})">
      <span class="label">${b.lbl}</span><span class="interval">${b.iv}</span>
    </button>`).join('');
    bar.style.display = 'grid';
  },

  rateCard(rating) {
    const card = this.session.queue[this.session.index];
    const now = Date.now();
    let stability = card.stability || 0.5;
    if (rating === 1) { stability = 0.5; card.lapses = (card.lapses || 0) + 1; }
    else if (rating === 2) stability = Math.max(0.5, stability * 1.2);
    else if (rating === 3) stability = Math.max(0.5, stability * 2.5);
    else stability = Math.max(0.5, stability * 4.0);

    card.stability = Math.min(365, stability);
    card.due = now + card.stability * 864e5;
    card.reps = (card.reps || 0) + 1;
    card.lastRating = rating;
    this.cards[card.wordId] = card;
    this.saveCards();

    const stats = this.loadStats();
    stats.reviews++;
    if (rating >= 3) stats.correct++;
    this.saveStats(stats);

    // Sync to server (debounced)
    if (typeof API !== 'undefined' && API.getToken()) {
      API.updateProgress({ srs: this.cards, srs_stats: stats });
    }

    this.session.results.push({ wordId: card.wordId, rating });
    this.session.index++;
    this.showCard();
  },

  /* ---- Review summary ---- */
  finishReview() {
    const { results } = this.session;
    const total = results.length;
    if (total === 0) { this.renderDashboard(); return; }
    const good = results.filter(r => r.rating >= 3).length;
    const pct = Math.round(good / total * 100);

    const breakdown = [0, 0, 0, 0];
    results.forEach(r => breakdown[r.rating - 1]++);
    const labels = ['Again', 'Hard', 'Good', 'Easy'];
    const colors = ['#D33131', '#F49000', '#58CC02', '#1CB0F6'];

    this.page.innerHTML = `
      <div class="b-summary">
        <h2>Session Complete</h2>
        <div class="card">
          <div class="stat-row">
            <div class="stat"><div class="num">${total}</div><div class="label">Reviewed</div></div>
            <div class="stat"><div class="num">${pct}%</div><div class="label">Accuracy</div></div>
          </div>
          <div class="b-breakdown">
            ${breakdown.map((count, i) => `<div class="b-break-item">
              <div class="b-break-bar" style="height:${Math.max(4, count / total * 80)}px;background:${colors[i]}"></div>
              <div class="b-break-count">${count}</div>
              <div class="b-break-label">${labels[i]}</div>
            </div>`).join('')}
          </div>
        </div>
        <button class="btn btn-b" onclick="VersionB.renderDashboard()">Back to Dashboard</button>
      </div>`;
  },

  /* ---- Collection browse ---- */
  showCollection(category) {
    const cat = CATEGORIES[category];
    if (!cat) return;
    const words = WORDS.filter(w => w.cat === category);

    const listHtml = words.map(w => {
      const card = this.cards[w.id];
      const reviewed = card && card.reps > 0;
      return `<div class="b-word-row${reviewed ? ' b-word-known' : ''}">
        <div class="b-word-serto serto">${w.serto}</div>
        <div class="b-word-info">
          <div class="b-word-latin">${w.latin}</div>
          <div class="b-word-meaning">${w.en}</div>
        </div>
        ${w.gender ? `<span class="b-gender-tag">${w.gender === 'm' ? 'm.' : 'f.'}</span>` : ''}
      </div>`;
    }).join('');

    this.page.innerHTML = `
      <div class="b-collection">
        <div class="b-collection-header">
          <button class="b-back-btn" onclick="VersionB.renderDashboard()">&#8592; Back</button>
          <h2>${cat.icon} ${cat.name}</h2>
          <p class="b-collection-sub">${cat.de} &middot; ${words.length} words</p>
        </div>
        <div class="b-word-list">${listHtml}</div>
      </div>`;
  }
};
