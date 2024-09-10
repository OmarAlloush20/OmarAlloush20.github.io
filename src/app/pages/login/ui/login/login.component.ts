import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { UsernamesStorageService } from '../../services/usernames-storage.service';
import { CredentialsModel } from '../../models/credentials.model';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { map, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { LoginResult } from '../../types/login.types';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  providers: [LoginService, UsernamesStorageService, HttpClient],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup;

  logginIn: boolean = false;

  previousUserNames: string[] = [];

  subscriptions: Subscription[] = [];

  constructor(
    private loginService: LoginService,
    private usernamesStorage: UsernamesStorageService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  subscribeToUsernamesStorage() {
    const subscription = this.usernamesStorage.userNames$.subscribe(
      (usernames) => (this.previousUserNames = usernames)
    );
    this.subscriptions.push(subscription);
  }

  onSubmit() {
    if (!this.logginIn) {
      this.logginIn = true;
      if (this.loginForm.valid) {
        const loginSubscription = this.loginService
          .login(this.loginForm.value)
          .subscribe((res) => this._handleLoginResult(res));
        this.subscriptions.push(loginSubscription);
      }
    }
  }

  private _handleLoginResult(result: string) {
    console.log(result);
    switch (result) {
      case 'success':
        this._onLoginSuccess();
        break;
      case 'wrong-credentials':
        this._onLoginWrongCredentials();
        break;
      case 'failed':
        this._onLoginFail();
        break;
    }
  }

  private _onLoginSuccess() {
    this.toastr.success('Logged in successfully');
    this.router.navigate(['main']);
  }

  private _onLoginFail() {
    this.toastr.error('Could not log you in.');
    this.logginIn = false;
  }

  private _onLoginWrongCredentials() {
    this.toastr.warning('Wrong credentials', undefined, {
      timeOut: 7000,
    });
  }
}
