import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EncryptionService {
  constructor() {}

  localEncrypt(text: string): string {
    const encrypted = CryptoJS.AES.encrypt(
      text,
      environment.localEncKey
    );
    return encrypted.toString();
  }

  localDecrypt(text: string) : string {
    const encrypted = CryptoJS.AES.decrypt(
      text,
      environment.localEncKey
    );
    return encrypted.toString();
  }
}
