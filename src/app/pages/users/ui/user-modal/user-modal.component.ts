import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { User } from '../../models/user.model';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-modal',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './user-modal.component.html',
  styleUrl: './user-modal.component.scss',
})
export class UserModalComponent {
  @Input('user') user?: User;

  @Input('title') title: string = 'User';

  // editedUser: Partial<User> = {
  //   username: '',
  //   firstName: '',
  //   lastName: '',
  //   middleName: '',
  //   gender: 'male',
  //   userType: 'employee',
  //   isActive: true,
  // };

  userForm: FormGroup;

  constructor(private fb: FormBuilder, private cdr : ChangeDetectorRef) {
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      middleName: [''],
      gender: ['', Validators.required],
      userType: ['', Validators.required],
      isActive: [false],
    });
  }

  onSubmit() {
    // Handle form submission
    console.log('hi')
    console.log(this.userForm.value);
  }
}
