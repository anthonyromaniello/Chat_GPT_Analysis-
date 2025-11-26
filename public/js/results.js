// public/js/results.js
async function fetchResults() {
  try {
    const r = await fetch('/api/results');
    if (!r.ok) throw new Error('No results yet');
    return await r.json();
  } catch (err) {
    console.warn('Could not fetch /api/results:', err);
    // fallback dummy data for development
    return {
      total_processed: 30,
      avg_response_time_ms: 1830,
      by_domain: {
        "Computer Security": { count: 10, avg_response_time: 2100, accuracy: 0.65 },
        "Prehistory": { count: 10, avg_response_time: 1600, accuracy: 0.72 },
        "Sociology": { count: 10, avg_response_time: 1790, accuracy: 0.60 }
      }
    };
  }
}

function renderCharts(data) {
  const domains = Object.keys(data.by_domain);
  const accValues = domains.map(d => {
    // If backend doesn't provide accuracy, use placeholder or compute later
    return (data.by_domain[d].accuracy !== undefined)
      ? Math.round(data.by_domain[d].accuracy * 100)
      : Math.round(Math.random() * 20 + 60);
  });
  const timeValues = domains.map(d => Math.round(data.by_domain[d].avg_response_time || data.by_domain[d].avg_response_time_ms || 0));

  // Accuracy bar chart
  const ctxA = document.getElementById('accuracyChart');
  new Chart(ctxA, {
    type: 'bar',
    data: {
      labels: domains,
      datasets: [{
        label: 'Accuracy (%)',
        data: accValues
      }]
    },
    options: { scales: { y: { beginAtZero: true, max: 100 } } }
  });

  // Response time line chart
  const ctxT = document.getElementById('timeChart');
  new Chart(ctxT, {
    type: 'line',
    data: {
      labels: domains,
      datasets: [{
        label: 'Avg Response Time (ms)',
        data: timeValues,
        fill: false,
        tension: 0.25
      }]
    },
    options: { scales: { y: { beginAtZero: true } } }
  });
}

function renderSummary(data) {
  const domains = Object.keys(data.by_domain);
  const times = domains.map(d => data.by_domain[d].avg_response_time || data.by_domain[d].avg_response_time_ms || 0);
  const avgAll = Math.round(times.reduce((a,b)=>a+b,0)/times.length || 0);
  const fastestDomain = domains[times.indexOf(Math.min(...times))];
  const bestAcc = domains.reduce((best, d)=> {
    const a = data.by_domain[d].accuracy ?? 0.65;
    return (a > (data.by_domain[best]?.accuracy ?? 0)) ? d : best;
  }, domains[0]);

  document.getElementById('summary').innerHTML = `
    <p><strong>Total processed:</strong> ${data.total_processed || 'N/A'}</p>
    <p><strong>Average response time (all):</strong> ${avgAll} ms</p>
    <p><strong>Fastest domain:</strong> ${fastestDomain}</p>
    <p><strong>Highest accuracy (approx):</strong> ${bestAcc}</p>
  `;
}

async function renderAnswersPreview() {
  try {
    const r = await fetch('/api/questions?limit=20'); // if your API supports limit, else fetch all
    const list = await r.json();
    const container = document.getElementById('answers');
    container.innerHTML = '';
    list.slice(0,20).forEach(q => {
      const el = document.createElement('div');
      el.className = 'answer-item';
      el.innerHTML = `
        <h4>${q.question}</h4>
        <p><strong>Expected:</strong> ${q.expected_answer || '—'}</p>
        <p><strong>ChatGPT:</strong> ${q.chatgpt_response || '<em>not processed</em>'}</p>
        <p><small>Domain: ${q.domain} • time: ${q.response_time_ms ?? '—'} ms</small></p>
        <hr>
      `;
      container.appendChild(el);
    });
  } catch (err) {
    console.warn('Could not fetch questions:', err);
    document.getElementById('answers').innerText = 'No preview available';
  }
}

async function main() {
  const data = await fetchResults();
  renderCharts(data);
  renderSummary(data);
  renderAnswersPreview();
}

main();
