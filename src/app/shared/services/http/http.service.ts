import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private baseUrl = environment.baseUrl; 
  private httpOptions = {}; // Initial value

  constructor(private http: HttpClient, private auth : AuthService) {
    this.initHttpOptions();
  }

  private initHttpOptions() {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer YOUR_TOKEN_HERE' // Replace YOUR_TOKEN_HERE with your actual token
      }),
      observe: 'response' as const // Observe the full response
    };
  }

  // GET Method
  getData<T>(endpoint: string): Observable<HttpResponse<T>> {
    return this.http
      .get<HttpResponse<T>>(`${this.baseUrl}/${endpoint}`)
      .pipe(catchError(this.handleError));
  }

  // POST Method
  postData<T>(endpoint: string, body: any): Observable<HttpResponse<T>> {
    return this.http
      .post<HttpResponse<T>>(
        `${this.baseUrl}/${endpoint}`,
        body,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  // UPDATE Method
  updateData<T>(endpoint: string, body: any): Observable<HttpResponse<T>> {
    return this.http
      .put<HttpResponse<T>>(
        `${this.baseUrl}/${endpoint}`,
        body,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  // DELETE Method
  deleteData<T>(endpoint: string): Observable<HttpResponse<T>> {
    return this.http
      .delete<HttpResponse<T>>(
        `${this.baseUrl}/${endpoint}`,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  // Multipart File Upload
  uploadFile<T>(
    endpoint: string,
    formData: FormData
  ): Observable<HttpResponse<T>> {
    return this.http
      .post<HttpResponse<T>>(
        `${this.baseUrl}/${endpoint}`,
        formData,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, body was: ${error.error}`
      );
    }
    return throwError('Something bad happened; please try again later.');
  }
}
