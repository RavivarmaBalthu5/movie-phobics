import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs/operators';
import { MovieService } from '../../services/movie.service';
import { SearchService } from '../../services/search.service';
import { MovieCardComponent } from './movie-card.component';

@Component({
  selector: 'app-movies-section',
  standalone: true,
  imports: [CommonModule, MovieCardComponent],
  template: `
    <div class="movies-section">
      <div *ngIf="loading" class="loading-container">
        <img src="assets/loading.svg" alt="loading" class="movie-loading" />
      </div>
      <div *ngIf="!loading" class="movie-results">
        <app-movie-card
          *ngFor="let movie of movies"
          [movie]="movie"
          (onClick)="handleMovieClick($event)"
        />
      </div>
      <div *ngIf="!loading && movies.length > 0" class="pagination">
        <button
          (click)="previousPage()"
          [disabled]="currentPage === 1"
          class="button"
        >
          Previous
        </button>
        <span class="page-info">Page {{ currentPage }} of {{ totalPages }}</span>
        <button
          (click)="nextPage()"
          [disabled]="currentPage === totalPages"
          class="button"
        >
          Next
        </button>
      </div>
    </div>
  `
})
export class MoviesSectionComponent implements OnInit {
  movies: any[] = [];
  loading = false;
  totalPages = 1;
  currentPage = 1;
  searchQuery = '';

  constructor(
    private movieService: MovieService,
    private searchService: SearchService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.movieService.fetchTotalPages().subscribe({
      next: (pages) => {
        this.totalPages = Math.max(1, Math.floor(Number(pages) || 1));
      },
      error: (error) => {
        console.error('Error fetching total pages:', error);
      }
    });

    this.searchService.searchQuery$.subscribe((query) => {
      this.searchQuery = query;
      this.currentPage = 1;
      this.loadMovies();
    });
    // searchQuery$ (BehaviorSubject) emits '' immediately on subscribe, triggering loadMovies()
  }

  private loadMovies(): void {
    this.loading = true;
    if (!this.searchQuery) {
      this.movieService
        .fetchMoviesWithPage(this.currentPage)
        .pipe(finalize(() => {
          this.loading = false;
          this.cdr.detectChanges();
        }))
        .subscribe({
          next: (data) => {
            // Handle both array and object responses
            if (Array.isArray(data)) {
              this.movies = data;
            } else if (data && data.results) {
              this.movies = data.results;
            } else {
              this.movies = [];
            }
            this.cdr.detectChanges();
          },
          error: (error) => {
            console.error('Error fetching movies:', error);
            this.movies = [];
          }
        });
    } else {
      this.movieService
        .fetchMovies(this.searchQuery)
        .pipe(finalize(() => {
          this.loading = false;
          this.cdr.detectChanges();
        }))
        .subscribe({
          next: (data) => {
            console.log('LoadMovies (search) data received:', data);
            // Handle both array and object responses
            if (Array.isArray(data)) {
              this.movies = data;
            } else if (data && data.results) {
              this.movies = data.results;
            } else {
              this.movies = [];
            }
            this.cdr.detectChanges();
          },
          error: (error) => {
            console.error('Error fetching movies:', error);
            this.movies = [];
          }
        });
    }
  }

  handleMovieClick(movie: any): void {
    this.router.navigate(['/movies', movie.id]);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadMovies();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadMovies();
    }
  }
}

