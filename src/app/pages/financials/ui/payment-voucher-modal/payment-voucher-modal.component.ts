import { Component, Input, OnInit } from '@angular/core';
import { PaymentVoucher } from '../../models/payment-voucher.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { FormComponent } from '../../../../shared/components/interfaces/form-component.interface';

@Component({
  selector: 'app-payment-voucher-modal',
  standalone: true,
  imports: [],
  templateUrl: './payment-voucher-modal.component.html',
  styleUrl: './payment-voucher-modal.component.scss',
})
export class PaymentVoucherModalComponent
  extends FormComponent
  implements OnInit
{
  @Input() voucher?: PaymentVoucher;
  @Input() title: string = 'Payment Voucher';

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialogRef<PaymentVoucherModalComponent>
  ) {
    super();
    this.form = this.fb.group({
      agent: ['', Validators.required],
      date: [new Date(), Validators.required],
      paymentMethod: ['', Validators.required],
      description: ['', Validators.required],
      bankName: [''],
      chequeDueDate: [''],
      amount: [0, [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit(): void {
    if (this.voucher) {
      this.form.patchValue({
        agent: { name: this.voucher.agent.name },
        date: new Date(this.voucher.date),
        paymentMethod: this.voucher.paymentMethod,
        description: this.voucher.description,
        bankName: this.voucher.bankName,
        chequeDueDate: this.voucher.chequeDueDate
          ? new Date(this.voucher.chequeDueDate)
          : undefined,
        amount: this.voucher.amount,
      });
    }
  }

  onSubmit() {
    if (this.form.valid) {
      const val = this.form.value as PaymentVoucher;
      this.dialog.close({ ...val, _id: this.voucher?._id });
    }
  }

  cancel() {
    this.dialog.close();
  }
}
