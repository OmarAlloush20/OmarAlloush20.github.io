import { Injectable } from '@angular/core';
import { LoginRepository } from '../repositories/login.repository';
import { AuthService } from '../../../shared/services/auth/auth.service';
import {  map, Observable, } from 'rxjs';
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
    return this.repository.login(credentials).pipe(map((val, _) => {
      return loginResultMapper(val)
    }));
  }
}
