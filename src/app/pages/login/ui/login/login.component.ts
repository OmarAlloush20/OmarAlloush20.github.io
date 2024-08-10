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
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(6)]],
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
      console.log('logging in');
      if (this.loginForm.valid) {
        const loginSubscription = this.loginService
          .login(this.loginForm.value)
          .subscribe((res) => this.processLoginResult(res));
        this.subscriptions.push(loginSubscription);
      } else {
        console.log('invalid');
      }
    }
  }

  processLoginResult(result?: LoginResult) {
    console.log(result);
    this.logginIn = false;
    console.log(this.logginIn);
  }
}
