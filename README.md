# Explainable Resource Allocation Using Intelligent Decision Support

## Overview
This project investigates an explainable AI–based approach to **resource allocation and task assignment** in organizational environments.  
The goal is to support managerial decision-making by combining **data-driven recommendation models** with **transparent, human-interpretable explanations**.

Unlike black-box optimization systems, this work emphasizes **explainability**, allowing users to understand *why* a particular allocation decision is recommended.

---

## Motivation
In many real-world organizations, including technology-driven and creative industries, resource allocation decisions are often made manually or using simple heuristics. Such approaches may ignore important factors such as:

- Skill compatibility between resources and tasks  
- Historical performance and reliability  
- Workload balance and availability constraints  

Recent advances in artificial intelligence enable data-driven optimization, but many systems lack interpretability. This project addresses that gap by designing an **explainable decision support system** that balances performance with transparency.

---

## Problem Definition
Given:
- A set of tasks with required skills and priorities  
- A set of resources (e.g., employees) with skills, performance history, and workload  

The objective is to:
- Recommend suitable resource–task assignments  
- Maximize task success likelihood  
- Maintain workload balance  
- Provide **clear explanations** for each recommendation  

---

## Methodology
The system applies a hybrid scoring strategy combining multiple interpretable components:

1. **Skill Matching**
   - Measures overlap between task requirements and resource skills  

2. **Performance Evaluation**
   - Incorporates historical ratings and success indicators  

3. **Workload & Availability Constraints**
   - Penalizes overloaded or unavailable resources  

4. **Explainability Layer**
   - Generates human-readable reasons such as:
     - “Skills matched (3/4)”
     - “High historical performance”
     - “Low current workload”

Each recommendation is accompanied by both a **score** and an **explanation**, ensuring transparency.

## 🖥️ Dashboard Walkthrough

### Recommendations Panel
Employees are ranked by suitability score for the selected task.  
Each recommendation card is **clickable** and updates the explanation panels to help you compare trade-offs.

![Recommendations](screenshots/recommendations.png)

---

### Explainability Panels
Selecting a recommended employee updates all explanation views in real time:

- **Score Breakdown** — contribution of skill match, workload, and availability  
- **Skill Fit Radar** — employee skills vs task requirements  
- **Why this employee?** — human-readable explanation supporting trust  


![Explainability](screenshots/explainability.png)
---

## 🧠 Why This Is Explainable AI

Instead of only showing a final score, the system exposes:

- Individual factor contributions
- Trade-offs between skill match and workload
- Human-readable reasoning

This allows users to:

- Trust the recommendation
- Compare alternatives
- Make informed final decisions

---

## System Architecture
The project follows a modular architecture:

- `data/` – Synthetic datasets (resources, tasks, historical assignments)  
- `src/` – Core recommendation logic and evaluation scripts  
- `evaluation/` – Performance analysis using Precision@K and Recall@K  

This design supports easy extension toward more advanced machine learning models.

---

## Evaluation
The recommendation system is evaluated using **synthetic historical assignment data**, treating successful task completions as relevant outcomes.

**Metrics used:**
- Precision@K  
- Recall@K  

Comparisons are performed against simple baselines (e.g., lowest workload selection), demonstrating the effectiveness of the hybrid explainable approach.

---

## Key Contributions
- Design of an **explainable AI-based resource allocation framework**
- Integration of performance, skills, and workload constraints
- Practical evaluation using recommendation metrics
- Emphasis on transparency and interpretability in decision support systems

---

## Future Work
Planned extensions include:
- Integration of supervised learning models (e.g., logistic regression, tree-based methods)
- More advanced explainability techniques (e.g., feature attribution)
- Deployment as a real-time web-based decision support system
- Evaluation on real-world datasets

---

## Relevance to Research
This project lies at the intersection of:
- Explainable Artificial Intelligence (XAI)
- Intelligent Decision Support Systems
- Resource Allocation and Optimization
- Applied Machine Learning

It provides a practical foundation for further academic research in intelligent and interpretable enterprise systems.

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

