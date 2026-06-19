import { Injectable, inject, signal } from '@angular/core';
import { ApiService } from '@core/api/services/api.service';
import { RecipePayload, RecipeResponse } from '../model/recipe.model';
import { tap, map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RecipeService {
    private api = inject(ApiService);
    private readonly ENDPOINT = '/recipe';

    // --- RECTIVE STATE ---
    recipes = signal<RecipeResponse[]>([]);

    loadAll(): Observable<RecipeResponse[]> {
        return this.api.get<RecipeResponse[]>(this.ENDPOINT).pipe(
            map(res => res.data),
            tap(recipes => this.recipes.set(recipes))
        );
    }

    getById(id: string): Observable<RecipeResponse> {
        return this.api.get<RecipeResponse>(`${this.ENDPOINT}/${id}`).pipe(
            map(res => res.data)
        );
    }

    create(payload: RecipePayload): Observable<RecipeResponse> {
        return this.api.post<RecipeResponse>(this.ENDPOINT, payload).pipe(
            map(res => res.data),
            tap(() => this.loadAll().subscribe())
        );
    }

    update(id: string, payload: RecipePayload): Observable<RecipeResponse> {
        return this.api.put<RecipeResponse>(`${this.ENDPOINT}/${id}`, payload).pipe(
            map(res => res.data),
            tap(() => this.loadAll().subscribe())
        );
    }

    delete(id: string): Observable<any> {
        return this.api.delete(`${this.ENDPOINT}/${id}`).pipe(
            tap(() => {
            this.recipes.update(list => list.filter(r => r.id !== id));
            })
        );
    }
}
