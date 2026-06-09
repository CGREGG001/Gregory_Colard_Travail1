import { 
  ApplicationConfig,
  provideAppInitializer,
  provideZonelessChangeDetection,
  provideBrowserGlobalErrorListeners,
  inject
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { AuthService } from '@core/auth/auth.service';
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';
import { authInterceptor } from '@core/interceptors/auth.interceptor';
import { catchError, of } from 'rxjs';

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
    provideZonelessChangeDetection(), 
    provideHttpClient(withInterceptors([authInterceptor]), withFetch()),
    provideAppInitializer(initializeApp),
  ]
};