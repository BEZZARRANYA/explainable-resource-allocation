let workloadChart = null;

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return await res.json();
}

function setStatus(msg) {
  document.getElementById("status").textContent = msg;
}

function renderResults(payload) {
  const results = document.getElementById("results");
  results.innerHTML = "";

  payload.top_k.forEach((item, idx) => {
    const emp = item.employee;
    const score = item.score;

    const div = document.createElement("div");
    div.className = "result-item";

    div.innerHTML = `
      <div class="d-flex justify-content-between align-items-center">
        <div>
          <strong>#${idx + 1} ${emp.name}</strong>
          <div class="text-muted small">${emp.role}</div>
        </div>
        <span class="badge bg-success badge-score">Score: ${score.toFixed(3)}</span>
      </div>
      <div class="mt-2 small">
        <div><b>Skill Match:</b> ${item.explanation.skill_match}</div>
        <div><b>Workload Score:</b> ${item.explanation.workload_score}</div>
        <div><b>Availability Score:</b> ${item.explanation.availability_score}</div>
      </div>
    `;
    results.appendChild(div);
  });
}

function renderWorkload(employees) {
  const labels = employees.map(e => e.name);
  const data = employees.map(e => e.current_workload);

  const ctx = document.getElementById("workloadChart").getContext("2d");
  if (workloadChart) workloadChart.destroy();

  workloadChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [{ label: "Workload (%)", data }]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true, max: 100 }
      }
    }
  });
}

async function init() {
  try {
    const health = await fetchJSON("/health");
    setStatus(`✅ ${health.status} — ${health.service}`);

    const tasks = await fetchJSON("/tasks");
    const select = document.getElementById("taskSelect");
    select.innerHTML = tasks
      .map(t => `<option value="${t.task_id}">#${t.task_id} — ${t.title}</option>`)
      .join("");

    const employees = await fetchJSON("/employees");
    renderWorkload(employees);

    document.getElementById("btnRecommend").addEventListener("click", async () => {
      const taskId = select.value;
      const k = document.getElementById("topK").value || 3;
      const rec = await fetchJSON(`/recommend?task_id=${taskId}&k=${k}`);
      renderResults(rec);
    });

  } catch (err) {
    setStatus(`❌ ${err.message}`);
  }
}

init();

