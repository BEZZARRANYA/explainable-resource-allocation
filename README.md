# Explainable AI Resource Allocation Dashboard

An interactive AI-powered dashboard that helps organizations allocate employees
to tasks while clearly explaining *why* each recommendation is made.

This project focuses on **explainable decision support**, not black-box automation.

---

## 🔍 What Does This System Do?

The system:
- Takes a selected **task**
- Evaluates available **employees**
- Recommends the **Top-K best candidates**
- Explains each recommendation using:
  - Skill match
  - Workload
  - Availability

All explanations are shown visually and in natural language.

---

## 🖥️ Dashboard Overview

### Main Dashboard
The dashboard allows users to select a task and run the allocation algorithm.

![Dashboard Overview](screenshots/dashboard_overview.png)

---

### Recommendations Panel
Employees are ranked by suitability score.
Each card is **clickable** and updates all explanation panels.

![Recommendations](screenshots/recommendations.png)

---

### Explainability Panels
When selecting an employee, the system explains the decision using:

- **Score Breakdown** (how each factor contributes)
- **Skill Fit Radar** (employee vs task requirements)
- **“Why this employee?”** textual explanation

![Explainability](screenshots/explainability.png)

---

## 🧠 Why This Is Explainable AI

Instead of only showing a final score, the system exposes:

- Individual factor contributions
- Trade-offs between skill and workload
- Human-readable reasoning

This allows users to:
- Trust the recommendation
- Compare alternatives
- Make informed final decisions

---

## 🧱 System Architecture

Web Dashboard (HTML / CSS / JavaScript)
|
v
Flask REST API
|
v
Allocation & Scoring Logic
|
v
SQLite Database
This is a **full end-to-end AI system**, not just a script or notebook.

---

## 🛠️ Tech Stack

**Frontend**
- HTML
- CSS
- JavaScript
- Chart.js

**Backend**
- Python
- Flask (REST API)

**Database**
- SQLite

---

## 🚀 How to Run the Project

```bash
git clone https://github.com/BEZZARRANYA/explainable-resource-allocation.git
cd explainable-resource-allocation
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python db/init_db.py
python app.py
