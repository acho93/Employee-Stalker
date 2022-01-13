INSERT INTO department (name)
VALUES 
('Operations'),
('IT'),
('Marketing & Sales'),
('Human Resources'),
('Accounting & Finance');

INSERT INTO role (title, salary, department_id)
VALUES
('Operations Manager', 90000, 1),
('Project Manager', 80000, 1),
('Software Engineer', 150000, 2),
('Data Scientist', 140000, 2),
('Marketing Manager', 90000, 3),
('Sales Consultant', 60000, 3),
('HR Director', 100000, 4),
('Recruiter', 50000, 4),
('Accountant', 80000, 5),
('Financial Analyst', 100000, 5);