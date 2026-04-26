// ─── Roary Pages ───

function getStatusColor(s) {
  if (s==='critical'||s==='high'||s==='busy'||s==='full') return { bar:'#ef4444', badge:'b-red' };
  if (s==='moderate') return { bar:'#f59e0b', badge:'b-amb' };
  return { bar:'#22c55e', badge:'b-grn' };
}
function waitColor(w) { return w>15?'var(--red)':w>8?'var(--amb)':'var(--grn)'; }
function pctColor(p) { return p>80?'var(--red)':p>50?'var(--amb)':'var(--grn)'; }

// ── Dashboard ──
function renderDashboard() {
  const d = RoaryData;
  return `
<div class="page-enter">
  <div class="page-hdr">
    <div class="ph-left">
      <h1>Live dashboard</h1>
      <p>Wankhede Stadium · MI vs RCB IPL 2026 · Over ${d.event.over}</p>
    </div>
    <div class="ph-right">
      <span class="badge b-grn" style="padding:4px 10px;font-size:10px;"><span class="live-dot" style="width:5px;height:5px;margin-right:4px"></span>All systems nominal</span>
      <button class="btn" onclick="showToast('Report exported','success')">Export report</button>
    </div>
  </div>
  <div class="metrics">
    <div class="metric">
      <div class="metric-label">Total attendance</div>
      <div class="metric-value text-grn" id="att-val">${d.event.attendance.toLocaleString('en-IN')}</div>
      <div class="metric-delta"><span class="delta-up">+340</span>&nbsp;last 5 min · ${Math.round(d.event.attendance/d.event.capacity*100)}% capacity</div>
    </div>
    <div class="metric">
      <div class="metric-label">Active alerts</div>
      <div class="metric-value text-red">${d.alerts.filter(a=>a.status==='active').length}</div>
      <div class="metric-delta delta-dn">1 high · 1 medium</div>
    </div>
    <div class="metric">
      <div class="metric-label">Avg wait time</div>
      <div class="metric-value delta-amb">6.7m</div>
      <div class="metric-delta delta-amb">Gate 4 critical · 28m</div>
    </div>
    <div class="metric">
      <div class="metric-label">Zones at capacity</div>
      <div class="metric-value">7<span style="font-size:16px;color:var(--t3);font-weight:400"> / 14</span></div>
      <div class="metric-delta delta-dn">Require attention</div>
    </div>
  </div>

  <div style="display:grid;grid-template-columns:3fr 2fr;gap:14px;margin-bottom:14px">
    <div class="card">
      <div class="card-title">
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M1 10 Q2.5 5 4 7 Q5.5 9 6.5 4 Q7.5 0 8.5 6 Q9.5 9 10.5 7 Q11.5 5 12 6" stroke-linecap="round" stroke-linejoin="round"/></svg>
        Live crowd flow
      </div>
      <div style="position:relative;height:220px"><canvas id="chart-crowd-flow"></canvas></div>
    </div>
    <div class="card">
      <div class="card-title">Active incidents</div>
      ${d.alerts.filter(a=>a.status==='active').map(a => `
      <div class="alert-item" onclick="showPage('alerts',document.querySelector('[onclick*=alerts]'))">
        <div class="alert-dot" style="background:${a.severity==='high'?'var(--red)':'var(--amb)'}"></div>
        <div style="flex:1;min-width:0">
          <div class="alert-body"><strong>${a.title}</strong></div>
          <div class="alert-meta"><span>${a.location}</span><span>${a.time}</span></div>
        </div>
        <span class="badge ${a.severity==='high'?'b-red':'b-amb'}" style="flex-shrink:0">${a.severity}</span>
      </div>`).join('')}
    </div>
  </div>

  <div style="display:grid;grid-template-columns:2fr 3fr;gap:14px;margin-bottom:14px">
    <div class="card">
      <div class="card-title">Zone congestion overview</div>
      ${d.zones.slice(0,6).map(z => {
        const pct = Math.round(z.occ/z.cap*100);
        const sc = getStatusColor(z.status);
        return `<div class="bar-row">
          <div class="bar-header">
            <div class="bar-name">${z.name}</div>
            <div class="bar-val" style="color:${sc.bar}">${pct}%</div>
          </div>
          <div class="bar-track"><div class="bar-fill" style="width:${pct}%;background:${sc.bar}"></div></div>
        </div>`;
      }).join('')}
      <button class="btn sm" style="margin-top:10px" onclick="showPage('heatmap',document.querySelector('[onclick*=heatmap]'))">View all zones →</button>
    </div>
    <div class="card">
      <div class="card-title">Ingress trend · last 90 min</div>
      <div style="position:relative;height:150px;margin-bottom:12px"><canvas id="chart-ingress"></canvas></div>
      <div style="display:flex;gap:10px">
        <div class="mini-stat" style="flex:1">
          <div class="mini-stat-val text-amb">22:40</div>
          <div class="mini-stat-label">Exit wave start</div>
        </div>
        <div class="mini-stat" style="flex:1">
          <div class="mini-stat-val text-grn">23 min</div>
          <div class="mini-stat-label">Clear window</div>
        </div>
        <div class="mini-stat" style="flex:1">
          <div class="mini-stat-val">91%</div>
          <div class="mini-stat-label">AI accuracy</div>
        </div>
      </div>
    </div>
  </div>
</div>`;
}

// ── Heatmap ──
function renderHeatmap() {
  const zones = RoaryData.zones;
  return `
<div class="page-enter">
  <div class="page-hdr">
    <div class="ph-left"><h1>Live heatmap</h1><p>Real-time density across all ${zones.length} venue zones</p></div>
    <div class="ph-right">
      <span class="badge b-grn" style="padding:3px 8px">Low</span>
      <span class="badge b-amb" style="padding:3px 8px">Moderate</span>
      <span class="badge" style="padding:3px 8px;background:rgba(249,115,22,.12);color:#f97316">High</span>
      <span class="badge b-red" style="padding:3px 8px">Critical</span>
      <button class="btn primary" onclick="showToast('Zone added','success')">+ Add zone</button>
    </div>
  </div>
  <div class="zone-grid">
    ${zones.map(z => {
      const pct = Math.round(z.occ/z.cap*100);
      const sc = getStatusColor(z.status);
      return `<div class="zone-card ${z.status}" onclick="showToast('${z.name}: ${pct}% occupied','')">
        <div class="zone-card-top">
          <div>
            <div class="zone-name">${z.name}</div>
            <div class="zone-type">${z.type}</div>
          </div>
          <span class="badge ${sc.badge}">${z.status}</span>
        </div>
        <div class="zone-occ">
          <span>Occupancy</span>
          <span class="zone-occ-num">${z.occ.toLocaleString()} / ${z.cap.toLocaleString()}</span>
        </div>
        <div class="zone-bar">
          <div class="zone-bar-fill" style="width:${pct}%;background:${sc.bar}"></div>
        </div>
        <div class="zone-footer">
          <span>Wait time: <strong style="color:${waitColor(z.wait)}">${z.wait} min</strong></span>
          <span>Status: <strong>Open</strong></span>
        </div>
      </div>`;
    }).join('')}
  </div>
</div>`;
}

// ── Alerts ──
function renderAlerts() {
  let activeFilter = 'active';
  return `
<div class="page-enter">
  <div class="page-hdr">
    <div class="ph-left"><h1>Alerts & incidents</h1><p>Manage and track venue security and operational alerts</p></div>
    <div class="ph-right">
      <div style="display:flex;gap:4px;background:var(--s2);border:1px solid var(--b1);border-radius:var(--r1);padding:3px">
        <button class="filter-btn active" id="af-active" onclick="filterAlerts('active',this)">Active</button>
        <button class="filter-btn" id="af-resolved" onclick="filterAlerts('resolved',this)">Resolved</button>
        <button class="filter-btn" id="af-all" onclick="filterAlerts('all',this)">All</button>
      </div>
      <button class="btn primary" onclick="addAlert()">+ New alert</button>
    </div>
  </div>
  <div id="alerts-list"></div>
</div>`;
}

function filterAlerts(filter, btn) {
  document.querySelectorAll('#af-active,#af-resolved,#af-all').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const alerts = filter==='all' ? RoaryData.alerts : RoaryData.alerts.filter(a => a.status===filter);
  document.getElementById('alerts-list').innerHTML = alerts.map(a => `
    <div class="card mb-12" id="alert-card-${a.id}" style="border-left:3px solid ${a.severity==='high'?'var(--red)':a.severity==='medium'?'var(--amb)':'var(--grn)'};border-radius:0 12px 12px 0">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px">
        <div style="display:flex;align-items:center;gap:10px">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="${a.severity==='high'?'var(--red)':'var(--amb)'}" stroke-width="1.5"><path d="M8 2L14 13H2L8 2Z" stroke-linejoin="round"/><path d="M8 6v3M8 11v.5" stroke-linecap="round"/></svg>
          <div>
            <div style="font-size:14px;font-weight:600;display:flex;align-items:center;gap:8px">
              ${a.title}
              <span class="badge ${a.severity==='high'?'b-red':a.severity==='medium'?'b-amb':'b-grn'}">${a.severity}</span>
              <span class="badge b-gray">${a.type}</span>
            </div>
            <div style="font-size:12px;color:var(--t2);margin-top:5px;line-height:1.5">${a.desc}</div>
            <div style="font-size:10px;color:var(--t3);margin-top:6px;display:flex;gap:12px">
              <span>📍 ${a.location}</span>
              <span>🕐 Reported: ${a.time}</span>
            </div>
          </div>
        </div>
        <div style="flex-shrink:0">
          ${a.status==='active' ? `<button class="btn primary sm" onclick="resolveAlert('${a.id}')">✓ Mark resolved</button>` : `<span class="badge b-grn">Resolved</span>`}
        </div>
      </div>
    </div>
  `).join('') || '<div style="text-align:center;color:var(--t3);padding:40px">No alerts found</div>';
}

function resolveAlert(id) {
  const a = RoaryData.alerts.find(x => x.id===id);
  if (a) { a.status='resolved'; showToast(`"${a.title}" marked resolved`,'success'); }
  const active = RoaryData.alerts.filter(x=>x.status==='active');
  document.getElementById('badge-alerts').textContent = active.length;
  document.getElementById('badge-crowd').textContent = active.length;
  filterAlerts('active', document.getElementById('af-active'));
}

function addAlert() {
  const newA = {
    id: 'a'+(Date.now()),
    title: 'New manual alert',
    severity: 'medium',
    type: 'Manual',
    location: 'Ops Center',
    desc: 'Manually created alert from ops dashboard.',
    time: new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'}),
    status: 'active'
  };
  RoaryData.alerts.unshift(newA);
  showToast('New alert created','warning');
  filterAlerts('active', document.getElementById('af-active'));
}

// ── Facilities ──
function renderFacilities() {
  return `
<div class="page-enter">
  <div class="page-hdr">
    <div class="ph-left"><h1>Facilities</h1><p>Monitor real-time status and wait times across all venue amenities</p></div>
    <div class="ph-right"><button class="btn primary" onclick="showToast('Facility added','success')">+ Add facility</button></div>
  </div>
  <div class="facility-filters">
    <button class="filter-btn active" onclick="filterFacilities('all',this)">All</button>
    <button class="filter-btn" onclick="filterFacilities('restroom',this)">Restroom</button>
    <button class="filter-btn" onclick="filterFacilities('food',this)">Food stand</button>
    <button class="filter-btn" onclick="filterFacilities('medical',this)">Medical</button>
    <button class="filter-btn" onclick="filterFacilities('atm',this)">ATM</button>
    <button class="filter-btn" onclick="filterFacilities('merchandise',this)">Merchandise</button>
  </div>
  <div class="facility-grid" id="facility-grid"></div>
</div>`;
}

function filterFacilities(type, btn) {
  document.querySelectorAll('.facility-filters .filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const facs = type==='all' ? RoaryData.facilities : RoaryData.facilities.filter(f=>f.type===type);
  document.getElementById('facility-grid').innerHTML = facs.map(f => {
    const statusMap = { open:'b-grn', busy:'b-amb', full:'b-red' };
    return `<div class="facility-card">
      <div class="facility-top">
        <div>
          <div class="facility-name">${f.name}</div>
          <div class="facility-loc">📍 ${f.loc}</div>
        </div>
        <span class="badge ${statusMap[f.status]||'b-gray'}">${f.status}</span>
      </div>
      <div class="facility-wait" style="color:${waitColor(f.wait)}">${f.wait}m</div>
      <div class="facility-wait-label">Estimated wait time</div>
      <button class="btn sm facility-update" onclick="showToast('${f.name} status updated','success')">✏ Update status</button>
    </div>`;
  }).join('') || '<div style="color:var(--t3);padding:20px">No facilities found</div>';
}

// ── Staff ──
function renderStaff() {
  return `
<div class="page-enter">
  <div class="page-hdr">
    <div class="ph-left"><h1>Staff coordination</h1><p>Manage personnel assignments and real-time availability</p></div>
    <div class="ph-right">
      <input type="search" placeholder="Search staff..." style="width:200px" oninput="filterStaff(this.value)">
      <button class="btn primary" onclick="showToast('Staff member added','success')">+ Add staff</button>
    </div>
  </div>
  <div class="card">
    <div class="table-wrap">
      <table id="staff-table">
        <thead><tr>
          <th>Name</th><th>Role</th><th>Assignment</th><th>Contact</th><th>Status</th><th>Actions</th>
        </tr></thead>
        <tbody id="staff-body"></tbody>
      </table>
    </div>
  </div>
</div>`;
}

function renderStaffRows(staff) {
  document.getElementById('staff-body').innerHTML = staff.map(s => `
    <tr>
      <td>
        <div class="staff-row-inner">
          <div class="staff-avatar" style="background:${s.color}22;color:${s.color}">${s.initials}</div>
          <div>
            <div style="font-weight:500">${s.name}</div>
          </div>
        </div>
      </td>
      <td><span class="badge b-blu">${s.role}</span></td>
      <td style="color:var(--t2)">${s.assignment}</td>
      <td style="color:var(--t3)">${s.contact}</td>
      <td><span class="badge ${s.status==='busy'?'b-amb':'b-grn'}">${s.status}</span></td>
      <td>
        <button class="btn sm" onclick="showToast('Dispatch sent to ${s.name}','success')">Dispatch</button>
      </td>
    </tr>
  `).join('');
}

function filterStaff(q) {
  const filtered = q ? RoaryData.staff.filter(s => s.name.toLowerCase().includes(q.toLowerCase()) || s.role.toLowerCase().includes(q.toLowerCase())) : RoaryData.staff;
  renderStaffRows(filtered);
}

// ── Events ──
function renderEvents() {
  const evs = RoaryData.events;
  return `
<div class="page-enter">
  <div class="page-hdr">
    <div class="ph-left"><h1>Events</h1><p>Schedule and track attendance for all venue events</p></div>
    <div class="ph-right"><button class="btn primary" onclick="showToast('Event scheduled','success')">+ Schedule event</button></div>
  </div>
  <div class="events-grid">
    ${evs.map(e => {
      const pct = e.capacity ? Math.round(e.attendance/e.capacity*100) : 0;
      return `<div class="event-card ${e.status}" onclick="showToast('Opening ${e.name} details...','')">
        <div class="event-top">
          <div>
            <div class="event-name">${e.name}</div>
            <div class="event-venue">📍 ${e.venue}</div>
          </div>
          <span class="badge ${e.status==='live'?'b-grn':'b-blu'}">${e.status}</span>
        </div>
        <div class="event-date">📅 ${e.date}</div>
        <div class="event-progress-label">
          <span style="display:flex;align-items:center;gap:4px"><svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="6" cy="4" r="2"/><path d="M2 11c0-2 1.8-3.5 4-3.5s4 1.5 4 3.5" stroke-linecap="round"/></svg> Attendance</span>
          <span>${e.attendance.toLocaleString()} / ${e.capacity.toLocaleString()}</span>
        </div>
        <div class="event-bar">
          <div class="event-bar-fill" style="width:${pct}%;background:${e.status==='live'?'var(--grn)':'var(--blu)'}"></div>
        </div>
        <div class="event-pct">${pct.toFixed(1)}% of expected</div>
      </div>`;
    }).join('')}
  </div>
</div>`;
}

// ── Crowd Flow ──
function renderCrowdFlow() {
  const d = RoaryData;
  return `
<div class="page-enter">
  <div class="page-hdr">
    <div class="ph-left"><h1>Crowd flow</h1><p>AI movement prediction · density mapping · real-time corridors</p></div>
    <div class="ph-right">
      <button class="btn" onclick="showToast('Simulation running...','')">Run simulation</button>
      <button class="btn primary" onclick="showToast('Reroute activated','success')">Activate reroute</button>
    </div>
  </div>
  <div class="metrics">
    <div class="metric"><div class="metric-label">In motion now</div><div class="metric-value" style="color:var(--blu)">12,440</div><div class="metric-delta">Moving through corridors</div></div>
    <div class="metric"><div class="metric-label">Peak density</div><div class="metric-value text-red">3.2/m²</div><div class="metric-delta delta-dn">Gate 4 · Critical</div></div>
    <div class="metric"><div class="metric-label">Predicted rush</div><div class="metric-value delta-amb">22:40</div><div class="metric-delta">Post-match exit wave</div></div>
    <div class="metric"><div class="metric-label">Reroutes today</div><div class="metric-value">7</div><div class="metric-delta delta-up">Avg. 4 min saved</div></div>
  </div>
  <div class="grid2">
    <div class="card">
      <div class="card-title">Corridor congestion</div>
      ${[
        {n:'Gate 4 → Section D',p:88},{n:'North Concourse',p:71},{n:'West Concourse',p:62},
        {n:'South Exit Tunnel',p:44},{n:'Level 2 Concourse',p:33},{n:'VIP Entrance',p:19},
      ].map(c=>`<div class="bar-row">
        <div class="bar-header"><div class="bar-name">${c.n}</div><div class="bar-val" style="color:${pctColor(c.p)}">${c.p}%</div></div>
        <div class="bar-track"><div class="bar-fill" style="width:${c.p}%;background:${pctColor(c.p)}"></div></div>
      </div>`).join('')}
    </div>
    <div class="card">
      <div class="card-title">AI recommendations</div>
      ${d.crowdAI.map(r=>`<div class="ai-card" style="background:${r.bg};border:1px solid ${r.border}">
        <div class="ai-card-tag" style="color:${r.color}">${r.label}</div>
        <div class="ai-card-body">${r.text}</div>
      </div>`).join('')}
    </div>
  </div>
</div>`;
}

// ── Queue Manager ──
function renderQueues() {
  return `
<div class="page-enter">
  <div class="page-hdr">
    <div class="ph-left"><h1>Queue manager</h1><p>Live wait times · smart load balancing · staff allocation</p></div>
    <div class="ph-right">
      <button class="btn" onclick="redistQueues()">Auto-redistribute</button>
      <button class="btn primary" onclick="openGate7()">Open Gate 7</button>
    </div>
  </div>
  <div class="grid2 mb-12">
    <div class="card">
      <div class="card-title">Entry gates</div>
      <div id="gate-bars"></div>
    </div>
    <div class="card">
      <div class="card-title">Concession stands</div>
      <div id="conc-bars"></div>
    </div>
  </div>
  <div class="card">
    <div class="card-title">Smart queue analytics</div>
    <div class="table-wrap">
      <table>
        <tr><th>Location</th><th>Wait</th><th>Queue size</th><th>Staff</th><th>AI suggestion</th><th>Status</th></tr>
        <tr><td>Gate 4</td><td style="color:var(--red);font-weight:600">28m</td><td>410 pax</td><td>6</td><td style="color:var(--t3);font-size:11px">Add 3 staff · open lane 5</td><td><span class="badge b-red">Critical</span></td></tr>
        <tr><td>Concession B3</td><td style="color:var(--amb);font-weight:600">19m</td><td>180 pax</td><td>4</td><td style="color:var(--t3);font-size:11px">Mobile order pickup lanes</td><td><span class="badge b-amb">High</span></td></tr>
        <tr><td>Restroom Block C</td><td style="color:var(--amb);font-weight:600">11m</td><td>70 pax</td><td>2</td><td style="color:var(--t3);font-size:11px">Direct to Block D (3 min)</td><td><span class="badge b-amb">Medium</span></td></tr>
        <tr><td>Gate 2</td><td style="color:var(--grn);font-weight:600">4m</td><td>55 pax</td><td>8</td><td style="color:var(--t3);font-size:11px">Reallocate 2 staff to Gate 4</td><td><span class="badge b-grn">Low</span></td></tr>
        <tr><td>First Aid Station</td><td style="color:var(--grn);font-weight:600">2m</td><td>8 pax</td><td>5</td><td style="color:var(--t3);font-size:11px">Nominal</td><td><span class="badge b-grn">Good</span></td></tr>
      </table>
    </div>
  </div>
</div>`;
}

let gateData = JSON.parse(JSON.stringify(RoaryData.gates));
function renderBarList(data, elId) {
  const el = document.getElementById(elId);
  if (!el) return;
  el.innerHTML = data.map(g=>`<div class="bar-row">
    <div class="bar-header">
      <div class="bar-name">${g.name}</div>
      <div class="bar-val" style="color:${pctColor(g.pct)}">${g.wait}m wait</div>
    </div>
    <div class="bar-track"><div class="bar-fill" style="width:${g.pct}%;background:${pctColor(g.pct)}"></div></div>
  </div>`).join('');
}
function redistQueues() {
  gateData[3].wait=14; gateData[3].pct=47;
  gateData[0].wait=10; gateData[0].pct=33;
  gateData[1].wait=9; gateData[1].pct=30;
  renderBarList(gateData,'gate-bars');
  showToast('Gates redistributed — Gate 4 relieving','success');
}
function openGate7() {
  if (!gateData.find(g=>g.name==='Gate 7')) gateData.push({name:'Gate 7 (new)',wait:2,pct:7});
  renderBarList(gateData,'gate-bars');
  showToast('Gate 7 opened','success');
}

// ── Wayfinding ──
function renderWayfinding() {
  return `
<div class="page-enter">
  <div class="page-hdr">
    <div class="ph-left"><h1>Wayfinding</h1><p>Dynamic indoor navigation · exit routing · accessibility</p></div>
  </div>
  <div class="grid2">
    <div class="card">
      <div class="card-title">Journey planner</div>
      <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:14px">
        <div>
          <div style="font-size:10px;color:var(--t3);margin-bottom:5px">From</div>
          <select style="width:100%">
            <option>Section D3 · Row 22</option>
            <option>Gate 1 Entrance</option>
            <option>North Concourse</option>
            <option>Parking Zone A</option>
          </select>
        </div>
        <div>
          <div style="font-size:10px;color:var(--t3);margin-bottom:5px">To</div>
          <select style="width:100%">
            <option>Nearest restroom</option>
            <option>Concession Stand B2</option>
            <option>Exit Gate 5</option>
            <option>First Aid Station</option>
            <option>Team Store</option>
          </select>
        </div>
        <button class="btn primary" onclick="planRoute()">Find optimal route</button>
      </div>
      <div id="route-result" style="display:none;background:rgba(34,197,94,.06);border:1px solid rgba(34,197,94,.2);border-radius:var(--r1);padding:12px">
        <div style="font-size:9px;color:var(--grn);font-family:var(--fh);font-weight:700;letter-spacing:.5px;margin-bottom:8px">OPTIMAL ROUTE</div>
        <div class="route-step">
          <span class="route-node">Section D3</span>
          <span class="route-arrow">›</span>
          <span class="route-node">Ramp B</span>
          <span class="route-arrow">›</span>
          <span class="route-node" style="border-color:rgba(34,197,94,.4);color:var(--grn)">Restroom C4</span>
        </div>
        <div style="font-size:10px;color:var(--t3);margin-top:8px">3 min · 180m · Avoiding Gate 4 congestion</div>
      </div>
    </div>
    <div class="card">
      <div class="card-title">Exit wave plan</div>
      <div id="exit-phases">
        ${RoaryData.exitPhases.map(p=>`<div class="exit-phase-row" id="ep-${p.time.replace(':','')}">
          <div class="exit-phase-time">${p.time}</div>
          <div class="exit-phase-action">${p.action}</div>
          <div class="exit-phase-status" style="color:${p.color}">${p.status}</div>
        </div>`).join('')}
      </div>
      <button class="btn" style="margin-top:12px;width:100%" onclick="animateExit()">Animate exit sequence</button>
    </div>
  </div>
  <div class="card">
    <div class="card-title">AI wayfinding performance</div>
    <div class="grid3">
      <div class="mini-stat"><div class="mini-stat-val text-grn">12,441</div><div class="mini-stat-label">Routes calculated today</div></div>
      <div class="mini-stat"><div class="mini-stat-val text-grn">0.4s</div><div class="mini-stat-label">Avg route calc time</div></div>
      <div class="mini-stat"><div class="mini-stat-val text-grn">4.2 min</div><div class="mini-stat-label">Avg time saved per fan</div></div>
    </div>
  </div>
</div>`;
}

function planRoute() {
  document.getElementById('route-result').style.display='block';
  showToast('Optimal route found · 3 min','success');
}
function animateExit() {
  let i=0;
  const rows=document.querySelectorAll('.exit-phase-row');
  function step(){ if(i<rows.length){ rows[i].style.background='rgba(34,197,94,.05)'; rows[i].style.borderRadius='4px'; rows[i].style.padding='4px 0'; i++; setTimeout(step,380); } }
  step();
  showToast('Exit simulation running...','');
}

// ── Analytics ──
function renderAnalytics() {
  return `
<div class="page-enter">
  <div class="page-hdr">
    <div class="ph-left"><h1>Analytics</h1><p>Historical trends · model performance · revenue insights</p></div>
    <div class="ph-right"><button class="btn" onclick="showToast('Report downloaded','success')">Download report</button></div>
  </div>
  <div class="grid3 mb-12">
    ${RoaryData.analyticsKPIs.map(k=>`<div class="metric">
      <div class="metric-label">${k.label}</div>
      <div class="metric-value" style="color:${k.color}">${k.val}${k.unit}</div>
      <div class="metric-delta" style="margin-top:4px">
        <div style="flex:1;height:3px;background:var(--b1);border-radius:2px;overflow:hidden">
          <div style="width:${Math.min(k.val,100)}%;height:100%;background:${k.color};border-radius:2px"></div>
        </div>
      </div>
      <div style="font-size:10px;color:var(--t3);margin-top:4px">${k.sublabel}</div>
    </div>`).join('')}
  </div>
  <div class="grid2 mb-12">
    <div class="card">
      <div class="card-title">Venue ingress / egress flow</div>
      <div style="font-size:11px;color:var(--t3);margin-bottom:10px">Rate of attendees entering and exiting over time</div>
      <div style="position:relative;height:240px"><canvas id="chart-analytics-flow"></canvas></div>
    </div>
    <div class="card">
      <div class="card-title">Zone density distribution</div>
      <div style="font-size:11px;color:var(--t3);margin-bottom:10px">Current state of all ${RoaryData.zones.length} venue zones</div>
      <div style="position:relative;height:240px">
        <canvas id="chart-donut"></canvas>
        <div class="donut-center">
          <div class="donut-num">${RoaryData.zones.length}</div>
          <div class="donut-label">ZONES</div>
        </div>
      </div>
    </div>
  </div>
  <div class="card">
    <div class="card-title">Facility wait times comparison</div>
    <div style="font-size:11px;color:var(--t3);margin-bottom:10px">Average wait times by facility (minutes)</div>
    <div style="position:relative;height:220px"><canvas id="chart-waittimes"></canvas></div>
  </div>
  <div class="card" style="margin-top:12px">
    <div class="card-title">Nightly model retraining pipeline</div>
    <div class="timeline-item"><div class="tl-title">00:00 — Data ingest</div><div class="tl-body">Gate logs, sensor streams, fan app queries aggregated into feature store</div></div>
    <div class="timeline-item"><div class="tl-title">00:30 — Feature engineering</div><div class="tl-body">Crowd density deltas, queue velocity, exit wave signatures extracted</div></div>
    <div class="timeline-item"><div class="tl-title">01:00 — LSTM retrain</div><div class="tl-body">Crowd flow model updated on last 30 days · 91% accuracy gate</div></div>
    <div class="timeline-item"><div class="tl-title">02:30 — Deploy & validate</div><div class="tl-body">Canary deployment · auto-rollback if below 88% accuracy threshold</div></div>
  </div>
</div>`;
}
