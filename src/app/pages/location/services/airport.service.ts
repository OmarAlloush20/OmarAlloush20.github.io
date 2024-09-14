import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpService } from '../../../shared/services/http/http.service';
import { Airport } from '../models/location.model';

@Injectable({
  providedIn: 'root'
})
export class AirportService {
  private _endpoint = 'airports';

  constructor(private http: HttpService) {}

  fetchAirports(cityId : string): Observable<Airport[] | undefined> {
    const endpoint = `${this._endpoint}?cityId=${cityId}`;
    return this.http.get(endpoint).pipe(
      map((val) => (val.body as any).data as Airport[]),
      catchError((err) => {
        console.log(err);
        return of(undefined);
      })
    );
  }

  addAirport(airport: Airport): Observable<Airport | undefined> {
    const endpoint = `${this._endpoint}`;
    const body = { ...airport };
    return this.http.post(endpoint, body).pipe(
      map((val) => val.body as Airport),
      catchError((_) => of(undefined))
    );
  }

  updateAirport(updatedAirport: Airport): Observable<Airport | undefined> {
    const endpoint = `${this._endpoint}/${updatedAirport.name.toLowerCase()}`;
    const body = { ...updatedAirport };
    return this.http.update(endpoint, body).pipe(
      map((val) => val.body as Airport),
      catchError((_) => of(undefined))
    );
  }

  deleteAirport(airport: Airport): Observable<boolean> {
    const endpoint = `${this._endpoint}/${airport.name.toLowerCase()}`;
    const body = {
      objectId: airport._id,
      isDeleted: true,
    };
    return this.http.delete(endpoint, body).pipe(
      map((val) => val.status >= 200 && val.status < 300),
      catchError((_) => of(false))
    );
  }
}