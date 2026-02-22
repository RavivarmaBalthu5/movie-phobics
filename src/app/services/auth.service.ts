import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AuthResponse {
  status: number;
  data: any;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {}


  private getAuthUrl(): string {
    return environment.netlifyAuthUrl;
  }

  auth(type: 'login' | 'signup', email: string, password: string, name?: string): Observable<AuthResponse> {
    const body: any = {
      type,
      email,
      password,
    };

    if (name) {
      body.name = name;
    }

    return this.http.post<any>(this.getAuthUrl(), body).pipe(
      map((response: any) => ({
        status: response.status || 200,
        data: response
      })),
      catchError((error) => {
        console.error('Error while authenticating:', error);
        return of({
          status: error.status || 500,
          data: error.error || 'Authentication failed'
        });
      })
    );
  }
}

