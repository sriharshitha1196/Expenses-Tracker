const express = require("express");
const path = require("path");
const db = require("./database");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "../client")));

function isValidDate(value) {
    if (typeof value !== "string" ||
        !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return false;
    }

    const date = new Date(`${value}T00:00:00.000Z`);
    return !Number.isNaN(date.getTime()) &&
        date.toISOString().slice(0, 10) === value;
}

app.get("/api/transactions", (req, res) => {
    const transactions = db.prepare(
        "SELECT * FROM transactions ORDER BY date DESC, id DESC"
    ).all();

    res.json(transactions);
});

app.get("/api/summary", (req, res) => {
    const summary = db.prepare(`
    SELECT
      COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) AS totalIncome,
      COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS totalExpenses
    FROM transactions
  `).get();

    res.json({
        totalIncome: summary.totalIncome,
        totalExpenses: summary.totalExpenses,
        netSavings: summary.totalIncome - summary.totalExpenses
    });
});

app.post("/api/transactions", (req, res) => {
    const { type, title, amount, category, date } = req.body;

    if (!["income", "expense"].includes(type)) {
        return res.status(400).json({ error: "Choose income or expense." });
    }

    if (typeof title !== "string" || !title.trim() || title.trim().length > 100) {
        return res.status(400).json({ error: "Title is required (maximum 100 characters)." });
    }

    if (typeof amount !== "number" || !Number.isFinite(amount) ||
        amount <= 0 || amount > 1000000000) {
        return res.status(400).json({ error: "Enter a valid positive amount." });
    }

    if (typeof category !== "string" || !category.trim() ||
        category.trim().length > 50) {
        return res.status(400).json({ error: "Enter a valid category." });
    }

    if (!isValidDate(date)) {
        return res.status(400).json({ error: "Enter a valid date." });
    }

    const result = db.prepare(`
    INSERT INTO transactions (type, title, amount, category, date)
    VALUES (?, ?, ?, ?, ?)
  `).run(type, title.trim(), amount, category.trim(), date);

    const transaction = db.prepare(
        "SELECT * FROM transactions WHERE id = ?"
    ).get(result.lastInsertRowid);

    res.status(201).json(transaction);
});

app.delete("/api/transactions/:id", (req, res) => {
    if (!/^[1-9]\d*$/.test(req.params.id)) {
        return res.status(400).json({ error: "Invalid transaction ID." });
    }

    const result = db.prepare(
        "DELETE FROM transactions WHERE id = ?"
    ).run(Number(req.params.id));

    if (!result.changes) {
        return res.status(404).json({ error: "Transaction not found." });
    }

    res.json({ message: "Transaction deleted successfully." });
});

app.listen(PORT, () => {
    console.log(`Expense Tracker running at http://localhost:${PORT}`);
});