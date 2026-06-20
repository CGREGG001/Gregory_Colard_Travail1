import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';

import { ApiService } from '@core/api';
import { User } from '@core/models';

@Injectable({ providedIn: 'root' })
export class MemberService {
  private api = inject(ApiService);
  private readonly ENDPOINT = '/member';

  /**
   * Retrieves all members (Admin only).
   */
  getAllMembers(): Observable<User[]> {
    return this.api.get<User[]>(this.ENDPOINT).pipe(
        map(res => res.data)
    );
  }

  /**
   * Retrieves a member by id (Admin only).
   */
  getMemberById(id: string): Observable<User> {
    return this.api.get<User>(`${this.ENDPOINT}/${id}`).pipe(
        map(res => res.data)
    );
  }

  /**
   * Updates a member's details or role (Admin only).
   */
  updateMember(id: string, payload: Partial<User>): Observable<User> {
    return this.api.put<User>(`${this.ENDPOINT}/${id}`, payload).pipe(
        map(res => res.data)
    );
  }

  /**
   * Soft deletes a member (Admin only).
   */
  deleteMember(id: string): Observable<void> {
    return this.api.delete<void>(`${this.ENDPOINT}/${id}`).pipe(
        map(() => void 0)
    );
  }
}
