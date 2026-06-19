import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';

import { User } from '@core/models';
import { ApiService } from '@core/api';

/**
 * Service handling operations related to the currently authenticated user's account.
 */
@Injectable({ providedIn: 'root' })
export class AccountService {
    private api = inject(ApiService);
    private readonly ENDPOINT = '/account';

    /**
     * Retrieves the profile of the currently authenticated user.
     */
    getMe(): Observable<User> {
        return this.api.get<User>(`${this.ENDPOINT}/me`).pipe(
            map(res => res.data)
        );
    }

    /**
     * Updates the profile of the currently authenticated user.
     * @param payload - Partial user data (email, nickname).
     */
    updateMe(payload: Partial<User>): Observable<User> {
        return this.api.put<User>(`${this.ENDPOINT}/me`, payload).pipe(
            map(res => res.data)
        );
    }
}
