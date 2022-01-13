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

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
('Chandler', 'Bing', 1, null),
('Rachel', 'Green', 2, null),
('Monica', 'Geller', 3, 2),
('Ross', 'Geller', 4, 1),
('Phoebe', 'Buffay', 5, null),
('Joey', 'Tribbiani', 6, 5),
('Janice', 'Hosenstein', 7, null),
('Gunther', 'Tyler', 8, 7),
('Mike', 'Hannigan', 9, 5),
('Richard', 'Burke', 10, 1);