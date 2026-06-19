import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { AuthService } from '@core/auth/auth.service';
import { RecipeService } from '@features/recipe/service/recipe.service';

@Component({
  selector: 'app-recipe-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './recipe-list.html',
  styleUrl: './recipe-list.scss'
})
export class RecipeListComponent implements OnInit {
  public recipeService = inject(RecipeService);
  public authService = inject(AuthService);

  ngOnInit(): void {
    this.recipeService.loadAll().subscribe();
  }

  onDelete(id: string): void {
    if (confirm('Voulez-vous vraiment supprimer cette recette ?')) {
      this.recipeService.delete(id).subscribe({
        next: () => console.log('Recette supprimée de la DB et du Signal !'),
        error: (err) => console.error('Erreur lors de la suppression', err)
      });
    }
  }
}
