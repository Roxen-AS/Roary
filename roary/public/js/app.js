// ─── Roary App Controller ───

const PAGE_TITLES = {
  dashboard: 'Dashboard',
  heatmap: 'Live Heatmap',
  alerts: 'Alerts & Incidents',
  facilities: 'Facilities',
  staff: 'Staff Coordination',
  events: 'Events',
  crowdflow: 'Crowd Flow',
  queues: 'Queue Manager',
  wayfinding: 'Wayfinding',
  analytics: 'Analytics',
};

const PAGE_RENDERERS = {
  dashboard: renderDashboard,
  heatmap: renderHeatmap,
  alerts: renderAlerts,
  facilities: renderFacilities,
  staff: renderStaff,
  events: renderEvents,
  crowdflow: renderCrowdFlow,
  queues: renderQueues,
  wayfinding: renderWayfinding,
  analytics: renderAnalytics,
};

let currentPage = 'dashboard';
let gateData = [];
let concData = [];

async function showPage(id, el) {
  currentPage = id;
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  if (el) el.classList.add('active');
  document.getElementById('page-title').textContent = PAGE_TITLES[id] || id;
  const main = document.getElementById('main-content');

  try {
    const pageData = await PAGE_LOADERS[id]();
    if (PAGE_RENDERERS[id]) {
      main.innerHTML = PAGE_RENDERERS[id](pageData);
    } else {
      main.innerHTML = '<p>Page not found</p>';
    }

    requestAnimationFrame(async () => {
      if (id === 'dashboard') {
        buildCrowdFlowChart('chart-crowd-flow');
        buildIngressChart('chart-ingress');
        // Live attendance ticker
        const attEl = document.getElementById('att-val');
        if (attEl && state.event) {
          let attVal = state.event.attendance;
          setInterval(() => {
            if (Math.random() > 0.6) {
              attVal += Math.floor(Math.random() * 4);
              attEl.textContent = attVal.toLocaleString('en-IN');
            }
          }, 2500);
        }
      }
      if (id === 'alerts') {
        filterAlerts('active', document.getElementById('af-active'));
      }
      if (id === 'facilities') {
        filterFacilities('all', document.querySelector('.facility-filters .filter-btn'));
      }
      if (id === 'staff' && state.staff) {
        renderStaffRows(state.staff);
      }
      if (id === 'queues') {
        if (state.gateData) {
          gateData = JSON.parse(JSON.stringify(state.gateData));
          renderBarList(gateData, 'gate-bars');
        }
        if (state.concessions) {
          concData = JSON.parse(JSON.stringify(state.concessions));
          renderBarList(concData, 'conc-bars');
        }
      }
      if (id === 'analytics') {
        buildCrowdFlowChart('chart-analytics-flow');
        buildDonutChart('chart-donut');
        buildWaitTimesChart('chart-waittimes');
      }
    });
  } catch (err) {
    main.innerHTML = `<p style="color:var(--red);padding:20px">Failed to load page: ${err.message}</p>`;
    console.error(err);
  }
}

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('collapsed');
}

// ── Notifications ──
const NOTIFICATIONS = [
  { msg: 'Gate 4 overcrowding — density 3.2/m²', color: 'var(--red)', time: '2 min ago' },
  { msg: 'Medical assistance dispatched to Section A', color: 'var(--red)', time: '4 min ago' },
  { msg: 'Exit simulation ready — match ends in ~20 min', color: 'var(--amb)', time: '6 min ago' },
  { msg: 'Gate 2 has capacity — reroute suggested', color: 'var(--grn)', time: '8 min ago' },
];

function renderNotifications() {
  const el = document.getElementById('notif-list');
  el.innerHTML = NOTIFICATIONS.map(n => `
    <div class="notif-item">
      <div class="notif-icon" style="background:${n.color}"></div>
      <div>
        <div class="notif-body">${n.msg}</div>
        <div class="notif-time">${n.time}</div>
      </div>
    </div>
  `).join('');
}

function toggleNotifications() {
  const panel = document.getElementById('notif-panel');
  panel.classList.toggle('show');
  if (panel.classList.contains('show')) {
    renderNotifications();
    document.getElementById('notif-dot').classList.remove('show');
  }
}

function clearNotifications() {
  document.getElementById('notif-list').innerHTML = '<div style="padding:14px;font-size:12px;color:var(--t3);text-align:center">All caught up</div>';
}

document.addEventListener('click', e => {
  const panel = document.getElementById('notif-panel');
  const btn = document.getElementById('notif-btn');
  if (!panel.contains(e.target) && !btn.contains(e.target)) panel.classList.remove('show');
});

// ── Toast system ──
function showToast(msg, type) {
  const container = document.getElementById('toasts');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  const icon = type === 'success' ? '✓' : type === 'warning' ? '⚠' : type === 'error' ? '✕' : 'ℹ';
  const iconColor = type === 'success' ? 'var(--grn)' : type === 'warning' ? 'var(--amb)' : type === 'error' ? 'var(--red)' : 'var(--blu)';
  toast.innerHTML = `<span style="color:${iconColor};font-weight:700">${icon}</span> ${msg}`;
  container.appendChild(toast);
  setTimeout(() => { toast.classList.add('out'); setTimeout(() => toast.remove(), 300); }, 3000);
}

// ── Periodic notification ping ──
setTimeout(() => {
  document.getElementById('notif-dot').classList.add('show');
  showToast('New alert: Parking Zone A critical', 'warning');
}, 12000);

// ── Init ──
document.addEventListener('DOMContentLoaded', () => {
  showPage('dashboard', document.querySelector('.nav-item.active'));
});
