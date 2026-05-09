import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <form #form="ngForm" (ngSubmit)="handleSubmit(form)" class="auth-form">
      <h2>Login</h2>
      <div *ngIf="error" class="error">{{ error }}</div>
      <div *ngIf="success" class="success">{{ success }}</div>
      <div *ngIf="loading" class="login-loading-container">
        <img src="assets/loading.svg" alt="Loading..." class="loading-img" />
      </div>
      <input
        type="email"
        [(ngModel)]="formData.email"
        #email="ngModel"
        name="email"
        placeholder="Email"
        required
        [pattern]="emailPattern"
      />
      <div *ngIf="email.invalid && email.touched" class="error">
        <span *ngIf="email.errors?.['required']">Email is required.</span>
        <span *ngIf="email.errors?.['pattern']">Please enter a valid email address (e.g., example@domain.com).</span>
      </div>
      <input
        type="password"
        [(ngModel)]="formData.password"
        #password="ngModel"
        name="password"
        placeholder="Password"
        required
      />
      <button type="submit" [disabled]="loading || form.invalid">
        <span *ngIf="loading">Loading...</span>
        <span *ngIf="!loading">Login</span>
      </button>
    </form>
  `
})
export class LoginComponent implements OnInit {
  formData = { email: '', password: '' };
  readonly emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/;
  error = '';
  success = '';
  loading = false;

  constructor(
    private authService: AuthService,
    private sessionService: SessionService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        const { loginTime } = userData;
        const now = Date.now();
        const THIRTY_MINUTES = 30 * 60 * 1000;

        if (now - loginTime < THIRTY_MINUTES) {
          // Still valid session
          this.router.navigate(['/movies']);
        } else {
          // Expired session
          localStorage.removeItem('user');
        }
      } catch {
        localStorage.removeItem('user');
      }
    }
  }

  handleSubmit(form: NgForm): void {
    form.control.markAllAsTouched();
    this.error = '';
    this.success = '';
    this.loading = true;

    if (!this.formData.email || !this.formData.password) {
      this.error = 'All fields are required.';
      this.loading = false;
      return;
    }

    if (form.invalid) {
      this.error = 'Please fix the highlighted fields.';
      this.loading = false;
      return;
    }

    this.authService.auth('login', this.formData.email, this.formData.password).pipe(
      finalize(() => {
        this.loading = false;
      })
    ).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.status === 200) {
          this.success = 'Login successful!';
          this.sessionService.setUser({
            ...response.data,
            email: this.formData.email,
            loginTime: Date.now()
          });
          setTimeout(() => {
            this.router.navigate(['/movies']);
          }, 500);
        } else if (response.status === 401) {
          this.error = 'Invalid email or password.';
        } else {
          this.error = response.data || 'Login failed';
        }
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.loading = false;
        if (error.status === 401 || error.message?.includes('401')) {
          this.error = 'Invalid email or password.';
        } else {
          this.error = 'An error occurred. Please try again later.';
        }
        this.cdr.detectChanges();
        console.error('Login error:', error);
      }
    });
  }
}
