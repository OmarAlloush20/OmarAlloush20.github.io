import { Component } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { UsernamesStorageService } from '../../services/usernames-storage.service';
import { CredentialsModel } from '../../models/credentials.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [LoginService, UsernamesStorageService]
})
export class LoginComponent {

  model : CredentialsModel = new CredentialsModel();

  constructor(
    private loginService: LoginService,
    private usernamesStorage: UsernamesStorageService
  ) {}

  onSubmit() {
    
  }
}
