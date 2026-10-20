/* ============================================================================
   🚀 太空奪蛋核心引擎 v6.0 (game-engine.js)
   新增玩法：
   1. 雙蛋疊高連偷 (Double Egg Stack)：可同時抱 2 隻蛋，成功歸巢獲 2.5 倍獎金！
   2. 太空隨機機關：🌀 黑洞引力漩渦 (吸住怪獸)、🔮 左右雙向傳送蟲洞、📦 流星補給箱
   3. ✨ 3合1 黃金神獸進化系統
============================================================================ */

const RARITY_TIERS = [
  { tier: 1, name: "普通太空蛋", color: "#a7f070", hatchSec: 20,  income: 1,  weight: 0.04 },
  { tier: 2, name: "稀有藍晶蛋", color: "#41a6f6", hatchSec: 40,  income: 3,  weight: 0.08 },
  { tier: 3, name: "史詩紫星蛋", color: "#c084fc", hatchSec: 75,  income: 8,  weight: 0.12 },
  { tier: 4, name: "傳說金陽蛋", color: "#ffcd75", hatchSec: 120, income: 22, weight: 0.16 },
  { tier: 5, name: "宇宙神話蛋", color: "#ef7d57", hatchSec: 180, income: 65, weight: 0.20 }
];

const PET_DEX = [
  { id: "p1", tier: 1, name: "星際史萊姆龍", icon: "🟢", rarity: "普通", income: 1,  color: "#a7f070", note: "嬰幼兒期(0歲~生長最快) ➔ 兒童期(5歲~) ➔ 青春期(10歲~) ➔ 成年期(20歲~最強壯) ➔ 老年期(60歲~)。" },
  { id: "p2", tier: 2, name: "藍翼荷爾蒙獸", icon: "🦋", rarity: "稀有", income: 3,  color: "#41a6f6", note: "腦部分泌荷爾蒙刺激生殖器官：睾丸產生男性荷爾蒙；卵巢產生女性荷爾蒙。" },
  { id: "p3", tier: 2, name: "量子生命水母", icon: "🪼", rarity: "稀有", income: 4,  color: "#41a6f6", note: "精子(0.05mm似蝌蚪，睾丸製造)；卵子(0.1-0.2mm圓球狀，卵巢排卵、子宮孕育胎兒)。" },
  { id: "p4", tier: 3, name: "裝甲戰痘機神", icon: "🤖", rarity: "史詩", income: 8,  color: "#c084fc", note: "油脂＋塵埃塞毛孔＝黑頭；細菌感染發炎＝暗瘡。切勿擠壓或過度清潔！" },
  { id: "p5", tier: 3, name: "深空月光睡神", icon: "🌙", rarity: "史詩", income: 10, color: "#c084fc", note: "6-13歲每天睡9-11小時！生長荷爾蒙在晚上10時至凌晨2時深層睡眠分泌。" },
  { id: "p6", tier: 4, name: "黃金金字塔龍", icon: "🐉", rarity: "傳說", income: 22, color: "#ffcd75", note: "吃最多穀物、多吃蔬果、適量奶肉蛋、最少油鹽糖＋每天6-8杯水！少吃垃圾食物。" },
  { id: "p7", tier: 4, name: "超光速運動虎", icon: "⚡", rarity: "傳說", income: 26, color: "#ffcd75", note: "每天累積60分鐘中等運動(能說話不能唱歌)＋每週3次劇烈運動(說不完整句子)。" },
  { id: "p8", tier: 5, name: "神話銀背星王", icon: "🦍", rarity: "神話", income: 65, color: "#ef7d57", note: "雄性大猩猩背部變銀灰色代表性成熟；樽鼻海豚成年前獨立探索。做個負責任數碼公民！" }
];

const NEST_SPOTS = [
  { id: 0, x: 160, y: 2150, monsterName: "綠色史萊姆怪", mIcon: "🦠", mColor: "#38b764", mSpeed: 2.4, mRadius: 20, minTier: 1 },
  { id: 1, x: 600, y: 1900, monsterName: "獨眼激光外星人", mIcon: "👁️", mColor: "#41a6f6", mSpeed: 2.7, mRadius: 22, minTier: 1 },
  { id: 2, x: 160, y: 1620, monsterName: "雙頭隕石巨怪", mIcon: "☄️", mColor: "#a855f7", mSpeed: 3.0, mRadius: 24, minTier: 1 },
  { id: 3, x: 600, y: 1350, monsterName: "虛空機械蜘蛛", mIcon: "🕷️", mColor: "#ec4899", mSpeed: 3.3, mRadius: 23, minTier: 2 },
  { id: 4, x: 160, y: 1050, monsterName: "銀河暗影刺客", mIcon: "🥷", mColor: "#6366f1", mSpeed: 3.6, mRadius: 21, minTier: 2 },
  { id: 5, x: 600, y: 760,  monsterName: "熔岩泰坦巨獸", mIcon: "🌋", mColor: "#f97316", mSpeed: 3.9, mRadius: 27, minTier: 2 },
  { id: 6, x: 170, y: 460,  monsterName: "宇宙冰霜魔龍", mIcon: "🐲", mColor: "#06b6d4", mSpeed: 4.2, mRadius: 28, minTier: 3 },
  { id: 7, x: 380, y: 160,  monsterName: "黑洞終極吞噬者", mIcon: "🕳️", mColor: "#ef4444", mSpeed: 4.6, mRadius: 32, minTier: 3 }
];

// 新增跑道互動機關：1. 雙向傳送蟲洞 (左穿右/右穿左)  2. 黑洞減速漩渦 (可引誘怪獸踩入去！)
const WORMHOLES = [
  { y: 1750, leftX: 85, rightX: 675, color: "#c084fc" },
  { y: 900,  leftX: 85, rightX: 675, color: "#38bdf8" }
];

const BLACK_HOLES = [
  { x: 380, y: 1500, r: 44 },
  { x: 380, y: 620,  r: 48 }
];

let meteorSupply = { active: true, x: 380, y: 1200, timer: 0 };

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
let currentSubject = 'sci';

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
  basePets: [], // 可存 'p1' 或黃金進化版 'p1_gold'
  unlockedIds: []
};

let save = JSON.parse(localStorage.getItem('justin_xnamx_v6')) || JSON.parse(JSON.stringify(DEFAULT_SAVE));

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
  localStorage.setItem('justin_xnamx_v6', JSON.stringify(save));
  updateUI();
}

// 視圖切換：遊戲 vs 故事溫習室
function switchMainView(viewName) {
  document.querySelectorAll('.main-view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.btn-main-view').forEach(b => b.classList.remove('active'));
  document.getElementById('view-' + viewName).classList.add('active');
  document.getElementById('btn-view-' + viewName).classList.add('active');
  gamePaused = (viewName !== 'game');
  if (viewName === 'game') stopStoryAudio();
}

// 3合1 黃金神獸合成系統
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

// 初始化巢穴
const nests = NEST_SPOTS.map(s => ({
  ...s,
  eggTier: rollRandomEggTier(s.minTier),
  hasEgg: true,
  respawnTimer: 0,
  monster: {
    x: s.x < 380 ? s.x + 70 : s.x - 70,
    y: s.y,
    homeX: s.x < 380 ? s.x + 70 : s.x - 70,
    homeY: s.y,
    state: 'idle',
    stunTimer: 0
  }
}));

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
        showToast("✨ 太空蛋孵好啦！返基地親手破殼啦！");
      }
    }
  });
  saveData();
}, 1000);

// 玩家狀態：支援 carriedEggs 陣列 (最多疊高抱 2 隻蛋！)
const player = {
  x: 380, y: 2600, r: 18,
  baseSpeed: 3.35,
  carriedEggs: [], // 可疊 2 隻蛋: [tier1, tier2]
  jetpackTimer: 0,
  jetpackCd: 0,
  wormholeCd: 0
};

let activeDecoy = null;
let gamePaused = false;
let currentModalQ = null;
let targetNest = null;
let seqUserPicked = [];

/* ============================================================================
   繪製 JUSTIN 角色 (支援頭頂疊高抱 2 隻蛋！)
============================================================================ */
function drawJustinAvatar(ctx, x, y, carriedEggs, isJetpack) {
  ctx.save();
  ctx.translate(x, y);

  const t = Date.now() / 180;
  const wingFlap = Math.sin(t) * 4;

  // 藍水花大翅膀
  ctx.save();
  ctx.fillStyle = 'rgba(30, 144, 255, 0.78)';
  ctx.strokeStyle = '#73eff7';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-8, -2);
  ctx.quadraticCurveTo(-36, -24 + wingFlap, -44, -6 + wingFlap);
  ctx.quadraticCurveTo(-30, 8, -8, 6);
  ctx.closePath(); ctx.fill(); ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(8, -2);
  ctx.quadraticCurveTo(36, -24 + wingFlap, 44, -6 + wingFlap);
  ctx.quadraticCurveTo(30, 8, 8, 6);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.restore();

  // 雙腳與有感筆電黑T恤
  ctx.fillStyle = '#0f121d';
  ctx.fillRect(-9, 8, 8, 10); ctx.fillRect(1, 8, 8, 10);
  ctx.fillStyle = '#151926';
  ctx.fillRect(-10, -6, 20, 15);
  ctx.fillStyle = '#facc15';
  ctx.fillRect(-4, -3, 8, 7);

  // 藍色手臂與黃色方塊頭
  ctx.fillStyle = '#2563eb';
  ctx.fillRect(-16, -5, 6, 12); ctx.fillRect(10, -5, 6, 12);
  ctx.fillStyle = '#eab308';
  ctx.fillRect(-8, -18, 16, 12);
  ctx.fillStyle = '#090a0f';
  ctx.fillRect(-7, -14, 6, 4); ctx.fillRect(1, -14, 6, 4);

  // 藍黑禮帽
  ctx.fillStyle = '#0f172a'; ctx.fillRect(-12, -19, 24, 3);
  ctx.fillStyle = '#1d4ed8'; ctx.fillRect(-8, -25, 16, 6);

  // 環繞科技屏幕
  for (let i = 0; i < 3; i++) {
    const ang = (Date.now() / 600) + (i * Math.PI * 2 / 3);
    const sx = Math.cos(ang) * 26, sy = Math.sin(ang) * 14 + 2;
    ctx.fillStyle = 'rgba(56, 189, 248, 0.8)';
    ctx.fillRect(sx - 6, sy - 4, 12, 8);
  }

  ctx.font = 'bold 12px sans-serif';
  ctx.fillStyle = '#73eff7';
  ctx.textAlign = 'center';
  ctx.fillText('JUSTIN', 0, 30);

  // 頭頂疊高抱蛋 (最多 2 隻)
  if (carriedEggs && carriedEggs.length > 0) {
    carriedEggs.forEach((tier, idx) => {
      const rObj = RARITY_TIERS.find(r => r.tier === tier);
      const ey = -38 - idx * 24;
      ctx.beginPath();
      ctx.arc(0, ey, 12, 0, Math.PI * 2);
      ctx.fillStyle = rObj ? rObj.color : '#fff';
      ctx.fill();
      ctx.strokeStyle = '#fff'; ctx.stroke();
      ctx.font = '16px sans-serif';
      ctx.fillText('🥚', 0, ey + 6);
    });
  }

  ctx.restore();
}

/* ============================================================================
   問答與雙蛋連偷觸發
============================================================================ */
function switchSubject(subj) {
  currentSubject = subj;
  showToast("已切換题庫模式！");
}

function speakCurrentModalQ() {
  if (currentModalQ) speakCantonese(currentModalQ.q.replace('【 ？ 】', '邊個選項'));
}

function triggerQuizModal(mode, nestObj) {
  gamePaused = true;
  keys['w'] = keys['a'] = keys['s'] = keys['d'] = false;
  joyVec = { x: 0, y: 0 };
  targetNest = nestObj || null;

  let pool = window.SCIENCE_QUESTIONS;
  if (currentSubject === 'hum') pool = window.HUMANITIES_QUESTIONS;
  else if (currentSubject === 'mix') pool = [...window.SCIENCE_QUESTIONS, ...window.HUMANITIES_QUESTIONS];

  const rawQ = pool[Math.floor(Math.random() * pool.length)];
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

  if (mode === 'steal' && nestObj) {
    const rObj = RARITY_TIERS.find(r => r.tier === nestObj.eggTier);
    const isSecond = player.carriedEggs.length === 1;
    titleEl.innerHTML = isSecond
      ? `🔥 雙倍貪心連偷第 2 隻：【<span style="color:${rObj.color}">${rObj.name}</span>】`
      : `🥚 搶奪【<span style="color:${rObj.color}">${rObj.name}</span>】`;
  } else {
    titleEl.innerHTML = `🚨 怪獸攔截！答啱震退怪獸！`;
  }

  catEl.textContent = currentModalQ.cat;
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
    seqSlotsEl.innerHTML = `<div class="seq-slot" id="slot-0">第1步</div><div class="seq-slot" id="slot-1">第2步</div><div class="seq-slot" id="slot-2">第3步</div>`;
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
    expEl.innerHTML = `✅ <b>答啱啦！</b> ${currentModalQ.exp}<br><br><button class="btn-ui" id="btn-go">即刻行動！🚀</button>`;
    document.getElementById('btn-go').onclick = () => {
      document.getElementById('quiz-modal').classList.remove('show');
      gamePaused = false;
      if (mode === 'steal') {
        player.carriedEggs.push(targetNest.eggTier);
        targetNest.hasEgg = false;
        targetNest.respawnTimer = 500;
        targetNest.monster.state = 'chasing';
        targetNest.monster.stunTimer = 45;
        showToast(player.carriedEggs.length === 2
          ? "🔥 雙蛋疊高連偷成功！返到基地可獲 2.5 倍獎金！快跑！"
          : "🚨 成功偷到第 1 隻蛋！你可以直接跑返基地，或者冒險偷多 1 隻！");
      } else {
        nests.forEach(n => { if (n.monster.state === 'chasing') n.monster.stunTimer = 180; });
        player.jetpackTimer = 80;
        showToast("💥 成功震飛怪獸！");
      }
    };
  } else {
    btnEl.classList.add('wrong');
    expEl.innerHTML = `💡 <b>記住重點：</b> ${currentModalQ.exp}<br><br><button class="btn-ui" onclick="closeWrong('${mode}')">繼續 ➡️</button>`;
  }
}

function closeWrong(mode) {
  document.getElementById('quiz-modal').classList.remove('show');
  gamePaused = false;
  if (mode === 'steal') player.x = 380;
  else resetToBase("🦖 怪獸搶返隻蛋啦！返基地升級再戰！");
}

function deliverEggsToBase() {
  const count = player.carriedEggs.length;
  let bonus = 0;

  player.carriedEggs.forEach(tier => {
    const rObj = RARITY_TIERS.find(r => r.tier === tier);
    bonus += tier * 20;
    if (save.incubators.length < save.maxIncubators) {
      save.incubators.push({ tier, name: rObj.name, color: rObj.color, timeLeft: rObj.hatchSec, ready: false });
    } else {
      save.eggStorage.push(tier);
    }
  });

  if (count >= 2) bonus = Math.round(bonus * 2.5); // 雙蛋連偷 2.5 倍獎金！
  save.coins += bonus;
  player.carriedEggs = [];

  nests.forEach(n => { if (n.monster.state === 'chasing') n.monster.state = 'returning'; });
  saveData();
  showToast(count >= 2
    ? `🔥 雙蛋連偷歸巢大成功！獲得 2.5倍獎金 +$${bonus}！`
    : `🥚 成功將蛋送返基地 (+$${bonus})！`);
}

/* ============================================================================
   主循環 Update & 渲染 (含蟲洞、黑洞漩渦、流星補給箱)
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
joyZone.addEventListener('pointerdown', e => { joyActive = true; handleJoy(e.clientX, e.clientY); });
window.addEventListener('pointermove', e => { if (joyActive) handleJoy(e.clientX, e.clientY); });
window.addEventListener('pointerup', () => { joyActive = false; joyKnob.style.transform = `translate(0,0)`; joyVec = {x:0,y:0}; });

function useJetpack() { if (player.jetpackCd <= 0) { player.jetpackTimer = 100; player.jetpackCd = 240; showToast("🚀 噴射翼全開！"); } }
function useFreezeBomb() {
  if (save.freezeCount <= 0) return showToast("❄️ 無冰封彈啦！");
  save.freezeCount--;
  nests.forEach(n => { if (n.monster.state === 'chasing') n.monster.stunTimer = 270; });
  saveData(); showToast("❄️ 怪獸結冰 4.5 秒！");
}
function useDecoy() {
  if (save.decoyCount <= 0) return showToast("🤖 無誘餌公仔啦！");
  save.decoyCount--; activeDecoy = { x: player.x, y: player.y - 30, timer: 300 };
  saveData(); showToast("🤖 放出 JUSTIN 誘餌公仔！");
}
function useTeleport() {
  if (save.teleCount <= 0) return showToast("🛸 無瞬間回城器啦！");
  save.teleCount--; player.x = 380; player.y = 2500;
  saveData(); showToast("🛸 瞬間回城成功！");
}

function update() {
  if (gamePaused) return;
  if (player.jetpackTimer > 0) player.jetpackTimer--;
  if (player.jetpackCd > 0) player.jetpackCd--;
  if (player.wormholeCd > 0) player.wormholeCd--;
  if (activeDecoy && --activeDecoy.timer <= 0) activeDecoy = null;

  document.getElementById('ui-jetpack-cd').textContent = player.jetpackCd > 0 ? `${Math.ceil(player.jetpackCd/60)}s` : '就緒';

  let spd = player.baseSpeed + (save.speedLv - 1) * 0.32;
  if (player.carriedEggs.length > 0) {
    const totalW = player.carriedEggs.reduce((s, t) => s + (RARITY_TIERS.find(r=>r.tier===t)?.weight || 0.08), 0);
    spd *= (1 - Math.max(0.03, totalW - (save.carryLv - 1) * 0.04));
  }
  if (player.jetpackTimer > 0) spd *= 1.55;

  // 檢查黑洞漩渦吸力
  for (const bh of BLACK_HOLES) {
    const d = Math.hypot(player.x - bh.x, player.y - bh.y);
    if (d < bh.r + 35) {
      spd *= 0.6;
      player.x += (bh.x - player.x) * 0.03;
      player.y += (bh.y - player.y) * 0.03;
    }
    // 怪獸行過黑洞一樣會被吸住減速！
    nests.forEach(n => {
      if (Math.hypot(n.monster.x - bh.x, n.monster.y - bh.y) < bh.r + 25) {
        n.monster.stunTimer = Math.max(n.monster.stunTimer, 20);
      }
    });
  }

  let dx = joyVec.x, dy = joyVec.y;
  if (keys['w'] || keys['arrowup']) dy -= 1;
  if (keys['s'] || keys['arrowdown']) dy += 1;
  if (keys['a'] || keys['arrowleft']) dx -= 1;
  if (keys['d'] || keys['arrowright']) dx += 1;
  if (dx !== 0 || dy !== 0) {
    const len = Math.hypot(dx, dy);
    player.x += (dx / len) * spd; player.y += (dy / len) * spd;
  }
  player.x = Math.max(68, Math.min(WORLD_W - 68, player.x));
  player.y = Math.max(50, Math.min(WORLD_H - 35, player.y));

  // 檢查雙向傳送蟲洞 (左穿右 / 右穿左)
  if (player.wormholeCd <= 0) {
    for (const wh of WORMHOLES) {
      if (Math.hypot(player.x - wh.leftX, player.y - wh.y) < 26) {
        player.x = wh.rightX - 35; player.wormholeCd = 90;
        showToast("🔮 穿越蟲洞！");
      } else if (Math.hypot(player.x - wh.rightX, player.y - wh.y) < 26) {
        player.x = wh.leftX + 35; player.wormholeCd = 90;
        showToast("🔮 穿越蟲洞！");
      }
    }
  }

  // 檢查流星補給箱
  if (meteorSupply.active) {
    if (Math.hypot(player.x - meteorSupply.x, player.y - meteorSupply.y) < 34) {
      meteorSupply.active = false;
      meteorSupply.timer = 900; // 15秒後再跌落
      player.jetpackTimer = 150;
      save.coins += 35;
      saveData();
      showToast("📦 拾獲流星補給箱！獲得 +$35 及 2.5秒噴射加速！");
    }
  } else if (--meteorSupply.timer <= 0) {
    meteorSupply.active = true;
    meteorSupply.x = 180 + Math.random() * 400;
    meteorSupply.y = 400 + Math.random() * 1700;
  }

  // 檢查偷蛋 (最多可疊 2 隻蛋！)
  for (const n of nests) {
    if (!n.hasEgg) {
      if (--n.respawnTimer <= 0) { n.hasEgg = true; n.eggTier = rollRandomEggTier(n.minTier); }
    } else if (player.carriedEggs.length < 2 && Math.hypot(player.x - n.x, player.y - n.y) < 42) {
      triggerQuizModal('steal', n);
      return;
    }
  }

  // 返抵基地交蛋
  if (player.carriedEggs.length > 0 && player.y > 2460) {
    deliverEggsToBase();
    return;
  }

  // 行近基地孵化器自動破殼已孵好嘅蛋
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
      m.x += Math.cos(ang) * n.mSpeed; m.y += Math.sin(ang) * n.mSpeed;

      if (!activeDecoy && Math.hypot(player.x - m.x, player.y - m.y) < player.r + n.mRadius - 4) {
        if (save.shieldCount > 0) {
          save.shieldCount--; m.stunTimer = 150; saveData();
          showToast(`🛡️ 護盾擋開咗【${n.monsterName}】！`);
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

  const isChased = nests.some(n => n.monster.state === 'chasing');
  ctx.fillStyle = (isChased && Math.floor(Date.now() / 300) % 2 === 0) ? '#230b1a' : '#080b1a';
  ctx.fillRect(0, 0, WORLD_W, WORLD_H);

  // 中央霓虹跑道
  ctx.fillStyle = 'rgba(30, 58, 138, 0.25)';
  ctx.fillRect(260, 140, 240, 2320);

  // 畫黑洞漩渦
  BLACK_HOLES.forEach(bh => {
    ctx.beginPath(); ctx.arc(bh.x, bh.y, bh.r, 0, Math.PI*2);
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)'; ctx.fill();
    ctx.lineWidth = 3; ctx.strokeStyle = '#a855f7'; ctx.stroke();
    ctx.font = 'bold 12px sans-serif'; ctx.fillStyle = '#e9d5ff'; ctx.textAlign = 'center';
    ctx.fillText('🌀 黑洞漩渦 (可吸住怪獸)', bh.x, bh.y + 5);
  });

  // 畫左右雙向傳送蟲洞
  WORMHOLES.forEach(wh => {
    [wh.leftX, wh.rightX].forEach(wx => {
      ctx.beginPath(); ctx.arc(wx, wh.y, 22, 0, Math.PI*2);
      ctx.fillStyle = wh.color; ctx.fill();
      ctx.strokeStyle = '#fff'; ctx.stroke();
      ctx.font = '16px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('🔮', wx, wh.y + 6);
    });
  });

  // 畫流星補給箱
  if (meteorSupply.active) {
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(meteorSupply.x - 18, meteorSupply.y - 18, 36, 36);
    ctx.strokeStyle = '#fff'; ctx.strokeRect(meteorSupply.x - 18, meteorSupply.y - 18, 36, 36);
    ctx.font = '20px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('🎁', meteorSupply.x, meteorSupply.y + 7);
  }

  // 畫底部太空基地
  ctx.fillStyle = '#111833';
  ctx.fillRect(52, 2460, WORLD_W - 104, 340);
  ctx.strokeStyle = '#73eff7'; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(52, 2460); ctx.lineTo(WORLD_W - 52, 2460); ctx.stroke();

  ctx.fillStyle = '#73eff7'; ctx.font = 'bold 15px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('🛸 JUSTIN 太空基地 (支援雙蛋連偷 2.5x 獎金 + 3合1黃金神獸進化)', WORLD_W/2, 2488);

  // 蛋倉庫大樓
  ctx.fillStyle = '#271c3a'; ctx.fillRect(72, 2515, 115, 70);
  ctx.strokeStyle = '#c084fc'; ctx.strokeRect(72, 2515, 115, 70);
  ctx.fillStyle = '#e9d5ff'; ctx.font = 'bold 12px sans-serif';
  ctx.fillText(`📦 倉庫: ${save.eggStorage.length}隻`, 130, 2555);

  // 孵化槽
  const totalSlots = save.maxIncubators;
  const gapX = Math.min(92, Math.floor(460 / totalSlots));
  for (let i = 0; i < totalSlots; i++) {
    const ix = 235 + i * gapX, iy = 2550, slot = save.incubators[i];
    ctx.fillStyle = slot && slot.ready ? '#422006' : '#1e293b';
    ctx.fillRect(ix - 38, iy - 32, 76, 64);
    ctx.strokeStyle = slot ? (slot.ready ? '#facc15' : slot.color) : '#475569';
    ctx.strokeRect(ix - 38, iy - 32, 76, 64);
    if (slot) {
      ctx.font = '20px sans-serif'; ctx.fillText('🥚', ix, iy - 2);
      ctx.font = 'bold 10.5px sans-serif';
      ctx.fillStyle = slot.ready ? '#fde047' : slot.color;
      ctx.fillText(slot.ready ? '✨可破殼!' : `${slot.timeLeft}s`, ix, iy + 22);
    }
  }

  // 8 個神獸展示台
  for (let i = 0; i < 8; i++) {
    const px = 125 + i * 72, py = 2710;
    const petKey = save.basePets[i];
    const info = petKey ? getPetInfo(petKey) : null;
    ctx.fillStyle = info && info.isGold ? '#422006' : '#1e293b';
    ctx.fillRect(px - 26, py - 26, 52, 52);
    ctx.strokeStyle = info && info.isGold ? '#facc15' : '#3b5dc9';
    ctx.strokeRect(px - 26, py - 26, 52, 52);
    if (info) {
      ctx.font = '24px sans-serif'; ctx.fillText(info.icon, px, py + 8);
      ctx.font = 'bold 11px sans-serif'; ctx.fillStyle = info.isGold ? '#fde047' : '#a7f070';
      ctx.fillText(`+$${info.income}/s`, px, py + 40);
    }
  }

  // 畫 8 個巢穴與怪獸
  for (const n of nests) {
    const rObj = RARITY_TIERS.find(r => r.tier === n.eggTier);
    ctx.beginPath(); ctx.arc(n.x, n.y, 32, 0, Math.PI * 2);
    ctx.fillStyle = '#1e293b'; ctx.fill();
    ctx.lineWidth = 4; ctx.strokeStyle = n.hasEgg ? rObj.color : '#475569'; ctx.stroke();

    ctx.textAlign = 'center';
    if (n.hasEgg) {
      ctx.font = '28px sans-serif'; ctx.fillText('🥚', n.x, n.y + 10);
      ctx.font = 'bold 12px sans-serif'; ctx.fillStyle = rObj.color;
      ctx.fillText(`★ ${rObj.name} ($${rObj.income}/s)`, n.x, n.y - 40);
    }

    const m = n.monster;
    ctx.beginPath(); ctx.arc(m.x, m.y, n.mRadius, 0, Math.PI * 2);
    ctx.fillStyle = m.state === 'chasing' ? '#dc2626' : n.mColor; ctx.fill();
    ctx.strokeStyle = m.stunTimer > 0 ? '#73eff7' : '#fff'; ctx.stroke();
    ctx.font = `${n.mRadius}px sans-serif`; ctx.fillText(n.mIcon, m.x, m.y + 8);
  }

  if (activeDecoy) drawJustinAvatar(ctx, activeDecoy.x, activeDecoy.y, [], false);
  drawJustinAvatar(ctx, player.x, player.y, player.carriedEggs, player.jetpackTimer > 0);
  ctx.restore();

  requestAnimationFrame(() => { update(); draw(); });
}

/* ============================================================================
   UI、破殼與商店管理
============================================================================ */
function updateUI() {
  document.getElementById('ui-coins').textContent = save.coins;
  document.getElementById('ui-income').textContent = getTotalIncomePerSec();
  document.getElementById('ui-storage').textContent = save.eggStorage.length;
  document.getElementById('ui-freeze-count').textContent = `x${save.freezeCount}`;
  document.getElementById('ui-decoy-count').textContent = `x${save.decoyCount}`;
  document.getElementById('ui-tele-count').textContent = `x${save.teleCount}`;

  const pillInc = document.getElementById('pill-incubator');
  const txtInc = document.getElementById('ui-incubator');
  const readyCount = save.incubators.filter(s => s.ready).length;
  if (readyCount > 0) {
    pillInc.className = 'stat-pill btn-hatch-ready';
    txtInc.textContent = `✨ ${readyCount}隻可破殼!`;
  } else {
    pillInc.className = 'stat-pill';
    txtInc.textContent = `${save.incubators.length}/${save.maxIncubators}`;
  }
}

function hatchReadyEgg(slotIndex) {
  const slot = save.incubators[slotIndex];
  if (!slot || !slot.ready) return;
  const candidates = PET_DEX.filter(p => p.tier === slot.tier);
  const hatched = candidates[Math.floor(Math.random() * candidates.length)];
  if (!save.unlockedIds.includes(hatched.id)) save.unlockedIds.push(hatched.id);

  if (save.basePets.length < 8) save.basePets.push(hatched.id);
  else {
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
  showToast(`🎉 破殼成功！獲得【${hatched.icon} ${hatched.name}】！`);
  if (document.getElementById('shop-modal').classList.contains('show')) openShop();
}

function tryManualHatch() {
  const readyIdx = save.incubators.findIndex(s => s.ready);
  if (readyIdx !== -1) hatchReadyEgg(readyIdx);
  else openShop();
}

function openShop() {
  gamePaused = true;
  autoFillIncubatorsFromStorage();
  const expandCost = (save.maxIncubators - 2) * 180;
  document.getElementById('txt-inc-slots').textContent = `${save.incubators.length}/${save.maxIncubators}`;
  document.getElementById('txt-storage-cnt').textContent = save.eggStorage.length;

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
  stList.innerHTML = save.eggStorage.length === 0 ? `<small style="grid-column:1/-1;color:#94a3b8;">倉庫暫無未孵嘅蛋</small>` : '';
  save.eggStorage.forEach(tier => {
    const rObj = RARITY_TIERS.find(r => r.tier === tier);
    const div = document.createElement('div');
    div.className = 'item-card';
    div.innerHTML = `<div class="item-icon">🥚</div><div><b style="color:${rObj.color}">${rObj.name}</b></div>`;
    stList.appendChild(div);
  });

  const grid = document.getElementById('pet-grid');
  grid.innerHTML = '';
  PET_DEX.forEach(pet => {
    const unlocked = save.unlockedIds.includes(pet.id);
    const card = document.createElement('div');
    card.className = 'item-card' + (unlocked ? ' unlocked' : '');
    card.innerHTML = `
      <div class="item-icon">${unlocked ? pet.icon : '❓'}</div>
      <div><b>${unlocked ? pet.name : '未解鎖'}</b><br><small style="color:${pet.color}">+$${pet.income}/s</small></div>
      <div style="font-size:11.5px; color:#cbd5e1; text-align:left;">${unlocked ? pet.note : '破殼解鎖重點'}</div>
    `;
    grid.appendChild(card);
  });

  document.getElementById('shop-modal').classList.add('show');
}

function closeShop() { document.getElementById('shop-modal').classList.remove('show'); gamePaused = false; }

function buyUpgrade(type) {
  const speedCost = 150 * save.speedLv, carryCost = 200 * save.carryLv, expandCost = (save.maxIncubators - 2) * 180;
  if (type === 'expandInc' && save.maxIncubators < 6 && save.coins >= expandCost) { save.coins -= expandCost; save.maxIncubators++; }
  else if (type === 'speed' && save.coins >= speedCost) { save.coins -= speedCost; save.speedLv++; }
  else if (type === 'carry' && save.coins >= carryCost) { save.coins -= carryCost; save.carryLv++; }
  else if (type === 'freeze' && save.coins >= 90) { save.coins -= 90; save.freezeCount++; }
  else if (type === 'decoy' && save.coins >= 110) { save.coins -= 110; save.decoyCount++; }
  else if (type === 'tele' && save.coins >= 220) { save.coins -= 220; save.teleCount++; }
  else if (type === 'shield' && save.coins >= 130) { save.coins -= 130; save.shieldCount++; }
  else if (type === 'hatchboost' && save.coins >= 100) {
    save.coins -= 100;
    save.incubators.forEach(s => { s.timeLeft = Math.max(0, s.timeLeft - 30); if (s.timeLeft === 0) s.ready = true; });
  } else if (type === 'double' && save.coins >= 900 && !save.hasDoubleCoin) { save.coins -= 900; save.hasDoubleCoin = true; }
  else return showToast("💰 金幣唔夠呀！");
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
function closeResetModal() { document.getElementById('reset-modal').classList.remove('show'); gamePaused = false; }
function executeHardReset() {
  localStorage.removeItem('justin_xnamx_v6');
  save = JSON.parse(JSON.stringify(DEFAULT_SAVE));
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
  t.textContent = msg; t.style.opacity = '1';
  clearTimeout(window._tTimer);
  window._tTimer = setTimeout(() => t.style.opacity = '0', 3200);
}

updateUI();
draw();
