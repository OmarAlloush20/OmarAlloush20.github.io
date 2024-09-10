import { Injectable } from '@angular/core';
import { HttpService } from '../../../shared/services/http/http.service';
import { catchError, map, Observable, of } from 'rxjs';
import { User } from '../models/user.model';
import { HttpStatusCode } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private _endpoint = 'user';
  constructor(private http: HttpService) {}

  fetchUsers(query?: string): Observable<User[] | undefined> {
    const endpoint = `${this._endpoint}${query ? `?query=${query}` : ''}`;
    return this.http.get(endpoint).pipe(
      map((val) => (val.body as any).data as User[]),
      catchError((err) => {
        console.log(err);
        return of(undefined);
      })
    );
  }

  addUser(user: User): Observable<User | undefined> {
    const endpoint = `${this._endpoint}`;
    return this.http.post(endpoint, user).pipe(
      map((val) => (val.body as any).data as User),
      catchError((_) => of(undefined))
    );
  }

  editUser(updatedUser: User) {
    const endpoint = `${this._endpoint}`;
    return this.http.update(endpoint, updatedUser).pipe(
      map((val) => (val.body as any).data as User),
      catchError((_) => of(undefined))
    );
  }

  deleteUser(userId: number) {
    const endpoint = `${this._endpoint}/${userId}`;
    return this.http.delete(endpoint).pipe(
      map((val) => val.status >= HttpStatusCode.Ok && val.status < 300),
      catchError((_) => of(false))
    );
  }
}
