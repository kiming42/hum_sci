/* ============================================================================
   📖 故事溫習室與 Gemini API 語音朗讀模組 (data-story.js)
============================================================================ */

window.STORY_CHAPTERS = [
  {
    id: "sci-u2",
    name: "🧪 科學第2課：青春期的變化",
    pages: [
      {
        tag: "第 2 課・頁 8-9",
        title: "第一章：人生的五個成長階段",
        img: "images/sci_u2_p1.jpg", // 媽媽可放入圖片路徑，若無圖片會自動顯示下方 icon
        icon: "👶👦🧑👨👴",
        story: "隊長 JUSTIN 駕駛太空船去到「時光星球」，發現人類由出世到老，會經歷五個重要階段！最先係 0 歲開始嘅「嬰幼兒期」，呢個時候BB生長速度係一生之中最快嘅，仲開始學行學控制身體。到咗約 5 歲嘅「兒童期」，平衡力同協調能力都變強。跟住去到約 10 歲（女仔約7-12歲，男仔約9-14歲）就會踏入「青春期」！之後約 20 歲係身體最強壯成熟嘅「成年期」，最後到約 60 歲就踏入「老年期」，白髮同皺紋會增加，能力亦慢慢退化。",
        keypoints: "📌 必考重點：嬰幼兒期生長速度最快｜女性(7-12歲)一般比男性(9-14歲)較早踏入青春期｜成年期初期身體最強壯。"
      },
      {
        tag: "第 2 課・頁 10-11",
        title: "第二章：荷爾蒙密碼與男女大不同",
        img: "images/sci_u2_p2.jpg",
        icon: "🧬⚡",
        story: "點解踏入青春期之後，身體會突然好似變身咁？原來係我哋個「腦部」派出咗大量荷爾蒙信號，刺激生殖器官發育！男仔嘅「睾丸」收到信號就會產生男性荷爾蒙，令男仔出現喉結、聲線變低沉、長出鬍子同肌肉變壯實；而女仔嘅「卵巢」就會產生女性荷爾蒙，令女仔乳房隆起、臀部變得豐滿。不過男女都有共同變化㗎，就係身高體重顯著增加、長出陰毛同腋毛，仲容易長出暗瘡添！",
        keypoints: "📌 必考重點：腦部分泌荷爾蒙 ➔ 刺激睾丸(男)及卵巢(女)｜男女共同特徵：長高增重、長暗瘡、腋毛、陰毛。"
      },
      {
        tag: "第 2 課・頁 12-14",
        title: "第三章：生命之源 —— 生殖系統與夢遺、月經",
        img: "images/sci_u2_p3.jpg",
        icon: "🔬🐣",
        story: "人類繁殖係源於爸爸嘅「精子」同媽媽嘅「卵子」結合。精子好似一條小蝌蚪（長約0.05毫米），係男性體內最細嘅細胞，由「睾丸」製造、「陰囊」負責保護，再由「輸精管」輸送同經「陰莖」排出；男仔瞓覺時如果陰莖受刺激（例如被太重或內褲太緊）排出精液，就叫做「夢遺」，完全係正常無害嘅！而媽媽嘅卵子係圓球狀（直徑0.1-0.2毫米），係女性最大嘅細胞，由「卵巢」按月排出，經「輸卵管」移去「子宮」（孕育胎兒嘅地方）。如果約兩星期後卵子無受精，增厚充血嘅子宮內膜就會脫落經陰道排出，形成「月經」！",
        keypoints: "📌 必考重點：睾丸製造精子、陰囊保護｜卵巢製造排卵、輸卵管輸送、子宮孕育胎兒｜月經期間可按身體狀況做適度運動！"
      },
      {
        tag: "第 2 課・頁 15 & 74",
        title: "第四章：青春期心理轉變與「戰痘攻略」",
        img: "images/sci_u2_p4.jpg",
        icon: "🪞🧼",
        story: "受荷爾蒙影響，青春期情緒容易起伏，仲會有五大心理特徵：1.注重自我形象（成日照鏡整頭）、2.渴望獨立自主（自己返學）、3.重視朋輩認同、4.對異性感興趣、5.對性產生好奇。另外，荷爾蒙會刺激皮膚「皮脂腺」過度分泌油脂，加埋塵埃塞住毛孔就變「黑頭」，如果受細菌感染發炎就會變「暗瘡」！記住千祈唔好用手指擠壓或者撕掉暗瘡痂，亦唔好一日洗十幾次面過度清潔，否則皮膚太乾反而分泌更多油！",
        keypoints: "📌 必考重點：油脂＋塵埃塞毛孔＝黑頭 ➔ 細菌感染發炎＝暗瘡｜切勿擠壓或過度清潔洗臉！"
      }
    ]
  },
  {
    id: "sci-u3",
    name: "🥗 科學第3課：應對青春期",
    pages: [
      {
        tag: "第 3 課・頁 17-20",
        title: "第一章：先天遺傳 vs 後天黃金睡眠",
        img: "images/sci_u3_p1.jpg",
        icon: "🌙💤",
        story: "每個同學高矮同發育快慢都唔同，因為發育受先天嘅「父母遺傳」同後天嘅「睡眠、飲食、運動」影響，所以唔使同人比較！新聞曾經報道有個16歲少年，本身遺傳預測可以生到 177cm 高，但因為學業壓力大成日焦慮，每日淨係瞓得 4 個鐘，結果得 156cm 高！原來有助長高嘅荷爾蒙主要喺「晚上 10 時至凌晨 2 時」嘅深層睡眠分泌。6至13歲學童每日應該瞓足 9 至 11 小時，而且瞓前千祈唔好大飲大食、做劇烈運動或者玩平板電腦呀！",
        keypoints: "📌 必考重點：先天因素＝遺傳｜後天因素＝睡眠、飲食、運動｜晚上10時至凌晨2時深層睡眠分泌生長荷爾蒙｜每天睡9-11小時。"
      },
      {
        tag: "第 3 課・頁 21-25",
        title: "第二章：飲食金字塔、運動測試與動物青春期",
        img: "images/sci_u3_p2.jpg",
        icon: "🥦🏀🦍",
        story: "想身體強壯，就要跟足健康飲食金字塔：底層吃最多「穀物類」、多吃「蔬菜水果類」、吃適量「奶類及肉魚蛋類」、吃最少頂層嘅「油鹽糖類」，每日仲要飲 6 至 8 杯流質（如水、奶）。少食高熱量高糖嘅垃圾食物，免得營養失衡、肥胖同埋令血糖波動引致「情緒不穩」！運動方面，每日要累積做至少 60 分鐘中等或以上運動（每週3次劇烈運動）。打乒乓球時「仍能說話但不能唱歌」係中等強度；跑步時「說不完整句子」就係劇烈強度！連動物都有青春期：雄性大猩猩背脊變「銀灰色」就代表性成熟；樽鼻海豚成年前亦會離開媽媽獨立探索！",
        keypoints: "📌 必考重點：每天6-8杯水｜垃圾食物引致營養失衡、肥胖、情緒不穩｜每天60分鐘運動｜雄性大猩猩銀灰色背毛＝性成熟。"
      }
    ]
  },
  {
    id: "hum-slot",
    name: "🏛️ 人文科溫習室 (預留位)",
    pages: [
      {
        tag: "人文科預留章節",
        title: "等待載入人文科課文故事",
        img: "images/hum_p1.jpg",
        icon: "🏛️🗺️",
        story: "呢個章節已經預留俾 JUSTIN 嘅人文科課文！只要媽媽上傳人文科課文，就可以將課文重點變成好聽嘅太空冒險故事同圖片放喺呢度隨時聽、隨時溫！",
        keypoints: "📌 預留位置：支援隨時加入人文科圖片與故事旁白。"
      }
    ]
  }
];

// 溫習室狀態控制
let currentChapIdx = 0;
let currentPageIdx = 0;
let currentAudioObj = null;

function initStoryRoom() {
  const savedKey = localStorage.getItem('justin_gemini_api_key') || '';
  const keyInput = document.getElementById('gemini-api-key');
  if (keyInput) keyInput.value = savedKey;
  renderChapterTabs();
  renderStoryPage();
}

function saveApiKey() {
  const val = document.getElementById('gemini-api-key').value.trim();
  localStorage.setItem('justin_gemini_api_key', val);
  showToast(val ? "✅ 已儲存 Gemini API Key！將使用 Gemini 講故事！" : "已清除 Key，將使用內置廣東話語音朗讀。");
}

function renderChapterTabs() {
  const wrap = document.getElementById('story-chapter-tabs');
  if (!wrap) return;
  wrap.innerHTML = '';
  window.STORY_CHAPTERS.forEach((chap, idx) => {
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
}

function renderStoryPage() {
  const chap = window.STORY_CHAPTERS[currentChapIdx];
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
  const chap = window.STORY_CHAPTERS[currentChapIdx];
  currentPageIdx = (currentPageIdx - 1 + chap.pages.length) % chap.pages.length;
  renderStoryPage();
}

function nextStoryPage() {
  stopStoryAudio();
  const chap = window.STORY_CHAPTERS[currentChapIdx];
  currentPageIdx = (currentPageIdx + 1) % chap.pages.length;
  renderStoryPage();
}

function stopStoryAudio() {
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  if (currentAudioObj) {
    currentAudioObj.pause();
    currentAudioObj = null;
  }
  const btn = document.getElementById('btn-play-story');
  if (btn) btn.textContent = '🔊 聽 Gemini 講故事';
}

// 支援 Gemini 2.5 Flash TTS / 講故事演繹 API，若未填 Key 則自動無縫切換至廣東話 Web Speech API
async function playStoryAudio() {
  stopStoryAudio();
  const chap = window.STORY_CHAPTERS[currentChapIdx];
  const page = chap.pages[currentPageIdx];
  const apiKey = (localStorage.getItem('justin_gemini_api_key') || '').trim();
  const btn = document.getElementById('btn-play-story');

  const fullScript = `${page.title}。${page.story}。重點提提你：${page.keypoints.replace('📌 必考重點：', '')}`;

  if (apiKey) {
    try {
      btn.textContent = '⏳ Gemini 正在生成生動故事語音...';
      // 呼叫 Gemini API 將課文轉化為更生動嘅廣東話口語故事或直接生成語音
      const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `你係一個超受香港小學生歡迎嘅 Roblox 太空船長，請用生動有趣、親切嘅香港廣東話口語，好似講故仔咁同 JUSTIN 朗讀以下科學溫習內容（唔使加多餘開場白，直接開始講故仔）：\n${fullScript}`
            }]
          }]
        })
      });
      const data = await resp.json();
      const livelyText = data?.candidates?.[0]?.content?.parts?.[0]?.text || fullScript;
      document.getElementById('story-text').textContent = livelyText;
      btn.textContent = '🔊 正在朗讀 Gemini 故事...';
      speakCantonese(livelyText, () => { btn.textContent = '🔊 聽 Gemini 講故事'; });
      return;
    } catch (e) {
      console.warn('Gemini API 呼叫失敗，切換至內置廣東話朗讀', e);
    }
  }

  btn.textContent = '🔊 正在廣東話朗讀故事...';
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

window.addEventListener('DOMContentLoaded', initStoryRoom);
