/**
 * 音标奇趣岛 - 核心游戏逻辑与进度引擎（纯函数 + 可持久化状态）
 * 涵盖：听音捉精灵、音标拼词工坊、记忆翻翻乐、错题复习与勋章系统
 */
(function (root) {
  'use strict';

  const STORAGE_KEY = 'ipa_phonics_quest_v1';

  /** 默认玩家进度状态 */
  function createDefaultState() {
    return {
      stars: 0,
      mastered: [], // 已点亮的音标 ID 列表
      mistakes: [], // 需要巩固的音标 ID 列表
      spelledWords: [], // 已拼对的单词列表
      bestCombo: 0,
      memoryWins: 0,
      unlockedBadges: [],
      settings: {
        accent: 'en-GB',
        rate: 0.82,
        sfxEnabled: true
      }
    };
  }

  /** Fisher-Yates 洗牌算法（返回新数组，不修改原数组） */
  function shuffle(array, rng = Math.random) {
    const arr = array.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      const tmp = arr[i];
      arr[i] = arr[j];
      arr[j] = tmp;
    }
    return arr;
  }

  /** 从 localStorage 读取玩家状态 */
  function loadState(storage) {
    const def = createDefaultState();
    const store = storage || (typeof window !== 'undefined' ? window.localStorage : null);
    if (!store) return def;
    try {
      const raw = store.getItem(STORAGE_KEY);
      if (!raw) return def;
      const parsed = JSON.parse(raw);
      return {
        ...def,
        ...parsed,
        mastered: Array.isArray(parsed.mastered) ? parsed.mastered : [],
        mistakes: Array.isArray(parsed.mistakes) ? parsed.mistakes : [],
        spelledWords: Array.isArray(parsed.spelledWords) ? parsed.spelledWords : [],
        unlockedBadges: Array.isArray(parsed.unlockedBadges) ? parsed.unlockedBadges : [],
        settings: { ...def.settings, ...(parsed.settings || {}) }
      };
    } catch (e) {
      return def;
    }
  }

  /** 保存玩家状态到 localStorage */
  function saveState(state, storage) {
    const store = storage || (typeof window !== 'undefined' ? window.localStorage : null);
    if (!store) return false;
    try {
      store.setItem(STORAGE_KEY, JSON.stringify(state));
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * 检查并返回本次新解锁的勋章列表（同时更新 state.unlockedBadges）
   * @param {object} state 玩家状态
   * @param {Array} badges 勋章定义列表
   * @returns {Array} 新解锁的勋章对象数组
   */
  function evaluateBadges(state, badges) {
    const newlyUnlocked = [];
    badges.forEach((badge) => {
      if (!state.unlockedBadges.includes(badge.id) && badge.check(state)) {
        state.unlockedBadges.push(badge.id);
        newlyUnlocked.push(badge);
      }
    });
    return newlyUnlocked;
  }

  /**
   * 切换音标“已掌握”打卡状态
   * @returns {{ mastered: boolean, starsAdded: number }}
   */
  function toggleMastered(state, ipaId) {
    const idx = state.mastered.indexOf(ipaId);
    if (idx >= 0) {
      state.mastered.splice(idx, 1);
      return { mastered: false, starsAdded: 0 };
    }
    state.mastered.push(ipaId);
    // 如果之前在错题本里，掌握后移出错题本
    const mIdx = state.mistakes.indexOf(ipaId);
    if (mIdx >= 0) state.mistakes.splice(mIdx, 1);
    state.stars += 2;
    return { mastered: true, starsAdded: 2 };
  }

  /**
   * 生成【听音捉精灵】一道题目
   * 智能策略：
   * 1. 支持按分类筛选（all / mistakes / 特定家族）
   * 2. 干扰项优先包含该音标的“易混淆双胞胎”（pairWith）与同家族音标，帮助孩子真正听出区别！
   * @param {Array} ipaList 全量 48 音标
   * @param {object} options { category, mistakeIds, excludeId, optionCount, rng }
   */
  function generateCatchQuestion(ipaList, options = {}) {
    const {
      category = 'all',
      mistakeIds = [],
      excludeId = null,
      optionCount = 4,
      rng = Math.random
    } = options;

    let pool = ipaList;
    if (category === 'mistakes' && mistakeIds.length > 0) {
      const mSet = new Set(mistakeIds);
      const filtered = ipaList.filter((item) => mSet.has(item.id));
      if (filtered.length > 0) pool = filtered;
    } else if (category !== 'all' && category !== 'mistakes') {
      const filtered = ipaList.filter((item) => item.category === category);
      if (filtered.length > 0) pool = filtered;
    }

    let candidates = pool.filter((item) => item.id !== excludeId);
    if (candidates.length === 0) candidates = pool;

    const target = candidates[Math.floor(rng() * candidates.length)];
    const chosenMap = new Map([[target.id, target]]);

    // 优先加入易混淆配对音标（如 /iː/ vs /ɪ/，/p/ vs /b/）
    if (target.pairWith) {
      const twin = ipaList.find((item) => item.id === target.pairWith);
      if (twin && !chosenMap.has(twin.id)) {
        chosenMap.set(twin.id, twin);
      }
    }

    // 再从同家族补齐干扰项
    const sameCategory = shuffle(
      ipaList.filter((item) => item.category === target.category && !chosenMap.has(item.id)),
      rng
    );
    for (const item of sameCategory) {
      if (chosenMap.size >= optionCount) break;
      chosenMap.set(item.id, item);
    }

    // 如不足 optionCount，从全量补齐
    if (chosenMap.size < optionCount) {
      const others = shuffle(
        ipaList.filter((item) => !chosenMap.has(item.id)),
        rng
      );
      for (const item of others) {
        if (chosenMap.size >= optionCount) break;
        chosenMap.set(item.id, item);
      }
    }

    const rule = target.spellingRules[Math.floor(rng() * target.spellingRules.length)] || target.spellingRules[0];

    return {
      target,
      promptWord: rule.word,
      promptZh: rule.zh,
      promptEmoji: rule.emoji,
      promptHighlight: rule.highlight,
      options: shuffle(Array.from(chosenMap.values()), rng)
    };
  }

  /**
   * 处理【听音捉精灵】作答结果
   */
  function submitCatchAnswer(state, targetId, selectedId, currentCombo) {
    const isCorrect = targetId === selectedId;
    if (isCorrect) {
      const nextCombo = currentCombo + 1;
      const starsEarned = nextCombo >= 3 ? 3 : 2;
      state.stars += starsEarned;
      if (nextCombo > state.bestCombo) state.bestCombo = nextCombo;
      // 如果答对了错题本里的音标，从错题本移除
      const idx = state.mistakes.indexOf(targetId);
      if (idx >= 0) state.mistakes.splice(idx, 1);
      return { isCorrect: true, nextCombo, starsEarned };
    } else {
      if (!state.mistakes.includes(targetId)) {
        state.mistakes.push(targetId);
      }
      return { isCorrect: false, nextCombo: 0, starsEarned: 0 };
    }
  }

  /**
   * 为【音标拼词工坊】生成一道拼词题目
   * 包含正确音素-字母块 + 2个精选干扰块，让孩子根据读音与音标提示拼出完整单词！
   * @param {Array} spellWords 拼词词库
   * @param {object} options { level, excludeWord, rng }
   */
  function generateSpellPuzzle(spellWords, options = {}) {
    const { level = 0, excludeWord = null, rng = Math.random } = options;

    let pool = level > 0 ? spellWords.filter((w) => w.level === level) : spellWords;
    if (!pool.length) pool = spellWords;
    let candidates = pool.filter((w) => w.word !== excludeWord);
    if (!candidates.length) candidates = pool;

    const puzzle = candidates[Math.floor(rng() * candidates.length)];

    // 正确音素块
    const correctTiles = puzzle.segments.map((seg, idx) => ({
      tileId: `c_${idx}_${seg.letters}`,
      phoneme: seg.phoneme,
      letters: seg.letters,
      isDistractor: false
    }));

    // 收集同级别其他单词的音素块作为干扰块（避免与正确块字母完全重复）
    const existingLetters = new Set(puzzle.segments.map((s) => s.letters));
    const distractorPool = [];
    spellWords.forEach((w) => {
      if (w.word === puzzle.word) return;
      w.segments.forEach((seg) => {
        if (!existingLetters.has(seg.letters)) {
          distractorPool.push(seg);
        }
      });
    });

    const uniqueDistractors = [];
    const seenDist = new Set();
    for (const seg of shuffle(distractorPool, rng)) {
      if (!seenDist.has(seg.letters)) {
        seenDist.add(seg.letters);
        uniqueDistractors.push({
          tileId: `d_${uniqueDistractors.length}_${seg.letters}`,
          phoneme: seg.phoneme,
          letters: seg.letters,
          isDistractor: true
        });
      }
      if (uniqueDistractors.length >= 2) break;
    }

    return {
      puzzle,
      tiles: shuffle([...correctTiles, ...uniqueDistractors], rng)
    };
  }

  /**
   * 校验拼词工坊答案
   * @param {object} puzzle 目标单词对象
   * @param {Array} chosenTiles 玩家按顺序选中的块
   */
  function checkSpellAttempt(state, puzzle, chosenTiles) {
    const assembled = chosenTiles.map((t) => t.letters).join('');
    const isCorrect = assembled === puzzle.word;
    if (isCorrect) {
      const isFirstTime = !state.spelledWords.includes(puzzle.word);
      if (isFirstTime) {
        state.spelledWords.push(puzzle.word);
      }
      const starsEarned = isFirstTime ? 4 : 2;
      state.stars += starsEarned;
      return { isCorrect: true, assembled, starsEarned, isFirstTime };
    }
    return { isCorrect: false, assembled, starsEarned: 0, isFirstTime: false };
  }

  /**
   * 生成【音标记忆翻翻乐】卡组
   * 每对包含 1 张「音标卡」+ 1 张「代表词卡（高亮字母组合）」
   * @param {Array} ipaList 全量音标
   * @param {object} options { pairCount = 6, category = 'all', rng }
   */
  function generateMemoryDeck(ipaList, options = {}) {
    const { pairCount = 6, category = 'all', rng = Math.random } = options;
    let pool = category === 'all' ? ipaList : ipaList.filter((i) => i.category === category);
    if (pool.length < pairCount) pool = ipaList;

    const selected = shuffle(pool, rng).slice(0, pairCount);
    const cards = [];
    selected.forEach((ipa) => {
      const rule = ipa.spellingRules[0];
      cards.push({
        cardId: `${ipa.id}_ipa`,
        pairId: ipa.id,
        type: 'ipa',
        symbol: ipa.symbol,
        nickname: ipa.nickname,
        speakWord: ipa.speakWord,
        matched: false,
        flipped: false
      });
      cards.push({
        cardId: `${ipa.id}_word`,
        pairId: ipa.id,
        type: 'word',
        word: rule.word,
        highlight: rule.highlight,
        zh: rule.zh,
        emoji: rule.emoji,
        speakWord: rule.word,
        matched: false,
        flipped: false
      });
    });

    return shuffle(cards, rng);
  }

  /**
   * 将单词拆分为高亮片段（用于在界面中醒目标记发该音标的字母组合）
   * @returns {Array<{ text: string, isHighlight: boolean }>}
   */
  function splitHighlight(word, highlight) {
    if (!word || !highlight) return [{ text: word || '', isHighlight: false }];
    const idx = word.toLowerCase().indexOf(highlight.toLowerCase());
    if (idx === -1) return [{ text: word, isHighlight: false }];
    const parts = [];
    if (idx > 0) parts.push({ text: word.slice(0, idx), isHighlight: false });
    parts.push({ text: word.slice(idx, idx + highlight.length), isHighlight: true });
    if (idx + highlight.length < word.length) {
      parts.push({ text: word.slice(idx + highlight.length), isHighlight: false });
    }
    return parts;
  }

  const GameLogic = {
    STORAGE_KEY,
    createDefaultState,
    shuffle,
    loadState,
    saveState,
    evaluateBadges,
    toggleMastered,
    generateCatchQuestion,
    submitCatchAnswer,
    generateSpellPuzzle,
    checkSpellAttempt,
    generateMemoryDeck,
    splitHighlight
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameLogic;
  } else {
    root.IPAGameLogic = GameLogic;
  }
})(typeof globalThis !== 'undefined' ? globalThis : window);
