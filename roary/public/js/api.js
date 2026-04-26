// ─── Roary API Client ───

async function fetchJSON(method, path, body) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(path, opts);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

const api = {
  get: (path) => fetchJSON('GET', path),
  post: (path, body) => fetchJSON('POST', path, body),
  patch: (path, body) => fetchJSON('PATCH', path, body),
};

// ─── App State ───
const state = {
  event: null,
  zones: null,
  alerts: null,
  facilities: null,
  staff: null,
  events: null,
  chartData: null,
  gateData: null,
  concessions: null,
};

// ─── Page Data Loaders ───
async function loadDashboardData() {
  const [event, alerts, zones, chartData] = await Promise.all([
    api.get('/api/event'),
    api.get('/api/alerts'),
    api.get('/api/zones'),
    Promise.all([api.get('/api/analytics/flow'), api.get('/api/analytics/ingress')]).then(([flow, ingress]) => ({ crowdFlow: flow, ingress })),
  ]);
  state.event = event;
  state.alerts = alerts;
  state.zones = zones;
  state.chartData = { crowdFlow: chartData.crowdFlow, ingress: chartData.ingress };
  return { event, alerts, zones, chartData };
}

async function loadHeatmapData() {
  const zones = await api.get('/api/zones');
  state.zones = zones;
  return { zones };
}

async function loadAlertsData() {
  const alerts = await api.get('/api/alerts');
  state.alerts = alerts;
  return { alerts };
}

async function loadFacilitiesData() {
  const facilities = await api.get('/api/facilities');
  state.facilities = facilities;
  return { facilities };
}

async function loadStaffData() {
  const staff = await api.get('/api/staff');
  state.staff = staff;
  return { staff };
}

async function loadEventsData() {
  const events = await api.get('/api/events');
  state.events = events;
  return { events };
}

async function loadCrowdFlowData() {
  const [flow, ingress] = await Promise.all([
    api.get('/api/analytics/flow'),
    api.get('/api/analytics/ingress'),
  ]);
  state.chartData = { crowdFlow: flow, ingress };
  return { chartData: state.chartData };
}

async function loadQueuesData() {
  const [gates, concessions] = await Promise.all([
    api.get('/api/analytics/gates'),
    api.get('/api/analytics/concessions'),
  ]);
  state.gateData = gates;
  state.concessions = concessions;
  return { gates, concessions };
}

async function loadWayfindingData() {
  return {};
}

async function loadAnalyticsData() {
  const [kpis, flow, ingress] = await Promise.all([
    api.get('/api/analytics/kpis'),
    api.get('/api/analytics/flow'),
    api.get('/api/analytics/ingress'),
  ]);
  state.chartData = { crowdFlow: flow, ingress };
  return { kpis, chartData: state.chartData };
}

const PAGE_LOADERS = {
  dashboard: loadDashboardData,
  heatmap: loadHeatmapData,
  alerts: loadAlertsData,
  facilities: loadFacilitiesData,
  staff: loadStaffData,
  events: loadEventsData,
  crowdflow: loadCrowdFlowData,
  queues: loadQueuesData,
  wayfinding: loadWayfindingData,
  analytics: loadAnalyticsData,
};
