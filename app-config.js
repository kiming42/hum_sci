/* ============================================================================
   ⚙️ 應用程式設定與課題過濾模組 (app-config.js)
============================================================================ */

window.getSelectedUnits = function() {
  const sciCheckboxes = document.querySelectorAll('.sci-chk:checked');
  const humCheckboxes = document.querySelectorAll('.hum-chk:checked');
  return {
    sci: Array.from(sciCheckboxes).map(cb => cb.value),
    hum: Array.from(humCheckboxes).map(cb => cb.value)
  };
};

window.switchMainView = function(viewName) {
  document.querySelectorAll('.main-view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.btn-main-view').forEach(b => b.classList.remove('active'));
  
  const targetView = document.getElementById('view-' + viewName);
  if (targetView) targetView.classList.add('active');
  
  // 點亮對應導航掣
  if (viewName === 'dashboard') {
    // 固定的首頁掣
  } else if (viewName === 'game') {
    if (typeof gamePaused !== 'undefined') gamePaused = false;
    if (typeof stopStoryAudio === 'function') stopStoryAudio();
  } else if (viewName === 'study') {
    if (typeof gamePaused !== 'undefined') gamePaused = true;
    if (typeof initStoryRoom === 'function') initStoryRoom();
  }
};
