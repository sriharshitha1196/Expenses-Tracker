const API = "/api/transactions";

const form = document.getElementById("transactionForm");
const typeInput = document.getElementById("type");
const titleInput = document.getElementById("title");
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const dateInput = document.getElementById("date");
const submitBtn = document.getElementById("submitBtn");
const cancelEditBtn = document.getElementById("cancelEdit");
const formHeading = document.getElementById("formHeading");
const formMessage = document.getElementById("formMessage");
const historyMessage = document.getElementById("historyMessage");
const transactionList = document.getElementById("transactionList");
const transactionCount = document.getElementById("transactionCount");
const searchInput = document.getElementById("searchInput");
const filterType = document.getElementById("filterType");

let transactions = [];
let editingId = null;

const money = value => new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2
}).format(value);

document.getElementById("todayDate").textContent =
    new Date().toLocaleDateString("en-IN", {
        day: "numeric", month: "short", year: "numeric"
    });

dateInput.value = new Date().toLocaleDateString("en-CA");

async function request(url, options = {}) {
    const response = await fetch(url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options.headers
        }
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data.error || "Something went wrong.");
    }

    return data;
}

async function loadData() {
    try {
        const [rows, summary] = await Promise.all([
            request(API),
            request("/api/summary")
        ]);

        transactions = rows;

        document.getElementById("totalIncome").textContent =
            money(summary.totalIncome);
        document.getElementById("totalExpenses").textContent =
            money(summary.totalExpenses);
        document.getElementById("netSavings").textContent =
            money(summary.netSavings);

        renderTransactions();
        historyMessage.textContent = "";
    } catch (error) {
        historyMessage.textContent =
            "Could not load transactions. Check that the server is running, then refresh.";
        transactionList.replaceChildren();
        const row = document.createElement("tr");
        const cell = document.createElement("td");
        cell.colSpan = 5;
        cell.className = "empty";
        cell.textContent = "Unable to load transaction history.";
        row.appendChild(cell);
        transactionList.appendChild(row);
    }
}

function renderTransactions() {
    const search = searchInput.value.trim().toLowerCase();
    const selectedType = filterType.value;

    const filtered = transactions.filter(item => {
        const matchesSearch =
            item.title.toLowerCase().includes(search) ||
            item.category.toLowerCase().includes(search);

        const matchesType =
            selectedType === "all" || item.type === selectedType;

        return matchesSearch && matchesType;
    });

    transactionCount.textContent =
        `${filtered.length} ${filtered.length === 1 ? "record" : "records"}`;

    transactionList.replaceChildren();

    if (filtered.length === 0) {
        const row = document.createElement("tr");
        const cell = document.createElement("td");
        cell.colSpan = 5;
        cell.className = "empty";
        cell.textContent = transactions.length
            ? "No matching transactions found."
            : "No transactions yet. Add your first one!";
        row.appendChild(cell);
        transactionList.appendChild(row);
        return;
    }

    filtered.forEach(item => {
        const row = document.createElement("tr");

        const titleCell = document.createElement("td");
        titleCell.textContent = item.title;

        const categoryCell = document.createElement("td");
        const badge = document.createElement("span");
        badge.className = "category-badge";
        badge.textContent = item.category;
        categoryCell.appendChild(badge);

        const dateCell = document.createElement("td");
        dateCell.textContent = item.date;

        const amountCell = document.createElement("td");
        amountCell.className = item.type === "income"
            ? "amount-income" : "amount-expense";
        amountCell.textContent =
            `${item.type === "income" ? "+" : "−"}${money(item.amount)}`;

        const actionCell = document.createElement("td");
        const deleteBtn = document.createElement("button");
        deleteBtn.type = "button";
        deleteBtn.className = "action-btn";
        deleteBtn.textContent = "Delete";
        deleteBtn.setAttribute("aria-label", `Delete ${item.title}`);
        deleteBtn.addEventListener("click", () => deleteTransaction(item.id));
        actionCell.appendChild(deleteBtn);

        row.append(titleCell, categoryCell, dateCell, amountCell, actionCell);
        transactionList.appendChild(row);
    });
}

form.addEventListener("submit", async event => {
    event.preventDefault();
    formMessage.textContent = "";

    const amount = Number(amountInput.value);

    if (!Number.isFinite(amount) || amount <= 0) {
        formMessage.textContent = "Amount must be greater than zero.";
        return;
    }

    const payload = {
        type: typeInput.value,
        title: titleInput.value.trim(),
        amount,
        category: categoryInput.value,
        date: dateInput.value
    };

    if (!payload.title || !payload.date) {
        formMessage.textContent = "Please complete all fields.";
        return;
    }

    submitBtn.disabled = true;

    try {
        await request(API, {
            method: "POST",
            body: JSON.stringify(payload)
        });

        form.reset();
        typeInput.value = "expense";
        dateInput.value = new Date().toLocaleDateString("en-CA");
        formMessage.textContent = "Transaction added successfully!";
        await loadData();
    } catch (error) {
        formMessage.textContent = error.message;
    } finally {
        submitBtn.disabled = false;
    }
});

async function deleteTransaction(id) {
    const item = transactions.find(transaction => transaction.id === id);
    if (!item) return;

    if (!confirm(`Delete "${item.title}"?`)) return;

    try {
        await request(`${API}/${id}`, { method: "DELETE" });
        if (editingId === id) resetForm();
        await loadData();
        formMessage.textContent = "Transaction deleted.";
    } catch (error) {
        historyMessage.textContent = error.message;
    }
}

function resetForm() {
    editingId = null;
    form.reset();
    typeInput.value = "expense";
    dateInput.value = new Date().toLocaleDateString("en-CA");
    formHeading.textContent = "Add a transaction";
    submitBtn.textContent = "+ Add transaction";
    cancelEditBtn.classList.add("hidden");
}

cancelEditBtn.addEventListener("click", resetForm);
searchInput.addEventListener("input", renderTransactions);
filterType.addEventListener("change", renderTransactions);

loadData();