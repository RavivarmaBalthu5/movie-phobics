import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';

export interface UserSession {
  name?: string;
  email: string;
  loginTime: number;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class SessionService implements OnDestroy {
  private userSubject = new BehaviorSubject<UserSession | null>(null);
  private sessionTimeoutSubject = new Subject<void>();
  private sessionCheckInterval: any;

  public user$ = this.userSubject.asObservable();
  public sessionTimeout$ = this.sessionTimeoutSubject.asObservable();

  private readonly SESSION_TIMEOUT = environment.sessionTimeout;
  private readonly SESSION_CHECK_INTERVAL = 10000; // Check every 10 seconds

  constructor() {
    this.initializeSession();
    this.startSessionMonitoring();
  }

  private initializeSession(): void {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser) as UserSession;
        if (this.isSessionValid(userData)) {
          this.userSubject.next(userData);
        } else {
          this.clearSession();
        }
      } catch (error) {
        console.error('Error parsing stored user:', error);
        this.clearSession();
      }
    }
  }

  private startSessionMonitoring(): void {
    this.sessionCheckInterval = setInterval(() => {
      const user = this.userSubject.value;
      if (user && !this.isSessionValid(user)) {
        this.clearSession();
        this.sessionTimeoutSubject.next();
      }
    }, this.SESSION_CHECK_INTERVAL);
  }

  private isSessionValid(user: UserSession): boolean {
    const now = Date.now();
    return now - user.loginTime < this.SESSION_TIMEOUT;
  }

  setUser(user: UserSession): void {
    const sessionData = {
      ...user,
      loginTime: Date.now()
    };
    localStorage.setItem('user', JSON.stringify(sessionData));
    this.userSubject.next(sessionData);
  }

  getUser(): UserSession | null {
    return this.userSubject.value;
  }

  isLoggedIn(): boolean {
    return this.userSubject.value !== null;
  }

  clearSession(): void {
    localStorage.removeItem('user');
    this.userSubject.next(null);
  }

  ngOnDestroy(): void {
    if (this.sessionCheckInterval) {
      clearInterval(this.sessionCheckInterval);
    }
  }
}

