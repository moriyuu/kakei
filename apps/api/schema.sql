DROP TABLE IF EXISTS Customers;

CREATE TABLE Customers (
  CustomerID INT,
  CompanyName TEXT,
  ContactName TEXT,
  PRIMARY KEY (`CustomerID`)
);

INSERT INTO
  Customers (CustomerID, CompanyName, ContactName)
VALUES
  (1, 'Alfreds', 'Maria Anders'),
  (2, 'Around', 'Thomas Hardy'),
  (3, 'Beverages', 'Victoria Ashworth'),
  (4, 'Beverages', 'Random Name');
