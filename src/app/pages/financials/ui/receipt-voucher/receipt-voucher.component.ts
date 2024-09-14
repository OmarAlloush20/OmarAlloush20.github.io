import { Component, inject, PLATFORM_ID } from '@angular/core';
import { ReceiptVoucher } from '../../models/receipt-voucher.model';
import { MatDialog } from '@angular/material/dialog';
import { ReceiptVoucherService } from '../../services/receipt-voucher.service';
import { ToastrService } from 'ngx-toastr';
import { isPlatformBrowser } from '@angular/common';
import { ReceiptVoucherModalComponent } from '../receipt-voucher-modal/receipt-voucher-modal.component';
import { DataTableSearchInfo } from '../../../../shared/components/data-table/data-table.model';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { DataTableComponent } from '../../../../shared/components/data-table/data-table.component';

@Component({
  selector: 'app-receipt-voucher',
  standalone: true,
  imports: [DataTableComponent],
  templateUrl: './receipt-voucher.component.html',
  styleUrl: './receipt-voucher.component.scss',
})
export class ReceiptVouchersComponent {
  tableHeaders: string[] = [
    'Customer Name',
    'Total Amount',
    'Amount Paid',
    'Remaining Amount',
    'Payment Method',
    'Bank Name',
    'Cheque Due Date',
    'Description',
  ];

  headerToValue = (header: string, voucher: ReceiptVoucher): string => {
    switch (header) {
      case 'Customer Name':
        return `${voucher.customer.firstname} ${voucher.customer.lastname}`;

      case 'Total Amount':
        return voucher.totalAmount.toString();

      case 'Amount Paid':
        return voucher.amountPaid.toString();

      case 'Remaining Amount':
        return voucher.remainingAmount.toString();

      case 'Payment Method':
        return voucher.paymentMethod;

      case 'Bank Name':
        return voucher.bankName ? voucher.bankName : 'N/A';

      case 'Cheque Due Date':
        return voucher.chequeDueDate
          ? new Date(voucher.chequeDueDate).toLocaleDateString()
          : 'N/A';

      case 'Description':
        return voucher.description;
    }
    return '';
  };

  vouchers: ReceiptVoucher[] = [];
  private _query = '';
  private _allVouchers: ReceiptVoucher[] = [];
  loading: boolean = false;

  private dialog = inject(MatDialog);
  private receiptVoucherService = inject(ReceiptVoucherService);
  private toastr = inject(ToastrService);
  private platformId = inject(PLATFORM_ID);

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) this._reloadVouchers();
  }

  private _reloadVouchers() {
    this.loading = true;
    const toastr = this.toastr;
    this.receiptVoucherService.fetchReceiptVouchers().subscribe({
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

  private _updateVouchers(vouchers: ReceiptVoucher[], pageNumber: number = 1) {
    this._allVouchers = vouchers;
    this.onSearchInfoChanged({
      query: this._query,
      pageNumber: pageNumber,
    });
  }

  openAddVoucher() {
    const modalRef = this.dialog.open(ReceiptVoucherModalComponent);

    modalRef.afterClosed().subscribe((voucher) => {
      if (voucher) {
        this._addVoucher(voucher);
      }
    });
  }

  private _addVoucher(voucher: ReceiptVoucher) {
    this.loading = true;
    this.receiptVoucherService.addReceiptVoucher(voucher).subscribe({
      next: (val) => {
        if (val) {
          this.toastr.success('Receipt Voucher added successfully.');
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
        voucher.customer.firstname
          .toLowerCase()
          .includes(query.toLowerCase()) ||
        voucher.customer.lastname.toLowerCase().includes(query.toLowerCase()) ||
        voucher.description.toLowerCase().includes(query.toLowerCase())
      );
    });
    this.vouchers = newVouchers.splice(pageNumber * 10 - 10, pageNumber * 10);
    this.loading = false;
  }

  openEditVoucher(voucher: ReceiptVoucher) {
    const modalRef = this.dialog.open(ReceiptVoucherModalComponent);
    modalRef.componentInstance.voucher = voucher;

    const sub = modalRef
      .afterClosed()
      .subscribe((editedVoucher: ReceiptVoucher) => {
        if (editedVoucher && this._isEditAllowed(editedVoucher)) {
          this._editVoucher(editedVoucher);
          sub.unsubscribe();
        }
      });
  }

  private _isEditAllowed(editedVoucher: ReceiptVoucher) {
    return true;
  }

  private _editVoucher(voucher: ReceiptVoucher) {
    this.loading = true;
    this.receiptVoucherService.editReceiptVoucher(voucher).subscribe({
      next: (val) => {
        this.loading = false;
        if (val) {
          this.toastr.success('Receipt Voucher updated');
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

  openDeleteVoucher(voucher: ReceiptVoucher) {
    const modalRef = this.dialog.open(ConfirmDialogComponent);
    modalRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this._deleteVoucher(voucher);
      }
    });
  }

  private _deleteVoucher(voucher: ReceiptVoucher) {
    this.loading = true;
    if (this._isDeleteAllowed(voucher)) {
      this.receiptVoucherService.deleteReceiptVoucher(voucher).subscribe({
        next: (val) => {
          this.loading = false;
          if (val) {
            this.toastr.success('Receipt Voucher deleted');
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

  private _isDeleteAllowed(voucher: ReceiptVoucher) {
    return true;
  }
}
