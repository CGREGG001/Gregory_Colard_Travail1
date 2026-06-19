import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { RecipeService } from '../../service/recipe.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-recipe-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './recipe-form.html',
  styleUrl: './recipe-form.scss'
})
export class RecipeForm implements OnInit {

  @Input() id?: string; // S'il y a un ID, on est en mode "Edit"

  private fb = inject(FormBuilder);
  private recipeService = inject(RecipeService);
  private router = inject(Router);

  // Signaux pour l'UI
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  isEditMode = signal(false);

  newIngredientControl = new FormControl('');

  // FormGroup typé
  recipeForm = this.fb.group({
    title: new FormControl<string>('', [Validators.required, Validators.maxLength(150)]),
    description: new FormControl<string>('', [Validators.required]),
    preparationTime: new FormControl<number>(15, [Validators.required, Validators.min(1)]),
    ingredients: this.fb.array<FormControl<string | null>>([]) 
  });

  get ingredientsArray() {
    return this.recipeForm.get('ingredients') as FormArray;
  }

  ngOnInit(): void {
    // Si l'Input "id" existe, on passe en mode Édition
    if (this.id) {
      this.isEditMode.set(true);
      this.loadRecipeData(this.id);
    }

    this.recipeForm.valueChanges.subscribe(() => {
      // console.log('formGroupValue', this.recipeForm.value);
    });
  }

  private loadRecipeData(id: string): void {
    this.isLoading.set(true);
    this.recipeService.getById(id)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (recipe) => {
          // On remplit les champs classiques
          this.recipeForm.patchValue({
            title: recipe.title,
            description: recipe.description,
            preparationTime: recipe.preparationTime
          });

          // On remplit le FormArray dynamique pour les ingrédients
          recipe.ingredients.forEach(ing => {
            this.ingredientsArray.push(new FormControl(ing, Validators.required));
          });
        },
        error: () => this.errorMessage.set('Erreur lors du chargement de la recette.')
      });
  }

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

  onIngredientKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.addIngredient();
    }
  }

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

    // Décision de routage de la requête : Create ou Update
    const request$ = this.isEditMode() 
      ? this.recipeService.update(this.id!, payload) 
      : this.recipeService.create(payload);

    request$
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: () => {
          this.router.navigate(['/dashboard/recipes']);
        },
        error: (err) => {
          this.errorMessage.set(err.message || 'Erreur lors de la sauvegarde de la recette.');
        }
      });
  }
}
