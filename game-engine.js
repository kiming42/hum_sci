/* ============================================================================
   🚀 JUSTIN 太空奪蛋宇宙 v7.0 — 完整遊戲引擎模組 (game-engine.js)
   包含：
   1. 連接 Dashboard 課題篩選器 (支援科學 U1-U4 / 人文 U1-U4 自由組合)
   2. 精緻 Canvas 像素/向量角色繪製 (JUSTIN 造型 + 動態神獸 + 裝甲外星怪獸)
   3. 複合遊戲玩法：
      - Steal an Egg (隨機稀有度、雙蛋疊高連偷 2.5x 獎金)
      - 太空機關陣 (雙向傳送蟲洞、黑洞漩渦、流星補給箱、隕石轟炸閃避)
      - 基地保衛戰 (Alien Boss Raid 激光炮問答防守，擊敗送大獎)
   4. 基地養成：可擴充孵化器 (手動破殼)、無限蛋倉庫、3合1黃金神獸合成
============================================================================ */

const RARITY_TIERS = [
  { tier: 1, name: "普通太空蛋", color: "#a7f070", hatchSec: 20,  income: 1,  weight: 0.04 },
  { tier: 2, name: "稀有藍晶蛋", color: "#41a6f6", hatchSec: 40,  income: 3,  weight: 0.08 },
  { tier: 3, name: "史詩紫星蛋", color: "#c084fc", hatchSec: 75,  income: 8,  weight: 0.12 },
  { tier: 4, name: "傳說金陽蛋", color: "#ffcd75", hatchSec: 120, income: 22, weight: 0.16 },
  { tier: 5, name: "宇宙神話蛋", color: "#ef7d57", hatchSec: 180, income: 65, weight: 0.20 }
];

const PET_DEX = [
  { id: "p1", tier: 1, name: "星際史萊姆龍", icon: "🟢", rarity: "普通", income: 1,  color: "#a7f070", bodyColor: "#22c55e", eyeColor: "#fff", note: "嬰幼兒期(0歲~生長最快) ➔ 兒童期(5歲~) ➔ 青春期(10歲~) ➔ 成年期(20歲~最強壯) ➔ 老年期(60歲~)。" },
  { id: "p2", tier: 2, name: "藍翼荷爾蒙獸", icon: "🦋", rarity: "稀有", income: 3,  color: "#41a6f6", bodyColor: "#3b82f6", eyeColor: "#fde047", note: "腦部分泌荷爾蒙刺激生殖器官：睾丸產生男性荷爾蒙；卵巢產生女性荷爾蒙。" },
  { id: "p3", tier: 2, name: "量子生命水母", icon: "🪼", rarity: "稀有", income: 4,  color: "#41a6f6", bodyColor: "#06b6d4", eyeColor: "#fff", note: "精子(0.05mm似蝌蚪，睾丸製造)；卵子(0.1-0.2mm圓球狀，卵巢排卵、子宮孕育胎兒)。" },
  { id: "p4", tier: 3, name: "裝甲戰痘機神", icon: "🤖", rarity: "史詩", income: 8,  color: "#c084fc", bodyColor: "#8b5cf6", eyeColor: "#38bdf8", note: "油脂＋塵埃塞毛孔＝黑頭；細菌感染發炎＝暗瘡。切勿擠壓或過度清潔！" },
  { id: "p5", tier: 3, name: "深空月光睡神", icon: "🌙", rarity: "史詩", income: 10, color: "#c084fc", bodyColor: "#6366f1", eyeColor: "#fef08a", note: "6-13歲每天睡9-11小時！生長荷爾蒙在晚上10時至凌晨2時深層睡眠分泌。" },
  { id: "p6", tier: 4, name: "黃金金字塔龍", icon: "🐉", rarity: "傳說", income: 22, color: "#ffcd75", bodyColor: "#f59e0b", eyeColor: "#ef4444", note: "吃最多穀物、多吃蔬果、適量奶肉蛋、最少油鹽糖＋每天6-8杯水！少吃垃圾食物。" },
  { id: "p7", tier: 4, name: "超光速運動虎", icon: "⚡", rarity: "傳說", income: 26, color: "#ffcd75", bodyColor: "#eab308", eyeColor: "#38bdf8", note: "每天累積60分鐘中等運動(能說話不能唱歌)＋每週3次劇烈運動(說不完整句子)。" },
  { id: "p8", tier: 5, name: "神話銀背星王", icon: "🦍", rarity: "神話", income: 65, color: "#ef7d57", bodyColor: "#dc2626", eyeColor: "#fde047", note: "雄性大猩猩背部變銀灰色代表性成熟；樽鼻海豚成年前獨立探索。做個負責任數碼公民！" }
];

const NEST_SPOTS = [
  { id: 0, x: 160, y: 2150, monsterName: "綠晶裝甲獸", mType: "slime",  mColor: "#22c55e", mSpeed: 2.3, mRadius: 21, minTier: 1 },
  { id: 1, x: 600, y: 1900, monsterName: "獨眼激光衛兵", mType: "cyclops",mColor: "#3b82f6", mSpeed: 2.6, mRadius: 22, minTier: 1 },
  { id: 2, x: 160, y: 1620, monsterName: "雙角隕石魔王", mType: "demon",  mColor: "#a855f7", mSpeed: 2.9, mRadius: 24, minTier: 1 },
  { id: 3, x: 600, y: 1350, monsterName: "虛空機械蜘蛛", mType: "spider", mColor: "#ec4899", mSpeed: 3.2, mRadius: 23, minTier: 2 },
  { id: 4, x: 160, y: 1050, monsterName: "銀河暗影刺客", mType: "ninja",  mColor: "#6366f1", mSpeed: 3.5, mRadius: 22, minTier: 2 },
  { id: 5, x: 600, y: 760,  monsterName: "熔岩泰坦巨獸", mType: "titan",  mColor: "#f97316", mSpeed: 3.8, mRadius: 27, minTier: 2 },
  { id: 6, x: 170, y: 460,  monsterName: "宇宙冰霜魔龍", mType: "dragon", mColor: "#06b6d4", mSpeed: 4.1, mRadius: 28, minTier: 3 },
  { id: 7, x: 380, y: 160,  monsterName: "黑洞終極帝皇", mType: "boss",   mColor: "#ef4444", mSpeed: 4.5, mRadius: 33, minTier: 3 }
];

// 太空機關：雙向蟲洞、黑洞漩渦、流星補給箱、動態隕石轟炸
const WORMHOLES = [
  { y: 1750, leftX: 88, rightX: 672, color: "#c084fc" },
  { y: 900,  leftX: 88, rightX: 672, color: "#38bdf8" }
];

const BLACK_HOLES = [
  { x: 380, y: 1500, r: 44 },
  { x: 380, y: 620,  r: 48 }
];

let meteorSupply = { active: true, x: 380, y: 1220, timer: 0 };
let fallingMeteors = []; // 隨機隕石閃避玩法

// 基地保衛戰 (Boss Raid Event)
let bossRaid = {
  active: false,
  hp: 3,
  maxHp: 3,
  x: 380,
  y: 2360,
  timer: 1800 // 每 30 秒有機會觸發外星母艦突襲基地
};

function rollRandomEggTier(minTier = 1) {
  const r = Math.random();
  let chosen = 1;
  if (r < 0.03) chosen = 5;
  else if (r < 0.11) chosen = 4;
  else if (r < 0.28) chosen = 3;
  else if (r < 0.56) chosen = 2;
  return Math.max(minTier, chosen);
}

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const WORLD_W = 760;
const WORLD_H = 2800;

let cameraY = WORLD_H - canvas.height;

const DEFAULT_SAVE = {
  coins: 15,
  speedLv: 1,
  carryLv: 1,
  freezeCount: 1,
  decoyCount: 0,
  teleCount: 0,
  shieldCount: 1,
  hasDoubleCoin: false,
  maxIncubators: 3,
  incubators: [],
  eggStorage: [],
  basePets: [],
  unlockedIds: [],
  wrongQuestions: []
};

let save = JSON.parse(localStorage.getItem('justin_xnamx_v7')) || JSON.parse(JSON.stringify(DEFAULT_SAVE));
if (!save.maxIncubators) save.maxIncubators = 3;
if (!save.eggStorage) save.eggStorage = [];
if (!save.wrongQuestions) save.wrongQuestions = [];

function getPetInfo(petKey) {
  const isGold = petKey.endsWith('_gold');
  const rawId = isGold ? petKey.replace('_gold', '') : petKey;
  const baseObj = PET_DEX.find(x => x.id === rawId);
  if (!baseObj) return null;
  return {
    ...baseObj,
    isGold,
    displayName: isGold ? `✨黃金${baseObj.name}` : baseObj.name,
    income: isGold ? baseObj.income * 3 : baseObj.income
  };
}

function getTotalIncomePerSec() {
  const base = save.basePets.reduce((sum, key) => {
    const info = getPetInfo(key);
    return sum + (info ? info.income : 0);
  }, 0);
  return save.hasDoubleCoin ? base * 2 : base;
}

function autoFillIncubatorsFromStorage() {
  while (save.incubators.length < save.maxIncubators && save.eggStorage.length > 0) {
    save.eggStorage.sort((a, b) => b - a);
    const nextTier = save.eggStorage.shift();
    const rObj = RARITY_TIERS.find(r => r.tier === nextTier);
    save.incubators.push({
      tier: nextTier,
      name: rObj.name,
      color: rObj.color,
      timeLeft: rObj.hatchSec,
      ready: false
    });
  }
}

function saveData() {
  localStorage.setItem('justin_xnamx_v7', JSON.stringify(save));
  updateUI();
}

function mergeDuplicatePets() {
  const counts = {};
  save.basePets.forEach(k => {
    if (!k.endsWith('_gold')) counts[k] = (counts[k] || 0) + 1;
  });

  let mergedAny = false;
  for (const [petId, cnt] of Object.entries(counts)) {
    if (cnt >= 3) {
      let removed = 0;
      save.basePets = save.basePets.filter(k => {
        if (k === petId && removed < 3) { removed++; return false; }
        return true;
      });
      save.basePets.push(`${petId}_gold`);
      mergedAny = true;
    }
  }

  if (mergedAny) {
    saveData();
    openShop();
    showToast("✨ 合成成功！3隻同款神獸已進化為【黃金神獸】(每秒收入 x3 倍)！");
  } else {
    showToast("需要基地展示台上有 3 隻相同嘅普通神獸先可以合成黃金版！");
  }
}

const nests = NEST_SPOTS.map(s => ({
  ...s,
  eggTier: rollRandomEggTier(s.minTier),
  hasEgg: true,
  respawnTimer: 0,
  monster: {
    x: s.x < 380 ? s.x + 72 : s.x - 72,
    y: s.y,
    homeX: s.x < 380 ? s.x + 72 : s.x - 72,
    homeY: s.y,
    state: 'idle',
    stunTimer: 0
  }
}));

// 每 25 秒刷新場上未被偷走嘅蛋稀有度
setInterval(() => {
  if (gamePaused) return;
  nests.forEach(n => {
    if (n.hasEgg && n.monster.state === 'idle') {
      n.eggTier = rollRandomEggTier(n.minTier);
    }
  });
}, 25000);

// 每秒基地收錢 & 孵化器倒數
let floatingCoins = [];
setInterval(() => {
  if (gamePaused) return;
  const inc = getTotalIncomePerSec();
  if (inc > 0) {
    save.coins += inc;
    floatingCoins.push({ x: 380 + (Math.random()*240 - 120), y: 2660, text: `+$${inc}`, alpha: 1.0 });
  }
  save.incubators.forEach(slot => {
    if (!slot.ready && slot.timeLeft > 0) {
      slot.timeLeft--;
      if (slot.timeLeft <= 0) {
        slot.timeLeft = 0;
        slot.ready = true;
        showToast("✨ 有太空蛋孵好啦！返基地行近孵化器親手破殼啦！");
      }
    }
  });
  saveData();
}, 1000);

const player = {
  x: 380, y: 2600, r: 18,
  baseSpeed: 3.4,
  carriedEggs: [],
  jetpackTimer: 0,
  jetpackCd: 0,
  wormholeCd: 0,
  stunTimer: 0,
  isMoving: false
};

let activeDecoy = null;
let gamePaused = true; // 預設喺 Dashboard 先暫停，入 Game 自動開始
let currentModalQ = null;
let targetNest = null;
let seqUserPicked = [];

/* ============================================================================
   🎨 精緻繪圖引擎：1. JUSTIN 角色 + 2. 基地立體神獸 + 3. 裝甲外星怪獸
============================================================================ */
function drawJustinAvatar(ctx, x, y, carriedEggs, isJetpack) {
  ctx.save();
  ctx.translate(x, y);

  const t = Date.now() / 160;
  const wingFlap = Math.sin(t) * 5;
  const legSwing = player.isMoving ? Math.sin(t * 2) * 4 : 0;

  // 噴射火焰特效
  if (isJetpack) {
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.moveTo(-6, 12); ctx.lineTo(0, 28 + Math.random()*8); ctx.lineTo(6, 12);
    ctx.fill();
  }

  // 1. 背部：立體雙層「藍水花／數碼冰翼」
  ctx.save();
  ctx.fillStyle = 'rgba(37, 99, 235, 0.85)';
  ctx.strokeStyle = '#73eff7';
  ctx.lineWidth = 2;
  // 左翼
  ctx.beginPath();
  ctx.moveTo(-8, -2);
  ctx.quadraticCurveTo(-38, -26 + wingFlap, -46, -6 + wingFlap);
  ctx.quadraticCurveTo(-32, 10, -8, 6);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  // 右翼
  ctx.beginPath();
  ctx.moveTo(8, -2);
  ctx.quadraticCurveTo(38, -26 + wingFlap, 46, -6 + wingFlap);
  ctx.quadraticCurveTo(32, 10, 8, 6);
  ctx.closePath(); ctx.fill(); ctx.stroke();

  // 冰翼羽毛紋理與水花粒子
  ctx.fillStyle = '#bae6fd';
  ctx.fillRect(-48, -15 + wingFlap, 5, 5);
  ctx.fillRect(43, -15 + wingFlap, 5, 5);
  ctx.fillRect(-35, 6 + wingFlap, 4, 4);
  ctx.fillRect(31, 6 + wingFlap, 4, 4);
  ctx.restore();

  // 2. 雙腳 (黑色 Roblox 積木褲 + 行路擺動)
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(-9, 8 + legSwing, 8, 11);
  ctx.fillRect(1, 8 - legSwing, 8, 11);
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1;
  ctx.strokeRect(-9, 8 + legSwing, 8, 11);
  ctx.strokeRect(1, 8 - legSwing, 8, 11);

  // 3. 身體軀幹 (黑色「有感筆電 DAPTOPER」T-shirt)
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(-10, -6, 20, 15);
  ctx.strokeStyle = '#475569';
  ctx.strokeRect(-10, -6, 20, 15);
  // 胸前有感筆電公仔圖案
  ctx.fillStyle = '#facc15';
  ctx.fillRect(-5, -3, 10, 7);
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(-6, 5, 12, 2.5);

  // 4. 雙臂 (鮮藍色 Roblox 積木手臂)
  ctx.fillStyle = '#2563eb';
  ctx.fillRect(-16, -5 - legSwing*0.5, 6, 13);
  ctx.fillRect(10, -5 + legSwing*0.5, 6, 13);

  // 5. 頭部 (經典黃色 Roblox 方塊頭 + 酷炫黑超)
  ctx.fillStyle = '#facc15';
  ctx.fillRect(-8, -18, 16, 12);
  ctx.fillStyle = '#090a0f';
  ctx.fillRect(-7, -14, 6, 4);
  ctx.fillRect(1, -14, 6, 4);
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(-6, -13, 2, 1.5);
  ctx.fillRect(2, -13, 2, 1.5);

  // 6. 頭頂：藍黑色牛仔禮帽
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(-13, -19, 26, 3.5);
  ctx.fillStyle = '#1d4ed8';
  ctx.fillRect(-8, -26, 16, 7);
  ctx.fillStyle = '#73eff7';
  ctx.fillRect(-8, -20, 16, 1.5);

  // 7. 身旁環繞 3 塊「藍色發光全息科技屏幕」
  for (let i = 0; i < 3; i++) {
    const ang = (Date.now() / 550) + (i * Math.PI * 2 / 3);
    const sx = Math.cos(ang) * 27;
    const sy = Math.sin(ang) * 14 + 2;
    ctx.fillStyle = 'rgba(56, 189, 248, 0.85)';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.2;
    ctx.fillRect(sx - 6, sy - 4, 12, 8);
    ctx.strokeRect(sx - 6, sy - 4, 12, 8);
  }

  // 8. 名字標籤：JUSTIN
  ctx.font = 'bold 12px sans-serif';
  ctx.fillStyle = '#73eff7';
  ctx.textAlign = 'center';
  ctx.fillText(player.stunTimer > 0 ? '💫 暈眩中...' : 'JUSTIN', 0, 31);

  // 9. 頭頂疊高抱蛋 (最多 2 隻)
  if (carriedEggs && carriedEggs.length > 0) {
    carriedEggs.forEach((tier, idx) => {
      const rObj = RARITY_TIERS.find(r => r.tier === tier);
      const ey = -39 - idx * 24;
      ctx.beginPath();
      ctx.ellipse(0, ey, 11, 13, 0, 0, Math.PI * 2);
      ctx.fillStyle = rObj ? rObj.color : '#fff';
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#fff';
      ctx.stroke();
      // 蛋上星紋
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.arc(-3, ey - 3, 2, 0, Math.PI*2); ctx.fill();
    });
  }

  ctx.restore();
}

// 繪製精緻立體怪獸公仔 (取代單調圓形 Emoji)
function drawCustomMonster(ctx, n) {
  const m = n.monster;
  const r = n.mRadius;
  const bounce = Math.sin(Date.now() / 150 + n.id) * 3;

  ctx.save();
  ctx.translate(m.x, m.y + bounce);

  // 警戒光環
  ctx.beginPath();
  ctx.arc(0, 0, r + 5, 0, Math.PI * 2);
  ctx.fillStyle = m.state === 'chasing' ? 'rgba(239, 68, 68, 0.35)' : 'rgba(255, 255, 255, 0.08)';
  ctx.fill();

  // 怪獸裝甲/雙角裝飾
  ctx.fillStyle = m.state === 'chasing' ? '#dc2626' : n.mColor;
  ctx.strokeStyle = m.stunTimer > 0 ? '#73eff7' : '#ffffff';
  ctx.lineWidth = 2.5;

  // 左右惡魔角 / 機械耳
  ctx.beginPath();
  ctx.moveTo(-r*0.7, -r*0.5); ctx.lineTo(-r*1.1, -r*1.2); ctx.lineTo(-r*0.2, -r*0.8);
  ctx.moveTo(r*0.7, -r*0.5);  ctx.lineTo(r*1.1, -r*1.2);  ctx.lineTo(r*0.2, -r*0.8);
  ctx.fill(); ctx.stroke();

  // 怪獸立體方圓身軀
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fill(); ctx.stroke();

  // 發光眼神與獠牙
  ctx.fillStyle = m.state === 'chasing' ? '#fde047' : '#ffffff';
  if (n.mType === 'cyclops') {
    ctx.beginPath(); ctx.arc(0, -3, r*0.38, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#ef4444';
    ctx.beginPath(); ctx.arc(0, -3, r*0.18, 0, Math.PI*2); ctx.fill();
  } else {
    ctx.fillRect(-r*0.45, -6, r*0.32, 5);
    ctx.fillRect(r*0.15, -6, r*0.32, 5);
    // 獠牙
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.moveTo(-6, 5); ctx.lineTo(-3, 10); ctx.lineTo(0, 5);
    ctx.moveTo(0, 5);  ctx.lineTo(3, 10);  ctx.lineTo(6, 5);
    ctx.fill();
  }

  // 狀態文字
  ctx.font = 'bold 11px sans-serif';
  ctx.textAlign = 'center';
  if (m.stunTimer > 0) {
    ctx.fillStyle = '#73eff7';
    ctx.fillText(`❄️ 冰封 ${(m.stunTimer/60).toFixed(1)}s`, 0, -r - 12);
  } else if (m.state === 'chasing') {
    ctx.fillStyle = '#fca5a5';
    ctx.fillText(`💢 ${n.monsterName} 追擊!`, 0, -r - 12);
  } else {
    ctx.fillStyle = '#cbd5e1';
    ctx.fillText(n.monsterName, 0, -r - 12);
  }

  ctx.restore();
}

// 繪製基地展示台上面嘅精緻立體 Roblox 寵物公仔
function drawBasePetSprite(ctx, px, py, info, idx) {
  const floatY = Math.sin(Date.now() / 200 + idx) * 3;
  ctx.save();
  ctx.translate(px, py + floatY);

  // 黃金神獸閃光光環
  if (info.isGold) {
    ctx.beginPath();
    ctx.arc(0, -2, 20, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(250, 204, 21, 0.28)';
    ctx.fill();
  }

  // 寵物小翅膀 / 耳仔
  ctx.fillStyle = info.isGold ? '#facc15' : info.bodyColor;
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1.5;
  ctx.fillRect(-13, -12, 26, 20);
  ctx.strokeRect(-13, -12, 26, 20);

  // 頭頂小角
  ctx.fillRect(-10, -17, 6, 5);
  ctx.fillRect(4, -17, 6, 5);

  // 閃亮眼睛
  ctx.fillStyle = info.eyeColor || '#fff';
  ctx.fillRect(-8, -6, 5, 5);
  ctx.fillRect(3, -6, 5, 5);

  ctx.restore();
}

/* ============================================================================
   📚 連接 Dashboard 課題篩選器：只抽勾選咗嘅課題題目！
============================================================================ */
function getFilteredQuestionPool() {
  const selected = (typeof window.getSelectedUnits === 'function')
    ? window.getSelectedUnits()
    : { sci: ['u1','u2','u3','u4'], hum: ['u1','u2','u3','u4'] };

  const sciPool = (window.SCIENCE_QUESTIONS || []).filter(q => !q.unit || selected.sci.includes(q.unit));
  const humPool = (window.HUMANITIES_QUESTIONS || []).filter(q => !q.unit || selected.hum.includes(q.unit));

  const combined = [...sciPool, ...humPool];
  // 萬一玩家喺 Dashboard 取消晒所有勾選，自動 fallback 用返全部科學題防止卡死
  return combined.length > 0 ? combined : (window.SCIENCE_QUESTIONS || []);
}

function speakCurrentModalQ() {
  if (!currentModalQ) return;
  const cleanQ = currentModalQ.q.replace('【 ？ 】', '邊個選項');
  if (typeof speakCantonese === 'function') speakCantonese(cleanQ);
}

function triggerQuizModal(mode, nestObj) {
  gamePaused = true;
  keys['w'] = keys['a'] = keys['s'] = keys['d'] = false;
  joyVec = { x: 0, y: 0 };
  targetNest = nestObj || null;

  const pool = getFilteredQuestionPool();

  // 錯題優先重考機制 (45% 機率重考之前答錯嘅題目)
  let rawQ = null;
  if (save.wrongQuestions.length > 0 && Math.random() < 0.45) {
    rawQ = pool.find(item => item.q === save.wrongQuestions[0]);
  }
  if (!rawQ) {
    rawQ = pool[Math.floor(Math.random() * pool.length)];
  }
  currentModalQ = JSON.parse(JSON.stringify(rawQ));

  const modal = document.getElementById('quiz-modal');
  const titleEl = document.getElementById('quiz-title');
  const catEl = document.getElementById('quiz-cat');
  const qEl = document.getElementById('quiz-q');
  const optsEl = document.getElementById('quiz-opts');
  const seqSlotsEl = document.getElementById('quiz-seq-slots');
  const expEl = document.getElementById('quiz-explain');

  expEl.style.display = 'none';
  seqSlotsEl.style.display = 'none';
  optsEl.innerHTML = '';
  optsEl.className = 'opt-grid';

  const isRetry = save.wrongQuestions.includes(currentModalQ.q);

  if (mode === 'boss') {
    titleEl.innerHTML = `🛸 基地激光炮充能！(答啱轟擊外星母艦 Boss HP:${bossRaid.hp}/${bossRaid.maxHp})`;
  } else if (mode === 'steal' && nestObj) {
    const rObj = RARITY_TIERS.find(r => r.tier === nestObj.eggTier);
    const isSecond = player.carriedEggs.length === 1;
    titleEl.innerHTML = isSecond
      ? `🔥 雙蛋疊高連偷第 2 隻：【<span style="color:${rObj.color}">${rObj.name}</span>】`
      : `🥚 搶奪【<span style="color:${rObj.color}">${rObj.name}</span>】`;
  } else {
    titleEl.innerHTML = `🚨 怪獸攔截！答啱震退怪獸！`;
  }

  catEl.textContent = isRetry ? `🔄 錯題重溫 (${currentModalQ.cat})` : currentModalQ.cat;
  qEl.innerHTML = currentModalQ.q.replace('【 ？ 】', '<span class="blank-hl">【 ？ 】</span>');

  if (currentModalQ.type === 'tf') {
    ['⭕ 正確', '❌ 錯誤'].forEach((label, idx) => {
      const btn = document.createElement('button');
      btn.className = 'opt-btn'; btn.textContent = label;
      btn.onclick = () => checkSimpleAnswer((idx === 0) === currentModalQ.ans, btn, mode);
      optsEl.appendChild(btn);
    });
  } else if (currentModalQ.type === 'cat2') {
    [0, 1].sort(() => Math.random() - 0.5).forEach(i => {
      const btn = document.createElement('button');
      btn.className = 'opt-btn'; btn.textContent = currentModalQ.opts[i];
      btn.onclick = () => checkSimpleAnswer(i === currentModalQ.ans, btn, mode);
      optsEl.appendChild(btn);
    });
  } else if (currentModalQ.type === 'fill') {
    optsEl.className = 'opt-grid single-col';
    [0, 1, 2].sort(() => Math.random() - 0.5).forEach(i => {
      const btn = document.createElement('button');
      btn.className = 'opt-btn'; btn.textContent = currentModalQ.opts[i];
      btn.onclick = () => checkSimpleAnswer(i === currentModalQ.ans, btn, mode);
      optsEl.appendChild(btn);
    });
  } else if (currentModalQ.type === 'seq') {
    seqUserPicked = [];
    seqSlotsEl.style.display = 'flex';
    seqSlotsEl.innerHTML = `<div class="seq-slot" id="slot-0">第 1 步</div><div class="seq-slot" id="slot-1">第 2 步</div><div class="seq-slot" id="slot-2">第 3 步</div>`;
    optsEl.className = 'opt-grid single-col';
    [0, 1, 2].sort(() => Math.random() - 0.5).forEach(i => {
      const btn = document.createElement('button');
      btn.className = 'opt-btn';
      const cleanTxt = currentModalQ.steps[i].replace(/^[123]\.\s*/, '');
      btn.textContent = cleanTxt;
      btn.onclick = () => {
        btn.disabled = true; btn.style.opacity = '0.4';
        document.getElementById(`slot-${seqUserPicked.length}`).textContent = cleanTxt;
        seqUserPicked.push(i);
        if (seqUserPicked.length === 3) {
          checkSimpleAnswer(seqUserPicked[0]===0 && seqUserPicked[1]===1 && seqUserPicked[2]===2, btn, mode);
        }
      };
      optsEl.appendChild(btn);
    });
  }

  modal.classList.add('show');
}

function checkSimpleAnswer(isCorrect, btnEl, mode) {
  document.querySelectorAll('#quiz-opts .opt-btn').forEach(b => b.disabled = true);
  const expEl = document.getElementById('quiz-explain');
  expEl.style.display = 'block';

  if (isCorrect) {
    btnEl.classList.add('correct');
    save.wrongQuestions = save.wrongQuestions.filter(q => q !== currentModalQ.q);
    saveData();

    expEl.style.borderColor = '#38b764';
    expEl.style.color = '#a7f070';
    expEl.innerHTML = `✅ <b>答啱啦！</b> ${currentModalQ.exp}<br><br><button class="btn-ui" id="btn-go">即刻行動！🚀</button>`;
    document.getElementById('btn-go').onclick = () => {
      document.getElementById('quiz-modal').classList.remove('show');
      gamePaused = false;

      if (mode === 'boss') {
        bossRaid.hp--;
        if (bossRaid.hp <= 0) {
          bossRaid.active = false;
          bossRaid.timer = 2400;
          save.coins += 120;
          save.eggStorage.push(4); // 擊退 Boss 直接送傳說金陽蛋入倉庫！
          saveData();
          showToast("🎉 成功擊退外星母艦 Boss！獎勵 +$120 及【傳說金陽蛋】已存入倉庫！");
        } else {
          showToast(`💥 激光炮命中 Boss！仲差 ${bossRaid.hp} 炮就擊敗佢！`);
        }
      } else if (mode === 'steal') {
        player.carriedEggs.push(targetNest.eggTier);
        targetNest.hasEgg = false;
        targetNest.respawnTimer = 500;
        targetNest.monster.state = 'chasing';
        targetNest.monster.stunTimer = 45;
        showToast(player.carriedEggs.length === 2
          ? "🔥 雙蛋疊高連偷成功！返到基地可獲 2.5 倍獎金！快跑！"
          : "🚨 成功偷到第 1 隻蛋！可直接跑返基地，或去隔離巢穴偷埋第 2 隻！");
      } else {
        nests.forEach(n => { if (n.monster.state === 'chasing') n.monster.stunTimer = 180; });
        player.jetpackTimer = 80;
        showToast("💥 成功震飛怪獸！快啲跑返基地！");
      }
    };
  } else {
    btnEl.classList.add('wrong');
    if (!save.wrongQuestions.includes(currentModalQ.q)) {
      save.wrongQuestions.push(currentModalQ.q);
      saveData();
    }
    expEl.style.borderColor = '#ef7d57';
    expEl.style.color = '#ffcd75';
    expEl.innerHTML = `💡 <b>記住重點：</b> ${currentModalQ.exp}<br><br><button class="btn-ui" onclick="closeWrong('${mode}')">我記住啦！繼續 ➡️</button>`;
  }
}

function closeWrong(mode) {
  document.getElementById('quiz-modal').classList.remove('show');
  gamePaused = false;
  if (mode === 'steal' || mode === 'boss') {
    player.y += 45;
    showToast("準備好再行埋去挑戰啦！");
  } else {
    resetToBase("🦖 怪獸搶返隻蛋啦！返基地升級裝備再戰！");
  }
}

function deliverEggsToBase() {
  const count = player.carriedEggs.length;
  let bonus = 0;

  player.carriedEggs.forEach(tier => {
    const rObj = RARITY_TIERS.find(r => r.tier === tier);
    bonus += tier * 15;
    if (save.incubators.length < save.maxIncubators) {
      save.incubators.push({ tier, name: rObj.name, color: rObj.color, timeLeft: rObj.hatchSec, ready: false });
    } else {
      save.eggStorage.push(tier);
    }
  });

  if (count >= 2) bonus = Math.round(bonus * 2.5);
  save.coins += bonus;
  player.carriedEggs = [];

  nests.forEach(n => { if (n.monster.state === 'chasing') n.monster.state = 'returning'; });
  saveData();
  showToast(count >= 2
    ? `🔥 雙蛋連偷歸巢大成功！獲得 2.5倍獎金 +$${bonus}！`
    : `🥚 成功將太空蛋送返基地 (+$${bonus})！`);
}

/* ============================================================================
   操作與四大主動技能
============================================================================ */
const keys = {};
window.addEventListener('keydown', e => keys[e.key.toLowerCase()] = true);
window.addEventListener('keyup', e => keys[e.key.toLowerCase()] = false);

let joyVec = { x: 0, y: 0 }, joyActive = false;
const joyZone = document.getElementById('joystick-zone'), joyKnob = document.getElementById('joystick-knob');
function handleJoy(cx, cy) {
  const rect = joyZone.getBoundingClientRect();
  let dx = cx - (rect.left + rect.width/2), dy = cy - (rect.top + rect.height/2);
  const d = Math.hypot(dx, dy);
  if (d > 40) { dx = dx/d*40; dy = dy/d*40; }
  joyKnob.style.transform = `translate(${dx}px, ${dy}px)`;
  joyVec.x = dx/40; joyVec.y = dy/40;
}
if (joyZone) {
  joyZone.addEventListener('pointerdown', e => { joyActive = true; handleJoy(e.clientX, e.clientY); });
  window.addEventListener('pointermove', e => { if (joyActive) handleJoy(e.clientX, e.clientY); });
  window.addEventListener('pointerup', () => { joyActive = false; joyKnob.style.transform = `translate(0,0)`; joyVec = {x:0,y:0}; });
}

function useJetpack() {
  if (player.jetpackCd > 0) return;
  player.jetpackTimer = 100;
  player.jetpackCd = 240;
  showToast("🚀 藍水花噴射翼全開！");
}

function useFreezeBomb() {
  if (save.freezeCount <= 0) return showToast("❄️ 無冰封彈啦！去基地總管買啦！");
  const chasers = nests.filter(n => n.monster.state === 'chasing');
  if (chasers.length === 0) return showToast("❄️ 而家無怪獸追緊你！");
  save.freezeCount--;
  chasers.forEach(n => n.monster.stunTimer = 270);
  saveData();
  showToast("❄️ 時間冰封彈發動！怪獸結冰 4.5 秒！");
}

function useDecoy() {
  if (save.decoyCount <= 0) return showToast("🤖 無全息誘餌公仔啦！去基地總管買啦！");
  save.decoyCount--;
  activeDecoy = { x: player.x, y: player.y - 30, timer: 300 };
  saveData();
  showToast("🤖 已放出 JUSTIN 全息誘餌公仔！怪獸俾假公仔吸引住 5 秒！");
}

function useTeleport() {
  if (save.teleCount <= 0) return showToast("🛸 無瞬間回城器啦！去基地總管買啦！");
  save.teleCount--;
  player.x = 380;
  player.y = 2500;
  saveData();
  showToast("🛸 瞬間轉移成功！已連人帶蛋飛返太空基地！");
}

/* ============================================================================
   主循環 Update & 完整太空地圖渲染
============================================================================ */
function update() {
  if (gamePaused) return;
  if (player.jetpackTimer > 0) player.jetpackTimer--;
  if (player.jetpackCd > 0) player.jetpackCd--;
  if (player.wormholeCd > 0) player.wormholeCd--;
  if (player.stunTimer > 0) player.stunTimer--;
  if (activeDecoy && --activeDecoy.timer <= 0) activeDecoy = null;

  const cdEl = document.getElementById('ui-jetpack-cd');
  if (cdEl) cdEl.textContent = player.jetpackCd > 0 ? `${Math.ceil(player.jetpackCd/60)}s` : '就緒';

  // 玩法 B：隨機外星火隕石跌落 (Meteor Dodge)
  if (Math.random() < 0.012 && fallingMeteors.length < 3 && player.y < 2350) {
    fallingMeteors.push({
      x: 120 + Math.random() * 520,
      y: Math.max(200, player.y - 250 + (Math.random()*300 - 150)),
      r: 38,
      countdown: 90 // 1.5秒預警圈後爆開
    });
  }
  fallingMeteors.forEach(fm => {
    fm.countdown--;
    if (fm.countdown === 0 && Math.hypot(player.x - fm.x, player.y - fm.y) < fm.r + player.r) {
      player.stunTimer = 60; // 被隕石震暈 1 秒
      showToast("☄️ 哎呀！被外星隕石震暈咗 1 秒！小心睇地上面嘅紅圈閃避！");
    }
  });
  fallingMeteors = fallingMeteors.filter(fm => fm.countdown > -15);

  // 玩法 C：基地外星母艦 Boss 突襲事件
  if (!bossRaid.active) {
    bossRaid.timer--;
    if (bossRaid.timer <= 0) {
      bossRaid.active = true;
      bossRaid.hp = 2;
      bossRaid.maxHp = 2;
      showToast("🚨 警報！【外星母艦 Boss】突襲基地門口！行去基地門口啟動激光炮擊退佢贏傳說金蛋！");
    }
  } else if (Math.hypot(player.x - bossRaid.x, player.y - bossRaid.y) < 52) {
    triggerQuizModal('boss', null);
    return;
  }

  let spd = player.baseSpeed + (save.speedLv - 1) * 0.32;
  if (player.carriedEggs.length > 0) {
    const totalW = player.carriedEggs.reduce((s, t) => s + (RARITY_TIERS.find(r=>r.tier===t)?.weight || 0.08), 0);
    spd *= (1 - Math.max(0.03, totalW - (save.carryLv - 1) * 0.04));
  }
  if (player.jetpackTimer > 0) spd *= 1.55;
  if (player.stunTimer > 0) spd *= 0.25;

  // 檢查黑洞漩渦吸力
  for (const bh of BLACK_HOLES) {
    const d = Math.hypot(player.x - bh.x, player.y - bh.y);
    if (d < bh.r + 35) {
      spd *= 0.62;
      player.x += (bh.x - player.x) * 0.03;
      player.y += (bh.y - player.y) * 0.03;
    }
    nests.forEach(n => {
      if (Math.hypot(n.monster.x - bh.x, n.monster.y - bh.y) < bh.r + 25) {
        n.monster.stunTimer = Math.max(n.monster.stunTimer, 25);
      }
    });
  }

  let dx = joyVec.x, dy = joyVec.y;
  if (keys['w'] || keys['arrowup']) dy -= 1;
  if (keys['s'] || keys['arrowdown']) dy += 1;
  if (keys['a'] || keys['arrowleft']) dx -= 1;
  if (keys['d'] || keys['arrowright']) dx += 1;

  player.isMoving = (dx !== 0 || dy !== 0);
  if (player.isMoving) {
    const len = Math.hypot(dx, dy);
    player.x += (dx / len) * spd;
    player.y += (dy / len) * spd;
  }

  player.x = Math.max(68, Math.min(WORLD_W - 68, player.x));
  player.y = Math.max(50, Math.min(WORLD_H - 35, player.y));

  // 檢查雙向傳送蟲洞
  if (player.wormholeCd <= 0) {
    for (const wh of WORMHOLES) {
      if (Math.hypot(player.x - wh.leftX, player.y - wh.y) < 26) {
        player.x = wh.rightX - 35; player.wormholeCd = 90;
        showToast("🔮 穿越蟲洞！成功甩開怪獸！");
      } else if (Math.hypot(player.x - wh.rightX, player.y - wh.y) < 26) {
        player.x = wh.leftX + 35; player.wormholeCd = 90;
        showToast("🔮 穿越蟲洞！成功甩開怪獸！");
      }
    }
  }

  // 檢查流星補給箱
  if (meteorSupply.active) {
    if (Math.hypot(player.x - meteorSupply.x, player.y - meteorSupply.y) < 34) {
      meteorSupply.active = false;
      meteorSupply.timer = 900;
      player.jetpackTimer = 150;
      save.coins += 30;
      saveData();
      showToast("🎁 拾獲太空流星補給箱！+$30 及 2.5秒噴射加速！");
    }
  } else if (--meteorSupply.timer <= 0) {
    meteorSupply.active = true;
    meteorSupply.x = 180 + Math.random() * 400;
    meteorSupply.y = 400 + Math.random() * 1700;
  }

  // 檢查偷蛋
  for (const n of nests) {
    if (!n.hasEgg) {
      if (--n.respawnTimer <= 0) { n.hasEgg = true; n.eggTier = rollRandomEggTier(n.minTier); }
    } else if (player.carriedEggs.length < 2 && Math.hypot(player.x - n.x, player.y - n.y) < 42) {
      triggerQuizModal('steal', n);
      return;
    }
  }

  // 抱蛋返抵基地
  if (player.carriedEggs.length > 0 && player.y > 2460) {
    deliverEggsToBase();
    return;
  }

  // 在基地行近孵化器自動破殼已孵好嘅蛋
  if (player.y > 2500 && player.y < 2610 && Math.abs(player.x - 380) < 220) {
    const readyIdx = save.incubators.findIndex(s => s.ready);
    if (readyIdx !== -1) hatchReadyEgg(readyIdx);
  }

  // 怪獸追擊 AI
  for (const n of nests) {
    const m = n.monster;
    if (m.stunTimer > 0) { m.stunTimer--; continue; }

    if (m.state === 'chasing') {
      const tx = activeDecoy ? activeDecoy.x : player.x;
      const ty = activeDecoy ? activeDecoy.y : player.y;
      const ang = Math.atan2(ty - m.y, tx - m.x);
      m.x += Math.cos(ang) * n.mSpeed;
      m.y += Math.sin(ang) * n.mSpeed;

      if (!activeDecoy && Math.hypot(player.x - m.x, player.y - m.y) < player.r + n.mRadius - 4) {
        if (save.shieldCount > 0) {
          save.shieldCount--; m.stunTimer = 150; saveData();
          showToast(`🛡️ 數碼屏幕護盾擋住咗【${n.monsterName}】！`);
        } else {
          triggerQuizModal('escape', n);
          return;
        }
      }
    } else if (m.state === 'returning') {
      const d = Math.hypot(m.homeX - m.x, m.homeY - m.y);
      if (d < 6) { m.x = m.homeX; m.y = m.homeY; m.state = 'idle'; }
      else {
        const ang = Math.atan2(m.homeY - m.y, m.homeX - m.x);
        m.x += Math.cos(ang) * 3.8; m.y += Math.sin(ang) * 3.8;
      }
    }
  }

  floatingCoins.forEach(fc => { fc.y -= 1.0; fc.alpha -= 0.02; });
  floatingCoins = floatingCoins.filter(fc => fc.alpha > 0);

  cameraY += ((player.y - canvas.height * 0.52) - cameraY) * 0.16;
  cameraY = Math.max(0, Math.min(WORLD_H - canvas.height, cameraY));
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  ctx.translate(0, -cameraY);

  // 1. 畫外太空星雲、裝飾星球與跑道背景
  const isChased = nests.some(n => n.monster.state === 'chasing');
  ctx.fillStyle = (isChased && Math.floor(Date.now() / 300) % 2 === 0) ? '#230b1a' : '#080b1a';
  ctx.fillRect(0, 0, WORLD_W, WORLD_H);

  const planets = [
    { x: 120, y: 2300, r: 45, c: 'rgba(59, 93, 201, 0.18)' },
    { x: 640, y: 1750, r: 65, c: 'rgba(168, 85, 247, 0.15)' },
    { x: 130, y: 1200, r: 55, c: 'rgba(236, 72, 153, 0.15)' },
    { x: 620, y: 600,  r: 70, c: 'rgba(249, 115, 22, 0.15)' },
    { x: 380, y: 160,  r: 95, c: 'rgba(239, 68, 68, 0.2)' }
  ];
  planets.forEach(p => {
    ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
    ctx.fillStyle = p.c; ctx.fill();
  });

  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  for (let i = 0; i < 65; i++) {
    const sx = (i * 137) % WORLD_W;
    const sy = (i * 293) % WORLD_H;
    ctx.fillRect(sx, sy, (i%3)+1, (i%3)+1);
  }

  // 中央太空霓虹光橋
  ctx.fillStyle = 'rgba(30, 58, 138, 0.25)';
  ctx.fillRect(260, 140, 240, 2320);
  ctx.strokeStyle = 'rgba(65, 166, 246, 0.35)';
  ctx.lineWidth = 2;
  ctx.strokeRect(260, 140, 240, 2320);

  ctx.fillStyle = '#04060e';
  ctx.fillRect(0, 0, 52, WORLD_H);
  ctx.fillRect(WORLD_W - 52, 0, 52, WORLD_H);

  ctx.font = 'bold 13px sans-serif';
  ctx.fillStyle = 'rgba(115, 239, 247, 0.4)';
  for (let y = 300; y < 2400; y += 300) {
    ctx.fillText(`🚀 太空深度 ${Math.round((2460 - y)/10)}m`, 330, y);
  }

  // 2. 畫黑洞漩渦、雙向傳送蟲洞、流星補給箱、外星隕石轟炸預警圈
  BLACK_HOLES.forEach(bh => {
    ctx.beginPath(); ctx.arc(bh.x, bh.y, bh.r, 0, Math.PI*2);
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)'; ctx.fill();
    ctx.lineWidth = 3; ctx.strokeStyle = '#a855f7'; ctx.stroke();
    ctx.font = 'bold 12px sans-serif'; ctx.fillStyle = '#e9d5ff'; ctx.textAlign = 'center';
    ctx.fillText('🌀 黑洞漩渦 (可吸住怪獸)', bh.x, bh.y + 5);
  });

  WORMHOLES.forEach(wh => {
    [wh.leftX, wh.rightX].forEach(wx => {
      ctx.beginPath(); ctx.arc(wx, wh.y, 22, 0, Math.PI*2);
      ctx.fillStyle = wh.color; ctx.fill();
      ctx.lineWidth = 2; ctx.strokeStyle = '#fff'; ctx.stroke();
      ctx.font = '16px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('🔮', wx, wh.y + 6);
      ctx.font = 'bold 10px sans-serif'; ctx.fillStyle = '#fff';
      ctx.fillText('蟲洞', wx, wh.y - 26);
    });
  });

  if (meteorSupply.active) {
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(meteorSupply.x - 18, meteorSupply.y - 18, 36, 36);
    ctx.strokeStyle = '#fff'; ctx.strokeRect(meteorSupply.x - 18, meteorSupply.y - 18, 36, 36);
    ctx.font = '20px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('🎁', meteorSupply.x, meteorSupply.y + 7);
    ctx.font = 'bold 11px sans-serif'; ctx.fillStyle = '#fde047';
    ctx.fillText('流星補給箱', meteorSupply.x, meteorSupply.y - 24);
  }

  // 畫隕石預警圈與爆炸
  fallingMeteors.forEach(fm => {
    ctx.beginPath();
    ctx.arc(fm.x, fm.y, fm.r, 0, Math.PI * 2);
    ctx.fillStyle = fm.countdown > 0 ? 'rgba(239, 68, 68, 0.25)' : 'rgba(249, 115, 22, 0.75)';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#ef4444';
    ctx.stroke();
    ctx.font = 'bold 12px sans-serif';
    ctx.fillStyle = '#fca5a5';
    ctx.textAlign = 'center';
    ctx.fillText(fm.countdown > 0 ? `☄️ 隕石 ${(fm.countdown/60).toFixed(1)}s` : '💥 轟！', fm.x, fm.y + 5);
  });

  // 畫外星母艦 Boss 突襲事件 (Tower Defense Boss Raid)
  if (bossRaid.active) {
    ctx.save();
    ctx.translate(bossRaid.x, bossRaid.y);
    ctx.fillStyle = '#7f1d1d';
    ctx.beginPath(); ctx.ellipse(0, 0, 58, 28, 0, 0, Math.PI*2); ctx.fill();
    ctx.lineWidth = 3; ctx.strokeStyle = '#fde047'; ctx.stroke();
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath(); ctx.arc(0, -8, 22, 0, Math.PI*2); ctx.fill();
    ctx.font = 'bold 13px sans-serif'; ctx.fillStyle = '#fde047'; ctx.textAlign = 'center';
    ctx.fillText(`🛸 外星母艦突襲 (HP: ${bossRaid.hp}/${bossRaid.maxHp}) — 撞埋嚟開激光炮擊退贏金蛋！`, 0, -38);
    ctx.restore();
  }

  // 3. 畫底部 JUSTIN 太空基地 (Y: 2460 ~ 2800)
  ctx.fillStyle = '#111833';
  ctx.fillRect(52, 2460, WORLD_W - 104, 340);
  ctx.strokeStyle = '#73eff7';
  ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(52, 2460); ctx.lineTo(WORLD_W - 52, 2460); ctx.stroke();

  ctx.fillStyle = '#73eff7';
  ctx.font = 'bold 15px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🛸 JUSTIN 專屬太空基地 (支援雙蛋連偷 2.5x 獎金 + 手動破殼 + 3合1黃金進化)', WORLD_W/2, 2488);

  // 基地左側「📦 蛋倉庫大樓」
  ctx.fillStyle = '#271c3a';
  ctx.fillRect(72, 2515, 115, 70);
  ctx.strokeStyle = '#c084fc';
  ctx.lineWidth = 3;
  ctx.strokeRect(72, 2515, 115, 70);
  ctx.font = '22px sans-serif';
  ctx.fillText('📦', 130, 2545);
  ctx.font = 'bold 12px sans-serif';
  ctx.fillStyle = '#e9d5ff';
  ctx.fillText(`蛋倉庫: ${save.eggStorage.length}隻`, 130, 2572);

  // 基地中央可擴充太空孵化槽
  const totalSlots = save.maxIncubators;
  const startX = 235;
  const gapX = Math.min(92, Math.floor(460 / totalSlots));

  for (let i = 0; i < totalSlots; i++) {
    const ix = startX + i * gapX;
    const iy = 2550;
    const slot = save.incubators[i];

    ctx.fillStyle = slot && slot.ready ? '#422006' : '#1e293b';
    ctx.fillRect(ix - 38, iy - 32, 76, 64);
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = slot ? (slot.ready ? '#facc15' : slot.color) : '#475569';
    ctx.strokeRect(ix - 38, iy - 32, 76, 64);

    if (slot) {
      ctx.beginPath(); ctx.ellipse(ix, iy - 5, 11, 14, 0, 0, Math.PI*2);
      ctx.fillStyle = slot.color; ctx.fill();
      ctx.strokeStyle = '#fff'; ctx.stroke();
      ctx.font = 'bold 10.5px sans-serif';
      if (slot.ready) {
        ctx.fillStyle = '#fde047';
        ctx.fillText('✨可破殼!', ix, iy + 22);
      } else {
        ctx.fillStyle = slot.color;
        ctx.fillText(`${slot.timeLeft}s`, ix, iy + 22);
      }
    } else {
      ctx.font = '11px sans-serif';
      ctx.fillStyle = '#64748b';
      ctx.fillText(`孵化槽#${i+1}`, ix, iy + 5);
    }
  }

  // 基地底部 8 個神獸展示台 (使用精緻立體 Canvas 寵物繪製！)
  for (let i = 0; i < 8; i++) {
    const px = 125 + i * 72;
    const py = 2710;
    const petKey = save.basePets[i];
    const info = petKey ? getPetInfo(petKey) : null;

    ctx.fillStyle = info && info.isGold ? '#422006' : '#1e293b';
    ctx.fillRect(px - 26, py - 26, 52, 52);
    ctx.strokeStyle = info && info.isGold ? '#facc15' : '#3b5dc9';
    ctx.lineWidth = 2;
    ctx.strokeRect(px - 26, py - 26, 52, 52);

    if (info) {
      drawBasePetSprite(ctx, px, py, info, i);
      ctx.font = 'bold 11px sans-serif';
      ctx.fillStyle = info.isGold ? '#fde047' : '#a7f070';
      ctx.fillText(`+$${info.income}/s`, px, py + 40);
    }
  }
  ctx.textAlign = 'left';

  floatingCoins.forEach(fc => {
    ctx.save();
    ctx.globalAlpha = Math.max(0, fc.alpha);
    ctx.font = 'bold 17px sans-serif';
    ctx.fillStyle = '#a7f070';
    ctx.fillText(fc.text, fc.x, fc.y);
    ctx.restore();
  });

  // 4. 畫 8 個太空巢穴 & 8 種精緻外星怪獸
  for (const n of nests) {
    const rObj = RARITY_TIERS.find(r => r.tier === n.eggTier);

    ctx.beginPath();
    ctx.arc(n.x, n.y, 32, 0, Math.PI * 2);
    ctx.fillStyle = '#1e293b';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = n.hasEgg ? rObj.color : '#475569';
    ctx.stroke();

    ctx.textAlign = 'center';
    if (n.hasEgg) {
      ctx.beginPath(); ctx.ellipse(n.x, n.y, 13, 16, 0, 0, Math.PI*2);
      ctx.fillStyle = rObj.color; ctx.fill();
      ctx.lineWidth = 2; ctx.strokeStyle = '#fff'; ctx.stroke();
      ctx.font = 'bold 12px sans-serif';
      ctx.fillStyle = rObj.color;
      ctx.fillText(`★ ${rObj.name} ($${rObj.income}/s)`, n.x, n.y - 40);
    } else {
      ctx.font = '12px sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(`重生中 ${Math.ceil(n.respawnTimer/60)}s`, n.x, n.y + 5);
    }

    drawCustomMonster(ctx, n);
    ctx.textAlign = 'left';
  }

  // 5. 畫全息誘餌公仔
  if (activeDecoy) {
    ctx.save();
    ctx.globalAlpha = 0.75;
    drawJustinAvatar(ctx, activeDecoy.x, activeDecoy.y, [], false);
    ctx.font = 'bold 12px sans-serif';
    ctx.fillStyle = '#fde047';
    ctx.textAlign = 'center';
    ctx.fillText(`🤖 誘餌吸引中 (${(activeDecoy.timer/60).toFixed(1)}s)`, activeDecoy.x, activeDecoy.y - 35);
    ctx.restore();
  }

  // 6. 畫主角 JUSTIN
  drawJustinAvatar(ctx, player.x, player.y, player.carriedEggs, player.jetpackTimer > 0);

  ctx.restore();

  // 7. 畫右上角太空實時雷達小地圖
  drawMinimap();

  requestAnimationFrame(() => { update(); draw(); });
}

function drawMinimap() {
  const mw = 28, mh = 185;
  const mx = canvas.width - mw - 12;
  const my = 14;

  ctx.fillStyle = 'rgba(5, 6, 12, 0.88)';
  ctx.fillRect(mx, my, mw, mh);
  ctx.strokeStyle = '#3b5dc9';
  ctx.lineWidth = 2;
  ctx.strokeRect(mx, my, mw, mh);

  ctx.fillStyle = '#38b764';
  ctx.fillRect(mx + 3, my + mh - 18, mw - 6, 15);

  nests.forEach(n => {
    const ny = my + (n.y / WORLD_H) * mh;
    const rObj = RARITY_TIERS.find(r => r.tier === n.eggTier);
    ctx.fillStyle = n.hasEgg ? rObj.color : '#334155';
    ctx.fillRect(mx + 5, ny - 2, mw - 10, 5);
  });

  const py = my + (player.y / WORLD_H) * mh;
  ctx.beginPath();
  ctx.arc(mx + mw/2, py, 5, 0, Math.PI * 2);
  ctx.fillStyle = player.carriedEggs.length > 0 ? '#fde047' : '#73eff7';
  ctx.fill();
  ctx.strokeStyle = '#fff';
  ctx.stroke();
}

/* ============================================================================
   UI、手動破殼、未孵化蛋倉庫與商店管理
============================================================================ */
function updateUI() {
  const cEl = document.getElementById('ui-coins');
  const iEl = document.getElementById('ui-income');
  const sEl = document.getElementById('ui-storage');
  const fEl = document.getElementById('ui-freeze-count');
  const dEl = document.getElementById('ui-decoy-count');
  const tEl = document.getElementById('ui-tele-count');

  if (cEl) cEl.textContent = save.coins;
  if (iEl) iEl.textContent = getTotalIncomePerSec();
  if (sEl) sEl.textContent = save.eggStorage.length;
  if (fEl) fEl.textContent = `x${save.freezeCount}`;
  if (dEl) dEl.textContent = `x${save.decoyCount}`;
  if (tEl) tEl.textContent = `x${save.teleCount}`;

  const pillInc = document.getElementById('pill-incubator');
  const txtInc = document.getElementById('ui-incubator');
  if (pillInc && txtInc) {
    const readyCount = save.incubators.filter(s => s.ready).length;
    if (readyCount > 0) {
      pillInc.className = 'stat-pill btn-hatch-ready';
      txtInc.textContent = `✨ ${readyCount}隻可破殼!`;
    } else {
      pillInc.className = 'stat-pill';
      txtInc.textContent = `${save.incubators.length}/${save.maxIncubators}`;
    }
  }
}

function hatchReadyEgg(slotIndex) {
  const slot = save.incubators[slotIndex];
  if (!slot || !slot.ready) return;
  const candidates = PET_DEX.filter(p => p.tier === slot.tier);
  const hatched = candidates[Math.floor(Math.random() * candidates.length)];
  if (!save.unlockedIds.includes(hatched.id)) save.unlockedIds.push(hatched.id);

  if (save.basePets.length < 8) {
    save.basePets.push(hatched.id);
  } else {
    let minIdx = 0, minInc = 99999;
    save.basePets.forEach((k, idx) => {
      const info = getPetInfo(k);
      if (info && info.income < minInc) { minInc = info.income; minIdx = idx; }
    });
    if (hatched.income > minInc) save.basePets[minIdx] = hatched.id;
  }

  save.incubators.splice(slotIndex, 1);
  autoFillIncubatorsFromStorage();
  saveData();
  showToast(`🎉 破殼成功！獲得【${hatched.icon} ${hatched.name}】(+$$${hatched.income}/s)！`);
  if (document.getElementById('shop-modal').classList.contains('show')) openShop();
}

function moveStorageEggToIncubator(storageIdx) {
  if (save.incubators.length >= save.maxIncubators) {
    showToast("⚠️ 孵化槽滿緊！先破殼或者買「➕ 擴充孵化槽」啦！");
    return;
  }
  const tier = save.eggStorage.splice(storageIdx, 1)[0];
  const rObj = RARITY_TIERS.find(r => r.tier === tier);
  save.incubators.push({ tier, name: rObj.name, color: rObj.color, timeLeft: rObj.hatchSec, ready: false });
  saveData();
  openShop();
  showToast(`🥚 已將倉庫嘅【${rObj.name}】放入孵化槽！`);
}

function tryManualHatch() {
  const readyIdx = save.incubators.findIndex(s => s.ready);
  if (readyIdx !== -1) hatchReadyEgg(readyIdx);
  else openShop();
}

function openShop() {
  gamePaused = true;
  autoFillIncubatorsFromStorage();
  const speedCost = 150 * save.speedLv;
  const carryCost = 200 * save.carryLv;
  const expandCost = (save.maxIncubators - 2) * 180;

  document.getElementById('txt-speed-lv').textContent = `Lv.${save.speedLv}`;
  document.getElementById('btn-buy-speed').textContent = `💰 $${speedCost}`;
  document.getElementById('txt-carry-lv').textContent = `Lv.${save.carryLv}`;
  document.getElementById('btn-buy-carry').textContent = `💰 $${carryCost}`;
  document.getElementById('txt-shield-cnt').textContent = `現有: ${save.shieldCount}個`;
  document.getElementById('txt-inc-slots').textContent = `${save.incubators.length}/${save.maxIncubators}`;
  document.getElementById('txt-storage-cnt').textContent = save.eggStorage.length;

  const expBtn = document.getElementById('btn-expand-inc');
  if (save.maxIncubators >= 6) {
    expBtn.textContent = '✅ 已滿 6 槽';
    expBtn.disabled = true;
  } else {
    expBtn.textContent = `➕ 擴充孵化槽 ($${expandCost})`;
    expBtn.disabled = false;
  }

  const doubleBtn = document.getElementById('btn-buy-double');
  if (save.hasDoubleCoin) {
    doubleBtn.textContent = '✅ 已啟用';
    doubleBtn.disabled = true;
  }

  const incList = document.getElementById('incubator-list');
  incList.innerHTML = '';
  for (let i = 0; i < save.maxIncubators; i++) {
    const s = save.incubators[i];
    const div = document.createElement('div');
    div.className = 'item-card';
    div.innerHTML = !s
      ? `<div class="item-icon">🕳️</div><div><b>槽 #${i+1}</b><br><small>空閒</small></div>`
      : s.ready
        ? `<div class="item-icon">🥚✨</div><div><b style="color:${s.color}">${s.name}</b></div><button class="btn-ui btn-hatch-ready" onclick="hatchReadyEgg(${i})">🔨 破殼！</button>`
        : `<div class="item-icon">⏳</div><div><b style="color:${s.color}">${s.name}</b><br><small>剩 ${s.timeLeft}s</small></div>`;
    incList.appendChild(div);
  }

  const stList = document.getElementById('storage-list');
  stList.innerHTML = save.eggStorage.length === 0
    ? `<small style="grid-column:1/-1;color:#94a3b8;">倉庫暫無未孵嘅蛋（當孵化槽滿時，新偷返嚟嘅蛋會自動儲喺呢度）</small>`
    : '';
  save.eggStorage.forEach((tier, idx) => {
    const rObj = RARITY_TIERS.find(r => r.tier === tier);
    const div = document.createElement('div');
    div.className = 'item-card';
    div.style.borderColor = rObj.color;
    div.innerHTML = `
      <div class="item-icon">🥚</div>
      <div><b style="color:${rObj.color}">${rObj.name}</b></div>
      <button class="tts-mini" onclick="moveStorageEggToIncubator(${idx})">放入孵化槽</button>
    `;
    stList.appendChild(div);
  });

  const grid = document.getElementById('pet-grid');
  grid.innerHTML = '';
  PET_DEX.forEach(pet => {
    const unlocked = save.unlockedIds.includes(pet.id);
    const normalCnt = save.basePets.filter(k => k === pet.id).length;
    const goldCnt = save.basePets.filter(k => k === `${pet.id}_gold`).length;
    const card = document.createElement('div');
    card.className = 'item-card' + (unlocked ? ' unlocked' : '');
    card.innerHTML = `
      <div class="item-icon">${unlocked ? pet.icon : '❓'}</div>
      <div>
        <b>${unlocked ? pet.name : '未解鎖'}</b><br>
        <small style="color:${pet.color}">+$${pet.income}/s</small>
        ${normalCnt > 0 ? `<br><small style="color:#a7f070">普通 x${normalCnt}</small>` : ''}
        ${goldCnt > 0 ? `<br><small style="color:#fde047">✨黃金 x${goldCnt} (+$${pet.income*3}/s)</small>` : ''}
      </div>
      <div style="font-size:11.5px; color:#cbd5e1; text-align:left;">${unlocked ? pet.note : '破殼解鎖重點'}</div>
      ${unlocked ? `<button class="tts-mini" onclick="speakCantonese('${pet.name}重點：${pet.note}')">🔊 聽重點</button>` : ''}
    `;
    grid.appendChild(card);
  });

  document.getElementById('shop-modal').classList.add('show');
}

function closeShop() {
  document.getElementById('shop-modal').classList.remove('show');
  const gameView = document.getElementById('view-game');
  if (gameView && gameView.classList.contains('active')) gamePaused = false;
}

function buyUpgrade(type) {
  const speedCost = 150 * save.speedLv, carryCost = 200 * save.carryLv, expandCost = (save.maxIncubators - 2) * 180;
  if (type === 'expandInc' && save.maxIncubators < 6 && save.coins >= expandCost) {
    save.coins -= expandCost; save.maxIncubators++; autoFillIncubatorsFromStorage();
    showToast(`🥚 已擴充至 ${save.maxIncubators} 個孵化槽！`);
  } else if (type === 'speed' && save.coins >= speedCost) {
    save.coins -= speedCost; save.speedLv++; showToast(`👟 反重力跑鞋升至 Lv.${save.speedLv}！`);
  } else if (type === 'carry' && save.coins >= carryCost) {
    save.coins -= carryCost; save.carryLv++; showToast(`🦾 機械抱蛋臂升至 Lv.${save.carryLv}！`);
  } else if (type === 'freeze' && save.coins >= 90) {
    save.coins -= 90; save.freezeCount++; showToast("❄️ 已買時間冰封彈！");
  } else if (type === 'decoy' && save.coins >= 110) {
    save.coins -= 110; save.decoyCount++; showToast("🤖 已買全息誘餌公仔！");
  } else if (type === 'tele' && save.coins >= 220) {
    save.coins -= 220; save.teleCount++; showToast("🛸 已買瞬間回城器！");
  } else if (type === 'shield' && save.coins >= 130) {
    save.coins -= 130; save.shieldCount++; showToast("🛡️ 已買數碼屏幕護盾！");
  } else if (type === 'hatchboost' && save.coins >= 100) {
    if (save.incubators.length === 0) return showToast("🥚 孵化槽無蛋呀！");
    save.coins -= 100;
    save.incubators.forEach(s => { s.timeLeft = Math.max(0, s.timeLeft - 30); if (s.timeLeft === 0) s.ready = true; });
    showToast("⚡ 所有太空蛋已加速 30 秒！");
  } else if (type === 'double' && save.coins >= 900 && !save.hasDoubleCoin) {
    save.coins -= 900; save.hasDoubleCoin = true; showToast("💎 已啟用永久雙倍金幣！");
  } else return showToast("💰 太空幣唔夠呀！");
  saveData(); openShop();
}

function openResetModal() {
  gamePaused = true;
  document.getElementById('reset-step-1').style.display = 'block';
  document.getElementById('reset-step-2').style.display = 'none';
  document.getElementById('reset-modal').classList.add('show');
}
function showResetStep2() {
  document.getElementById('reset-step-1').style.display = 'none';
  document.getElementById('reset-step-2').style.display = 'block';
}
function closeResetModal() {
  document.getElementById('reset-modal').classList.remove('show');
  const gameView = document.getElementById('view-game');
  if (gameView && gameView.classList.contains('active')) gamePaused = false;
}
function executeHardReset() {
  localStorage.removeItem('justin_xnamx_v7');
  save = JSON.parse(JSON.stringify(DEFAULT_SAVE));
  player.x = 380; player.y = 2600; player.carriedEggs = [];
  saveData(); closeResetModal();
  showToast("🔄 已完全重設！");
}
function resetToBase(msg) {
  player.x = 380; player.y = 2600; player.carriedEggs = [];
  nests.forEach(n => { n.monster.state = 'idle'; n.monster.x = n.monster.homeX; n.monster.y = n.monster.homeY; });
  showToast(msg);
}
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg; t.style.opacity = '1';
  clearTimeout(window._tTimer);
  window._tTimer = setTimeout(() => t.style.opacity = '0', 3200);
}

updateUI();
draw();
