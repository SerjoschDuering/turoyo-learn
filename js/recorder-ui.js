/* recorder-ui.js — Rendering templates for the recording feature */
/* Loaded BEFORE recorder.js so RecorderUI is available as a global */

var RecorderUI = (function () {
  'use strict';

  function formatTime(secs) {
    var m = Math.floor(secs / 60);
    var s = Math.floor(secs % 60);
    return m + ':' + (s < 10 ? '0' : '') + s;
  }

  /* ---- Main render ---- */
  function render(el, state) {
    var html = '<div class="rec-studio">';
    html += renderHeader(state);
    html += renderModeTabs(state.mode);
    if (state.mode === 'words') html += renderWordMode(state);
    else html += renderStoryMode(state);
    html += renderExportBtn();
    html += '</div>';
    el.innerHTML = html;
  }

  function renderHeader(state) {
    var stats = state.stats;
    var speakerHtml = state.speaker
      ? '<span class="rec-speaker-badge" onclick="Recorder.changeSpeaker()">' + esc(state.speaker) + '</span>'
      : '<span class="rec-speaker-badge" onclick="Recorder.changeSpeaker()">Set speaker name</span>';
    return '<div class="rec-header">'
      + '<h2>Family Voice Library</h2>'
      + '<p class="rec-subtitle">Record family members speaking Turoyo. '
      + 'Preserve voices for the next generation.</p>'
      + '<div class="rec-stats-row">'
      + speakerHtml
      + '<span class="rec-stat-chip">' + stats.wordCount + ' words</span>'
      + '<span class="rec-stat-chip">' + stats.storyCount + ' stories</span>'
      + '<span class="rec-stat-chip">' + stats.sizeMB + ' MB</span>'
      + '</div></div>';
  }

  function renderModeTabs(mode) {
    return '<div class="rec-mode-tabs">'
      + '<div class="rec-mode-tab' + (mode === 'words' ? ' active' : '')
      + '" onclick="Recorder.setMode(\'words\')">'
      + '<span class="tab-icon">&#127908;</span>Record Words</div>'
      + '<div class="rec-mode-tab' + (mode === 'stories' ? ' active' : '')
      + '" onclick="Recorder.setMode(\'stories\')">'
      + '<span class="tab-icon">&#128214;</span>Record Stories</div>'
      + '</div>';
  }

  /* ---- Word Mode ---- */
  function renderWordMode(state) {
    var html = '<div class="rec-cat-pills">';
    state.catKeys.forEach(function (key) {
      var cat = CATEGORIES[key];
      html += '<div class="rec-cat-pill' + (key === state.activeCat ? ' active' : '')
        + '" onclick="Recorder.setCat(\'' + key + '\')">'
        + cat.icon + ' ' + cat.name + '</div>';
    });
    html += '</div>';
    html += '<div class="rec-word-list">';
    state.words.forEach(function (w) {
      html += renderWordCard(w, state);
    });
    if (state.words.length === 0) {
      html += '<div class="rec-empty">No words in this category.</div>';
    }
    html += '</div>';
    return html;
  }

  function renderWordCard(word, state) {
    var rec = state.getWordRecording(word.id);
    var hasRec = !!rec;
    var isTarget = state.isRecording && state.recTarget
      && state.recTarget.type === 'word' && state.recTarget.wordId === word.id;
    var isPlaying = state.playingTarget === 'word_' + word.id;
    var speaker = hasRec ? Recorder.getSpeaker() : '';

    var html = '<div class="rec-word-card' + (hasRec ? ' has-recording' : '') + '">';
    html += '<div class="rec-word-info">';
    html += '<span class="serto">' + word.serto + '</span>';
    html += '<span class="latin">' + esc(word.latin) + '</span>';
    html += '<span class="english">' + esc(word.en) + '</span>';
    if (hasRec && speaker) {
      html += '<span class="rec-word-speaker">Recorded by ' + esc(speaker) + '</span>';
    }
    html += '</div>';
    html += '<div class="rec-word-actions">';

    if (isTarget) {
      // Currently recording this word — show stop + indicator
      html += '<div class="rec-waveform" id="waveform-' + word.id + '">';
      for (var i = 0; i < 7; i++) html += '<div class="rec-waveform-bar" style="height:4px"></div>';
      html += '</div>';
      html += '<div class="rec-indicator-time" id="rec-time-' + word.id + '">'
        + formatTime(state.recElapsed) + '</div>';
      html += '<button class="rec-btn-record recording" onclick="Recorder.stopRecording()">'
        + '&#9724;</button>';
    } else {
      if (hasRec) {
        // Has recording — show play + re-record
        if (isPlaying) {
          html += '<div style="display:flex;flex-direction:column;align-items:center;gap:2px">';
          html += '<button class="rec-btn-play playing" onclick="Recorder.stopPlayback();'
            + 'Recorder.setMode(\'words\')">&#9724;</button>';
          html += '<div class="rec-progress" id="progress-word_' + word.id + '">'
            + '<div class="rec-progress-fill"></div></div>';
          html += '</div>';
        } else {
          html += '<button class="rec-btn-play" onclick="Recorder.playAudio('
            + 'Recorder.getWordRecording(\'' + word.id + '\'),\'word_' + word.id + '\')">'
            + '&#9654;</button>';
        }
        html += '<button class="rec-btn-record" onclick="Recorder.startRecording('
          + '{type:\'word\',wordId:\'' + word.id + '\'})" title="Re-record">'
          + '&#9679;</button>';
      } else {
        html += '<button class="rec-btn-record" onclick="Recorder.startRecording('
          + '{type:\'word\',wordId:\'' + word.id + '\'})">'
          + '&#9679;</button>';
      }
    }
    html += '</div></div>';
    return html;
  }

  /* ---- Story Mode ---- */
  function renderStoryMode(state) {
    var isRec = state.isRecording && state.recTarget && state.recTarget.type === 'story';
    var html = '<div class="rec-story-input">';
    html += '<label>Record a Story or Saying</label>';
    html += '<input type="text" id="rec-story-title" placeholder="Title (e.g., Grandma\'s lullaby...)" '
      + 'maxlength="80">';
    html += '<div class="rec-story-controls">';

    if (isRec) {
      html += '<div class="rec-indicator">';
      html += '<div class="rec-indicator-dot"></div>';
      html += '<div class="rec-indicator-time" id="rec-story-time">'
        + formatTime(state.recElapsed) + '</div>';
      html += '<div class="rec-waveform" id="waveform-story">';
      for (var i = 0; i < 7; i++) html += '<div class="rec-waveform-bar" style="height:4px"></div>';
      html += '</div>';
      html += '<div class="rec-indicator-label">Max 30s</div>';
      html += '</div>';
      html += '</div><div style="display:flex;justify-content:center;padding:8px 0">';
      html += '<button class="rec-btn-record-lg recording" onclick="Recorder.stopRecording()">'
        + '&#9724;</button>';
    } else {
      html += '<button class="rec-btn-record-lg" onclick="RecorderUI.startStoryRec()">'
        + '&#9679;</button>';
    }
    html += '</div></div>';

    // Story list
    if (state.stories.length > 0) {
      html += '<h3 style="margin:16px 0 8px">Your Recordings</h3>';
      html += '<div class="rec-story-list">';
      state.stories.forEach(function (s) {
        html += renderStoryCard(s, state);
      });
      html += '</div>';
    } else {
      html += '<div class="rec-empty">No stories recorded yet. '
        + 'Record a family saying, proverb, or short story.</div>';
    }
    return html;
  }

  function renderStoryCard(story, state) {
    var isPlaying = state.playingTarget === 'story_' + story.id;
    var html = '<div class="rec-story-card">';
    html += '<div class="rec-story-header">';
    html += '<span class="rec-story-title">' + esc(story.title) + '</span>';
    html += '<span class="rec-story-meta">' + esc(story.date) + '</span>';
    html += '</div>';
    if (story.speaker) {
      html += '<div class="rec-word-speaker">Recorded by ' + esc(story.speaker) + '</div>';
    }
    html += '<div class="rec-story-footer">';

    if (isPlaying) {
      html += '<button class="rec-btn-play playing" onclick="Recorder.stopPlayback();'
        + 'Recorder.setMode(\'stories\')">&#9724;</button>';
      html += '<div class="rec-progress" id="progress-story_' + story.id + '" style="flex:1">'
        + '<div class="rec-progress-fill"></div></div>';
    } else {
      html += '<button class="rec-btn-play" onclick="Recorder.playAudio('
        + 'Recorder.getStories().find(function(s){return s.id===\'' + story.id + '\'}).audio,'
        + '\'story_' + story.id + '\')">&#9654;</button>';
    }
    html += '<span class="rec-story-duration">' + formatTime(story.duration || 0) + '</span>';
    html += '<button class="rec-btn-delete" onclick="Recorder.deleteStory(\'' + story.id
      + '\')" title="Delete">&#128465;</button>';
    html += '</div></div>';
    return html;
  }

  function renderExportBtn() {
    return '<button class="rec-export-btn" onclick="alert(\'Coming soon — share recordings with family!\')">'
      + '&#128228; Export All Recordings</button>';
  }

  /* ---- Live UI updates (called during recording/playback without full re-render) ---- */
  function updateRecIndicator(el, elapsed, analyser) {
    // Update all visible time displays
    var timeEls = el.querySelectorAll('[id^="rec-time-"], #rec-story-time');
    timeEls.forEach(function (t) { t.textContent = formatTime(elapsed); });

    // Update waveform bars
    if (!analyser) return;
    var data = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(data);
    var waveforms = el.querySelectorAll('.rec-waveform:not(.inactive)');
    waveforms.forEach(function (wf) {
      var bars = wf.querySelectorAll('.rec-waveform-bar');
      var step = Math.floor(data.length / bars.length);
      for (var i = 0; i < bars.length; i++) {
        var val = data[i * step] / 255;
        bars[i].style.height = Math.max(4, val * 36) + 'px';
      }
    });
  }

  function updatePlayProgress(el, targetKey, pct) {
    var progressEl = el.querySelector('#progress-' + targetKey);
    if (progressEl) {
      var fill = progressEl.querySelector('.rec-progress-fill');
      if (fill) fill.style.width = pct + '%';
    }
  }

  function showPermError(el) {
    el.innerHTML = '<div class="rec-studio"><div class="rec-permission-error">'
      + '<div class="icon">&#127908;</div>'
      + '<h3>Microphone Access Needed</h3>'
      + '<p>To record family voices, please allow microphone access in your browser settings. '
      + 'This app stores recordings only on your device — nothing is uploaded.</p>'
      + '<button class="btn btn-primary" style="margin-top:16px" '
      + 'onclick="Recorder.init(this.closest(\'.page\'))">Try Again</button>'
      + '</div></div>';
  }

  /* ---- Helper for story recording start (needs DOM access for title input) ---- */
  function startStoryRec() {
    var input = document.getElementById('rec-story-title');
    var title = input ? input.value.trim() : '';
    if (!title) { alert('Please enter a title for your recording.'); if (input) input.focus(); return; }
    Recorder.startRecording({ type: 'story', title: title });
  }

  function esc(str) {
    var d = document.createElement('div');
    d.textContent = str || '';
    return d.innerHTML;
  }

  return {
    render: render,
    updateRecIndicator: updateRecIndicator,
    updatePlayProgress: updatePlayProgress,
    showPermError: showPermError,
    startStoryRec: startStoryRec
  };
})();
