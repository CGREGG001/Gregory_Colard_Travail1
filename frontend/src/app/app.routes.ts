import { Routes } from '@angular/router';
import { authGuard, guestGuard } from '@core/guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        canActivate: [guestGuard],
        loadComponent: () => import('@features/auth/login/login').then(m => m.Login)
    },
    {
        path: 'register',
        canActivate: [guestGuard],
        loadComponent: () => import('@features/auth/register/register').then(m => m.Register)
    },
    {
        path: 'dashboard',
        canActivate: [authGuard],
        loadComponent: () => import('@features/dashboard/dashboard').then(m => m.Dashboard),
        children: [
            {
                path: 'recipes',
                loadChildren: () => import('@features/recipe/recipe.routes').then(m => m.recipeRoutes)
            },
            {
                path: '',
                redirectTo: 'recipes',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: '**',
        redirectTo: 'login' // Fallback si la route n'existe pas
    }
];
