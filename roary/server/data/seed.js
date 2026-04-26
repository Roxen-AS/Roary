// ─── Roary Seed Data ───
// Moved from js/data.js — single source of truth for backend

function genTimeSeries(points, base, variance, trend) {
  const data = [];
  let v = base;
  for (let i = 0; i < points; i++) {
    v += (Math.random() - 0.45) * variance + (trend || 0);
    v = Math.max(0, v);
    data.push(Math.round(v));
  }
  return data;
}

function genTimeLabels(points, startHour, startMin, intervalMin) {
  const labels = [];
  let mins = startHour * 60 + startMin;
  for (let i = 0; i < points; i++) {
    const h = Math.floor(mins / 60) % 24;
    const m = mins % 60;
    labels.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
    mins += intervalMin;
  }
  return labels;
}

const RoaryData = {

  event: {
    name: 'MI vs RCB · IPL 2026',
    venue: 'Wankhede Stadium',
    status: 'live',
    capacity: 80000,
    attendance: 79340,
    over: 44
  },

  zones: [
    { id: 'z1', name: 'Main Entrance', type: 'ENTRANCE', occ: 1650, cap: 2000, wait: 12, status: 'high' },
    { id: 'z2', name: 'South Gate', type: 'ENTRANCE', occ: 450, cap: 1500, wait: 5, status: 'moderate' },
    { id: 'z3', name: 'Section A · Lower Bowl', type: 'SEATING', occ: 7200, cap: 8000, wait: 2, status: 'high' },
    { id: 'z4', name: 'Section B · Upper Deck', type: 'SEATING', occ: 2100, cap: 5000, wait: 1, status: 'moderate' },
    { id: 'z5', name: 'VIP Lounge', type: 'VIP', occ: 380, cap: 500, wait: 3, status: 'high' },
    { id: 'z6', name: 'North Concourse', type: 'CONCOURSE', occ: 2800, cap: 3000, wait: 18, status: 'critical' },
    { id: 'z7', name: 'South Concourse', type: 'CONCOURSE', occ: 1200, cap: 3000, wait: 7, status: 'moderate' },
    { id: 'z8', name: 'Food Court Alpha', type: 'FOOD COURT', occ: 950, cap: 1200, wait: 14, status: 'high' },
    { id: 'z9', name: 'Food Court Beta', type: 'FOOD COURT', occ: 480, cap: 1200, wait: 8, status: 'moderate' },
    { id: 'z10', name: 'Parking Zone A', type: 'PARKING', occ: 1900, cap: 2000, wait: 25, status: 'critical' },
    { id: 'z11', name: 'Parking Zone B', type: 'PARKING', occ: 1100, cap: 2000, wait: 10, status: 'moderate' },
    { id: 'z12', name: 'Medical Center', type: 'MEDICAL', occ: 12, cap: 100, wait: 2, status: 'low' },
    { id: 'z13', name: 'Restroom Block 1', type: 'RESTROOM', occ: 180, cap: 200, wait: 11, status: 'high' },
    { id: 'z14', name: 'Restroom Block 2', type: 'RESTROOM', occ: 60, cap: 200, wait: 3, status: 'low' },
  ],

  facilities: [
    { id: 'f1', name: 'Main Restroom Block A', loc: 'North Concourse', type: 'restroom', status: 'busy', wait: 8 },
    { id: 'f2', name: 'Restroom Block B', loc: 'South Concourse', type: 'restroom', status: 'open', wait: 2 },
    { id: 'f3', name: 'Hawks Grill · Stand 1', loc: 'Food Court Alpha', type: 'food', status: 'busy', wait: 14 },
    { id: 'f4', name: 'Tacos & More · Stand 2', loc: 'Food Court Alpha', type: 'food', status: 'busy', wait: 11 },
    { id: 'f5', name: 'Pizza Corner · Stand 3', loc: 'Food Court Beta', type: 'food', status: 'open', wait: 5 },
    { id: 'f6', name: 'Craft Beer Bar', loc: 'Food Court Beta', type: 'food', status: 'open', wait: 8 },
    { id: 'f7', name: 'Medical Station Alpha', loc: 'Medical Center', type: 'medical', status: 'open', wait: 2 },
    { id: 'f8', name: 'First Aid Post · Gate A', loc: 'Main Entrance', type: 'medical', status: 'open', wait: 1 },
    { id: 'f9', name: 'ATM Cluster · Concourse N', loc: 'North Concourse', type: 'atm', status: 'open', wait: 5 },
    { id: 'f10', name: 'ATM · South Concourse', loc: 'South Concourse', type: 'atm', status: 'open', wait: 1 },
    { id: 'f11', name: 'Official Merchandise Store', loc: 'South Concourse', type: 'merchandise', status: 'busy', wait: 7 },
    { id: 'f12', name: 'Water Station 1', loc: 'Section A · Lower Bowl', type: 'food', status: 'open', wait: 0 },
    { id: 'f13', name: 'Parking Shuttle Stop A', loc: 'Parking Zone A', type: 'atm', status: 'full', wait: 25 },
    { id: 'f14', name: 'Parking Shuttle Stop B', loc: 'Parking Zone B', type: 'atm', status: 'open', wait: 10 },
  ],

  staff: [
    { id: 's1', name: 'Marcus Johnson', initials: 'MJ', role: 'Security', assignment: 'Main Entrance', contact: '+1-555-0101', status: 'busy', color: '#3b82f6' },
    { id: 's2', name: 'Sarah Chen', initials: 'SC', role: 'Security', assignment: 'North Concourse', contact: '+1-555-0102', status: 'busy', color: '#a855f7' },
    { id: 's3', name: 'James Williams', initials: 'JW', role: 'Security', assignment: 'VIP Lounge', contact: '+1-555-0103', status: 'available', color: '#06b6d4' },
    { id: 's4', name: 'Priya Patel', initials: 'PP', role: 'Medical', assignment: 'Medical Center', contact: '+1-555-0104', status: 'available', color: '#22c55e' },
    { id: 's5', name: 'David Kim', initials: 'DK', role: 'Medical', assignment: 'Section A · Lower Bowl', contact: '+1-555-0105', status: 'busy', color: '#f59e0b' },
    { id: 's6', name: 'Emma Rodriguez', initials: 'ER', role: 'Usher', assignment: 'Section A · Lower Bowl', contact: '+1-555-0106', status: 'available', color: '#ef4444' },
    { id: 's7', name: 'Raj Mehta', initials: 'RM', role: 'Operations', assignment: 'Gate 4', contact: '+1-555-0107', status: 'busy', color: '#3b82f6' },
    { id: 's8', name: 'Anita Singh', initials: 'AS', role: 'Usher', assignment: 'South Concourse', contact: '+1-555-0108', status: 'available', color: '#22c55e' },
    { id: 's9', name: 'Tom Baker', initials: 'TB', role: 'Security', assignment: 'Parking Zone A', contact: '+1-555-0109', status: 'busy', color: '#f59e0b' },
    { id: 's10', name: 'Neha Verma', initials: 'NV', role: 'Medical', assignment: 'First Aid Post A', contact: '+1-555-0110', status: 'available', color: '#a855f7' },
  ],

  events: [
    { id: 'e1', name: 'MI vs RCB', venue: 'Wankhede Stadium', date: 'Mon, Apr 14 · 7:30 PM', status: 'live', attendance: 79340, capacity: 80000 },
    { id: 'e2', name: 'Spring Music Festival 2026', venue: 'Wankhede Stadium', date: 'Tue, Apr 21 · 6:00 PM', status: 'upcoming', attendance: 0, capacity: 55000 },
    { id: 'e3', name: 'Champions League Playoff', venue: 'Wankhede Stadium', date: 'Wed, Apr 29 · 7:00 PM', status: 'upcoming', attendance: 0, capacity: 20000 },
  ],

  alerts: [
    { id: 'a1', title: 'Gate 4 overcrowding', severity: 'high', type: 'Overcrowding', location: 'Gate 4 Corridor', desc: 'Entry flow backed up significantly. Density 3.2/m² exceeds safe threshold. Additional gates needed.', time: '21:20', status: 'active' },
    { id: 'a2', title: 'Medical assistance required', severity: 'high', type: 'Medical', location: 'Section A · Lower Bowl', desc: 'Attendee reported feeling unwell near Section A. Medical team dispatched.', time: '21:22', status: 'active' },
    { id: 'a3', title: 'Restroom Block 1 overflow', severity: 'medium', type: 'Facility Issue', location: 'Restroom Block 1', desc: 'Restroom Block 1 overflow and long queues. Maintenance dispatched.', time: '21:24', status: 'active' },
    { id: 'a4', title: 'Parking Zone A at capacity', severity: 'medium', type: 'Capacity', location: 'Parking Zone A', desc: 'Parking Zone A has reached maximum capacity. Redirecting to Zone B.', time: '20:55', status: 'resolved' },
    { id: 'a5', title: 'Concession stand B3 spike', severity: 'low', type: 'Queue', location: 'Food Court Beta', desc: 'Wait time spiked to 19 min. Dynamic pricing activated.', time: '20:40', status: 'resolved' },
  ],

  gates: [
    { name: 'Gate 1', wait: 6, pct: 20 },
    { name: 'Gate 2', wait: 4, pct: 13 },
    { name: 'Gate 3', wait: 9, pct: 30 },
    { name: 'Gate 4', wait: 28, pct: 93 },
    { name: 'Gate 5', wait: 12, pct: 40 },
    { name: 'Gate 6', wait: 7, pct: 23 },
  ],

  concessions: [
    { name: 'Stand A1 · Chai & Snacks', wait: 8, pct: 27 },
    { name: 'Stand B3 · Biryani Counter', wait: 19, pct: 63 },
    { name: 'Stand C2 · Beverages', wait: 14, pct: 47 },
    { name: 'Stand D1 · Fast Food', wait: 6, pct: 20 },
    { name: 'VIP Lounge Bar', wait: 3, pct: 10 },
  ],

  crowdAI: [
    { type: 'active', label: 'ACTIVE REDIRECT', color: '#ef4444', bg: 'rgba(239,68,68,0.06)', border: 'rgba(239,68,68,0.18)', text: 'Gate 4 overflow routed via North concourse. Signage A12–A16 updated. Density relief expected in ~6 min.' },
    { type: 'predicted', label: 'PREDICTED · 22:40', color: '#f59e0b', bg: 'rgba(245,158,11,0.06)', border: 'rgba(245,158,11,0.18)', text: 'Exit wave: 68k attendees in 18 min window. Pre-open South Gates 7 & 8 at 22:30 recommended.' },
    { type: 'suggestion', label: 'SUGGESTION', color: '#3b82f6', bg: 'rgba(59,130,246,0.06)', border: 'rgba(59,130,246,0.18)', text: 'Upper tier concourse at 32% capacity. Nudging food stalls upward may redistribute 800–1,200 fans.' },
    { type: 'suggestion', label: 'OPPORTUNITY', color: '#a855f7', bg: 'rgba(168,85,247,0.06)', border: 'rgba(168,85,247,0.18)', text: '28 premium seats available in West D Block 4. Push upgrade offer to 142 eligible fans from ₹800.' },
  ],

  exitPhases: [
    { time: '22:30', action: 'Open Gates 7 & 8 (South)', status: 'Scheduled', color: '#3b82f6' },
    { time: '22:35', action: 'Activate all exit signage boards', status: 'Scheduled', color: '#3b82f6' },
    { time: '22:40', action: 'Match end · all gates open', status: 'Scheduled', color: '#3b82f6' },
    { time: '22:44', action: 'Wave 1 · Upper tier (22,000 fans)', status: 'Predicted', color: '#f59e0b' },
    { time: '22:52', action: 'Wave 2 · Lower tier (41,000 fans)', status: 'Predicted', color: '#f59e0b' },
    { time: '23:03', action: 'Venue cleared to under 2,000', status: 'Target', color: '#22c55e' },
  ],

  analyticsKPIs: [
    { label: 'Crowd model accuracy', val: 91, unit: '%', sublabel: 'LSTM · 6-min horizon', color: '#22c55e' },
    { label: 'Queue reduction', val: 67, unit: '%', sublabel: 'vs. unassisted baseline', color: '#22c55e' },
    { label: 'Fan AI resolution', val: 93, unit: '%', sublabel: '12k concurrent sessions', color: '#22c55e' },
    { label: 'Decision latency', val: 1.8, unit: 's', sublabel: 'Sensor to signage update', color: '#3b82f6' },
    { label: 'Revenue uplift est.', val: 22, unit: '%', sublabel: 'Upgrades + routing', color: '#a855f7' },
    { label: 'Exit wave safety', val: 65, unit: '%', sublabel: 'Improvement vs. baseline', color: '#f59e0b' },
  ],
};

RoaryData.chartData = {
  crowdFlow: {
    labels: genTimeLabels(36, 7, 16, 10),
    entrance: genTimeSeries(36, 400, 120, 8),
    exit: genTimeSeries(36, 80, 60, 2),
  },
  ingress: {
    labels: genTimeLabels(18, 18, 0, 5),
    values: [1200, 2800, 4100, 6200, 8900, 7200, 4400, 3100, 2800, 2300, 1800, 1500, 1200, 980, 620, 450, 300, 200],
  },
};

// Mutable state (live simulation)
const liveState = {
  attendance: RoaryData.event.attendance,
  alerts: JSON.parse(JSON.stringify(RoaryData.alerts)),
  gates: JSON.parse(JSON.stringify(RoaryData.gates)),
  concessions: JSON.parse(JSON.stringify(RoaryData.concessions)),
};

module.exports = { RoaryData, liveState };
