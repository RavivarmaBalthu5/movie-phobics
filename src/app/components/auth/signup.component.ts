import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <form (ngSubmit)="handleSubmit()" class="auth-form">
      <h2>Sign Up</h2>
      <div *ngIf="error" class="error">{{ error }}</div>
      <div *ngIf="success" class="success">{{ success }}</div>
      <input
        type="text"
        [(ngModel)]="formData.name"
        name="name"
        placeholder="Name"
        required
      />
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
      <div class="password-rules">
        <small [class.valid]="passwordRules.minLength">
          Minimum 8 characters
        </small>
        <small [class.valid]="passwordRules.hasUppercase">
          At least one uppercase letter
        </small>
        <small [class.valid]="passwordRules.hasNumber">
          At least one number
        </small>
        <small [class.valid]="passwordRules.hasSpecialChar">
          At least one special character
        </small>
      </div>
      <button type="submit" [disabled]="!isPasswordValid">Sign Up</button>
    </form>
  `
})
export class SignupComponent {
  formData = { name: '', email: '', password: '' };
  error = '';
  success = '';

  passwordRules = {
    minLength: false,
    hasUppercase: false,
    hasNumber: false,
    hasSpecialChar: false
  };

  get isPasswordValid(): boolean {
    return Object.values(this.passwordRules).every((rule) => rule);
  }

  constructor(
    private authService: AuthService,
    private sessionService: SessionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.updatePasswordRules();
  }

  ngDoCheck(): void {
    this.updatePasswordRules();
  }

  private updatePasswordRules(): void {
    this.passwordRules.minLength = this.formData.password.length >= 8;
    this.passwordRules.hasUppercase = /[A-Z]/.test(this.formData.password);
    this.passwordRules.hasNumber = /[0-9]/.test(this.formData.password);
    this.passwordRules.hasSpecialChar = /[^A-Za-z0-9]/.test(this.formData.password);
  }

  handleSubmit(): void {
    this.error = '';
    this.success = '';

    if (!this.formData.name || !this.formData.email || !this.formData.password) {
      this.error = 'All fields are required.';
      return;
    }

    if (!this.isPasswordValid) {
      this.error = 'Password does not meet all the requirements.';
      return;
    }

    this.authService.auth('signup', this.formData.email, this.formData.password, this.formData.name)
      .subscribe({
        next: (response) => {
          if (response.status === 200) {
            this.success = 'Signup successful! Please log in.';
            this.sessionService.setUser({
              email: this.formData.email,
              name: this.formData.name,
              loginTime: Date.now()
            });
            setTimeout(() => {
              this.router.navigate(['/movies']);
            }, 500);
          } else {
            this.error = response.data || 'Signup failed';
          }
        },
        error: (error) => {
          this.error = 'An error occurred. Please try again later.';
          console.error('Signup error:', error);
        }
      });
  }
}

