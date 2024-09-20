import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Country } from '../models/location.model';
import { HttpService } from '../../../shared/services/http/http.service';

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  private _endpoint = 'country';

  constructor(private http: HttpService) {}

  fetchCountries(query?: string): Observable<Country[] | undefined> {
    const endpoint = `${this._endpoint}${query ? `?query=${query}` : ''}`;
    return this.http.get(endpoint).pipe(
      map((val) => (val.body as any).data as Country[]),
      catchError((err) => {
        console.log(err);
        return of(undefined);
      })
    );
  }

  addCountry(country: Country): Observable<Country | undefined> {
    const endpoint = `${this._endpoint}`;
    const body = { ...country };
    return this.http.post(endpoint, body).pipe(
      map((val) => val.body as Country),
      catchError((_) => of(undefined))
    );
  }

  updateCountry(updatedCountry: Country): Observable<Country | undefined> {
    const endpoint = `${this._endpoint}`;
    const body = { ...updatedCountry };
    return this.http.update(endpoint, body).pipe(
      map((val) => val.body as Country),
      catchError((_) => of(undefined))
    );
  }

  deleteCountry(country: Country): Observable<boolean> {
    const endpoint = `${this._endpoint}`;
    const body = {
      objectId: country._id,
      isDeleted: true,
    };
    return this.http.delete(endpoint, body).pipe(
      map((val) => val.status >= 200 && val.status < 300),
      catchError((_) => of(false))
    );
  }
}
