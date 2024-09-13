import { Component, Input, OnInit } from '@angular/core';
import { Customer } from '../../models/customer.model';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormComponent } from '../../../../shared/components/interfaces/form-component.interface';

@Component({
  selector: 'app-customer-modal',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, MatDialogModule],
  templateUrl: './customer-modal.component.html',
  styleUrl: './customer-modal.component.scss'
})
export class CustomerModalComponent extends FormComponent implements OnInit  {
  @Input('customer') customer?: Customer;

  @Input() title: string = 'Customer';

  form: FormGroup;

  constructor(private fb: FormBuilder, private dialog : MatDialogRef<CustomerModalComponent>) {
    super();
    this.form = this.fb.group({
      firstname: [this.customer?.firstname ?? '', Validators.required],
      lastname: [this.customer?.lastname ?? '', Validators.required],
      middlename: [this.customer?.middlename ?? ''],
      email: [this.customer?.email ?? '', Validators.required, ],
      gender: [this.customer?.gender ?? '', Validators.required],
      phone1: [this.customer?.phone1 ?? '', Validators.required],
      phone2: [this.customer?.phone2 ?? '']
    });
  }

  ngOnInit(): void {
    if (this.customer) {
      this.form.controls['firstname'].setValue(this.customer.firstname);
      this.form.controls['lastname'].setValue(this.customer.lastname);
      this.form.controls['middlename'].setValue(this.customer.middlename || '');
      this.form.controls['gender'].setValue(this.customer.gender);
      this.form.controls['email'].setValue(this.customer.email);
      this.form.controls['phone1'].setValue(this.customer.phone1);
      this.form.controls['phone2'].setValue(this.customer.phone2);
    }
  }

  onSubmit() {
    const val = this.form.value as Customer
    
    this.dialog.close({...val, _id : this.customer?._id})
  }

  cancel() {
    this.dialog.close();
  }

}
