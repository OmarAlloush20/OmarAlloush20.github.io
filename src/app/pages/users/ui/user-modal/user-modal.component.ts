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
import { FormComponent } from '../../../../shared/components/interfaces/form-component.interface';

@Component({
  selector: 'app-user-modal',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, MatDialogModule],
  templateUrl: './user-modal.component.html',
  styleUrl: './user-modal.component.scss',
})
export class UserModalComponent extends FormComponent implements OnInit {
  @Input() user?: User;

  @Input() title: string = 'User';

  form: FormGroup;

  passwordVisible = false;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialogRef<UserModalComponent>
  ) {
    super();
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(4)],],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      middleName: [''],
      email: ['', [Validators.required, Validators.email]],
      gender: ['', Validators.required],
      userType: ['', Validators.required],
      isActive: [true],
    });
  }

  ngOnInit(): void {
    if (this.user) {
      this.form.controls['username'].setValue(this.user.username);
      this.form.controls['firstName'].setValue(this.user.firstName);
      this.form.controls['lastName'].setValue(this.user.lastName);
      this.form.controls['middleName'].setValue(this.user.middleName || '');
      this.form.controls['password'].setValue(this.user.password || '');
      this.form.controls['password'].setValidators([]);
      this.form.controls['gender'].setValue(this.user.gender);
      this.form.controls['gender'].setValue(this.user.gender);
      this.form.controls['email'].setValue(this.user.email);
      this.form.controls['userType'].setValue(this.user.userType);
      this.form.controls['isActive'].setValue(this.user.isActive);
    }
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  onSubmit() {
    const val = this.form.value as User;
    this.dialog.close({ ...val, _id: this.user?._id });
  }

  cancel() {
    this.dialog.close();
  }
}
