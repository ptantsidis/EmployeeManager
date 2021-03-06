const mysql = require('mysql2');
const cTable = require('console.table');
const Table = require('easy-table');
const inquirer = require('inquirer');
const e = require('express');
const { start } = require('repl');
let role = [];
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'Password!',
    database: 'cms_db'
  })
db.connect(function (err) {
  if (err) throw err;
  console.log(`Connected to the cms_db database.`)
  startApp()
})

let roleQuestions = [{
  type: 'input',
  name: 'title',
  message: "Name?",
},
{
  type: 'input',
  name: 'salary',
  message: "Salary?",
},
{
  type: 'input',
  name: 'dept_id',
  message: "Depart ID?",
}]

  
function startApp() {
  inquirer.prompt([{
    type: 'rawlist',
    name: 'next',
    message: "Selections",
    choices: ['View All Departments', 'View All Roles', 'View All Employees',
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
        addEmployee()
        break;
      case 'Add a Department':
        addDepartment()
        break;
      case 'Add a Role':
        addRole()
        break;
      case 'Update Employee Role':
        updateRole()
        break;
      case 'No':
        process.exit(1);
     }
  })
}
async function showEmployees() {
  const sql = `SELECT a.id as Id, a.first_name as 'First Name', a.last_name as 'Last Name', b.title as Title, c.dept_name as Department, b.salary as Salary, d.last_name as 'Manager Last Name'
  FROM employee a inner join roles b on a.role_id = b.id inner join department c on b.dept_id = c.id
  left outer join employee d on d.id=a.manager_id order by a.id;`;
  db.query(sql, (err, results) => {
    if (err) throw err;
    console.table(results);
    startApp()
  })
}
async function showDepartment() {
  let sql = `SELECT * FROM department`;
  db.query(sql, (err, results) => {
    if (err) throw err;
    console.table(results);
    startApp()
  })
}

async function showRoles() {
  let sql = `select a.title, a.id, b.dept_name as department, a.salary from roles a inner join department b on a.dept_id = b.id`;
  db.query(sql, (err, results) => {
    if (err) throw err;
    console.table(results);
    startApp()
  })
}

async function addDepartment() {
  inquirer.prompt([{
    type: 'input',
    name: 'dept_name',
    message: "Department Name?",
  }]).then((response) => {
    let newDept = response.dept_name
    console.log(newDept)
    let sql = `INSERT INTO department(dept_name) VALUES('${newDept}')`;
    db.query(sql, (err, results) => {
      if (err) throw err;
      console.table(results);
      startApp()
    })
  })
};

async function addRole() {
  inquirer.prompt(roleQuestions)
    .then(function (userinput) {
      console.log(userinput)
      let sql = `INSERT INTO roles(title, salary, dept_id) VALUES('${userinput.title}', '${userinput.salary}', '${userinput.dept_id}')`;
      db.query(sql, (err, results) => {
        if (err) throw err;
        console.table(results);
        startApp()
      })
    })
};

function addEmployee() {
  let roles = []
  let sql = `select id, title from roles`;
  db.query(sql, (err, results) => {
    if (err) throw err;
    for (let i = 0; i < results.length; i++) {
      roles.push({
        name: results[i].title,
        value: results[i].id
      });
    }
    let empQuestions = [{
      type: 'input',
      name: 'first_name',
      message: "First Name?",
    },
    {
      type: 'input',
      name: 'last_name',
      message: "Last Name?",
    },
    {
      type: 'list',
      name: 'role_id',
      message: "Role ID?",
      choices: roles,
    },
    {
      type: 'input',
      name: 'manager_id',
      message: "Manager Id?",
    }]
    inquirer.prompt(empQuestions)
      .then(function (userinput) {
        let sql = `INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES('${userinput.first_name}', '${userinput.last_name}', '${userinput.role_id}', '${userinput.manager_id}')`;
        db.query(sql, (err, results) => {
          if (err) throw err;
          console.table(results);
          startApp();
        })
      })
  })
};

function updateRole() {
  let roles = [];
  let empData = [];
  let sql = `select id,title from roles`;
  db.query(sql, (err, results) => {
    if (err) throw err;
    for (let i = 0; i < results.length; i++) {
      roles.push({
        name: results[i].title,
        value: results[i].id
      });
    }
    console.log(roles);
    sql = "select id, first_name,last_name from employee;"
    db.query(sql, (err, empRes) => {
      if (err) throw err;
      for (let i = 0; i < empRes.length; i++) {
        empData.push({
          name: empRes[i].first_name + "," + empRes[i].last_name,
          value: empRes[i].id
        })
      }
      inquirer.prompt([
        {
          type: 'list',
          name: 'employee',
          message: "Which Employee?",
          choices: empData,
        },
        {
          type: 'list',
          name: 'choice',
          message: "Which Role do you wish to apply?",
          choices: roles,
        }]).then((response) => {
          let sql = `UPDATE employee set role_id = (${response.choice})where id = ${response.employee}`;
          db.query(sql, (err, results) => {
            if (err) throw err;
            console.table(results);
            startApp();
          })
        })
    })
  });
}