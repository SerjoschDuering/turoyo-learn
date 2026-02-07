/* recorder.js — Audio recording engine + state management */
/* Depends on: WORDS, CATEGORIES from data.js                */
/* Depends on: RecorderUI from recorder-ui.js (loaded first) */

var Recorder = (function () {
  'use strict';

  var LS_SPEAKER = 'turoyo_rec_speaker';
  var LS_STORIES = 'turoyo_stories';
  var MAX_DURATION = 300; // 5 minutes for stories/sayings

  var container = null;
  var mode = 'words'; // 'words' or 'stories'
  var activeCat = null;
  var mediaStream = null;
  var mediaRecorder = null;
  var audioContext = null;
  var analyser = null;
  var chunks = [];
  var recStartTime = 0;
  var recTimer = null;
  var recTarget = null; // { type:'word', wordId } or { type:'story' }
  var isRecording = false;
  var playingAudio = null;
  var playingTarget = null;
  var playRafId = null;

  /* ---- Storage helpers ---- */
  function getSpeaker() { return localStorage.getItem(LS_SPEAKER) || ''; }
  function setSpeaker(name) { localStorage.setItem(LS_SPEAKER, name.trim()); }

  function getWordRecording(wordId) {
    var raw = localStorage.getItem('turoyo_rec_' + wordId);
    return raw || null;
  }
  function saveWordRecording(wordId, base64) {
    localStorage.setItem('turoyo_rec_' + wordId, base64);
  }

  function getStories() {
    try { return JSON.parse(localStorage.getItem(LS_STORIES)) || []; }
    catch (e) { return []; }
  }
  function saveStories(stories) {
    localStorage.setItem(LS_STORIES, JSON.stringify(stories));
  }

  function getStorageStats() {
    var wordCount = 0;
    var totalSize = 0;
    WORDS.forEach(function (w) {
      var rec = localStorage.getItem('turoyo_rec_' + w.id);
      if (rec) { wordCount++; totalSize += rec.length; }
    });
    var stories = getStories();
    stories.forEach(function (s) { totalSize += (s.audio || '').length; });
    var sizeMB = (totalSize * 0.75 / 1024 / 1024).toFixed(1); // base64 → bytes approx
    return { wordCount: wordCount, storyCount: stories.length, sizeMB: sizeMB };
  }

  /* ---- Microphone & Recording ---- */
  function requestMic(callback) {
    if (mediaStream) { callback(null); return; }
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(function (stream) {
        mediaStream = stream;
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        var source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);
        callback(null);
      })
      .catch(function (err) { callback(err); });
  }

  function startRecording(target) {
    if (isRecording) return;
    var speaker = getSpeaker();
    if (!speaker) {
      var name = prompt('Who is speaking?\n(e.g., Hathto, Babo, Emo, Mayme...)');
      if (!name || !name.trim()) return;
      setSpeaker(name);
    }
    requestMic(function (err) {
      if (err) { RecorderUI.showPermError(container); return; }
      isRecording = true;
      recTarget = target;
      chunks = [];
      var mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus' : 'audio/mp4';
      mediaRecorder = new MediaRecorder(mediaStream, { mimeType: mimeType });
      mediaRecorder.ondataavailable = function (e) { if (e.data.size > 0) chunks.push(e.data); };
      mediaRecorder.onstop = function () { onRecordingDone(); };
      mediaRecorder.start(100);
      recStartTime = Date.now();
      recTimer = setInterval(function () { onRecTick(); }, 100);
      render();
    });
  }

  function stopRecording() {
    if (!isRecording || !mediaRecorder) return;
    isRecording = false;
    clearInterval(recTimer);
    mediaRecorder.stop();
  }

  function onRecTick() {
    var elapsed = (Date.now() - recStartTime) / 1000;
    if (elapsed >= MAX_DURATION) { stopRecording(); return; }
    RecorderUI.updateRecIndicator(container, elapsed, analyser);
  }

  function onRecordingDone() {
    var blob = new Blob(chunks, { type: mediaRecorder.mimeType });
    var reader = new FileReader();
    reader.onloadend = function () {
      var base64 = reader.result;
      var duration = Math.round((Date.now() - recStartTime) / 1000);
      if (recTarget && recTarget.type === 'word') {
        saveWordRecording(recTarget.wordId, base64);
      } else if (recTarget && recTarget.type === 'story') {
        var title = recTarget.title || 'Untitled';
        var stories = getStories();
        stories.unshift({
          id: 'story_' + Date.now(),
          title: title,
          speaker: getSpeaker(),
          date: new Date().toISOString().slice(0, 10),
          audio: base64,
          duration: duration
        });
        saveStories(stories);
      }
      recTarget = null;
      render();
    };
    reader.readAsDataURL(blob);
  }

  /* ---- Playback ---- */
  function playAudio(base64, targetKey) {
    stopPlayback();
    var audio = new Audio(base64);
    playingAudio = audio;
    playingTarget = targetKey;
    audio.onended = function () { stopPlayback(); render(); };
    audio.play();
    animatePlayback();
    render();
  }

  function stopPlayback() {
    if (playingAudio) {
      playingAudio.pause();
      playingAudio.currentTime = 0;
      playingAudio = null;
    }
    playingTarget = null;
    cancelAnimationFrame(playRafId);
  }

  function animatePlayback() {
    if (!playingAudio || playingAudio.paused) return;
    var pct = playingAudio.duration
      ? (playingAudio.currentTime / playingAudio.duration) * 100 : 0;
    RecorderUI.updatePlayProgress(container, playingTarget, pct);
    playRafId = requestAnimationFrame(animatePlayback);
  }

  /* ---- Story management ---- */
  function deleteStory(storyId) {
    if (!confirm('Delete this recording?')) return;
    var stories = getStories().filter(function (s) { return s.id !== storyId; });
    saveStories(stories);
    render();
  }

  function deleteWordRecording(wordId) {
    localStorage.removeItem('turoyo_rec_' + wordId);
    render();
  }

  function changeSpeaker() {
    var name = prompt('Who is speaking?', getSpeaker());
    if (name && name.trim()) { setSpeaker(name); render(); }
  }

  /* ---- Mode switching & Rendering ---- */
  function setMode(newMode) { mode = newMode; stopPlayback(); render(); }
  function setCat(cat) { activeCat = cat; render(); }

  function render() {
    if (!container) return;
    var catKeys = [];
    var seen = {};
    WORDS.forEach(function (w) {
      if (!seen[w.cat] && CATEGORIES[w.cat]) { catKeys.push(w.cat); seen[w.cat] = true; }
    });
    if (!activeCat) activeCat = catKeys[0] || null;
    var words = activeCat ? WORDS.filter(function (w) { return w.cat === activeCat; }) : [];

    RecorderUI.render(container, {
      mode: mode,
      speaker: getSpeaker(),
      activeCat: activeCat,
      catKeys: catKeys,
      words: words,
      stories: getStories(),
      stats: getStorageStats(),
      isRecording: isRecording,
      recTarget: recTarget,
      recElapsed: isRecording ? (Date.now() - recStartTime) / 1000 : 0,
      playingTarget: playingTarget,
      getWordRecording: getWordRecording
    });
  }

  /* ---- Public API (called by RecorderUI onclick handlers) ---- */
  function init(el) {
    container = el;
    activeCat = null;
    mode = 'words';
    render();
  }

  // Expose for inline onclick in RecorderUI templates
  return {
    init: init,
    setMode: setMode,
    setCat: setCat,
    startRecording: startRecording,
    stopRecording: stopRecording,
    playAudio: playAudio,
    stopPlayback: stopPlayback,
    deleteStory: deleteStory,
    deleteWordRecording: deleteWordRecording,
    changeSpeaker: changeSpeaker,
    getSpeaker: getSpeaker,
    getStories: getStories,
    getStorageStats: getStorageStats,
    getWordRecording: getWordRecording,
    isRecording: function () { return isRecording; }
  };
})();
