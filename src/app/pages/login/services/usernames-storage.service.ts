import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const _usernamesLocalStorageKey = 'login_usernames';

@Injectable()
export class UsernamesStorageService {
  userNames$ = new BehaviorSubject<string[]>([])

  constructor() {
    this.initUserNames();
   }

  private initUserNames() {
    const usernamesAsString : string = localStorage.getItem(_usernamesLocalStorageKey) ?? '';
    const usernamesList = usernamesAsString ? usernamesAsString.split(',') : [];
    this.userNames$.next(usernamesList);
  }

  storeUsername(username: string) {
    const usernamesAsString: string = localStorage.getItem(_usernamesLocalStorageKey) ?? '';
    const usernamesList = usernamesAsString ? usernamesAsString.split(',') : [];
  
    if (!usernamesList.includes(username)) {
      usernamesList.push(username);
    }
  
    localStorage.setItem(_usernamesLocalStorageKey, usernamesList.join(','));
  
    this.userNames$.next(usernamesList);
  }
}
