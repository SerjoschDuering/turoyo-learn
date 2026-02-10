/* api.js -- Frontend API wrapper for n8n proxy endpoints */
/* No dependencies. Exposes global API object.              */

const API = (() => {
  const CONTENT_URL = 'https://run8n.xyz/webhook/surayt-content';
  const USER_URL    = 'https://run8n.xyz/webhook/surayt-user';
  const AUDIO_URL   = 'https://run8n.xyz/webhook/surayt-audio';
  const APP_KEY     = 'surayt-2026-key';

  const LS_CONTENT  = 'surayt_api_content';
  const LS_TOKEN    = 'surayt_user_token';

  let contentCache = null;
  let progressTimer = null;
  let pendingProgress = null;
  const DEBOUNCE_MS = 5000;
  const FETCH_TIMEOUT_MS = 8000;

  /* ---- Helpers ---- */
  function fetchWithTimeout(url, opts) {
    if (typeof AbortController !== 'undefined') {
      var ctrl = new AbortController();
      var timer = setTimeout(function () { ctrl.abort(); }, FETCH_TIMEOUT_MS);
      opts = Object.assign({}, opts, { signal: ctrl.signal });
      return fetch(url, opts).finally(function () { clearTimeout(timer); });
    }
    return fetch(url, opts);
  }

  function post(url, body) {
    return fetchWithTimeout(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-App-Key': APP_KEY },
      body: JSON.stringify(body)
    }).then(r => {
      if (!r.ok) throw new Error('API error ' + r.status);
      return r.json();
    }).then(d => Array.isArray(d) ? d[0] : d);
  }

  /* ---- Content API ---- */
  function fetchContent(forceRefresh) {
    if (contentCache && !forceRefresh) return Promise.resolve(contentCache);
    return fetchWithTimeout(CONTENT_URL, {})
      .then(r => {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(d => {
        const data = Array.isArray(d) ? d[0] : d;
        contentCache = data;
        try { localStorage.setItem(LS_CONTENT, JSON.stringify(data)); } catch (e) {}
        return data;
      })
      .catch(() => {
        try {
          const cached = localStorage.getItem(LS_CONTENT);
          if (cached) { contentCache = JSON.parse(cached); return contentCache; }
        } catch (e) {}
        return null;
      });
  }

  /* ---- User API ---- */
  function getToken() { return localStorage.getItem(LS_TOKEN) || ''; }
  function setToken(t) { localStorage.setItem(LS_TOKEN, t); }

  function getUser(token) {
    return post(USER_URL, { action: 'get_user', token: token || getToken() });
  }

  function createUser(displayName, lang) {
    return post(USER_URL, {
      action: 'create_user',
      display_name: displayName || 'Learner',
      lang: lang || 'en'
    }).then(user => {
      if (user && user.token) setToken(user.token);
      return user;
    });
  }

  function updateProgress(progress) {
    const token = getToken();
    if (!token) return;
    // Merge with any pending progress (don't overwrite cross-module data)
    if (pendingProgress) {
      pendingProgress.progress = Object.assign(pendingProgress.progress, progress);
    } else {
      pendingProgress = { action: 'update_progress', token: token, progress: progress };
    }
    if (!progressTimer) {
      progressTimer = setTimeout(flushProgress, DEBOUNCE_MS);
    }
  }

  function flushProgress() {
    clearTimeout(progressTimer);
    progressTimer = null;
    if (!pendingProgress) return;
    const payload = pendingProgress;
    pendingProgress = null;
    // Use sendBeacon for reliability during page unload
    if (document.visibilityState === 'hidden' && navigator.sendBeacon) {
      navigator.sendBeacon(USER_URL, new Blob(
        [JSON.stringify(payload)],
        { type: 'application/json' }
      ));
      return;
    }
    post(USER_URL, payload).catch(() => {});
  }

  function heartbeat() {
    const token = getToken();
    if (!token) return Promise.resolve();
    return post(USER_URL, { action: 'heartbeat', token: token }).catch(() => {});
  }

  /* ---- Audio API ---- */
  function uploadRecording(opts) {
    return post(AUDIO_URL, {
      action: 'upload',
      token: getToken(),
      word_id: opts.wordId || null,
      type: opts.type || 'word',
      title: opts.title || '',
      speaker: opts.speaker || '',
      audio_data: opts.audioData,
      duration: opts.duration || 0
    });
  }

  function listRecordings(token) {
    return post(AUDIO_URL, { action: 'list', token: token || getToken() });
  }

  function deleteRecording(rowId) {
    return post(AUDIO_URL, { action: 'delete', token: getToken(), row_id: rowId });
  }

  /* ---- Lifecycle ---- */
  if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') flushProgress();
    });
    window.addEventListener('beforeunload', flushProgress);
  }

  return {
    fetchContent,
    getToken,
    setToken,
    getUser,
    createUser,
    updateProgress,
    flushProgress,
    heartbeat,
    uploadRecording,
    listRecordings,
    deleteRecording
  };
})();
