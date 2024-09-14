import { Injectable } from '@angular/core';
import { HttpService } from '../../../shared/services/http/http.service';
import { catchError, map, Observable, of } from 'rxjs';
import { HttpStatusCode } from '@angular/common/http';
import { ReceiptVoucher } from '../models/receipt-voucher.model';

@Injectable({
  providedIn: 'root',
})
export class ReceiptVoucherService {
  private _endpoint = 'receiptVoucher';

  constructor(private http: HttpService) {}

  fetchReceiptVouchers(query?: string): Observable<ReceiptVoucher[] | undefined> {
    const endpoint = `${this._endpoint}${query ? `?query=${query}` : ''}`;
    return this.http.get(endpoint).pipe(
      map((val) => (val.body as any).data as ReceiptVoucher[]),
      catchError((err) => {
        console.log(err);
        return of(undefined);
      })
    );
  }

  addReceiptVoucher(receiptVoucher: ReceiptVoucher): Observable<ReceiptVoucher | undefined> {
    const endpoint = `${this._endpoint}`;
    const body = {
      ...receiptVoucher,
      customer: receiptVoucher.customer._id
    }
    return this.http.post(endpoint, body).pipe(
      map((val) => (val.body as any).data as ReceiptVoucher),
      catchError((_) => of(undefined))
    );
  }

  editReceiptVoucher(updatedReceiptVoucher: ReceiptVoucher): Observable<ReceiptVoucher | undefined> {
    const endpoint = `${this._endpoint}`;
    const body = {
      ...updatedReceiptVoucher,
      customer: updatedReceiptVoucher.customer._id
    }
    return this.http.update(endpoint, body).pipe(
      map((val) => (val.body as any).data as ReceiptVoucher),
      catchError((_) => of(undefined))
    );
  }

  deleteReceiptVoucher(receiptVoucher: ReceiptVoucher): Observable<boolean> {
    const endpoint = `${this._endpoint}`;
    const body = {
      objectId: receiptVoucher._id,
      isDeleted: true,
    };
    return this.http.delete(endpoint, body).pipe(
      map((val) => val.status >= HttpStatusCode.Ok && val.status < 300),
      catchError((_) => of(false))
    );
  }
}
