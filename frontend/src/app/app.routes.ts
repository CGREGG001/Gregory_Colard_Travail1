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
        path: 'dashboard',
        canActivate: [authGuard],
        loadComponent: () => import('@features/dashboard/dashboard').then(m => m.Dashboard)
    },
    {
        path: '**',
        redirectTo: 'login' // Fallback si la route n'existe pas
    }
];
