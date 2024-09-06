import { Injectable } from '@angular/core';
import { HttpService } from '../../../shared/services/http/http.service';
import { map, Observable, tap } from 'rxjs';
import { User } from '../models/user.model';
import { HttpStatusCode } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private _endpoint = '/user'
  constructor(private http: HttpService) {}

  fetchUsers(query?: string): Observable<User[]> {
    const endpoint = `${this._endpoint}?query=${query}`;
    return this.http.get(endpoint).pipe(
      map((val) => {
        return (val.body as any).data as User[];
      })
    );
  }

  addUser(user : User) {
    const endpoint = `${this._endpoint}`
    return this.http.post(endpoint, user).pipe(map((val) => {
      return (val.body as any).data as User;
    }))
  }
  editUser(userId: number, updatedUser: User) {
    const endpoint = `${this._endpoint}/${userId}`;
    return this.http.update(endpoint, updatedUser).pipe(
      map((val) => {
        return (val.body as any).data as User;
      })
    );
  }
  
  deleteUser(userId: number) {
    const endpoint = `${this._endpoint}/${userId}`;
    return this.http.delete(endpoint).pipe(
      map((val) => {
        return val.status >= HttpStatusCode.Ok && val.status < 300;
      })
    );
  }
}
