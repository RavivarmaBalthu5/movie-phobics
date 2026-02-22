import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private searchQuerySubject = new BehaviorSubject<string>('');
  private isSearchVisibleSubject = new BehaviorSubject<boolean>(false);

  public searchQuery$ = this.searchQuerySubject.asObservable();
  public isSearchVisible$ = this.isSearchVisibleSubject.asObservable();

  setSearchQuery(query: string): void {
    this.searchQuerySubject.next(query);
  }

  getSearchQuery(): string {
    return this.searchQuerySubject.value;
  }

  toggleSearchVisibility(): void {
    this.isSearchVisibleSubject.next(!this.isSearchVisibleSubject.value);
  }

  setSearchVisibility(visible: boolean): void {
    this.isSearchVisibleSubject.next(visible);
  }

  isSearchVisible(): boolean {
    return this.isSearchVisibleSubject.value;
  }
}

