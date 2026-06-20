import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { RecipeService } from '../../service/recipe.service';
import { AuthService } from '@core/auth/auth.service';
import { RecipeResponse } from '../../model/recipe.model';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-recipe-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './recipe-detail.html',
  styleUrl: './recipe-detail.scss'
})
export class RecipeDetail implements OnInit {
  
  // Méthode du PDF (Page 39)
  @Input() id!: string;

  private recipeService = inject(RecipeService);
  public authService = inject(AuthService);
  private router = inject(Router);

  recipe = signal<RecipeResponse | null>(null);
  isLoading = signal<boolean>(true);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    // L'id sera bien rempli ici grâce à withComponentInputBinding()
    console.log('ID récupéré via Input :', this.id);
    if (this.id) {
      this.loadRecipe();
    }
  }

  loadRecipe(): void {
    this.isLoading.set(true);
    this.recipeService.getById(this.id)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (data) => this.recipe.set(data),
        error: (err) => this.errorMessage.set('Impossible de charger cette recette.')
      });
  }

  onDelete(): void {
    if (confirm('Voulez-vous vraiment supprimer cette recette ?')) {
      this.recipeService.delete(this.id).subscribe({
        next: () => this.router.navigate(['/dashboard/recipes']),
        error: () => alert('Erreur lors de la suppression.')
      });
    }
  }
}