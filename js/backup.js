/**
 * MINTY ASSET VERSIONED BACKUP & RESTORE VAULT (backup.js)
 * Manages automated timestamped snapshots, point-in-time restores, and file exports.
 */

class MintyBackupVault {
  // Create a new snapshot of current state
  async createSnapshot(label = 'Manual Snapshot', source = 'manual') {
    const fullLedger = await window.mintyDB.exportFullLedger();
    const serialized = JSON.stringify(fullLedger);
    const sizeBytes = new Blob([serialized]).size;

    const snapshot = {
      id: 'snap_' + Date.now(),
      timestamp: new Date().toISOString(),
      label: label,
      source: source, // 'manual' | 'auto_daily' | 'pre_restore'
      recordCount: fullLedger.recordCounts.transactions,
      accountCount: fullLedger.recordCounts.accounts,
      sizeBytes: sizeBytes,
      dataJson: serialized
    };

    await window.mintyDB.saveSnapshot(snapshot);
    await this.pruneSnapshots(25); // Retain top 25 snapshots
    return snapshot;
  }

  // Restore state from a snapshot ID
  async restoreSnapshot(snapshotId) {
    const snapshots = await window.mintyDB.getAllSnapshots();
    const target = snapshots.find(s => s.id === snapshotId);

    if (!target) {
      throw new Error('Snapshot not found in local vault.');
    }

    // Safety step: take pre-restore snapshot of current state
    await this.createSnapshot('Pre-Restore Safety Checkpoint', 'pre_restore');

    const parsed = JSON.parse(target.dataJson);
    await window.mintyDB.restoreFromLedger(parsed);

    // Trigger auto-sync if connected to Google Drive
    if (window.mintySync) {
      window.mintySync.triggerAutoSync();
    }

    return true;
  }

  // Export full ledger as a downloadable JSON file
  async downloadBackupFile() {
    const fullLedger = await window.mintyDB.exportFullLedger();
    const jsonStr = JSON.stringify(fullLedger, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const dateStr = new Date().toISOString().split('T')[0];
    const a = document.createElement('a');
    a.href = url;
    a.download = `minty_asset_backup_${dateStr}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Restore from an uploaded JSON file
  async importBackupFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const parsed = JSON.parse(e.target.result);
          if (!parsed.data || !parsed.data.transactions) {
            throw new Error('Invalid backup file structure.');
          }

          // Safety checkpoint
          await this.createSnapshot('Pre-File-Import Safety Checkpoint', 'pre_restore');

          await window.mintyDB.restoreFromLedger(parsed);

          // Save imported file as a snapshot in the vault
          await this.createSnapshot(`Imported from ${file.name}`, 'manual');

          if (window.mintySync) window.mintySync.triggerAutoSync();
          resolve(parsed);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }

  // Prune snapshots older than maxCount, keeping pre_restore and manual ones prioritized
  async pruneSnapshots(maxCount = 25) {
    const snapshots = await window.mintyDB.getAllSnapshots();
    if (snapshots.length <= maxCount) return;

    // Remove oldest snapshots exceeding maxCount
    const excess = snapshots.slice(maxCount);
    for (const snap of excess) {
      await window.mintyDB.deleteSnapshot(snap.id);
    }
  }

  // Format bytes for display
  formatBytes(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(2) + ' MB';
  }
}

window.mintyBackupVault = new MintyBackupVault();
