import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '@env/environment';
import { ApiResponse } from '@core/models/api.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseURL: string = environment.apiUrl;
  private readonly http: HttpClient = inject(HttpClient);

  /**
   * Wrapper for HTTP GET
   */
  get<T>(partURL: string): Observable<ApiResponse<T>> {
    return this.handle(this.http.get(`${this.baseURL}${partURL}`, { withCredentials: true }));
  }

  /**
   * Wrapper for HTTP POST
   */
  post<T>(partURL: string, payload: any): Observable<ApiResponse<T>> {
    return this.handle(this.http.post(`${this.baseURL}${partURL}`, payload, { withCredentials: true }));
  }

  /**
   * Wrapper for HTTP PUT
   */
  put<T>(partURL: string, payload: any): Observable<ApiResponse<T>> {
    return this.handle(this.http.put(`${this.baseURL}${partURL}`, payload, { withCredentials: true }));
  }

  /**
   * Wrapper for HTTP DELETE
   */
  delete<T>(partURL: string): Observable<ApiResponse<T>> {
    return this.handle(this.http.delete(`${this.baseURL}${partURL}`, { withCredentials: true }));
  }

  /**
   * Centralized mapping and error handling
   */
  private handle<T>(obs: Observable<any>): Observable<ApiResponse<T>> {
    return obs.pipe(
      map((response: Object) => this.successHandler<T>(response as ApiResponse<T>)),
      catchError((error: HttpErrorResponse) => {
        // Le 401 est géré par l'auth.interceptor (Refresh), on le laisse passer
        if (error.status === 401 || error.status === 403) {
           throw error;
        }
        return of(this.errorHandler<T>(error));
      })
    );
  }

  private successHandler<T>(response: any): ApiResponse<T> {
    // Cast and add paramError flag
    return { ...(response as ApiResponse<T>), paramError: false };
  }

  private errorHandler<T>(httpError: HttpErrorResponse): ApiResponse<T> {
    // Si l'erreur est 499 (Validation error)
    return {
      ...(httpError.error as ApiResponse<T>),
      paramError: httpError.status === 499 
    };
  }
}
