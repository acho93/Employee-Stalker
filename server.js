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
    
        // if (options === 'Add a role') {
        //     addRole();
        // }
    
        // if (options === 'Add an employee') {
        //     addEmployee();
        // }
    
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

// Do I have to put viewDepartments/viewRoles/viewEmployees as a function or const?
// viewDepartments = () => {
//     const sql = 'SELECT * FROM department'; 
  
//     db.promise().query(sql, (err, rows) => {
//       if (err) throw err;
//       console.table(rows);
//       promptUser();
//     });
//   };

viewRoles = () => {
    const sql = 'SELECT * FROM role'; 
  
    db.query(sql, (err, rows) => {
      if (err) throw err;
      console.table(rows);
      promptUser();
    });
  };

viewEmployees = () => {
    const sql = 'SELECT * FROM employee'; 
  
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

