import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { User } from '../../models/user.model';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-user-modal',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, MatDialogModule],
  templateUrl: './user-modal.component.html',
  styleUrl: './user-modal.component.scss',
})
export class UserModalComponent implements OnInit {
  @Input('user') user?: User;

  @Input('title') title: string = 'User';

  userForm: FormGroup;

  passwordVisible = false;

  constructor(private fb: FormBuilder, private dialog : MatDialogRef<UserModalComponent>) {
    this.userForm = this.fb.group({
      username: ['username', Validators.required],
      password: ['123456789'],
      firstName: ['firstname', Validators.required],
      lastName: ['lastname', Validators.required],
      middleName: ['middlename'],
      email: ['hesham@travelflow.com', Validators.required, ],
      gender: ['male', Validators.required],
      userType: ['employee', Validators.required],
      isActive: [true],
    });
  }

  ngOnInit(): void {
    if (this.user) {
      this.userForm.controls['username'].setValue(this.user.username);
      this.userForm.controls['firstName'].setValue(this.user.firstName);
      this.userForm.controls['lastName'].setValue(this.user.lastName);
      this.userForm.controls['middleName'].setValue(this.user.middleName || '');
      this.userForm.controls['password'].setValue(this.user.password || '');
      this.userForm.controls['gender'].setValue(this.user.gender);
      this.userForm.controls['email'].setValue(this.user.email);
      this.userForm.controls['userType'].setValue(this.user.userType);
      this.userForm.controls['isActive'].setValue(this.user.isActive);
    }
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  onSubmit() {
    const val = this.userForm.value as User
    
    this.dialog.close({...val, _id : this.user?._id})
  }

  cancel() {
    this.dialog.close();
  }
}
