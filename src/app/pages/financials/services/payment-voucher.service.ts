import { Injectable } from '@angular/core';
import { HttpService } from '../../../shared/services/http/http.service';
import { catchError, map, Observable, of } from 'rxjs';
import { HttpStatusCode } from '@angular/common/http';
import { PaymentVoucher } from '../models/payment-voucher.model';

@Injectable({
  providedIn: 'root',
})
export class PaymentVoucherService {
  private _endpoint = 'paymentVoucher';

  constructor(private http: HttpService) {}

  fetchPaymentVouchers(query?: string): Observable<PaymentVoucher[] | undefined> {
    const endpoint = `${this._endpoint}${query ? `?query=${query}` : ''}`;
    return this.http.get(endpoint).pipe(
      map((val) => (val.body as any).data as PaymentVoucher[]),
      catchError((err) => {
        console.log(err);
        return of(undefined);
      })
    );
  }

  addPaymentVoucher(paymentVoucher: PaymentVoucher): Observable<PaymentVoucher | undefined> {
    const endpoint = `${this._endpoint}`;
    return this.http.post(endpoint, paymentVoucher).pipe(
      map((val) => (val.body as any).data as PaymentVoucher),
      catchError((_) => of(undefined))
    );
  }

  editPaymentVoucher(updatedPaymentVoucher: PaymentVoucher): Observable<PaymentVoucher | undefined> {
    const endpoint = `${this._endpoint}`;
    return this.http.update(endpoint, updatedPaymentVoucher).pipe(
      map((val) => (val.body as any).data as PaymentVoucher),
      catchError((_) => of(undefined))
    );
  }

  deletePaymentVoucher(paymentVoucher: PaymentVoucher): Observable<boolean> {
    const endpoint = `${this._endpoint}`;
    const body = {
      objectId: paymentVoucher._id,
      isDeleted: true,
    };
    return this.http.delete(endpoint, body).pipe(
      map((val) => val.status >= HttpStatusCode.Ok && val.status < 300),
      catchError((_) => of(false))
    );
  }
}
