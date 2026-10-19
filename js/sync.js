/**
 * MINTY ASSET GOOGLE DRIVE REAL-TIME SYNC ENGINE (sync.js)
 * Synchronizes financial ledger across devices in real time using the user's personal Google Drive.
 * 100% Free / Zero hosting cost.
 */

const DRIVE_FILE_NAME = 'minty_asset_ledger.json';
const DRIVE_APP_DATA_FOLDER = 'appDataFolder';

class MintySync {
  constructor() {
    this.accessToken = null;
    this.tokenClient = null;
    this.userProfile = null;
    this.status = 'local'; // 'local' | 'connecting' | 'syncing' | 'synced' | 'error'
    this.lastSyncTime = null;
    this.syncListeners = [];
    this.debounceTimer = null;
    this.remoteFileId = null;
  }

  // Register listener for sync status changes
  onStatusChange(fn) {
    this.syncListeners.push(fn);
  }

  _notify(message = '') {
    this.syncListeners.forEach(fn => fn({
      status: this.status,
      lastSyncTime: this.lastSyncTime,
      userProfile: this.userProfile,
      message
    }));
  }

  // Initialize Google Identity Services
  async initGoogleAuth(clientId) {
    if (!clientId || clientId.includes('your_google_oauth_client_id')) {
      console.log('Google Client ID not configured yet. Operating in Local-First mode.');
      this.status = 'local';
      this._notify('Local Mode (Configure Google Client ID to enable cloud sync)');
      return false;
    }

    if (typeof google === 'undefined' || !google.accounts) {
      console.warn('Google Identity Services SDK script not loaded yet.');
      return false;
    }

    try {
      this.tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: 'https://www.googleapis.com/auth/drive.appdata https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
        callback: async (tokenResponse) => {
          if (tokenResponse && tokenResponse.access_token) {
            this.accessToken = tokenResponse.access_token;
            await this._fetchUserProfile();
            this.status = 'synced';
            await this.performSync();
          } else {
            this.status = 'error';
            this._notify('Authorization was not completed.');
          }
        }
      });
      return true;
    } catch (e) {
      console.error('Error initializing Google GIS:', e);
      return false;
    }
  }

  // Prompt Google Sign-In
  requestSignIn() {
    if (!this.tokenClient) {
      throw new Error('Google OAuth is not configured. Please enter your Google OAuth Client ID in Settings.');
    }
    this.status = 'connecting';
    this._notify('Connecting to Google...');
    this.tokenClient.requestAccessToken({ prompt: 'consent' });
  }

  // Fetch basic user profile for UI
  async _fetchUserProfile() {
    try {
      const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${this.accessToken}` }
      });
      if (res.ok) {
        this.userProfile = await res.json();
      }
    } catch (e) {
      console.warn('Could not fetch user profile:', e);
    }
  }

  // Debounced auto-sync trigger (called after transactions/accounts change)
  triggerAutoSync() {
    if (!this.accessToken) return;

    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.performSync();
    }, 1500);
  }

  // Core Sync Protocol
  async performSync() {
    if (!this.accessToken) return;

    this.status = 'syncing';
    this._notify('Syncing with Google Drive...');

    try {
      // 1. Locate existing file in Drive AppData folder
      const fileId = await this._findOrCreateDriveFile();
      this.remoteFileId = fileId;

      // 2. Fetch remote metadata and content
      const remoteData = await this._readDriveFile(fileId);

      // 3. Compare with local
      const localLedger = await window.mintyDB.exportFullLedger();

      if (!remoteData || !remoteData.data) {
        // Remote is empty, push local state to Drive
        await this._writeDriveFile(fileId, localLedger);
      } else {
        // Compare export timestamps
        const localTime = new Date(localLedger.exportedAt || 0).getTime();
        const remoteTime = new Date(remoteData.exportedAt || 0).getTime();

        if (remoteTime > localTime) {
          // Remote is newer, hydrate local DB
          await window.mintyDB.restoreFromLedger(remoteData);
          if (window.mintyUI) window.mintyUI.refreshAllViews();
        } else {
          // Local is newer or equal, push to Drive
          await this._writeDriveFile(fileId, localLedger);
        }
      }

      this.status = 'synced';
      this.lastSyncTime = new Date();
      this._notify('Synced in real time');
      return true;
    } catch (err) {
      console.error('Sync error:', err);
      this.status = 'error';
      this._notify('Sync failed: ' + (err.message || 'Network issue'));
      return false;
    }
  }

  // Helper: Search Drive appDataFolder for ledger
  async _findOrCreateDriveFile() {
    const searchUrl = `https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&q=name='${DRIVE_FILE_NAME}' and trashed=false&fields=files(id, name, modifiedTime)`;
    const res = await fetch(searchUrl, {
      headers: { Authorization: `Bearer ${this.accessToken}` }
    });
    const data = await res.json();

    if (data.files && data.files.length > 0) {
      return data.files[0].id;
    }

    // Create file in appDataFolder
    const metadata = {
      name: DRIVE_FILE_NAME,
      parents: [DRIVE_APP_DATA_FOLDER]
    };

    const createRes = await fetch('https://www.googleapis.com/drive/v3/files', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(metadata)
    });

    const newFile = await createRes.json();
    return newFile.id;
  }

  // Helper: Read file content from Drive
  async _readDriveFile(fileId) {
    const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
      headers: { Authorization: `Bearer ${this.accessToken}` }
    });
    if (!res.ok) return null;
    try {
      return await res.json();
    } catch {
      return null;
    }
  }

  // Helper: Write file content to Drive with multipart upload
  async _writeDriveFile(fileId, contentObj) {
    const boundary = '-------314159265358979323846';
    const delimiter = "\r\n--" + boundary + "\r\n";
    const close_delim = "\r\n--" + boundary + "--";

    const contentType = 'application/json';
    const metadata = {
      name: DRIVE_FILE_NAME,
      mimeType: contentType
    };

    const multipartRequestBody =
      delimiter +
      'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
      JSON.stringify(metadata) +
      delimiter +
      'Content-Type: ' + contentType + '\r\n\r\n' +
      JSON.stringify(contentObj) +
      close_delim;

    const res = await fetch(`https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=multipart`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'Content-Type': 'multipart/related; boundary=' + boundary
      },
      body: multipartRequestBody
    });

    if (!res.ok) {
      const errBody = await res.text();
      throw new Error(`Drive update failed (${res.status}): ${errBody}`);
    }
    return true;
  }
}

window.mintySync = new MintySync();
