import sqlite3
from pathlib import Path
from typing import Dict, Any, List

from flask import Flask, jsonify, request
from flask import Flask, jsonify, request, render_template

app = Flask(__name__)

PROJECT_ROOT = Path(__file__).resolve().parent
DB_PATH = PROJECT_ROOT / "data" / "resource_allocation.db"


def get_conn():
    if not DB_PATH.exists():
        raise FileNotFoundError(
            f"Database not found at {DB_PATH}. Run: python db/init_db.py"
        )
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

@app.route("/", methods=["GET"])
def home():
    return render_template("dashboard.html")

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "service": "explainable-resource-allocation"})


@app.route("/employees", methods=["GET"])
def employees():
    with get_conn() as conn:
        rows = conn.execute("SELECT * FROM employees ORDER BY employee_id").fetchall()
    return jsonify([dict(r) for r in rows])


@app.route("/tasks", methods=["GET"])
def tasks():
    with get_conn() as conn:
        rows = conn.execute("SELECT * FROM tasks ORDER BY task_id").fetchall()
    return jsonify([dict(r) for r in rows])


def score_employee_for_task(emp: Dict[str, Any], task: Dict[str, Any]) -> Dict[str, Any]:
    """
    Transparent scoring baseline.
    Returns a score in [0, 1] and a human-readable explanation.
    """
    # Skill match: compare employee skills vs task requirements (0..5)
    skill_dims = ["python", "ml", "backend", "frontend"]
    match_parts = []
    match_total = 0.0

    for dim in skill_dims:
        e = emp[f"skill_{dim}"]
        r = task[f"required_{dim}"]
        # normalized match: 1.0 if meets/exceeds requirement, otherwise e/r
        if r == 0:
            m = 1.0
        else:
            m = min(e / r, 1.0)
        match_parts.append((dim, e, r, m))
        match_total += m

    skill_match = match_total / len(skill_dims)  # 0..1

    # Workload / availability: prefer lower workload and higher availability
    workload = emp["current_workload"] / 100.0
    availability = emp["availability"] / 100.0
    workload_score = 1.0 - workload
    availability_score = availability

    # Weighted score (simple, explainable)
    score = (
        0.60 * skill_match
        + 0.20 * workload_score
        + 0.20 * availability_score
    )

    explanation = {
        "skill_match": round(skill_match, 3),
        "workload_score": round(workload_score, 3),
        "availability_score": round(availability_score, 3),
        "details": [
            {
                "dimension": dim,
                "employee_skill": int(e),
                "required_skill": int(r),
                "normalized_match": round(m, 3),
            }
            for (dim, e, r, m) in match_parts
        ],
    }

    return {"score": float(round(score, 4)), "explanation": explanation}


@app.route("/recommend", methods=["GET"])
def recommend():
    task_id = request.args.get("task_id", type=int)
    k = request.args.get("k", default=3, type=int)

    if task_id is None:
        return jsonify({"error": "task_id is required"}), 400
    if k <= 0 or k > 20:
        return jsonify({"error": "k must be between 1 and 20"}), 400

    with get_conn() as conn:
        task_row = conn.execute("SELECT * FROM tasks WHERE task_id = ?", (task_id,)).fetchone()
        if task_row is None:
            return jsonify({"error": f"task_id {task_id} not found"}), 404
        task = dict(task_row)

        emp_rows = conn.execute("SELECT * FROM employees").fetchall()
        employees = [dict(r) for r in emp_rows]

    scored = []
    for emp in employees:
        out = score_employee_for_task(emp, task)
        scored.append({
            "employee": emp,
            "score": out["score"],
            "explanation": out["explanation"],
        })

    scored.sort(key=lambda x: x["score"], reverse=True)
    return jsonify({
        "task": task,
        "top_k": scored[:k]
    })


if __name__ == "__main__":
    app.run(debug=True)

