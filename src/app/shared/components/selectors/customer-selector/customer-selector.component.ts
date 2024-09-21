import { Component, inject, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Customer } from '../../../../features/customer/models/customer.model';
import { CustomersService } from '../../../../features/customer/services/customer.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-customer-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customer-selector.component.html',
  styleUrl: './customer-selector.component.scss',
})
export class CustomerSelectorComponent implements OnInit, OnChanges {
  searchQuery = '';

  customers: Customer[] = [];

  searchedCustomers: Customer[] = [];

  customerService = inject(CustomersService);

  toastr = inject(ToastrService);

  modalRef = inject(MatDialogRef<CustomerSelectorComponent>);

  onSearch(searchQuery: string) {
    this.searchedCustomers = this.customers.filter(
      (val) =>
        val.firstname.includes(searchQuery) ||
        val.lastname.includes(searchQuery)
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.onSearch(changes['searchQuery'].currentValue);
  }

  ngOnInit(): void {
    this.customerService.fetchCustomers().subscribe((customers) => {
      if (customers) {
        this.customers = customers;
        this.onSearch('');
      } else this.toastr.error('Unable to load customers');
    });
  }

  selectCustomer(customer: Customer) {
    console.log('customer', JSON.stringify(customer));
    this.modalRef.close(customer);
  }
}
