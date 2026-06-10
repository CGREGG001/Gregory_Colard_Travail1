import { Injectable, signal, inject, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, map, Observable } from 'rxjs';
import { AuthResponse, User, ApiResponse, RegisterPayload } from '@core/models/api.model';
import { environment } from '@env/environment';


@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  
  // --- In-Memory State ---
  // The access token is ONLY in memory (safe from XSS)
  private _accessToken = signal<string | null>(null);

  currentUser = signal<User | null>(null);

  /**
   * Indicates whether the user is currently authenticated.
   *
   * This computed signal returns `true` when an access token
   * is present in memory, and `false` otherwise.
   *
   * It automatically updates whenever the access token changes.
   */
  isAuthenticated = computed(() => {
    const token = this._accessToken();
    return token !== null && token !== '';
  });

  /**
   * Returns the current access token.
   */
  get accessToken() {
    return this._accessToken();
  }

  /**
   * Login method.
   * Note: 'withCredentials: true' is mandatory to receive/send cookies.
   */
  login(credentials: any): Observable<AuthResponse> {
    return this.http.post<ApiResponse<AuthResponse>>(
      `${environment.apiUrl}/auth/signin`, 
      credentials,
      { withCredentials: true } 
    ).pipe(
      map(res => res.data),
      tap(data => {
        this._accessToken.set(data.accessToken);
        this.currentUser.set(data.user);
      })
    );
  }

  /**
   * Registers a new user.
   * @param payload - The user registration data.
   * @returns An observable of the API response containing the created User.
   */
  register(payload: RegisterPayload): Observable<ApiResponse<User>> {
    return this.http.post<ApiResponse<User>>(
      `${environment.apiUrl}/auth/signup`, 
      payload
    );
  }

  /**
   * Request a new access token using the HttpOnly Refresh Cookie.
   */
  refresh(): Observable<AuthResponse> {
    return this.http.post<ApiResponse<AuthResponse>>(
      `${environment.apiUrl}/auth/refresh`, 
      {}, 
      { withCredentials: true }
    ).pipe(
      map(res => res.data),
      tap(data => {
        this._accessToken.set(data.accessToken);
        this.currentUser.set(data.user);
      })
    );
  }

  logout(): void {
    this.http.post(`${environment.apiUrl}/auth/logout`, {}, { withCredentials: true }).subscribe();
    this._accessToken.set(null);
    this.currentUser.set(null);
  }
}
