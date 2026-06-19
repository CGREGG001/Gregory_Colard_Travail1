import { Routes } from '@angular/router';

export const recipeRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./page/recipe-list/recipe-list').then(m => m.RecipeListComponent)
    },
    {
        path: 'create',
        loadComponent: () => import('./page/recipe-form/recipe-form').then(m => m.RecipeForm)
    },
    {
        path: 'detail/:id', // Correspond au @Input() id!: string;
        loadComponent: () => import('./page/recipe-detail/recipe-detail').then(m => m.RecipeDetail)
    },
];
