USE company;
INSERT INTO departments (name)
VALUES
    ("Sales"),
    ("Finance"),
    ("Human Resources"),
    ("Engineering"),
    ("Marketing");

INSERT INTO roles (title, salary, department_id)
VALUES 
("Inside Sales Representative", 80000, 1), 
("Account Executive", 180000, 1), 
("Accountant", 71000, 2), 
("CFO", 420000, 2), 
("HR Manager", 10000, 3), 
("HR Generalist", 55000, 3), 
("Lead Developer", 120000, 3), 
("Junior Developer", 85000, 3),
("Senior Marketing Manager", 250000, 5), 
("Marketing Associate", 70000, 5);

INSERT INTO employees (first_name, last_name, role_id)
VALUES 
("Ahmad", "Khan", 1), 
("Barry", "Brown", 2), 
("Celina", "Kyle", 3),
("Terry", "Msolo", 4), 
("Edward", "Oneill", 5), 
("Fatimah", "Minyani", 6), 
("Binty", "Sandiford", 7), 
("Nina", "Robinson", 5), 
("Andy", "Briceford", 4);