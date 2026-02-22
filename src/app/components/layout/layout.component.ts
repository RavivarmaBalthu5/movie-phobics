import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { SearchComponent } from '../header/search.component';
import { SearchService } from '../../services/search.service';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    SearchComponent
  ],
  template: `
    <div class="app">
      <app-header />
      <app-search
        *ngIf="isSearchVisible"
        [searchQuery]="searchQuery"
        (searchQueryChange)="onSearchChange($event)"
        (toggleSearch)="toggleSearch()"
      />
      <div class="scrollable">
        <router-outlet />
      </div>
      <app-footer />
    </div>
  `
})
export class LayoutComponent implements OnInit, OnDestroy {
  isSearchVisible = false;
  searchQuery = '';
  private sessionTimeout: any;

  constructor(
    private searchService: SearchService,
    private sessionService: SessionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.searchService.isSearchVisible$.subscribe((visible) => {
      this.isSearchVisible = visible;
    });

    this.searchService.searchQuery$.subscribe((query) => {
      this.searchQuery = query;
    });

    // Handle session timeout redirects
    this.sessionService.sessionTimeout$.subscribe(() => {
      this.router.navigate(['/']);
    });
  }

  toggleSearch(): void {
    this.searchService.toggleSearchVisibility();
  }

  onSearchChange(query: string): void {
    this.searchService.setSearchQuery(query);
  }

  ngOnDestroy(): void {
    if (this.sessionTimeout) {
      clearInterval(this.sessionTimeout);
    }
  }
}

