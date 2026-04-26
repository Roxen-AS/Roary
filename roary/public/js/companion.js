// ─── Roary Fan Companion ───
let companionOpen = false;
let companionInited = false;

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

async function companionSend() {
  const inp = document.getElementById('companion-in');
  const val = inp.value.trim();
  if (!val) return;
  addCompanionMsg(val, 'user');
  inp.value = '';
  document.getElementById('companion-chips').innerHTML = '';

  try {
    const { response } = await api.post('/api/companion/chat', { message: val });
    setTimeout(() => {
      addCompanionMsg(response, 'ai');
      refreshChips();
    }, 300);
  } catch (err) {
    setTimeout(() => {
      addCompanionMsg('Sorry, I couldn\'t reach the assistant. Please try again.', 'ai');
      refreshChips();
    }, 300);
  }
}
