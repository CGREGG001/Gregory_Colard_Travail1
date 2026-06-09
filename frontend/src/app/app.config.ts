import { 
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

import { AuthService } from '@core/auth/auth.service';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from '@core/interceptors/auth.interceptor';

/**
 * Factory function to refresh the token during app initialization.
 * This prevents losing the session on page refresh (F5).
 */
function initializeApp() {
  const authService = inject(AuthService);

  return authService.refresh().pipe(
    catchError(() => of(null))
  );
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAppInitializer(initializeApp),
  ]
};
