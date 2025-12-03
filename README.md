# Task Management API

This project is a simple Task Management backend built with Node.js.  
It uses:

- **MySQL/PostgreSQL** for user accounts
- **MongoDB** for storing tasks
- **JWT** for authentication
- **bcrypt** for password hashing

---

## Getting Started

### 1. Install dependencies

```
npm install
```

### 2. Create a `.env` file

```
PORT=4000

SQL_HOST=localhost
SQL_USER=root
SQL_PASSWORD=yourpassword
SQL_DATABASE=tasksdb
SQL_DIALECT=mysql

MONGO_URI=mongodb://127.0.0.1:27017/tasks

JWT_SECRET=your_secret
JWT_EXPIRES_IN=7d
```

### 3. Setup SQL

Create the database:

```
CREATE DATABASE tasksdb;
```

The User table is created automatically by Sequelize.

### 4. Run the server

```
npm start
```

---

## API Routes

A ready-to-import Postman Collection is included to help you test all endpoints quickly. It's present in root folder.
Set `{{jwt}}` and `{{taskId}}` variables in Postman after login.

### Auth

| Method | Endpoint    | Description       |
| ------ | ----------- | ----------------- |
| POST   | `/register` | Create an account |
| POST   | `/login`    | Login + JWT       |

### Tasks (Require JWT)

| Method | Endpoint     | Description         |
| ------ | ------------ | ------------------- |
| POST   | `/tasks`     | Create a task       |
| GET    | `/tasks`     | Get tasks (filters) |
| PUT    | `/tasks/:id` | Update task         |
| DELETE | `/tasks/:id` | Delete task         |

Supported filters:

```
/tasks?status=Pending&priority=High&dueDate=12-01-2025
```

---

## CRON - NOTIFICATIONS

Notifications for the task deadlines will be sent every day at midnight as long as server is running.

To test notification sending - on line 37 in src\cron\taskDeadlineNotifier.js change initial 2 zeros to asterisk (\*)

And wait a minute

---

## Assumptions

- Dates must be given in **MM-DD-YYYY**.
- All dates are stored as **UTC midnight** to avoid timezone issues.
- Business logic stays inside services; controllers only handle requests and responses.
- Pagination params when not passed will be set as 1 and 10 by default
- Tasks are allowed to be created without due date
- Notifications are to be sent at midnight

---
