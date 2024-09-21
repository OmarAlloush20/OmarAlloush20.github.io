import { Injectable } from '@angular/core';
import { LoginRepository } from '../repositories/login.repository';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { catchError, map, Observable, of } from 'rxjs';
import { LoginResult } from '../types/login.types';
import { HttpService } from '../../../shared/services/http/http.service';
import { User } from '../../users/models/user.model';
import { HttpStatusCode } from '@angular/common/http';

@Injectable()
export class LoginService {
  private repository!: LoginRepository;

  constructor(private http: HttpService, private authService: AuthService) {
    this.repository = new LoginRepository(http);
  }

  login(credentials: {
    username: string;
    password: string;
  }): Observable<string> {
    const endpoint = `auth/login`;
    return this.http.post(endpoint, credentials).pipe(
      map((res) => {
        if (res.status === HttpStatusCode.BadRequest)
          return 'wrong-credentials';

        if (res.status !== HttpStatusCode.Ok) return 'failed';
        const result = (res.body as any).data as
          | { user: User; token: string }
          | undefined;

        if (!result) return 'failed';
        this.authService.update(result!);
        return 'success';
      }),
      catchError((_) => of('failed'))
    );
  }
}
