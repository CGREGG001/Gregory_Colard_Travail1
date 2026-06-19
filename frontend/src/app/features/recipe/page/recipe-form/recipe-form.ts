import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { finalize } from 'rxjs';
import { RecipeService } from '@features/recipe/service';

@Component({
  selector: 'app-recipe-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './recipe-form.html',
  styleUrl: './recipe-form.scss'
})
export class RecipeForm {
  private fb = inject(FormBuilder);
  private recipeService = inject(RecipeService);
  private router = inject(Router);

  // --- State (SIGNALS) ---
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  // Contrôle séparé pour l'input d'ajout d'ingrédient
  newIngredientControl = new FormControl('');

  // --- FORM ---
  recipeForm = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(150)]],
    description: ['', [Validators.required]],
    preparationTime: [15, [Validators.required, Validators.min(1)]],
    // FormArray pour gérer une liste dynamique de chaînes
    ingredients: this.fb.array<FormControl<string | null>>([]) 
  });

  // Getter pratique pour le template
  get ingredientsArray() {
    return this.recipeForm.get('ingredients') as FormArray;
  }

  // --- GESTION DES INGRÉDIENTS ---
  addIngredient() {
    const value = this.newIngredientControl.value?.trim();
    if (value) {
      this.ingredientsArray.push(new FormControl(value, Validators.required));
      this.newIngredientControl.reset();
    }
  }

  removeIngredient(index: number) {
    this.ingredientsArray.removeAt(index);
  }

  // Permet d'ajouter en appuyant sur "Entrée" dans l'input d'ingrédient
  onIngredientKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault(); // Empêche la soumission globale du formulaire
      this.addIngredient();
    }
  }

  // --- SOUMISSION ---
  onSubmit() {
    if (this.recipeForm.invalid) {
      this.recipeForm.markAllAsTouched();
      if (this.ingredientsArray.length === 0) {
        this.errorMessage.set('Veuillez ajouter au moins un ingrédient.');
      }
      return;
    }

    if (this.ingredientsArray.length === 0) {
      this.errorMessage.set('Veuillez ajouter au moins un ingrédient.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const payload = this.recipeForm.getRawValue() as any;

    this.recipeService.create(payload)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: () => {
          this.router.navigate(['/dashboard/recipes']);
        },
        error: (err) => {
          this.errorMessage.set(err.message || 'Erreur lors de la création de la recette.');
        }
      });
  }
}
