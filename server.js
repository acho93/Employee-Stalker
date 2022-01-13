const inquirer = require('inquirer');
const db = require('./db/connection');
const cTable = require('console.table'); 

// Start server after DB connection
db.connect(err => {
    if (err) throw err;
    console.log("Connected as Id" + connection.threadId)
    promptUser();
  });

const promptUser = () => {
    return inquirer.prompt([
        {
            
        }
    ])
}