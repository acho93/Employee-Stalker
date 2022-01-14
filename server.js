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
                'Exit'
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

            // if (options === 'Update an employee role') {
            //     updateEmployee();
            // }

            // if (options === 'Exit') {
            //     db.end()
            // };
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
            message: 'What is the first name of the employee?',
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
            message: 'What is the last name of the employee?',
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
            message: 'What is the role of the employee?',
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
            message: 'Who is the manager of the employee?',
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
    
    db.query
    inquirer.prompt([
        {

        }
    ])
}