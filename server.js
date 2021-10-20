const express = require('express');
const mysql = require('mysql2');
const cTable = require('console.table');
const Table = require('easy-table');
const inquirer = require('inquirer');
const { copyFileSync } = require('fs');
const PORT = process.env.PORT || 3001;
const app = express();

// console.table([  {
//   name: 'foo',
//   age: 10
// }, {npm start
//   name: 'bar',
//   age: 20
// }
// ]);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'Password!',
    database: 'cms_db'
  },
  console.log(`Connected to the cms_db database.`)
);
function startApp() {
  inquirer.prompt([{
      type: 'rawlist',
      name: 'next',
      message: "Selections",
      choices: [ 'View All Departments', 'View All Roles', 'View All Employees', 
      'Add a Department', 'Add a Role', 'Add an Employee', 'Update Employee Role', 'No']
  }]).then(function (response) {
      switch (response.next) {
          case 'View All Departments':
            showDepartment()
              break;
          case 'View All Roles':
            showRoles()
              break;
          case 'View All Employees':
            showEmployees()
            break;
          case 'Add an Employee':
            showEmployees()
            break;
          case 'Add a Department':
              showDepartment()
                break;
          case 'Add a Role':
              showRoles()
                break;
          case 'Update Employee Role':
              showRoles()
                break;
          case 'No':
              break;
      }
  })
}
function showEmployees() {
  const sql =  `SELECT a.id as Id, a.first_name as 'First Name', a.last_name as 'Last Name', b.title as Title, c.dept_name as Department, b.salary as Salary, d.last_name as 'Manager Last Name'
  FROM employee a inner join roles b on a.role_id = b.id inner join department c on b.dept_id = c.id
  left outer join employee d on d.id=a.manager_id order by b.salary desc;`;
  db.query(sql, (err, results ) => {
    console.table(results);  
    startApp()
  })
}
async function showDepartment() {
  const sql =  `SELECT * FROM department`;
  db.query(sql, function(err, results ) {
    console.table(results);  
    startApp()
  })
}

async function showRoles() {
  const sql =  `select a.title, a.id, b.dept_name as department, a.salary from roles a inner join department b on a.dept_id = b.id`;
  db.query(sql, (err, results ) => {
  if (err) throw err;
  
     console.table(results);  
     startApp()
  })
    
    startApp()
 
}

async function addDepartment() {
  inquirer.prompt([{
      type: 'input',
      name: 'dept_name',
      message: "Department Name?",
  }]).then(function (response) {
    const sql = `INSERT INTO department(dept_name) VALUES (${dept_name})`;
    db.query(sql, function(err, results) {
      console.table(results);  
      startApp()
    })
  })
};


// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
startApp()