import { Injectable } from '@angular/core';
import { LoginRepository } from '../repositories/login.repository';

@Injectable()
export class LoginService {
  private repository = new LoginRepository();

  constructor() {}

  login(username: string, password: string) {
    
  }
  
}
