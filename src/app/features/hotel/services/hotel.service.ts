import { Injectable } from '@angular/core';
import { HttpService } from '../../../shared/services/http/http.service';
import { catchError, map, Observable, of } from 'rxjs';
import { Hotel } from '../models/hotel.model';
import { City } from '../../city/models/city.model';

@Injectable({
  providedIn: 'root',
})
export class HotelService {
  private _endpoint = 'hotel';

  constructor(private http: HttpService) {}

  fetchHotels(city: City): Observable<Hotel[] | undefined> {
    const cityId = city._id;
    const endpoint = `${this._endpoint}?city=${cityId}`;
    return this.http.get(endpoint).pipe(
      map((val) => (val.body as any).data as Hotel[]),
      catchError((err) => {
        console.log(err);
        return of(undefined);
      })
    );
  }

  addHotel(hotel: Hotel): Observable<Hotel | undefined> {
    const endpoint = `${this._endpoint}`;
    const body = { ...hotel, city: hotel.city._id };
    console.log(JSON.stringify(body));
    return this.http.post(endpoint, body).pipe(
      map((val) => val.body as Hotel),
      catchError((_) => of(undefined))
    );
  }

  updateHotel(updatedHotel: Hotel): Observable<Hotel | undefined> {
    const endpoint = `${this._endpoint}`;
    const body = { ...updatedHotel, city: updatedHotel.city._id };
    return this.http.update(endpoint, body).pipe(
      map((val) => val.body as Hotel),
      catchError((_) => of(undefined))
    );
  }

  deleteHotel(hotel: Hotel): Observable<boolean> {
    const endpoint = `${this._endpoint}`;
    const body = {
      objectId: hotel._id,
      isDeleted: true,
    };
    return this.http.delete(endpoint, body).pipe(
      map((val) => val.status >= 200 && val.status < 300),
      catchError((_) => of(false))
    );
  }
}
