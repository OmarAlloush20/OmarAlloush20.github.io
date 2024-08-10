import { Injectable } from '@angular/core';
import { LoginRepository } from '../repositories/login.repository';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, delay, map, Observable, of, Subject } from 'rxjs';
import { LoginResult, loginResultMapper } from '../types/login.types';
import { HttpService } from '../../../shared/services/http/http.service';

@Injectable()
export class LoginService {
  private repository!: LoginRepository;

  constructor(http: HttpService, private authService: AuthService) {
    this.repository = new LoginRepository(http);
  }

  login(credentials: {
    username: string;
    password: string;
  }): Observable<LoginResult | undefined> {
    const successResult: LoginResult ='success'; // Adjust according to actual structure of LoginResult
  
    return of(successResult).pipe(delay(2000));
    // return this.repository.login(credentials).pipe(map((val, _) => {
    //   return loginResultMapper(val.result)
    // }));
  }
}
