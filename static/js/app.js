// Global chart instances
let chartNormalVsSuspiciousInstance = null;
let chartSeverityInstance = null;
let chartActivityTimeInstance = null;
let searchTimeout = null;

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initFileUpload();
    loadDashboardData();
});

// Navigation handling
function initNavigation() {
    const navItems = document.querySelectorAll('.sidebar-nav li');
    const viewTitles = {
        'dashboard-view': ['Dashboard Overview', 'Monitor security logs, investigate anomalies, and analyze rule-based threats.'],
        'analyzer-view': ['Log Analyzer', 'Upload, filter, and inspect security log records in real time.'],
        'threats-view': ['Threat Detection', 'Review rule-based security threats and investigate evidence.'],
        'settings-view': ['Settings', 'Configure prototype preferences and system options.']
    };

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = item.getAttribute('data-target');
            
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            document.querySelectorAll('.view-section').forEach(section => {
                section.classList.remove('active');
            });

            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active');
            }

            if (viewTitles[targetId]) {
                document.getElementById('view-title').textContent = viewTitles[targetId][0];
                document.querySelector('.header-breadcrumb .subtitle').textContent = viewTitles[targetId][1];
            }

            // Load view-specific data
            if (targetId === 'dashboard-view') {
                loadDashboardData();
            } else if (targetId === 'analyzer-view') {
                fetchLogs();
            } else if (targetId === 'threats-view') {
                fetchThreats();
            }
        });
    });

    // Quick action buttons in header
    document.getElementById('btn-load-sample').addEventListener('click', loadSampleDataset);
    document.getElementById('btn-quick-upload').addEventListener('click', () => {
        // Switch to analyzer view and trigger browse
        document.querySelector('[data-target="analyzer-view"]').click();
    });
}

function switchView(targetId) {
    const targetItem = document.querySelector(`[data-target="${targetId}"]`);
    if (targetItem) {
        targetItem.click();
    }
}

// Toast notification helper
function showToast(message, isError = false) {
    const toast = document.getElementById('notification-toast');
    const icon = document.getElementById('toast-icon');
    const msg = document.getElementById('toast-message');

    msg.textContent = message;
    if (isError) {
        toast.classList.add('error');
        icon.className = 'fa-solid fa-triangle-exclamation';
    } else {
        toast.classList.remove('error');
        icon.className = 'fa-solid fa-circle-check';
    }

    toast.classList.remove('hidden');
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 4000);
}

// Severity badge HTML helper
function getSeverityBadge(severity) {
    const sev = (severity || 'Low').toLowerCase();
    if (sev === 'critical') return `<span class="badge badge-critical"><i class="fa-solid fa-fire"></i> Critical</span>`;
    if (sev === 'high') return `<span class="badge badge-high"><i class="fa-solid fa-triangle-exclamation"></i> High</span>`;
    if (sev === 'medium') return `<span class="badge badge-medium"><i class="fa-solid fa-circle-exclamation"></i> Medium</span>`;
    return `<span class="badge badge-low"><i class="fa-solid fa-circle-check"></i> Low</span>`;
}

function getStatusBadge(status) {
    const st = (status || '').toLowerCase();
    if (['success', 'successful', 'active'].includes(st)) return `<span class="status-badge success">${status}</span>`;
    if (['failed', 'failure', 'error', 'blocked', 'forbidden', 'unauthorized'].includes(st)) return `<span class="status-badge failed">${status}</span>`;
    return `<span class="status-badge active">${status}</span>`;
}

// 1. Dashboard Data & Charts
async function loadDashboardData() {
    try {
        const res = await fetch('/api/stats');
        const data = await res.json();

        document.getElementById('card-total-events').textContent = data.total_events.toLocaleString();
        document.getElementById('card-suspicious-events').textContent = data.suspicious_events.toLocaleString();
        document.getElementById('card-critical-alerts').textContent = data.critical_alerts.toLocaleString();
        document.getElementById('card-last-status').textContent = data.last_status;
        document.getElementById('card-filename').textContent = data.filename ? `File: ${data.filename}` : 'No dataset analyzed';

        renderRecentActivity(data.recent_activity);
        renderCharts(data);
    } catch (err) {
        console.error('Failed to load dashboard stats:', err);
    }
}

function renderRecentActivity(activities) {
    const tbody = document.querySelector('#recent-activity-table tbody');
    if (!activities || activities.length === 0) {
        tbody.innerHTML = `
            <tr class="empty-row">
                <td colspan="5">
                    <div class="empty-state">
                        <i class="fa-solid fa-folder-open"></i>
                        <p>No log records analyzed yet. Load the sample dataset or upload a CSV file to begin.</p>
                        <button class="btn btn-primary btn-sm" onclick="loadSampleDataset()">Load Sample Dataset</button>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = activities.map(act => `
        <tr>
            <td><code>${act.timestamp}</code></td>
            <td><code>${act.source_ip}</code></td>
            <td>${act.event_type}</td>
            <td>${getSeverityBadge(act.severity)}</td>
            <td>${act.detection_reason}</td>
        </tr>
    `).join('');
}

function renderCharts(data) {
    // 1. Normal vs Suspicious Donut Chart
    const ctx1 = document.getElementById('chartNormalVsSuspicious').getContext('2d');
    if (chartNormalVsSuspiciousInstance) chartNormalVsSuspiciousInstance.destroy();
    
    chartNormalVsSuspiciousInstance = new Chart(ctx1, {
        type: 'doughnut',
        data: {
            labels: ['Normal Events', 'Suspicious Events'],
            datasets: [{
                data: [data.normal_vs_suspicious.Normal, data.normal_vs_suspicious.Suspicious],
                backgroundColor: ['#22c55e', '#f97316'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom', labels: { color: '#94a3b8', boxWidth: 12 } }
            }
        }
    });

    // 2. Severity Breakdown Bar Chart
    const ctx2 = document.getElementById('chartSeverity').getContext('2d');
    if (chartSeverityInstance) chartSeverityInstance.destroy();

    const sev = data.severity_breakdown;
    chartSeverityInstance = new Chart(ctx2, {
        type: 'bar',
        data: {
            labels: ['Critical', 'High', 'Medium', 'Low'],
            datasets: [{
                label: 'Event Count',
                data: [sev.Critical, sev.High, sev.Medium, sev.Low],
                backgroundColor: ['#ef4444', '#f97316', '#38bdf8', '#22c55e'],
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: { ticks: { color: '#94a3b8' }, grid: { display: false } },
                y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } }
            }
        }
    });

    // 3. Activity Over Time Line Chart
    const ctx3 = document.getElementById('chartActivityTime').getContext('2d');
    if (chartActivityTimeInstance) chartActivityTimeInstance.destroy();

    const timeLabels = Object.keys(data.events_over_time);
    const timeValues = Object.values(data.events_over_time);

    chartActivityTimeInstance = new Chart(ctx3, {
        type: 'line',
        data: {
            labels: timeLabels.length > 0 ? timeLabels : ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
            datasets: [{
                label: 'Events Logged',
                data: timeValues.length > 0 ? timeValues : [0, 0, 0, 0, 0, 0],
                borderColor: '#00f2fe',
                backgroundColor: 'rgba(0, 242, 254, 0.1)',
                fill: true,
                tension: 0.3,
                borderWidth: 2,
                pointBackgroundColor: '#00f2fe'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: { ticks: { color: '#94a3b8' }, grid: { display: false } },
                y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } }
            }
        }
    });
}

// 2. Log Analyzer & Upload
function initFileUpload() {
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('csv-file-input');

    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            dropZone.classList.add('dragover');
        }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            dropZone.classList.remove('dragover');
        }, false);
    });

    dropZone.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        if (files.length > 0) {
            uploadCsvFile(files[0]);
        }
    });

    fileInput.addEventListener('change', (e) => {
        if (fileInput.files.length > 0) {
            uploadCsvFile(fileInput.files[0]);
        }
    });
}

async function uploadCsvFile(file) {
    const formData = new FormData();
    formData.append('file', file);

    showToast('Uploading and analyzing CSV logs...');

    try {
        const res = await fetch('/api/upload', {
            method: 'POST',
            body: formData
        });
        const data = await res.json();

        if (res.ok) {
            showToast(`Success! Processed ${data.stats.valid} valid records (${data.stats.suspicious} suspicious).`);
            fetchLogs();
            loadDashboardData();
        } else {
            showToast(data.error || 'Failed to process CSV file.', true);
        }
    } catch (err) {
        showToast('Network error during file upload.', true);
    }
}

async function loadSampleDataset() {
    showToast('Loading built-in sample dataset...');
    try {
        const res = await fetch('/api/load-sample', { method: 'POST' });
        const data = await res.json();

        if (res.ok) {
            showToast(`Sample dataset loaded! ${data.stats.valid} records analyzed.`);
            fetchLogs();
            loadDashboardData();
            // If on dashboard, refresh
        } else {
            showToast(data.error || 'Failed to load sample dataset.', true);
        }
    } catch (err) {
        showToast('Network error loading sample dataset.', true);
    }
}

function debounceFetchLogs() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(fetchLogs, 300);
}

async function fetchLogs() {
    const search = document.getElementById('log-search').value;
    const severity = document.getElementById('log-severity-filter').value;

    try {
        const res = await fetch(`/api/logs?search=${encodeURIComponent(search)}&severity=${encodeURIComponent(severity)}`);
        const data = await res.json();

        document.getElementById('log-count-display').textContent = data.total;
        renderLogsTable(data.logs);
    } catch (err) {
        console.error('Failed to fetch logs:', err);
    }
}

function renderLogsTable(logs) {
    const tbody = document.querySelector('#logs-table tbody');
    if (!logs || logs.length === 0) {
        tbody.innerHTML = `
            <tr class="empty-row">
                <td colspan="7">
                    <div class="empty-state">
                        <i class="fa-solid fa-database"></i>
                        <p>No log records match your filter. Try adjusting search or severity filters.</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = logs.map(log => `
        <tr>
            <td><code>${log.timestamp}</code></td>
            <td><code>${log.source_ip}</code></td>
            <td>${log.username}</td>
            <td>${log.event_type}</td>
            <td>${getStatusBadge(log.status)}</td>
            <td>${getSeverityBadge(log.severity)}</td>
            <td>${log.detection_reason}</td>
        </tr>
    `).join('');
}

// 3. Threat Detection
async function fetchThreats() {
    const search = document.getElementById('threat-search').value;
    const severity = document.getElementById('threat-severity-filter').value;

    try {
        const res = await fetch(`/api/detections?search=${encodeURIComponent(search)}&severity=${encodeURIComponent(severity)}`);
        const data = await res.json();

        renderThreatsTable(data.detections);
    } catch (err) {
        console.error('Failed to fetch threats:', err);
    }
}

function renderThreatsTable(threats) {
    const tbody = document.querySelector('#threats-table tbody');
    if (!threats || threats.length === 0) {
        tbody.innerHTML = `
            <tr class="empty-row">
                <td colspan="8">
                    <div class="empty-state">
                        <i class="fa-solid fa-shield-check"></i>
                        <p>No active threats detected. Load sample dataset or upload security logs to evaluate rules.</p>
                        <button class="btn btn-primary btn-sm" onclick="loadSampleDataset()">Load Sample Dataset</button>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = threats.map(t => `
        <tr>
            <td><strong>#DET-${t.id}</strong></td>
            <td><code>${t.timestamp}</code></td>
            <td><code>${t.source_ip}</code></td>
            <td><strong>${t.rule_triggered}</strong></td>
            <td>${getSeverityBadge(t.severity)}</td>
            <td>${t.evidence}</td>
            <td><span class="status-badge active">${t.status}</span></td>
            <td>
                <button class="btn btn-outline btn-sm" onclick='openThreatDetail(${JSON.stringify(t)})'>
                    <i class="fa-solid fa-eye"></i> Inspect
                </button>
            </td>
        </tr>
    `).join('');
}

function openThreatDetail(threat) {
    const modalBody = document.getElementById('threat-modal-body');
    modalBody.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 12px;">
            <div><strong>Detection ID:</strong> #DET-${threat.id}</div>
            <div><strong>Timestamp:</strong> <code>${threat.timestamp}</code></div>
            <div><strong>Source IP:</strong> <code>${threat.source_ip}</code></div>
            <div><strong>Rule Triggered:</strong> ${threat.rule_triggered}</div>
            <div><strong>Severity:</strong> ${getSeverityBadge(threat.severity)}</div>
            <div><strong>Detailed Evidence & Explanation:</strong></div>
            <div style="background: rgba(31, 41, 55, 0.7); padding: 12px; border-radius: 8px; border-left: 3px solid var(--accent-cyan); font-family: var(--font-mono); font-size: 0.85rem;">
                ${threat.evidence}
            </div>
            <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 8px;">
                <i class="fa-solid fa-circle-info"></i> Note: Rule-based heuristic match. Verify source IP ownership and associated user activity before taking remediation action.
            </div>
        </div>
    `;
    document.getElementById('threat-modal').classList.remove('hidden');
}

function closeThreatModal() {
    document.getElementById('threat-modal').classList.add('hidden');
}
