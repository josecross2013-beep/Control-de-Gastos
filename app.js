const app = {
    transactions: JSON.parse(localStorage.getItem('transactions')) || [],
    currentMonth: new Date().toISOString().slice(0, 7), // YYYY-MM
    chart: null,
    categories: {
        income: ['Salario', 'Venta', 'Regalo', 'Inversión', 'Otros'],
        expense: ['Comida', 'Transporte', 'Vivienda', 'Salud', 'Entretenimiento', 'Suscripciones', 'Otros'],
        saving: ['Fondo de Emergencia', 'Viaje', 'Inversión', 'Otros']
    },

    init() {
        this.renderMonthSelector();
        this.updateUI();
        this.setupEventListeners();
        lucide.createIcons();
    },

    setupEventListeners() {
        document.getElementById('monthSelector').addEventListener('change', (e) => {
            this.currentMonth = e.target.value;
            this.updateUI();
        });

        document.getElementById('transactionForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveTransaction();
        });

        document.querySelectorAll('input[name="type"]').forEach(input => {
            input.addEventListener('change', () => this.updateCategoryOptions());
        });

        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.renderTransactions(e.target.dataset.type);
            });
        });

        document.getElementById('deleteBtn').addEventListener('click', () => this.deleteTransaction());
    },

    renderMonthSelector() {
        const selector = document.getElementById('monthSelector');
        const months = [];
        const date = new Date();

        // Generate last 12 months
        for (let i = 0; i < 12; i++) {
            const m = new Date(date.getFullYear(), date.getMonth() - i, 1);
            const value = m.toISOString().slice(0, 7);
            const label = m.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
            months.push(`<option value="${value}">${label}</option>`);
        }
        selector.innerHTML = months.join('');
    },

    updateUI() {
        const filtered = this.getFilteredTransactions();

        // Calculate Totals
        const totals = filtered.reduce((acc, t) => {
            acc[t.type] += parseFloat(t.amount);
            return acc;
        }, { income: 0, expense: 0, saving: 0 });

        const balance = totals.income - totals.expense - totals.saving;

        // Update DOM
        document.getElementById('totalBalance').textContent = this.formatCurrency(balance);
        document.getElementById('totalIncome').textContent = this.formatCurrency(totals.income);
        document.getElementById('totalExpense').textContent = this.formatCurrency(totals.expense);
        document.getElementById('totalSavings').textContent = this.formatCurrency(totals.saving);

        this.renderTransactions();
        this.updateChart(filtered);
        lucide.createIcons();
    },

    getFilteredTransactions() {
        return this.transactions.filter(t => t.date.startsWith(this.currentMonth));
    },

    renderTransactions(filterType = 'all') {
        const filtered = this.getFilteredTransactions();
        const displayList = filterType === 'all' ? filtered : filtered.filter(t => t.type === filterType);

        const listHtml = displayList.sort((a, b) => new Date(b.date) - new Date(a.date)).map(t => `
            <div class="transaction-item" onclick="app.editTransaction('${t.id}')">
                <div class="item-icon ${t.type}">
                    <i data-lucide="${this.getIconForType(t.type)}"></i>
                </div>
                <div class="item-info">
                    <h4>${t.category}</h4>
                    <p>${t.description || t.category} • ${new Date(t.date).toLocaleDateString('es-ES')}</p>
                </div>
                <div class="item-amount ${t.type}">
                    ${t.type === 'expense' ? '-' : '+'}${this.formatCurrency(t.amount)}
                </div>
            </div>
        `).join('');

        document.getElementById('fullTransactionList').innerHTML = listHtml;

        // Update recent list (first 5)
        document.getElementById('recentList').innerHTML = listHtml.split('</div>').slice(0, 5).join('</div>');
        lucide.createIcons();
    },

    getIconForType(type) {
        if (type === 'income') return 'trending-up';
        if (type === 'expense') return 'shopping-bag';
        return 'piggy-bank';
    },

    formatCurrency(amount) {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN'
        }).format(amount);
    },

    switchView(viewId) {
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        document.getElementById(`view-${viewId}`).classList.add('active');

        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        // Mapping of views to nav index
        const navMap = { overview: 0, transactions: 1, charts: 3, settings: 4 };
        if (navMap[viewId] !== undefined) {
            document.querySelectorAll('.nav-item')[navMap[viewId]].classList.add('active');
        }
    },

    openModal(transaction = null) {
        const modal = document.getElementById('transactionModal');
        const form = document.getElementById('transactionForm');
        const deleteBtn = document.getElementById('deleteBtn');

        if (transaction) {
            document.getElementById('modalTitle').textContent = 'Editar Registro';
            document.getElementById('editId').value = transaction.id;
            form.type.value = transaction.type;
            document.getElementById('amount').value = transaction.amount;
            document.getElementById('date').value = transaction.date;
            document.getElementById('description').value = transaction.description;
            deleteBtn.style.display = 'block';
            this.updateCategoryOptions(transaction.category);
        } else {
            document.getElementById('modalTitle').textContent = 'Nuevo Registro';
            document.getElementById('editId').value = '';
            form.reset();
            form.type.value = 'income';
            document.getElementById('date').value = new Date().toISOString().split('T')[0];
            deleteBtn.style.display = 'none';
            this.updateCategoryOptions();
        }

        modal.classList.add('active');
    },

    closeModal() {
        document.getElementById('transactionModal').classList.remove('active');
    },

    updateCategoryOptions(selected = null) {
        const type = document.querySelector('input[name="type"]:checked').value;
        const selector = document.getElementById('category');
        selector.innerHTML = this.categories[type].map(c =>
            `<option value="${c}" ${c === selected ? 'selected' : ''}>${c}</option>`
        ).join('');
    },

    saveTransaction() {
        const form = document.getElementById('transactionForm');
        const id = document.getElementById('editId').value;

        const data = {
            id: id || Date.now().toString(),
            type: form.type.value,
            amount: parseFloat(document.getElementById('amount').value),
            category: document.getElementById('category').value,
            date: document.getElementById('date').value,
            description: document.getElementById('description').value
        };

        if (id) {
            const index = this.transactions.findIndex(t => t.id === id);
            this.transactions[index] = data;
        } else {
            this.transactions.push(data);
        }

        this.saveAndRefresh();
        this.closeModal();
    },

    editTransaction(id) {
        const transaction = this.transactions.find(t => t.id === id);
        this.openModal(transaction);
    },

    deleteTransaction() {
        const id = document.getElementById('editId').value;
        if (confirm('¿Estás seguro de eliminar este registro?')) {
            this.transactions = this.transactions.filter(t => t.id !== id);
            this.saveAndRefresh();
            this.closeModal();
        }
    },

    saveAndRefresh() {
        localStorage.setItem('transactions', JSON.stringify(this.transactions));
        this.updateUI();
    },

    updateChart(filtered) {
        const expenses = filtered.filter(t => t.type === 'expense');
        const dataMap = expenses.reduce((acc, t) => {
            acc[t.category] = (acc[t.category] || 0) + parseFloat(t.amount);
            return acc;
        }, {});

        const canvas = document.getElementById('expenseChart');
        if (this.chart) this.chart.destroy();

        if (expenses.length === 0) {
            // Draw dummy chart or text
            return;
        }

        this.chart = new Chart(canvas, {
            type: 'doughnut',
            data: {
                labels: Object.keys(dataMap),
                datasets: [{
                    data: Object.values(dataMap),
                    backgroundColor: [
                        '#2563eb', '#10b981', '#f59e0b', '#ef4444',
                        '#8b5cf6', '#ec4899', '#6366f1'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'bottom' }
                },
                cutout: '70%'
            }
        });
    }
};

// Service Worker Registration
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js');
}

window.onload = () => app.init();
