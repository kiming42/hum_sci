/* ============================================================================
   📖 故事溫習室與 Gemini 語音朗讀模組 (data-story.js)
============================================================================ */

window.STORY_CHAPTERS = [
  {
    id: "sci-u2",
    unit: "u2",
    name: "🧪 科學第2課：青春期的變化",
    pages: [
      {
        tag: "第 2 課・頁 8-11",
        title: "第一章：五個階段與青春期生理變化",
        img: "images/sci_u2_p1.jpg",
        icon: "🧬👦👧",
        story: "隊長 JUSTIN 駕駛太空船去到「時光星球」。人類由嬰幼兒期（生長最快）到兒童期，去到大約 10 歲就會踏入「青春期」！腦部派出荷爾蒙信號刺激生殖器官：男仔嘅「睾丸」產生男性荷爾蒙（喉結、聲沉、長鬍子）；女仔嘅「卵巢」產生女性荷爾蒙（乳房隆起、臀部豐滿）。男女共同特徵包括身高體重顯著增加、長出腋毛陰毛同埋容易長暗瘡！",
        keypoints: "📌 重點：嬰幼兒期生長最快｜睾丸(男)與卵巢(女)分泌荷爾蒙｜暗瘡成因係油脂＋塵埃塞毛孔。"
      },
      {
        tag: "第 2 課・頁 12-14",
        title: "第二章：生殖系統、夢遺與月經",
        img: "images/sci_u2_p2.jpg",
        icon: "🔬🐣",
        story: "精子（似蝌蚪，0.05毫米）由睾丸製造、陰囊保護、輸精管輸送；卵子（圓球狀）由卵巢排出、輸卵管輸送、子宮孕育胎兒。男仔瞓覺有夢遺，女仔有月經（卵子無受精，子宮內膜脫落經陰道排出），兩者都係正常自然現象！",
        keypoints: "📌 重點：睾丸製造精子｜卵巢排卵、子宮孕育胎兒｜月經期間可做適度運動。"
      }
    ]
  },
  {
    id: "sci-u3",
    unit: "u3",
    name: "🥗 科學第3課：應對青春期",
    pages: [
      {
        tag: "第 3 課・頁 17-25",
        title: "第三章：睡眠、飲食金字塔與運動",
        img: "images/sci_u3_p1.jpg",
        icon: "🌙🥦",
        story: "發育受先天遺傳同後天睡眠、飲食、運動影響。生長荷爾蒙主要喺「晚上10時至凌晨2時」深層睡眠分泌，小學每日要瞓 9-11 小時！飲食要跟足金字塔（吃最多穀物、吃最少油鹽糖），常食垃圾食物會導致營養失衡同情緒不穩。每日要累積 60 分鐘運動！",
        keypoints: "📌 重點：晚上10時至凌晨2時分泌生長荷爾蒙｜每日 6-8 杯水｜垃圾食物致情緒不穩｜每日 60 分鐘運動。"
      }
    ]
  }
];

// 過濾並渲染章節 Tab
function renderChapterTabs() {
  const wrap = document.getElementById('story-chapter-tabs');
  if (!wrap) return;
  wrap.innerHTML = '';

  const selectedUnits = (typeof window.getSelectedUnits === 'function') ? window.getSelectedUnits() : { sci: ['u2','u3'], hum: ['u1'] };
  
  const activeChapters = window.STORY_CHAPTERS.filter(chap => {
    if (chap.id.startsWith('sci') && !selectedUnits.sci.includes(chap.unit)) return false;
    if (chap.id.startsWith('hum') && !selectedUnits.hum.includes(chap.unit)) return false;
    return true;
  });

  if (activeChapters.length === 0) {
    wrap.innerHTML = `<span style="color:#fca5a5;">請先在上方主控台 (Dashboard) 勾選最少一個溫習課題！</span>`;
    return;
  }

  if (currentChapIdx >= activeChapters.length) currentChapIdx = 0;

  activeChapters.forEach((chap, idx) => {
    const btn = document.createElement('button');
    btn.className = 'chap-btn' + (idx === currentChapIdx ? ' active' : '');
    btn.textContent = chap.name;
    btn.onclick = () => {
      stopStoryAudio();
      currentChapIdx = idx;
      currentPageIdx = 0;
      renderChapterTabs();
      renderStoryPage();
    };
    wrap.appendChild(btn);
  });
  window._activeChapters = activeChapters;
  renderStoryPage();
}

function renderStoryPage() {
  const activeChapters = window._activeChapters || window.STORY_CHAPTERS;
  if (!activeChapters[currentChapIdx]) return;
  const chap = activeChapters[currentChapIdx];
  const page = chap.pages[currentPageIdx];

  document.getElementById('story-tag').textContent = page.tag;
  document.getElementById('story-title').textContent = page.title;
  document.getElementById('story-text').textContent = page.story;
  document.getElementById('story-keypoints').textContent = page.keypoints;
  document.getElementById('story-page-num').textContent = `第 ${currentPageIdx + 1} / ${chap.pages.length} 頁`;

  const imgEl = document.getElementById('story-img');
  const fallbackEl = document.getElementById('story-fallback-art');
  fallbackEl.textContent = page.icon || '📖';
  imgEl.style.display = 'block';
  fallbackEl.style.display = 'none';
  imgEl.src = page.img;
}

function prevStoryPage() {
  stopStoryAudio();
  const activeChapters = window._activeChapters || window.STORY_CHAPTERS;
  const chap = activeChapters[currentChapIdx];
  currentPageIdx = (currentPageIdx - 1 + chap.pages.length) % chap.pages.length;
  renderStoryPage();
}

function nextStoryPage() {
  stopStoryAudio();
  const activeChapters = window._activeChapters || window.STORY_CHAPTERS;
  const chap = activeChapters[currentChapIdx];
  currentPageIdx = (currentPageIdx + 1) % chap.pages.length;
  renderStoryPage();
}

function stopStoryAudio() {
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  const btn = document.getElementById('btn-play-story');
  if (btn) btn.textContent = '🔊 聽 Gemini 講故事';
}

async function playStoryAudio() {
  stopStoryAudio();
  const activeChapters = window._activeChapters || window.STORY_CHAPTERS;
  const chap = activeChapters[currentChapIdx];
  const page = chap.pages[currentPageIdx];
  const apiKey = (localStorage.getItem('justin_gemini_api_key') || '').trim();
  const btn = document.getElementById('btn-play-story');

  const fullScript = `${page.title}。${page.story}。重點：${page.keypoints}`;

  if (apiKey) {
    try {
      btn.textContent = '⏳ 生成語音中...';
      const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `請用生動有趣的廣東話口語向 JUSTIN 講故仔朗讀以下重點：\n${fullScript}` }] }]
        })
      });
      const data = await resp.json();
      const livelyText = data?.candidates?.[0]?.content?.parts?.[0]?.text || fullScript;
      btn.textContent = '🔊 朗讀中...';
      speakCantonese(livelyText, () => { btn.textContent = '🔊 聽 Gemini 講故事'; });
      return;
    } catch (e) { console.warn(e); }
  }

  btn.textContent = '🔊 廣東話朗讀中...';
  speakCantonese(fullScript, () => { btn.textContent = '🔊 聽 Gemini 講故事'; });
}

function speakCantonese(text, onEndCallback) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'zh-HK';
  u.rate = 1.02;
  u.onend = () => { if (onEndCallback) onEndCallback(); };
  window.speechSynthesis.speak(u);
}

function initStoryRoom() {
  renderChapterTabs();
}

window.addEventListener('DOMContentLoaded', initStoryRoom);
