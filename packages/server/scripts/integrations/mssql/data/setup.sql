USE master;
  
IF OBJECT_ID ('dbo.products', 'U') IS NOT NULL  
  DROP TABLE products;  
GO  
CREATE TABLE products 
(  
  id int IDENTITY(1,1),  
  name varchar (20),  
  description varchar(30)  
);
IF OBJECT_ID ('dbo.tasks', 'U') IS NOT NULL
  DROP TABLE tasks;
GO
CREATE TABLE tasks
(
  taskid int IDENTITY(1,1),
  taskname varchar (20)
);
  
INSERT products
  (name, description)  
VALUES  
  ('Bananas', 'Fruit thing');  
  
INSERT products
  (name, description)  
VALUES  
  ('Meat', 'Animal thing');

INSERT tasks
  (taskname)
VALUES
  ('Processing');
