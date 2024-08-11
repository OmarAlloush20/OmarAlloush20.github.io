import { afterRender, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

const _tokenLocalStorageKey = '__a__';

export type AuthStatus = 'undetermined' | 'inauthenticated' | 'authenticated';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _token$ = new BehaviorSubject<string>('');

  private _authStatus: AuthStatus = 'undetermined';

  public get token(): string {
    return this._token$.value;
  }

  public get isAuthenticated(): boolean {
    if (this._authStatus !== 'authenticated') return false;
    return true;
  }

  constructor(private router: Router) {
    this._initAuth();
    this._listenToTokenChanges();
  }

  private _initAuth() {
    afterRender(() => {
      this.reloadAuth();
    });
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

  reloadAuth() {
    const token = localStorage.getItem(_tokenLocalStorageKey) || '';
    this._token$.next(token);
  }

  storeToken(token: string) {
    localStorage.setItem(_tokenLocalStorageKey, token);
    this._token$.next(token);
  }

  invalidate() {
    localStorage.removeItem(_tokenLocalStorageKey);
    this._token$.next('');
  }
}
