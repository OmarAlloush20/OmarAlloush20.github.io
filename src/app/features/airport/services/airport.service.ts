import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpService } from '../../../shared/services/http/http.service';
import { City } from '../../city/models/city.model';
import { Airport } from '../models/airport.model';

@Injectable({
  providedIn: 'root',
})
export class AirportService {
  private _endpoint = 'airportCode';

  constructor(private http: HttpService) {}

  fetchAirports(city: City): Observable<Airport[] | undefined> {
    const cityId = city._id;
    const endpoint = `${this._endpoint}?city=${cityId}`;
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
    const body = { ...airport, city: airport.city._id };
    console.log(JSON.stringify(body));
    return this.http.post(endpoint, body).pipe(
      map((val) => val.body as Airport),
      catchError((_) => of(undefined))
    );
  }

  updateAirport(updatedAirport: Airport): Observable<Airport | undefined> {
    const endpoint = `${this._endpoint}`;
    const body = { ...updatedAirport, city: updatedAirport.city._id };
    return this.http.update(endpoint, body).pipe(
      map((val) => val.body as Airport),
      catchError((_) => of(undefined))
    );
  }

  deleteAirport(airport: Airport): Observable<boolean> {
    const endpoint = `${this._endpoint}`;
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
