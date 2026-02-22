import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, startWith } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { MovieService } from '../../services/movie.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  template: `
    <footer class="footer">
      <div class="footer-details">
        <p>© 2026 Movie Phobics. {{ version$ | async }}</p>
        <p>
          For any issues, please report here :
          <a [href]="githubIssuesUrl" target="_blank" rel="noreferrer">
            <fa-icon [icon]="faGithub" class="icon" />
          </a>
        </p>
      </div>
    </footer>
  `
})
export class FooterComponent implements OnInit {
  // Define version as an Observable
  version$: Observable<string> | undefined;
  githubIssuesUrl = environment.githubIssuesUrl;
  faGithub = faGithub;

  constructor(private movieService: MovieService) {}

  ngOnInit(): void {
    this.version$ = this.movieService.fetchGitVersion().pipe(
      startWith('1.0.0'), // Sets the initial value
      catchError(err => {
        console.error('Error fetching version:', err);
        return of('1.0.0'); // Fallback on error
      })
    );
  }
}

