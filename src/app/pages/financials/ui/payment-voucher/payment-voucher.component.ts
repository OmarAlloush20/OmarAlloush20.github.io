import { Component, inject, PLATFORM_ID } from '@angular/core';
import { PaymentVoucher } from '../../models/payment-voucher.model';
import { MatDialog } from '@angular/material/dialog';
import { PaymentVoucherService } from '../../services/payment-voucher.service';
import { ToastrService } from 'ngx-toastr';
import { isPlatformBrowser } from '@angular/common';
import { DataTableSearchInfo } from '../../../../shared/components/data-table/data-table.model';
import { PaymentVoucherModalComponent } from '../payment-voucher-modal/payment-voucher-modal.component';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { DataTableComponent } from '../../../../shared/components/data-table/data-table.component';

@Component({
  selector: 'app-payment-voucher',
  standalone: true,
  imports: [DataTableComponent],
  templateUrl: './payment-voucher.component.html',
  styleUrl: './payment-voucher.component.scss'
})
export class PaymentVouchersComponent {
  tableHeaders: string[] = [
    'Agent Name',
    'Date',
    'Payment Method',
    'Bank Name',
    'Cheque Due Date',
    'Amount',
    'Description',
  ];

  headerToValue = (header: string, voucher: PaymentVoucher): string => {
    switch (header) {
      case 'Agent Name':
        return voucher.agent.name;

      case 'Date':
        return new Date(voucher.date).toLocaleDateString();

      case 'Payment Method':
        return voucher.paymentMethod;

      case 'Bank Name':
        return voucher.bankName;

      case 'Cheque Due Date':
        return voucher.chequeDueDate ? new Date(voucher.chequeDueDate).toLocaleDateString() : 'N/A';

      case 'Amount':
        return voucher.amount.toString();

      case 'Description':
        return voucher.description;
    }
    return '';
  };

  vouchers: PaymentVoucher[] = [];
  private _query = '';
  private _allVouchers: PaymentVoucher[] = [];
  loading: boolean = false;

  private dialog = inject(MatDialog);
  private paymentVoucherService = inject(PaymentVoucherService);
  private toastr = inject(ToastrService);
  private platformId = inject(PLATFORM_ID);
  
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) this._reloadVouchers();
  }

  private _reloadVouchers() {
    this.loading = true;
    const toastr = this.toastr;
    this.paymentVoucherService.fetchPaymentVouchers().subscribe({
      next: (vouchers) => {
        if (vouchers === undefined) {
          toastr.error("Couldn't get vouchers. Please try again.", undefined, {
            closeButton: true,
            timeOut: 5000,
          });
        } else {
          this._updateVouchers(vouchers);
        }
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        toastr.warning("Couldn't get vouchers. Please try again.");
      },
    });
  }

  private _updateVouchers(vouchers: PaymentVoucher[], pageNumber: number = 1) {
    this._allVouchers = vouchers;
    this.onSearchInfoChanged({
      query: this._query,
      pageNumber: pageNumber,
    });
  }

  openAddVoucher() {
    const modalRef = this.dialog.open(PaymentVoucherModalComponent);

    modalRef.afterClosed().subscribe((voucher) => {
      if (voucher) {
        this._addVoucher(voucher);
      }
    });
  }

  private _addVoucher(voucher: PaymentVoucher) {
    this.loading = true;
    this.paymentVoucherService.addPaymentVoucher(voucher).subscribe({
      next: (val) => {
        if (val) {
          this.toastr.success('Payment Voucher added successfully.');
          this._reloadVouchers();
        } else {
          this.toastr.error("Couldn't add voucher. Please try again.");
        }
      },
      error: (err) => {
        this.toastr.error("Couldn't add voucher. Please try again.");
      },
    });
    this.loading = false;
  }

  async onSearchInfoChanged(info: DataTableSearchInfo) {
    this.loading = true;
    const { query, pageNumber } = info;
    this._query = query;
    const newVouchers = this._allVouchers.filter((voucher) => {
      return (
        voucher.agent.name.toLowerCase().includes(query.toLowerCase()) ||
        voucher.description.toLowerCase().includes(query.toLowerCase())
      );
    });
    this.vouchers = newVouchers.splice(pageNumber * 10 - 10, pageNumber * 10);
    this.loading = false;
  }

  openEditVoucher(voucher: PaymentVoucher) {
    const modalRef = this.dialog.open(PaymentVoucherModalComponent);
    modalRef.componentInstance.voucher = voucher;

    const sub = modalRef.afterClosed().subscribe((editedVoucher: PaymentVoucher) => {
      if (editedVoucher && this._isEditAllowed(editedVoucher)) {
        this._editVoucher(editedVoucher);
        sub.unsubscribe();
      }
    });
  }

  private _isEditAllowed(editedVoucher: PaymentVoucher) {
    return true;
  }

  private _editVoucher(voucher: PaymentVoucher) {
    this.loading = true;
    this.paymentVoucherService.editPaymentVoucher(voucher).subscribe({
      next: (val) => {
        this.loading = false;
        if (val) {
          this.toastr.success('Payment Voucher updated');
          this._reloadVouchers();
        } else {
          this.toastr.warning("Couldn't update voucher. Please try again.");
        }
      },
      error: (_) => {
        this.loading = false;
        this.toastr.error("Couldn't update voucher. Please try again.");
      },
    });
  }

  openDeleteVoucher(voucher: PaymentVoucher) {
    const modalRef = this.dialog.open(ConfirmDialogComponent);
    modalRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this._deleteVoucher(voucher);
      }
    });
  }

  private _deleteVoucher(voucher: PaymentVoucher) {
    this.loading = true;
    if (this._isDeleteAllowed(voucher)) {
      this.paymentVoucherService.deletePaymentVoucher(voucher).subscribe({
        next: (val) => {
          this.loading = false;
          if (val) {
            this.toastr.success('Payment Voucher deleted');
          } else {
            this.toastr.warning("Couldn't delete voucher. Please try again.");
          }
          this._reloadVouchers();
        },
        error: (_) => {
          this.loading = false;
          this.toastr.error("Couldn't delete voucher. Please try again.");
        },
      });
    }
  }

  private _isDeleteAllowed(voucher: PaymentVoucher) {
    return true;
  }
}

