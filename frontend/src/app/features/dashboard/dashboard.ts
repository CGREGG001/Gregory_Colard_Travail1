import { Component, signal, inject } from '@angular/core';
import { AuthService } from '@core/auth/auth.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard {
  private authService = inject(AuthService);
  private router = inject(Router);
  
  // Exemple avec Signaux pour la liste
  recipes = signal([
    { id: '1', title: 'Recette aux figues', description: 'Une merveille...' },
    { id: '2', title: 'Toast au jambon', description: 'Le classique.' }
  ]);

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
  
  addRecipe() { /* Logique d'ajout */ }
  editRecipe(id: string) { /* Logique d'update */}
  deleteRecipe(id: string) { /* Logique de suppression */ }
}
