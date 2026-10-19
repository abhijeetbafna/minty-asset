/**
 * MINTY ASSET CLIENT-SIDE ENCRYPTION ENGINE (crypto.js)
 * Zero-knowledge AES-256-GCM encryption using standard Web Cryptography API.
 * Ensures data is encrypted in the browser BEFORE uploading to Google Drive.
 */

class MintyCrypto {
  // Derive AES-256-GCM Key from User Passphrase using PBKDF2
  async deriveKey(passphrase, salt) {
    const enc = new TextEncoder();
    const keyMaterial = await window.crypto.subtle.importKey(
      'raw',
      enc.encode(passphrase),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );

    return window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-256-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  }

  // Encrypt JSON object string
  async encrypt(dataObj, passphrase) {
    if (!passphrase) {
      // If no passphrase set, return plain serialized string with flag
      return {
        isEncrypted: false,
        payload: JSON.stringify(dataObj)
      };
    }

    const enc = new TextEncoder();
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const key = await this.deriveKey(passphrase, salt);

    const encodedData = enc.encode(JSON.stringify(dataObj));
    const encryptedContent = await window.crypto.subtle.encrypt(
      { name: 'AES-256-GCM', iv: iv },
      key,
      encodedData
    );

    return {
      isEncrypted: true,
      algorithm: 'AES-256-GCM',
      salt: this._bufToHex(salt),
      iv: this._bufToHex(iv),
      ciphertext: this._bufToHex(new Uint8Array(encryptedContent))
    };
  }

  // Decrypt payload back to JSON
  async decrypt(encryptedEnvelope, passphrase) {
    if (!encryptedEnvelope.isEncrypted) {
      return JSON.parse(encryptedEnvelope.payload);
    }

    if (!passphrase) {
      throw new Error('Vault is protected by a master password. Please provide your passphrase.');
    }

    const salt = this._hexToBuf(encryptedEnvelope.salt);
    const iv = this._hexToBuf(encryptedEnvelope.iv);
    const ciphertext = this._hexToBuf(encryptedEnvelope.ciphertext);

    const key = await this.deriveKey(passphrase, salt);

    try {
      const decrypted = await window.crypto.subtle.decrypt(
        { name: 'AES-256-GCM', iv: iv },
        key,
        ciphertext
      );
      const dec = new TextDecoder();
      return JSON.parse(dec.decode(decrypted));
    } catch (err) {
      throw new Error('Decryption failed. Incorrect passphrase or corrupted data.');
    }
  }

  // Helpers
  _bufToHex(buf) {
    return Array.from(buf).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  _hexToBuf(hex) {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
      bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
    }
    return bytes;
  }
}

window.mintyCrypto = new MintyCrypto();
