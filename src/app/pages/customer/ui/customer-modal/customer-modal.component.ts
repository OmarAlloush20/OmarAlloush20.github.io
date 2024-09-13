import { Component, Input, OnInit } from '@angular/core';
import { Customer } from '../../models/customer.model';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-customer-modal',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, MatDialogModule],
  templateUrl: './customer-modal.component.html',
  styleUrl: './customer-modal.component.scss'
})
export class CustomerModalComponent implements OnInit {
  @Input('customer') customer?: Customer;

  @Input() title: string = 'Customer';

  customerForm: FormGroup;

  constructor(private fb: FormBuilder, private dialog : MatDialogRef<CustomerModalComponent>) {
    this.customerForm = this.fb.group({
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
      this.customerForm.controls['firstname'].setValue(this.customer.firstname);
      this.customerForm.controls['lastname'].setValue(this.customer.lastname);
      this.customerForm.controls['middlename'].setValue(this.customer.middlename || '');
      this.customerForm.controls['gender'].setValue(this.customer.gender);
      this.customerForm.controls['email'].setValue(this.customer.email);
      this.customerForm.controls['phone1'].setValue(this.customer.phone1);
      this.customerForm.controls['phone2'].setValue(this.customer.phone2);
    }
  }

  onSubmit() {
    const val = this.customerForm.value as Customer
    
    this.dialog.close({...val, _id : this.customer?._id})
  }

  cancel() {
    this.dialog.close();
  }

}
