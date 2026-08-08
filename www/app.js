/* ===== 竹语 App · 数据 + 交互逻辑 ===== */

/* ---------- IndexedDB ---------- */
const DB_NAME = 'zhuyu-db', DB_VER = 1;
let dbp;
function openDB(){
  if (dbp) return dbp;
  return dbp = new Promise((res, rej) => {
    const r = indexedDB.open(DB_NAME, DB_VER);
    r.onupgradeneeded = e => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('scores')) db.createObjectStore('scores', { keyPath:'id', autoIncrement:true });
      if (!db.objectStoreNames.contains('tracks')) db.createObjectStore('tracks', { keyPath:'id', autoIncrement:true });
    };
    r.onsuccess = e => res(e.target.result);
    r.onerror = e => rej(e.target.error);
  });
}
function store(name, mode){
  return openDB().then(db => db.transaction(name, mode).objectStore(name));
}
function getAll(name){
  return store(name, 'readonly').then(s => new Promise((res, rej) => {
    const r = s.getAll(); r.onsuccess = () => res(r.result || []); r.onerror = () => rej(r.error);
  }));
}
function get(name, id){
  return store(name, 'readonly').then(s => new Promise((res, rej) => {
    const r = s.get(id); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error);
  }));
}
function put(name, val){
  return store(name, 'readwrite').then(s => new Promise((res, rej) => {
    const r = s.put(val); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error);
  }));
}
function del(name, id){
  return store(name, 'readwrite').then(s => new Promise((res, rej) => {
    const r = s.delete(id); r.onsuccess = () => res(); r.onerror = () => rej(r.error);
  }));
}

/* ---------- helpers ---------- */
function esc(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
const urlCache = new WeakMap();
function blobURL(b){ if (urlCache.has(b)) return urlCache.get(b); const u = URL.createObjectURL(b); urlCache.set(b, u); return u; }
function pickGrad(id){ const g = ['g-green','g-green-dark','g-green-light']; return g[(id||0) % 3]; }
function motif(kind){
  const grad = kind === 'dark' ? 'g-green-dark' : kind === 'light' ? 'g-green-light' : 'g-green';
  return '<div class="cover ' + grad + '"><svg class="motif-sm" viewBox="0 0 80 24"><rect x="4" y="9" width="72" height="6" rx="3" fill="#fff" opacity="0.9"/><circle cx="24" cy="12" r="1.7" fill="#1F2421" opacity="0.5"/><circle cx="40" cy="12" r="1.7" fill="#1F2421" opacity="0.5"/><circle cx="56" cy="12" r="1.7" fill="#1F2421" opacity="0.5"/></svg></div>';
}
const SHEET_SVG = '<svg viewBox="0 0 300 420" xmlns="http://www.w3.org/2000/svg">' +
  '<g transform="translate(0,30)"><line x1="20" y1="0" x2="280" y2="0" stroke="#E3DECF" stroke-width="1"/><line x1="20" y1="8" x2="280" y2="8" stroke="#E3DECF" stroke-width="1"/><line x1="20" y1="16" x2="280" y2="16" stroke="#E3DECF" stroke-width="1"/><line x1="20" y1="24" x2="280" y2="24" stroke="#E3DECF" stroke-width="1"/><line x1="20" y1="32" x2="280" y2="32" stroke="#E3DECF" stroke-width="1"/>' +
  '<ellipse cx="60" cy="16" rx="5" ry="4" fill="#1F2421"/><ellipse cx="90" cy="8" rx="5" ry="4" fill="#1F2421"/><ellipse cx="120" cy="24" rx="5" ry="4" fill="#1F2421"/><ellipse cx="150" cy="16" rx="5" ry="4" fill="#1F2421"/><ellipse cx="180" cy="32" rx="5" ry="4" fill="#1F2421"/><ellipse cx="210" cy="24" rx="5" ry="4" fill="#1F2421"/><ellipse cx="240" cy="8" rx="5" ry="4" fill="#1F2421"/><line x1="100" y1="0" x2="100" y2="32" stroke="#A6ABA3" stroke-width="1"/><line x1="190" y1="0" x2="190" y2="32" stroke="#A6ABA3" stroke-width="1"/><text x="20" y="52" font-family="Sarasa Gothic SC" font-size="10" fill="#6E766F">姑 苏 城 外 寒 山 寺</text></g>' +
  '<g transform="translate(0,110)"><line x1="20" y1="0" x2="280" y2="0" stroke="#E3DECF" stroke-width="1"/><line x1="20" y1="8" x2="280" y2="8" stroke="#E3DECF" stroke-width="1"/><line x1="20" y1="16" x2="280" y2="16" stroke="#E3DECF" stroke-width="1"/><line x1="20" y1="24" x2="280" y2="24" stroke="#E3DECF" stroke-width="1"/><line x1="20" y1="32" x2="280" y2="32" stroke="#E3DECF" stroke-width="1"/><ellipse cx="50" cy="24" rx="5" ry="4" fill="#1F2421"/><ellipse cx="80" cy="16" rx="5" ry="4" fill="#1F2421"/><ellipse cx="110" cy="8" rx="5" ry="4" fill="#1F2421"/><ellipse cx="140" cy="16" rx="5" ry="4" fill="#1F2421"/><ellipse cx="170" cy="32" rx="5" ry="4" fill="#1F2421"/><ellipse cx="200" cy="24" rx="5" ry="4" fill="#1F2421"/><ellipse cx="230" cy="16" rx="5" ry="4" fill="#1F2421"/><ellipse cx="260" cy="8" rx="5" ry="4" fill="#1F2421"/><line x1="100" y1="0" x2="100" y2="32" stroke="#A6ABA3" stroke-width="1"/><line x1="190" y1="0" x2="190" y2="32" stroke="#A6ABA3" stroke-width="1"/><text x="20" y="52" font-family="Sarasa Gothic SC" font-size="10" fill="#6E766F">夜 半 钟 声 到 客 船</text></g>' +
  '<g transform="translate(0,190)"><line x1="20" y1="0" x2="280" y2="0" stroke="#E3DECF" stroke-width="1"/><line x1="20" y1="8" x2="280" y2="8" stroke="#E3DECF" stroke-width="1"/><line x1="20" y1="16" x2="280" y2="16" stroke="#E3DECF" stroke-width="1"/><line x1="20" y1="24" x2="280" y2="24" stroke="#E3DECF" stroke-width="1"/><line x1="20" y1="32" x2="280" y2="32" stroke="#E3DECF" stroke-width="1"/><ellipse cx="70" cy="8" rx="5" ry="4" fill="#1F2421"/><ellipse cx="100" cy="16" rx="5" ry="4" fill="#1F2421"/><ellipse cx="130" cy="24" rx="5" ry="4" fill="#1F2421"/><ellipse cx="160" cy="16" rx="5" ry="4" fill="#1F2421"/><ellipse cx="190" cy="8" rx="5" ry="4" fill="#1F2421"/><ellipse cx="220" cy="24" rx="5" ry="4" fill="#1F2421"/><ellipse cx="250" cy="16" rx="5" ry="4" fill="#1F2421"/><line x1="100" y1="0" x2="100" y2="32" stroke="#A6ABA3" stroke-width="1"/><line x1="190" y1="0" x2="190" y2="32" stroke="#A6ABA3" stroke-width="1"/><text x="20" y="52" font-family="Sarasa Gothic SC" font-size="10" fill="#6E766F">月 落 乌 啼 霜 满 天</text></g>' +
  '<g transform="translate(0,270)"><line x1="20" y1="0" x2="280" y2="0" stroke="#E3DECF" stroke-width="1"/><line x1="20" y1="8" x2="280" y2="8" stroke="#E3DECF" stroke-width="1"/><line x1="20" y1="16" x2="280" y2="16" stroke="#E3DECF" stroke-width="1"/><line x1="20" y1="24" x2="280" y2="24" stroke="#E3DECF" stroke-width="1"/><line x1="20" y1="32" x2="280" y2="32" stroke="#E3DECF" stroke-width="1"/><ellipse cx="60" cy="16" rx="5" ry="4" fill="#1F2421"/><ellipse cx="90" cy="8" rx="5" ry="4" fill="#1F2421"/><ellipse cx="120" cy="24" rx="5" ry="4" fill="#1F2421"/><ellipse cx="150" cy="32" rx="5" ry="4" fill="#1F2421"/><ellipse cx="180" cy="16" rx="5" ry="4" fill="#1F2421"/><ellipse cx="210" cy="8" rx="5" ry="4" fill="#1F2421"/><ellipse cx="240" cy="24" rx="5" ry="4" fill="#1F2421"/><line x1="100" y1="0" x2="100" y2="32" stroke="#A6ABA3" stroke-width="1"/><line x1="190" y1="0" x2="190" y2="32" stroke="#A6ABA3" stroke-width="1"/><text x="20" y="52" font-family="Sarasa Gothic SC" font-size="10" fill="#6E766F">江 枫 渔 火 对 愁 眠</text></g>' +
  '<text x="150" y="380" text-anchor="middle" font-family="Sarasa Gothic SC" font-size="11" fill="#A6ABA3">— 简谱预览 · 可缩放与标注 —</text></svg>';

/* ---------- state ---------- */
const state = { scoreFilter: 'all', scoreSearch: '' };

/* ---------- toast ---------- */
let toastTimer;
function toast(msg){
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 1800);
}

/* ---------- tab navigation ---------- */
function goTab(name){
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('screen-' + name).classList.add('active');
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('on'));
  const cur = document.querySelector('.tab[data-tab="' + name + '"]');
  if (cur) cur.classList.add('on');
  document.querySelectorAll('.tab').forEach(t => {
    const c = t.classList.contains('on') ? '#fff' : '#9AA39C';
    t.querySelectorAll('.ic path, .ic circle').forEach(el => {
      if (el.getAttribute('stroke')) el.setAttribute('stroke', c);
      if (el.getAttribute('fill') && el.getAttribute('fill') !== 'none') el.setAttribute('fill', c);
    });
  });
  closeDetail();
  if (name === 'scores') refreshScores();
  if (name === 'acc') refreshTracks();
  if (name === 'profile') renderProfile();
}

/* ---------- scores ---------- */
async function renderScores(){
  const all = await getAll('scores');
  let list = all;
  if (state.scoreSearch){
    const q = state.scoreSearch.toLowerCase();
    list = list.filter(s => {
      const hay = [s.title, s.composer, s.note, s.instrument, s.level, s.tuning].filter(Boolean).join(' ').toLowerCase();
      return hay.includes(q);
    });
  } else if (state.scoreFilter !== 'all'){
    list = list.filter(s => s.instrument === state.scoreFilter);
  }
  const grid = document.getElementById('scoreGrid');
  if (!list.length){
    const msg = state.scoreSearch ? '没有匹配的谱子' : '还没有谱子';
    const sub = state.scoreSearch ? '换个关键词试试' : '点击右上角 + 添加你的第一份曲谱<br>（支持拍照、图片或 PDF）';
    const btn = state.scoreSearch ? '' : '<button class="ebtn" onclick="openAddScore()">添加谱子</button>';
    grid.innerHTML = '<div class="empty" style="grid-column:1/-1;padding:40px 12px">' +
      '<svg viewBox="0 0 24 24" fill="none"><circle cx="7" cy="17" r="2.5" stroke="#A6ABA3" stroke-width="2"/><circle cx="17" cy="15" r="2.5" stroke="#A6ABA3" stroke-width="2"/><path d="M9.5 17V6L19 4V15" stroke="#A6ABA3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
      '<div class="et">' + esc(msg) + '</div><div class="es">' + sub + '</div>' + btn + '</div>';
    return;
  }
  grid.innerHTML = list.map(s => {
    const cover = s.cover ? '<div class="cover"><img src="' + blobURL(s.cover) + '" alt=""></div>' : motif(pickGrad(s.id));
    return '<div class="scard" onclick="openDetail(' + s.id + ')">' + cover +
      '<div class="card-title">' + esc(s.title) + '</div>' +
      '<div class="card-meta">' + esc(s.instrument) + ' · ' + esc(s.level || '') + '</div>' +
      '<div class="del" onclick="event.stopPropagation();deleteScore(' + s.id + ', \'' + esc(s.title).replace(/\'/g, "\\'") + '\')"><svg viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/></svg></div>' +
      '</div>';
  }).join('');
}
async function renderRecent(){
  const all = await getAll('scores');
  const box = document.getElementById('recentScroll');
  if (!all.length){
    box.innerHTML = '<div class="rcard" onclick="goTab(\'scores\')" style="justify-content:center;align-items:center;text-align:center;color:var(--sub);font-size:12px;line-height:1.6">还没有曲谱<br>去谱库添加 →</div>';
    return;
  }
  const list = all.slice(-3).reverse();
  box.innerHTML = list.map(s => {
    const cover = s.cover ? '<div class="cover"><img src="' + blobURL(s.cover) + '" alt=""></div>' : motif(pickGrad(s.id));
    return '<div class="rcard" onclick="openDetail(' + s.id + ')">' + cover +
      '<div class="card-title">' + esc(s.title) + '</div>' +
      '<div class="card-meta-sm">' + esc(s.instrument) + ' · ' + esc(s.level || '') + '</div></div>';
  }).join('');
}
function refreshScores(){ renderScores(); renderRecent(); renderProfile(); }

/* ---------- detail ---------- */
const detail = document.getElementById('screen-detail');
async function openDetail(id){
  const s = await get('scores', id);
  if (!s){ toast('谱子不存在'); return; }
  const grad = pickGrad(id);
  const cover = s.cover ? '<div class="cover"><img src="' + blobURL(s.cover) + '" alt=""></div>' : motif(grad);
  const tags = [s.instrument, s.level, s.tuning].filter(Boolean).map(t => '<div class="pill">' + esc(t) + '</div>').join('');
  let body = '';
  if (s.files && s.files.length){
    body = s.files.map(f => {
      if (f.kind === 'image') return '<img class="att-img" src="' + blobURL(f.data) + '" alt="' + esc(f.name) + '">';
      const u = blobURL(f.data);
      return '<div class="pdf-card"><svg class="pdf-ic" viewBox="0 0 24 24" fill="none"><rect x="4" y="3" width="16" height="18" rx="2" stroke="#BC4B3C" stroke-width="2"/><path d="M8 8h8M8 12h8M8 16h5" stroke="#BC4B3C" stroke-width="2" stroke-linecap="round"/></svg><div class="col"><div class="pdf-name">' + esc(f.name) + '</div><div class="pdf-sub">PDF · 点击打开</div></div><a class="open-btn" href="' + u + '" target="_blank">打开</a></div>';
    }).join('');
  } else {
    body = SHEET_SVG;
  }
  detail.innerHTML =
    '<div class="content">' +
      '<div class="header"><div class="back" onclick="closeDetail()"><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke="#1F2421" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div>' +
      '<div class="dtitle">' + esc(s.title) + '</div>' +
      '<div class="fav"><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 21l-1.45-1.32C5.4 14.36 2 11.28 2 7.5 2 4.42 4.42 2 7.5 2c1.74 0 3.41.81 4.5 2.09C13.09 2.81 14.76 2 16.5 2 19.58 2 22 4.42 22 7.5c0 3.78-3.4 6.86-8.55 12.18L12 21z" fill="#BC4B3C"/></svg></div></div>' +
      '<div class="info-card">' + cover + '<div class="col"><div class="score-title">' + esc(s.title) + '</div><div class="composer">' + esc(s.composer || '民间乐曲') + '</div><div class="tags">' + tags + '</div></div></div>' +
      '<div class="score-view" id="scoreView">' + body + '</div>' +
    '</div>' +
    '<div class="toolbar"><div class="left">' +
      '<div class="tbtn" id="accBtn" onclick="toggleScoreTrack(' + s.id + ')" title="播放关联伴奏"><svg width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="rgba(78,124,89,0.15)"/><path d="M16 13l10 7-10 7z" fill="#4E7C59"/></svg></div>' +
      '<div class="tbtn" id="demoBtn" onclick="toggleDemo()" title="试听（合成长音）"><svg width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="rgba(78,124,89,0.15)"/><path d="M14 20h4l3-8 5 16 3-8h3" stroke="#4E7C59" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></div>' +
      '<div class="tbtn" id="metroBtn" onclick="toggleMetro()" title="节拍器"><svg width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="rgba(78,124,89,0.15)"/><path d="M20 12v10M20 12l-3 3M20 12l3 3" stroke="#4E7C59" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></div>' +
    '</div><button class="start-practice" onclick="toast(\'开始练习（演示）\')">开始练习<svg width="16" height="16" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" fill="#fff"/></svg></button></div>' +
    '<div class="detail-player">' +
      '<div class="progress" id="detailProg"><div class="fill" id="detailFill" style="width:0%"></div></div>' +
      '<div class="timerow"><span id="detailCur">00:00</span><span id="detailTot">00:00</span></div>' +
    '</div>';
  detail.classList.add('active');
  // 点击谱面进入全屏查看
  detail.querySelector('.score-view').addEventListener('click', () => openLightbox(s));
  const tracks = await getAll('tracks');
  const linked = tracks.filter(t => t.scoreId == s.id);
  const playingThis = linked.length && currentTrackId === linked[0].id && audioEl && !audioEl.paused;
  updateScoreTrackIcon(s.id, playingThis);
  bindProgressDrag(document.getElementById('detailProg'));
  updateProgressUI();
}
function closeDetail(){
  detail.classList.remove('active');
  stopDemo(); stopMetro();
}

/* ---------- lightbox ---------- */
function openLightbox(s){
  const box = document.getElementById('lightbox');
  const inner = document.getElementById('lightboxInner');
  let html = '<div class="lightbox-close" onclick="closeLightbox()">×</div>';
  if (s.files && s.files.length){
    const imgs = s.files.filter(f => f.kind === 'image');
    if (imgs.length){
      imgs.forEach(f => { html += '<img src="' + blobURL(f.data) + '" alt="' + esc(f.name) + '" onclick="closeLightbox()">'; });
    } else {
      html += '<div class="lightbox-placeholder">当前谱子只含 PDF，请在谱子详情页点击「打开」查看。</div>';
    }
  } else {
    html += '<div class="lightbox-placeholder">点击谱子图片可在此放大查看。</div>';
  }
  inner.innerHTML = html;
  box.classList.add('active');
}
function closeLightbox(){ document.getElementById('lightbox').classList.remove('active'); }

/* ---------- profile ---------- */
async function renderProfile(){
  const scores = await getAll('scores');
  const tracks = await getAll('tracks');
  document.getElementById('statScores').textContent = scores.length;
  document.getElementById('statTracks').textContent = tracks.length;
}

/* ---------- accompaniment (real audio) ---------- */
let audioEl = null, currentTrackId = null;
async function renderTracks(){
  const list = await getAll('tracks');
  document.getElementById('trackList').innerHTML = list.length ? list.map(t =>
    '<div class="track-row" onclick="playTrack(' + t.id + ')"><div class="left"><div class="cover ' + pickGrad(t.id) + '"></div><div class="info col gap4"><div class="card-title">' + esc(t.title) + '</div><div class="card-meta">' + esc(t.instrument) + ' · ' + esc(t.tuning || '') + '</div></div></div>' +
    '<div class="del" onclick="event.stopPropagation();deleteTrack(' + t.id + ', \'' + esc(t.title).replace(/\'/g, "\\'") + '\')"><svg viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="#4E7C59" stroke-width="2.2" stroke-linecap="round"/></svg></div></div>'
  ).join('') : '';
  renderAccPlayer(list);
}
async function renderAccPlayer(list){
  list = list || await getAll('tracks');
  const p = document.getElementById('accPlayer');
  if (!list.length){
    p.innerHTML = '<div class="empty" style="padding:32px 12px"><svg viewBox="0 0 24 24" fill="none"><path d="M3 12h2.5l2-6 3 14 3-18 2.5 10H21" stroke="#A6ABA3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><div class="et">还没有伴奏</div><div class="es">点击右上角 + 上传你的伴奏音频，<br>可离线循环播放。</div><button class="ebtn" onclick="openAddTrack()">添加伴奏</button></div>';
    return;
  }
  if (!currentTrackId || !list.find(t => t.id === currentTrackId)) currentTrackId = list[0].id;
  const t = list.find(x => x.id === currentTrackId);
  p.innerHTML = '<div class="label">正在播放</div><div class="track">' + esc(t.title) + '</div>' +
    '<div class="tag">' + esc(t.instrument) + ' · 伴奏 ' + esc(t.tuning || '') + '</div>' +
    '<svg class="wave" viewBox="0 0 300 40" preserveAspectRatio="none"><rect x="0" y="18" width="300" height="2" fill="#E6EEDF"/><path d="M0 20 Q30 10 60 20 T120 20 T180 20 T240 20 T300 20" stroke="#4E7C59" stroke-width="2" fill="none"/></svg>' +
    '<div class="progress" id="accProg"><div class="fill" id="accFill" style="width:0%"></div></div>' +
    '<div class="timerow"><span id="accCur">00:00</span><span id="accTot">00:00</span></div>' +
    '<div class="controls"><svg width="32" height="32" viewBox="0 0 24 24" onclick="prevTrack()"><path d="M6 6v12M18 6l-8 6 8 6V6z" fill="#1F2421"/></svg>' +
    '<svg id="accPlay" width="56" height="56" viewBox="0 0 56 56" onclick="toggleAccPlay()" style="cursor:pointer"><circle cx="28" cy="28" r="28" fill="#4E7C59"/><rect x="21" y="18" width="4" height="20" rx="1" fill="#fff"/><rect x="31" y="18" width="4" height="20" rx="1" fill="#fff"/></svg>' +
    '<svg width="32" height="32" viewBox="0 0 24 24" onclick="nextTrack()"><path d="M18 6v12M6 6l8 6-8 6V6z" fill="#1F2421"/></svg></div>';
  const prog = document.getElementById('accProg');
  bindProgressDrag(prog);
  loadTrackIntoPlayer(t);
  setAccPlayIcon(audioEl && !audioEl.paused);
}
function loadTrackIntoPlayer(t){
  if (!audioEl) audioEl = new Audio();
  const blob = t.audio || t.data;
  const u = blobURL(blob);
  if (audioEl._url !== u){
    if (audioEl._url) URL.revokeObjectURL(audioEl._url);
    audioEl._url = u; audioEl.src = u; audioEl.loop = false; audioEl.load();
  }
  audioEl.ontimeupdate = () => updateProgressUI();
  audioEl.onloadedmetadata = () => updateProgressUI();
  audioEl.onended = () => setAccPlayIcon(false);
}
function updateProgressUI(){
  if (!audioEl || !audioEl.duration || isNaN(audioEl.duration)) return;
  const pct = audioEl.currentTime / audioEl.duration * 100;
  const cur = fmt(audioEl.currentTime), tot = fmt(audioEl.duration);
  const accFill = document.getElementById('accFill'); if (accFill) accFill.style.width = pct + '%';
  const accCur = document.getElementById('accCur'); if (accCur) accCur.textContent = cur;
  const accTot = document.getElementById('accTot'); if (accTot) accTot.textContent = tot;
  const detailFill = document.getElementById('detailFill'); if (detailFill) detailFill.style.width = pct + '%';
  const detailCur = document.getElementById('detailCur'); if (detailCur) detailCur.textContent = cur;
  const detailTot = document.getElementById('detailTot'); if (detailTot) detailTot.textContent = tot;
}
function fmt(s){ if (!s || isNaN(s)) return '00:00'; s = Math.floor(s); return String(Math.floor(s/60)).padStart(2,'0') + ':' + String(s%60).padStart(2,'0'); }
async function playTrack(id){
  currentTrackId = id;
  const list = await getAll('tracks');
  renderAccPlayer(list);
  toggleAccPlay(true);
}
function toggleAccPlay(force){
  if (!audioEl) return;
  const want = force !== undefined ? force : audioEl.paused;
  if (want){ audioCtx(); audioEl.play().catch(() => toast('无法播放该音频')); } else { audioEl.pause(); }
  setAccPlayIcon(want);
}
function setAccPlayIcon(playing){
  const p = document.getElementById('accPlay'); if (!p) return;
  p.innerHTML = playing
    ? '<circle cx="28" cy="28" r="28" fill="#4E7C59"/><rect x="21" y="18" width="4" height="20" rx="1" fill="#fff"/><rect x="31" y="18" width="4" height="20" rx="1" fill="#fff"/>'
    : '<circle cx="28" cy="28" r="28" fill="#4E7C59"/><path d="M23 19l11 9-11 9z" fill="#fff"/>';
}

/* ---------- progress bar drag (shared) ---------- */
let seekDrag = false, seekProg = null;
function bindProgressDrag(el){ if (!el) return; el.addEventListener('mousedown', startSeek); el.addEventListener('touchstart', startSeek, {passive:false}); }
function startSeek(e){ e.preventDefault(); seekDrag = true; seekProg = e.currentTarget; seekProg.classList.add('dragging'); seekTo(e); }
function seekMove(e){ if (!seekDrag || !seekProg) return; e.preventDefault(); seekTo(e); }
function seekEnd(){ if (seekProg) seekProg.classList.remove('dragging'); seekDrag = false; seekProg = null; }
function seekTo(e){
  if (!audioEl || !audioEl.duration || !isFinite(audioEl.duration)) return;
  const r = seekProg.getBoundingClientRect();
  const cx = e.touches ? e.touches[0].clientX : (e.changedTouches ? e.changedTouches[0].clientX : e.clientX);
  const pct = Math.max(0, Math.min(1, (cx - r.left) / r.width));
  audioEl.currentTime = pct * audioEl.duration;
}
window.addEventListener('mousemove', seekMove);
window.addEventListener('mouseup', seekEnd);
window.addEventListener('touchmove', seekMove, {passive:false});
window.addEventListener('touchend', seekEnd);

async function prevTrack(){ const list = await getAll('tracks'); if (!list.length) return; let i = list.findIndex(t => t.id === currentTrackId); i = (i - 1 + list.length) % list.length; playTrack(list[i].id); }
async function nextTrack(){ const list = await getAll('tracks'); if (!list.length) return; let i = list.findIndex(t => t.id === currentTrackId); i = (i + 1) % list.length; playTrack(list[i].id); }

/* ---------- Web Audio: demo tone + metronome ---------- */
let actx;
function audioCtx(){ if (!actx) actx = new (window.AudioContext || window.webkitAudioContext)(); if (actx.state === 'suspended') actx.resume(); return actx; }
let metroOn = false, metroTimer = null, bpm = 72;
function toggleMetro(){
  metroOn = !metroOn; const b = document.getElementById('metroBtn');
  if (!b) return;
  if (metroOn){ b.classList.add('on'); b.querySelector('path').setAttribute('stroke', '#fff'); startMetro(); }
  else { b.classList.remove('on'); b.querySelector('path').setAttribute('stroke', '#4E7C59'); stopMetro(); }
}
function startMetro(){
  const ctx = audioCtx(); let next = ctx.currentTime + 0.05;
  const beat = () => { const o = ctx.createOscillator(), g = ctx.createGain(); o.frequency.value = 1000; g.gain.setValueAtTime(0.0001, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.6, ctx.currentTime + 0.001); g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.05); o.connect(g).connect(ctx.destination); o.start(); o.stop(ctx.currentTime + 0.06); };
  const tick = () => { while (next < ctx.currentTime + 0.1){ beat(); next += 60 / bpm; } metroTimer = setTimeout(tick, 25); };
  tick();
}
function stopMetro(){ if (metroTimer) clearTimeout(metroTimer); metroTimer = null; }
let demoOn = false, demoTimer = null;
const PENTA = [523.25, 587.33, 659.25, 783.99, 880.00];
function toggleDemo(){
  demoOn = !demoOn; const b = document.getElementById('demoBtn'); if (!b) return;
  if (demoOn){ b.classList.add('on'); b.querySelector('path').setAttribute('stroke', '#fff'); startDemo(); }
  else { b.classList.remove('on'); b.querySelector('path').setAttribute('stroke', '#4E7C59'); stopDemo(); }
}
function startDemo(){
  const ctx = audioCtx(); let i = 0;
  const step = () => { const o = ctx.createOscillator(), g = ctx.createGain(); o.type = 'sine'; o.frequency.value = PENTA[i % PENTA.length]; g.gain.setValueAtTime(0.0001, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + 0.05); g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.9); o.connect(g).connect(ctx.destination); o.start(); o.stop(ctx.currentTime + 1.0); i++; demoTimer = setTimeout(step, 600); };
  step();
}
function stopDemo(){ if (demoTimer) clearTimeout(demoTimer); demoTimer = null; }

/* ---------- modals ---------- */
function openModal(id){ document.getElementById(id).classList.add('active'); }
function closeModal(id){ document.getElementById(id).classList.remove('active'); }
['scoreModal','trackModal'].forEach(id => {
  const el = document.getElementById(id);
  el.addEventListener('click', e => { if (e.target === el) closeModal(id); });
});

/* score modal */
let pendingScoreFiles = [];
const sfFiles = document.getElementById('sf-files'), sfDrop = document.getElementById('sf-drop');
sfDrop.onclick = () => sfFiles.click();
sfFiles.onchange = () => addScoreFiles(sfFiles.files);
function addScoreFiles(fileList){
  [...fileList].forEach(f => {
    const kind = f.type.startsWith('image/') ? 'image' : (f.type === 'application/pdf' ? 'pdf' : 'other');
    if (kind === 'other'){ toast('仅支持图片或 PDF'); return; }
    pendingScoreFiles.push({ file: f, kind });
  });
  renderScoreFileList(); sfFiles.value = '';
}
function renderScoreFileList(){
  document.getElementById('sf-filelist').innerHTML = pendingScoreFiles.map((f, i) =>
    '<div class="file-item"><svg class="fi-ic" viewBox="0 0 24 24" fill="none">' +
    (f.kind === 'pdf' ? '<rect x="4" y="3" width="16" height="18" rx="2" stroke="#BC4B3C" stroke-width="2"/><path d="M8 8h8M8 12h8M8 16h5" stroke="#BC4B3C" stroke-width="2" stroke-linecap="round"/>' : '<rect x="4" y="4" width="16" height="16" rx="2" stroke="#4E7C59" stroke-width="2"/><circle cx="9" cy="9" r="2" fill="#4E7C59"/><path d="M14 20l-3-3 3-3 3 3-3 3z" fill="#4E7C59"/>') +
    '</svg><div class="fi-name">' + esc(f.file.name) + '</div><div class="fi-x" onclick="removeScoreFile(' + i + ')"><svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="#4E7C59" stroke-width="2.4" stroke-linecap="round"/></svg></div></div>'
  ).join('');
}
function removeScoreFile(i){ pendingScoreFiles.splice(i, 1); renderScoreFileList(); }
async function saveScore(){
  const title = document.getElementById('sf-title').value.trim();
  if (!title){ toast('请填写标题'); return; }
  const files = [];
  for (const pf of pendingScoreFiles){
    const data = await pf.file.arrayBuffer().then(b => new Blob([b], { type: pf.file.type }));
    files.push({ name: pf.file.name, type: pf.file.type, kind: pf.kind, data });
  }
  const firstImg = files.find(f => f.kind === 'image');
  const rec = {
    title,
    instrument: document.getElementById('sf-inst').value,
    level: document.getElementById('sf-level').value,
    tuning: document.getElementById('sf-tuning').value.trim(),
    composer: document.getElementById('sf-composer').value.trim(),
    note: document.getElementById('sf-note').value.trim(),
    cover: firstImg ? firstImg.data : null,
    files, createdAt: Date.now()
  };
  await put('scores', rec);
  pendingScoreFiles = []; document.getElementById('sf-filelist').innerHTML = '';
  ['sf-title','sf-tuning','sf-composer','sf-note'].forEach(id => document.getElementById(id).value = '');
  closeModal('scoreModal'); toast('已保存到本地'); refreshScores();
}
let pendingDelete = null;
function confirmDelete(type, id, name){
  pendingDelete = { type, id };
  document.getElementById('confirmTitle').textContent = '确认删除' + (type === 'score' ? '谱子' : '伴奏');
  document.getElementById('confirmMsg').textContent = '确定要删除《' + esc(name) + '》吗？此操作不可恢复。';
  document.getElementById('confirmOk').onclick = () => { closeModal('confirmModal'); doPendingDelete(); };
  openModal('confirmModal');
}
async function doPendingDelete(){
  if (!pendingDelete) return;
  const { type, id } = pendingDelete; pendingDelete = null;
  if (type === 'score'){ await del('scores', id); toast('已删除'); refreshScores(); }
  else { await del('tracks', id); if (currentTrackId === id) currentTrackId = null; refreshTracks(); }
}
function deleteScore(id, title){ confirmDelete('score', id, title || '该谱子'); }

/* track modal */
let pendingTrackFile = null;
const tfFile = document.getElementById('tf-file'), tfDrop = document.getElementById('tf-drop');
tfDrop.onclick = () => tfFile.click();
tfFile.onchange = () => {
  const f = tfFile.files[0]; if (!f) return;
  if (!f.type.startsWith('audio/')){ toast('请选择音频文件'); return; }
  pendingTrackFile = f;
  document.getElementById('tf-filelist').innerHTML = '<div class="file-item"><svg class="fi-ic" viewBox="0 0 24 24" fill="none"><path d="M3 12h2.5l2-6 3 14 3-18 2.5 10H21" stroke="#4E7C59" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><div class="fi-name">' + esc(f.name) + '</div></div>';
};
async function saveTrack(){
  if (!pendingTrackFile){ toast('请选择音频文件'); return; }
  const data = await pendingTrackFile.arrayBuffer().then(b => new Blob([b], { type: pendingTrackFile.type }));
  const scoreSel = document.getElementById('tf-score');
  const scoreId = scoreSel && scoreSel.value ? parseInt(scoreSel.value) : null;
  const rec = {
    title: pendingTrackFile.name.replace(/\.[^.]+$/, ''),
    instrument: document.getElementById('tf-inst').value,
    tuning: document.getElementById('tf-tuning').value.trim(),
    scoreId: scoreId || null,
    audio: data, createdAt: Date.now()
  };
  await put('tracks', rec);
  pendingTrackFile = null; document.getElementById('tf-filelist').innerHTML = '';
  if (scoreSel) scoreSel.value = '';
  closeModal('trackModal'); toast('伴奏已保存'); refreshTracks();
}
function deleteTrack(id, title){ confirmDelete('track', id, title || '该伴奏'); }

/* filter chips */
document.getElementById('scoreChips').addEventListener('click', e => {
  const chip = e.target.closest('.chip'); if (!chip) return;
  document.querySelectorAll('#scoreChips .chip').forEach(c => { c.classList.remove('active'); c.classList.add('plain'); });
  chip.classList.add('active'); chip.classList.remove('plain');
  state.scoreFilter = chip.dataset.filter; renderScores();
});

/* shortcuts used in inline handlers */
function openAddScore(){ openModal('scoreModal'); }
async function openAddTrack(){
  const scores = await getAll('scores');
  const sel = document.getElementById('tf-score');
  if (sel){
    sel.innerHTML = '<option value="">不关联谱子</option>' +
      scores.map(s => '<option value="' + s.id + '">' + esc(s.title) + '</option>').join('');
  }
  openModal('trackModal');
}

/* ---------- play linked accompaniment from score detail ---------- */
async function toggleScoreTrack(scoreId){
  const tracks = await getAll('tracks');
  const linked = tracks.filter(t => t.scoreId == scoreId);
  if (!linked.length){ toast('该谱子暂无伴奏，请去「伴奏」页上传'); goTab('acc'); return; }
  const t = linked[0];
  if (currentTrackId === t.id && audioEl && !audioEl.paused){
    audioEl.pause();
    setAccPlayIcon(false);
    updateScoreTrackIcon(scoreId, false);
    return;
  }
  currentTrackId = t.id;
  if (!audioEl) audioEl = new Audio();
  if (audioEl._url) URL.revokeObjectURL(audioEl._url);
  const u = blobURL(t.audio); audioEl._url = u; audioEl.src = u; audioEl.loop = false; audioEl.load();
  audioEl.onended = () => { setAccPlayIcon(false); updateScoreTrackIcon(scoreId, false); };
  audioEl.play().catch(() => toast('无法播放该音频'));
  setAccPlayIcon(true);
  updateScoreTrackIcon(scoreId, true);
  toast('正在播放：' + t.title);
}
function updateScoreTrackIcon(scoreId, playing){
  const btn = document.getElementById('accBtn'); if (!btn) return;
  btn.innerHTML = playing
    ? '<svg width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="#4E7C59"/><rect x="15" y="13" width="4" height="14" rx="1" fill="#fff"/><rect x="22" y="13" width="4" height="14" rx="1" fill="#fff"/></svg>'
    : '<svg width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="rgba(78,124,89,0.15)"/><path d="M16 13l10 7-10 7z" fill="#4E7C59"/></svg>';
  btn.classList.toggle('on', playing);
}

/* ---------- score search ---------- */
function toggleScoreSearch(){
  const h = document.getElementById('scoresHeader');
  const box = document.getElementById('scoreSearchBox');
  const searching = h.classList.toggle('searching');
  if (searching){
    setTimeout(() => document.getElementById('scoreSearchInput').focus(), 50);
  } else {
    document.getElementById('scoreSearchInput').value = '';
    state.scoreSearch = '';
    renderScores();
  }
}
function clearScoreSearch(){
  const input = document.getElementById('scoreSearchInput');
  input.value = '';
  state.scoreSearch = '';
  input.focus();
  renderScores();
}
function setScoreSearch(v){
  state.scoreSearch = v.trim();
  renderScores();
}
const scoreSearchInput = document.getElementById('scoreSearchInput');
if (scoreSearchInput){
  scoreSearchInput.addEventListener('input', e => setScoreSearch(e.target.value));
  scoreSearchInput.addEventListener('keydown', e => { if (e.key === 'Enter') scoreSearchInput.blur(); });
}

/* ---------- init ---------- */
window.addEventListener('DOMContentLoaded', () => {
  refreshScores(); renderTracks(); goTab('home');
});
if ('serviceWorker' in navigator){
  window.addEventListener('load', () => { navigator.serviceWorker.register('sw.js').catch(() => {}); });
}
