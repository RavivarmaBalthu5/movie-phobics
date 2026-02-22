import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-movie-not-found',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="movie-not-found-container">
      <h1 class="movie-not-found-title">Movie Not Found</h1>
      <p class="movie-not-found-message">Sorry, we couldn't find the movie you are looking for.</p>
      <div class="movie-not-found-actions">
        <button (click)="goHome()" class="button">Go to Homepage</button>
      </div>
    </div>
  `
})
export class MovieNotFoundComponent {
  constructor(private router: Router) {}

  goHome(): void {
    this.router.navigate(['/movies']);
  }
}

