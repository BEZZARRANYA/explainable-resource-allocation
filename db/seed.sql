-- Seed employees
INSERT INTO employees (name, role, skill_python, skill_ml, skill_backend, skill_frontend, current_workload, availability)
VALUES
('Ranya', 'ML Engineer', 5, 4, 3, 2, 40, 80),
('Mina', 'Backend Engineer', 4, 2, 5, 2, 60, 70),
('Omar', 'Data Analyst', 3, 3, 2, 1, 30, 90),
('Sara', 'Full-stack Engineer', 4, 3, 4, 4, 55, 75),
('Youssef', 'Frontend Engineer', 2, 1, 2, 5, 45, 85);

-- Seed tasks
INSERT INTO tasks (title, difficulty, required_python, required_ml, required_backend, required_frontend, estimated_hours)
VALUES
('Build ML training pipeline', 4, 4, 4, 2, 1, 40),
('Create REST API endpoints', 3, 3, 1, 4, 1, 25),
('Dashboard UI for allocation', 3, 2, 1, 2, 4, 30),
('Data cleaning + feature engineering', 3, 4, 3, 1, 1, 20),
('Integrate Chart.js analytics', 2, 2, 1, 2, 4, 15);

-- Seed assignment history (toy labels for now)
INSERT INTO assignments (employee_id, task_id, predicted_success, actual_success, completed_on)
VALUES
(1, 1, NULL, 1, '2025-12-01'),
(2, 2, NULL, 1, '2025-12-03'),
(5, 3, NULL, 1, '2025-12-10'),
(3, 4, NULL, 1, '2025-12-12'),
(4, 2, NULL, 1, '2025-12-15'),
(2, 1, NULL, 0, '2025-12-20'),
(5, 2, NULL, 0, '2025-12-21'),
(3, 3, NULL, 0, '2025-12-22');

