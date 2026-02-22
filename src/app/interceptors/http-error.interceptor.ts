import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Log outgoing requests
    console.log(`HTTP Request: ${request.method} ${request.url}`);

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An unknown error occurred';

        if (error.error instanceof ErrorEvent) {
          // Client-side error
          errorMessage = `Error: ${error.error.message}`;
          console.error('Client-side error:', error.error);
        } else {
          // Server-side error
          if (error.status === 0) {
            errorMessage = 'CORS Error or Network Issue - Unable to reach the API server';
            console.error('CORS/Network Error:', error);
          } else {
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
            console.error('Server Error:', error.statusText, error.error);
          }
        }

        console.error(errorMessage);
        return throwError(() => new Error(errorMessage));
      })
    );
  }
}

