import { afterRender, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../../models/user.model';
import { EncryptionService } from '../encryption/encryption.service';

const _tokenLocalStorageKey = '__a__';
const _userLocalStorageKey = '__u__';

export type AuthStatus = 'undetermined' | 'inauthenticated' | 'authenticated';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _token$ = new BehaviorSubject<string>('');

  public get token(): string {
    return this._token$.value;
  }

  private _authStatus: AuthStatus = 'undetermined';

  public get isAuthenticated(): boolean {
    if (this._authStatus !== 'authenticated') return false;
    return true;
  }

  private _user$ = new BehaviorSubject<User | undefined>(undefined);

  public get user$(): Observable<User | undefined> {
    return this._user$.asObservable();
  }

  constructor(private router: Router, private enc: EncryptionService) {
    this._initAuth();
    this._listenToTokenChanges();
  }

  private _initAuth() {
    afterRender(() => {
      this.loadAuth();
    });
  }

  loadAuth() {
    this._loadToken();
    this._loadUser();
  }

  private _loadToken() {
    const token = localStorage.getItem(_tokenLocalStorageKey) || '';
    const decrypted = this.enc.localDecrypt(token);
    this._token$.next(decrypted.toString());
  }

  private _loadUser() {
    const user = localStorage.getItem(_userLocalStorageKey) || '';
    const decrypted = this.enc.localDecrypt(user);
    const decUser = JSON.parse(decrypted);
    this._user$.next(decUser);
  }

  private _listenToTokenChanges() {
    this._token$.subscribe((token) => this._onTokenChanged(token));
  }

  private _onTokenChanged(token: string) {
    this._updateAuthStatus(token);
    if (!this.isAuthenticated) {
      this.router.navigate(['/login']);
    }
  }

  private _updateAuthStatus(token: string) {
    this._authStatus = token ? 'authenticated' : 'inauthenticated';
  }

  update(authInfo: { user?: User; token?: string }) {
    if (authInfo.user) this._updateUser(authInfo.user);
    if (authInfo.token) this._updateToken(authInfo.token);
  }

  private _updateUser(user: User) {
    const enc = this.enc.localEncrypt(JSON.stringify(user));
    localStorage.setItem(_userLocalStorageKey, enc.toString());
    this._user$.next(user);
  }

  private _updateToken(token: string) {
    const enc = this.enc.localEncrypt(token);
    localStorage.setItem(_userLocalStorageKey, enc.toString());
    this._token$.next(token);
  }

  invalidate() {
    localStorage.removeItem(_tokenLocalStorageKey);
    localStorage.removeItem(_userLocalStorageKey);
    this._token$.next('');
    this._user$.next(undefined);
  }
}
