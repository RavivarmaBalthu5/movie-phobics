import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs/operators';
import { MovieService } from '../../services/movie.service';
import { RatingComponent } from '../common/rating.component';
import { MovieNotFoundComponent } from './movie-not-found.component';
import { getImageUrl, getYearFromDate, genreMap, languageMapping } from '../../utils/utils';
import { environment } from '../../../environments/environment';
import * as _ from 'lodash';

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [CommonModule, MovieNotFoundComponent],
  template: `
    <div *ngIf="loading" class="loading-container">
      <img src="assets/loading.svg" alt="loading" class="movie-loading" />
    </div>

    <app-movie-not-found *ngIf="!loading && !movie" />

    <div
      *ngIf="!loading && movie"
      class="movie-details-container"
      [style.backgroundImage]="'url(https://image.tmdb.org/t/p/original' + movie.backdrop_path + ')'"
    >
      <div class="movie-main">
        <div class="movie-left">
          <img [src]="getImageUrl(movie)" [alt]="movie.original_title" class="movie-poster" />
        </div>
        <div class="movie-right">
          <h2>
            {{ movie.title }}
            <span *ngIf="movie.original_language !== 'en'">
              ({{ movie.original_title }})
            </span>
            ({{ getYearFromDate(movie.release_date) }})
          </h2>
          <div class="movie-info">
            <div class="info-item">
              <strong>Overview:</strong>
              <span class="overview">{{ movie.overview }}</span>
            </div>
            <div class="info-item">
              <strong>Genres:</strong>
              <span>{{ getGenreNames() }}</span>
            </div>
            <div class="info-item">
              <strong>Release Date:</strong>
              <p>{{ movie.release_date | date }}</p>
            </div>
            <div class="info-item">
              <strong>Rating:</strong>
              <p>{{ movie.vote_average }} ({{ movie.vote_count }} votes)</p>
            </div>
            <div class="info-item">
              <strong>Popularity:</strong>
              <p>{{ movie.popularity }}</p>
            </div>
            <div class="info-item">
              <strong>Original Language:</strong>
              <p>{{ languageMapping[movie.original_language] }}</p>
            </div>
          </div>
          <div class="filter-tabs">
            <button
              *ngFor="let f of filters"
              (click)="setFilter(f)"
              class="button"
              [class.active]="filter === f"
            >
              {{ f }}
            </button>
          </div>
        </div>
      </div>

      <div class="movie-videos">
        <div class="video-list">
          <div *ngFor="let video of filteredVideos" class="video-item">
            <iframe
              [src]="getYoutubeEmbedUrl(video.key)"
              frameborder="0"
              allow="autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
              [title]="video.name">
            </iframe>
          </div>
        </div>
      </div>
    </div>
  `
})
export class MovieDetailsComponent implements OnInit {
  movie: any = null;
  videos: any[] = [];
  loading = true;
  filter = '';
  filters: string[] = [];
  filteredVideos: any[] = [];

  getImageUrl = getImageUrl;
  getYearFromDate = getYearFromDate;
  languageMapping = languageMapping;

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    private cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const movieId = params['id'];
      this.loadMovieDetails(movieId);
    });
  }

  private loadMovieDetails(movieId: string): void {
    this.loading = true;
    this.movie = null;
    this.videos = [];
    this.filter = '';
    this.filters = [];
    this.filteredVideos = [];
    this.movieService.fetchMovieDetail(movieId).subscribe({
      next: (data) => {
        if (Array.isArray(data) && data.length > 0) {
          this.movie = data[0];
        } else if (data?.results && Array.isArray(data.results) && data.results.length > 0) {
          this.movie = data.results[0];
        } else if (!Array.isArray(data) && data && (data.id || data.title)) {
          this.movie = data;
        }

        if (this.movie?.id) {
          this.loadVideos(this.movie.id);
        } else {
          this.setLoadingFalse();
        }
      },
      error: (error) => {
        console.error('Error fetching movie:', error);
        this.setLoadingFalse();
      }
    });
  }

  private loadVideos(movieId: string): void {
    this.movieService
      .fetchVideos(movieId)
      .pipe(finalize(() => this.setLoadingFalse()))
      .subscribe({
        next: (data) => {
          this.videos = Array.isArray(data) ? data : (data?.results || []);
          this.filters = Array.from(new Set(this.videos.map((v) => v.type)));
          if (this.filters.length > 0 && !this.filter) {
            this.filter = this.filters[0];
          }
          this.filteredVideos = this.videos.filter((v) => v.type === this.filter);
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error fetching videos:', error);
        }
      });
  }

  private setLoadingFalse(): void {
    this.loading = false;
    this.cdr.detectChanges();
  }

  getGenreNames(): string {
    if (!this.movie?.genre_ids) return 'Unknown';
    const genreNames = this.movie.genre_ids.map((id: number) => genreMap[id]);
    return !_.isEmpty(genreNames) ? genreNames.join(', ') : 'Unknown';
  }

  setFilter(f: string): void {
    this.filter = f;
    this.filteredVideos = this.videos.filter((v) => v.type === f);
  }

  getYoutubeEmbedUrl(videoKey: string): SafeResourceUrl {
    const url = `${environment.youtubeBaseUrl}/embed/${videoKey}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}

