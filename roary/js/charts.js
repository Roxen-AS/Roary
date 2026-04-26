// ─── Roary Charts ───
const RoaryCharts = {};
let _chartInstances = {};

function destroyChart(id) {
  if (_chartInstances[id]) {
    _chartInstances[id].destroy();
    delete _chartInstances[id];
  }
}

function buildCrowdFlowChart(canvasId) {
  destroyChart(canvasId);
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;
  const d = RoaryData.chartData.crowdFlow;
  const step = Math.floor(d.labels.length / 6);
  const displayLabels = d.labels.map((l, i) => i % step === 0 ? l : '');

  _chartInstances[canvasId] = new Chart(ctx, {
    type: 'line',
    data: {
      labels: d.labels,
      datasets: [
        {
          label: 'Entrance Rate',
          data: d.entrance,
          borderColor: '#06b6d4',
          backgroundColor: 'rgba(6,182,212,0.15)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 4,
        },
        {
          label: 'Exit Rate',
          data: d.exit,
          borderColor: '#d4537e',
          backgroundColor: 'rgba(212,83,126,0.12)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 4,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: {
          position: 'bottom',
          labels: { color: '#a1a1aa', font: { size: 11, family: 'Inter' }, boxWidth: 12, padding: 16 }
        },
        tooltip: {
          backgroundColor: '#18181c',
          borderColor: 'rgba(255,255,255,0.1)',
          borderWidth: 1,
          titleColor: '#f4f4f5',
          bodyColor: '#a1a1aa',
          padding: 10,
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#52525b', font: { size: 10 },
            callback: (val, i) => displayLabels[i] || '',
            maxRotation: 0,
          },
          grid: { color: 'rgba(255,255,255,0.04)' },
          border: { color: 'rgba(255,255,255,0.06)' }
        },
        y: {
          ticks: { color: '#52525b', font: { size: 10 } },
          grid: { color: 'rgba(255,255,255,0.04)' },
          border: { color: 'rgba(255,255,255,0.06)' }
        }
      }
    }
  });
}

function buildIngressChart(canvasId) {
  destroyChart(canvasId);
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;
  const d = RoaryData.chartData.ingress;

  _chartInstances[canvasId] = new Chart(ctx, {
    type: 'line',
    data: {
      labels: d.labels,
      datasets: [{
        label: 'Ingress (fans/5min)',
        data: d.values,
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34,197,94,0.12)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 4,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#18181c',
          borderColor: 'rgba(255,255,255,0.1)',
          borderWidth: 1,
          titleColor: '#f4f4f5',
          bodyColor: '#a1a1aa',
          padding: 8,
        }
      },
      scales: {
        x: {
          ticks: { color: '#52525b', font: { size: 10 }, maxRotation: 0 },
          grid: { color: 'rgba(255,255,255,0.04)' },
          border: { color: 'rgba(255,255,255,0.06)' }
        },
        y: {
          ticks: { color: '#52525b', font: { size: 10 } },
          grid: { color: 'rgba(255,255,255,0.04)' },
          border: { color: 'rgba(255,255,255,0.06)' }
        }
      }
    }
  });
}

function buildDonutChart(canvasId) {
  destroyChart(canvasId);
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;

  const zones = RoaryData.zones;
  const counts = { low:0, moderate:0, high:0, critical:0 };
  zones.forEach(z => counts[z.status]++);

  _chartInstances[canvasId] = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Low','Moderate','High','Critical'],
      datasets: [{
        data: [counts.low, counts.moderate, counts.high, counts.critical],
        backgroundColor: ['#22c55e','#f59e0b','#f97316','#ef4444'],
        borderColor: '#111114',
        borderWidth: 3,
        hoverBorderColor: '#18181c',
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '68%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: { color: '#a1a1aa', font: { size: 11, family: 'Inter' }, boxWidth: 10, padding: 12 }
        },
        tooltip: {
          backgroundColor: '#18181c',
          borderColor: 'rgba(255,255,255,0.1)',
          borderWidth: 1,
          titleColor: '#f4f4f5',
          bodyColor: '#a1a1aa',
        }
      }
    }
  });
}

function buildWaitTimesChart(canvasId) {
  destroyChart(canvasId);
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;
  const facs = RoaryData.facilities.slice(0, 10);
  const colors = facs.map(f => f.wait > 12 ? '#ef4444' : f.wait > 6 ? '#f59e0b' : '#22c55e');

  _chartInstances[canvasId] = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: facs.map(f => f.name.split('·')[0].trim().split(' ').slice(0,2).join(' ')),
      datasets: [{
        label: 'Wait time (min)',
        data: facs.map(f => f.wait),
        backgroundColor: colors,
        borderRadius: 4,
        borderSkipped: false,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#18181c',
          borderColor: 'rgba(255,255,255,0.1)',
          borderWidth: 1,
          titleColor: '#f4f4f5',
          bodyColor: '#a1a1aa',
        }
      },
      scales: {
        x: {
          ticks: { color: '#52525b', font: { size: 10 }, maxRotation: 30 },
          grid: { display: false },
          border: { color: 'rgba(255,255,255,0.06)' }
        },
        y: {
          ticks: { color: '#52525b', font: { size: 10 } },
          grid: { color: 'rgba(255,255,255,0.04)' },
          border: { color: 'rgba(255,255,255,0.06)' }
        }
      }
    }
  });
}

// Live update — push new data point to crowd flow chart
function tickCrowdChart() {
  const inst = _chartInstances['chart-crowd-flow'];
  if (!inst) return;
  const d = RoaryData.chartData.crowdFlow;
  const newE = Math.max(0, Math.round(d.entrance[d.entrance.length-1] + (Math.random()-0.45)*80));
  const newX = Math.max(0, Math.round(d.exit[d.exit.length-1] + (Math.random()-0.48)*30));
  const now = new Date();
  const label = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
  d.labels.push(label); d.labels.shift();
  d.entrance.push(newE); d.entrance.shift();
  d.exit.push(newX); d.exit.shift();
  inst.update('none');
}

setInterval(tickCrowdChart, 3000);
