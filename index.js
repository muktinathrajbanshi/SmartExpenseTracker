// Elements
const balanceEl = document.getElementById('balance');
const incomeEl = document.getElementById('income');
const expenseEl = document.getElementById('expense');
const transactionList = document.getElementById('transaction-list');
const form = document.getElementById('transaction-form');

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// Add transaction
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const type = document.getElementById('type').value;
    const date = document.getElementById('date').value;

    const transaction = {
        id: Date.now(),
        title,
        amount,
        type,
        date
    };

    transactions.push(transaction);
    updateLocalStorage();
    renderTransactions();
    form.reset();
});

// Render transactions
function renderTransactions() {
    transactionList.innerHTML = '';

    let income = 0;
    let expense = 0;

    transactions.forEach(tx => {
        const li = document.createElement('li');
        li.classList.add(tx.type);
        li.innerHTML = `
            ${tx.title} <span>$${tx.amount}</span>
            <button onclick="deleteTransaction(${tx.id})">X</button>
        `;
        transactionList.appendChild(li);

        if (tx.type === 'income') income += tx.amount;
        else expense += tx.amount;
    });

    balanceEl.textContent = (income - expense).toFixed(2);
    incomeEl.textContent = income.toFixed(2);
    expenseEl.textContent = expense.toFixed(2);

    renderChart(income, expense);
}

// Delete transaction
function deleteTransaction(id) {
    transactions = transactions.filter(tx => tx.id !== id);
    updateLocalStorage();
    renderTransactions();
}

// LocalStorage
function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Chart.js
let chart;
function renderChart(income, expense) {
    const ctx = document.getElementById('expenseChart').getContext('2d');

    if (chart) chart.destroy();

    chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Income', 'Expense'],
            datasets: [{
                label: 'Amount',
                data: [income, expense],
                backgroundColor: ['#2ecc71', '#e74c3c'],
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Initial render
renderTransactions();