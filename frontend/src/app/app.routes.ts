import { inject } from '@angular/core';
import { CanActivateFn, Router, Routes } from '@angular/router';

import { AuthService } from '@core/auth';
import { authGuard, guestGuard } from '@core/guards/auth.guard';

// TODO : refactoriser dans core/guards/admin.guard.ts
const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (authService.currentUser()?.role === 'admin') {
    return true;
  }
  return router.createUrlTree(['/dashboard/recipes']); // Redirige ailleurs si pas admin
};

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
            },
            {
                path: 'profile',
                loadComponent: () => import('@features/account/account').then(m => m.AccountComponent)
            },
            {
                path: 'members',
                canActivate: [adminGuard], // <-- Sécurisation Front-end !
                loadComponent: () => import('@features/member/page/member-list/member-list').then(m => m.MemberList)
            },
            {
                path: 'members/detail/:id',
                canActivate: [adminGuard],
                loadComponent: () => import('@features/member/page/member-detail/member-detail').then(m => m.MemberDetail)
            },
        ]
    },
    {
        path: '**',
        redirectTo: 'login' // Fallback si la route n'existe pas
    }
];
