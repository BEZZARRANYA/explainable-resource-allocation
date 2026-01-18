console.log("✅ app.js loaded");

let workloadChart = null;
let breakdownChart = null;
let radarChart = null;

async function tryFetchJSON(urls) {
  let lastErr = null;
  for (const url of urls) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`${url} -> ${res.status} ${res.statusText}`);
      return await res.json();
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr || new Error("All fetch attempts failed");
}

function setStatus(msg) {
  const el = document.getElementById("status");
  if (el) el.textContent = msg;
}

function normalizeTask(t) {
  // supports {task_id, title} OR {id, name}
  return {
    id: t.task_id ?? t.id,
    title: t.title ?? t.name ?? t.task_title ?? "Untitled Task",
    raw: t
  };
}

function normalizeEmployee(e) {
  // supports multiple shapes
  return {
    name: e.name ?? e.employee_name ?? "Unknown",
    role: e.role ?? e.job ?? "",
    current_workload: e.current_workload ?? e.workload ?? 0,
    availability: e.availability ?? (e.availability_score ?? 0),
    // for radar (default 0 if missing)
    skill_python: e.skill_python ?? 0,
    skill_ml: e.skill_ml ?? 0,
    skill_backend: e.skill_backend ?? 0,
    skill_frontend: e.skill_frontend ?? 0,
    raw: e
  };
}

function updateMetrics(employees, tasks) {
  const elEmp = document.getElementById("metricEmployees");
  const elTasks = document.getElementById("metricTasks");
  const elAvg = document.getElementById("metricWorkload");

  if (elEmp) elEmp.textContent = employees.length;
  if (elTasks) elTasks.textContent = tasks.length;

  const avg = employees.length
    ? Math.round(employees.reduce((s, e) => s + e.current_workload, 0) / employees.length)
    : 0;

  if (elAvg) elAvg.textContent = `${avg}%`;
}

function updateMiniCards(employees) {
  if (!employees.length) return;

  const maxW = employees.reduce((a, b) => a.current_workload > b.current_workload ? a : b);
  const maxA = employees.reduce((a, b) => a.availability > b.availability ? a : b);

  const elMaxW = document.getElementById("maxWorkload");
  const elMaxA = document.getElementById("maxAvailability");

  if (elMaxW) elMaxW.textContent = `${maxW.name} (${maxW.current_workload}%)`;
  if (elMaxA) elMaxA.textContent = `${maxA.name} (${Math.round(maxA.availability * 100)}%)`;
}

function renderWorkload(employees) {
  const canvas = document.getElementById("workloadChart");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (workloadChart) workloadChart.destroy();

  workloadChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: employees.map(e => e.name),
      datasets: [{ label: "Workload (%)", data: employees.map(e => e.current_workload) }]
    },
    options: { responsive: true, scales: { y: { beginAtZero: true, max: 100 } } }
  });
}

function renderBreakdown(expl) {
  const canvas = document.getElementById("breakdownChart");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (breakdownChart) breakdownChart.destroy();

  breakdownChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Skill match", "Workload", "Availability"],
      datasets: [{
        label: "Component score (0–1)",
        data: [expl.skill_match, expl.workload_score, expl.availability_score]
      }]
    },
    options: { responsive: true, scales: { y: { beginAtZero: true, max: 1 } } }
  });
}

function renderRadar(employee, task) {
  const canvas = document.getElementById("radarChart");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (radarChart) radarChart.destroy();

  // task fields may vary; default 0
  const req = {
    required_python: task.required_python ?? 0,
    required_ml: task.required_ml ?? 0,
    required_backend: task.required_backend ?? 0,
    required_frontend: task.required_frontend ?? 0,
  };

  radarChart = new Chart(ctx, {
    type: "radar",
    data: {
      labels: ["Python", "ML", "Backend", "Frontend"],
      datasets: [
        {
          label: "Employee (0–5)",
          data: [employee.skill_python, employee.skill_ml, employee.skill_backend, employee.skill_frontend]
        },
        {
          label: "Task (0–5)",
          data: [req.required_python, req.required_ml, req.required_backend, req.required_frontend]
        }
      ]
    },
    options: { responsive: true, scales: { r: { min: 0, max: 5, ticks: { stepSize: 1 } } } }
  });
}

function renderWhy(top) {
  const panel = document.getElementById("whyPanel");
  if (!panel) return;

  const emp = top.employee;
  const expl = top.explanation;

  panel.innerHTML = `
    <div class="fw-bold mb-1">Why ${emp.name}?</div>
    <ul class="mb-0">
      <li>Skill match contribution: <b>${expl.skill_match}</b></li>
      <li>Workload contribution: <b>${expl.workload_score}</b> (workload ${emp.current_workload}%)</li>
      <li>Availability contribution: <b>${expl.availability_score}</b> (availability ${Math.round(emp.availability * 100)}%)</li>
    </ul>
  `;
}

function renderResults(payload) {
  const results = document.getElementById("results");
  if (!results) return;

  results.innerHTML = "";

  const topk = payload.top_k || payload.recommendations || [];
  if (!topk.length) {
    results.innerHTML = `
      <div class="empty-state">
        <div class="empty-title">No results yet</div>
        <div>Run an allocation to see Top-K employees and explanations.</div>
      </div>
    `;
    return;
  }

  topk.forEach((item, idx) => {
    const emp = normalizeEmployee(item.employee);
    const div = document.createElement("div");
    div.className = "result-item";
    div.innerHTML = `
      <div class="d-flex justify-content-between align-items-start gap-2">
        <div>
          <div class="fw-bold">#${idx + 1} ${emp.name}</div>
          <div class="text-muted small">${emp.role}</div>
        </div>
        <span class="badge-score">Score: ${Number(item.score).toFixed(3)}</span>
      </div>
      <div class="kv">
        <div>Skill: <b>${item.explanation.skill_match}</b></div>
        <div>Workload: <b>${item.explanation.workload_score}</b></div>
        <div>Availability: <b>${item.explanation.availability_score}</b></div>
      </div>
    `;
    results.appendChild(div);
  });

  const top = topk[0];
  const topEmp = normalizeEmployee(top.employee);

  // draw explainability
  renderBreakdown(top.explanation);

  // if backend returns task in payload, use it; otherwise read selected task text only
  const task = payload.task || {};
  renderRadar(topEmp, task);

  renderWhy({ employee: topEmp, explanation: top.explanation });
}

async function init() {
  try {
    setStatus("Loading…");

    // health (optional)
    try {
      const h = await tryFetchJSON(["/health", "/api/health"]);
      setStatus(`ok — ${h.service || "service"}`);
    } catch {
      setStatus("ok");
    }

    // tasks + employees (try multiple routes)
    const rawTasks = await tryFetchJSON(["/tasks", "/api/tasks"]);
    const rawEmployees = await tryFetchJSON(["/employees", "/api/employees"]);

    const tasks = (rawTasks || []).map(normalizeTask);
    const employees = (rawEmployees || []).map(normalizeEmployee);

    const select = document.getElementById("taskSelect");
    if (select) {
      select.innerHTML = tasks
        .map(t => `<option value="${t.id}">#${t.id} — ${t.title}</option>`)
        .join("");
    }

    updateMetrics(employees, tasks);
    updateMiniCards(employees);
    renderWorkload(employees);

  } catch (err) {
    console.error(err);
    setStatus(`Error: ${err.message}`);
  }
}

async function runRecommend() {
  try {
    const taskId = document.getElementById("taskSelect")?.value;
    const k = Number(document.getElementById("topK")?.value || 3);

    if (!taskId) {
      setStatus("No task loaded (tasks fetch failed).");
      return;
    }

    setStatus("Running allocation…");

    // try multiple recommend endpoints
    const payload = await tryFetchJSON([
      `/recommend?task_id=${taskId}&k=${k}`,
      `/api/recommend?task_id=${taskId}&k=${k}`
    ]);

    renderResults(payload);
    setStatus("ok — recommendations ready");
  } catch (err) {
    console.error(err);
    setStatus(`Error: ${err.message}`);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  init();
  const btn = document.getElementById("btnRecommend");
  if (btn) btn.addEventListener("click", runRecommend);
});

