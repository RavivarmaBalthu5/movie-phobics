import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { AuthPageComponent } from './components/auth/auth-page.component';
import { MoviesSectionComponent } from './components/movies/movies-section.component';
import { MovieDetailsComponent } from './components/movies/movie-details.component';
import { NotFoundComponent } from './components/common/not-found.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: AuthPageComponent },
      { path: 'movies', component: MoviesSectionComponent, canActivate: [AuthGuard] },
      { path: 'movies/:id', component: MovieDetailsComponent, canActivate: [AuthGuard] },
      { path: '**', component: NotFoundComponent }
    ]
  }
];
