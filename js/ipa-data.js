/**
 * 音标奇趣岛 - 完整 48 个国际音标教学数据与自然拼读词库
 * 兼容浏览器全局变量 (window.IPAData) 与 Node.js CommonJS (module.exports)
 */
(function (root) {
  'use strict';

  /** 音标家族分类配置 */
  const CATEGORIES = [
    {
      id: 'short_vowel',
      name: '短元音宝宝',
      shortName: '短元音',
      badge: '7个',
      color: '#FF7A59',
      bg: '#FFF1EC',
      desc: '发音短促有力，干脆不拖尾'
    },
    {
      id: 'long_vowel',
      name: '长元音歌唱家',
      shortName: '长元音',
      badge: '5个',
      color: '#2CB67D',
      bg: '#EBF9F3',
      desc: '带有小冒号 ː，声音拉长饱满'
    },
    {
      id: 'diphthong',
      name: '双元音滑梯',
      shortName: '双元音',
      badge: '8个',
      color: '#6C63FF',
      bg: '#F1EFFF',
      desc: '从前一个音顺滑溜到后一个音'
    },
    {
      id: 'voiceless_voiced',
      name: '清浊双胞胎',
      shortName: '清浊辅音',
      badge: '20个',
      color: '#0096C7',
      bg: '#E8F7FC',
      desc: '口型相同，清辅音轻吹气，浊辅音声带震动'
    },
    {
      id: 'other_consonant',
      name: '鼻音与魔法辅音',
      shortName: '其他辅音',
      badge: '8个',
      color: '#F59E0B',
      bg: '#FEF6E4',
      desc: '鼻音共鸣、卷舌音与半元音好朋友'
    }
  ];

  /**
   * 完整 48 个国际音标（IPA）
   * 字段说明：
   * - id: 唯一标识
   * - symbol: 音标显示文本
   * - category: 所属家族 ID
   * - nickname: 儿童趣味昵称
   * - emoji: 记忆联想图标
   * - chant: 朗朗上口的助记口诀
   * - mouthTip: 口型与发声要领
   * - mouthShape: SVG 口型类型（smile / wide-open / round-small / round-big / relax / glide / lips-pop / teeth-lip / tongue-teeth / tongue-tip / nasal / curl）
   * - voiced: 是否声带震动（元音均为 true，辅音区分清/浊）
   * - pairWith: 易混淆/配对音标 ID（用于听音游戏智能出干扰项与对比学习）
   * - speakWord: TTS 发音最佳示范代表词
   * - spellingRules: 常见字母/字母组合与示范单词（记单词核心桥梁！）
   *   每个 rule 含 { letters: '字母组合', word: '单词', highlight: '单词中需高亮的子串', zh: '中文', emoji: '图' }
   */
  const IPA_LIST = [
    // ==================== 一、短元音（7个）====================
    {
      id: 'i_short',
      symbol: '/ɪ/',
      category: 'short_vowel',
      nickname: '短衣小猪音',
      emoji: '🐷',
      chant: '嘴角微展短促叫，小猪 pig 叫 /ɪ/ /ɪ/ /ɪ/',
      mouthTip: '嘴巴微张放松，比微笑略松，短促发声不拉长。',
      mouthShape: 'smile',
      voiced: true,
      pairWith: 'i_long',
      speakWord: 'pig',
      spellingRules: [
        { letters: 'i', word: 'pig', highlight: 'i', zh: '小猪', emoji: '🐷' },
        { letters: 'i', word: 'big', highlight: 'i', zh: '大的', emoji: '🐘' },
        { letters: 'i', word: 'fish', highlight: 'i', zh: '小鱼', emoji: '🐟' }
      ]
    },
    {
      id: 'e_short',
      symbol: '/e/',
      category: 'short_vowel',
      nickname: '一指鸡蛋音',
      emoji: '🥚',
      chant: '上下牙齿一指宽，红色小床 bed /e/ /e/ /e/',
      mouthTip: '嘴唇向两侧轻展，上下齿间留约一根手指宽度，短促发音。',
      mouthShape: 'relax',
      voiced: true,
      pairWith: 'ae',
      speakWord: 'bed',
      spellingRules: [
        { letters: 'e', word: 'bed', highlight: 'e', zh: '小床', emoji: '🛏️' },
        { letters: 'e', word: 'red', highlight: 'e', zh: '红色', emoji: '🔴' },
        { letters: 'ea', word: 'bread', highlight: 'ea', zh: '面包', emoji: '🍞' }
      ]
    },
    {
      id: 'ae',
      symbol: '/æ/',
      category: 'short_vowel',
      nickname: '梅花大嘴音',
      emoji: '🐱',
      chant: '嘴巴张大三指宽，小猫 cat 吃苹果 /æ/ /æ/ /æ/',
      mouthTip: '嘴角尽量向两边拉，下巴用力向下张开，像吃大苹果一样！',
      mouthShape: 'wide-open',
      voiced: true,
      pairWith: 'e_short',
      speakWord: 'cat',
      spellingRules: [
        { letters: 'a', word: 'cat', highlight: 'a', zh: '小猫', emoji: '🐱' },
        { letters: 'a', word: 'apple', highlight: 'a', zh: '苹果', emoji: '🍎' },
        { letters: 'a', word: 'hat', highlight: 'a', zh: '帽子', emoji: '🎩' }
      ]
    },
    {
      id: 'o_short',
      symbol: '/ɒ/',
      category: 'short_vowel',
      nickname: '圆嘴小狗音',
      emoji: '🐶',
      chant: '嘴巴圆圆像小蛋，小狗 dog 叫 /ɒ/ /ɒ/ /ɒ/',
      mouthTip: '嘴巴张大呈圆形，舌头后缩压低，干脆有力发出短音。',
      mouthShape: 'round-big',
      voiced: true,
      pairWith: 'o_long',
      speakWord: 'dog',
      spellingRules: [
        { letters: 'o', word: 'dog', highlight: 'o', zh: '小狗', emoji: '🐶' },
        { letters: 'o', word: 'box', highlight: 'o', zh: '盒子', emoji: '📦' },
        { letters: 'o', word: 'hot', highlight: 'o', zh: '热的', emoji: '🔥' }
      ]
    },
    {
      id: 'uh',
      symbol: '/ʌ/',
      category: 'short_vowel',
      nickname: '尖角小太阳',
      emoji: '☀️',
      chant: '倒立小帽尖又短，太阳 sun 照杯子 /ʌ/ /ʌ/ /ʌ/',
      mouthTip: '嘴巴半张放松，声音短促轻快，像轻轻说“阿”。',
      mouthShape: 'relax',
      voiced: true,
      pairWith: 'a_long',
      speakWord: 'sun',
      spellingRules: [
        { letters: 'u', word: 'sun', highlight: 'u', zh: '太阳', emoji: '☀️' },
        { letters: 'u', word: 'cup', highlight: 'u', zh: '杯子', emoji: '☕' },
        { letters: 'u', word: 'duck', highlight: 'u', zh: '鸭子', emoji: '🦆' }
      ]
    },
    {
      id: 'u_short',
      symbol: '/ʊ/',
      category: 'short_vowel',
      nickname: '小桶看书音',
      emoji: '📖',
      chant: '双唇微收向前嘟，翻开书本 book /ʊ/ /ʊ/ /ʊ/',
      mouthTip: '嘴唇稍微收圆向前突出，放松短促地发出“乌”。',
      mouthShape: 'round-small',
      voiced: true,
      pairWith: 'u_long',
      speakWord: 'book',
      spellingRules: [
        { letters: 'oo', word: 'book', highlight: 'oo', zh: '书本', emoji: '📖' },
        { letters: 'oo', word: 'foot', highlight: 'oo', zh: '脚丫', emoji: '🦶' },
        { letters: 'oo', word: 'good', highlight: 'oo', zh: '很棒', emoji: '👍' }
      ]
    },
    {
      id: 'schwa',
      symbol: '/ə/',
      category: 'short_vowel',
      nickname: '懒洋洋熊猫音',
      emoji: '🐼',
      chant: '倒写小 e 最放松，熊猫 panda 轻轻 /ə/ /ə/ /ə/',
      mouthTip: '全口肌肉彻底放松，轻轻吐气发声，是英语里最爱躲在轻读音节的小音标。',
      mouthShape: 'relax',
      voiced: true,
      pairWith: 'er_long',
      speakWord: 'panda',
      spellingRules: [
        { letters: 'a', word: 'panda', highlight: 'a', zh: '熊猫', emoji: '🐼' },
        { letters: 'er', word: 'tiger', highlight: 'er', zh: '老虎', emoji: '🐯' },
        { letters: 'a', word: 'banana', highlight: 'a', zh: '香蕉', emoji: '🍌' }
      ]
    },

    // ==================== 二、长元音（5个）====================
    {
      id: 'i_long',
      symbol: '/iː/',
      category: 'long_vowel',
      nickname: '微笑小蜜蜂',
      emoji: '🐝',
      chant: '嘴角咧开像微笑，蜜蜂 bee 飞 /iː/ /iː/ /iː/',
      mouthTip: '嘴唇向两边大大咧开，像照相说“茄子”，声音拉长清晰。',
      mouthShape: 'smile',
      voiced: true,
      pairWith: 'i_short',
      speakWord: 'bee',
      spellingRules: [
        { letters: 'ee', word: 'bee', highlight: 'ee', zh: '蜜蜂', emoji: '🐝' },
        { letters: 'ee', word: 'tree', highlight: 'ee', zh: '大树', emoji: '🌳' },
        { letters: 'ea', word: 'tea', highlight: 'ea', zh: '清茶', emoji: '🍵' }
      ]
    },
    {
      id: 'a_long',
      symbol: '/ɑː/',
      category: 'long_vowel',
      nickname: '看牙医生音',
      emoji: '🚗',
      chant: '大大张嘴看医生，小车 car 开过 /ɑː/ /ɑː/ /ɑː/',
      mouthTip: '嘴巴大大张开，舌头平放靠后，长长地发出“啊——”。',
      mouthShape: 'wide-open',
      voiced: true,
      pairWith: 'uh',
      speakWord: 'car',
      spellingRules: [
        { letters: 'ar', word: 'car', highlight: 'ar', zh: '小汽车', emoji: '🚗' },
        { letters: 'ar', word: 'star', highlight: 'ar', zh: '星星', emoji: '⭐' },
        { letters: 'ar', word: 'park', highlight: 'ar', zh: '公园', emoji: '🏞️' }
      ]
    },
    {
      id: 'o_long',
      symbol: '/ɔː/',
      category: 'long_vowel',
      nickname: '反 c 嗷嗷音',
      emoji: '🐴',
      chant: '双唇收圆向前突，小马 horse 跑 /ɔː/ /ɔː/ /ɔː/',
      mouthTip: '双唇收得圆而紧并略前突，长长地发出“奥——”。',
      mouthShape: 'round-big',
      voiced: true,
      pairWith: 'o_short',
      speakWord: 'horse',
      spellingRules: [
        { letters: 'or', word: 'horse', highlight: 'or', zh: '小马', emoji: '🐴' },
        { letters: 'or', word: 'fork', highlight: 'or', zh: '叉子', emoji: '🍴' },
        { letters: 'al', word: 'ball', highlight: 'al', zh: '皮球', emoji: '⚽' }
      ]
    },
    {
      id: 'u_long',
      symbol: '/uː/',
      category: 'long_vowel',
      nickname: '吹笛小火车',
      emoji: '🌙',
      chant: '小小圆嘴吹长笛，月亮 moon 亮 /uː/ /uː/ /uː/',
      mouthTip: '双唇用力收成小圆孔向前嘟起，长长地发出“呜——”。',
      mouthShape: 'round-small',
      voiced: true,
      pairWith: 'u_short',
      speakWord: 'moon',
      spellingRules: [
        { letters: 'oo', word: 'moon', highlight: 'oo', zh: '月亮', emoji: '🌙' },
        { letters: 'oo', word: 'zoo', highlight: 'oo', zh: '动物园', emoji: '🦒' },
        { letters: 'ue', word: 'blue', highlight: 'ue', zh: '蓝色', emoji: '🔵' }
      ]
    },
    {
      id: 'er_long',
      symbol: '/ɜː/',
      category: 'long_vowel',
      nickname: '卷舌小鸟音',
      emoji: '🐦',
      chant: '数字三旁加两点，小鸟 bird 唱 /ɜː/ /ɜː/ /ɜː/',
      mouthTip: '嘴巴微张，舌身平放微卷，平稳拉长发出“鹅——”。',
      mouthShape: 'curl',
      voiced: true,
      pairWith: 'schwa',
      speakWord: 'bird',
      spellingRules: [
        { letters: 'ir', word: 'bird', highlight: 'ir', zh: '小鸟', emoji: '🐦' },
        { letters: 'ir', word: 'girl', highlight: 'ir', zh: '女孩', emoji: '👧' },
        { letters: 'ur', word: 'nurse', highlight: 'ur', zh: '护士', emoji: '👩‍⚕️' }
      ]
    },

    // ==================== 三、双元音（8个）====================
    {
      id: 'ei',
      symbol: '/eɪ/',
      category: 'diphthong',
      nickname: '字母 A 蛋糕音',
      emoji: '🎂',
      chant: '滑梯滑向字母 A，美味 cake 香 /eɪ/ /eɪ/ /eɪ/',
      mouthTip: '从 /e/ 顺滑溜到 /ɪ/，口型由微开变微笑，和字母 A 读音一样！',
      mouthShape: 'glide',
      voiced: true,
      pairWith: 'ai',
      speakWord: 'cake',
      spellingRules: [
        { letters: 'a_e', word: 'cake', highlight: 'a', zh: '蛋糕', emoji: '🎂' },
        { letters: 'ai', word: 'rain', highlight: 'ai', zh: '下雨', emoji: '🌧️' },
        { letters: 'ay', word: 'day', highlight: 'ay', zh: '白天', emoji: '🌞' }
      ]
    },
    {
      id: 'ai',
      symbol: '/aɪ/',
      category: 'diphthong',
      nickname: '爱心风筝音',
      emoji: '🪁',
      chant: '张大嘴巴滑向衣，风筝 kite 飞 /aɪ/ /aɪ/ /aɪ/',
      mouthTip: '嘴巴先张大发 /a/，再流畅收向微笑的 /ɪ/，像说“爱”。',
      mouthShape: 'glide',
      voiced: true,
      pairWith: 'ei',
      speakWord: 'kite',
      spellingRules: [
        { letters: 'i_e', word: 'kite', highlight: 'i', zh: '风筝', emoji: '🪁' },
        { letters: 'i_e', word: 'bike', highlight: 'i', zh: '自行车', emoji: '🚲' },
        { letters: 'y', word: 'sky', highlight: 'y', zh: '天空', emoji: '☁️' }
      ]
    },
    {
      id: 'oi',
      symbol: '/ɔɪ/',
      category: 'diphthong',
      nickname: '男孩玩具音',
      emoji: '🧸',
      chant: '圆嘴滑向扁扁嘴，男孩 boy 玩玩具 /ɔɪ/ /ɔɪ/ /ɔɪ/',
      mouthTip: '先圆唇发 /ɔ/，再迅速展唇滑向 /ɪ/。',
      mouthShape: 'glide',
      voiced: true,
      pairWith: 'au',
      speakWord: 'boy',
      spellingRules: [
        { letters: 'oy', word: 'boy', highlight: 'oy', zh: '男孩', emoji: '👦' },
        { letters: 'oy', word: 'toy', highlight: 'oy', zh: '玩具', emoji: '🧸' },
        { letters: 'oi', word: 'coin', highlight: 'oi', zh: '硬币', emoji: '🪙' }
      ]
    },
    {
      id: 'au',
      symbol: '/aʊ/',
      category: 'diphthong',
      nickname: '奶牛嗷呜音',
      emoji: '🐮',
      chant: '大嘴滑成小圆嘴，奶牛 cow 叫 /aʊ/ /aʊ/ /aʊ/',
      mouthTip: '从大张嘴 /a/ 迅速收圆双唇滑向 /ʊ/，像老虎轻叫“嗷呜”。',
      mouthShape: 'glide',
      voiced: true,
      pairWith: 'ou',
      speakWord: 'cow',
      spellingRules: [
        { letters: 'ow', word: 'cow', highlight: 'ow', zh: '奶牛', emoji: '🐮' },
        { letters: 'ou', word: 'house', highlight: 'ou', zh: '房子', emoji: '🏠' },
        { letters: 'ou', word: 'mouse', highlight: 'ou', zh: '老鼠', emoji: '🐭' }
      ]
    },
    {
      id: 'ou',
      symbol: '/əʊ/',
      category: 'diphthong',
      nickname: '字母 O 小船音',
      emoji: '⛵',
      chant: '放松滑成小圆口，小船 boat 飘 /əʊ/ /əʊ/ /əʊ/',
      mouthTip: '从自然放松的 /ə/ 滑向收圆的 /ʊ/，就是字母 O 的读音！',
      mouthShape: 'glide',
      voiced: true,
      pairWith: 'au',
      speakWord: 'boat',
      spellingRules: [
        { letters: 'oa', word: 'boat', highlight: 'oa', zh: '小船', emoji: '⛵' },
        { letters: 'o_e', word: 'nose', highlight: 'o', zh: '鼻子', emoji: '👃' },
        { letters: 'ow', word: 'snow', highlight: 'ow', zh: '雪花', emoji: '❄️' }
      ]
    },
    {
      id: 'ia',
      symbol: '/ɪə/',
      category: 'diphthong',
      nickname: '小鹿耳朵音',
      emoji: '🦌',
      chant: '微笑滑向懒熊猫，耳朵 ear 听 /ɪə/ /ɪə/ /ɪə/',
      mouthTip: '从短促的 /ɪ/ 轻轻滑向放松的 /ə/。',
      mouthShape: 'glide',
      voiced: true,
      pairWith: 'ea',
      speakWord: 'ear',
      spellingRules: [
        { letters: 'ear', word: 'ear', highlight: 'ear', zh: '耳朵', emoji: '👂' },
        { letters: 'eer', word: 'deer', highlight: 'eer', zh: '小鹿', emoji: '🦌' },
        { letters: 'ear', word: 'hear', highlight: 'ear', zh: '听见', emoji: '🎵' }
      ]
    },
    {
      id: 'ea',
      symbol: '/eə/',
      category: 'diphthong',
      nickname: '小熊椅子音',
      emoji: '🐻',
      chant: '一指微开向里滑，小熊 bear 坐 /eə/ /eə/ /eə/',
      mouthTip: '从 /e/ 顺滑过渡到放松的 /ə/，发音饱满流畅。',
      mouthShape: 'glide',
      voiced: true,
      pairWith: 'ia',
      speakWord: 'bear',
      spellingRules: [
        { letters: 'ear', word: 'bear', highlight: 'ear', zh: '小熊', emoji: '🐻' },
        { letters: 'air', word: 'chair', highlight: 'air', zh: '椅子', emoji: '🪑' },
        { letters: 'air', word: 'hair', highlight: 'air', zh: '头发', emoji: '💇' }
      ]
    },
    {
      id: 'ua',
      symbol: '/ʊə/',
      category: 'diphthong',
      nickname: '旅行纯净音',
      emoji: '🧳',
      chant: '小圆唇儿慢慢松，去旅行 tour /ʊə/ /ʊə/ /ʊə/',
      mouthTip: '从收圆的 /ʊ/ 轻轻打开滑向放松的 /ə/。',
      mouthShape: 'glide',
      voiced: true,
      pairWith: 'ia',
      speakWord: 'tour',
      spellingRules: [
        { letters: 'our', word: 'tour', highlight: 'our', zh: '旅行', emoji: '🧳' },
        { letters: 'oor', word: 'poor', highlight: 'oor', zh: '可怜的', emoji: '🥺' },
        { letters: 'ure', word: 'pure', highlight: 'ure', zh: '纯净的', emoji: '💧' }
      ]
    },

    // ==================== 四、清浊双胞胎辅音（20个）====================
    {
      id: 'p',
      symbol: '/p/',
      category: 'voiceless_voiced',
      nickname: '轻吹泡泡音（清）',
      emoji: '🫧',
      chant: '双唇紧闭轻吹气，钢笔 pen 写 /p/ /p/ /p/',
      mouthTip: '双唇紧闭后突然张开送气，喉咙不震动，纸片放在嘴前会被吹动！',
      mouthShape: 'lips-pop',
      voiced: false,
      pairWith: 'b',
      speakWord: 'pen',
      spellingRules: [
        { letters: 'p', word: 'pen', highlight: 'p', zh: '钢笔', emoji: '🖊️' },
        { letters: 'p', word: 'pig', highlight: 'p', zh: '小猪', emoji: '🐷' },
        { letters: 'pp', word: 'apple', highlight: 'pp', zh: '苹果', emoji: '🍎' }
      ]
    },
    {
      id: 'b',
      symbol: '/b/',
      category: 'voiceless_voiced',
      nickname: '震动书包音（浊）',
      emoji: '🎒',
      chant: '双唇爆破喉咙震，书包 bag 重 /b/ /b/ /b/',
      mouthTip: '口型与 /p/ 相同，但发声时声带震动，手摸喉咙能感觉到抖动。',
      mouthShape: 'lips-pop',
      voiced: true,
      pairWith: 'p',
      speakWord: 'bag',
      spellingRules: [
        { letters: 'b', word: 'bag', highlight: 'b', zh: '书包', emoji: '🎒' },
        { letters: 'b', word: 'bee', highlight: 'b', zh: '蜜蜂', emoji: '🐝' },
        { letters: 'b', word: 'bus', highlight: 'b', zh: '公交车', emoji: '🚌' }
      ]
    },
    {
      id: 't',
      symbol: '/t/',
      category: 'voiceless_voiced',
      nickname: '轻弹钟表音（清）',
      emoji: '⏰',
      chant: '舌尖轻弹不震喉，老虎 tiger 走 /t/ /t/ /t/',
      mouthTip: '舌尖抵住上齿龈，突然放开轻吐气，像钟表滴答声。',
      mouthShape: 'tongue-tip',
      voiced: false,
      pairWith: 'd',
      speakWord: 'tiger',
      spellingRules: [
        { letters: 't', word: 'tiger', highlight: 't', zh: '老虎', emoji: '🐯' },
        { letters: 't', word: 'tea', highlight: 't', zh: '清茶', emoji: '🍵' },
        { letters: 't', word: 'hat', highlight: 't', zh: '帽子', emoji: '🎩' }
      ]
    },
    {
      id: 'd',
      symbol: '/d/',
      category: 'voiceless_voiced',
      nickname: '小鼓咚咚音（浊）',
      emoji: '🥁',
      chant: '舌尖弹开声带震，小狗 dog 叫 /d/ /d/ /d/',
      mouthTip: '舌位与 /t/ 完全一致，发声时声带震动，短促浑厚。',
      mouthShape: 'tongue-tip',
      voiced: true,
      pairWith: 't',
      speakWord: 'dog',
      spellingRules: [
        { letters: 'd', word: 'dog', highlight: 'd', zh: '小狗', emoji: '🐶' },
        { letters: 'd', word: 'duck', highlight: 'd', zh: '鸭子', emoji: '🦆' },
        { letters: 'd', word: 'bed', highlight: 'd', zh: '小床', emoji: '🛏️' }
      ]
    },
    {
      id: 'k',
      symbol: '/k/',
      category: 'voiceless_voiced',
      nickname: '轻咳小猫音（清）',
      emoji: '🐱',
      chant: '舌根抬起轻送气，小猫 cat 吃蛋糕 /k/ /k/ /k/',
      mouthTip: '舌后部抬起贴住软腭，突然松开送气，喉咙不震动。',
      mouthShape: 'relax',
      voiced: false,
      pairWith: 'g',
      speakWord: 'cat',
      spellingRules: [
        { letters: 'c', word: 'cat', highlight: 'c', zh: '小猫', emoji: '🐱' },
        { letters: 'k', word: 'kite', highlight: 'k', zh: '风筝', emoji: '🪁' },
        { letters: 'ck', word: 'duck', highlight: 'ck', zh: '鸭子', emoji: '🦆' }
      ]
    },
    {
      id: 'g',
      symbol: '/g/',
      category: 'voiceless_voiced',
      nickname: '咕咕鸽子音（浊）',
      emoji: '👧',
      chant: '舌根弹开声带震，女孩 girl 笑 /g/ /g/ /g/',
      mouthTip: '口型与 /k/ 相同，声带震动发出浊音。',
      mouthShape: 'relax',
      voiced: true,
      pairWith: 'k',
      speakWord: 'girl',
      spellingRules: [
        { letters: 'g', word: 'girl', highlight: 'g', zh: '女孩', emoji: '👧' },
        { letters: 'g', word: 'green', highlight: 'g', zh: '绿色', emoji: '🟢' },
        { letters: 'g', word: 'pig', highlight: 'g', zh: '小猪', emoji: '🐷' }
      ]
    },
    {
      id: 'f',
      symbol: '/f/',
      category: 'voiceless_voiced',
      nickname: '咬唇吹风音（清）',
      emoji: '🐟',
      chant: '上门牙轻咬下唇，小鱼 fish 游 /f/ /f/ /f/',
      mouthTip: '上齿轻轻接触下唇内侧，气流从唇齿间摩擦吹出，声带不震。',
      mouthShape: 'teeth-lip',
      voiced: false,
      pairWith: 'v',
      speakWord: 'fish',
      spellingRules: [
        { letters: 'f', word: 'fish', highlight: 'f', zh: '小鱼', emoji: '🐟' },
        { letters: 'f', word: 'frog', highlight: 'f', zh: '青蛙', emoji: '🐸' },
        { letters: 'ph', word: 'phone', highlight: 'ph', zh: '电话', emoji: '📱' }
      ]
    },
    {
      id: 'v',
      symbol: '/v/',
      category: 'voiceless_voiced',
      nickname: '咬唇马达音（浊）',
      emoji: '🚐',
      chant: '咬唇吹气喉咙震，货车 van 开 /v/ /v/ /v/',
      mouthTip: '与 /f/ 一样轻咬下唇，但同时震动声带，像小马达嗡嗡响！',
      mouthShape: 'teeth-lip',
      voiced: true,
      pairWith: 'f',
      speakWord: 'van',
      spellingRules: [
        { letters: 'v', word: 'van', highlight: 'v', zh: '面包车', emoji: '🚐' },
        { letters: 'v', word: 'vest', highlight: 'v', zh: '背心', emoji: '🦺' },
        { letters: 'v', word: 'five', highlight: 'v', zh: '数字五', emoji: '5️⃣' }
      ]
    },
    {
      id: 's',
      symbol: '/s/',
      category: 'voiceless_voiced',
      nickname: '小蛇嘶嘶音（清）',
      emoji: '🐍',
      chant: '牙齿轻合吹丝气，太阳 sun 亮 /s/ /s/ /s/',
      mouthTip: '上下齿轻靠，舌尖靠近齿龈，气流从缝隙顺畅嘶嘶吹出。',
      mouthShape: 'smile',
      voiced: false,
      pairWith: 'z',
      speakWord: 'sun',
      spellingRules: [
        { letters: 's', word: 'sun', highlight: 's', zh: '太阳', emoji: '☀️' },
        { letters: 's', word: 'star', highlight: 's', zh: '星星', emoji: '⭐' },
        { letters: 'c', word: 'ice', highlight: 'c', zh: '冰块', emoji: '🧊' }
      ]
    },
    {
      id: 'z',
      symbol: '/z/',
      category: 'voiceless_voiced',
      nickname: '斑马嗡嗡音（浊）',
      emoji: '🦓',
      chant: '小蛇加上声带震，动物园 zoo 逛 /z/ /z/ /z/',
      mouthTip: '口型与 /s/ 相同，震动声带，像电锯或蜜蜂嗡嗡声。',
      mouthShape: 'smile',
      voiced: true,
      pairWith: 's',
      speakWord: 'zoo',
      spellingRules: [
        { letters: 'z', word: 'zoo', highlight: 'z', zh: '动物园', emoji: '🦒' },
        { letters: 'z', word: 'zebra', highlight: 'z', zh: '斑马', emoji: '🦓' },
        { letters: 's', word: 'nose', highlight: 's', zh: '鼻子', emoji: '👃' }
      ]
    },
    {
      id: 'th_voiceless',
      symbol: '/θ/',
      category: 'voiceless_voiced',
      nickname: '轻咬舌尖音（清）',
      emoji: '3️⃣',
      chant: '舌尖轻吐牙齿间，数字 three 吹 /θ/ /θ/ /θ/',
      mouthTip: '把舌尖轻轻放在上下牙齿之间，只吹气不震动喉咙！',
      mouthShape: 'tongue-teeth',
      voiced: false,
      pairWith: 'th_voiced',
      speakWord: 'three',
      spellingRules: [
        { letters: 'th', word: 'three', highlight: 'th', zh: '数字三', emoji: '3️⃣' },
        { letters: 'th', word: 'mouth', highlight: 'th', zh: '嘴巴', emoji: '👄' },
        { letters: 'th', word: 'tooth', highlight: 'th', zh: '牙齿', emoji: '🦷' }
      ]
    },
    {
      id: 'th_voiced',
      symbol: '/ð/',
      category: 'voiceless_voiced',
      nickname: '震动咬舌音（浊）',
      emoji: '👨‍👩‍👧',
      chant: '咬住舌尖声带震，妈妈 mother 叫 /ð/ /ð/ /ð/',
      mouthTip: '与 /θ/ 一样轻咬舌尖，同时让喉咙发出震动！',
      mouthShape: 'tongue-teeth',
      voiced: true,
      pairWith: 'th_voiceless',
      speakWord: 'mother',
      spellingRules: [
        { letters: 'th', word: 'mother', highlight: 'th', zh: '妈妈', emoji: '👩' },
        { letters: 'th', word: 'father', highlight: 'th', zh: '爸爸', emoji: '👨' },
        { letters: 'th', word: 'this', highlight: 'th', zh: '这个', emoji: '👇' }
      ]
    },
    {
      id: 'sh',
      symbol: '/ʃ/',
      category: 'voiceless_voiced',
      nickname: '安静嘘嘘音（清）',
      emoji: '🐑',
      chant: '双唇微翘说安静，绵羊 sheep 睡 /ʃ/ /ʃ/ /ʃ/',
      mouthTip: '双唇稍微向前翘起呈圆形，气流擦过舌面，像提醒大家“嘘——”。',
      mouthShape: 'round-small',
      voiced: false,
      pairWith: 'zh',
      speakWord: 'sheep',
      spellingRules: [
        { letters: 'sh', word: 'sheep', highlight: 'sh', zh: '绵羊', emoji: '🐑' },
        { letters: 'sh', word: 'shoe', highlight: 'sh', zh: '鞋子', emoji: '👟' },
        { letters: 'sh', word: 'fish', highlight: 'sh', zh: '小鱼', emoji: '🐟' }
      ]
    },
    {
      id: 'zh',
      symbol: '/ʒ/',
      category: 'voiceless_voiced',
      nickname: '宝藏软日音（浊）',
      emoji: '💎',
      chant: '翘唇嘘音喉咙震，宝藏 treasure 闪 /ʒ/ /ʒ/ /ʒ/',
      mouthTip: '口型与 /ʃ/ 相同，加上声带震动，听起来柔和圆润。',
      mouthShape: 'round-small',
      voiced: true,
      pairWith: 'sh',
      speakWord: 'treasure',
      spellingRules: [
        { letters: 's', word: 'treasure', highlight: 's', zh: '宝藏', emoji: '💎' },
        { letters: 's', word: 'measure', highlight: 's', zh: '测量', emoji: '📏' },
        { letters: 'ge', word: 'beige', highlight: 'ge', zh: '米色', emoji: '🧥' }
      ]
    },
    {
      id: 'ch',
      symbol: '/tʃ/',
      category: 'voiceless_voiced',
      nickname: '蒸汽小火车（清）',
      emoji: '🪑',
      chant: '咔嚓一声小火车，桃子 peach 吃 /tʃ/ /tʃ/ /tʃ/',
      mouthTip: '先用舌尖顶住齿龈，再突然向翘唇送气，像“吃”但更轻脆。',
      mouthShape: 'round-small',
      voiced: false,
      pairWith: 'dzh',
      speakWord: 'chair',
      spellingRules: [
        { letters: 'ch', word: 'chair', highlight: 'ch', zh: '椅子', emoji: '🪑' },
        { letters: 'ch', word: 'peach', highlight: 'ch', zh: '桃子', emoji: '🍑' },
        { letters: 'tch', word: 'watch', highlight: 'tch', zh: '手表', emoji: '⌚' }
      ]
    },
    {
      id: 'dzh',
      symbol: '/dʒ/',
      category: 'voiceless_voiced',
      nickname: '果酱跳跳音（浊）',
      emoji: '🍓',
      chant: '火车加上声带震，果酱 jam 甜 /dʒ/ /dʒ/ /dʒ/',
      mouthTip: '口型与 /tʃ/ 相同，发声时震动声带。',
      mouthShape: 'round-small',
      voiced: true,
      pairWith: 'ch',
      speakWord: 'jam',
      spellingRules: [
        { letters: 'j', word: 'jam', highlight: 'j', zh: '果酱', emoji: '🍓' },
        { letters: 'j', word: 'jump', highlight: 'j', zh: '跳跃', emoji: '🦘' },
        { letters: 'ge', word: 'orange', highlight: 'ge', zh: '橙子', emoji: '🍊' }
      ]
    },
    {
      id: 'tr',
      symbol: '/tr/',
      category: 'voiceless_voiced',
      nickname: '大树戳戳音（清）',
      emoji: '🌳',
      chant: '翘唇卷舌清脆吐，火车 train 过树 /tr/ /tr/ /tr/',
      mouthTip: '由 /t/ 和卷舌 /r/ 快速连读而成，嘴唇略微前突，不震喉咙。',
      mouthShape: 'curl',
      voiced: false,
      pairWith: 'dr',
      speakWord: 'tree',
      spellingRules: [
        { letters: 'tr', word: 'tree', highlight: 'tr', zh: '大树', emoji: '🌳' },
        { letters: 'tr', word: 'train', highlight: 'tr', zh: '火车', emoji: '🚆' },
        { letters: 'tr', word: 'truck', highlight: 'tr', zh: '卡车', emoji: '🚚' }
      ]
    },
    {
      id: 'dr',
      symbol: '/dr/',
      category: 'voiceless_voiced',
      nickname: '裙子敲鼓音（浊）',
      emoji: '👗',
      chant: '卷舌爆破声带震，裙子 dress 飘 /dr/ /dr/ /dr/',
      mouthTip: '由 /d/ 和卷舌 /r/ 快速连读，声带震动有力。',
      mouthShape: 'curl',
      voiced: true,
      pairWith: 'tr',
      speakWord: 'dress',
      spellingRules: [
        { letters: 'dr', word: 'dress', highlight: 'dr', zh: '连衣裙', emoji: '👗' },
        { letters: 'dr', word: 'drum', highlight: 'dr', zh: '小鼓', emoji: '🥁' },
        { letters: 'dr', word: 'draw', highlight: 'dr', zh: '画画', emoji: '🎨' }
      ]
    },
    {
      id: 'ts',
      symbol: '/ts/',
      category: 'voiceless_voiced',
      nickname: '小猫成群音（清）',
      emoji: '🐈',
      chant: '舌尖轻擦像刺猬，小猫们 cats /ts/ /ts/ /ts/',
      mouthTip: '舌尖抵住上齿龈，快速擦出 /t/+/s/，常出现在复数词尾！',
      mouthShape: 'smile',
      voiced: false,
      pairWith: 'dz',
      speakWord: 'cats',
      spellingRules: [
        { letters: 'ts', word: 'cats', highlight: 'ts', zh: '小猫们', emoji: '🐱' },
        { letters: 'ts', word: 'hats', highlight: 'ts', zh: '帽子们', emoji: '🎩' },
        { letters: 'ts', word: 'boats', highlight: 'ts', zh: '小船们', emoji: '⛵' }
      ]
    },
    {
      id: 'dz',
      symbol: '/dz/',
      category: 'voiceless_voiced',
      nickname: '小鸟成群音（浊）',
      emoji: '🐥',
      chant: '舌尖摩擦喉咙震，小鸟们 birds /dz/ /dz/ /dz/',
      mouthTip: '口型与 /ts/ 相同，声带震动，常出现在以 d 结尾的复数单词！',
      mouthShape: 'smile',
      voiced: true,
      pairWith: 'ts',
      speakWord: 'birds',
      spellingRules: [
        { letters: 'ds', word: 'birds', highlight: 'ds', zh: '小鸟们', emoji: '🐦' },
        { letters: 'ds', word: 'beds', highlight: 'ds', zh: '小床们', emoji: '🛏️' },
        { letters: 'ds', word: 'hands', highlight: 'ds', zh: '双手', emoji: '🙌' }
      ]
    },

    // ==================== 五、鼻音与魔法辅音（8个）====================
    {
      id: 'm',
      symbol: '/m/',
      category: 'other_consonant',
      nickname: '美味闭嘴音',
      emoji: '🥛',
      chant: '双唇紧闭鼻子哼，牛奶 milk 真香 /m/ /m/ /m/',
      mouthTip: '上下嘴唇紧紧闭拢，气流从鼻腔送出，像吃到美食“嗯——”。',
      mouthShape: 'nasal',
      voiced: true,
      pairWith: 'n',
      speakWord: 'milk',
      spellingRules: [
        { letters: 'm', word: 'milk', highlight: 'm', zh: '牛奶', emoji: '🥛' },
        { letters: 'm', word: 'moon', highlight: 'm', zh: '月亮', emoji: '🌙' },
        { letters: 'm', word: 'map', highlight: 'm', zh: '地图', emoji: '🗺️' }
      ]
    },
    {
      id: 'n',
      symbol: '/n/',
      category: 'other_consonant',
      nickname: '小鼻子前鼻音',
      emoji: '👃',
      chant: '嘴巴微开舌顶牙，鼻子 nose 哼 /n/ /n/ /n/',
      mouthTip: '嘴唇微张，舌尖抵住上齿龈，让声音从鼻子里共鸣出来。',
      mouthShape: 'nasal',
      voiced: true,
      pairWith: 'ng',
      speakWord: 'nose',
      spellingRules: [
        { letters: 'n', word: 'nose', highlight: 'n', zh: '鼻子', emoji: '👃' },
        { letters: 'n', word: 'nine', highlight: 'n', zh: '数字九', emoji: '9️⃣' },
        { letters: 'n', word: 'sun', highlight: 'n', zh: '太阳', emoji: '☀️' }
      ]
    },
    {
      id: 'ng',
      symbol: '/ŋ/',
      category: 'other_consonant',
      nickname: '长尾巴后鼻音',
      emoji: '👑',
      chant: '小 n 长出长尾巴，国王 king 唱歌 /ŋ/ /ŋ/ /ŋ/',
      mouthTip: '嘴巴微张，舌后部抬高挡住口腔，气流全从鼻腔深处出来！',
      mouthShape: 'nasal',
      voiced: true,
      pairWith: 'n',
      speakWord: 'king',
      spellingRules: [
        { letters: 'ng', word: 'king', highlight: 'ng', zh: '国王', emoji: '👑' },
        { letters: 'ng', word: 'sing', highlight: 'ng', zh: '唱歌', emoji: '🎤' },
        { letters: 'ng', word: 'ring', highlight: 'ng', zh: '戒指', emoji: '💍' }
      ]
    },
    {
      id: 'h',
      symbol: '/h/',
      category: 'other_consonant',
      nickname: '哈气暖手音',
      emoji: '🙌',
      chant: '张嘴哈气暖小手，帽子 hat 戴 /h/ /h/ /h/',
      mouthTip: '嘴巴自然张开，像冬天哈气暖手一样轻轻呼气，喉咙不震动。',
      mouthShape: 'wide-open',
      voiced: false,
      pairWith: 'f',
      speakWord: 'hat',
      spellingRules: [
        { letters: 'h', word: 'hat', highlight: 'h', zh: '帽子', emoji: '🎩' },
        { letters: 'h', word: 'hand', highlight: 'h', zh: '小手', emoji: '✋' },
        { letters: 'h', word: 'horse', highlight: 'h', zh: '小马', emoji: '🐴' }
      ]
    },
    {
      id: 'l',
      symbol: '/l/',
      category: 'other_consonant',
      nickname: '狮子翘舌边音',
      emoji: '🦁',
      chant: '舌尖翘起抵牙床，狮子 lion 吼 /l/ /l/ /l/',
      mouthTip: '舌尖牢牢抵住上齿龈，声音从舌头两边流出来！',
      mouthShape: 'tongue-tip',
      voiced: true,
      pairWith: 'r',
      speakWord: 'lion',
      spellingRules: [
        { letters: 'l', word: 'lion', highlight: 'l', zh: '狮子', emoji: '🦁' },
        { letters: 'l', word: 'leg', highlight: 'l', zh: '小腿', emoji: '🦵' },
        { letters: 'll', word: 'ball', highlight: 'll', zh: '皮球', emoji: '⚽' }
      ]
    },
    {
      id: 'r',
      symbol: '/r/',
      category: 'other_consonant',
      nickname: '小兔卷舌音',
      emoji: '🐰',
      chant: '舌尖卷起别碰牙，兔子 rabbit 跑 /r/ /r/ /r/',
      mouthTip: '双唇微微收圆前突，舌尖向上向后轻卷，注意不要碰到上颚哦。',
      mouthShape: 'curl',
      voiced: true,
      pairWith: 'l',
      speakWord: 'red',
      spellingRules: [
        { letters: 'r', word: 'red', highlight: 'r', zh: '红色', emoji: '🔴' },
        { letters: 'r', word: 'rain', highlight: 'r', zh: '下雨', emoji: '🌧️' },
        { letters: 'r', word: 'rabbit', highlight: 'r', zh: '兔子', emoji: '🐰' }
      ]
    },
    {
      id: 'w',
      symbol: '/w/',
      category: 'other_consonant',
      nickname: '小鱼嘟嘴音',
      emoji: '💧',
      chant: '先嘟小圆再放开，清水 water 喝 /w/ /w/ /w/',
      mouthTip: '双唇先用力收成小圆孔，然后快速向外滑开，像说“喔”。',
      mouthShape: 'round-small',
      voiced: true,
      pairWith: 'v',
      speakWord: 'water',
      spellingRules: [
        { letters: 'w', word: 'water', highlight: 'w', zh: '清水', emoji: '💧' },
        { letters: 'w', word: 'watch', highlight: 'w', zh: '手表', emoji: '⌚' },
        { letters: 'w', word: 'window', highlight: 'w', zh: '窗户', emoji: '🪟' }
      ]
    },
    {
      id: 'j',
      symbol: '/j/',
      category: 'other_consonant',
      nickname: '开心耶耶音',
      emoji: '💛',
      chant: '嘴角微笑像说耶，黄色 yellow 亮 /j/ /j/ /j/',
      mouthTip: '嘴唇向两边展开呈微笑状，短促滑出，像开心地说“耶”！',
      mouthShape: 'smile',
      voiced: true,
      pairWith: 'dzh',
      speakWord: 'yellow',
      spellingRules: [
        { letters: 'y', word: 'yellow', highlight: 'y', zh: '黄色', emoji: '💛' },
        { letters: 'y', word: 'yes', highlight: 'y', zh: '是的', emoji: '✅' },
        { letters: 'y', word: 'yo-yo', highlight: 'y', zh: '悠悠球', emoji: '🪀' }
      ]
    }
  ];

  /**
   * 音标拼词工坊词库（用发音直觉拼写记忆单词！）
   * 重要规则：segments 中所有 letters 按顺序拼接后必须严格等于 word
   * level: 1=入门(CVC单音节) 2=进阶(双字母组合/长元音) 3=大师(双元音/辅音丛)
   */
  const SPELL_WORDS = [
    // Level 1: 入门三音拼读 (CVC)
    {
      word: 'cat',
      ipa: '/kæt/',
      zh: '小猫',
      emoji: '🐱',
      level: 1,
      tip: '听音拆解：/k/ 写 c，大嘴 /æ/ 写 a，/t/ 写 t！',
      segments: [
        { phoneme: '/k/', letters: 'c' },
        { phoneme: '/æ/', letters: 'a' },
        { phoneme: '/t/', letters: 't' }
      ]
    },
    {
      word: 'dog',
      ipa: '/dɒg/',
      zh: '小狗',
      emoji: '🐶',
      level: 1,
      tip: '听音拆解：/d/ 写 d，圆嘴 /ɒ/ 写 o，/g/ 写 g！',
      segments: [
        { phoneme: '/d/', letters: 'd' },
        { phoneme: '/ɒ/', letters: 'o' },
        { phoneme: '/g/', letters: 'g' }
      ]
    },
    {
      word: 'pig',
      ipa: '/pɪg/',
      zh: '小猪',
      emoji: '🐷',
      level: 1,
      tip: '短促的 /ɪ/ 对应字母 i，p-i-g 一气呵成！',
      segments: [
        { phoneme: '/p/', letters: 'p' },
        { phoneme: '/ɪ/', letters: 'i' },
        { phoneme: '/g/', letters: 'g' }
      ]
    },
    {
      word: 'bed',
      ipa: '/bed/',
      zh: '小床',
      emoji: '🛏️',
      level: 1,
      tip: '一指音 /e/ 对应字母 e，b-e-d 像一张小床！',
      segments: [
        { phoneme: '/b/', letters: 'b' },
        { phoneme: '/e/', letters: 'e' },
        { phoneme: '/d/', letters: 'd' }
      ]
    },
    {
      word: 'sun',
      ipa: '/sʌn/',
      zh: '太阳',
      emoji: '☀️',
      level: 1,
      tip: '小尖角 /ʌ/ 最常由字母 u 发出，s-u-n！',
      segments: [
        { phoneme: '/s/', letters: 's' },
        { phoneme: '/ʌ/', letters: 'u' },
        { phoneme: '/n/', letters: 'n' }
      ]
    },
    {
      word: 'hat',
      ipa: '/hæt/',
      zh: '帽子',
      emoji: '🎩',
      level: 1,
      tip: '哈气音 /h/ + 梅花音 /æ/ + /t/ = hat！',
      segments: [
        { phoneme: '/h/', letters: 'h' },
        { phoneme: '/æ/', letters: 'a' },
        { phoneme: '/t/', letters: 't' }
      ]
    },
    {
      word: 'cup',
      ipa: '/kʌp/',
      zh: '杯子',
      emoji: '☕',
      level: 1,
      tip: 'c 发 /k/，u 发 /ʌ/，p 发 /p/！',
      segments: [
        { phoneme: '/k/', letters: 'c' },
        { phoneme: '/ʌ/', letters: 'u' },
        { phoneme: '/p/', letters: 'p' }
      ]
    },
    {
      word: 'red',
      ipa: '/red/',
      zh: '红色',
      emoji: '🔴',
      level: 1,
      tip: '卷舌 /r/ + /e/ + /d/ = red！',
      segments: [
        { phoneme: '/r/', letters: 'r' },
        { phoneme: '/e/', letters: 'e' },
        { phoneme: '/d/', letters: 'd' }
      ]
    },
    {
      word: 'bag',
      ipa: '/bæg/',
      zh: '书包',
      emoji: '🎒',
      level: 1,
      tip: '浊辅音 /b/ + 大嘴 /æ/ + /g/ = bag！',
      segments: [
        { phoneme: '/b/', letters: 'b' },
        { phoneme: '/æ/', letters: 'a' },
        { phoneme: '/g/', letters: 'g' }
      ]
    },
    {
      word: 'pen',
      ipa: '/pen/',
      zh: '钢笔',
      emoji: '🖊️',
      level: 1,
      tip: '轻吹气 /p/ + /e/ + 鼻音 /n/ = pen！',
      segments: [
        { phoneme: '/p/', letters: 'p' },
        { phoneme: '/e/', letters: 'e' },
        { phoneme: '/n/', letters: 'n' }
      ]
    },
    {
      word: 'map',
      ipa: '/mæp/',
      zh: '地图',
      emoji: '🗺️',
      level: 1,
      tip: '闭嘴鼻音 /m/ + /æ/ + /p/ = map！',
      segments: [
        { phoneme: '/m/', letters: 'm' },
        { phoneme: '/æ/', letters: 'a' },
        { phoneme: '/p/', letters: 'p' }
      ]
    },
    {
      word: 'bus',
      ipa: '/bʌs/',
      zh: '公交车',
      emoji: '🚌',
      level: 1,
      tip: '/b/ + /ʌ/ (u) + 小蛇 /s/ = bus！',
      segments: [
        { phoneme: '/b/', letters: 'b' },
        { phoneme: '/ʌ/', letters: 'u' },
        { phoneme: '/s/', letters: 's' }
      ]
    },
    {
      word: 'hot',
      ipa: '/hɒt/',
      zh: '热的',
      emoji: '🔥',
      level: 1,
      tip: '哈气 /h/ + 圆嘴 /ɒ/ + /t/ = hot！',
      segments: [
        { phoneme: '/h/', letters: 'h' },
        { phoneme: '/ɒ/', letters: 'o' },
        { phoneme: '/t/', letters: 't' }
      ]
    },
    {
      word: 'van',
      ipa: '/væn/',
      zh: '面包车',
      emoji: '🚐',
      level: 1,
      tip: '咬唇震动 /v/ + /æ/ + /n/ = van！',
      segments: [
        { phoneme: '/v/', letters: 'v' },
        { phoneme: '/æ/', letters: 'a' },
        { phoneme: '/n/', letters: 'n' }
      ]
    },
    {
      word: 'jam',
      ipa: '/dʒæm/',
      zh: '果酱',
      emoji: '🍓',
      level: 1,
      tip: 'j 发 /dʒ/，加上 /æ/ 和 /m/ 就是 jam！',
      segments: [
        { phoneme: '/dʒ/', letters: 'j' },
        { phoneme: '/æ/', letters: 'a' },
        { phoneme: '/m/', letters: 'm' }
      ]
    },

    // Level 2: 进阶字母组合（见音知组合，记词翻倍快！）
    {
      word: 'bee',
      ipa: '/biː/',
      zh: '蜜蜂',
      emoji: '🐝',
      level: 2,
      tip: '魔法组合 ee 经常发长元音 /iː/！',
      segments: [
        { phoneme: '/b/', letters: 'b' },
        { phoneme: '/iː/', letters: 'ee' }
      ]
    },
    {
      word: 'car',
      ipa: '/kɑː/',
      zh: '小汽车',
      emoji: '🚗',
      level: 2,
      tip: '魔法组合 ar 一起发长音 /ɑː/！',
      segments: [
        { phoneme: '/k/', letters: 'c' },
        { phoneme: '/ɑː/', letters: 'ar' }
      ]
    },
    {
      word: 'fish',
      ipa: '/fɪʃ/',
      zh: '小鱼',
      emoji: '🐟',
      level: 2,
      tip: '听到安静嘘嘘音 /ʃ/，立刻想到 sh！',
      segments: [
        { phoneme: '/f/', letters: 'f' },
        { phoneme: '/ɪ/', letters: 'i' },
        { phoneme: '/ʃ/', letters: 'sh' }
      ]
    },
    {
      word: 'duck',
      ipa: '/dʌk/',
      zh: '鸭子',
      emoji: '🦆',
      level: 2,
      tip: '短元音后面的 /k/ 经常写成 ck！',
      segments: [
        { phoneme: '/d/', letters: 'd' },
        { phoneme: '/ʌ/', letters: 'u' },
        { phoneme: '/k/', letters: 'ck' }
      ]
    },
    {
      word: 'book',
      ipa: '/bʊk/',
      zh: '书本',
      emoji: '📖',
      level: 2,
      tip: 'oo 组合在 k 前面常常发短音 /ʊ/！',
      segments: [
        { phoneme: '/b/', letters: 'b' },
        { phoneme: '/ʊ/', letters: 'oo' },
        { phoneme: '/k/', letters: 'k' }
      ]
    },
    {
      word: 'moon',
      ipa: '/muːn/',
      zh: '月亮',
      emoji: '🌙',
      level: 2,
      tip: 'oo 像两轮圆月，发长元音 /uː/！',
      segments: [
        { phoneme: '/m/', letters: 'm' },
        { phoneme: '/uː/', letters: 'oo' },
        { phoneme: '/n/', letters: 'n' }
      ]
    },
    {
      word: 'bird',
      ipa: '/bɜːd/',
      zh: '小鸟',
      emoji: '🐦',
      level: 2,
      tip: '组合 ir 发长卷舌音 /ɜː/，牢记 b-ir-d！',
      segments: [
        { phoneme: '/b/', letters: 'b' },
        { phoneme: '/ɜː/', letters: 'ir' },
        { phoneme: '/d/', letters: 'd' }
      ]
    },
    {
      word: 'star',
      ipa: '/stɑː/',
      zh: '星星',
      emoji: '⭐',
      level: 2,
      tip: '/s/ + /t/ + ar(/ɑː/)，拼出闪亮 star！',
      segments: [
        { phoneme: '/s/', letters: 's' },
        { phoneme: '/t/', letters: 't' },
        { phoneme: '/ɑː/', letters: 'ar' }
      ]
    },
    {
      word: 'fork',
      ipa: '/fɔːk/',
      zh: '叉子',
      emoji: '🍴',
      level: 2,
      tip: '组合 or 一起发长圆音 /ɔː/！',
      segments: [
        { phoneme: '/f/', letters: 'f' },
        { phoneme: '/ɔː/', letters: 'or' },
        { phoneme: '/k/', letters: 'k' }
      ]
    },
    {
      word: 'king',
      ipa: '/kɪŋ/',
      zh: '国王',
      emoji: '👑',
      level: 2,
      tip: '长尾巴后鼻音 /ŋ/ 对应魔法组合 ng！',
      segments: [
        { phoneme: '/k/', letters: 'k' },
        { phoneme: '/ɪ/', letters: 'i' },
        { phoneme: '/ŋ/', letters: 'ng' }
      ]
    },
    {
      word: 'sing',
      ipa: '/sɪŋ/',
      zh: '唱歌',
      emoji: '🎤',
      level: 2,
      tip: 's + i + ng(/ŋ/) = sing，和 king 押韵！',
      segments: [
        { phoneme: '/s/', letters: 's' },
        { phoneme: '/ɪ/', letters: 'i' },
        { phoneme: '/ŋ/', letters: 'ng' }
      ]
    },
    {
      word: 'sheep',
      ipa: '/ʃiːp/',
      zh: '绵羊',
      emoji: '🐑',
      level: 2,
      tip: 'sh(/ʃ/) + ee(/iː/) + p(/p/)，两个组合轻松记！',
      segments: [
        { phoneme: '/ʃ/', letters: 'sh' },
        { phoneme: '/iː/', letters: 'ee' },
        { phoneme: '/p/', letters: 'p' }
      ]
    },
    {
      word: 'tree',
      ipa: '/triː/',
      zh: '大树',
      emoji: '🌳',
      level: 2,
      tip: '清辅音 /tr/ 写 tr，长音 /iː/ 写 ee！',
      segments: [
        { phoneme: '/tr/', letters: 'tr' },
        { phoneme: '/iː/', letters: 'ee' }
      ]
    },
    {
      word: 'park',
      ipa: '/pɑːk/',
      zh: '公园',
      emoji: '🏞️',
      level: 2,
      tip: 'p + ar(/ɑː/) + k = park！',
      segments: [
        { phoneme: '/p/', letters: 'p' },
        { phoneme: '/ɑː/', letters: 'ar' },
        { phoneme: '/k/', letters: 'k' }
      ]
    },
    {
      word: 'tea',
      ipa: '/tiː/',
      zh: '清茶',
      emoji: '🍵',
      level: 2,
      tip: '组合 ea 也是长元音 /iː/ 的好朋友！',
      segments: [
        { phoneme: '/t/', letters: 't' },
        { phoneme: '/iː/', letters: 'ea' }
      ]
    },

    // Level 3: 大师双元音与复合拼读
    {
      word: 'rain',
      ipa: '/reɪn/',
      zh: '下雨',
      emoji: '🌧️',
      level: 3,
      tip: '双元音 /eɪ/ 在词中常写成 ai！',
      segments: [
        { phoneme: '/r/', letters: 'r' },
        { phoneme: '/eɪ/', letters: 'ai' },
        { phoneme: '/n/', letters: 'n' }
      ]
    },
    {
      word: 'boat',
      ipa: '/bəʊt/',
      zh: '小船',
      emoji: '⛵',
      level: 3,
      tip: 'oa 组合发字母 O 的音 /əʊ/！',
      segments: [
        { phoneme: '/b/', letters: 'b' },
        { phoneme: '/əʊ/', letters: 'oa' },
        { phoneme: '/t/', letters: 't' }
      ]
    },
    {
      word: 'cow',
      ipa: '/kaʊ/',
      zh: '奶牛',
      emoji: '🐮',
      level: 3,
      tip: 'ow 发出奶牛嗷呜音 /aʊ/！',
      segments: [
        { phoneme: '/k/', letters: 'c' },
        { phoneme: '/aʊ/', letters: 'ow' }
      ]
    },
    {
      word: 'boy',
      ipa: '/bɔɪ/',
      zh: '男孩',
      emoji: '👦',
      level: 3,
      tip: '词尾双元音 /ɔɪ/ 常常写成 oy！',
      segments: [
        { phoneme: '/b/', letters: 'b' },
        { phoneme: '/ɔɪ/', letters: 'oy' }
      ]
    },
    {
      word: 'coin',
      ipa: '/kɔɪn/',
      zh: '硬币',
      emoji: '🪙',
      level: 3,
      tip: '词中的双元音 /ɔɪ/ 常常写成 oi！',
      segments: [
        { phoneme: '/k/', letters: 'c' },
        { phoneme: '/ɔɪ/', letters: 'oi' },
        { phoneme: '/n/', letters: 'n' }
      ]
    },
    {
      word: 'chair',
      ipa: '/tʃeə/',
      zh: '椅子',
      emoji: '🪑',
      level: 3,
      tip: 'ch(/tʃ/) + air(/eə/)，两块拼图秒记 chair！',
      segments: [
        { phoneme: '/tʃ/', letters: 'ch' },
        { phoneme: '/eə/', letters: 'air' }
      ]
    },
    {
      word: 'train',
      ipa: '/treɪn/',
      zh: '火车',
      emoji: '🚆',
      level: 3,
      tip: 'tr(/tr/) + ai(/eɪ/) + n(/n/) = train！',
      segments: [
        { phoneme: '/tr/', letters: 'tr' },
        { phoneme: '/eɪ/', letters: 'ai' },
        { phoneme: '/n/', letters: 'n' }
      ]
    },
    {
      word: 'three',
      ipa: '/θriː/',
      zh: '数字三',
      emoji: '3️⃣',
      level: 3,
      tip: '咬舌音 /θ/ 写 th，加上 /r/ 和 ee(/iː/)！',
      segments: [
        { phoneme: '/θ/', letters: 'th' },
        { phoneme: '/r/', letters: 'r' },
        { phoneme: '/iː/', letters: 'ee' }
      ]
    },
    {
      word: 'mouth',
      ipa: '/maʊθ/',
      zh: '嘴巴',
      emoji: '👄',
      level: 3,
      tip: 'm + ou(/aʊ/) + 咬舌 th(/θ/) = mouth！',
      segments: [
        { phoneme: '/m/', letters: 'm' },
        { phoneme: '/aʊ/', letters: 'ou' },
        { phoneme: '/θ/', letters: 'th' }
      ]
    },
    {
      word: 'peach',
      ipa: '/piːtʃ/',
      zh: '桃子',
      emoji: '🍑',
      level: 3,
      tip: 'p + ea(/iː/) + ch(/tʃ/) = peach！',
      segments: [
        { phoneme: '/p/', letters: 'p' },
        { phoneme: '/iː/', letters: 'ea' },
        { phoneme: '/tʃ/', letters: 'ch' }
      ]
    },
    {
      word: 'deer',
      ipa: '/dɪə/',
      zh: '小鹿',
      emoji: '🦌',
      level: 3,
      tip: 'd + eer(/ɪə/) = deer！',
      segments: [
        { phoneme: '/d/', letters: 'd' },
        { phoneme: '/ɪə/', letters: 'eer' }
      ]
    },
    {
      word: 'snow',
      ipa: '/snəʊ/',
      zh: '雪花',
      emoji: '❄️',
      level: 3,
      tip: 's + n + ow(/əʊ/) = snow！',
      segments: [
        { phoneme: '/s/', letters: 's' },
        { phoneme: '/n/', letters: 'n' },
        { phoneme: '/əʊ/', letters: 'ow' }
      ]
    },
    {
      word: 'drum',
      ipa: '/drʌm/',
      zh: '小鼓',
      emoji: '🥁',
      level: 3,
      tip: '浊辅音 /dr/ 写 dr，加上 u(/ʌ/) 和 m！',
      segments: [
        { phoneme: '/dr/', letters: 'dr' },
        { phoneme: '/ʌ/', letters: 'u' },
        { phoneme: '/m/', letters: 'm' }
      ]
    },
    {
      word: 'cats',
      ipa: '/kæts/',
      zh: '小猫们',
      emoji: '🐱',
      level: 3,
      tip: '复数词尾 ts 一起发清脆的 /ts/！',
      segments: [
        { phoneme: '/k/', letters: 'c' },
        { phoneme: '/æ/', letters: 'a' },
        { phoneme: '/ts/', letters: 'ts' }
      ]
    },
    {
      word: 'birds',
      ipa: '/bɜːdz/',
      zh: '小鸟们',
      emoji: '🐦',
      level: 3,
      tip: 'b + ir(/ɜː/) + 浊辅音 ds(/dz/) = birds！',
      segments: [
        { phoneme: '/b/', letters: 'b' },
        { phoneme: '/ɜː/', letters: 'ir' },
        { phoneme: '/dz/', letters: 'ds' }
      ]
    }
  ];

  /** 成长勋章定义 */
  const BADGES = [
    {
      id: 'first_star',
      name: '启航小星星',
      emoji: '🌟',
      desc: '获得第 10 颗星星',
      check: (state) => state.stars >= 10
    },
    {
      id: 'vowel_friend',
      name: '元音小歌手',
      emoji: '🎵',
      desc: '点亮 10 个元音音标',
      check: (state) => {
        const vowelIds = new Set(
          IPA_LIST.filter((i) => i.category !== 'voiceless_voiced' && i.category !== 'other_consonant').map((i) => i.id)
        );
        return state.mastered.filter((id) => vowelIds.has(id)).length >= 10;
      }
    },
    {
      id: 'combo_5',
      name: '顺风耳小达人',
      emoji: '👂',
      desc: '听音捉精灵达成 5 连击',
      check: (state) => state.bestCombo >= 5
    },
    {
      id: 'spell_10',
      name: '自然拼读魔法师',
      emoji: '🪄',
      desc: '在拼词工坊拼对 10 个单词',
      check: (state) => state.spelledWords.length >= 10
    },
    {
      id: 'memory_win',
      name: '最强大脑翻牌王',
      emoji: '🃏',
      desc: '通关 1 次记忆翻翻乐',
      check: (state) => state.memoryWins >= 1
    },
    {
      id: 'ipa_master',
      name: '48 音标全图鉴大师',
      emoji: '👑',
      desc: '点亮全部 48 个国际音标',
      check: (state) => state.mastered.length >= 48
    }
  ];

  const IPAData = {
    CATEGORIES,
    IPA_LIST,
    SPELL_WORDS,
    BADGES
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = IPAData;
  } else {
    root.IPAData = IPAData;
  }
})(typeof globalThis !== 'undefined' ? globalThis : window);
