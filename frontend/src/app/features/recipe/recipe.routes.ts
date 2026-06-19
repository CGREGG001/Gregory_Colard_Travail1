import { Routes } from '@angular/router';

export const recipeRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./page/recipe-list/recipe-list').then(m => m.RecipeListComponent)
    },
];
