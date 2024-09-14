import { Injectable } from '@angular/core';
import { HttpService } from '../../../shared/services/http/http.service';
import { catchError, map, Observable, of } from 'rxjs';
import { Trip } from '../../trips/models/trip.model';

@Injectable({
  providedIn: 'root'
})
export class TripService {
  private _endpoint = 'trips';

  constructor(private http: HttpService) {}

  fetchTrips(query?: string): Observable<Trip[] | undefined> {
    const endpoint = `${this._endpoint}${query ? `?query=${query}` : ''}`;
    return this.http.get(endpoint).pipe(
      map((val) => (val.body as any).data as Trip[]),
      catchError((err) => {
        console.log(err);
        return of(undefined);
      })
    );
  }

  addTrip(trip: Trip): Observable<Trip | undefined> {
    const endpoint = `${this._endpoint}`;
    const body = { ...trip };
    return this.http.post(endpoint, body).pipe(
      map((val) => val.body as Trip),
      catchError((_) => of(undefined))
    );
  }

  updateTrip(updatedTrip: Trip): Observable<Trip | undefined> {
    const endpoint = `${this._endpoint}/${updatedTrip._id}`;
    const body = { ...updatedTrip };
    return this.http.update(endpoint, body).pipe(
      map((val) => val.body as Trip),
      catchError((_) => of(undefined))
    );
  }

  deleteTrip(trip: Trip): Observable<boolean> {
    const endpoint = `${this._endpoint}/${trip._id}`;
    const body = {
      objectId: trip._id,
      isDeleted: true,
    };
    return this.http.delete(endpoint, body).pipe(
      map((val) => val.status >= 200 && val.status < 300),
      catchError((_) => of(false))
    );
  }

  // Additional helper methods
  getTripTypes(): string[] {
    return ["umrah", "hajj", "tourist", "services"];
  }

  validateTripDates(startDate: Date, endDate: Date): boolean {
    return startDate <= endDate;
  }
}
