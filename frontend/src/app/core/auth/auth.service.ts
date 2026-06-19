import { Injectable, signal, inject, computed } from '@angular/core';
import { tap, map, Observable } from 'rxjs';
import { AuthResponse, User, ApiResponse, RegisterPayload } from '@core/models/api.model';
import { ApiService } from '@api/services';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = inject(ApiService);
  
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
    return this.api.post<AuthResponse>(`/auth/signin`, credentials 
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
    return this.api.post<User>(`/auth/signup`, payload);
  }

  /**
   * Request a new access token using the HttpOnly Refresh Cookie.
   */
  refresh(): Observable<AuthResponse> {
    return this.api.post<AuthResponse>(`/auth/refresh`, {} 
    ).pipe(
      map(res => res.data),
      tap(data => {
        this._accessToken.set(data.accessToken);
        this.currentUser.set(data.user);
      })
    );
  }

  logout(): void {
    this.api.post(`/auth/logout`, {}).subscribe();
    
    this._accessToken.set(null);
    this.currentUser.set(null);
  }
}
