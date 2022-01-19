const inquirer = require('inquirer');
const db = require('./db/connection');
const cTable = require('console.table');

// Start server after DB connection
db.connect(err => {
    if (err) throw err;
    console.log('Database connected.');
    promptUser();
});

const promptUser = () => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'options',
            message: 'What would you like to do?',
            choices: [
                'View all departments',
                'View all roles',
                'View all employees',
                'Add a department',
                'Add a role',
                'Add an employee',
                'Update an employee role',
                'Update employee managers',
                'View employees by manager',
                'View employees by department',
                'Delete department',
                'Delete role',
                'Delete employee'
            ]
        }
    ])
        .then(response => {
            const { options } = response;

            if (options === 'View all departments') {
                viewDepartments();
            }

            if (options === 'View all roles') {
                viewRoles();
            }

            if (options === 'View all employees') {
                viewEmployees();
            }

            if (options === 'Add a department') {
                addDepartment();
            }

            if (options === 'Add a role') {
                addRole();
            }

            if (options === 'Add an employee') {
                addEmployee();
            }

            if (options === 'Update an employee role') {
                updateEmployee();
            }

            if (options === 'Update employee managers') {
                updateManager();
            }

            if (options === 'View employees by manager') {
                viewEmpman();
            }

            if (options === 'View employees by department') {
                viewEmpdept();
            }

            if (options === 'Delete department') {
                deleteDepartment();
            }

            if (options === 'Delete role') {
                deleteRole();
            }

            if (options === 'Delete employee') {
                deleteEmployee();
            }
        });
};

viewDepartments = () => {
    const sql = 'SELECT * FROM department';

    db.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        promptUser();
    });
};

viewRoles = () => {
    const sql = `SELECT role.id,
                        role.title,
                        department.name AS department,
                        role.salary
                FROM role
                INNER JOIN department ON role.department_id = department.id`;

    db.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        promptUser();
    });
};

viewEmployees = () => {
    const sql = `SELECT employee.id, 
                        employee.first_name, 
                        employee.last_name, 
                        role.title, 
                        department.name AS department,
                        role.salary, 
                        CONCAT (manager.first_name, " ", manager.last_name) AS manager
                FROM employee
                    LEFT JOIN role ON employee.role_id = role.id
                    LEFT JOIN department ON role.department_id = department.id
                    LEFT JOIN employee manager ON employee.manager_id = manager.id`;

    db.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        promptUser();
    });
};

addDepartment = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'addDept',
            message: 'What department would you like to add?',
            validate: addDept => {
                if (addDept) {
                    return true;
                } else {
                    console.log("Please enter the department name!");
                    return false;
                }
            }
        }
    ])
        .then(response => {
            const sql = `INSERT INTO department (name)
                    VALUES (?)`;

            db.query(sql, response.addDept, (err, result) => {
                if (err) throw err;
                console.log('Added ' + response.addDept + " to departments!");

                viewDepartments();
            });
        });
};

addRole = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'addRole',
            message: 'What role would you like to add?',
            validate: addRole => {
                if (addRole) {
                    return true;
                } else {
                    console.log("Please enter the role name!");
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'addSalary',
            message: 'What is the salary of this role?',
            validate: addSalary => {
                if (isNaN(addSalary)) {
                    console.log("Please enter a numerical salary!");
                    return false;
                } else {
                    return true;
                }
            }
        },
        {
            type: 'input',
            name: 'inclDept',
            message: 'What department is this role?',
            validate: inclDept => {
                if (isNaN(inclDept)) {
                    console.log("Please enter a number that corresponds to an existing department!");
                    return false;
                } else {
                    return true;
                }
            }
        }
    ])
        .then(response => {
            const sql = `INSERT INTO role (title, salary, department_id)
                    VALUES (?, ?, ?)`;

            db.query(sql, [response.addRole, response.addSalary, response.inclDept], (err, result) => {
                if (err) {
                    console.log("This department does not exist. Please choose from an existing department and try again.");
                    addRole();
                    return
                } else {
                    console.log('Added ' + response.addRole + " to roles!");
                }

                viewRoles();
            });
        });
};

addEmployee = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: "What is the employee's first name?",
            validate: firstName => {
                if (firstName) {
                    return true;
                } else {
                    console.log("Please enter the first name!");
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'lastName',
            message: "What is the employee's last name?",
            validate: lastName => {
                if (lastName) {
                    return true;
                } else {
                    console.log("Please enter the last name!");
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'inclRole',
            message: "What is the employee's role?",
            validate: inclRole => {
                if (isNaN(inclRole)) {
                    console.log("Please enter a number that corresponds to a role!");
                    return false;
                } else {
                    return true;
                }
            }
        },
        {
            type: 'input',
            name: 'inclMan',
            message: "Who is the employee's manager?",
            validate: inclMan => {
                if (isNaN(inclMan)) {
                    console.log("Please enter a number that corresponds to a manager!");
                    return false;
                } else {
                    return true;
                }
            }
        }
    ])
        .then(response => {
            const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                    VALUES (?, ?, ?, ?)`;

            db.query(sql, [response.firstName, response.lastName, response.inclRole, response.inclMan], (err, result) => {
                if (err) {
                    console.log("This department does not exist. Please choose from an existing department and try again.");
                    addEmployee();
                    return
                } else {
                    console.log('Added ' + response.addEmployee + " to employees!");
                }

                viewEmployees();
            });
        });
};

updateEmployee = () => {
    const employeeSql = `SELECT * FROM employee`;

    db.query(employeeSql, (err, data) => {
        if (err) throw err;

        const employees = data.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));

        inquirer.prompt([
            {
                type: 'list',
                name: 'name',
                message: "Which employee would you like to update?",
                choices: employees
            }
        ])
            .then(empChoice => {
                const employee = empChoice.name;
                const params = [];
                params.push(employee);

                const roleSql = `SELECT * FROM role`;

                db.query(roleSql, (err, data) => {
                    if (err) throw err;

                    const roles = data.map(({ id, title }) => ({ name: title, value: id }));

                    inquirer.prompt([
                        {
                            type: 'list',
                            name: 'role',
                            message: "What is the employee's new role?",
                            choices: roles
                        }
                    ])
                        .then(roleChoice => {
                            const role = roleChoice.role;
                            params.push(role);

                            let employee = params[0]
                            params[0] = role
                            params[1] = employee

                            const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;

                            db.query(sql, params, (err, result) => {
                                if (err) throw err;
                                console.log("Employee has been updated!");

                                viewEmployees();
                            });
                        });
                });
            });
    });
};

updateManager = () => {
    const employeeSql = `SELECT * FROM employee`;

    db.query(employeeSql, (err, data) => {
        if (err) throw err;

        const employees = data.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));

        inquirer.prompt([
            {
                type: 'list',
                name: 'name',
                message: "Which employee would you like to update?",
                choices: employees
            }
        ])
            .then(empChoice => {
                const employee = empChoice.name;
                const params = [];
                params.push(employee);

                const managerSql = `SELECT * FROM employee`;

                db.query(managerSql, (err, data) => {
                    if (err) throw err;

                    const managers = data.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));

                    inquirer.prompt([
                        {
                            type: 'list',
                            name: 'manager',
                            message: "Who is the employee's new manager?",
                            choices: managers
                        }
                    ])
                        .then(managerChoice => {
                            const manager = managerChoice.manager;
                            params.push(manager);

                            let employee = params[0]
                            params[0] = manager
                            params[1] = employee

                            const sql = `UPDATE employee SET manager_id = ? WHERE id = ?`;

                            db.query(sql, params, (err, result) => {
                                if (err) throw err;
                                console.log("Employee has been updated!");

                                viewEmployees();
                            });
                        });
                });
            });
    });
};

viewEmpman = () => {
    const sql = `SELECT employee.first_name, 
                        employee.last_name, 
                        CONCAT (manager.first_name, " ", manager.last_name) AS manager
                FROM employee
                LEFT JOIN employee manager ON employee.manager_id = manager.id
                ORDER BY employee.manager_id`;

    db.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        promptUser();
    });
};

viewEmpdept = () => {
    const sql = `SELECT employee.first_name, 
                      employee.last_name, 
                      department.name AS department
               FROM employee
               LEFT JOIN role ON employee.role_id = role.id 
               LEFT JOIN department ON role.department_id = department.id
               ORDER BY department`;

    db.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        promptUser();
    });
};

deleteDepartment = () => {
    const deptSql = `SELECT * FROM department`;

    db.query(deptSql, (err, data) => {
        if (err) throw err;

        const dept = data.map(({ name, id }) => ({ name: name, value: id }));

        inquirer.prompt([
            {
                type: 'list',
                name: 'dept',
                message: "What department do you want to delete?",
                choices: dept
            }
        ])
            .then(deptChoice => {
                const dept = deptChoice.dept;
                const sql = `DELETE FROM department WHERE id = ?`;

                db.query(sql, dept, (err, result) => {
                    if (err) throw err;
                    console.log("Successfully deleted!");

                    viewDepartments();
                });
            });
    });
};

deleteRole = () => {
    const roleSql = `SELECT * FROM role`;

    db.query(roleSql, (err, data) => {
        if (err) throw err;

        const role = data.map(({ title, id }) => ({ name: title, value: id }));

        inquirer.prompt([
            {
                type: 'list',
                name: 'role',
                message: "What role do you want to delete?",
                choices: role
            }
        ])
            .then(roleChoice => {
                const role = roleChoice.role;
                const sql = `DELETE FROM role WHERE id = ?`;

                db.query(sql, role, (err, result) => {
                    if (err) throw err;
                    console.log("Successfully deleted!");

                    viewRoles();
                });
            });
    });
};

deleteEmployee = () => {
    const employeeSql = `SELECT * FROM employee`;

    db.query(employeeSql, (err, data) => {
        if (err) throw err;

        const employee = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));

        inquirer.prompt([
            {
                type: 'list',
                name: 'employee',
                message: "What employee do you want to delete?",
                choices: employee
            }
        ])
            .then(employeeChoice => {
                const employee = employeeChoice.employee;
                const sql = `DELETE FROM employee WHERE id = ?`;

                db.query(sql, employee, (err, result) => {
                    if (err) throw err;
                    console.log("Successfully deleted!");

                    viewEmployees();
                });
            });
    });
};
