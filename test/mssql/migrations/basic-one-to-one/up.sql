CREATE TABLE [Employee] (
    [ID]    INT PRIMARY KEY
,   [Name]  VARCHAR(50)
);

CREATE TABLE [Salary] (
    [EmployeeID]    INT UNIQUE NOT NULL
,   [SalaryAmount]  INT
);

ALTER TABLE [Salary]
ADD CONSTRAINT FK_Salary_Employee FOREIGN KEY([EmployeeID])
    REFERENCES [Employee]([ID]);