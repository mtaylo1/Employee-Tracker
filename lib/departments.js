const db = require("../db/connection");
const cTable = require('console.table');
const figlet = require('figlet');
const inquirer = require("inquirer");


figlet('Employee Tracker', function(err, data) {
  if (err) {
      console.log('Something went wrong...');
      console.dir(err);
      return;
  }
  console.log(data)
});

// starts inquirer
const startInquirer = () => {
    inquirer.prompt([
      {
        type: "list",
        name: "toDo",
        message: "Please select an option:",
        choices: [
          "View all departments",
          "View all roles",
          "View all employees",
          "Add a department",
          "Add a role",
          "Add an employee",
          "Update an employee role",
          "Update an employee's manager",
          "View employees by manager",
          "View employees by department",
          "Remove a department",
          "Remove a role",
          "Remove an employee",
          "Exit"
        ]
      }
    ])
    .then(answers => {
        const nextPrompt = answers.toDo;
        if (nextPrompt === "View departments") {
          viewDepartments();
        };
    
        if (nextPrompt === "View roles") {
          viewRoles();
        };
    
        if (nextPrompt === "View employees") {
          viewEmployees();
        };
    
        if (nextPrompt === "Create a new department") {
          addDepartment();
        };
    
        if (nextPrompt === "Create a new role") {
          addRole();
        };
    
        if (nextPrompt === "Add an employee") {
          addEmployee();
        };
    
        if (nextPrompt === "Update an employee role") {
          updateEmployeeRole();
        };
    
        if (nextPrompt === "Update an employee's manager") {
          updateEmployeeManager();
        };
    
        if (nextPrompt === "View employees by manager") {
          viewByManager();
        };
    
        if (nextPrompt === "View employees by department") {
          viewByDepartment();
        };
    
        if (nextPrompt === "Remove a department") {
          removeDepartment();
        };
    
        if (nextPrompt === "Remove a role") {
          removeRole();
        };
    
        if (nextPrompt === "Remove an employee") {
          removeEmployee();
        };
    
        if (nextPrompt === "Exit") {
          process.exit();
        };
      })
    };
    
    const viewDepartments = () => {
      const sql = `SELECT * FROM departments`;
      db.query(sql, (err, rows) => {
        if (err) {
          throw err;
        }
        console.log("\n");
        console.table(rows);
        return startInquirer();
      });
    };

    const viewRoles = () => {
        const sql = `SELECT roles.id, 
                            roles.title, 
                            roles.salary, 
                            departments.name AS department
                      FROM roles
                      LEFT JOIN departments ON roles.department_id = departments.id`;
        db.query(sql, (err, rows) => {
          if (err) {
            throw err;
          }
          console.log("\n");
          console.table(rows);
          return startInquirer();
        });
      };

      const viewEmployees = () => {
  const sql = `SELECT employees.id, 
                      employees.first_name, 
                      employees.last_name,
                      roles.title AS title,
                      roles.salary AS salary,
                      departments.name AS department,
                      CONCAT (manager.first_name, " ", manager.last_name) AS manager 
                FROM employees
                LEFT JOIN roles ON employees.role_id = roles.id
                LEFT JOIN departments ON roles.department_id = departments.id
                LEFT JOIN employees manager ON employees.manager_id = manager.id`;
  db.query(sql, (err, rows) => {
    if (err) {
      throw err;
    }
    console.log("\n");
    console.table(rows);
    return startInquirer();
  });
};

const addDepartment = () => {
  return inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "What is the name of this department?",
      validate: nameInput => {
        if (nameInput) {
          return true;
        } else {
          console.log("Please enter a department name");
          return false;
        };
      }
    }
  ])
  .then(answer => {
    const sql = `INSERT INTO departments (name)
      VALUES (?)`;
    const params = answer.name;
    db.query(sql, params, (err) => {
      if (err) {
        throw err;
      }
      console.log("Department added!");
      return viewDepartments();
    });
  });
};

const addRole = () => {
  return inquirer.prompt([
    {
      type: "input",
      name: "title",
      message: "What is the name of this role?",
      validate: nameInput => {
        if (nameInput) {
          return true;
        } else {
          console.log("Please enter a role name");
          return false;
        };
      }
    },
    {
      type: "input",
      name: "salary",
      message: "What is the salary for this role?",
      validate: salaryInput => {
        if (isNaN(salaryInput)) {
          console.log("Please enter a salary");
          return false;
        } else {
          return true;
        };
      }
    }
  ])
  .then (answer => {
    const params = [answer.title, answer.salary];
    const sql = `SELECT * FROM departments`;
    db.query(sql, (err, rows) => {
      if (err) {
        throw err;
      }
      const departments = rows.map(({name, id}) => ({name: name, value: id}));
      inquirer.prompt([
        {
          type: "list",
          name: "department",
          message: "What department does this role belong to?",
          choices: departments
        }
      ])
      .then(departmentAnswer => {
        const department = departmentAnswer.department;
        params.push(department);
        const sql = `INSERT INTO roles (title, salary, department_id)
          VALUES (?, ?, ?)`;
        db.query(sql, params, (err) => {
          if (err) {
            throw err;
          }
          console.log("Role added!");
          return viewRoles();
        });
      });
    });
  });
};

const addEmployee = () => {
  return inquirer.prompt([
    {
      type: "input",
      name: "firstName",
      message: "What is the employee's first name?",
      validate: nameInput => {
        if (nameInput) {
          return true;
        } else {
          console.log("Please enter a name");
          return false;
        };
      }
    },
    {
      type: "input",
      name: "lastName",
      message: "What is the employee's last name?",
      validate: nameInput => {
        if (nameInput) {
          return true;
        } else {
          console.log("Please enter a name");
          return false;
        };
      }
    }
  ])
  .then (answer => {
    const params = [answer.firstName, answer.lastName];
    const sql = `SELECT * FROM roles`;
    db.query(sql, (err, rows) => {
      if (err) {
        throw err;
      }
      const roles = rows.map(({title, id}) => ({name: title, value: id}));
      inquirer.prompt([
        {
          type: "list",
          name: "role",
          message: "What is the role of this employee?",
          choices: roles
        }
      ])
      .then(roleAnswer => {
        const role = roleAnswer.role;
        params.push(role);
        const sql = `SELECT * FROM employees`;
        db.query(sql, (err, rows) => {
          if (err) {
            throw err;
          }
          const managers = rows.map(({first_name, last_name, id}) => ({name: `${first_name} ${last_name}`, value: id}));
          managers.push({name: "No manager", value: null});
          inquirer.prompt([
            {
              type: "list",
              name: "manager",
              message: "Who is this employee's manager?",
              choices: managers
            }
          ])
          .then(managerAnswer => {
            const manager = managerAnswer.manager;
            params.push(manager);
            const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id)
              VALUES (?, ?, ?, ?)`;
            db.query(sql, params, (err) => {
              if (err) {
                throw err;
              }
              console.log("Employee added!");
              return viewEmployees();
            });
          });
        });
      });
    });
  });
};

const updateEmployeeRole = () => {
  const sql = `SELECT first_name, last_name, id FROM employees`
  db.query(sql, (err, rows) => {
    if (err) {
      throw err;
    }
    const employees = rows.map(({first_name, last_name, id}) => ({name: `${first_name} ${last_name}`, value: id}));
    inquirer.prompt([
      {
        type: "list",
        name: "employee",
        message: "Which employee's role would you like to update?",
        choices: employees
      }
    ])
    .then(employeeAnswer => {
      const employee = employeeAnswer.employee;
      const params = [employee];
      const sql = `SELECT title, id FROM roles`;
      db.query(sql, (err, rows) => {
        if (err) {
          throw err;
        }
        const roles = rows.map(({title, id}) => ({name: title, value: id}));
        inquirer.prompt([
          {
            type: "list",
            name: "role",
            message: "What is the new role of this employee?",
            choices: roles
          }
        ])
        .then(rolesAnswer => {
          const role = rolesAnswer.role;
          params.unshift(role);
          const sql = `UPDATE employees
                        SET role_id = ?
                        WHERE id = ?`
          db.query(sql, params, (err) => {
            if (err) {
              throw err;
            }
            console.log("Employee updated!");
            return viewEmployees();
          });
        });
      });
    });
  });
};

const updateEmployeeManager = () => {
  const sql = `SELECT first_name, last_name, id FROM employees`
  db.query(sql, (err, rows) => {
    if (err) {
      throw err;
    }
    const employees = rows.map(({first_name, last_name, id}) => ({name: `${first_name} ${last_name}`, value: id}));
    inquirer.prompt([
      {
        type: "list",
        name: "employee",
        message: "Which employee would you like to update?",
        choices: employees
      }
    ])
    .then(employeeAnswer => {
      const employee = employeeAnswer.employee;
      const params = [employee];
      const sql = `SELECT first_name, last_name, id FROM employees`;
      db.query(sql, (err, rows) => {
        if (err) {
          throw err;
        }
        const managers = rows.map(({first_name, last_name, id}) => ({name: `${first_name} ${last_name}`, value: id}));
        managers.push({name: "No manager", value: null});
        inquirer.prompt([
          {
            type: "list",
            name: "manager",
            message: "Who is this employee's new manager?",
            choices: managers
          }
        ])
        .then(managerAnswer => {
          const manager = managerAnswer.manager;
          params.unshift(manager);
          const sql = `UPDATE employees
                        SET manager_id = ?
                        WHERE id = ?`
          db.query(sql, params, (err) => {
            if (err) {
              throw err;
            }
            console.log("Employee updated!");
            return viewEmployees();
          });
        });
      });
    });
  });
};

const viewByManager = () => {
  const sql = `SELECT first_name, last_name, id FROM employees`;
  db.query(sql, (err, rows) => {
    if (err) {
      throw err;
    }
    const employees = rows.map(({first_name, last_name, id}) => ({name: `${first_name} ${last_name}`, value: id}));
    inquirer.prompt([
      {
        type: "list",
        name: "employee",
        message: "Which manager's employees would you like to view?",
        choices: employees
      }
    ])
    .then(employeeAnswer => {
      const manager = employeeAnswer.employee;
      const params = [manager];
      const sql = `SELECT id, first_name, last_name FROM employees
                    WHERE manager_id = ?`
      db.query(sql, params, (err, rows) => {
        if (err) {
          throw err;
        }
        if (rows.length === 0) {
          console.log("This employee does not manage anyone.");
          return startInquirer();
        }
        console.log("\n");
        console.table(rows);
        return startInquirer();
      });
    });
  });
};

const viewByDepartment = () => {
  const sql = `SELECT * FROM departments`;
  db.query(sql, (err, rows) => {
    if (err) {
      throw err;
    }
    const departments = rows.map(({name, id}) => ({name: name, value: id}));
    inquirer.prompt([
      {
        type: "list",
        name: "employee",
        message: "Which department's employees would you like to view?",
        choices: departments
      }
    ])
    .then(employeeAnswer => {
      const department = employeeAnswer.employee;
      const params = [department];
      const sql = `SELECT employees.id, first_name, last_name, departments.name AS department
                    FROM employees
                    LEFT JOIN roles ON employees.role_id = roles.id
                    LEFT JOIN departments ON roles.department_id = departments.id
                    WHERE departments.id = ?`;
      db.query(sql, params, (err, rows) => {
        if (err) {
          throw err;
        }
        console.log("\n");
        console.table(rows);
        return startInquirer();
      });
    });
  });
};

const removeDepartment = () => {
  const sql = `SELECT * FROM departments`
  db.query(sql, (err, rows) => {
    if (err) {
      throw err;
    }
    const departments = rows.map(({name, id}) => ({name: name, value: id}));
    inquirer.prompt([
      {
        type: "list",
        name: "department",
        message: "Which department would you like to remove?",
        choices: departments
      }
    ])
    .then(departmentAnswer => {
      const department = departmentAnswer.department
      const params = department;
      const sql = `DELETE FROM departments
                    WHERE id = ?`
      db.query(sql, params, (err) => {
        if (err) {
          throw err;
        }
        console.log("Department deleted!");
        return viewDepartments();
      });
    });
  });
};

const removeRole = () => {
  const sql = `SELECT id, title FROM roles`
  db.query(sql, (err, rows) => {
    if (err) {
      throw err;
    }
    const roles = rows.map(({title, id}) => ({name: title, value: id}));
    inquirer.prompt([
      {
        type: "list",
        name: "role",
        message: "Which role would you like to remove?",
        choices: roles
      }
    ])
    .then(roleAnswer => {
      const role = roleAnswer.role
      const params = role;
      const sql = `DELETE FROM roles
                    WHERE id = ?`
      db.query(sql, params, (err) => {
        if (err) {
          throw err;
        }
        console.log("Role deleted!");
        return viewRoles();
      });
    });
  });
};

const removeEmployee = () => {
  const sql = `SELECT first_name, last_name, id FROM employees`
  db.query(sql, (err, rows) => {
    if (err) {
      throw err;
    }
    const employees = rows.map(({first_name, last_name, id}) => ({name: `${first_name} ${last_name}`, value: id}));
    inquirer.prompt([
      {
        type: "list",
        name: "employee",
        message: "Which employee would you like to remove?",
        choices: employees
      }
    ])
    .then(employeeAnswer => {
      const employee = employeeAnswer.employee
      const params = employee;
      const sql = `DELETE FROM employees
                    WHERE id = ?`
      db.query(sql, params, (err) => {
        if (err) {
          throw err;
        }
        console.log("Employee removed!");
        return viewEmployees();
      });
    });
  });
};

module.exports = startInquirer;