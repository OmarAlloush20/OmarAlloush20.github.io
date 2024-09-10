import { afterRender, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { EncryptionService } from '../encryption/encryption.service';
import { User } from '../../../pages/users/models/user.model';

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

  private _authStatus$ = new BehaviorSubject<AuthStatus>('undetermined');

  public get authStatus$() {
    return this._authStatus$.asObservable();
  }

  private _user$ = new BehaviorSubject<User | undefined>(undefined);

  public get user$(): Observable<User | undefined> {
    return this._user$.asObservable();
  }

  public get user(): User | undefined {
    return this._user$.value;
  }

  constructor(private enc: EncryptionService, private router: Router) {
    this._initAuth();
  }

  private _initAuth() {
    this._routeToLoginWhenInauthenticated()
    afterRender(() => {
      this.loadAuth();
    });
  }

  loadAuth() {
    this._loadToken();
    this._loadUser();
    this._updateStatus();
  }

  private _loadToken() {
    const token = localStorage.getItem(_tokenLocalStorageKey) || '';
    if (token) {
      const decrypted = this.enc.localDecrypt(token);
      this._token$.next(decrypted);
    }
  }

  private _loadUser() {
    const user = localStorage.getItem(_userLocalStorageKey) || '';
    if (user) {
      const decrypted = this.enc.localDecrypt(user);
      const decUser = JSON.parse(decrypted);
      this._user$.next(decUser);
    }
  }

  private _updateStatus() {
    this._authStatus$.next(this.token ? 'authenticated' : 'inauthenticated');
  }

  private _routeToLoginWhenInauthenticated() {
    this._authStatus$.subscribe((status) => {
      if (status === 'inauthenticated') {
        this.router.navigate(['login']);
      }
    });
  }

  update(authInfo: { user?: User; token?: string }) {
    if (authInfo.user) this._updateUser(authInfo.user);
    if (authInfo.token) this._updateToken(authInfo.token);
    this._updateStatus();
  }

  private _updateUser(user: User) {
    const enc = this.enc.localEncrypt(JSON.stringify(user));
    localStorage.setItem(_userLocalStorageKey, enc.toString());
    this._user$.next(user);
  }

  private _updateToken(token: string) {
    const enc = this.enc.localEncrypt(token);
    localStorage.setItem(_tokenLocalStorageKey, enc.toString());
    this._token$.next(token);
  }

  invalidate() {
    localStorage.removeItem(_tokenLocalStorageKey);
    localStorage.removeItem(_userLocalStorageKey);
    this._token$.next('');
    this._user$.next(undefined);
    this._authStatus$.next('inauthenticated');
  }
}
