import {
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  OnInit,
} from '@angular/core';
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
  // Overrides
  override get value() {
    return this.user;
  }

  form: FormGroup;

  protected override modalRef = inject(MatDialogRef<UserModalComponent>);

  // Component

  @Input() user?: User;

  @Input() title: string = 'User';

  passwordVisible = false;

  constructor(fb: FormBuilder) {
    super();
    this.form = fb.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(4)]],
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
    if (this.value) {
      this.form.controls['username'].setValue(this.value.username);
      this.form.controls['firstName'].setValue(this.value.firstName);
      this.form.controls['lastName'].setValue(this.value.lastName);
      this.form.controls['middleName'].setValue(this.value.middleName || '');
      this.form.controls['password'].setValue(this.value.password || '');
      this.form.controls['password'].setValidators([]);
      this.form.controls['gender'].setValue(this.value.gender);
      this.form.controls['gender'].setValue(this.value.gender);
      this.form.controls['email'].setValue(this.value.email);
      this.form.controls['userType'].setValue(this.value.userType);
      this.form.controls['isActive'].setValue(this.value.isActive);
    }
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }
}
