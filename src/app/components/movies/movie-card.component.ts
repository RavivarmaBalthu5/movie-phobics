import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RatingComponent } from '../common/rating.component';
import { getImageUrl, formatReleaseDate } from '../../utils/utils';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [CommonModule, RatingComponent],
  template: `
    <div class="movie-card" (click)="onClick.emit(movie)">
      <div class="movie-card-image-container">
        <img
          [src]="getImageUrl(movie)"
          [alt]="movie?.title"
          class="movie-card-image"
        />
        <div class="movie-card-overlay">
          <div class="movie-card-rating">
            <app-rating [rating]="movie?.vote_average || 0" />
          </div>
          <h3 class="movie-card-title">{{ movie?.title }}</h3>
          <p class="movie-card-year">{{ formatReleaseDate(movie?.release_date) }}</p>
        </div>
      </div>
    </div>
  `
})
export class MovieCardComponent {
  @Input() movie: any;
  @Output() onClick = new EventEmitter<any>();

  getImageUrl = getImageUrl;
  formatReleaseDate = formatReleaseDate;
}

