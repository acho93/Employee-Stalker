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
            name: 'choices',
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
        const { choices } = response;

        if (choices === 'View all departments') {
            viewDepartments();
        }

        if (choices === 'View all roles') {
            viewRoles();
        }

        if (choices === 'View all employees') {
            viewEmployees();
        }

        // if (choices === 'Add a department') {
        //     addDepartment();
        // }
    
        // if (choices === 'Add a role') {
        //     addRole();
        // }
    
        // if (choices === 'Add an employee') {
        //     addEmployee();
        // }
    
        // if (choices === 'Update an employee role') {
        //     updateEmployee();
        // }

        // if (choices === 'Exit') {
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


// viewDepartments = () => {
//     const sql = `SELECT department.id AS id, department.name AS department FROM department`; 
  
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