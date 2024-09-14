import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpService } from '../../../shared/services/http/http.service';
import { City } from '../models/location.model';

@Injectable({
  providedIn: 'root'
})
export class CityService {
  private _endpoint = 'cities';

  constructor(private http: HttpService) {}

  fetchCities(countryId : string): Observable<City[] | undefined> {
    const endpoint = `${this._endpoint}?countryId=${countryId}`;
    return this.http.get(endpoint).pipe(
      map((val) => (val.body as any).data as City[]),
      catchError((err) => {
        console.log(err);
        return of(undefined);
      })
    );
  }

  addCity(city: City): Observable<City | undefined> {
    const endpoint = `${this._endpoint}`;
    const body = { ...city };
    return this.http.post(endpoint, body).pipe(
      map((val) => val.body as City),
      catchError((_) => of(undefined))
    );
  }

  updateCity(updatedCity: City): Observable<City | undefined> {
    const endpoint = `${this._endpoint}/${updatedCity.name.toLowerCase()}`;
    const body = { ...updatedCity };
    return this.http.update(endpoint, body).pipe(
      map((val) => val.body as City),
      catchError((_) => of(undefined))
    );
  }

  deleteCity(city: City): Observable<boolean> {
    const endpoint = `${this._endpoint}/${city.name.toLowerCase()}`;
    const body = {
      objectId: city._id,
      isDeleted: true,
    };
    return this.http.delete(endpoint, body).pipe(
      map((val) => val.status >= 200 && val.status < 300),
      catchError((_) => of(false))
    );
  }
}
