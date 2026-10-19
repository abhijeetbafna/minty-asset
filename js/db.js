/**
 * MINTY ASSET LOCAL-FIRST DATABASE ENGINE (db.js)
 * IndexedDB persistence layer for 0ms latency and offline-first personal finance management.
 */

const DB_NAME = 'MintyAssetDB';
const DB_VERSION = 1;

class MintyDatabase {
  constructor() {
    this.db = null;
    this.ready = this.init();
  }

  init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Transactions Store
        if (!db.objectStoreNames.contains('transactions')) {
          const txStore = db.createObjectStore('transactions', { keyPath: 'id' });
          txStore.createIndex('date', 'date', { unique: false });
          txStore.createIndex('type', 'type', { unique: false });
          txStore.createIndex('accountId', 'accountId', { unique: false });
          txStore.createIndex('categoryId', 'categoryId', { unique: false });
        }

        // Accounts Store
        if (!db.objectStoreNames.contains('accounts')) {
          const accStore = db.createObjectStore('accounts', { keyPath: 'id' });
          accStore.createIndex('type', 'type', { unique: false });
        }

        // Categories Store
        if (!db.objectStoreNames.contains('categories')) {
          const catStore = db.createObjectStore('categories', { keyPath: 'id' });
          catStore.createIndex('type', 'type', { unique: false });
        }

        // Snapshots / Backup Vault Store
        if (!db.objectStoreNames.contains('snapshots')) {
          const snapStore = db.createObjectStore('snapshots', { keyPath: 'id' });
          snapStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        // App Settings Store
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        resolve(this.db);
      };

      request.onerror = (event) => {
        console.error('IndexedDB error:', event.target.error);
        reject(event.target.error);
      };
    });
  }

  // Generic store helper
  async _getStore(storeName, mode = 'readonly') {
    await this.ready;
    const tx = this.db.transaction(storeName, mode);
    return tx.objectStore(storeName);
  }

  // --- Transactions Operations ---
  async getAllTransactions() {
    const store = await this._getStore('transactions');
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => {
        // Sort descending by date
        const results = request.result.sort((a, b) => new Date(b.date) - new Date(a.date));
        resolve(results);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async addTransaction(tx) {
    const store = await this._getStore('transactions', 'readwrite');
    tx.id = tx.id || 'tx_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
    tx.updatedAt = new Date().toISOString();
    return new Promise((resolve, reject) => {
      const request = store.add(tx);
      request.onsuccess = () => resolve(tx);
      request.onerror = () => reject(request.error);
    });
  }

  async updateTransaction(tx) {
    const store = await this._getStore('transactions', 'readwrite');
    tx.updatedAt = new Date().toISOString();
    return new Promise((resolve, reject) => {
      const request = store.put(tx);
      request.onsuccess = () => resolve(tx);
      request.onerror = () => reject(request.error);
    });
  }

  async deleteTransaction(id) {
    const store = await this._getStore('transactions', 'readwrite');
    return new Promise((resolve, reject) => {
      const request = store.delete(id);
      request.onsuccess = () => resolve(id);
      request.onerror = () => reject(request.error);
    });
  }

  // --- Accounts Operations ---
  async getAllAccounts() {
    const store = await this._getStore('accounts');
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async addAccount(acc) {
    const store = await this._getStore('accounts', 'readwrite');
    acc.id = acc.id || 'acc_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
    acc.updatedAt = new Date().toISOString();
    return new Promise((resolve, reject) => {
      const request = store.add(acc);
      request.onsuccess = () => resolve(acc);
      request.onerror = () => reject(request.error);
    });
  }

  async updateAccount(acc) {
    const store = await this._getStore('accounts', 'readwrite');
    acc.updatedAt = new Date().toISOString();
    return new Promise((resolve, reject) => {
      const request = store.put(acc);
      request.onsuccess = () => resolve(acc);
      request.onerror = () => reject(request.error);
    });
  }

  // --- Categories Operations ---
  async getAllCategories() {
    const store = await this._getStore('categories');
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async addCategory(cat) {
    const store = await this._getStore('categories', 'readwrite');
    cat.id = cat.id || 'cat_' + Date.now();
    return new Promise((resolve, reject) => {
      const request = store.put(cat);
      request.onsuccess = () => resolve(cat);
      request.onerror = () => reject(request.error);
    });
  }

  // --- Snapshots / Backup Vault ---
  async getAllSnapshots() {
    const store = await this._getStore('snapshots');
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => {
        const sorted = request.result.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        resolve(sorted);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async saveSnapshot(snapshot) {
    const store = await this._getStore('snapshots', 'readwrite');
    snapshot.id = snapshot.id || 'snap_' + Date.now();
    snapshot.timestamp = snapshot.timestamp || new Date().toISOString();
    return new Promise((resolve, reject) => {
      const request = store.put(snapshot);
      request.onsuccess = () => resolve(snapshot);
      request.onerror = () => reject(request.error);
    });
  }

  async deleteSnapshot(id) {
    const store = await this._getStore('snapshots', 'readwrite');
    return new Promise((resolve, reject) => {
      const request = store.delete(id);
      request.onsuccess = () => resolve(id);
      request.onerror = () => reject(request.error);
    });
  }

  // --- Settings ---
  async getSetting(key, defaultValue = null) {
    const store = await this._getStore('settings');
    return new Promise((resolve) => {
      const request = store.get(key);
      request.onsuccess = () => {
        resolve(request.result ? request.result.value : defaultValue);
      };
      request.onerror = () => resolve(defaultValue);
    });
  }

  async setSetting(key, value) {
    const store = await this._getStore('settings', 'readwrite');
    return new Promise((resolve, reject) => {
      const request = store.put({ key, value });
      request.onsuccess = () => resolve(value);
      request.onerror = () => reject(request.error);
    });
  }

  // --- Full Ledger Export & Restore ---
  async exportFullLedger() {
    const [transactions, accounts, categories, snapshots] = await Promise.all([
      this.getAllTransactions(),
      this.getAllAccounts(),
      this.getAllCategories(),
      this.getAllSnapshots()
    ]);

    return {
      appName: 'Minty Asset',
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      recordCounts: {
        transactions: transactions.length,
        accounts: accounts.length,
        categories: categories.length,
        snapshots: snapshots.length
      },
      data: {
        transactions,
        accounts,
        categories
      }
    };
  }

  async restoreFromLedger(ledgerData) {
    if (!ledgerData || !ledgerData.data) {
      throw new Error('Invalid backup file format');
    }

    const { transactions, accounts, categories } = ledgerData.data;

    // Clear existing tables in a single transaction
    await this.ready;
    const tx = this.db.transaction(['transactions', 'accounts', 'categories'], 'readwrite');
    
    tx.objectStore('transactions').clear();
    tx.objectStore('accounts').clear();
    tx.objectStore('categories').clear();

    if (accounts) accounts.forEach(acc => tx.objectStore('accounts').put(acc));
    if (categories) categories.forEach(cat => tx.objectStore('categories').put(cat));
    if (transactions) transactions.forEach(t => tx.objectStore('transactions').put(t));

    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  }

  // Seed default categories & accounts if fresh install
  async seedInitialDataIfEmpty() {
    const accounts = await this.getAllAccounts();
    if (accounts.length > 0) return false;

    // Seed Accounts
    const defaultAccounts = [
      { id: 'acc_main_checking', name: 'Primary Checking', type: 'checking', balance: 4250.00, institution: 'Chase', currency: 'USD' },
      { id: 'acc_high_yield', name: 'High-Yield Emergency Fund', type: 'savings', balance: 18500.00, institution: 'Marcus', currency: 'USD' },
      { id: 'acc_rewards_card', name: 'Sapphire Preferred Card', type: 'credit', balance: -740.50, limit: 12000, institution: 'Chase', currency: 'USD' },
      { id: 'acc_index_funds', name: 'Vanguard Index Portfolio', type: 'investment', balance: 46800.00, institution: 'Vanguard', currency: 'USD' }
    ];

    for (const acc of defaultAccounts) {
      await this.addAccount(acc);
    }

    // Seed Categories with Budgets
    const defaultCategories = [
      { id: 'cat_salary', name: 'Income / Salary', type: 'income', color: '#10B981', icon: 'briefcase', budgetLimit: 0 },
      { id: 'cat_freelance', name: 'Investments / Dividends', type: 'income', color: '#059669', icon: 'trending-up', budgetLimit: 0 },
      { id: 'cat_housing', name: 'Housing & Rent', type: 'expense', color: '#6366F1', icon: 'home', budgetLimit: 1800 },
      { id: 'cat_groceries', name: 'Groceries & Food', type: 'expense', color: '#F59E0B', icon: 'shopping-cart', budgetLimit: 600 },
      { id: 'cat_dining', name: 'Dining & Cafes', type: 'expense', color: '#EC4899', icon: 'coffee', budgetLimit: 350 },
      { id: 'cat_utilities', name: 'Utilities & Internet', type: 'expense', color: '#06B6D4', icon: 'zap', budgetLimit: 220 },
      { id: 'cat_transport', name: 'Transit & Fuel', type: 'expense', color: '#8B5CF6', icon: 'truck', budgetLimit: 200 },
      { id: 'cat_entertainment', name: 'Entertainment & Subs', type: 'expense', color: '#F43F5E', icon: 'film', budgetLimit: 150 },
      { id: 'cat_health', name: 'Health & Wellness', type: 'expense', color: '#14B8A6', icon: 'heart', budgetLimit: 180 }
    ];

    for (const cat of defaultCategories) {
      await this.addCategory(cat);
    }

    // Seed realistic recent transactions (30 days)
    const today = new Date();
    const getDateStr = (offsetDays) => {
      const d = new Date(today);
      d.setDate(d.getDate() - offsetDays);
      return d.toISOString().split('T')[0];
    };

    const defaultTransactions = [
      { id: 'tx_1', date: getDateStr(1), amount: 4800.00, type: 'income', categoryId: 'cat_salary', accountId: 'acc_main_checking', note: 'Bi-weekly Direct Deposit' },
      { id: 'tx_2', date: getDateStr(2), amount: 1450.00, type: 'expense', categoryId: 'cat_housing', accountId: 'acc_main_checking', note: 'Monthly Apartment Lease' },
      { id: 'tx_3', date: getDateStr(3), amount: 112.45, type: 'expense', categoryId: 'cat_groceries', accountId: 'acc_rewards_card', note: 'Whole Foods Market' },
      { id: 'tx_4', date: getDateStr(4), amount: 42.80, type: 'expense', categoryId: 'cat_dining', accountId: 'acc_rewards_card', note: 'Ramen Dinner with Friends' },
      { id: 'tx_5', date: getDateStr(6), amount: 89.00, type: 'expense', categoryId: 'cat_utilities', accountId: 'acc_main_checking', note: 'Gigabit Fiber Internet' },
      { id: 'tx_6', date: getDateStr(8), amount: 450.00, type: 'income', categoryId: 'cat_freelance', accountId: 'acc_main_checking', note: 'Quarterly ETF Dividend' },
      { id: 'tx_7', date: getDateStr(10), amount: 64.20, type: 'expense', categoryId: 'cat_transport', accountId: 'acc_rewards_card', note: 'Shell Fuel Station' },
      { id: 'tx_8', date: getDateStr(12), amount: 15.99, type: 'expense', categoryId: 'cat_entertainment', accountId: 'acc_rewards_card', note: 'Spotify & Cloud Streaming' },
      { id: 'tx_9', date: getDateStr(15), amount: 135.50, type: 'expense', categoryId: 'cat_groceries', accountId: 'acc_rewards_card', note: 'Trader Joe’s Pantry Restock' }
    ];

    for (const tx of defaultTransactions) {
      await this.addTransaction(tx);
    }

    return true;
  }
}

// Global DB Singleton instance
window.mintyDB = new MintyDatabase();
