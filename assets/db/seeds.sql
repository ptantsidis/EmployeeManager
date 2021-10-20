
use cms_db;
INSERT INTO department(dept_name)
VALUES ("Sales"),
       ("Engineering"),
       ("Finance"),
       ("Legal");
       
use cms_db;
INSERT INTO roles(title, salary, dept_id)
VALUES ("Salesperson", 75000,1),
       ("Lead Engineer", 150000,2),
       ("Software Engineer", 120000,2),
       ("Information Officer", 200000,2),
       ("Legal Team Lead", 250000,4),
       ("Lawyer", 190000,4 ),
       ("Controller", 175000,3),
       ("Assistant Controller", 120000, 3),
       ("Cost Analyst", 80000, 3),
       ("Accountant", 125000, 3);


use cms_db;
    INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("John","Doe",1,null),
       ("Eggbert", "Donner",2,null),
       ("Sanora", "Evans", 3,2),
       ("Rem", "Singh", 5, null),
       ("Hui", "Kuthra", 6,4),
       ("Bernice", "Freeman", 7, null),
       ("Ansley", "Dunbar", 9, 6),
       ("Mary", "Conaga",10, 6),
       ("Lakoi", "Smith",4, null),
       ("JT","Gibson",8,6); 