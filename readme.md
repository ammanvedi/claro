# Claro

Claro is an introspection based ORM. It looks at your database and generates a client that 
you can use to interact with a database.

Its aims are to provide;

1. A client only experience, leaving you to manage your own migrations.
2. A schema lockfile.
3. Deterministic client generation. Same DB schema, same client generated.
4. Intelligently typed client.
5. Traditional transactions with arbitrary rollbacks & commits.
6. Safe well tested implementation written in a functional paradigm
7. Built in tracing
8. Built in soft delete functionality
9. Middlwares

Claro is intended to be a cherry pick of the best ideas from Sequelize and Prisma.

## Requirements
1. colima installed https://github.com/abiosoft/colima, brew install colima
2. brew install docker
3. brew install docker-compose

## Introspection

### Relations

#### One to Many

One to many relations are identified as a table with a non unique foreign
key relation to another table

```
CREATE TABLE dbo.city (
  city_id int IDENTITY,
  country_id int NOT NULL
)


CREATE TABLE dbo.country (
  country_id int IDENTITY
)

ALTER TABLE dbo.city WITH NOCHECK
  ADD FOREIGN KEY (country_id) REFERENCES dbo.country (country_id)
GO
```


Claro identifies one-to-many relations

#### One to One
```
CREATE TABLE [Employee] (
    [ID]    INT PRIMARY KEY
);

CREATE TABLE [Salary] (
    [EmployeeID]    INT UNIQUE NOT NULL
);

ALTER TABLE [Salary]
ADD CONSTRAINT FK_Salary_Employee FOREIGN KEY([EmployeeID]) 
    REFERENCES [Employee]([ID]);
```

#### Many to Many

#### Self Referential