import { Injectable } from '@angular/core';
import { HttpService } from '../../../shared/services/http/http.service';
import { catchError, map, Observable, of } from 'rxjs';
import { HttpStatusCode } from '@angular/common/http';
import { Customer } from '../models/customer.model';

@Injectable({
  providedIn: 'root',
})
export class CustomersService {
  private _endpoint = 'customer';
  constructor(private http: HttpService) {}

  fetchCustomers(query?: string): Observable<Customer[] | undefined> {
    const endpoint = `${this._endpoint}${query ? `?query=${query}` : ''}`;
    return this.http.get(endpoint).pipe(
      map((val) => (val.body as any).data as Customer[]),
      catchError((err) => {
        console.log(err);
        return of(undefined);
      })
    );
  }

  addCustomer(customer: Customer): Observable<Customer | undefined> {
    const endpoint = `${this._endpoint}`;
    return this.http.post(endpoint, customer).pipe(
      map((val) => (val.body as any).data as Customer),
      catchError((_) => of(undefined))
    );
  }

  editCustomer(updatedCustomer: Customer) {
    const endpoint = `${this._endpoint}`;
    return this.http.update(endpoint, updatedCustomer).pipe(
      map((val) => (val.body as any).data as Customer),
      catchError((_) => of(undefined))
    );
  }

  deleteCustomer(customer : Customer) {
    const endpoint = `${this._endpoint}`;
    const body = {
      objectId: customer._id,
      isDeleted: true,
    }
    return this.http.delete(endpoint, body).pipe(
      map((val) => val.status >= HttpStatusCode.Ok && val.status < 300),
      catchError((_) => of(false))
    );
  }
}
