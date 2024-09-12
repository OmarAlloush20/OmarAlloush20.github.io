import {
  ChangeDetectorRef,
  Component,
  inject,
  PLATFORM_ID,
} from '@angular/core';
import { Customer } from '../models/customer.model';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CustomersService } from '../services/customer.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { CustomerModalComponent } from './customer-modal/customer-modal.component';
import { DataTableSearchInfo } from '../../../shared/components/data-table/data-table.model';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { FormsModule } from '@angular/forms';
import { DataTableComponent } from '../../../shared/components/data-table/data-table.component';
import { UserModalComponent } from '../../users/ui/user-modal/user-modal.component';

@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DataTableComponent,
    UserModalComponent,
    MatDialogModule,
  ],
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.scss',
})
export class CustomerComponent {
  tableHeaders: string[] = [
    'First Name',
    'Last Name',
    'Middle Name',
    'Email',
    'Gender',
    'Phone number 1',
    'Phone number 2',
  ];

  headerToValue = (header: string, customer: Customer): string | undefined => {
    switch (header) {
      case 'First Name':
        return customer.firstname;

      case 'Last Name':
        return customer.lastname;

      case 'Middle Name':
        return customer.middlename;

      case 'Email':
        return customer.email;

      case 'Gender':
        return customer.gender;

      case 'Phone number 1':
        return customer.phone1;

      case 'Phone number 2':
        return customer.phone2;
    }

    return undefined;
  };

  customers: Customer[] = [];

  private _query = '';

  private _allCustomers: Customer[] = [];

  loading: boolean = false;

  private dialog = inject(MatDialog);
  private customersService = inject(CustomersService);
  private toastr = inject(ToastrService);
  private platformId = inject(PLATFORM_ID);
  private auth = inject(AuthService);

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) this._reloadCustomers();
  }

  private _reloadCustomers() {
    this.loading = true;
    const toastr = this.toastr;
    this.customersService.fetchCustomers().subscribe({
      next: (customers) => {
        if (customers === undefined) {
          toastr.error("Couldn't get customers. Please try again.", undefined, {
            closeButton: true,
            timeOut: 5000,
          });
        } else {
          this._updateCustomers(customers);
        }
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        toastr.warning("Couldn't get customers. Please try again.");
      },
    });
  }

  private _updateCustomers(customers: Customer[], pageNumber: number = 1) {
    this._allCustomers = customers;
    this.onSearchInfoChanged({
      query: this._query,
      pageNumber: pageNumber,
    });
  }

  openAddCustomer() {
    const modalRef = this.dialog.open(CustomerModalComponent);
    
    modalRef.afterClosed().subscribe((customer) => {
      if (customer) {
        this._addCustomer(customer);
      }
    });
  }

  private _addCustomer(customer: Customer) {
    this.loading = true;
    this.customersService.addCustomer(customer).subscribe({
      next: (val) => {
        if (val) {
          this.toastr.success('Customer added successfully.');
          this._reloadCustomers();
        } else {
          this.toastr.error("Couldn't add customer. Please try again.");
        }
      },
      error: (err) => {
        this.toastr.error("Couldn't add customer. Please try again.");
      },
    });
    this.loading = false;
  }

  private _canAddCustomer(addedCustomer: Customer) {
    return true;
  }

  async onSearchInfoChanged(info: DataTableSearchInfo) {
    this.loading = true;
    const { query, pageNumber } = info;
    this._query = query;
    const newCustomers = this._allCustomers.filter((customer) => {
      return (
        customer.firstname.toLowerCase().includes(query.toLowerCase()) ||
        customer.lastname.toLowerCase().includes(query.toLowerCase())
      );
    });
    this.customers = newCustomers.splice(pageNumber * 10 - 10, pageNumber * 10);
    this.loading = false;
  }

  openEditCustomer(customer: Customer) {
    const modalRef = this.dialog.open(CustomerModalComponent);
    modalRef.componentInstance.customer = customer;

    const sub = modalRef.afterClosed().subscribe((editedCustomer: Customer) => {
      if (editedCustomer && this._isEditAllowed(editedCustomer)) {
        this._editCustomer(editedCustomer);
        sub.unsubscribe();
      }
    });
  }

  private _isEditAllowed(editedCustomer: Customer) {
    return true;
  }

  private _editCustomer(customer: Customer) {
    this.loading = true;
    this.customersService.editCustomer(customer).subscribe({
      next: (val) => {
        this.loading = false;
        if (val) {
          this.toastr.success('Customer updated');
          this._reloadCustomers();
        } else {
          this.toastr.warning("Couldn't update customer. Please try again.");
        }
      },
      error: (_) => {
        this.loading = false;
        this.toastr.error("Couldn't update customer. Please try again.");
      },
    });
  }

  openDeleteCustomer(customer: Customer) {
    const modalRef = this.dialog.open(ConfirmDialogComponent);
    modalRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this._deleteCustomer(customer);
      }
    });
  }

  private _deleteCustomer(customer: Customer) {
    this.loading = true;
    if (this._isDeleteAllowed(customer)) {
      this.customersService.deleteCustomer(customer).subscribe({
        next: (val) => {
          this.loading = false;
          if (val) {
            this.toastr.success('Customer deleted');
          } else {
            this.toastr.warning("Couldn't delete customer. Please try again.");
          }
          this._reloadCustomers();
        },
        error: (_) => {
          this.loading = false;
          this.toastr.error("Couldn't delete customer. Please try again.");
        },
      });
    }
  }

  private _isDeleteAllowed(customer: Customer) {
    return true;
  }
}
