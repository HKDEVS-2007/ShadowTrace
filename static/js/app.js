/* ===================== SHADOWTRACE FRONTEND ===================== */

const state = {
  page: 1,
  perPage: 50,
  logSearch: '',
  logSeverity: 'All',
  threatSearch: '',
  threatSeverity: 'All',
  charts: {}
};

/* ===================== UTILITIES ===================== */
const $ = (id) => document.getElementById(id);

function toast(type, title, msg) {
  const stack = $('toastStack');
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  const icon = type === 'success' ? 'check-circle-2' : type === 'error' ? 'alert-octagon' : 'info';
  el.innerHTML = `
    <i data-lucide="${icon}" class="toast-icon"></i>
    <div class="toast-body">
      <div class="toast-title">${title}</div>
      <div class="toast-msg">${msg}</div>
    </div>`;
  stack.appendChild(el);
  lucide.createIcons();
  setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 350); }, 4200);
}

function setLoader(active) {
  $('loaderOverlay').classList.toggle('active', active);
}

function setPipeline(step, note) {
  document.querySelectorAll('.pipe-step').forEach((el) => {
    const s = parseInt(el.dataset.step, 10);
    el.classList.toggle('done', s < step);
    el.classList.toggle('active', s === step);
  });
  if (note) $('pipelineNote').textContent = note;
}

function resetPipeline() {
  document.querySelectorAll('.pipe-step').forEach((el) => el.classList.remove('active', 'done'));
  $('pipelineNote').textContent = 'Awaiting input…';
}

function countUp(el, target) {
  const start = parseInt(el.textContent.replace(/\D/g, ''), 10) || 0;
  const duration = 700;
  const startTime = performance.now();
  function tick(now) {
    const t = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.round(start + (target - start) * eased).toLocaleString();
    if (t < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

/* ===================== NAVIGATION ===================== */
const viewMeta = {
  dashboard: { title: 'Security Overview', crumb: 'Dashboard' },
  analyzer: { title: 'Log Analyzer', crumb: 'Log Analyzer' },
  threats: { title: 'Threat Detection', crumb: 'Threat Detection' },
  settings: { title: 'Settings', crumb: 'Settings' }
};

function switchView(view) {
  document.querySelectorAll('.nav-item').forEach((el) =>
    el.classList.toggle('active', el.dataset.view === view));
  document.querySelectorAll('.view').forEach((el) =>
    el.classList.toggle('active', el.id === `view-${view}`));

  const meta = viewMeta[view] || viewMeta.dashboard;
  $('pageTitle').textContent = meta.title;
  $('crumbCurrent').textContent = meta.crumb;

  if (view === 'dashboard') loadStats();
  if (view === 'analyzer') loadLogs();
  if (view === 'threats') loadThreats();
}

document.querySelectorAll('.nav-item').forEach((el) => {
  el.addEventListener('click', () => switchView(el.dataset.view));
  el.addEventListener('mousemove', (e) => {
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
  });
});

/* ===================== API ===================== */
const api = {
  async stats() {
    const r = await fetch('/api/stats');
    return r.json();
  },
  async logs() {
    const p = new URLSearchParams({
      search: state.logSearch,
      severity: state.logSeverity,
      page: state.page,
      per_page: state.perPage
    });
    const r = await fetch(`/api/logs?${p}`);
    return r.json();
  },
  async detections() {
    const p = new URLSearchParams({
      search: state.threatSearch,
      severity: state.threatSeverity
    });
    const r = await fetch(`/api/detections?${p}`);
    return r.json();
  },
  async upload(file) {
    const fd = new FormData();
    fd.append('file', file);
    const r = await fetch('/api/upload', { method: 'POST', body: fd });
    const data = await r.json();
    if (!r.ok) throw new Error(data.error || 'Upload failed.');
    return data;
  },
  async loadSample() {
    const r = await fetch('/api/load-sample', { method: 'POST' });
    const data = await r.json();
    if (!r.ok) throw new Error(data.error || 'Failed to load sample.');
    return data;
  }
};

/* ===================== DASHBOARD ===================== */
const chartDefaults = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: '#c3cbe4',
        font: { family: 'Inter', size: 12, weight: '500' },
        boxWidth: 10, boxHeight: 10, usePointStyle: true, pointStyle: 'circle', padding: 16
      }
    },
    tooltip: {
      backgroundColor: 'rgba(10,15,30,0.95)',
      titleColor: '#f1f5ff',
      bodyColor: '#c3cbe4',
      borderColor: 'rgba(34,211,238,0.3)',
      borderWidth: 1,
      padding: 12,
      cornerRadius: 10,
      titleFont: { family: 'Inter', size: 12, weight: '600' },
      bodyFont: { family: 'JetBrains Mono', size: 11 }
    }
  }
};

function gradient(ctx, c1, c2) {
  const g = ctx.createLinearGradient(0, 0, 0, 240);
  g.addColorStop(0, c1);
  g.addColorStop(1, c2);
  return g;
}

function renderNormalChart(data) {
  const ctx = $('chartNormalVsSuspicious').getContext('2d');
  if (state.charts.normal) state.charts.normal.destroy();
  state.charts.normal = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Normal', 'Suspicious'],
      datasets: [{
        data: [data.Normal, data.Suspicious],
        backgroundColor: [
          gradient(ctx, 'rgba(34,211,238,0.95)', 'rgba(139,92,246,0.75)'),
          gradient(ctx, 'rgba(244,63,94,0.95)', 'rgba(245,158,11,0.85)')
        ],
        borderColor: 'rgba(10,15,30,1)',
        borderWidth: 3,
        hoverOffset: 8,
        hoverBorderColor: '#22d3ee'
      }]
    },
    options: {
      ...chartDefaults,
      cutout: '68%',
      plugins: {
        ...chartDefaults.plugins,
        legend: { ...chartDefaults.plugins.legend, position: 'bottom' }
      }
    }
  });
}

function renderSeverityChart(data) {
  const ctx = $('chartSeverity').getContext('2d');
  if (state.charts.severity) state.charts.severity.destroy();
  const labels = ['Critical', 'High', 'Medium', 'Low'];
  const colors = [
    gradient(ctx, 'rgba(244,63,94,0.9)', 'rgba(244,63,94,0.15)'),
    gradient(ctx, 'rgba(245,158,11,0.9)', 'rgba(245,158,11,0.15)'),
    gradient(ctx, 'rgba(59,130,246,0.9)', 'rgba(59,130,246,0.15)'),
    gradient(ctx, 'rgba(16,185,129,0.9)', 'rgba(16,185,129,0.15)')
  ];
  state.charts.severity = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Events',
        data: labels.map((l) => data[l] || 0),
        backgroundColor: colors,
        borderColor: ['#f43f5e', '#f59e0b', '#3b82f6', '#10b981'],
        borderWidth: 1.5,
        borderRadius: 8,
        borderSkipped: false,
        barThickness: 36
      }]
    },
    options: {
      ...chartDefaults,
      plugins: { ...chartDefaults.plugins, legend: { display: false } },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: '#7f8aab', font: { family: 'Inter', size: 11, weight: '500' } }
        },
        y: {
          grid: { color: 'rgba(120,145,200,0.08)', drawBorder: false },
          ticks: { color: '#7f8aab', font: { family: 'JetBrains Mono', size: 11 }, precision: 0 }
        }
      }
    }
  });
}

function renderTimelineChart(data) {
  const ctx = $('chartTimeline').getContext('2d');
  if (state.charts.timeline) state.charts.timeline.destroy();
  const entries = Object.entries(data || {});
  const labels = entries.map(([k]) => k.replace('T', ' ').slice(5));
  const values = entries.map(([, v]) => v);
  if (!labels.length) {
    state.charts.timeline = new Chart(ctx, {
      type: 'line',
      data: { labels: ['—'], datasets: [{ data: [0], borderColor: 'rgba(34,211,238,0.3)', borderWidth: 2 }] },
      options: { ...chartDefaults, plugins: { ...chartDefaults.plugins, legend: { display: false } } }
    });
    return;
  }
  const g = ctx.createLinearGradient(0, 0, 0, 260);
  g.addColorStop(0, 'rgba(34,211,238,0.45)');
  g.addColorStop(1, 'rgba(34,211,238,0)');

  state.charts.timeline = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Events',
        data: values,
        borderColor: '#22d3ee',
        backgroundColor: g,
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#0a0f1e',
        pointBorderColor: '#22d3ee',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 7,
        pointHoverBackgroundColor: '#22d3ee',
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 2
      }]
    },
    options: {
      ...chartDefaults,
      plugins: { ...chartDefaults.plugins, legend: { display: false } },
      interaction: { intersect: false, mode: 'index' },
      scales: {
        x: {
          grid: { color: 'rgba(120,145,200,0.06)', drawBorder: false },
          ticks: { color: '#7f8aab', font: { family: 'JetBrains Mono', size: 10 }, maxRotation: 0, autoSkipPadding: 24 }
        },
        y: {
          grid: { color: 'rgba(120,145,200,0.08)', drawBorder: false },
          ticks: { color: '#7f8aab', font: { family: 'JetBrains Mono', size: 11 }, precision: 0 },
          beginAtZero: true
        }
      }
    }
  });
}

function sevBadge(sev) {
  const safe = ['Critical', 'High', 'Medium', 'Low', 'Informational'].includes(sev) ? sev : 'Low';
  return `<span class="sev ${safe}">${safe}</span>`;
}

async function loadStats() {
  try {
    const s = await api.stats();
    countUp($('kpiTotal'), s.total_events || 0);
    countUp($('kpiSuspicious'), s.suspicious_events || 0);
    countUp($('kpiCritical'), s.critical_alerts || 0);
    $('kpiStatus').textContent = s.last_status || 'Idle';
    $('kpiFilename').textContent = s.filename || 'No dataset loaded';
    $('lastRunLabel').textContent = s.filename ? `Last run · ${s.filename}` : 'No analysis yet';
    $('engineStatus').textContent = s.total_events > 0 ? 'Engine Ready' : 'Engine Idle';

    renderNormalChart(s.normal_vs_suspicious || { Normal: 0, Suspicious: 0 });
    renderSeverityChart(s.severity_breakdown || {});
    renderTimelineChart(s.events_over_time || {});

    const tbody = $('recentBody');
    const rows = s.recent_activity || [];
    if (!rows.length) {
      tbody.innerHTML = `<tr class="empty-row"><td colspan="5">No events analyzed yet.</td></tr>`;
    } else {
      tbody.innerHTML = rows.map((r) => `
        <tr>
          <td class="mono">${r.timestamp || '—'}</td>
          <td class="mono">${r.source_ip || '—'}</td>
          <td>${r.event_type || '—'}</td>
          <td>${sevBadge(r.severity)}</td>
          <td style="color:var(--txt-2);font-size:12px;">${r.detection_reason || '—'}</td>
        </tr>`).join('');
    }
    lucide.createIcons();
  } catch (e) {
    console.error(e);
  }
}

/* ===================== LOG ANALYZER ===================== */
async function loadLogs() {
  try {
    const data = await api.logs();
    const tbody = $('logsBody');
    const rows = data.logs || [];
    $('logCountLabel').textContent = `${data.total || 0} records`;

    if (!rows.length) {
      tbody.innerHTML = `<tr class="empty-row"><td colspan="7">No events yet. Upload a CSV or load the sample dataset.</td></tr>`;
    } else {
      tbody.innerHTML = rows.map((r) => `
        <tr>
          <td class="mono">${r.timestamp || '—'}</td>
          <td class="mono">${r.source_ip || '—'}</td>
          <td>${r.username || '—'}</td>
          <td>${r.event_type || '—'}</td>
          <td>${r.status || '—'}</td>
          <td>${sevBadge(r.severity)}</td>
          <td style="color:var(--txt-2);font-size:12px;max-width:280px;">${r.detection_reason || '—'}</td>
        </tr>`).join('');
    }

    const totalPages = Math.max(1, Math.ceil((data.total || 0) / state.perPage));
    $('pageInfo').textContent = `Page ${state.page} of ${totalPages}`;
    $('prevPage').disabled = state.page <= 1;
    $('nextPage').disabled = state.page >= totalPages;
  } catch (e) {
    console.error(e);
  }
}

function bindAnalyzerFilters() {
  let t1, t2;
  $('logSearch').addEventListener('input', (e) => {
    clearTimeout(t1);
    t1 = setTimeout(() => { state.logSearch = e.target.value.trim(); state.page = 1; loadLogs(); }, 280);
  });
  $('logSeverity').addEventListener('change', (e) => {
    state.logSeverity = e.target.value; state.page = 1; loadLogs();
  });
  $('prevPage').addEventListener('click', () => { if (state.page > 1) { state.page--; loadLogs(); } });
  $('nextPage').addEventListener('click', () => { state.page++; loadLogs(); });
}

/* ===================== UPLOAD & SAMPLE ===================== */
async function runUpload(file) {
  setLoader(true);
  resetPipeline();
  setPipeline(1, 'Receiving file…');
  try {
    const res = await api.upload(file);
    setPipeline(2, 'Validating records…');
    await new Promise((r) => setTimeout(r, 250));
    setPipeline(3, 'Applying detection rules…');
    await new Promise((r) => setTimeout(r, 250));
    setPipeline(4, 'Saving results…');
    await new Promise((r) => setTimeout(r, 200));

    showRunStats(res.stats);
    toast('success', 'Analysis Complete', `Processed ${res.stats.valid} valid records · ${res.stats.suspicious} suspicious events flagged.`);
    await loadStats();
    await loadLogs();
    await loadThreats();
    setPipeline(5, 'Done.');
    switchView('analyzer');
  } catch (e) {
    toast('error', 'Upload Failed', e.message || 'Unable to process file.');
    setPipeline(0, 'Failed.');
  } finally {
    setLoader(false);
  }
}

async function runSample() {
  setLoader(true);
  resetPipeline();
  setPipeline(1, 'Loading sample dataset…');
  try {
    const res = await api.loadSample();
    setPipeline(2, 'Validating records…');
    await new Promise((r) => setTimeout(r, 200));
    setPipeline(3, 'Applying detection rules…');
    await new Promise((r) => setTimeout(r, 200));
    setPipeline(4, 'Saving results…');
    await new Promise((r) => setTimeout(r, 200));
    showRunStats(res.stats);
    toast('success', 'Sample Loaded', `${res.stats.suspicious} suspicious events detected from ${res.stats.valid} records.`);
    await loadStats();
    await loadLogs();
    await loadThreats();
    setPipeline(5, 'Done.');
    switchView('analyzer');
  } catch (e) {
    toast('error', 'Sample Load Failed', e.message || 'Unable to load sample.');
  } finally {
    setLoader(false);
  }
}

function showRunStats(s) {
  $('runStats').style.display = 'grid';
  $('rsTotal').textContent = s.total || 0;
  $('rsValid').textContent = s.valid || 0;
  $('rsInvalid').textContent = s.invalid || 0;
  $('rsSuspicious').textContent = s.suspicious || 0;
}

function bindUploader() {
  const dz = $('dropzone');
  const input = $('fileInput');

  dz.addEventListener('click', () => input.click());
  input.addEventListener('change', (e) => {
    if (e.target.files[0]) runUpload(e.target.files[0]);
    input.value = '';
  });

  ['dragenter', 'dragover'].forEach((ev) =>
    dz.addEventListener(ev, (e) => { e.preventDefault(); dz.classList.add('dragover'); }));
  ['dragleave', 'drop'].forEach((ev) =>
    dz.addEventListener(ev, (e) => { e.preventDefault(); dz.classList.remove('dragover'); }));
  dz.addEventListener('drop', (e) => {
    const f = e.dataTransfer.files[0];
    if (f) runUpload(f);
  });

  $('loadSampleBtn').addEventListener('click', runSample);
  $('downloadTemplate').addEventListener('click', () => {
    window.location.href = '/api/download-template';
  });
}

/* ===================== THREATS ===================== */
async function loadThreats() {
  try {
    const data = await api.detections();
    const tbody = $('threatsBody');
    const rows = data.detections || [];
    $('threatCountLabel').textContent = `${rows.length} findings`;
    $('navThreatBadge').textContent = rows.length;
    $('navThreatBadge').dataset.zero = rows.length === 0;

    if (!rows.length) {
      tbody.innerHTML = `<tr class="empty-row"><td colspan="7">No threats detected yet.</td></tr>`;
    } else {
      tbody.innerHTML = rows.map((r) => `
        <tr>
          <td class="mono">#${r.id}</td>
          <td class="mono">${r.timestamp || '—'}</td>
          <td class="mono">${r.source_ip || '—'}</td>
          <td style="color:var(--txt-0);font-weight:500;">${r.rule_triggered || '—'}</td>
          <td>${sevBadge(r.severity)}</td>
          <td style="color:var(--txt-2);font-size:12px;max-width:320px;">${r.evidence || '—'}</td>
          <td><span class="sev Informational" style="color:#a78bfa;">${r.status || 'Active'}</span></td>
        </tr>`).join('');
    }
  } catch (e) {
    console.error(e);
  }
}

function bindThreatFilters() {
  let t;
  $('threatSearch').addEventListener('input', (e) => {
    clearTimeout(t);
    t = setTimeout(() => { state.threatSearch = e.target.value.trim(); loadThreats(); }, 280);
  });
  $('threatSeverity').addEventListener('change', (e) => {
    state.threatSeverity = e.target.value; loadThreats();
  });
}

/* ===================== QUICK ACTIONS ===================== */
function bindQuickActions() {
  $('qaUpload').addEventListener('click', () => { switchView('analyzer'); setTimeout(() => $('fileInput').click(), 300); });
  $('qaSample').addEventListener('click', runSample);
  $('qaThreats').addEventListener('click', () => switchView('threats'));
  $('refreshBtn').addEventListener('click', () => {
    loadStats(); loadLogs(); loadThreats();
    toast('info', 'Refreshed', 'Dashboard data reloaded.');
  });
}

/* ===================== 3D TILT ===================== */
function bindTilt() {
  document.querySelectorAll('.tilt').forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(900px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-4px) scale(1.01)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });
}

/* ===================== LANDING INTRO ===================== */
function initLandingIntro() {
  const overlay = $('landingIntroOverlay');
  const video = $('landingVideo');
  const enterBtn = $('landingEnterBtn');
  const skipBtn = $('landingSkipBtn');
  const replayBtn = $('replayIntroBtn');

  function dismissIntro() {
    if (!overlay.classList.contains('fade-out')) {
      overlay.classList.add('fade-out');
      if (video) video.pause();
    }
  }

  function showIntro() {
    overlay.classList.remove('fade-out');
    if (video) {
      video.currentTime = 0;
      video.play().catch(() => {});
    }
  }

  if (enterBtn) enterBtn.addEventListener('click', dismissIntro);
  if (skipBtn) skipBtn.addEventListener('click', dismissIntro);
  if (video) {
    video.addEventListener('ended', dismissIntro);
    video.play().catch(() => {});
  }
  if (replayBtn) {
    replayBtn.addEventListener('click', () => {
      showIntro();
      toast('info', 'Intro Replayed', 'Playing landing video and team animation.');
    });
  }
}

/* ===================== CYBER CANVAS PARTICLE NETWORK ===================== */
function initCyberCanvas() {
  const canvas = $('cyberCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const count = Math.min(width > 1000 ? 75 : 40, 100);

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.9,
      vy: (Math.random() - 0.5) * 0.9,
      radius: Math.random() * 2 + 1
    });
  }

  let mouseX = -1000;
  let mouseY = -1000;
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animate() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = 'rgba(34, 211, 238, 0.75)';
    ctx.strokeStyle = 'rgba(34, 211, 238, 0.12)';
    ctx.lineWidth = 1;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(34, 211, 238, ${0.2 * (1 - dist / 140)})`;
          ctx.stroke();
        }
      }

      const mdx = p.x - mouseX;
      const mdy = p.y - mouseY;
      const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
      if (mdist < 170) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(mouseX, mouseY);
        ctx.strokeStyle = `rgba(139, 92, 246, ${0.4 * (1 - mdist / 170)})`;
        ctx.stroke();
      }
    }

    requestAnimationFrame(animate);
  }
  animate();
}

/* ===================== CYBER CURSOR ===================== */
function initCyberCursor() {
  const cursor = $('cyberCursor');
  const ring = $('cyberCursorRing');
  if (!cursor || !ring) return;

  let mouseX = -100;
  let mouseY = -100;
  let ringX = -100;
  let ringY = -100;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    document.body.classList.add('cursor-active');
    cursor.style.left = `${mouseX}px`;
    cursor.style.top = `${mouseY}px`;
  });

  document.addEventListener('mouseleave', () => {
    document.body.classList.remove('cursor-active');
  });

  function renderRing() {
    ringX += (mouseX - ringX) * 0.2;
    ringY += (mouseY - ringY) * 0.2;
    ring.style.left = `${ringX}px`;
    ring.style.top = `${ringY}px`;
    requestAnimationFrame(renderRing);
  }
  renderRing();

  const interactiveSelector = 'button, a, input, select, label, .qa, .dropzone, .nav-item, .kpi, .icon-btn, .clickable';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest && e.target.closest(interactiveSelector)) {
      document.body.classList.add('cursor-hover');
    }
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest && e.target.closest(interactiveSelector)) {
      document.body.classList.remove('cursor-hover');
    }
  });
}

/* ===================== INIT ===================== */
document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();
  initLandingIntro();
  initCyberCanvas();
  initCyberCursor();
  bindAnalyzerFilters();
  bindThreatFilters();
  bindUploader();
  bindQuickActions();
  bindTilt();
  loadStats();
  loadLogs();
  loadThreats();
});