import { Component, effect, inject } from '@angular/core';
import { AuthService } from '@core/auth/auth.service';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard {
  public authService = inject(AuthService);
  public router = inject(Router);

  constructor() {
    effect(() => {
      const user = this.authService.currentUser();
      if (user) {
        console.log('Utilisateur connecté au Dashboard :', user.nickname);
      }
    });
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
