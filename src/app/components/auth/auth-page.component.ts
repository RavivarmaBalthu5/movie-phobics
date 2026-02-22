import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { SignupComponent } from './signup.component';
import { SessionService } from '../../services/session.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-page',
  standalone: true,
  imports: [CommonModule, LoginComponent, SignupComponent],
  template: `
    <div class="auth-container">
      <app-login *ngIf="isLogin" />
      <app-signup *ngIf="!isLogin" />
      <p class="toggle-text">
        {{ isLogin ? "Don't have an account?" : 'Already have an account?' }}
        <button (click)="toggleMode()" class="toggle-btn">
          {{ isLogin ? ' Sign Up' : ' Log In' }}
        </button>
      </p>
    </div>
  `
})
export class AuthPageComponent implements OnInit {
  isLogin = true;

  constructor(private sessionService: SessionService, private router: Router) {}

  ngOnInit(): void {
    if (this.sessionService.isLoggedIn()) {
      this.router.navigate(['/movies']);
    }
  }

  toggleMode(): void {
    this.isLogin = !this.isLogin;
  }
}

