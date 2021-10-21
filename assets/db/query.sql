SELECT a.id as Id, a.first_name as 'First Name', a.last_name as 'Last Name', b.title as Title, c.dept_name as Department, b.salary as Salary, d.last_name as 'Manager Last Name'
FROM employee a inner join roles b on a.role_id = b.id inner join department c on b.dept_id = c.id
left outer join employee d on d.id=a.manager_id order by b.salary desc;

