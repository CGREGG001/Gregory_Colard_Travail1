import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ErrorHandlerService } from '@core/errors/error-handler.service';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const errorHandler = inject(ErrorHandlerService);

  return next(req).pipe(
    // On intercepte les erreurs HTTP
    catchError((err) => {
      const message = errorHandler.extractMessage(err);

      // On renvoie une erreur propre avec un message lisible
      return throwError(() => ({
        ...err,
        friendlyMessage: message
      }));
    })
  );
};
