import { Injectable } from '@angular/core';
import { ApiError } from './api-error.model';
import { ERROR_MAP } from './api-error-map';

@Injectable({ providedIn: 'root' })
export class ErrorHandlerService {

  extractMessage(err: ApiError): string {
    const code : string = String (
      err.error?.code ||
      err.error?.message ||
      err.code ||
      err.message ||
      ''
    );

    return ERROR_MAP[code] ?? 'Une erreur est survenue.';
  }
}
