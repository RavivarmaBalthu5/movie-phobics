import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
  HostListener,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { finalize, forkJoin, of } from 'rxjs';
import { map } from 'rxjs/operators';
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
      <div *ngIf="movies.length > 0" class="movie-results" #movieResults>
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
  @ViewChild('movieResults') movieResults?: ElementRef<HTMLElement>;
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
  private apiPageSize = 20;
  private gridColumnCount = 1;
  private readonly visibleRows = 3;
  private loadMoreObserver?: IntersectionObserver;

  constructor(
    private movieService: MovieService,
    private searchService: SearchService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.gridColumnCount = this.estimateGridColumnCount();

    this.movieService.fetchTotalPages().subscribe({
      next: (pages) => {
        this.totalPages = Math.max(1, Math.floor(Number(pages) || 1));
        if (!this.searchQuery && this.movies.length === 0 && !this.loading && !this.loadingMore) {
          this.resetMovies();
        } else if (!this.searchQuery) {
          this.reachedEnd = this.currentPage >= this.totalVisualPages;
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
    this.updateGridColumnCount();
  }

  ngOnDestroy(): void {
    this.loadMoreObserver?.disconnect();
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    const previousColumnCount = this.gridColumnCount;
    this.updateGridColumnCount();
    if (!this.searchQuery && previousColumnCount !== this.gridColumnCount) {
      this.resetMovies();
    }
  }

  private get visualPageSize(): number {
    return Math.max(this.gridColumnCount * this.visibleRows, this.gridColumnCount);
  }

  get totalVisualPages(): number {
    return Math.max(1, Math.ceil((this.totalPages * this.apiPageSize) / this.visualPageSize));
  }

  private updateGridColumnCount(): void {
    if (!this.movieResults?.nativeElement) {
      this.gridColumnCount = this.estimateGridColumnCount();
      return;
    }

    const columns = getComputedStyle(this.movieResults.nativeElement)
      .gridTemplateColumns
      .split(' ')
      .filter(Boolean).length;
    this.gridColumnCount = Math.max(1, columns);
  }

  private estimateGridColumnCount(): number {
    const viewportWidth = typeof window !== 'undefined' ? window.innerWidth || 1200 : 1200;
    const availableWidth = Math.max(0, Math.min(viewportWidth, 1780) - 56);
    const minCardWidth = Math.min(Math.max(viewportWidth * 0.1, 170), 210);
    return Math.max(1, Math.floor((availableWidth + 20) / (minCardWidth + 20)));
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

    const nextVisualPage = this.currentPage + 1;
    const isInitialLoad = this.movies.length === 0;
    this.loading = isInitialLoad;
    this.loadingMore = !isInitialLoad;

    const visualStartIndex = (nextVisualPage - 1) * this.visualPageSize;
    const firstApiPage = Math.floor(visualStartIndex / this.apiPageSize) + 1;
    const startOffset = visualStartIndex % this.apiPageSize;
    const apiPagesNeeded = Math.ceil((startOffset + this.visualPageSize) / this.apiPageSize);
    const pageRequests = Array.from({ length: apiPagesNeeded }, (_, index) => {
      const page = firstApiPage + index;
      return page <= this.totalPages ? this.movieService.fetchMoviesWithPage(page) : of({ results: [] });
    });

    forkJoin(pageRequests)
      .pipe(
        map((pages) => pages.flatMap((page) => this.normalizeMovies(page))),
        finalize(() => {
          this.loading = false;
          this.loadingMore = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (movies) => {
          const nextMovies = movies.slice(startOffset, startOffset + this.visualPageSize);
          const existingIds = new Set(this.movies.map((movie) => movie.id));
          this.movies = [
            ...this.movies,
            ...nextMovies.filter((movie) => !existingIds.has(movie.id))
          ];
          this.currentPage = nextVisualPage;
          this.reachedEnd = this.currentPage >= this.totalVisualPages || nextMovies.length === 0;
          this.cdr.detectChanges();
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

