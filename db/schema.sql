-- Core entities for explainable resource allocation

DROP TABLE IF EXISTS assignments;
DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS tasks;

CREATE TABLE employees (
  employee_id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  skill_python INTEGER NOT NULL CHECK(skill_python BETWEEN 0 AND 5),
  skill_ml INTEGER NOT NULL CHECK(skill_ml BETWEEN 0 AND 5),
  skill_backend INTEGER NOT NULL CHECK(skill_backend BETWEEN 0 AND 5),
  skill_frontend INTEGER NOT NULL CHECK(skill_frontend BETWEEN 0 AND 5),
  current_workload INTEGER NOT NULL CHECK(current_workload BETWEEN 0 AND 100),
  availability INTEGER NOT NULL CHECK(availability BETWEEN 0 AND 100)
);

CREATE TABLE tasks (
  task_id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  difficulty INTEGER NOT NULL CHECK(difficulty BETWEEN 1 AND 5),
  required_python INTEGER NOT NULL CHECK(required_python BETWEEN 0 AND 5),
  required_ml INTEGER NOT NULL CHECK(required_ml BETWEEN 0 AND 5),
  required_backend INTEGER NOT NULL CHECK(required_backend BETWEEN 0 AND 5),
  required_frontend INTEGER NOT NULL CHECK(required_frontend BETWEEN 0 AND 5),
  estimated_hours INTEGER NOT NULL CHECK(estimated_hours BETWEEN 1 AND 200)
);

-- historical assignments (training labels come from success)
CREATE TABLE assignments (
  assignment_id INTEGER PRIMARY KEY,
  employee_id INTEGER NOT NULL,
  task_id INTEGER NOT NULL,
  predicted_success REAL,
  actual_success INTEGER NOT NULL CHECK(actual_success IN (0, 1)),
  completed_on TEXT NOT NULL, -- ISO date string
  FOREIGN KEY (employee_id) REFERENCES employees(employee_id),
  FOREIGN KEY (task_id) REFERENCES tasks(task_id)
);

