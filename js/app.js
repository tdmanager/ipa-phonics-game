/**
 * 音标奇趣岛 - 页面交互与四大游戏视图控制器
 */
(function () {
  'use strict';

  const { CATEGORIES, IPA_LIST, SPELL_WORDS, BADGES } = window.IPAData;
  const { SoundEngine } = window.IPAAudio;
  const Logic = window.IPAGameLogic;

  const sound = new SoundEngine();
  let state = Logic.loadState();
  sound.configure(state.settings);

  // 全局运行时会话状态
  const runtime = {
    currentView: 'explore',
    exploreCategory: 'all',
    activeDetailId: null,

    // 听音捉精灵
    catchScope: 'all',
    catchCombo: 0,
    catchQuestion: null,
    catchAnswered: false,

    // 音标拼词工坊
    spellLevel: 0,
    spellData: null,
    spellChosen: [],
    spellSolved: false,

    // 记忆翻翻乐
    memoryScope: 'all',
    memoryDeck: [],
    memoryFlippedIdx: [],
    memoryMoves: 0,
    memoryLocked: false
  };

  /** 快速获取 DOM 元素 */
  const $ = (id) => document.getElementById(id);

  /** 安全转义 HTML 文本 */
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /** 将单词渲染为高亮字母组合 HTML */
  function renderHighlightedWord(word, highlight) {
    return Logic.splitHighlight(word, highlight)
      .map((part) =>
        part.isHighlight
          ? `<span class="hl-letter">${escapeHtml(part.text)}</span>`
          : escapeHtml(part.text)
      )
      .join('');
  }

  /** 根据口型类型生成儿童友好卡通 SVG 嘴巴示意图 */
  function renderMouthSvg(shape) {
    const faceBase = `
      <circle cx="38" cy="38" r="32" fill="#FFE6C9" stroke="#F4B183" stroke-width="2"/>
      <circle cx="27" cy="27" r="3" fill="#272343"/>
      <circle cx="49" cy="27" r="3" fill="#272343"/>
      <circle cx="20" cy="36" r="4" fill="#FFB3B3" opacity="0.6"/>
      <circle cx="56" cy="36" r="4" fill="#FFB3B3" opacity="0.6"/>
    `;
    const shapes = {
      smile: `<path d="M23 44 Q38 56 53 44" fill="#FF7A59" stroke="#C2410C" stroke-width="2.2" stroke-linecap="round"/><path d="M27 45 Q38 49 49 45" fill="#fff"/>`,
      'wide-open': `<ellipse cx="38" cy="49" rx="13" ry="11" fill="#C2410C"/><path d="M29 56 Q38 50 47 56 Q38 61 29 56Z" fill="#FF8FA3"/><rect x="30" y="39" width="16" height="4" rx="2" fill="#fff"/>`,
      'round-big': `<ellipse cx="38" cy="49" rx="9" ry="11" fill="#C2410C" stroke="#9A3412" stroke-width="2"/><ellipse cx="38" cy="54" rx="5" ry="3.5" fill="#FF8FA3"/>`,
      'round-small': `<circle cx="38" cy="49" r="6" fill="#C2410C" stroke="#9A3412" stroke-width="2.5"/>`,
      relax: `<ellipse cx="38" cy="48" rx="9" ry="5.5" fill="#C2410C"/><path d="M31 50 Q38 47 45 50" fill="#FF8FA3"/>`,
      glide: `<path d="M25 48 Q32 42 38 48 T51 48" fill="none" stroke="#6C63FF" stroke-width="3.5" stroke-linecap="round"/><circle cx="51" cy="48" r="3.5" fill="#FF7A59"/>`,
      'lips-pop': `<line x1="25" y1="48" x2="51" y2="48" stroke="#C2410C" stroke-width="3.5" stroke-linecap="round"/><path d="M55 43 L62 40 M55 48 L63 48 M55 53 L62 56" stroke="#38BDF8" stroke-width="2" stroke-linecap="round"/>`,
      'teeth-lip': `<path d="M26 45 Q38 44 50 45" stroke="#C2410C" stroke-width="2" fill="none"/><rect x="30" y="45" width="16" height="4.5" rx="1.5" fill="#fff" stroke="#CBD5E1"/><path d="M27 51 Q38 56 49 51" stroke="#FF7A59" stroke-width="3.5" fill="none" stroke-linecap="round"/>`,
      'tongue-teeth': `<rect x="28" y="43" width="20" height="4" rx="1.5" fill="#fff" stroke="#CBD5E1"/><ellipse cx="38" cy="49" rx="7" ry="4" fill="#FF6B8B" stroke="#DB2777" stroke-width="1.2"/><rect x="29" y="52" width="18" height="3.5" rx="1.5" fill="#fff" stroke="#CBD5E1"/>`,
      'tongue-tip': `<ellipse cx="38" cy="49" rx="11" ry="7" fill="#C2410C"/><path d="M32 54 Q38 43 44 54" fill="#FF8FA3" stroke="#FB7185" stroke-width="1.5"/>`,
      nasal: `<line x1="26" y1="49" x2="50" y2="49" stroke="#C2410C" stroke-width="3" stroke-linecap="round"/><path d="M35 33 Q38 29 41 33" fill="none" stroke="#F59E0B" stroke-width="2"/><path d="M32 23 Q38 17 44 23" fill="none" stroke="#F59E0B" stroke-width="2" stroke-dasharray="3 2"/>`,
      curl: `<ellipse cx="38" cy="49" rx="10" ry="7" fill="#C2410C"/><path d="M31 53 C36 53 43 47 38 45" fill="none" stroke="#FF8FA3" stroke-width="3.5" stroke-linecap="round"/>`
    };
    return `<svg width="72" height="72" viewBox="0 0 76 76">${faceBase}${shapes[shape] || shapes.relax}</svg>`;
  }

  /** 显示轻提示 */
  let toastTimer = null;
  function showToast(msg) {
    const el = $('toast');
    el.textContent = msg;
    el.classList.remove('hidden');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.add('hidden'), 2200);
  }

  /** 撒花粒子动效 */
  function launchConfetti(count = 24) {
    const layer = $('confetti-layer');
    const colors = ['#FF7A59', '#2CB67D', '#6C63FF', '#F59E0B', '#38BDF8', '#EC4899'];
    for (let i = 0; i < count; i++) {
      const piece = document.createElement('span');
      piece.className = 'confetti-piece';
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.background = colors[i % colors.length];
      piece.style.animationDelay = `${Math.random() * 0.25}s`;
      piece.style.width = `${8 + Math.random() * 6}px`;
      piece.style.height = `${8 + Math.random() * 6}px`;
      layer.appendChild(piece);
      setTimeout(() => piece.remove(), 1400);
    }
  }

  /** 同步顶栏状态并持久化 + 检查勋章解锁 */
  function syncStateAndSave() {
    const newBadges = Logic.evaluateBadges(state, BADGES);
    Logic.saveState(state);
    $('stat-stars').textContent = state.stars;
    $('stat-mastered').textContent = `${state.mastered.length}/${IPA_LIST.length}`;

    if (newBadges.length > 0) {
      sound.playVictory();
      launchConfetti(32);
      showToast(`🎉 解锁新勋章：${newBadges[0].emoji} ${newBadges[0].name}！`);
    }
  }

  // =========================================================
  // 视图切换与通用弹窗控制
  // =========================================================
  function switchView(viewName) {
    sound.playClick();
    runtime.currentView = viewName;

    document.querySelectorAll('.view').forEach((v) => v.classList.remove('active'));
    const target = $(`view-${viewName}`);
    if (target) target.classList.add('active');

    document.querySelectorAll('.nav-item').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.view === viewName);
    });

    if (viewName === 'explore') {
      renderExplore();
    } else if (viewName === 'catch') {
      renderCatchScopeChips();
      if (!runtime.catchQuestion) loadNextCatchQuestion(false);
    } else if (viewName === 'spell') {
      renderSpellLevelChips();
      if (!runtime.spellData) loadNextSpellPuzzle(false);
    } else if (viewName === 'memory') {
      renderMemoryScopeChips();
      if (!runtime.memoryDeck.length) startNewMemoryGame();
    }
  }

  function openModal(id) {
    const m = $(id);
    if (m) m.classList.remove('hidden');
  }

  function closeModal(id) {
    const m = $(id);
    if (m) m.classList.add('hidden');
  }

  // =========================================================
  // 1. 音标图鉴岛（探索学习）
  // =========================================================
  function getCategoryColor(catId) {
    const cat = CATEGORIES.find((c) => c.id === catId);
    return cat ? cat.color : '#FF7A59';
  }

  function renderExplore() {
    const tabsEl = $('category-tabs');
    const mistakeCount = state.mistakes.length;

    const chips = [
      { id: 'all', label: `全部 48` },
      ...CATEGORIES.map((c) => ({ id: c.id, label: `${c.shortName}` })),
      ...(mistakeCount > 0 ? [{ id: 'mistakes', label: `📌 待巩固 (${mistakeCount})`, isMistake: true }] : [])
    ];

    if (runtime.exploreCategory === 'mistakes' && mistakeCount === 0) {
      runtime.exploreCategory = 'all';
    }

    tabsEl.innerHTML = chips
      .map(
        (c) => `
        <button class="chip ${c.isMistake ? 'chip-mistake' : ''} ${runtime.exploreCategory === c.id ? 'active' : ''}"
          type="button" data-cat="${c.id}">
          ${escapeHtml(c.label)}
        </button>`
      )
      .join('');

    tabsEl.querySelectorAll('.chip').forEach((btn) => {
      btn.addEventListener('click', () => {
        sound.playClick();
        runtime.exploreCategory = btn.dataset.cat;
        renderExplore();
      });
    });

    // 分类说明
    const descEl = $('category-desc');
    let list = IPA_LIST;
    if (runtime.exploreCategory === 'mistakes') {
      const mSet = new Set(state.mistakes);
      list = IPA_LIST.filter((i) => mSet.has(i.id));
      descEl.textContent = '这些是听音游戏中答错过的小精灵，点开听一听、学会后会自动移出哦！';
    } else if (runtime.exploreCategory === 'all') {
      descEl.textContent = '共 48 个英语国际音标：20 个元音 + 28 个辅音，点击卡片听发音看秘籍。';
    } else {
      const cat = CATEGORIES.find((c) => c.id === runtime.exploreCategory);
      list = IPA_LIST.filter((i) => i.category === runtime.exploreCategory);
      descEl.textContent = cat ? `${cat.name}（${cat.badge}）：${cat.desc}` : '';
    }

    const gridEl = $('ipa-grid');
    gridEl.innerHTML = list
      .map((item) => {
        const isMastered = state.mastered.includes(item.id);
        const isMistake = state.mistakes.includes(item.id);
        const rule = item.spellingRules[0];
        const color = getCategoryColor(item.category);
        return `
          <button class="ipa-card ${isMastered ? 'mastered' : ''} ${isMistake ? 'mistake-flag' : ''}"
            style="--card-accent: ${color}"
            type="button" data-ipa-id="${item.id}">
            ${isMastered ? '<span class="ipa-card-badge" title="已掌握">⭐</span>' : isMistake ? '<span class="ipa-card-badge" title="待巩固">📌</span>' : ''}
            <span class="ipa-card-symbol">${escapeHtml(item.symbol)}</span>
            <span class="ipa-card-emoji">${item.emoji}</span>
            <span class="ipa-card-word">${renderHighlightedWord(rule.word, rule.highlight)}</span>
            <span class="ipa-card-zh">${escapeHtml(rule.zh)}</span>
          </button>
        `;
      })
      .join('');

    gridEl.querySelectorAll('.ipa-card').forEach((card) => {
      card.addEventListener('click', () => {
        openIpaDetail(card.dataset.ipaId);
      });
    });
  }

  /** 打开音标详情学习抽屉 */
  function openIpaDetail(ipaId) {
    const item = IPA_LIST.find((i) => i.id === ipaId);
    if (!item) return;

    runtime.activeDetailId = ipaId;
    sound.playClick();
    sound.speakIPA(item);

    const cat = CATEGORIES.find((c) => c.id === item.category);
    $('detail-symbol').textContent = item.symbol;
    $('detail-symbol').style.color = cat ? cat.color : '#FF7A59';
    $('modal-ipa-title').textContent = `${item.emoji} ${item.nickname}`;
    $('detail-cat-tag').textContent = cat ? cat.shortName : '';

    const isVowel = item.category === 'short_vowel' || item.category === 'long_vowel' || item.category === 'diphthong';
    $('detail-voice-tag').textContent = isVowel
      ? '🔊 元音·声带响亮震动'
      : item.voiced
      ? '🔔 浊辅音·声带震动'
      : '💨 清辅音·轻吹气不震喉';

    $('detail-mouth-svg').innerHTML = renderMouthSvg(item.mouthShape);
    $('detail-chant').textContent = `“${item.chant}”`;
    $('detail-mouth-tip').textContent = item.mouthTip;

    // 易混淆双胞胎跳转按钮
    const pairBox = $('detail-pair-box');
    const pairItem = item.pairWith ? IPA_LIST.find((i) => i.id === item.pairWith) : null;
    if (pairItem) {
      pairBox.classList.remove('hidden');
      const pairBtn = $('btn-detail-pair');
      pairBtn.textContent = `对比 ${pairItem.symbol} (${pairItem.speakWord}) →`;
      pairBtn.onclick = () => openIpaDetail(pairItem.id);
    } else {
      pairBox.classList.add('hidden');
    }

    // 拼写规律示范词列表
    const rulesEl = $('detail-rules');
    rulesEl.innerHTML = item.spellingRules
      .map(
        (r, idx) => `
        <button class="rule-word-btn" type="button" data-rule-idx="${idx}">
          <span class="rule-letter-pill">组合 ${escapeHtml(r.letters)}</span>
          <span style="font-size:22px">${r.emoji}</span>
          <span class="rule-word-text">${renderHighlightedWord(r.word, r.highlight)}</span>
          <span class="rule-word-zh">${escapeHtml(r.zh)} 🔊</span>
        </button>`
      )
      .join('');

    rulesEl.querySelectorAll('.rule-word-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const rule = item.spellingRules[Number(btn.dataset.ruleIdx)];
        if (rule) sound.speak(rule.word);
      });
    });

    updateDetailMasterButton();
    openModal('modal-ipa');
  }

  function updateDetailMasterButton() {
    const btn = $('btn-detail-master');
    const isMastered = state.mastered.includes(runtime.activeDetailId);
    btn.classList.toggle('mastered-on', isMastered);
    btn.textContent = isMastered ? '✅ 已学会（点击取消）' : '⭐ 我学会啦 (+2星)';
  }

  // =========================================================
  // 2. 听音捉精灵（听音辨形）
  // =========================================================
  function renderCatchScopeChips() {
    const el = $('catch-scope-chips');
    const scopes = [
      { id: 'all', label: '全部音标' },
      ...CATEGORIES.map((c) => ({ id: c.id, label: c.shortName })),
      ...(state.mistakes.length > 0 ? [{ id: 'mistakes', label: `📌 错题特训(${state.mistakes.length})` }] : [])
    ];
    if (runtime.catchScope === 'mistakes' && state.mistakes.length === 0) {
      runtime.catchScope = 'all';
    }
    el.innerHTML = scopes
      .map(
        (s) =>
          `<button class="chip ${runtime.catchScope === s.id ? 'active' : ''}" type="button" data-scope="${s.id}">${escapeHtml(s.label)}</button>`
      )
      .join('');
    el.querySelectorAll('.chip').forEach((btn) => {
      btn.addEventListener('click', () => {
        sound.playClick();
        runtime.catchScope = btn.dataset.scope;
        renderCatchScopeChips();
        loadNextCatchQuestion(true);
      });
    });
  }

  function loadNextCatchQuestion(autoPlay = true) {
    const prevId = runtime.catchQuestion ? runtime.catchQuestion.target.id : null;
    runtime.catchQuestion = Logic.generateCatchQuestion(IPA_LIST, {
      category: runtime.catchScope,
      mistakeIds: state.mistakes,
      excludeId: prevId
    });
    runtime.catchAnswered = false;

    const q = runtime.catchQuestion;
    $('catch-emoji').textContent = q.promptEmoji;
    $('catch-zh').textContent = q.promptZh;
    $('catch-hint').textContent = '听听这个单词里，发光的字母发哪个音标？';
    $('catch-word-preview').innerHTML = renderHighlightedWord(q.promptWord, q.promptHighlight);
    $('catch-combo').textContent = runtime.catchCombo;

    $('catch-feedback').classList.add('hidden');
    $('btn-catch-next').classList.add('hidden');

    const optsEl = $('catch-options');
    optsEl.innerHTML = q.options
      .map(
        (opt) => `
        <button class="option-bubble" type="button" data-opt-id="${opt.id}">
          <span class="opt-sym">${escapeHtml(opt.symbol)}</span>
          <span class="opt-nick">${escapeHtml(opt.nickname)}</span>
        </button>`
      )
      .join('');

    optsEl.querySelectorAll('.option-bubble').forEach((btn) => {
      btn.addEventListener('click', () => handleCatchSelect(btn.dataset.optId, btn));
    });

    if (autoPlay) {
      playCatchAudio(false);
    }
  }

  function playCatchAudio(slow = false) {
    if (!runtime.catchQuestion) return;
    const playBtn = $('btn-catch-play');
    sound.speak(runtime.catchQuestion.promptWord, {
      rate: slow ? Math.max(0.55, state.settings.rate - 0.22) : state.settings.rate,
      onStart: () => playBtn.classList.add('playing'),
      onEnd: () => playBtn.classList.remove('playing')
    });
  }

  function handleCatchSelect(selectedId, clickedBtn) {
    if (runtime.catchAnswered || !runtime.catchQuestion) return;
    runtime.catchAnswered = true;

    const target = runtime.catchQuestion.target;
    const result = Logic.submitCatchAnswer(state, target.id, selectedId, runtime.catchCombo);
    runtime.catchCombo = result.nextCombo;
    $('catch-combo').textContent = runtime.catchCombo;

    const fb = $('catch-feedback');
    fb.classList.remove('hidden', 'ok', 'err');

    // 标出正确答案
    document.querySelectorAll('#catch-options .option-bubble').forEach((btn) => {
      if (btn.dataset.optId === target.id) {
        btn.classList.add('correct');
      }
    });

    if (result.isCorrect) {
      sound.playCorrect(runtime.catchCombo);
      if (runtime.catchCombo >= 3) launchConfetti(16);
      fb.classList.add('ok');
      fb.innerHTML = `🎉 捉住啦！<strong>${escapeHtml(runtime.catchQuestion.promptWord)}</strong> 中的发光部分发 <strong>${escapeHtml(target.symbol)}</strong>（+${result.starsEarned}⭐）<br/><small>${escapeHtml(target.chant)}</small>`;
    } else {
      clickedBtn.classList.add('wrong');
      sound.playWrong();
      fb.classList.add('err');
      fb.innerHTML = `💡 差一点点！正确音标是 <strong>${escapeHtml(target.symbol)}</strong>（${escapeHtml(target.nickname)}），已为你加入待巩固本！<br/><small>口诀：${escapeHtml(target.chant)}</small>`;
    }

    $('btn-catch-next').classList.remove('hidden');
    syncStateAndSave();
    renderCatchScopeChips();
  }

  // =========================================================
  // 3. 音标拼词工坊（用发音直觉拼写记忆单词！）
  // =========================================================
  function renderSpellLevelChips() {
    const el = $('spell-level-chips');
    const levels = [
      { id: 0, label: '全部难度' },
      { id: 1, label: '🌱 入门三音词' },
      { id: 2, label: '🌿 字母组合' },
      { id: 3, label: '🌳 双元音挑战' }
    ];
    el.innerHTML = levels
      .map(
        (l) =>
          `<button class="chip ${runtime.spellLevel === l.id ? 'active' : ''}" type="button" data-level="${l.id}">${escapeHtml(l.label)}</button>`
      )
      .join('');
    el.querySelectorAll('.chip').forEach((btn) => {
      btn.addEventListener('click', () => {
        sound.playClick();
        runtime.spellLevel = Number(btn.dataset.level);
        renderSpellLevelChips();
        loadNextSpellPuzzle(true);
      });
    });
  }

  function loadNextSpellPuzzle(autoPlay = true) {
    const prevWord = runtime.spellData ? runtime.spellData.puzzle.word : null;
    runtime.spellData = Logic.generateSpellPuzzle(SPELL_WORDS, {
      level: runtime.spellLevel,
      excludeWord: prevWord
    });
    runtime.spellChosen = [];
    runtime.spellSolved = false;

    const { puzzle } = runtime.spellData;
    $('spell-emoji').textContent = puzzle.emoji;
    $('spell-zh').textContent = puzzle.zh;
    $('spell-ipa').textContent = puzzle.ipa;
    $('spell-count').textContent = state.spelledWords.length;

    $('spell-feedback').classList.add('hidden');
    $('btn-spell-next').classList.add('hidden');

    renderSpellSlotsAndTiles();

    if (autoPlay) {
      sound.speak(puzzle.word);
    }
  }

  function renderSpellSlotsAndTiles() {
    const { puzzle, tiles } = runtime.spellData;
    const slotsEl = $('spell-slots');
    const tilesEl = $('spell-tiles');

    const chosenIds = new Set(runtime.spellChosen.map((t) => t.tileId));

    slotsEl.innerHTML = puzzle.segments
      .map((seg, idx) => {
        const filledTile = runtime.spellChosen[idx];
        const isNext = !runtime.spellSolved && idx === runtime.spellChosen.length;
        return `
          <button class="spell-slot ${filledTile ? 'filled' : ''} ${isNext ? 'active-next' : ''} ${runtime.spellSolved ? 'correct' : ''}"
            type="button" data-slot-idx="${idx}" ${!filledTile || runtime.spellSolved ? 'disabled' : ''}>
            <span class="slot-phoneme">${escapeHtml(seg.phoneme)}</span>
            <span class="slot-letters">${filledTile ? escapeHtml(filledTile.letters) : '___'}</span>
          </button>`;
      })
      .join('');

    slotsEl.querySelectorAll('.spell-slot.filled').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (runtime.spellSolved) return;
        const idx = Number(btn.dataset.slotIdx);
        sound.playClick();
        runtime.spellChosen.splice(idx, 1);
        $('spell-feedback').classList.add('hidden');
        renderSpellSlotsAndTiles();
      });
    });

    tilesEl.innerHTML = tiles
      .map(
        (tile) => `
        <button class="letter-tile ${chosenIds.has(tile.tileId) ? 'used' : ''}"
          type="button" data-tile-id="${tile.tileId}">
          ${escapeHtml(tile.letters)}
        </button>`
      )
      .join('');

    tilesEl.querySelectorAll('.letter-tile').forEach((btn) => {
      btn.addEventListener('click', () => handleSpellTileClick(btn.dataset.tileId));
    });
  }

  function handleSpellTileClick(tileId) {
    if (runtime.spellSolved || !runtime.spellData) return;
    const { puzzle, tiles } = runtime.spellData;
    if (runtime.spellChosen.length >= puzzle.segments.length) return;

    const tile = tiles.find((t) => t.tileId === tileId);
    if (!tile || runtime.spellChosen.some((c) => c.tileId === tileId)) return;

    sound.playClick();
    runtime.spellChosen.push(tile);
    renderSpellSlotsAndTiles();

    // 填满全部槽位后自动校验
    if (runtime.spellChosen.length === puzzle.segments.length) {
      const check = Logic.checkSpellAttempt(state, puzzle, runtime.spellChosen);
      const fb = $('spell-feedback');
      fb.classList.remove('hidden', 'ok', 'err');

      if (check.isCorrect) {
        runtime.spellSolved = true;
        sound.playCorrect(3);
        launchConfetti(22);
        renderSpellSlotsAndTiles();
        setTimeout(() => sound.speak(puzzle.word), 260);

        fb.classList.add('ok');
        fb.innerHTML = `🎉 拼词成功：<strong>${escapeHtml(puzzle.word)}</strong> ${escapeHtml(puzzle.ipa)}（+${check.starsEarned}⭐）<br/><small>💡 记词秘籍：${escapeHtml(puzzle.tip)}</small>`;
        $('btn-spell-next').classList.remove('hidden');
        $('spell-count').textContent = state.spelledWords.length;
        syncStateAndSave();
      } else {
        sound.playWrong();
        document.querySelectorAll('#spell-slots .spell-slot').forEach((el, idx) => {
          const expected = puzzle.segments[idx].letters;
          const actual = runtime.spellChosen[idx]?.letters;
          if (actual !== expected) el.classList.add('wrong');
        });
        fb.classList.add('err');
        fb.innerHTML = `🤔 拼成了 <strong>${escapeHtml(check.assembled)}</strong>，还差一点！点红色方块可以退回，再听听发音试试～`;
      }
    }
  }

  function giveSpellHint() {
    if (runtime.spellSolved || !runtime.spellData) return;
    const { puzzle, tiles } = runtime.spellData;
    const nextIdx = runtime.spellChosen.length;
    if (nextIdx >= puzzle.segments.length) {
      // 如果已填满但错了，清空错误的块
      runtime.spellChosen = [];
      renderSpellSlotsAndTiles();
    }
    const idx = runtime.spellChosen.length;
    const neededSeg = puzzle.segments[idx];
    const matchTile = tiles.find(
      (t) =>
        t.letters === neededSeg.letters &&
        !runtime.spellChosen.some((c) => c.tileId === t.tileId)
    );
    if (matchTile) {
      showToast(`💡 音标 ${neededSeg.phoneme} 对应字母「${neededSeg.letters}」`);
      handleSpellTileClick(matchTile.tileId);
    }
  }

  // =========================================================
  // 4. 音标记忆翻翻乐
  // =========================================================
  function renderMemoryScopeChips() {
    const el = $('memory-scope-chips');
    const scopes = [
      { id: 'all', label: '随机混搭' },
      ...CATEGORIES.map((c) => ({ id: c.id, label: c.shortName }))
    ];
    el.innerHTML = scopes
      .map(
        (s) =>
          `<button class="chip ${runtime.memoryScope === s.id ? 'active' : ''}" type="button" data-mscope="${s.id}">${escapeHtml(s.label)}</button>`
      )
      .join('');
    el.querySelectorAll('.chip').forEach((btn) => {
      btn.addEventListener('click', () => {
        sound.playClick();
        runtime.memoryScope = btn.dataset.mscope;
        renderMemoryScopeChips();
        startNewMemoryGame();
      });
    });
  }

  function startNewMemoryGame() {
    runtime.memoryDeck = Logic.generateMemoryDeck(IPA_LIST, {
      pairCount: 6,
      category: runtime.memoryScope
    });
    runtime.memoryFlippedIdx = [];
    runtime.memoryMoves = 0;
    runtime.memoryLocked = false;
    $('memory-victory').classList.add('hidden');
    renderMemoryBoard();
  }

  function renderMemoryBoard() {
    const matchedPairs = runtime.memoryDeck.filter((c) => c.matched).length / 2;
    const totalPairs = runtime.memoryDeck.length / 2;
    $('memory-moves').textContent = runtime.memoryMoves;
    $('memory-pairs').textContent = `${matchedPairs}/${totalPairs}`;

    const board = $('memory-board');
    board.innerHTML = runtime.memoryDeck
      .map((card, idx) => {
        const isFlipped = card.flipped || card.matched;
        const frontHtml =
          card.type === 'ipa'
            ? `<span class="mem-type-badge mem-type-ipa">音标</span>
               <span class="mem-ipa-sym">${escapeHtml(card.symbol)}</span>`
            : `<span class="mem-type-badge mem-type-word">单词</span>
               <span style="font-size:20px">${card.emoji}</span>
               <span class="mem-word-text">${renderHighlightedWord(card.word, card.highlight)}</span>
               <span class="mem-word-zh">${escapeHtml(card.zh)}</span>`;

        return `
          <button class="mem-card ${isFlipped ? 'flipped' : ''} ${card.matched ? 'matched' : ''}"
            type="button" data-card-idx="${idx}" aria-label="记忆卡牌">
            <div class="mem-card-inner">
              <div class="mem-face mem-back">✨</div>
              <div class="mem-face mem-front">${frontHtml}</div>
            </div>
          </button>`;
      })
      .join('');

    board.querySelectorAll('.mem-card').forEach((btn) => {
      btn.addEventListener('click', () => handleMemoryFlip(Number(btn.dataset.cardIdx)));
    });
  }

  function handleMemoryFlip(idx) {
    if (runtime.memoryLocked) return;
    const card = runtime.memoryDeck[idx];
    if (!card || card.flipped || card.matched) return;

    sound.playFlip();
    card.flipped = true;
    runtime.memoryFlippedIdx.push(idx);
    sound.speak(card.speakWord);
    renderMemoryBoard();

    if (runtime.memoryFlippedIdx.length === 2) {
      runtime.memoryMoves += 1;
      runtime.memoryLocked = true;
      const [i1, i2] = runtime.memoryFlippedIdx;
      const c1 = runtime.memoryDeck[i1];
      const c2 = runtime.memoryDeck[i2];

      if (c1.pairId === c2.pairId) {
        setTimeout(() => {
          c1.matched = true;
          c2.matched = true;
          runtime.memoryFlippedIdx = [];
          runtime.memoryLocked = false;
          sound.playCorrect(2);
          renderMemoryBoard();

          if (runtime.memoryDeck.every((c) => c.matched)) {
            state.memoryWins += 1;
            const bonus = runtime.memoryMoves <= 10 ? 8 : 5;
            state.stars += bonus;
            sound.playVictory();
            launchConfetti(36);
            $('memory-victory-desc').textContent = `只用了 ${runtime.memoryMoves} 步就找到全部 6 对音标朋友，奖励 +${bonus}⭐！`;
            $('memory-victory').classList.remove('hidden');
            syncStateAndSave();
          }
        }, 360);
      } else {
        setTimeout(() => {
          c1.flipped = false;
          c2.flipped = false;
          runtime.memoryFlippedIdx = [];
          runtime.memoryLocked = false;
          renderMemoryBoard();
        }, 850);
      }
    }
  }

  // =========================================================
  // 成长勋章与语音设置面板
  // =========================================================
  function renderBadgesModal() {
    const masteredCount = state.mastered.length;
    const pct = Math.round((masteredCount / IPA_LIST.length) * 100);
    $('summary-mastered-text').textContent = `${masteredCount} / ${IPA_LIST.length} (${pct}%)`;
    $('summary-progress-fill').style.width = `${pct}%`;
    $('summary-stars').textContent = state.stars;
    $('summary-spelled').textContent = state.spelledWords.length;
    $('summary-mistakes').textContent = state.mistakes.length;

    $('badges-grid').innerHTML = BADGES.map((b) => {
      const unlocked = state.unlockedBadges.includes(b.id);
      return `
        <div class="badge-card ${unlocked ? 'unlocked' : ''}">
          <div class="badge-emoji">${unlocked ? b.emoji : '🔒'}</div>
          <div class="badge-name">${escapeHtml(b.name)}</div>
          <div class="badge-desc">${escapeHtml(b.desc)}</div>
        </div>`;
    }).join('');

    openModal('modal-badges');
  }

  function renderSettingsModal() {
    document.querySelectorAll('#setting-accent .seg-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.accent === state.settings.accent);
    });
    document.querySelectorAll('#setting-rate .seg-btn').forEach((btn) => {
      btn.classList.toggle('active', Number(btn.dataset.rate) === Number(state.settings.rate));
    });
    const sfxBtn = $('setting-sfx-toggle');
    sfxBtn.classList.toggle('on', state.settings.sfxEnabled);
    sfxBtn.textContent = state.settings.sfxEnabled ? '开启' : '关闭';
    sfxBtn.setAttribute('aria-pressed', String(state.settings.sfxEnabled));
    openModal('modal-settings');
  }

  // =========================================================
  // 初始化事件绑定
  // =========================================================
  function bindEvents() {
    // 底部导航
    document.querySelectorAll('.nav-item').forEach((btn) => {
      btn.addEventListener('click', () => switchView(btn.dataset.view));
    });

    // 顶部按钮
    $('btn-badges').addEventListener('click', () => {
      sound.playClick();
      renderBadgesModal();
    });
    $('btn-progress').addEventListener('click', () => {
      sound.playClick();
      renderBadgesModal();
    });
    $('btn-settings').addEventListener('click', () => {
      sound.playClick();
      renderSettingsModal();
    });

    // 通用关闭弹窗
    document.querySelectorAll('[data-close-modal]').forEach((el) => {
      el.addEventListener('click', () => closeModal(el.dataset.closeModal));
    });

    // 音标详情弹窗按钮
    $('btn-detail-speak').addEventListener('click', () => {
      const item = IPA_LIST.find((i) => i.id === runtime.activeDetailId);
      if (item) sound.speakIPA(item);
    });
    $('btn-detail-slow').addEventListener('click', () => {
      const item = IPA_LIST.find((i) => i.id === runtime.activeDetailId);
      if (item) sound.speakIPA(item, { slow: true });
    });
    $('btn-detail-master').addEventListener('click', () => {
      if (!runtime.activeDetailId) return;
      const res = Logic.toggleMastered(state, runtime.activeDetailId);
      if (res.mastered) {
        sound.playCorrect(2);
        launchConfetti(14);
        showToast('⭐ 点亮成功！获得 +2 颗星星');
      } else {
        sound.playClick();
        showToast('已取消点亮');
      }
      updateDetailMasterButton();
      syncStateAndSave();
      renderExplore();
    });

    // 听音捉精灵按钮
    $('btn-catch-play').addEventListener('click', () => playCatchAudio(false));
    $('btn-catch-slow').addEventListener('click', () => playCatchAudio(true));
    $('btn-catch-next').addEventListener('click', () => {
      sound.playClick();
      loadNextCatchQuestion(true);
    });

    // 拼词工坊按钮
    $('btn-spell-speak').addEventListener('click', () => {
      if (runtime.spellData) sound.speak(runtime.spellData.puzzle.word);
    });
    $('btn-spell-clear').addEventListener('click', () => {
      if (runtime.spellSolved) return;
      sound.playClick();
      runtime.spellChosen = [];
      $('spell-feedback').classList.add('hidden');
      renderSpellSlotsAndTiles();
    });
    $('btn-spell-hint').addEventListener('click', giveSpellHint);
    $('btn-spell-next').addEventListener('click', () => {
      sound.playClick();
      loadNextSpellPuzzle(true);
    });

    // 翻翻乐按钮
    $('btn-memory-restart').addEventListener('click', () => {
      sound.playClick();
      startNewMemoryGame();
    });
    $('btn-memory-again').addEventListener('click', () => {
      sound.playClick();
      startNewMemoryGame();
    });

    // 设置弹窗按钮
    document.querySelectorAll('#setting-accent .seg-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        sound.playClick();
        state.settings.accent = btn.dataset.accent;
        sound.configure(state.settings);
        syncStateAndSave();
        renderSettingsModal();
        sound.speak('apple');
      });
    });

    document.querySelectorAll('#setting-rate .seg-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        sound.playClick();
        state.settings.rate = Number(btn.dataset.rate);
        sound.configure(state.settings);
        syncStateAndSave();
        renderSettingsModal();
        sound.speak('apple');
      });
    });

    $('setting-sfx-toggle').addEventListener('click', () => {
      state.settings.sfxEnabled = !state.settings.sfxEnabled;
      sound.configure(state.settings);
      if (state.settings.sfxEnabled) sound.playClick();
      syncStateAndSave();
      renderSettingsModal();
    });

    $('btn-test-voice').addEventListener('click', () => {
      sound.speak('apple');
    });

    $('btn-reset-progress').addEventListener('click', () => {
      if (window.confirm('确定要清空所有星星、勋章和音标打卡记录吗？')) {
        state = Logic.createDefaultState();
        sound.configure(state.settings);
        runtime.catchCombo = 0;
        runtime.catchQuestion = null;
        runtime.spellData = null;
        runtime.memoryDeck = [];
        syncStateAndSave();
        closeModal('modal-settings');
        renderExplore();
        showToast('已重置全部学习进度');
      }
    });
  }

  function init() {
    if (!sound.isSpeechSupported()) {
      $('speech-banner').classList.remove('hidden');
    }
    bindEvents();
    syncStateAndSave();
    renderExplore();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
