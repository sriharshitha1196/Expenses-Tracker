💰 Expense Tracker — PocketTrack

A responsive full-stack Expense Tracker application developed as part of CodeNova Internship — Task 2. The application helps users record income and expenses, monitor their financial summary, search transactions, and manage their spending.

✨ Features

- Add income and expense transactions.
- View transaction history.
- Calculate total income, total expenses, and net savings.
- Search transactions by description or category.
- Filter transactions by income or expense.
- Delete transactions with confirmation.
- Validate transaction details.
- Store data persistently using SQLite.
- Responsive interface for desktop and mobile screens.

🛠️ Technologies Used

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express.js
- Database: SQLite with better-sqlite3
- Version Control: Git and GitHub

📁 Project Structure

expense-tracker/
├── client/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── server/
│   ├── server.js
│   ├── database.js
│   ├── package.json
│   └── package-lock.json
├── screenshots/
├── .gitignore
└── README.md

The "expenses.db" database file is created automatically when the backend runs.

⚙️ Installation and Setup

Prerequisites

- Node.js and npm
- Git (optional, for version control)

1. Clone the repository

git clone YOUR_GITHUB_REPOSITORY_URL
cd expense-tracker

Replace "YOUR_GITHUB_REPOSITORY_URL" with your actual GitHub repository URL.

2. Install dependencies

cd server
npm install

3. Start the application

node server.js

4. Open the application

Visit the following URL in your browser:

http://localhost:3000

Keep the backend terminal running while using the application.

🔌 API Endpoints

Method| Endpoint| Description
GET| "/api/transactions"| Retrieve all transactions
GET| "/api/summary"| Retrieve income, expenses, and net savings
POST| "/api/transactions"| Add a transaction
DELETE| "/api/transactions/:id"| Delete a transaction

🧪 Testing

- Add income and expense transactions.
- Verify the dashboard totals.
- Search and filter transactions.
- Delete a transaction and check the updated totals.
- Refresh the browser and verify data persistence.
- Test invalid amounts and dates.
- Test the responsive layout on mobile screens.

🗄️ Database

SQLite stores transactions in the "transactions" table. Each record includes:

- Transaction ID
- Type (income or expense)
- Description
- Amount
- Category
- Date

📸 Screenshots

1. Homepage

"Homepage" (screenshots/01-homepage.png)

2. Add Transaction

"Add Transaction" (screenshots/02-add.png)

3. Search Transactions

"Search Transactions" (screenshots/03-search.png)

4. Delete Transaction

"Delete Transaction" (screenshots/04-delete.png)

5. Backend Running

"Backend Running" (screenshots/05-backend.png)

👩‍💻 Project Information

Project: Expense Tracker — PocketTrack
Internship: CodeNova
Task: Task 2 — Expense Tracker

📄 License

This project was created for educational and internship purposes.