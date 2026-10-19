/**
 * MINTY ASSET APPLICATION CONTROLLER (app.js)
 * Handles user interactions, form submissions, modal dialogues, and sync triggers.
 */

class MintyApp {
  constructor() {
    this.init();
  }

  async init() {
    // 1. Initialize Database & Seed sample data if empty
    await window.mintyDB.ready;
    await window.mintyDB.seedInitialDataIfEmpty();

    // 2. Setup Navigation Tab Listeners
    document.querySelectorAll('.nav-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        window.mintyUI.switchTab(btn.dataset.tab);
      });
    });

    // 3. Theme Toggle Setup
    const savedTheme = await window.mintyDB.getSetting('theme', 'dark');
    this.applyTheme(savedTheme);

    const themeToggleBtn = document.getElementById('themeToggleBtn');
    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', async () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(nextTheme);
        await window.mintyDB.setSetting('theme', nextTheme);
      });
    }

    // 4. Setup Modals
    this.setupModals();

    // 5. Populate Category & Account dropdowns in Add Transaction Form
    await this.populateFormOptions();

    // 6. Setup Google Drive Sync Listeners & Initial Auth
    this.setupGoogleSync();

    // 7. Initial UI Render
    await window.mintyUI.refreshAllViews();

    // 8. Search & Filter Input Listeners
    const searchInput = document.getElementById('txSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        window.mintyUI.searchQuery = e.target.value;
        window.mintyUI.renderTransactionsTable();
      });
    }

    const catFilterSelect = document.getElementById('txCategoryFilterSelect');
    if (catFilterSelect) {
      catFilterSelect.addEventListener('change', (e) => {
        window.mintyUI.selectedCategoryFilter = e.target.value;
        window.mintyUI.renderTransactionsTable();
      });
    }

    console.log('Minty Asset Money Manager initialized successfully.');
  }

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const btn = document.getElementById('themeToggleBtn');
    if (btn) {
      btn.textContent = theme === 'dark' ? '☀️ Light' : '🌙 Dark';
    }
  }

  // Populate Add Transaction Select dropdowns
  async populateFormOptions() {
    const [categories, accounts] = await Promise.all([
      window.mintyDB.getAllCategories(),
      window.mintyDB.getAllAccounts()
    ]);

    const catSelect = document.getElementById('txCategorySelect');
    const filterCatSelect = document.getElementById('txCategoryFilterSelect');
    const accSelect = document.getElementById('txAccountSelect');

    if (catSelect) {
      catSelect.innerHTML = categories.map(c => `
        <option value="${c.id}">${c.name} (${c.type})</option>
      `).join('');
    }

    if (filterCatSelect) {
      filterCatSelect.innerHTML = `<option value="all">All Categories</option>` + categories.map(c => `
        <option value="${c.id}">${c.name}</option>
      `).join('');
    }

    if (accSelect) {
      accSelect.innerHTML = accounts.map(a => `
        <option value="${a.id}">${a.name} (${a.type})</option>
      `).join('');
    }

    // Default transaction date to today
    const dateInput = document.getElementById('txDateInput');
    if (dateInput) {
      dateInput.value = new Date().toISOString().split('T')[0];
    }
  }

  // Setup Modal Open/Close handlers
  setupModals() {
    // Add Transaction Modal
    const addTxBtn = document.getElementById('openAddTxModalBtn');
    const addTxModal = document.getElementById('addTxModal');
    const closeTxModal = document.getElementById('closeAddTxModalBtn');
    const txForm = document.getElementById('addTxForm');

    if (addTxBtn && addTxModal) {
      addTxBtn.addEventListener('click', () => {
        addTxModal.classList.add('open');
      });
    }

    if (closeTxModal && addTxModal) {
      closeTxModal.addEventListener('click', () => {
        addTxModal.classList.remove('open');
      });
    }

    // Google Sync Settings Modal
    const syncPill = document.getElementById('syncIndicatorPill');
    const syncModal = document.getElementById('syncModal');
    const closeSyncModal = document.getElementById('closeSyncModalBtn');

    if (syncPill && syncModal) {
      syncPill.addEventListener('click', () => {
        syncModal.classList.add('open');
      });
    }

    if (closeSyncModal && syncModal) {
      closeSyncModal.addEventListener('click', () => {
        syncModal.classList.remove('open');
      });
    }

    // Close on backdrop click or Escape key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-backdrop.open').forEach(m => m.classList.remove('open'));
      }
    });

    // Add Transaction Form Submission
    if (txForm) {
      txForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await this.handleCreateTransaction();
      });
    }

    // Create Snapshot Button
    const createSnapBtn = document.getElementById('createSnapshotBtn');
    if (createSnapBtn) {
      createSnapBtn.addEventListener('click', async () => {
        const label = prompt('Enter a label for this backup snapshot:', `Snapshot ${new Date().toLocaleDateString()}`);
        if (!label) return;
        await window.mintyBackupVault.createSnapshot(label, 'manual');
        window.mintyUI.showToast('Backup snapshot created successfully!', 'success');
        await window.mintyUI.renderBackupsView();
      });
    }

    // Download Backup File
    const downloadBackupBtn = document.getElementById('downloadBackupBtn');
    if (downloadBackupBtn) {
      downloadBackupBtn.addEventListener('click', async () => {
        await window.mintyBackupVault.downloadBackupFile();
        window.mintyUI.showToast('Backup file downloaded to your device.', 'success');
      });
    }

    // Import Backup File Input
    const importFileInput = document.getElementById('importBackupFileInput');
    if (importFileInput) {
      importFileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        try {
          await window.mintyBackupVault.importBackupFile(file);
          window.mintyUI.showToast('Ledger successfully restored from file!', 'success');
          await window.mintyUI.refreshAllViews();
        } catch (err) {
          alert('Failed to import backup: ' + err.message);
        }
      });
    }
  }

  // Handle New Transaction
  async handleCreateTransaction() {
    const amount = parseFloat(document.getElementById('txAmountInput').value);
    const type = document.getElementById('txTypeSelect').value;
    const categoryId = document.getElementById('txCategorySelect').value;
    const accountId = document.getElementById('txAccountSelect').value;
    const date = document.getElementById('txDateInput').value;
    const note = document.getElementById('txNoteInput').value;
    const isRecurring = document.getElementById('txRecurringCheckbox').checked;

    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid positive transaction amount.');
      return;
    }

    const tx = {
      amount,
      type,
      categoryId,
      accountId,
      date,
      note,
      isRecurring
    };

    // Save to IndexedDB
    await window.mintyDB.addTransaction(tx);

    // Update Account Balance
    const accounts = await window.mintyDB.getAllAccounts();
    const targetAccount = accounts.find(a => a.id === accountId);
    if (targetAccount) {
      if (type === 'income') {
        targetAccount.balance = (Number(targetAccount.balance) || 0) + amount;
      } else if (type === 'expense') {
        targetAccount.balance = (Number(targetAccount.balance) || 0) - amount;
      }
      await window.mintyDB.updateAccount(targetAccount);
    }

    // Close modal & reset form
    document.getElementById('addTxModal').classList.remove('open');
    document.getElementById('addTxForm').reset();
    document.getElementById('txDateInput').value = new Date().toISOString().split('T')[0];

    // Trigger auto-sync if connected
    if (window.mintySync) {
      window.mintySync.triggerAutoSync();
    }

    window.mintyUI.showToast('Transaction added successfully!', 'success');
    await window.mintyUI.refreshAllViews();
  }

  // Delete Transaction
  async deleteTx(id) {
    if (!confirm('Are you sure you want to delete this transaction?')) return;
    await window.mintyDB.deleteTransaction(id);
    if (window.mintySync) window.mintySync.triggerAutoSync();
    window.mintyUI.showToast('Transaction deleted.', 'info');
    await window.mintyUI.refreshAllViews();
  }

  // Restore snapshot by ID
  async restoreSnapshot(id) {
    if (!confirm('Are you sure you want to restore this version? A safety checkpoint of your current data will be saved automatically.')) {
      return;
    }
    try {
      await window.mintyBackupVault.restoreSnapshot(id);
      window.mintyUI.showToast('Restored successfully to selected version!', 'success');
      await window.mintyUI.refreshAllViews();
    } catch (err) {
      alert('Error during restore: ' + err.message);
    }
  }

  // Delete snapshot by ID
  async deleteSnapshot(id) {
    if (!confirm('Delete this backup snapshot from the vault?')) return;
    await window.mintyDB.deleteSnapshot(id);
    window.mintyUI.showToast('Snapshot removed.', 'info');
    await window.mintyUI.renderBackupsView();
  }

  // Setup Google Identity Services & Sync Status
  async setupGoogleSync() {
    const syncDot = document.getElementById('syncStatusDot');
    const syncText = document.getElementById('syncStatusText');

    window.mintySync.onStatusChange((state) => {
      if (syncDot && syncText) {
        if (state.status === 'synced') {
          syncDot.className = 'sync-dot synced';
          syncText.textContent = 'Google Synced';
        } else if (state.status === 'syncing' || state.status === 'connecting') {
          syncDot.className = 'sync-dot syncing';
          syncText.textContent = 'Syncing...';
        } else if (state.status === 'error') {
          syncDot.className = 'sync-dot';
          syncDot.style.backgroundColor = '#F43F5E';
          syncText.textContent = 'Sync Alert';
        } else {
          syncDot.className = 'sync-dot';
          syncDot.style.backgroundColor = '#94A3B8';
          syncText.textContent = 'Local (Offline)';
        }
      }

      // Update sync modal details
      const modalStatus = document.getElementById('syncModalStatusText');
      if (modalStatus) {
        modalStatus.textContent = state.message || state.status;
      }
      if (state.userProfile) {
        const profileBox = document.getElementById('googleUserProfileBox');
        if (profileBox) {
          profileBox.style.display = 'block';
          profileBox.innerHTML = `
            <div style="font-weight: 600; color: var(--text-primary);">${state.userProfile.name}</div>
            <div style="font-size: 12px; color: var(--text-secondary);">${state.userProfile.email}</div>
          `;
        }
      }
    });

    // Check stored Google Client ID
    const storedClientId = await window.mintyDB.getSetting('google_client_id', '');
    const clientIdInput = document.getElementById('googleClientIdInput');
    if (clientIdInput && storedClientId) {
      clientIdInput.value = storedClientId;
      window.mintySync.initGoogleAuth(storedClientId);
    }

    // Connect Google Account Button in Modal
    const connectGoogleBtn = document.getElementById('connectGoogleBtn');
    if (connectGoogleBtn) {
      connectGoogleBtn.addEventListener('click', async () => {
        const idVal = clientIdInput ? clientIdInput.value.trim() : '';
        if (!idVal) {
          alert('Please enter your Google OAuth 2.0 Client ID.');
          return;
        }
        await window.mintyDB.setSetting('google_client_id', idVal);
        await window.mintySync.initGoogleAuth(idVal);
        window.mintySync.requestSignIn();
      });
    }

    // Force Manual Sync Now Button
    const syncNowBtn = document.getElementById('manualSyncNowBtn');
    if (syncNowBtn) {
      syncNowBtn.addEventListener('click', async () => {
        await window.mintySync.performSync();
      });
    }
  }
}

// Global App instance on window load
window.addEventListener('DOMContentLoaded', () => {
  window.mintyApp = new MintyApp();
});
