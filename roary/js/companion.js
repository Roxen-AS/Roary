// ─── Roary Fan Companion ───
let companionOpen = false;
let companionInited = false;

const AI_RESPONSES = {
  restroom: 'Nearest restroom from Section D3: <strong>Block C · Level 2</strong>, ~2 min walk, currently 6 in queue (~3 min wait). Zero-queue option: Block D · Level 1 · 4 min walk.',
  food: 'Near you right now: <strong>Stand A1</strong> (Chai & Snacks, 0 wait, 1 min walk) or <strong>Stand D1</strong> (Fast Food, 6 min wait). Avoid Stand B3 — 19 min queue.',
  exit: 'Best exit from Section D3: <strong>Gate 5 West → Parking West P2</strong>. ~6 min walk. Avoid Gate 4 — critical congestion. I\'ll push a reminder 10 min before match end.',
  parking: '<strong>Parking East is 91% full.</strong> West P1–P3 has 400+ spots. Take North Concourse exit. ~12 min from your seat.',
  wait: 'Live waits: Gate 4 <strong style="color:var(--red)">28m ⚠</strong> · Gate 2 <strong style="color:var(--grn)">4m ✓</strong> · Stand B3 <strong style="color:var(--amb)">19m</strong> · Restroom C <strong style="color:var(--amb)">11m</strong>.',
  upgrade: 'Great news! <strong>28 premium seats</strong> are available in West Stand D Block 4 from ₹800. Want me to show you the upgrade options?',
  medical: 'Nearest first aid: <strong>First Aid Post · Gate A</strong>, ~4 min from Section D3. Currently 1 min wait. Also: Medical Station Alpha at the Medical Center.',
  score: 'MI are currently at <strong>187/4</strong> in 44 overs. RCB need 203 to win. Bumrah bowling next over!',
  default: 'I can help with directions, wait times, food, parking, upgrades, or medical assistance. What do you need?',
};

function getAIResponse(msg) {
  const m = msg.toLowerCase();
  if (m.includes('restroom') || m.includes('toilet') || m.includes('wash')) return AI_RESPONSES.restroom;
  if (m.includes('food') || m.includes('eat') || m.includes('drink') || m.includes('chai') || m.includes('biryani')) return AI_RESPONSES.food;
  if (m.includes('exit') || m.includes('leave') || m.includes('home') || m.includes('go out')) return AI_RESPONSES.exit;
  if (m.includes('park')) return AI_RESPONSES.parking;
  if (m.includes('wait') || m.includes('queue') || m.includes('long') || m.includes('how long')) return AI_RESPONSES.wait;
  if (m.includes('upgrade') || m.includes('better seat') || m.includes('premium')) return AI_RESPONSES.upgrade;
  if (m.includes('medical') || m.includes('first aid') || m.includes('doctor') || m.includes('help')) return AI_RESPONSES.medical;
  if (m.includes('score') || m.includes('match') || m.includes('cricket') || m.includes('run')) return AI_RESPONSES.score;
  return AI_RESPONSES.default;
}

const CHIPS = ['Nearest restroom?', 'Best food near me', 'How do I exit?', 'Parking status', 'Wait times now', 'Seat upgrade?'];

function toggleCompanion() {
  companionOpen = !companionOpen;
  document.getElementById('companion-panel').classList.toggle('open', companionOpen);
  if (companionOpen && !companionInited) initCompanion();
}

function initCompanion() {
  addCompanionMsg('Hi! I\'m <strong>Roary AI</strong>, your personal guide for today\'s MI vs RCB match. I know you\'re in <strong>Section D3, Row 22</strong> — I can navigate you anywhere in Wankhede in real time. What do you need?', 'ai');
  refreshChips();
  companionInited = true;
}

function addCompanionMsg(text, type) {
  const area = document.getElementById('companion-msgs');
  const m = document.createElement('div');
  m.className = `cmsg ${type}`;
  if (type === 'ai') m.innerHTML = `<div class="cmsg-tag">ROARY AI</div>${text}`;
  else m.textContent = text;
  area.appendChild(m);
  area.scrollTop = area.scrollHeight;
}

function refreshChips() {
  const el = document.getElementById('companion-chips');
  el.innerHTML = CHIPS.map(c => `<div class="c-chip" onclick="useChip('${c}')">${c}</div>`).join('');
}

function useChip(t) {
  document.getElementById('companion-in').value = t;
  companionSend();
}

function companionSend() {
  const inp = document.getElementById('companion-in');
  const val = inp.value.trim();
  if (!val) return;
  addCompanionMsg(val, 'user');
  inp.value = '';
  document.getElementById('companion-chips').innerHTML = '';
  setTimeout(() => {
    addCompanionMsg(getAIResponse(val), 'ai');
    refreshChips();
  }, 600);
}
