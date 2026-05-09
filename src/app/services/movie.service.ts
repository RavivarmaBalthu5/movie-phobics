import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, shareReplay, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private cache: Map<string, any> = new Map();
  private cachedObservables: Map<string, Observable<any>> = new Map();
  private cacheExpiry: Map<string, number> = new Map();
  private cacheDuration = 300000; // 5 minutes in milliseconds

  constructor(private http: HttpClient) {}

  private getApiUrl(): string {
    return environment.netlifyApiUrl;
  }

  private isCacheValid(key: string): boolean {
    const expiry = this.cacheExpiry.get(key);
    if (!expiry) return false;
    return Date.now() < expiry;
  }

  private getFromCache<T>(key: string): T | null {
    if (this.isCacheValid(key)) {
      return this.cache.get(key);
    } else {
      this.cache.delete(key);
      this.cacheExpiry.delete(key);
      return null;
    }
  }

  private setCache(key: string, value: any): void {
    this.cache.set(key, value);
    this.cacheExpiry.set(key, Date.now() + this.cacheDuration);
  }

  fetchMovies(query: string): Observable<any> {
    const cacheKey = `movies:${query}`;

    const cached = this.getFromCache(cacheKey);
    if (cached) {
      return of(cached);
    }

    const cachedObs = this.cachedObservables.get(cacheKey);
    if (cachedObs) {
      return cachedObs;
    }

    const url = `${this.getApiUrl()}?movie=${encodeURIComponent(query)}`;
    const obs = this.http.get<any>(url).pipe(
      tap((data) => {
        this.setCache(cacheKey, data);
      }),
      shareReplay(1),
      catchError((error) => {
        console.error('Error fetching movies:', error);
        return of({ results: [] });
      })
    );

    this.cachedObservables.set(cacheKey, obs);
    setTimeout(() => this.cachedObservables.delete(cacheKey), this.cacheDuration);

    return obs;
  }

  fetchMoviesWithPage(pageNumber: number): Observable<any> {
    const cacheKey = `moviesWithPage:${pageNumber}`;

    const cached = this.getFromCache(cacheKey);
    if (cached) {
      return of(cached);
    }

    const cachedObs = this.cachedObservables.get(cacheKey);
    if (cachedObs) {
      return cachedObs;
    }

    const url = `${this.getApiUrl()}?now_playing_current_page=${encodeURIComponent(
      pageNumber.toString()
    )}`;
    const obs = this.http.get<any>(url).pipe(
      tap((data) => {
        this.setCache(cacheKey, data);
      }),
      shareReplay(1),
      catchError((error) => {
        console.error('Error fetching all movies:', error);
        return of({ results: [] });
      })
    );

    this.cachedObservables.set(cacheKey, obs);
    setTimeout(() => this.cachedObservables.delete(cacheKey), this.cacheDuration);

    return obs;
  }

  fetchTotalPages(): Observable<number> {
    const cacheKey = 'totalPages';

    const cached = this.getFromCache<number>(cacheKey);
    if (cached) {
      return of(cached);
    }

    const cachedObs = this.cachedObservables.get(cacheKey);
    if (cachedObs) {
      return cachedObs;
    }

    const url = `${this.getApiUrl()}?now_playing_total_pages=true`;
    const obs = this.http.get<number>(url).pipe(
      tap((data) => this.setCache(cacheKey, data)),
      shareReplay(1),
      catchError((error) => {
        console.error('Error fetching total pages:', error);
        return of(1);
      })
    );

    this.cachedObservables.set(cacheKey, obs);
    setTimeout(() => this.cachedObservables.delete(cacheKey), this.cacheDuration);

    return obs;
  }

  fetchVideos(movieId: string | number): Observable<any> {
    const url = `${this.getApiUrl()}?trailer=${encodeURIComponent(movieId.toString())}`;
    return this.http.get<any>(url).pipe(
      catchError((error) => {
        console.error('Error fetching videos:', error);
        return of({ results: [] });
      })
    );
  }

  fetchMovieDetail(movieId: string | number): Observable<any> {
    const url = `${this.getApiUrl()}?movieId=${encodeURIComponent(movieId.toString())}`;
    return this.http.get<any[]>(url).pipe(
      tap((data: any[]) => {
        if (Array.isArray(data) && data.length > 0) {
          return data[0];
        }
      }),
      catchError((error) => {
        console.error('Error fetching movie:', error);
        return of({});
      })
    );
  }

  fetchGitVersion(): Observable<string> {
    const cacheKey = 'gitVersion';

    const cached = this.getFromCache<string>(cacheKey);
    if (cached) {
      return of(cached);
    }

    const cachedObs = this.cachedObservables.get(cacheKey);
    if (cachedObs) {
      return cachedObs;
    }

    const obs = this.http.get<any>(environment.githubUrl).pipe(
      map((data) => data?.tag_name || 'v1.0.0'),
      tap((version) => this.setCache(cacheKey, version)),
      shareReplay(1),
      catchError((error) => {
        console.error('Error fetching git version:', error);
        return of('v1.0.0');
      })
    );

    this.cachedObservables.set(cacheKey, obs);
    setTimeout(() => this.cachedObservables.delete(cacheKey), this.cacheDuration);

    return obs;
  }
}

