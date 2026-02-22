import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="not-found-container">
      <h1 class="not-found-title">404 - Page Not Found</h1>
      <p class="not-found-message">Sorry, the page you are looking for does not exist.</p>
      <div class="not-found-actions">
        <button (click)="goBack()" class="button">Go Back</button>
        <button (click)="goHome()" class="button">Go to Home</button>
      </div>
    </div>
  `
})
export class NotFoundComponent {
  constructor(private router: Router) {}

  goBack(): void {
    this.router.navigate(['/']);
  }

  goHome(): void {
    this.router.navigate(['/']);
  }
}

