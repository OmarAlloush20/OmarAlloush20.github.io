import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class EncryptionService {
  constructor() {}

  localEncrypt(text: string): string {
    const encrypted = CryptoJS.AES.encrypt(text, environment.localEncKey);
    const result = encrypted.ciphertext.toString();
    return result
  }

  localDecrypt(text: string): string {
    const decrypted = CryptoJS.AES.decrypt(text, environment.localEncKey);
    const result = decrypted.toString(CryptoJS.enc.Utf8);
    return result;
  }
}
