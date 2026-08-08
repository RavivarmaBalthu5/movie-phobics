import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
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
      <div *ngIf="loading && movies.length === 0" class="loading-container">
        <img src="assets/loading.svg" alt="loading" class="movie-loading" />
      </div>
      <div *ngIf="movies.length > 0" class="movie-results">
        <app-movie-card
          *ngFor="let movie of movies"
          [movie]="movie"
          (onClick)="handleMovieClick($event)"
        />
      </div>
      <div
        *ngIf="movies.length > 0 && !searchQuery && !reachedEnd"
        class="load-more-trigger"
        #loadMoreTrigger
        aria-hidden="true"
      ></div>
      <div *ngIf="loadingMore" class="loading-more">
        <img src="assets/loading.svg" alt="loading more movies" class="loading-more-img" />
      </div>
    </div>
  `
})
export class MoviesSectionComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('loadMoreTrigger')
  set loadMoreTrigger(trigger: ElementRef<HTMLElement> | undefined) {
    if (trigger) {
      this.observeLoadMoreTrigger(trigger.nativeElement);
    }
  }

  movies: any[] = [];
  loading = false;
  loadingMore = false;
  reachedEnd = false;
  totalPages = 1;
  currentPage = 0;
  searchQuery = '';
  private readonly apiPageSize = 40;
  private loadMoreObserver?: IntersectionObserver;
  private scrollContainer?: HTMLElement;
  private readonly handleScroll = (): void => {
    this.loadNextMovieBatchIfNearBottom();
  };

  constructor(
    private movieService: MovieService,
    private searchService: SearchService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private host: ElementRef<HTMLElement>
  ) {}

  ngOnInit(): void {
    this.movieService.fetchTotalPages().subscribe({
      next: (pages) => {
        this.totalPages = Math.max(1, Math.floor(Number(pages) || 1));
        if (!this.searchQuery && this.movies.length === 0 && !this.loading && !this.loadingMore) {
          this.resetMovies();
        } else if (!this.searchQuery) {
          this.reachedEnd = this.currentPage >= this.totalPages;
        }
      },
      error: (error) => {
        console.error('Error fetching total pages:', error);
      }
    });

    this.searchService.searchQuery$.subscribe((query) => {
      this.searchQuery = query;
      this.resetMovies();
    });
    // searchQuery$ (BehaviorSubject) emits '' immediately on subscribe, triggering loadMovies()
  }

  ngAfterViewInit(): void {
    this.scrollContainer =
      (this.host.nativeElement.closest('.scrollable') as HTMLElement | null) || undefined;
    this.scrollContainer?.addEventListener('scroll', this.handleScroll, { passive: true });
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    this.loadMoreObserver?.disconnect();
    this.scrollContainer?.removeEventListener('scroll', this.handleScroll);
  }

  private normalizeMovies(data: any): any[] {
    if (Array.isArray(data)) {
      return data;
    }

    return data?.results || [];
  }

  private resetMovies(): void {
    this.movies = [];
    this.currentPage = 0;
    this.reachedEnd = false;
    this.loadMovies();
  }

  private observeLoadMoreTrigger(element: HTMLElement): void {
    this.loadMoreObserver?.disconnect();
    this.loadMoreObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          this.loadNextMovieBatch();
        }
      },
      { root: null, rootMargin: '700px 0px', threshold: 0.01 }
    );
    this.loadMoreObserver.observe(element);
  }

  private loadNextMovieBatchIfNearBottom(): void {
    if (!this.scrollContainer) {
      return;
    }

    const remainingScroll =
      this.scrollContainer.scrollHeight -
      this.scrollContainer.scrollTop -
      this.scrollContainer.clientHeight;

    if (remainingScroll < 900) {
      this.loadNextMovieBatch();
    }
  }

  private loadMovies(): void {
    this.loading = true;
    if (!this.searchQuery) {
      this.loadNextMovieBatch();
    } else {
      this.movieService
        .fetchMovies(this.searchQuery)
        .pipe(finalize(() => {
          this.loading = false;
          this.reachedEnd = true;
          this.cdr.detectChanges();
        }))
        .subscribe({
          next: (data) => {
            this.movies = this.normalizeMovies(data);
            this.cdr.detectChanges();
          },
          error: (error) => {
            console.error('Error fetching movies:', error);
            this.movies = [];
          }
        });
    }
  }

  private loadNextMovieBatch(): void {
    if (this.searchQuery || this.loadingMore || this.reachedEnd) {
      return;
    }

    const nextPage = this.currentPage + 1;
    const isInitialLoad = this.movies.length === 0;
    this.loading = isInitialLoad;
    this.loadingMore = !isInitialLoad;

    if (nextPage > this.totalPages) {
      this.loading = false;
      this.loadingMore = false;
      this.reachedEnd = true;
      return;
    }

    this.movieService.fetchMoviesWithPage(nextPage)
      .pipe(finalize(() => {
        this.loading = false;
        this.loadingMore = false;
        this.cdr.detectChanges();
      }))
      .subscribe({
        next: (data) => {
          const nextMovies = this.normalizeMovies(data);
          const existingIds = new Set(this.movies.map((movie) => movie.id));
          this.movies = [
            ...this.movies,
            ...nextMovies.filter((movie) => !existingIds.has(movie.id))
          ];
          this.currentPage = nextPage;
          this.reachedEnd = this.currentPage >= this.totalPages;
          this.cdr.detectChanges();
          setTimeout(() => this.loadNextMovieBatchIfNearBottom());
        },
        error: (error) => {
          console.error('Error fetching movies:', error);
          this.reachedEnd = true;
        }
      });
  }

  handleMovieClick(movie: any): void {
    this.router.navigate(['/movies', movie.id]);
  }

}

