/**
 * 音标奇趣岛 - 高可用真人语音与互动音效引擎 (v2)
 * 优先使用标准真人词典 HTTPS MP3（全平台/微信/iOS/安卓 100% 兼容），
 * 离线或网络异常时自动无缝降级到修复版 Web Speech API，并用 Web Audio API 合成游戏音效。
 */
(function (root) {
  'use strict';

  /**
   * 构造标准真人英语词典 MP3 地址
   * @param {string} word 英文单词
   * @param {string} accent 口音 'en-GB'（英音）| 'en-US'（美音）
   * @returns {string}
   */
  function buildDictAudioUrl(word, accent) {
    const clean = String(word || '').trim().toLowerCase();
    if (!clean) return '';
    const type = accent === 'en-US' ? 2 : 1; // 1=英式真人发音, 2=美式真人发音
    return `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(clean)}&type=${type}`;
  }

  /** 将用户设置的语速映射到 HTML5 Audio 的舒适播放倍率（不变调） */
  function mapPlaybackRate(rate, slow = false) {
    let target = typeof rate === 'number' ? rate : 0.85;
    if (slow) target = Math.min(target, 0.72);
    // 0.65~1.05 之间最自然清晰，不失真
    return Math.max(0.65, Math.min(1.1, Number(target.toFixed(2))));
  }

  class SoundEngine {
    constructor() {
      this.accent = 'en-GB';
      this.rate = 0.82;
      this.sfxEnabled = true;
      this.audioCtx = null;
      this.voices = [];
      this.player = null; // 复用单一 HTMLAudioElement，解决 iOS/微信音频拦截
      this.playToken = 0;
      this.unlocked = false;
      this.preloadCache = new Set();

      this._initVoices();
      this._initPlayer();
      this._bindUnlockGesture();
    }

    /** 初始化并监听浏览器可用语音列表（作为离线兜底） */
    _initVoices() {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
      const load = () => {
        try {
          this.voices = window.speechSynthesis.getVoices() || [];
        } catch (e) {
          this.voices = [];
        }
      };
      load();
      if (typeof window.speechSynthesis.onvoiceschanged !== 'undefined') {
        window.speechSynthesis.onvoiceschanged = load;
      }
    }

    /** 初始化复用的 HTML5 Audio 播放器 */
    _initPlayer() {
      if (typeof window === 'undefined' || typeof Audio === 'undefined') return;
      try {
        const audio = new Audio();
        audio.preload = 'auto';
        audio.setAttribute('playsinline', '');
        audio.setAttribute('webkit-playsinline', '');
        this.player = audio;
      } catch (e) {
        this.player = null;
      }
    }

    /**
     * 监听首次用户触摸/点击，立即解锁 iOS Safari / 微信内置浏览器音频上下文
     */
    _bindUnlockGesture() {
      if (typeof document === 'undefined') return;
      const unlock = () => {
        if (this.unlocked) return;
        this.unlocked = true;
        this._ensureAudioCtx();
        // 用极短静音音符激活 Web Audio（iOS Safari 解锁标准做法）
        try {
          if (this.audioCtx && this.audioCtx.state === 'suspended') {
            this.audioCtx.resume().catch(() => {});
          }
        } catch (e) {}
      };
      ['touchstart', 'pointerdown', 'click'].forEach((evt) => {
        document.addEventListener(evt, unlock, { capture: true, passive: true });
      });
    }

    /** 更新语音配置 */
    configure({ accent, rate, sfxEnabled } = {}) {
      if (accent) this.accent = accent;
      if (typeof rate === 'number') this.rate = rate;
      if (typeof sfxEnabled === 'boolean') this.sfxEnabled = sfxEnabled;
    }

    /** 是否支持任意一种英语发音能力（HTML5 Audio 或 Web Speech） */
    isAudioAvailable() {
      return Boolean(this.player) || this.isSpeechSupported();
    }

    /** 检查是否支持浏览器内置 Web Speech API */
    isSpeechSupported() {
      return typeof window !== 'undefined' && 'speechSynthesis' in window;
    }

    /** 静默预加载单词发音 MP3，提升点击即响体验 */
    preload(word, accent) {
      if (typeof Image === 'undefined' && typeof Audio === 'undefined') return;
      const url = buildDictAudioUrl(word, accent || this.accent);
      if (!url || this.preloadCache.has(url)) return;
      this.preloadCache.add(url);
      if (typeof Audio !== 'undefined') {
        try {
          const pre = new Audio();
          pre.preload = 'auto';
          pre.src = url;
          pre.load();
        } catch (e) {}
      }
    }

    /**
     * 朗读英文单词或短语（优先真人词典 MP3，失败自动无缝降级到 Web Speech）
     * @param {string} text 待朗读文本
     * @param {object} [options] { accent, rate, slow, onStart, onEnd, onError }
     */
    speak(text, options = {}) {
      const clean = String(text || '').trim();
      if (!clean) return false;

      const token = ++this.playToken;
      const accent = options.accent || this.accent;
      const rate = typeof options.rate === 'number' ? options.rate : this.rate;
      const slow = Boolean(options.slow);

      // 优先使用标准真人 MP3（微信 / iOS / 国产安卓全平台稳定出声）
      if (this.player) {
        const url = buildDictAudioUrl(clean, accent);
        if (url) {
          this._playMp3WithFallback(url, clean, { token, accent, rate, slow, ...options });
          return true;
        }
      }

      // 兜底使用浏览器自带 Web Speech API
      return this._speakViaWebSpeech(clean, { token, accent, rate, slow, ...options });
    }

    /** 通过复用 HTMLAudioElement 播放真人 MP3，带超时与自动降级 */
    _playMp3WithFallback(url, fallbackText, opts) {
      const audio = this.player;
      const { token, onStart, onEnd } = opts;
      let settled = false;
      let started = false;
      let timeoutId = null;

      const cleanup = () => {
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }
        audio.onplaying = null;
        audio.onended = null;
        audio.onerror = null;
      };

      const finish = () => {
        if (settled) return;
        settled = true;
        cleanup();
        if (token === this.playToken && onEnd) onEnd();
      };

      const fallback = () => {
        if (settled) return;
        settled = true;
        cleanup();
        if (token !== this.playToken) return;
        const ok = this._speakViaWebSpeech(fallbackText, opts);
        if (!ok && onEnd) onEnd();
      };

      try {
        audio.pause();
        audio.currentTime = 0;
      } catch (e) {}

      audio.src = url;
      // playbackRate 需在设完 src 后和播放时同步设定，兼容 iOS Safari
      const targetRate = mapPlaybackRate(opts.rate, opts.slow);
      try {
        audio.defaultPlaybackRate = targetRate;
        audio.playbackRate = targetRate;
      } catch (e) {}

      audio.onplaying = () => {
        if (token !== this.playToken) return;
        started = true;
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }
        try {
          audio.playbackRate = targetRate;
        } catch (e) {}
        if (onStart) onStart();
      };

      audio.onended = finish;
      audio.onerror = fallback;

      // 3.5 秒网络超时保护：若未起播自动降级到 Web Speech
      timeoutId = setTimeout(() => {
        if (!started && !settled) {
          fallback();
        }
      }, 3500);

      try {
        const playPromise = audio.play();
        if (playPromise && typeof playPromise.then === 'function') {
          playPromise.catch(() => {
            // 若因自动播放策略被拦截或网络失败，尝试降级
            if (!started && !settled) {
              fallback();
            }
          });
        }
      } catch (err) {
        fallback();
      }
    }

    /** 根据口音挑选最清晰自然的英语发音人（兜底用） */
    _pickVoice(langPref) {
      if (!this.voices.length && this.isSpeechSupported()) {
        try {
          this.voices = window.speechSynthesis.getVoices() || [];
        } catch (e) {
          this.voices = [];
        }
      }
      if (!this.voices.length) return null;

      const target = (langPref || this.accent).toLowerCase();
      const exact = this.voices.filter(
        (v) => v.lang && v.lang.toLowerCase().replace('_', '-') === target
      );
      const preferredNames = [
        'google', 'natural', 'samantha', 'daniel', 'serena', 'karen', 'alex', 'aria', 'libby'
      ];
      const topPick = exact.find((v) =>
        preferredNames.some((name) => v.name.toLowerCase().includes(name))
      );
      if (topPick) return topPick;
      if (exact.length) return exact[0];

      return this.voices.find((v) => v.lang && v.lang.toLowerCase().startsWith('en')) || null;
    }

    /** 修复版 Web Speech API 兜底（避免 iOS Safari cancel 后立即 speak 吞音） */
    _speakViaWebSpeech(text, options = {}) {
      if (!this.isSpeechSupported() || !text) return false;
      try {
        const synth = window.speechSynthesis;
        const doSpeak = () => {
          if (options.token && options.token !== this.playToken) return;
          const utter = new SpeechSynthesisUtterance(text);
          const voice = this._pickVoice(options.accent || this.accent);
          if (voice) {
            utter.voice = voice;
            utter.lang = voice.lang;
          } else {
            utter.lang = options.accent || this.accent;
          }
          utter.rate = mapPlaybackRate(options.rate, options.slow);
          utter.pitch = 1.02;
          utter.volume = 1;
          if (options.onStart) utter.onstart = options.onStart;
          if (options.onEnd) {
            utter.onend = options.onEnd;
            utter.onerror = options.onEnd;
          }
          synth.speak(utter);
        };

        if (synth.speaking || synth.pending) {
          synth.cancel();
          setTimeout(doSpeak, 60);
        } else {
          doSpeak();
        }
        return true;
      } catch (err) {
        return false;
      }
    }

    /**
     * 朗读音标示范词
     * @param {object} ipaItem 音标数据对象
     * @param {object} [options]
     */
    speakIPA(ipaItem, options = {}) {
      if (!ipaItem) return false;
      const word = ipaItem.speakWord || (ipaItem.spellingRules && ipaItem.spellingRules[0]?.word) || '';
      return this.speak(word, {
        slow: Boolean(options.slow),
        rate: options.slow ? Math.max(0.65, this.rate - 0.16) : this.rate,
        onStart: options.onStart,
        onEnd: options.onEnd
      });
    }

    /** 获取或创建 Web Audio 上下文（兼容 iOS Safari 解锁） */
    _ensureAudioCtx() {
      if (typeof window === 'undefined') return null;
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return null;
      if (!this.audioCtx) {
        this.audioCtx = new Ctx();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume().catch(() => {});
      }
      return this.audioCtx;
    }

    /** 播放单个合成音效音符 */
    _tone(freq, duration, startOffset = 0, type = 'sine', gainVal = 0.14) {
      if (!this.sfxEnabled) return;
      const ctx = this._ensureAudioCtx();
      if (!ctx) return;

      const startAt = () => {
        const now = ctx.currentTime + startOffset;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.exponentialRampToValueAtTime(gainVal, now + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + duration + 0.02);
      };

      if (ctx.state === 'suspended') {
        ctx.resume().then(startAt).catch(() => {});
      } else {
        startAt();
      }
    }

    playClick() {
      this._tone(587.33, 0.07, 0, 'triangle', 0.1);
    }

    playFlip() {
      this._tone(440, 0.06, 0, 'sine', 0.08);
      this._tone(660, 0.08, 0.04, 'sine', 0.08);
    }

    playCorrect(combo = 1) {
      const shift = Math.min(combo - 1, 6) * 28;
      this._tone(523.25 + shift, 0.12, 0, 'triangle', 0.14);
      this._tone(659.25 + shift, 0.12, 0.08, 'triangle', 0.14);
      this._tone(783.99 + shift, 0.22, 0.16, 'triangle', 0.16);
    }

    playWrong() {
      this._tone(280, 0.14, 0, 'sine', 0.11);
      this._tone(235, 0.2, 0.12, 'sine', 0.11);
    }

    playVictory() {
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((f, idx) => {
        this._tone(f, idx === 3 ? 0.35 : 0.12, idx * 0.09, 'triangle', 0.15);
      });
    }
  }

  const AudioModule = {
    SoundEngine,
    buildDictAudioUrl,
    mapPlaybackRate
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = AudioModule;
  } else {
    root.IPAAudio = AudioModule;
  }
})(typeof globalThis !== 'undefined' ? globalThis : window);
