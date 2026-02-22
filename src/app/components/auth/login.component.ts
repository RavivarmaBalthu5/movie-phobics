import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <form (ngSubmit)="handleSubmit()" class="auth-form">
      <h2>Login</h2>
      <div *ngIf="error" class="error">{{ error }}</div>
      <div *ngIf="success" class="success">{{ success }}</div>
      <input
        type="email"
        [(ngModel)]="formData.email"
        name="email"
        placeholder="Email"
        required
      />
      <input
        type="password"
        [(ngModel)]="formData.password"
        name="password"
        placeholder="Password"
        required
      />
      <button type="submit">Login</button>
    </form>
  `
})
export class LoginComponent implements OnInit {
  formData = { email: '', password: '' };
  error = '';
  success = '';

  constructor(
    private authService: AuthService,
    private sessionService: SessionService,
    private router: Router
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

  handleSubmit(): void {
    this.error = '';
    this.success = '';

    if (!this.formData.email || !this.formData.password) {
      this.error = 'All fields are required.';
      return;
    }

    this.authService.auth('login', this.formData.email, this.formData.password).subscribe({
      next: (response) => {
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
        } else {
          this.error = response.data || 'Login failed';
        }
      },
      error: (error) => {
        this.error = 'An error occurred. Please try again later.';
        console.error('Login error:', error);
      }
    });
  }
}

