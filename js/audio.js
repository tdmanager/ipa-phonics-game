/**
 * 音标奇趣岛 - 语音朗读与互动音效引擎
 * 使用浏览器内置 Web Speech API 进行英语发音，Web Audio API 合成清脆游戏音效
 */
(function (root) {
  'use strict';

  class SoundEngine {
    constructor() {
      this.accent = 'en-GB'; // 默认英式发音（更贴近 48 国际音标体系）
      this.rate = 0.82; // 儿童友好语速
      this.sfxEnabled = true;
      this.audioCtx = null;
      this.voices = [];
      this._initVoices();
    }

    /** 初始化并监听浏览器可用语音列表 */
    _initVoices() {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
      const load = () => {
        this.voices = window.speechSynthesis.getVoices() || [];
      };
      load();
      if (typeof window.speechSynthesis.onvoiceschanged !== 'undefined') {
        window.speechSynthesis.onvoiceschanged = load;
      }
    }

    /** 更新语音配置 */
    configure({ accent, rate, sfxEnabled } = {}) {
      if (accent) this.accent = accent;
      if (typeof rate === 'number') this.rate = rate;
      if (typeof sfxEnabled === 'boolean') this.sfxEnabled = sfxEnabled;
    }

    /** 检查是否支持语音合成 */
    isSpeechSupported() {
      return typeof window !== 'undefined' && 'speechSynthesis' in window;
    }

    /** 根据口音挑选最清晰自然的英语发音人 */
    _pickVoice(langPref) {
      if (!this.voices.length && this.isSpeechSupported()) {
        this.voices = window.speechSynthesis.getVoices() || [];
      }
      if (!this.voices.length) return null;

      const target = (langPref || this.accent).toLowerCase();
      // 1. 优先匹配高音质自然语音（Google / Natural / Samantha / Daniel / Serena）
      const exact = this.voices.filter((v) => v.lang && v.lang.toLowerCase().replace('_', '-') === target);
      const preferredNames = ['google', 'natural', 'samantha', 'daniel', 'serena', 'karen', 'alex', 'aria', 'libby'];
      const topPick = exact.find((v) =>
        preferredNames.some((name) => v.name.toLowerCase().includes(name))
      );
      if (topPick) return topPick;
      if (exact.length) return exact[0];

      // 2. 退化到任意英语语音
      const anyEn = this.voices.find((v) => v.lang && v.lang.toLowerCase().startsWith('en'));
      return anyEn || null;
    }

    /**
     * 朗读英文单词或短语
     * @param {string} text 待朗读文本
     * @param {object} [options] 可选配置 { rate, onStart, onEnd }
     */
    speak(text, options = {}) {
      if (!this.isSpeechSupported() || !text) return false;
      try {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(text);
        const voice = this._pickVoice(options.accent || this.accent);
        if (voice) {
          utter.voice = voice;
          utter.lang = voice.lang;
        } else {
          utter.lang = options.accent || this.accent;
        }
        utter.rate = typeof options.rate === 'number' ? options.rate : this.rate;
        utter.pitch = typeof options.pitch === 'number' ? options.pitch : 1.05;
        utter.volume = 1;
        if (options.onStart) utter.onstart = options.onStart;
        if (options.onEnd) {
          utter.onend = options.onEnd;
          utter.onerror = options.onEnd;
        }
        window.speechSynthesis.speak(utter);
        return true;
      } catch (err) {
        return false;
      }
    }

    /**
     * 朗读音标示范：读出该音标最清晰的代表词（支持慢速清晰跟读）
     * @param {object} ipaItem 音标数据对象
     * @param {object} [options]
     */
    speakIPA(ipaItem, options = {}) {
      if (!ipaItem) return false;
      const word = ipaItem.speakWord || (ipaItem.spellingRules && ipaItem.spellingRules[0]?.word) || '';
      return this.speak(word, {
        rate: options.slow ? Math.max(0.55, this.rate - 0.2) : this.rate,
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

    /** 播放单个音符 */
    _tone(freq, duration, startOffset = 0, type = 'sine', gainVal = 0.14) {
      if (!this.sfxEnabled) return;
      const ctx = this._ensureAudioCtx();
      if (!ctx) return;

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
    }

    /** 轻快点击音效 */
    playClick() {
      this._tone(587.33, 0.07, 0, 'triangle', 0.1);
    }

    /** 翻牌音效 */
    playFlip() {
      this._tone(440, 0.06, 0, 'sine', 0.08);
      this._tone(660, 0.08, 0.04, 'sine', 0.08);
    }

    /** 答对清脆和弦（支持连击升调） */
    playCorrect(combo = 1) {
      const shift = Math.min(combo - 1, 6) * 28;
      this._tone(523.25 + shift, 0.12, 0, 'triangle', 0.14);
      this._tone(659.25 + shift, 0.12, 0.08, 'triangle', 0.14);
      this._tone(783.99 + shift, 0.22, 0.16, 'triangle', 0.16);
    }

    /** 轻柔提示音（答错时温和反馈，不吓到孩子） */
    playWrong() {
      this._tone(280, 0.14, 0, 'sine', 0.11);
      this._tone(235, 0.2, 0.12, 'sine', 0.11);
    }

    /** 通关/解锁勋章欢呼旋律 */
    playVictory() {
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((f, idx) => {
        this._tone(f, idx === 3 ? 0.35 : 0.12, idx * 0.09, 'triangle', 0.15);
      });
    }
  }

  const AudioModule = { SoundEngine };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = AudioModule;
  } else {
    root.IPAAudio = AudioModule;
  }
})(typeof globalThis !== 'undefined' ? globalThis : window);
