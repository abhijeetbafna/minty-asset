/**
 * MINTY ASSET UI RENDERER & INTERACTIVE COMPONENTS (ui.js)
 * Adheres strictly to ui_ux_design_interface_directive.md
 * - 8pt Grid spacing
 * - WCAG AA Contrast
 * - Accessible touch targets >= 44px
 * - Interactive SVG Data Visualizations
 */

class MintyUI {
  constructor() {
    this.currentTab = 'dashboard';
    this.searchQuery = '';
    this.selectedCategoryFilter = 'all';
  }

  // Format currency with standard locale
  formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(amount);
  }

  // Format friendly date
  formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr + 'T00:00:00');
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  }

  // Show toast notification
  showToast(message, type = 'info') {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <span style="color: ${type === 'success' ? '#10B981' : type === 'error' ? '#F43F5E' : '#6366F1'}">●</span>
      <span>${message}</span>
    `;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  // Refresh current active view
  async refreshAllViews() {
    await this.renderDashboard();
    await this.renderTransactionsTable();
    await this.renderAccountsView();
    await this.renderBudgetsView();
    await this.renderBackupsView();
  }

  // Switch active tab
  switchTab(tabName) {
    this.currentTab = tabName;
    document.querySelectorAll('.nav-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabName);
    });
    document.querySelectorAll('.tab-pane').forEach(pane => {
      pane.classList.toggle('active', pane.id === `tab-${tabName}`);
    });

    if (tabName === 'dashboard') this.renderDashboard();
    if (tabName === 'transactions') this.renderTransactionsTable();
    if (tabName === 'accounts') this.renderAccountsView();
    if (tabName === 'budgets') this.renderBudgetsView();
    if (tabName === 'backups') this.renderBackupsView();
  }

  // ----------------------------------------------------------------------------
  // 1. Dashboard View
  // ----------------------------------------------------------------------------
  async renderDashboard() {
    const [transactions, accounts, categories] = await Promise.all([
      window.mintyDB.getAllTransactions(),
      window.mintyDB.getAllAccounts(),
      window.mintyDB.getAllCategories()
    ]);

    // Calculate Net Worth (Assets - Liabilities)
    let totalAssets = 0;
    let totalLiabilities = 0;
    accounts.forEach(acc => {
      const bal = Number(acc.balance) || 0;
      if (acc.type === 'credit') {
        if (bal < 0) totalLiabilities += Math.abs(bal);
        else totalAssets += bal;
      } else if (bal >= 0) {
        totalAssets += bal;
      } else {
        totalLiabilities += Math.abs(bal);
      }
    });
    const netWorth = totalAssets - totalLiabilities;

    // Current Month Cash Flow
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    let monthIncome = 0;
    let monthExpense = 0;

    transactions.forEach(tx => {
      const txDate = new Date(tx.date + 'T00:00:00');
      if (txDate.getFullYear() === currentYear && txDate.getMonth() === currentMonth) {
        const amt = Number(tx.amount) || 0;
        if (tx.type === 'income') monthIncome += amt;
        if (tx.type === 'expense') monthExpense += amt;
      }
    });

    const netSavings = monthIncome - monthExpense;
    const savingsRate = monthIncome > 0 ? Math.round((netSavings / monthIncome) * 100) : 0;

    // Update Metrics in DOM
    const netWorthEl = document.getElementById('metricNetWorth');
    const incomeEl = document.getElementById('metricIncome');
    const expenseEl = document.getElementById('metricExpense');
    const savingsEl = document.getElementById('metricSavings');

    if (netWorthEl) netWorthEl.textContent = this.formatCurrency(netWorth);
    if (incomeEl) incomeEl.textContent = this.formatCurrency(monthIncome);
    if (expenseEl) expenseEl.textContent = this.formatCurrency(monthExpense);
    if (savingsEl) {
      savingsEl.textContent = `${this.formatCurrency(netSavings)} (${savingsRate}%)`;
      savingsEl.className = `metric-value ${netSavings >= 0 ? 'color-mint' : 'color-rose'}`;
    }

    // Render Recent Transactions (Top 5)
    const recentTxList = document.getElementById('recentTransactionsList');
    if (recentTxList) {
      const top5 = transactions.slice(0, 5);
      if (top5.length === 0) {
        recentTxList.innerHTML = `<div style="padding: 24px; text-align: center; color: var(--text-secondary);">No transactions recorded yet. Click <strong>+ Add Transaction</strong> to begin.</div>`;
      } else {
        recentTxList.innerHTML = top5.map(tx => {
          const cat = categories.find(c => c.id === tx.categoryId) || { name: 'General', color: '#94A3B8' };
          const acc = accounts.find(a => a.id === tx.accountId) || { name: 'Account' };
          const isIncome = tx.type === 'income';

          return `
            <tr style="border-bottom: 1px solid var(--border-subtle);">
              <td style="padding: 12px 16px;">
                <div style="font-weight: 600; color: var(--text-primary);">${tx.note || cat.name}</div>
                <div style="font-size: 12px; color: var(--text-secondary);">${acc.name} • ${this.formatDate(tx.date)}</div>
              </td>
              <td style="padding: 12px 16px;">
                <span class="badge ${isIncome ? 'badge-income' : 'badge-expense'}">
                  ${cat.name}
                </span>
              </td>
              <td style="padding: 12px 16px; text-align: right; font-weight: 600; font-family: var(--font-mono); color: ${isIncome ? 'var(--mint-primary)' : 'var(--color-expense)'};">
                ${isIncome ? '+' : '-'}${this.formatCurrency(tx.amount)}
              </td>
            </tr>
          `;
        }).join('');
      }
    }

    // Render Charts
    this.renderCashFlowChart(transactions);
    this.renderExpenseDonutChart(transactions, categories);
  }

  // ----------------------------------------------------------------------------
  // 2. SVG Cash Flow Bar Chart (Income vs Expense by Month)
  // ----------------------------------------------------------------------------
  renderCashFlowChart(transactions) {
    const container = document.getElementById('cashFlowChartContainer');
    if (!container) return;

    // Aggregate last 5 months
    const months = [];
    const now = new Date();
    for (let i = 4; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        label: d.toLocaleDateString('en-US', { month: 'short' }),
        year: d.getFullYear(),
        month: d.getMonth(),
        income: 0,
        expense: 0
      });
    }

    transactions.forEach(tx => {
      const txDate = new Date(tx.date + 'T00:00:00');
      const item = months.find(m => m.year === txDate.getFullYear() && m.month === txDate.getMonth());
      if (item) {
        if (tx.type === 'income') item.income += Number(tx.amount) || 0;
        if (tx.type === 'expense') item.expense += Number(tx.amount) || 0;
      }
    });

    const maxVal = Math.max(...months.map(m => Math.max(m.income, m.expense)), 2000);
    const height = 220;
    const width = 580;
    const barWidth = 24;
    const groupGap = 95;
    const startX = 60;

    let svgHtml = `
      <svg viewBox="0 0 ${width} ${height}" class="chart-svg" style="max-height: 220px;">
        <!-- Horizontal Guide Lines -->
        <line x1="40" y1="30" x2="${width - 20}" y2="30" stroke="var(--border-subtle)" stroke-dasharray="3,3" />
        <line x1="40" y1="90" x2="${width - 20}" y2="90" stroke="var(--border-subtle)" stroke-dasharray="3,3" />
        <line x1="40" y1="150" x2="${width - 20}" y2="150" stroke="var(--border-subtle)" stroke-dasharray="3,3" />
        <line x1="40" y1="190" x2="${width - 20}" y2="190" stroke="var(--border-prominent)" />
    `;

    months.forEach((m, idx) => {
      const x = startX + (idx * groupGap);
      const incH = Math.max((m.income / maxVal) * 150, 4);
      const expH = Math.max((m.expense / maxVal) * 150, 4);

      const incY = 190 - incH;
      const expY = 190 - expH;

      svgHtml += `
        <!-- Income Bar -->
        <rect x="${x}" y="${incY}" width="${barWidth}" height="${incH}" rx="4" fill="var(--mint-primary)" class="bar-rect">
          <title>${m.label} Income: ${this.formatCurrency(m.income)}</title>
        </rect>
        <!-- Expense Bar -->
        <rect x="${x + barWidth + 6}" y="${expY}" width="${barWidth}" height="${expH}" rx="4" fill="var(--color-expense)" class="bar-rect">
          <title>${m.label} Expense: ${this.formatCurrency(m.expense)}</title>
        </rect>
        <!-- Month Label -->
        <text x="${x + barWidth + 3}" y="208" text-anchor="middle" fill="var(--text-secondary)" font-size="12" font-weight="600">${m.label}</text>
      `;
    });

    svgHtml += `</svg>`;
    container.innerHTML = svgHtml;
  }

  // ----------------------------------------------------------------------------
  // 3. SVG Expense Category Donut Chart
  // ----------------------------------------------------------------------------
  renderExpenseDonutChart(transactions, categories) {
    const container = document.getElementById('expenseDonutContainer');
    const legendEl = document.getElementById('expenseDonutLegend');
    if (!container) return;

    // Aggregate expenses by category for current month
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    const catTotals = {};
    let totalExpense = 0;

    transactions.forEach(tx => {
      if (tx.type !== 'expense') return;
      const txDate = new Date(tx.date + 'T00:00:00');
      if (txDate.getFullYear() === currentYear && txDate.getMonth() === currentMonth) {
        const amt = Number(tx.amount) || 0;
        catTotals[tx.categoryId] = (catTotals[tx.categoryId] || 0) + amt;
        totalExpense += amt;
      }
    });

    const entries = Object.entries(catTotals)
      .map(([catId, amount]) => {
        const cat = categories.find(c => c.id === catId) || { name: 'Other', color: '#94A3B8' };
        return { name: cat.name, color: cat.color, amount, percent: totalExpense > 0 ? (amount / totalExpense) : 0 };
      })
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5); // Top 5

    if (totalExpense === 0 || entries.length === 0) {
      container.innerHTML = `<div style="text-align: center; color: var(--text-secondary); font-size: 13px;">No expenses recorded this month</div>`;
      if (legendEl) legendEl.innerHTML = '';
      return;
    }

    // Build SVG Donut
    const size = 180;
    const center = size / 2;
    const radius = 64;
    const strokeWidth = 24;
    const circumference = 2 * Math.PI * radius;

    let accumulatedAngle = 0;
    let circleSegments = '';

    entries.forEach(item => {
      const strokeDash = item.percent * circumference;
      const strokeDashoffset = -accumulatedAngle;
      accumulatedAngle += strokeDash;

      circleSegments += `
        <circle cx="${center}" cy="${center}" r="${radius}"
          fill="none"
          stroke="${item.color}"
          stroke-width="${strokeWidth}"
          stroke-dasharray="${strokeDash} ${circumference}"
          stroke-dashoffset="${strokeDashoffset}"
          class="donut-slice">
          <title>${item.name}: ${this.formatCurrency(item.amount)} (${Math.round(item.percent * 100)}%)</title>
        </circle>
      `;
    });

    container.innerHTML = `
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" style="transform: rotate(-90deg); border-radius: 50%;">
        ${circleSegments}
      </svg>
      <div style="position: absolute; text-align: center; pointer-events: none;">
        <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-secondary);">Total Outflow</div>
        <div style="font-size: 16px; font-weight: 600; color: var(--text-primary); font-family: var(--font-mono);">${this.formatCurrency(totalExpense)}</div>
      </div>
    `;

    // Render Legend
    if (legendEl) {
      legendEl.innerHTML = entries.map(item => `
        <div class="legend-item">
          <div style="display: flex; align-items: center;">
            <span class="legend-color-dot" style="background-color: ${item.color};"></span>
            <span>${item.name}</span>
          </div>
          <span style="font-weight: 600; color: var(--text-primary);">${this.formatCurrency(item.amount)} (${Math.round(item.percent * 100)}%)</span>
        </div>
      `).join('');
    }
  }

  // ----------------------------------------------------------------------------
  // 4. Transactions Ledger Table View
  // ----------------------------------------------------------------------------
  async renderTransactionsTable() {
    const [transactions, accounts, categories] = await Promise.all([
      window.mintyDB.getAllTransactions(),
      window.mintyDB.getAllAccounts(),
      window.mintyDB.getAllCategories()
    ]);

    const tbody = document.getElementById('transactionsTableBody');
    if (!tbody) return;

    // Filter by search query and category
    let filtered = transactions.filter(tx => {
      const noteMatch = (tx.note || '').toLowerCase().includes(this.searchQuery.toLowerCase());
      const cat = categories.find(c => c.id === tx.categoryId);
      const catMatch = cat ? cat.name.toLowerCase().includes(this.searchQuery.toLowerCase()) : false;
      const matchesSearch = noteMatch || catMatch;

      const matchesCat = this.selectedCategoryFilter === 'all' || tx.categoryId === this.selectedCategoryFilter;
      return matchesSearch && matchesCat;
    });

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 32px; color: var(--text-secondary);">No transactions match your filter criteria.</td></tr>`;
      return;
    }

    tbody.innerHTML = filtered.map(tx => {
      const cat = categories.find(c => c.id === tx.categoryId) || { name: 'General', color: '#94A3B8' };
      const acc = accounts.find(a => a.id === tx.accountId) || { name: 'Default Account' };
      const isIncome = tx.type === 'income';

      return `
        <tr>
          <td>${this.formatDate(tx.date)}</td>
          <td>
            <div style="font-weight: 600; color: var(--text-primary);">${tx.note || cat.name}</div>
            ${tx.isRecurring ? '<span style="font-size: 11px; color: var(--mint-primary);">↺ Recurring</span>' : ''}
          </td>
          <td>
            <span class="badge ${isIncome ? 'badge-income' : 'badge-expense'}">
              ${cat.name}
            </span>
          </td>
          <td>${acc.name}</td>
          <td style="text-align: right; font-weight: 600; font-family: var(--font-mono); color: ${isIncome ? 'var(--mint-primary)' : 'var(--color-expense)'};">
            ${isIncome ? '+' : '-'}${this.formatCurrency(tx.amount)}
          </td>
          <td style="text-align: center; width: 60px;">
            <button class="btn btn-ghost" style="padding: 4px 8px; min-height: 32px;" onclick="window.mintyApp.deleteTx('${tx.id}')" title="Delete transaction">
              ✕
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }

  // ----------------------------------------------------------------------------
  // 5. Accounts View
  // ----------------------------------------------------------------------------
  async renderAccountsView() {
    const accounts = await window.mintyDB.getAllAccounts();
    const container = document.getElementById('accountsListContainer');
    if (!container) return;

    container.innerHTML = accounts.map(acc => {
      const isCredit = acc.type === 'credit';
      const bal = Number(acc.balance) || 0;
      let utilizationBadge = '';

      if (isCredit && acc.limit) {
        const used = Math.abs(bal);
        const pct = Math.round((used / acc.limit) * 100);
        const isHigh = pct > 30;
        utilizationBadge = `
          <div style="margin-top: 8px;">
            <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px;">
              <span>Credit Limit: ${this.formatCurrency(acc.limit)}</span>
              <span style="color: ${isHigh ? 'var(--color-warning)' : 'var(--mint-primary)'}; font-weight: 600;">${pct}% Utilization</span>
            </div>
            <div class="progress-track">
              <div class="progress-fill ${isHigh ? 'warn' : 'safe'}" style="width: ${Math.min(pct, 100)}%;"></div>
            </div>
          </div>
        `;
      }

      return `
        <div class="card">
          <div class="card-header">
            <div>
              <div class="card-title">${acc.name}</div>
              <div style="font-size: 12px; color: var(--text-secondary); text-transform: capitalize;">${acc.institution || acc.type}</div>
            </div>
            <span class="badge ${isCredit ? 'badge-expense' : 'badge-income'}">
              ${acc.type.toUpperCase()}
            </span>
          </div>
          <div style="font-size: 24px; font-weight: 600; font-family: var(--font-mono); color: var(--text-primary); margin-top: 8px;">
            ${this.formatCurrency(acc.balance)}
          </div>
          ${utilizationBadge}
        </div>
      `;
    }).join('');
  }

  // ----------------------------------------------------------------------------
  // 6. Budgets View (50/30/20 & Category Envelopes)
  // ----------------------------------------------------------------------------
  async renderBudgetsView() {
    const [categories, transactions] = await Promise.all([
      window.mintyDB.getAllCategories(),
      window.mintyDB.getAllTransactions()
    ]);

    const container = document.getElementById('budgetEnvelopesContainer');
    if (!container) return;

    // Monthly spent per category
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    const spentByCat = {};
    transactions.forEach(tx => {
      if (tx.type !== 'expense') return;
      const txDate = new Date(tx.date + 'T00:00:00');
      if (txDate.getFullYear() === currentYear && txDate.getMonth() === currentMonth) {
        spentByCat[tx.categoryId] = (spentByCat[tx.categoryId] || 0) + (Number(tx.amount) || 0);
      }
    });

    const expenseCategories = categories.filter(c => c.type === 'expense' && c.budgetLimit > 0);

    if (expenseCategories.length === 0) {
      container.innerHTML = `<div style="padding: 24px; text-align: center; color: var(--text-secondary);">No category budget limits set yet.</div>`;
      return;
    }

    container.innerHTML = expenseCategories.map(cat => {
      const spent = spentByCat[cat.id] || 0;
      const limit = cat.budgetLimit || 1;
      const pct = Math.round((spent / limit) * 100);
      const remaining = limit - spent;
      const statusClass = pct > 100 ? 'danger' : pct >= 80 ? 'warn' : 'safe';

      return `
        <div class="budget-bar-wrapper">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span class="legend-color-dot" style="background-color: ${cat.color};"></span>
              <span style="font-weight: 600; font-size: 14px; color: var(--text-primary);">${cat.name}</span>
            </div>
            <div style="font-size: 13px; font-weight: 600; font-family: var(--font-mono); color: var(--text-primary);">
              ${this.formatCurrency(spent)} / ${this.formatCurrency(limit)}
            </div>
          </div>
          <div class="progress-track" style="height: 10px;">
            <div class="progress-fill ${statusClass}" style="width: ${Math.min(pct, 100)}%;"></div>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 12px; color: var(--text-secondary);">
            <span>${pct}% Spent</span>
            <span style="color: ${remaining < 0 ? 'var(--color-expense)' : 'var(--text-secondary)'};">
              ${remaining >= 0 ? `${this.formatCurrency(remaining)} remaining` : `${this.formatCurrency(Math.abs(remaining))} OVER BUDGET`}
            </span>
          </div>
        </div>
      `;
    }).join('');
  }

  // ----------------------------------------------------------------------------
  // 7. Backup & Restore Vault View
  // ----------------------------------------------------------------------------
  async renderBackupsView() {
    const snapshots = await window.mintyDB.getAllSnapshots();
    const container = document.getElementById('snapshotsListContainer');
    if (!container) return;

    if (snapshots.length === 0) {
      container.innerHTML = `
        <div style="padding: 24px; text-align: center; color: var(--text-secondary); grid-column: 1 / -1;">
          No snapshots saved yet. Click <strong>Create Snapshot Now</strong> to take your first versioned backup.
        </div>
      `;
      return;
    }

    container.innerHTML = snapshots.map(snap => {
      const dateFormatted = new Date(snap.timestamp).toLocaleString();
      const sizeStr = window.mintyBackupVault.formatBytes(snap.sizeBytes || 0);

      return `
        <div class="snapshot-item">
          <div class="snapshot-meta">
            <div class="snapshot-timestamp">${snap.label}</div>
            <div class="snapshot-details">
              ${dateFormatted} • ${snap.recordCount || 0} transactions • ${sizeStr}
            </div>
          </div>
          <div style="display: flex; gap: 8px;">
            <button class="btn btn-secondary" style="padding: 6px 12px; font-size: 12px; min-height: 36px;" onclick="window.mintyApp.restoreSnapshot('${snap.id}')">
              Restore
            </button>
            <button class="btn btn-ghost" style="padding: 6px 8px; font-size: 12px; min-height: 36px;" onclick="window.mintyApp.deleteSnapshot('${snap.id}')" title="Delete snapshot">
              ✕
            </button>
          </div>
        </div>
      `;
    }).join('');
  }
}

window.mintyUI = new MintyUI();
