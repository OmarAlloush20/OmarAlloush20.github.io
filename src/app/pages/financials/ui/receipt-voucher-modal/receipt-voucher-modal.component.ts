import {
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { ReceiptVoucher } from '../../models/receipt-voucher.model';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PaymentVoucherModalComponent } from '../payment-voucher-modal/payment-voucher-modal.component';
import { FormComponent } from '../../../../shared/components/interfaces/form-component.interface';
import { CustomerSelectorComponent } from '../../../../shared/components/selectors/customer-selector/customer-selector.component';

@Component({
  selector: 'app-receipt-voucher-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './receipt-voucher-modal.component.html',
  styleUrl: './receipt-voucher-modal.component.scss',
})
export class ReceiptVoucherModalComponent
  extends FormComponent
  implements OnInit
{
  @Input() voucher?: ReceiptVoucher;
  @Input() title: string = 'Receipt Voucher';

  form: FormGroup;

  cdr = inject(ChangeDetectorRef);

  get remainingAmount() :number {
    return (this.form.controls['totalAmount'].value ?? 0) - (this.form.controls['amountPaid'].value ?? 0)
  }

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<PaymentVoucherModalComponent>,
    private dialog: MatDialog
  ) {
    super();
    this.form = this.fb.group({
      totalAmount: [null, [Validators.required, Validators.min(0)]],
      amountPaid: [null, [Validators.required, Validators.min(0)]],
      paymentMethod: ['cash', Validators.required],
      bankName: [''],
      chequeDueDate: [null],
      description: ['', Validators.required],
      customer: [undefined, [Validators.required]],
    });
  }

  selectCustomer() {
    const ref = this.dialog.open(CustomerSelectorComponent);
    ref.afterClosed().subscribe((val) => {
      if (val) {
        this.form.controls['customer'].setValue(val);
      }
    });
  }

  ngOnInit(): void {
    if (this.voucher) {
      this.form.patchValue({
        totalAmount: this.voucher.totalAmount,
        amountPaid: this.voucher.amountPaid,
        paymentMethod: this.voucher.paymentMethod,
        bankName: this.voucher.bankName,
        chequeDueDate: this.voucher.chequeDueDate,
        description: this.voucher.description,
        customer: this.voucher.customer,
      });
      this.cdr.detectChanges();
    }
  }

  onSubmit() {
    if (this.form.valid) {
      const result = {
        ... this.form.value,
        remainingAmount: this.remainingAmount,
        _id: this.voucher?._id
      } as ReceiptVoucher;
      console.log(JSON.stringify(result));
      this.dialogRef.close(result);
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}
