import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faSearch,
  faUserCircle,
  faEnvelope,
  faUser,
  faSignOutAlt
} from '@fortawesome/free-solid-svg-icons';
import { SessionService, UserSession } from '../../services/session.service';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, RouterModule],
  template: `
    <header class="header">
      <div class="header-content" (click)="onTitleClick()">
        <img src="assets/moviephobics.png" alt="Movie Phobics" class="logo" />
        <h2>MOVIE PHOBICS</h2>
      </div>
      <div *ngIf="showHeaderActions" class="header-right">
        <fa-icon
          [icon]="faSearch"
          size="2x"
          class="icon"
          (click)="isHomePage ? toggleSearch() : null"
          [style.cursor]="isHomePage ? 'pointer' : 'not-allowed'"
          [style.opacity]="isHomePage ? 1 : 0.5"
        />
        <fa-icon
          [icon]="faUserCircle"
          size="2x"
          class="icon"
          (click)="toggleProfileMenu()"
        />
        <div *ngIf="showProfileMenu && user" class="profile-menu">
          <div class="profile-item">
            <fa-icon [icon]="faEnvelope" class="profile-icon" />
            <span>{{ user.email }}</span>
          </div>
          <div class="profile-item">
            <fa-icon [icon]="faUser" class="profile-icon" />
            <span>{{ user.name || 'User' }}</span>
          </div>
          <div class="profile-item logout" (click)="logout()">
            <fa-icon [icon]="faSignOutAlt" class="profile-icon" />
            <span>Logout</span>
          </div>
        </div>
      </div>
    </header>
  `
})
export class HeaderComponent implements OnInit {
  user: UserSession | null = null;
  showProfileMenu = false;
  isHomePage = false;

  faSearch = faSearch;
  faUserCircle = faUserCircle;
  faEnvelope = faEnvelope;
  faUser = faUser;
  faSignOutAlt = faSignOutAlt;

  constructor(
    private sessionService: SessionService,
    private searchService: SearchService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.updateRouteState();

    this.sessionService.user$.subscribe((user) => {
      this.user = user;
      if (!user) {
        this.showProfileMenu = false;
      }
    });

    this.router.events.subscribe(() => {
      this.updateRouteState();
      this.showProfileMenu = false;
    });
  }

  get showHeaderActions(): boolean {
    return this.router.url !== '/';
  }

  private updateRouteState(): void {
    this.isHomePage = this.router.url === '/movies';
  }

  toggleSearch(): void {
    this.searchService.toggleSearchVisibility();
  }

  toggleProfileMenu(): void {
    this.showProfileMenu = !this.showProfileMenu;
  }

  logout(): void {
    this.sessionService.clearSession();
    this.router.navigate(['/']);
  }

  onTitleClick(): void {
    this.searchService.setSearchQuery('');
    this.router.navigate([this.user ? '/movies' : '/']);
  }
}

