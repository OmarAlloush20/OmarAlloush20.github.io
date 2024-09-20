import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
  HttpResponse,
  HttpStatusCode,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private baseUrl = environment.baseUrl;
  private httpOptions = {}; // Initial value

  constructor(private http: HttpClient, private auth: AuthService) {
    this._refreshHttpOptions();
    this._subscribeToAuthService();
  }

  private _refreshHttpOptions() {
    this.httpOptions = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.auth.token}`,
      }),
      observe: 'response' as const,
    };
  }

  private _subscribeToAuthService() {
    this.auth.authStatus$.subscribe((_) => {
      if (this.auth.token) {
        this._refreshHttpOptions();
      }
    });
  }

  // GET Method
  get<T>(endpoint: string): Observable<HttpResponse<T>> {
    return this.http
      .get<HttpResponse<T>>(`${this.baseUrl}/${endpoint}`, this.httpOptions)
      .pipe(
        tap((res) => {
          this._checkIfUnauthorized(res.status);
          return res;
        }),
        catchError(this.handleError)
      );
  }

  // POST Method
  post<T>(endpoint: string, body: any): Observable<HttpResponse<T>> {
    return this.http
      .post<HttpResponse<T>>(
        `${this.baseUrl}/${endpoint}`,
        body,
        this.httpOptions
      )
      .pipe(
        tap((res) => this._checkIfUnauthorized(res.status)),
        catchError(this.handleError)
      );
  }

  // UPDATE Method
  update<T>(endpoint: string, body: any): Observable<HttpResponse<T>> {
    return this.http
      .put<HttpResponse<T>>(
        `${this.baseUrl}/${endpoint}`,
        body,
        this.httpOptions
      )
      .pipe(
        tap((res) => this._checkIfUnauthorized(res.status)),
        catchError(this.handleError)
      );
  }

  // DELETE Method
  delete<T>(endpoint: string, body?: any): Observable<HttpResponse<T>> {
    return this.http
      .delete<HttpResponse<T>>(`${this.baseUrl}/${endpoint}`, {
        ...this.httpOptions,
        body: body,
      })
      .pipe(
        tap((res) => this._checkIfUnauthorized(res.status)),
        catchError(this.handleError)
      );
  }

  // Multipart File Upload
  multipart<T>(
    endpoint: string,
    formData: FormData
  ): Observable<HttpResponse<T>> {
    return this.http
      .post<HttpResponse<T>>(
        `${this.baseUrl}/${endpoint}`,
        formData,
        this.httpOptions
      )
      .pipe(
        tap((res) => this._checkIfUnauthorized(res.status)),
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, body was: ${JSON.stringify(error.error)}`
      );
    }
    return throwError(
      () => new Error('Something bad happened; please try again later.')
    );
  }

  private _checkIfUnauthorized(statusCode: number) {
    if (statusCode === HttpStatusCode.Unauthorized) {
      this.auth.invalidate();
      throw new Error('Unauthorized');
    }
  }
}
