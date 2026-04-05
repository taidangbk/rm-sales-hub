// ========== PAGE NAVIGATION ==========
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('page-' + id).classList.add('active');
  document.querySelector(`[data-page="${id}"]`).classList.add('active');
  window.scrollTo(0, 0);
}

// ========== ACCORDION ==========
function toggleAcc(header) {
  const acc = header.parentElement;
  const wasOpen = acc.classList.contains('open');
  // close all in same page
  acc.parentElement.querySelectorAll('.accordion').forEach(a => a.classList.remove('open'));
  if (!wasOpen) acc.classList.add('open');
}

function openAccordion(id) {
  setTimeout(() => {
    const el = document.getElementById(id);
    if (el) {
      el.classList.add('open');
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 100);
}

// ========== OBJECTION TOGGLE ==========
function toggleObj(el) {
  el.classList.toggle('open');
}

// ========== SCRIPT CARD TOGGLE ==========
function toggleScript(el) {
  el.classList.toggle('open');
}

// ========== ZALO TABS ==========
function showZaloTab(pill, tabId) {
  pill.parentElement.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
  pill.classList.add('active');
  const body = pill.closest('.acc-body');
  body.querySelectorAll('.zalo-tab').forEach(t => t.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');
}

// ========== COPY FUNCTIONS ==========
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg || 'Đã copy! ✅';
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 1800);
}

function copyText(btn) {
  const box = btn.previousElementSibling;
  const text = box.innerText;
  navigator.clipboard.writeText(text).then(() => {
    btn.textContent = '✅ Đã copy!';
    btn.classList.add('copied');
    showToast();
    setTimeout(() => { btn.textContent = '📋 Copy kịch bản'; btn.classList.remove('copied'); }, 2000);
  });
}

function copyMsg(btn) {
  const box = btn.previousElementSibling;
  const text = box.innerText;
  navigator.clipboard.writeText(text).then(() => {
    btn.textContent = '✅ Đã copy!';
    btn.classList.add('copied');
    showToast();
    setTimeout(() => { btn.textContent = '📋 Copy'; btn.classList.remove('copied'); }, 2000);
  });
}

// ========== DAILY STATS (localStorage) ==========
const today = new Date().toDateString();
let stats = JSON.parse(localStorage.getItem('rm_stats') || '{}');
if (stats.date !== today) {
  stats = { date: today, calls: 0, meets: 0, files: 0, refs: 0 };
  localStorage.setItem('rm_stats', JSON.stringify(stats));
}

function renderStats() {
  document.getElementById('stat-calls').textContent = stats.calls;
  document.getElementById('stat-meets').textContent = stats.meets;
  document.getElementById('stat-files').textContent = stats.files;
  document.getElementById('stat-refs').textContent = stats.refs;
}

function incrementStat(key) {
  stats[key]++;
  localStorage.setItem('rm_stats', JSON.stringify(stats));
  renderStats();
  const el = document.getElementById('stat-' + key);
  el.style.transform = 'scale(1.3)';
  setTimeout(() => el.style.transform = 'scale(1)', 200);
}

renderStats();

// ========== CLOCK ==========
function updateClock() {
  const now = new Date();
  const h = now.getHours().toString().padStart(2, '0');
  const m = now.getMinutes().toString().padStart(2, '0');
  document.getElementById('clock').textContent = h + ':' + m;
}
updateClock();
setInterval(updateClock, 30000);

// ========== GREETING ==========
function setGreeting() {
  const h = new Date().getHours();
  let g = '🌅 Chào buổi sáng!';
  if (h >= 12 && h < 18) g = '☀️ Chào buổi chiều!';
  else if (h >= 18) g = '🌙 Chào buổi tối!';

  const weekday = ['Chủ nhật','Thứ Hai','Thứ Ba','Thứ Tư','Thứ Năm','Thứ Sáu','Thứ Bảy'][new Date().getDay()];
  const d = new Date().getDate();
  const mo = new Date().getMonth() + 1;

  document.getElementById('greeting').innerHTML = g + '<br><span style="font-size:13px;color:var(--dim)">' + weekday + ', ' + d + '/' + mo + ' — Hôm nay sẽ là ngày tuyệt vời! 💪</span>';
}
setGreeting();

// ========== DAILY CHECKLIST ==========
function renderChecklist() {
  const h = new Date().getHours();
  const day = new Date().getDay(); // 0=CN, 1=T2...
  const items = [
    { id: 'c1', text: '08:00 – Review pipeline + lên danh sách gọi', done: h >= 8 },
    { id: 'c2', text: '08:15 – Power Hour: gọi 15-20 cuộc', done: h >= 10 },
    { id: 'c3', text: '10:00 – Gặp khách / tư vấn', done: h >= 12 },
    { id: 'c4', text: '13:30 – 30 phút chăm sóc KH cũ (3-5 tin Zalo + 2 cuộc gọi)', done: h >= 14 },
    { id: 'c5', text: '14:00 – Field visit (2-3 cuộc hẹn)', done: h >= 17 },
    { id: 'c6', text: '17:00 – Báo cáo ngày gửi Zalo nhóm', done: false },
  ];

  // weekly special
  if (day === 1) items.unshift({ id: 'cw', text: '⭐ Thứ 2: Đặt target tuần + họp team', done: false });
  if (day === 3) items.push({ id: 'cw', text: '⭐ Thứ 4: Mid-week check KPI', done: false });
  if (day === 5) items.push({ id: 'cw', text: '⭐ Thứ 6: Tổng kết tuần + báo cáo Leader', done: false });

  const saved = JSON.parse(localStorage.getItem('rm_checklist_' + today) || '{}');

  const html = items.map(item => {
    const checked = saved[item.id] || false;
    return `<label>
      <input type="checkbox" ${checked ? 'checked' : ''} onchange="toggleCheck('${item.id}', this.checked)">
      <span class="${checked ? 'done' : ''}">${item.text}</span>
    </label>`;
  }).join('');

  document.getElementById('checklist').innerHTML = html;
}

function toggleCheck(id, checked) {
  const saved = JSON.parse(localStorage.getItem('rm_checklist_' + today) || '{}');
  saved[id] = checked;
  localStorage.setItem('rm_checklist_' + today, JSON.stringify(saved));
  renderChecklist();
}

renderChecklist();

// ========== AI TOOLS ==========
const prompts = {
  meet: (input) => `Tôi là RM tín dụng VIB. Hôm nay tôi có cuộc hẹn:
${input}

Tạo giúp tôi:
1. 3 câu hỏi SPIN phù hợp
2. 2 selling point mạnh nhất
3. Cách xử lý từ chối có thể gặp
Ngắn gọn, dưới 200 từ.`,

  obj: (input) => `Khách hàng từ chối: "${input}"

Tôi là RM tín dụng VIB. Phân tích:
1. Đây là từ chối thật hay trì hoãn?
2. Viết 3 cách phản hồi (soft → strong)
3. Câu chốt sau khi xử lý
Ngắn gọn, thực tế.`,

  retain: (input) => `Tôi là RM tín dụng VIB. Khách muốn tất toán:
${input}

Tạo kịch bản giữ chân theo SAVE:
1. Câu hỏi khám phá (bán để làm gì? mua lại không? người mua ai?)
2. Phương án thay thế tất toán
3. Cross-sell nếu không giữ được
4. Cách xin referral người mua
Ngắn gọn, copy-paste vào Zalo được.`,

  kpi: (input) => `Tôi là RM tín dụng VIB. Số liệu tháng này:
${input}

Phân tích:
1. Đang đi đúng hướng hay lệch?
2. Bước nào trong pipeline đang yếu?
3. Top 3 hành động cải thiện ngay
4. Target tuần tới cụ thể
Ngắn gọn, actionable.`
};

function openAI(type) {
  const input = document.getElementById('ai-' + type).value.trim();
  if (!input) {
    showToast('⚠️ Nhập thông tin trước!');
    return;
  }
  const prompt = prompts[type](input);
  navigator.clipboard.writeText(prompt).then(() => {
    showToast('Đã copy prompt! Mở Claude.ai →');
    setTimeout(() => {
      window.open('https://claude.ai/new', '_blank');
    }, 800);
  });
}

// ========== SERVICE WORKER ==========
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
